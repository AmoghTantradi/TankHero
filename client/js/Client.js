const Player = require('../../server/Tank')
const Brush = require('./Brush')

/*
*
*  prediction, reconciliation, and entity interpolation
*
*
*
*
*
*
*
*
*
*/

class Client{

    constructor(ctx){

        this.input =  { //json object that represents the player's state of motion
            forward:false,
            back:false,
            turnLeft:false,
            turnRight: false,
            turnTurretLeft: false,
            turnTurretRight: false,
            shoot :false,
            sequenceId: 0
        }

        //players
        this.players = {}
        
        //socketid

        this.id = null

        //update times
        this.last = 0
        this.dT = 0
    
        
        //client and server reconcilliation
        this.pendingInputs = []

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

    update(socket){

        if(!this.id){
            this.id = socket.id
            return
        }

        const current = Date.now()
        this.dT = (current - this.last)
        this.last = current

        for(let id in this.players){
            this.players[id].update(this.last, this.dT)
        }

        //draw stuff here as well 

        this.processMessages(socket)

        this.processInputs(socket)

        this.interpolatePlayers()

        this.draw()

    }

    //process/handle inputs and send to the server

    processInputs(socket){

        this.input.sequenceId++

        socket.emit('movement', this.input)

        //prediction
        if(this.players[this.id]) this.players[this.id].applyInput(this.input)
        

        //save for later reconciliation
        this.pendingInputs.push(this.input)

    }

    //process all updates from the server 

    processMessages(socket){

        socket.on('state', (players) =>{

            for(let id in players){

                //id is the socket id, players is a 
                //n object containing the player positions and so on
                const state = players[id]

                if(!this.players[id]){
                    this.players[id] = new Player()
                }

                const player = this.players[id]

                if(id === this.id){
                    /*
                    *basically initialize everything
                    */


                    player.centerX = state.centerX
                    player.centerY = state.centerY
                    player.theta = state.theta
                    player.turret.theta = state.turret.theta

                

                    for(let i  = 0 ; i < this.pendingInputs.length; i++){
                        const input = this.pendingInputs[i]

                        if(input.sequenceId <= state.lastProcessedInput){//already processed
                            this.pendingInputs.splice(i, 1)
                            i--
                        }
                        else{
                            player.applyInput(input)
                            i++
                        }
                    }
                }
                else{

                    //here we reinitialize the position buffer of the state
                    const timestamp = (new Date()).getTime()
                    state.positionBuffer.push([timestamp,  state.centerX, state.centerY, state.theta, state.turret.theta])
                }

            }

        })
    }


    interpolatePlayers(){

        const now = (new Date()).getTime()


        const renderTimestamp = now - (1000 / 60)

        for(let id in this.players){

            const player = this.players[id]

            if(id === this.id){
                continue
            }

            let buffer = player.positionBuffer

            while(buffer.length >= 2 && buffer[1][0] <= renderTimestamp){
                buffer.shift()
            }

            if(buffer.length >= 2 && buffer[0][0] <= renderTimestamp && renderTimestamp <= buffer[1][0]){

                const t0 = buffer[0][0]
                const x0 = buffer[0][1]
                const y0 = buffer[0][2]
                const theta0 = buffer[0][3]
                const ttheta0 = buffer[0][4]

                const t1 = buffer[1][0]
                const x1 = buffer[1][1]
                const y1= buffer[1][2]
                const theta1 = buffer[1][3]
                const ttheta1  = buffer[1][4]

                player.centerX = x0 + (x1-x0)*(renderTimestamp - t0) / (t1-t0)
                player.centerY = y0 + (y1-y0)*(renderTimestamp-t0) / (t1-t0)
                player.theta = theta0 + (theta1-theta0)*(renderTimestamp-t0) /(t1-t0)
                player.turret.theta = ttheta0 + (ttheta1-ttheta0)*(renderTimestamp-t0) / (t1-t0)
                //you have to do this for every parameter (for turrets, for bullets, for x positions, e.t.c)

            }


        }

    }

    draw(){
        this.brush.ctx.clearRect(0,0,800,600)
        for(let id in this.players){
            this.brush.draw(this.players[id])
        }
    }

}

module.exports =  Client