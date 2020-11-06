const Checkpoint = require('./Checkpoint')

class CheckpointManager{

    constructor(){

        this.scoreBoard = new Map([['allied', 0],['axis',0]])
        this.checkpoints = []
    }

    createRandomCheckpoint(){
        this.createCheckpoint(Math.random() * (800 - 120) + 60, Math.random() * (600 - 120) + 60)
    }

    createCheckpoint(centerX, centerY, delay=null){
        if(delay){
            this.checkpoints.push(new Checkpoint(centerX, centerY, delay))
        }
        else{
            this.checkpoints.push(new Checkpoint(centerX, centerY))
        }
    }

    update(last, playerDict, socket){


        if(this.checkpoints.length < 1 ){
            this.createRandomCheckpoint()
        }
    
        for(let i = 0 ; i < this.checkpoints.length; i++){

            this.checkpoints[i].update(last, playerDict)

            if(this.checkpoints[i].isCaptured){
                const team = this.checkpoints[i].capturingTeam
                const message = `A checkpoint has been captured by the ${team} team`
                this.scoreBoard.set(team, this.scoreBoard.get(team) + 10)
                socket.emit('gameData',{message:message, date:Date.now()})
                this.checkpoints.splice(i, 1)
                i--
            }

        }




    }


}


module.exports = CheckpointManager