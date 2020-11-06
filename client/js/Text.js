

class Text{

    constructor(){
        this.messages = document.getElementById('messages')
        this.scoreboard = document.getElementById('scoreboard')
        this.receivedMessages = new Set() 
    }

    postData(data){
      //  this.scoreboard.removeAttribute()
        const message = data.message
        const date = data.date
        if(!this.receivedMessages.has(date)){
            const messageElement = document.createElement('li')
            messageElement.appendChild(
                document.createTextNode(`${message}`)
            )
            this.messages.appendChild(messageElement)
            this.receivedMessages.add(date)
        }
    }

    update(socket){
        socket.on('gameData', (data) =>{
            this.postData(data)
        })
    }

}

module.exports = Text