const Hitbox = require('../lib/Hitbox')

class Checkpoint{

    // delay is in milliseconds (default is 20 seconds)
    constructor(centerX, centerY, delay=20000 ){   
        this.centerX = centerX
        this.centerY = centerY
        this.radius = 60 // 80px
        this.delay = delay
        
        this.hitbox = new Hitbox()
        this.capturingPlayers = new Set()


        this.progress = 0.0
        this.start  = 0.0
        this.lastUpdateTime = 0.0
        this.isCaptured = false   
        this.isCapturing = false
        this.capturingTeam = null
    }

    startCountdown(){
        this.isCapturing = true
        this.start = Date.now()
    }

    stopCountdown(){
        this.isCapturing = false
        this.start = 0.0
        this.progress = 0.0
    }
    //the team that got there first is the one that will have the checkpoint
    updateCheckpointStatus(playerDict){   

        if(this.isCaptured){
            return
        }

        playerDict.forEach((player) => {
            
           //this makes sure that the player of a particular team is able to start capturing the checkpoint
            if(this.hitbox.isInsideCheckpoint(this.centerX - this.radius, this.centerY-this.radius, this.centerX+this.radius, this.centerY+this.radius,player)  && (this.capturingTeam === player.team || !this.isCapturing)){
                if(!this.isCapturing) this.startCountdown()
                this.capturingPlayers.add(player)
                this.capturingTeam = player.team

                
            }
            //if a player was capturing the area and moved out of the area and he/she was not the only player left, then just delete the player from the set. 
            else if(this.isCapturing && this.capturingPlayers.has(player) && this.capturingPlayers.size > 1){
                this.capturingPlayers.delete(player)
            }
            //if a player was capturing the area and he/she was the only player left, then reset stuff
            else if(this.isCapturing && this.capturingPlayers.has(player) && this.capturingPlayers.size === 1){
                this.capturingPlayers.clear()
                this.capturingTeam = null
                this.stopCountdown()
            }
        })


    }


    update (last, playerDict){

        this.lastUpdateTime = last

        this.updateCheckpointStatus(playerDict)

        if(this.progress >= 1.0){
            this.isCaptured = true
            this.stopCountdown()
        }  
        
        if(this.start > 0 ){
            this.progress = (this.lastUpdateTime - this.start)/this.delay
        }

        console.log('start', this.start,'last', this.lastUpdateTime,'progress',this.progress, 'is captured', this.isCaptured, 'is capturing', this.isCapturing)
    }

}


module.exports = Checkpoint