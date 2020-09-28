const express = require('express');//helps build webserver
const http = require('http');//helps build webserver
const path = require('path');
const socketIO = require('socket.io');//handles websockets on the server
const Tank = require('./Tank')
const Bullet = require('./Bullet')

const app = express()

const server = http.Server(app)

const io = socketIO(server)

app.set('port',3000)

app.use('/static', express.static(__dirname + '/static')) //serves static folder not created yet

app.get('/', (request,res) => {
	res.sendFile(path.join(__dirname,'/static/index.html')) //serves the index.html file created
})

server.listen(3000, ()=>{
	console.log('Starting server on port 3000')
})



//adding websocket handlers
let players = {}

io.on('connection',(socket)=>{
	console.log('succesfully connected!\n')
	socket.on('new player',()=>{
		players[socket.id] = new Tank()
	})

	socket.on('movement', (data) =>{
		let player = players[socket.id] || {}
		if(data.forward){//w key 
			player.x += player.speed*Math.cos(player.theta * Math.PI/180.0)
			player.y += player.speed*Math.sin(player.theta*Math.PI/180.0)
		}
		if(data.back){//s key 
			player.x -= player.speed*Math.cos(player.theta * Math.PI/180.0)
			player.y -= player.speed*Math.sin(player.theta*Math.PI/180.0)
		}
		if(data.turnLeft){// a key 
			player.theta -= player.dTheta
			player.theta %= 360
		}
		if(data.turnRight){// d key 
			player.theta += player.dTheta
			player.theta %= 360
		}
		if(data.turnTurretLeft){//left arrow key 
			player.turret.theta -= player.turret.dTheta
			player.turret.theta %= 360
		}
		if(data.turnTurretRight){//right arrow key 
			player.turret.theta += player.turret.dTheta
			player.turret.theta %= 360
		}
		if(data.shoot){
			//we need to add a bullet into the chamber of the turret
			player.turret.active.push(new Bullet(
				player.x + player.width/2,
				player.y + player.height / 2,
				player.turret.theta+player.theta
			  ))
		}
	})
})


let last = (new Date()).getTime()

setInterval(()=>{
	let current = (new Date()).getTime()
	let dT = current - last

	for(id in players){
		const player = players[id]
		
		for(let i = 0 ; i < player.turret.active.length; i++){
			player.turret.active[i].x += player.turret.active[i].speed*Math.cos(player.turret.active[i].theta *Math.PI/180.0)
			player.turret.active[i].y += player.turret.active[i].speed*Math.sin(player.turret.active[i].theta *Math.PI/180.0)
		}



	}

	last = current



}, 1000/60)

setInterval(()=>{
	io.sockets.emit('state', players)
}, 1000/60)
//this makes sure that the players are updated 60 times a second (so it's 60 fps)



