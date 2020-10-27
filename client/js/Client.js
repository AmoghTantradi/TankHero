

const Player = require('../../server/Tank')
const Brush = require('./Brush') 
class Client{

    constructor(ctx){

        this.forward = false,
        this.back = false,
        this.turnLeft = false,
        this.turnRight = false,
        this.turnTurretLeft = false,
        this.turnTurretRight = false,
        this.shoot = false,
        this.sequenceId = 0

        //players
        this.players = {}

        //prediction and reconcilliation

        this.pendingInputs = []

        //drawing
        this.brush = new Brush(ctx)

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
            console.log(socket.id, 'is not here')
            return 
        }
        
        this.sequenceId++

    
        socket.emit('movement',  
            {
                forward:this.forward,
                back: this.back,
                turnLeft: this.turnLeft,
                turnRight: this.turnRight,
                turnTurretLeft:this.turnTurretLeft,
                turnTurretRight:this.turnTurretRight,
                shoot:this.shoot,
                sequenceId: this.sequenceId
            }
        )


     
        this.players[socket.id].applyInput( 
            {
                forward:this.forward,
                back: this.back,
                turnLeft: this.turnLeft,
                turnRight: this.turnRight,
                turnTurretLeft:this.turnTurretLeft,
                turnTurretRight:this.turnTurretRight,
                shoot:this.shoot,
                sequenceId: this.sequenceId
            }
        )
        
        this.pendingInputs.push( 
            {
                forward:this.forward,
                back: this.back,
                turnLeft: this.turnLeft,
                turnRight: this.turnRight,
                turnTurretLeft:this.turnTurretLeft,
                turnTurretRight:this.turnTurretRight,
                shoot:this.shoot,
                sequenceId: this.sequenceId
            }
        )
        
    }

    processServerMessages(socket){ //we have to remove players who have disconnected as well
        socket.on('state', (players) =>{

            for(let id in players){

                let player = players[id]

                if(!this.players[id]){
                    let p = new Player(player.centerX, player.centerY, player.color, player.turretColor, player.name)
                    this.players[id] = p
                    console.log('new player initialized', p.name)
                }

                let p2 = this.players[id]

                if(id == socket.id){

                    p2.centerX = player.centerX
                    p2.centerY = player.centerY
                    p2.theta = player.theta
                    p2.turret.theta = player.turret.theta
                    p2.turret.active = player.turret.active
                    p2.health = player.health
                

                    let j = 0 
                    while (j < this.pendingInputs.length){
                        let  input = this.pendingInputs[j]
                        if(this.sequenceId <= player.lastProcessedInput){
                            this.pendingInputs.splice(j, 1)
                            //delete inputs that are already processed
                        }
                        else{
                            //not processed by server yet. re-apply it 
                            p2.applyInput(input)
                            j++
                        }
                    }
                }
                else{                
                 p2.centerX = player.centerX
                 p2.centerY = player.centerY
                 p2.theta = player.theta
                 p2.turret.theta = player.turret.theta
                 p2.turret.active = player.turret.active
                 p2.health = player.health

                }

            }







        })
    }


   

    draw(){
        this.brush.ctx.clearRect(0,0,800,600)
        for(let id in this.players){
            const player = this.players[id]
            this.brush.draw(player)
        }
    }

}

module.exports =  Client