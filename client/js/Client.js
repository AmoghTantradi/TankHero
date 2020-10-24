const Brush = require('./Brush')

class Client{

    constructor(ctx){

        this.input =  { //json object that represents the player's state of motion
            forward:false,
            back:false,
            turnLeft:false,
            turnRight: false,
            turnTurretLeft: false,
            turnTurretRight: false,
            shoot :false
        }

        //players
        this.players = {}

        //update times
        this.last = 0
        this.dT = 0

        this.brush = new Brush(ctx)
        
        this.handle()
    }

    handle(){

       document.addEventListener('keydown', (event) => {
            switch(event.keyCode){
                case 87:
                    this.input.forward = true
                    break
                case 83:
                    this.input.back = true
                    break
                case 65:
                    this.input.turnLeft = true
                    break
                case 68:
                    this.input.turnRight = true
                    break
                case 37:
                    this.input.turnTurretLeft = true
                    break
                case 39:
                    this.input.turnTurretRight = true
                    break
                case 38:{
               
                    this.input.shoot = true

                    break
                }
                default:
                    break
            }
    
        })
    
        document.addEventListener('keyup', (event) => {
            
            switch(event.keyCode){
                case 87:
                    this.input.forward = false
                    break
                case 83:
                    this.input.back = false
                    break
                case 65:
                    this.input.turnLeft = false
                    break
                case 68:
                    this.input.turnRight = false
                    break
                case 37:
                    this.input.turnTurretLeft = false
                    break
                case 39:
                    this.input.turnTurretRight = false
                    break
                case 38:{
                    this.input.shoot = false
                    break 
                }
                default:
                    break 
            }
        })
        
    }


        //process/handle inputs and send to the server
    sendState(socket){
            socket.emit('movement',this.input)
    }
    
    recieveGameState(socket){
        socket.on('state', (players) =>{
            for(let id in players){
                const player = players[id]
                this.players[id] = player
            }
        })
    }

    update(socket){
        /*
        const current = Date.now()
        this.dT = (current - this.last)
        this.last = current
        */

       this.recieveGameState(socket)
       this.sendState(socket)


        this.draw()

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