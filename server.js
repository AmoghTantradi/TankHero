const PORT = process.env.PORT || 3000
const FRAME_RATE = 1000 / 60 //60 fps


//Dependencies
const express = require('express');//helps build webserver
const http = require('http');//helps build webserver
const path = require('path');
const socketIO = require('socket.io');//handles websockets on the server


//game dependencies
const Engine = require('./server/Engine')

//initializing components 
const app = express()
const server = http.Server(app)
const io = socketIO(server)
const game = new Engine()

app.set('port',PORT)
app.use('/static', express.static(__dirname + '/static')) //serves static folder not created yet



//Routing
app.get('/', (request,res) => {
	res.sendFile(path.join(__dirname,'static/index.html')) //serves the index.html file created
})


//adding websocket handlers

io.on('connection',(socket)=>{
	console.log('succesfully connected!')


	socket.on('new-player',(data)=>{
		game.createPlayer(socket, data.name) 
	})

	socket.on('movement', (data) =>{
		if(game.gameState === 0){
			socket.emit('msg', 'sorry but the game has not yet begun. Please wait for more players to join')
		}
		else {
			game.updatePlayerMovement(socket, data)
		}
	})
	
})


let last = (new Date()).getTime()

let sum = 0 

let count = 0

setInterval(()=>{  //we have to update the bullets and also handle the logic if a tank gets hit by a bullet 
	
	const current = (new Date()).getTime()

	const dT = current - last

	last = current

	sum += dT

	
	if(Math.abs(sum - 1000) < dT) {
		console.log('sum', sum, 'frames', count)
		sum = 0 
		count = 0
	}

	if(game.gameState === 1){
		io.sockets.emit('state', Object.fromEntries(game.players))
	}
	

	game.update()



	count++

//this is where big (O) complexity comes into play: we have to delete the bullets that are outside of the frame
}, FRAME_RATE)



//starting server

server.listen(PORT, ()=>{
	console.log('Starting server on port',PORT)
})

