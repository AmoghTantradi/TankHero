
const socket = io()

socket.on('message', (data) =>{ //this is getting data from the server
    console.log(data)
})


const playerMovement = { //json object that represents the player's state of motion
    forward:false,
    back:false,
    turnLeft:false,
    turnRight: false,
    turnTurretLeft: false,
    turnTurretRight: false
}

document.addEventListener('keydown', (event) => {

    switch(event.keyCode){
        case 87:
            playerMovement.forward = true
            break
        case 83:
            playerMovement.back = true
            break
        case 65:
            playerMovement.turnLeft = true
            break
        case 68:
            playerMovement.turnRight = true
            break
        case 37:
            playerMovement.turnTurretLeft = true
            break
        case 39:
            playerMovement.turnTurretRight = true
            break
        default:
            break
    }

})

document.addEventListener('keyup', (event) => {
    
    switch(event.keyCode){
        case 87:
            playerMovement.forward = false
            break
        case 83:
            playerMovement.back = false
            break
        case 65:
            playerMovement.turnLeft = false
            break
        case 68:
            playerMovement.turnRight = false
            break
        case 37:
            playerMovement.turnTurretLeft = false
            break
        case 39:
            playerMovement.turnTurretRight = false
            break
        default:
            break 
    }
})


socket.emit('new player')

setInterval( ()=>{
    socket.emit('movement', playerMovement);
  }, 1000 / 60);


const canvas = document.getElementById('gameScreen')

const ctx = canvas.getContext('2d')

socket.on('state', (players) => { //recieves player data from server every 60 seconds 
    ctx.clearRect(0,0,800,600)
    //ctx.fillStyle = 'green'
    for(let id in players){
        let player = players[id]
        //player.draw(ctx)
        drawPlayerTank(player,ctx)
        console.log('player: ', player)
    }
})


function drawPlayerTurret(player, ctx){
    ctx.fillStyle = "green";
  
    ctx.rotate(player.turret.theta * (Math.PI / 180));
    ctx.fillRect(-player.turret.width / 2, -player.turret.height / 2, player.turret.width, player.turret.height);
    ctx.fillRect(
      -player.turret.width / 2,
      -player.turret.height / 8,
      player.turret.width * 2.5,
      player.turret.height / 4
    ); //this is the pipe/gun of the turret

    return;
}

function drawPlayerTank(player,ctx){
    ctx.fillStyle = "brown";
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    ctx.rotate(player.theta * (Math.PI / 180));
    ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
    drawPlayerTurret(player, ctx)
    ctx.translate(-(player.x + player.width / 2), -(player.y + player.height / 2));
    ctx.restore();
}

