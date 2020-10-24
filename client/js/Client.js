/*
*
*
* The bullets is the main issue
*
*
*/



const Player = require('../../server/Tank')
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
            shoot :false,
            sequenceId: 0
        }

        //players
        this.players = {}

        //update times
        this.last = 0
        this.dT = 0

        //prediction and reconcilliation

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
    
        const current = Date.now()
        this.dT = (current - this.last)
        this.last = current
    


       this.processInputs(socket)
       this.processServerMessages(socket)
       this.interpolatePlayers(socket)
       this.draw()

    }


    processInputs(socket){

        if(!this.players[socket.id]) return
        for(let i in this.input){
            if(this.input[i]){
                this.input.sequenceId++
                socket.emit('movement', this.input)
        
                this.players[socket.id].applyInput(this.input)
        
                this.pendingInputs.push(this.input)
                break
        
            }
        }


    }

    processServerMessages(socket){
        socket.on('state', (players) =>{

            for(let id in players){
                const player = players[id]

                if(!this.players[id]){
                    const p = new Player(player.centerX, player.centerY, player.color, player.turretColor, player.name)
                    this.players[id] = p
                }

                const p2 = this.players[id]

                if(id === socket.id){

                    p2.centerX = player.centerX
                    p2.centerY = player .centerY
                    p2.theta = player.theta
                    p2.turret.theta = player.turret.theta
                    p2.turret.active = player.turret.active
                    p2.health = player.health
                

                    let j = 0 
                    while (j < this.pendingInputs.length){
                        const input = this.pendingInputs[j]
                        if(this.input.sequenceId <= player.lastProcessedInput){
                            this.pendingInputs.splice(j, 1)
                            //delete inputs that are already processed
                        }
                        else{
                            //not processed by server yet. re-apply it 
                            p2.applyInput(this.input)
                            j++
                        }
                    }
                }
                else{
                 /*   p2.centerX = player.centerX
                    p2.centerY = player .centerY
                    p2.theta = player.theta
                    p2.turret.theta = player.turret.theta
                    p2.turret.active = player.turret.active
                    p2.health = player.health
                    */

                    let timestamp = new Date()
                    p2.bufferQueue.push([timestamp, player.centerX, player.centerY, player.theta, player.turret.theta,player.turret.active])

                }

            }







        })
    }


    interpolatePlayers(socket){
        const now = new Date()
        const renderTimestamp  = now - (1000 / 60)

        for(let id in this.players){
            let player = this.players[id]
            
            if(id === socket.id){
                console.log('hello')
                continue
            }

            let buffer = player.bufferQueue

            while(buffer.length >= 2 && buffer[1][0] <= renderTimestamp){
                buffer.shift()
            }

            if(buffer.length >= 2 && buffer[0][0] <= renderTimestamp && renderTimestamp <= buffer[1][0]){
                let x0 = buffer[0][1]
                let x1 = buffer[1][1]
                let y0 = buffer[0][2]
                let y1 = buffer[1][2]
                let theta0 = buffer[0][3]
                let theta1 = buffer[1][3]
                let ttheta0 = buffer[0][4]
                let ttheta1 = buffer[1][4]
                
                /*
                *
                *     I don't know about bullets
                * 
                * 
                * */

                player.centerX = x0 + (x1-x0)*(renderTimestamp-t0) / (t1-t0)

                player.centerY = y0 + (y1-y0)*(renderTimestamp-t0) / (t1-t0)

                player.theta = theta0 + (theta1 - theta0)*(renderTimestamp-theta0) / (t1-t0)

                player.turret.theta = ttheta0 + (ttheta1 - ttheta0)*(renderTimestamp-theta0) / (t1-t0)

            }

        }
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