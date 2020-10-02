const PORT = process.env.PORT || 3000
const FRAME_RATE = 1000/60 //60 fps





//Dependencies
const express = require('express');//helps build webserver
const http = require('http');//helps build webserver
const path = require('path');
const socketIO = require('socket.io');//handles websockets on the server



const Tank = require('./Tank')
const Bullet = require('./Bullet')
const hitbox = require('./Hitbox')

//initializing components 
const app = express()
const server = http.Server(app)
const io = socketIO(server)


app.set('port',PORT)

app.use('/static', express.static(__dirname + '/static')) //serves static folder not created yet


//Routing
app.get('/', (request,res) => {
	res.sendFile(path.join(__dirname,'/static/index.html')) //serves the index.html file created
})


//adding websocket handlers
//stores the tanks and also keeps count of the number of allied tanks and the number of axis tanks
//also keeps track of the number of 
const gameData = {allied:0,axis:0, max: 4}
//stores the players
const players = {} 

io.on('connection',(socket)=>{
	console.log('succesfully connected!')


	socket.on('new player',()=>{
		if(gameData.allied + gameData.axis < gameData.max){	//	if(players{
			if(gameData.allied <= gameData.axis){
				players[socket.id] = new Tank (400,450,'black','grey')
				gameData.allied++
			}
			else{
				players[socket.id] = new Tank(400,150,'brown','green') 
				gameData.axis++
			}
		}
		else{
			console.log('Sorry there are too many players')
		}
	})

	socket.on('movement', (data) =>{
		let player = players[socket.id] || {}
		if(data.forward){//w key 
			player.centerX += player.speed*Math.cos(player.theta*Math.PI/180.0)
			player.centerY += player.speed*Math.sin(player.theta*Math.PI/180.0)
		}
		if(data.back){//s key 
			player.centerX -= player.speed*Math.cos(player.theta*Math.PI/180.0)
			player.centerY -= player.speed*Math.sin(player.theta*Math.PI/180.0)
		}
		if(data.turnLeft){// a key 
			//update x,y coordinates in rotation math
			player.theta -= player.dTheta
			player.theta %= 360
		}
		if(data.turnRight){// d key 
			//update x,y coordinates with rotation math
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
			//here we need to also make sure that we only load one bullet into the chamver(work on this)
			
			player.turret.active.push(new Bullet(
				player.centerX+2.0*player.turret.width*Math.cos((player.turret.theta+player.theta)*Math.PI/180.0),
				player.centerY+2.0*player.turret.width*Math.sin((player.turret.theta + player.theta)*Math.PI/180.0),
				player.turret.theta+player.theta
			  ))	
		}
	})
})


let last = (new Date()).getTime()

setInterval(()=>{  //we have to update the bullets and also handle the logic if a tank gets hit by a bullet 
	let current = (new Date()).getTime()
	let dT = current - last

	for(id in players){
		const player = players[id]
		
		for(let i = 0 ; i < player.turret.active.length; i++){
			const dx =  player.turret.active[i].speed*Math.cos(player.turret.active[i].theta *Math.PI/180.0) 
			const dy = player.turret.active[i].speed*Math.sin(player.turret.active[i].theta *Math.PI/180.0)	
			if(player.turret.active[i].centerX + dx >= 800 || player.turret.active[i].centerX + dx <= 0 || player.turret.active[i].centerY + dy >= 600 || player.turret.active[i].centerY+dy <= 0){
				player.turret.active.splice(i,1)
				i--
			}
			else{
				player.turret.active[i].centerX += dx
				player.turret.active[i].centerY += dy
			}
		}
	
	}

	hitbox(players)

		
//this is where big (O) complexity comes into play: we have to delete the bullets that are outside of the frame
	last = current
}, 1000/60)

setInterval(()=>{
	io.sockets.emit('state', players)
}, 1000/60)
//this makes sure that the players are updated 60 times a second (so it's 60 fps)


//starting server

server.listen(PORT, ()=>{
	console.log('Starting server on port 3000')
})

