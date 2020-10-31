const Hitbox = require('../lib/Hitbox')

class Checkpoint{

    constructor(centerX, centerY, delay=20000 ) // delay is in milliseconds (default is 20 seconds)
    {   
        this.centerX = centerX
        this.centerY = centerY
        this.radius = 60 // 80px
        this.delay = delay
        
        this.hitbox = new Hitbox()

        this.progress = 0.0
        this.start  = 0.0
        this.lastUpdateTime = 0.0
        this.captured = false

    }

    startCountdown(){
        this.start = Date.now()
    }

    stopCountdown(){
        this.start = 0.0
    }


    hasPlayers(playerDict)
    {

        //we only want to start the timer when ONLY ONE PLAYER IS ON THE CHECKPOINT
        const count = Map()
        playerDict.forEach((player) => {
            if(this.hitbox.isInsideCheckpoint(this.centerX-this.radius, this.centerY-this.radius, this.centerX+this.radius, this.centerY+this.radius, player)){
                //count.set(player.team, count.get)
            }
        })


    }


    update (last, socket)
    {

        this.lastUpdateTime = last

        if(this.progress >= 1.0){
            this.captured = true
        }

        this.progress = (this.lastUpdateTime - this.start)/this.delay


    }

}


module.exports = Checkpoint