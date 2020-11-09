//dependencies
require('./css/styles.css')
const $ = require('jquery')
const io = require('socket.io-client')

//game dependencies
const Client = require('./js/Client')

//lib dependencies
const Constants = require('../lib/Constants')

$(()=>{
    const socket = io()
    const ctx = document.getElementById('gameScreen').getContext('2d')
    let client = null

    $('#name-input').focus();

function sendName(){
    const name = $('#name-input').val()

    if(name && name.length < 20){
        $('#name-prompt-container').empty()
        socket.emit(Constants.SOCKET_NEW_PLAYER, {name})
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
    if(client){
        client.update(socket)
    }
    }, 1000.0 / 60.0);

socket.on(Constants.SOCKET_MSG, (data)=>{ //this is used to communicate with the player (only for the start and the end for the game -- nothing in between)
    window.alert(data)
})
    
})