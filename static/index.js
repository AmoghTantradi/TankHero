import Player from './Player.js';
import Brush from './Brush.js'

$(document).ready(()=>{
    const socket = io()
    const ctx = document.getElementById('gameScreen').getContext('2d')
    const brush = new Brush(ctx)
    let client

    $('#name-input').focus();

function sendName(){
    const name = $('#name-input').val()

    if(name && name.length < 20){
        $('#name-prompt-container').empty()
        socket.emit('new-player', {name})
        client = new Player(ctx)
        $('#name-prompt-overlay').remove()
        $('#gameScreen').focus()
    }
    else{
        alert('Your name cannot be blank or over 20 characters.')
    }
    return false
}

$('#name-form').submit(sendName)
$('#name-submit').click(sendName)


setInterval( ()=>{
    if(client !== undefined) socket.emit('movement', client.player);
    }, 1000 / 60);
    

socket.on('state', (players) => { //recieves player data from server every 60 seconds 
    
    ctx.clearRect(0,0,800,600)
    
    for( let id in players){
        const player = players[id]
        brush.draw(player)
    }
    
   
    
})

socket.on('msg', (data)=>{ //this is used to communicate with the player
    alert(data)
})
    
})