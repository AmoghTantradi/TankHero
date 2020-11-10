//Dependencies
const express = require('express')//helps build webserver
const http = require('http')//helps build webserver
const path = require('path')
const socketIO = require('socket.io')//handles websockets on the server

//game dependencies
const Engine = require('./server/Engine')

//lib dependencies
const Constants = require('./lib/Constants')
const fromEntries = require('./lib/util')

//initializing components 
const app = express()
const server = http.Server(app)
const io = socketIO(server)
const game = new Engine()


const PORT = process.env.PORT || Constants.PORT
const FRAME_RATE = 1000 / Constants.FPS //60 fps



app.set('port',PORT)
app.use('/client', express.static(__dirname + '/client')) //serves static folder not created yet
app.use('/dist', express.static(path.join(__dirname, '/dist')))

//Routing
app.get('/', (request,res) => {
	res.sendFile(path.join(__dirname,'views/index.html')) //serves the index.html file created
})


//adding websocket handlers

io.on(Constants.SOCKET_CONNECT,(socket)=>{
	console.log('succesfully connected!')
	
	socket.on(Constants.SOCKET_NEW_PLAYER,(data)=>{
		game.createPlayer(socket, data.name) 
	})

	socket.on(Constants.SOCKET_MOVEMENT, (data) =>{
		if(game.gameState === 0){
			socket.emit(Constants.SOCKET_MSG, 'Sorry but the game has not yet begun. Please refresh your browser and  wait for more players to join.')
		}
		else {
			game.updatePlayerMovement(socket, data)
		}
	})

	socket.on(Constants.SOCKET_DISCONNECT, ()=>{
		game.removePlayer(socket)
	})
	
})


let last = Date.now()

let sum = 0 

let count = 0

setInterval(()=>{  //we have to update the bullets and also handle the logic if a tank gets hit by a bullet 
	
	const current = Date.now()

	const dT = current - last

	last = current

	sum += dT

	if(Math.abs(sum - 1000) < dT) {
		console.log('sum', sum, 'frames', count)
		sum = 0 
		count = 0
	}

	if(game.gameState === 1){
		io.sockets.emit(Constants.SOCKET_STATE, {
			players:fromEntries(game.players), 
			checkpoints:game.manager.checkpoints
		})
	}
	
	game.update(io.sockets)
	count++

//this is where big (O) complexity comes into play: we have to delete the bullets that are outside of the frame
}, FRAME_RATE)

//starting server
server.listen(PORT, ()=>{
	console.log('Starting server on port',PORT)
})

