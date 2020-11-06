

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
        const timestamp = data.timestamp
        if(!this.receivedMessages.has(timestamp)){
            const messageElement = document.createElement('li')
            messageElement.style.border = "1px solid black"
            messageElement.appendChild(
                document.createTextNode(`${message} : ${date}`)
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