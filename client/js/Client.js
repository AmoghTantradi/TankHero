const Tank = require('../../server/Tank')
const Brush = require('./Brush')

/*
*
*  entity interpolation
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

    constructor(pid,ctx){

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
        
        //our id
        this.id = pid

        //update times

        this.lastTime = 0
        
        //client and server reconcilliation
        this.predict = false
        this.confirmFromServer = false
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


        //draw stuff here as well 

    }

    //process/handle inputs and send to the server

    processInputs(socket){

        if(!this.id){
            this.id = socket.id
        }

        this.input.sequenceId++

        socket.emit('movement', this.input)

        if(this.predict){
            this.players[this.id].applyInput(this.input)
        }

        //save for later reconciliation
        this.pendingInputs.push(this.input)

    }

    //process all updates from the server 

    processMessages(socket){


        socket.on('state', (players) =>{

            for(let id in players){

                if(!this.players[id]){
                    this.players[id] = new Tank()

                }

                const player = players[id]









                







            }

        })


        

    }


    interpolatePlayers(){

        const now = (new Date()).getTime()


    }

}

module.exports =  Client