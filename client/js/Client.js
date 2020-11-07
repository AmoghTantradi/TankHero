//client-side dependencies
const Brush = require('./Brush') 
const Text = require('./Text')

//lib dependencies
const Constants = require('../../lib/Constants')

class Client{

    constructor(ctx){

        this.forward = false,
        this.back = false,
        this.turnLeft = false,
        this.turnRight = false,
        this.turnTurretLeft = false,
        this.turnTurretRight = false,
        this.shoot = false,

        //players, checkpoints, and messages -- something the server sends to the frontend periodically
        this.players = {}
        this.checkpoints = []

        //drawing
        this.brush = new Brush(ctx)

        //updating gState on client side

        this.text = new Text()

        this.handle()
    }

    handle(){

       document.addEventListener('keydown', (event) => {
            switch(event.keyCode){
                case 87:
                    this.forward = true
                    break
                case 83:
                    this.back = true
                    break
                case 65:
                    this.turnLeft = true
                    break
                case 68:
                    this.turnRight = true
                    break
                case 37:
                    this.turnTurretLeft = true
                    break
                case 39:
                    this.turnTurretRight = true
                    break
                case 38:{
               
                    this.shoot = true

                    break
                }
                default:
                    break
            }
    
        })
    
        document.addEventListener('keyup', (event) => {
            
            switch(event.keyCode){
                case 87:
                    this.forward = false
                    break
                case 83:
                    this.back = false
                    break
                case 65:
                    this.turnLeft = false
                    break
                case 68:
                    this.turnRight = false
                    break
                case 37:
                    this.turnTurretLeft = false
                    break
                case 39:
                    this.turnTurretRight = false
                    break
                case 38:{
                    this.shoot = false
                    break 
                }
                default:
                    break 
            }
        })
        
    }



    update(socket){
       
       this.text.update(socket)
       this.processInputs(socket)
       this.processServerMessages(socket)
       this.draw()

    }


    processInputs(socket){

        socket.on('gameState', (value) =>{
            if(value.gameState !== 1){
                return
            }
        })

        if(!this.players[socket.id]){
            return 
        }
        
    
        socket.emit('movement',  
            {
                forward:this.forward,
                back: this.back,
                turnLeft: this.turnLeft,
                turnRight: this.turnRight,
                turnTurretLeft:this.turnTurretLeft,
                turnTurretRight:this.turnTurretRight,
                shoot:this.shoot
            }
        )  
    }

    processServerMessages(socket){ //we have to remove players who have disconnected as well
        socket.on('state', (data) =>{
            this.checkpoints = data.checkpoints
            const players = data.players
            
            for(let id in this.players){
                if(!this.players[id]){
                    delete this.players[id]
                }
            }

            for(let id in players){
                const player = players[id]
                this.players[id] = player
            }
            
        })
    }


   

    draw(){
        this.brush.ctx.clearRect(0,0,Constants.WIDTH,Constants.HEIGHT)

        for(let i = 0 ; i < this.checkpoints.length; i++){
            const checkpoint = this.checkpoints[i]
            this.brush.drawCheckpoint(checkpoint)
        }

        for(let id in this.players){
            const player = this.players[id]
            this.brush.draw(player)
        }
   
    }

}

module.exports =  Client