

class Text{

    constructor(){
        //create stuff
        this.messages = document.getElementById('messages')
        this.alliedScore = document.getElementById('alliedScore')
        this.axisScore = document.getElementById('axisScore')
        this.receivedMessages = new Set() 
    }

    postData(data){
      //  this.scoreboard.removeAttribute()
        const message = data.message
        const alliedScore = data.scoreboard['allied']
        const axisScore = data.scoreboard['axis']
        const date = data.date
        const timestamp = data.timestamp
       
        if(!this.receivedMessages.has(timestamp)){
            //update scoreboard

            this.alliedScore.innerHTML = `Allied ${alliedScore}`
            this.axisScore.innerHTML = `Axis ${axisScore}`

            //update messages
            const messageElement = document.createElement('li')
            messageElement.appendChild(
                document.createTextNode(`${message} ${date}`)
            )
            this.messages.appendChild(messageElement)
            this.receivedMessages.add(timestamp)

        }
    }

    update(socket){
        socket.on('gameData', (data) =>{
            this.postData(data)
        })
    }

}

module.exports = Text