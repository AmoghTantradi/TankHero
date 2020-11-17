//game dependencies
const Player = require('./Tank')
const CheckpointManager = require('./CheckpointManager')

//lib dependencies
const Constants = require('../lib/Constants')
const Hitbox = require('../lib/Hitbox')

class Engine{


    constructor(){
        
        this.manager = new CheckpointManager()
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
        this.gameData.set('max',Constants.MAX_PLAYERS)
    }

    start(){
        this.last = Date.now()
        this.gameState = 1 // now playing the game
    }

    end(){
        this.init() // initializes gameData
        this.players.clear() //kicks all the players out 
        this.manager = new CheckpointManager() //creates new checkpoint manager
        this.last = 0 
        this.dT = 0
    }

    createPlayer(socket, name){
        if(this.gameData.get('allied') + this.gameData.get('axis') < this.gameData.get('max')){
			if(this.gameData.get('allied') <= this.gameData.get('axis')){
				this.players.set(socket.id,new Player(Constants.TANK_DEFAULT_CENTER_X,1.125*Constants.TANK_DEFAULT_CENTER_Y,'black','grey', name))
				this.gameData.set('allied', this.gameData.get('allied')+1)
                socket.emit(Constants.SOCKET_MSG, 'Allied tank')
			}
			else{
				this.players.set(socket.id, new Player(Constants.TANK_DEFAULT_CENTER_X,0.375*Constants.TANK_DEFAULT_CENTER_Y,'brown','green', name))
				this.gameData.set('axis', this.gameData.get('axis')+1)
				socket.emit(Constants.SOCKET_MSG, 'Axis tank')
            }
		}
		else{
			console.log('Sorry there are too many players')
			socket.emit(Constants.SOCKET_MSG, 'Sorry, this lobby is full and the game has Started. Please wait until a player leaves the game.')//this is only sent to the extra player who tries to join
        }
        
    }

    removePlayer(socket){
       if(this.players.has(socket.id))
       {    
            this.end()
            this.gameState = 2
           console.log('ended game due to player leaving')
       }
    }


    updatePlayerMovement(socket, data){

        if(this.players.has(socket.id)){
            const player = this.players.get(socket.id)
            player.applyInput(data)
        }
    }

    update(sockets){
        
        if(this.gameState === 0 && !(this.gameData.get('allied') + this.gameData.get('axis') ===  this.gameData.get('max'))){
            return
        }
        else if(this.gameState === 0 && (this.gameData.get('allied') + this.gameData.get('axis') ===  this.gameData.get('max'))){
            sockets.emit(Constants.SOCKET_MSG,'Now that all players have joined, this game will start. Use WASD and arrow keys to move your tank and its turret. Press the front arrow key to shoot. There is a reload time of 1 second.')
            this.start()
            console.log('started')
        }
        else if(this.gameState === 2){
           
            if(sockets){
                const message = 'The game has unexpectedly ended. Please refresh your browsers to play the game again.'
                sockets.emit(Constants.SOCKET_MSG, message)
            }
            
            this.end()
            this.gameState = 0
            return
        }
        else if(this.manager.scoreboard.get('allied') === 100 || this.manager.scoreboard.get('axis') === 100){
            const message = `The ${(this.manager.scoreboard.get('allied') === 100) ? 'allied' : 'axis'} team has won. Please refresh your browsers to play the game again.`
            if(sockets){
                sockets.emit(Constants.SOCKET_MSG, message)
            }
            this.end()
            this.gameState = 0
            return
        }
        //updates the timestamp for when the last update happened
        const current = Date.now()
        this.dT = (current - this.last)
        this.last = current

        this.manager.update(this.last,this.players, sockets)
        this.players.forEach((player)=>{
            player.update(this.last, this.dT)
        })

        this.hit.hitbox(this.players)
    }


}
module.exports = Engine