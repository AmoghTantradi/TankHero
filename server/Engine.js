const Player = require('./Tank')
const Bullet = require('./Bullet')
const Hitbox = require('./Hitbox')

class Engine{


    constructor(){
        
        this.hit= new Hitbox()

        this.players = new Map()
        this.gameData = new Map()
        this.gameState = 0 //0 is home page, 1 is playing, and 2 is ended

        this.last = 0
        this.dT = 0 
        this.init()
    }

    init(){
        this.gameData.set('allied',0)
        this.gameData.set('axis', 0)
        this.gameData.set('max',1)
    }

    start(){
        this.last = Date.now()
        this.gameState = 1 // now playing the game
    }

    end(){
        this.players.clear() //kicks all the players out 
        this.last = 0 
        this.dT = 0

    }



    createPlayer(socket, name){
        if(this.gameData.get('allied') + this.gameData.get('axis') < this.gameData.get('max')){
			if(this.gameData.get('allied') <= this.gameData.get('axis')){
				this.players.set(socket.id,new Player(400,450,'black','grey', name))
				this.gameData.set('allied', this.gameData.get('allied')+1)
                socket.emit('msg', 'Allied tank')
			}
			else{
				this.players.set(socket.id, new Player(400,150,'brown','green', name))
				this.gameData.set('axis', this.gameData.get('axis')+1)
				socket.emit('msg', 'Axis tank')
            }
            if(this.gameData.get('allied') + this.gameData.get('axis') ===  this.gameData.get('max')){
                socket.emit('msg','Now that all players have joined, this game will start. Use WASD and arrow keys to move your tank and its turret. Press the front arrow key to shoot. There is a reload time of 1 second.')
                this.start()
            }
		}
		else{
			console.log('Sorry there are too many players')
			socket.emit('msg', 'Sorry, this lobby is full and the game has Started. Please wait until a player leaves the game')//this is only sent to the extra player who tries to join
        }
        
        
    }

    removePlayer(socket){
       if(this.players.has(socket.id))
       {
           const team = this.players.get(socket.id).team
           this.players.delete(socket.id)
           this.gameData.set(team, this.gameData.get(team)-1)
           console.log('deleted', this.gameData)
       }
    }


    update(socket){
        
        if(this.gameState === 0 ){
            if(socket){
                socket.emit('msg', 'The game has ended. Please feel free to refresh the browser and play again')
            }
            return

        }
        else if(this.gameState === 2){
            if(socket){
                socket.emit('msg', 'The game has ended. Please feel free to refresh your browsers and play the game again')
            }
            return
        }

        //updates the timestamp for when the last update happened
        const current = Date.now()
        this.dT = (current - this.last)
        this.last = current

        this.players.forEach((player)=>{
            player.update(this.last, this.dT)
        })

        this.hit.hitbox(this.players)
    }

    updatePlayerMovement(socket, data){

        if(this.players.has(socket.id)){
            const player = this.players.get(socket.id)
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
                player.shoot()
            }
        }
    }



}

module.exports = Engine
