require('./css/styles.css')

const $ = require('jquery')

const io = require('socket.io-client')


const Client = require('./js/Client')
const Brush = require('./js/Brush')


$(()=>{
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
        client = new Client(ctx)
        $('#name-prompt-overlay').remove()
        $('#gameScreen').focus()
    }
    else{
        window.alert('Your name cannot be blank or over 20 characters.')
    }
    return false
}

$('#name-form').submit(sendName)
$('#name-submit').click(sendName)


setInterval( ()=>{
    //if(client) socket.emit('movement', client.input);
    if(client){
        client.update(socket)
    }
    }, 1000.0 / 60.0);

socket.on('msg', (data)=>{ //this is used to communicate with the player
    window.alert(data)
})
    
})