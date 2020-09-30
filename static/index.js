
const socket = io()


 const player =  { //json object that represents the player's state of motion
    forward:false,
    back:false,
    turnLeft:false,
    turnRight: false,
    turnTurretLeft: false,
    turnTurretRight: false,
    shoot :false
}


document.addEventListener('keydown', (event) => {

    switch(event.keyCode){
        case 87:
            player.forward = true
            break
        case 83:
            player.back = true
            break
        case 65:
            player.turnLeft = true
            break
        case 68:
            player.turnRight = true
            break
        case 37:
            player.turnTurretLeft = true
            break
        case 39:
            player.turnTurretRight = true
            break
        case 38:
            player.shoot = true
            break
        default:
            break
    }

})

document.addEventListener('keyup', (event) => {
    
    switch(event.keyCode){
        case 87:
            player.forward = false
            break
        case 83:
            player.back = false
            break
        case 65:
            player.turnLeft = false
            break
        case 68:
            player.turnRight = false
            break
        case 37:
            player.turnTurretLeft = false
            break
        case 39:
            player.turnTurretRight = false
            break
        case 38:
            player.shoot = false
            break 
        default:
            break 
    }
})


socket.emit('new player')

setInterval( ()=>{
    socket.emit('movement', player);
  }, 1000 / 60);


const canvas = document.getElementById('gameScreen')

const ctx = canvas.getContext('2d')

socket.on('state', (players) => { //recieves player data from server every 60 seconds 
    ctx.clearRect(0,0,800,600)
    //ctx.fillStyle = 'green'
    for(let id in players){
        let player = players[id]
        //player.draw(ctx)
        draw(player,ctx)
        console.log('player: ', player)
    }
})




function drawBullet(bullet,ctx){

    ctx.fillStyle = bullet.color

    ctx.save()

    ctx.translate(bullet.x+bullet.width/2, bullet.y+bullet.height/2)


    ctx.rotate(bullet.theta *(Math.PI/180))

    ctx.fillRect(-bullet.width/2, -bullet.height/2, bullet.width, bullet.height)

    ctx.translate(-(bullet.x+bullet.width/2), -(bullet.y+bullet.height/2))


    ctx.restore()

    return
    
}


function drawPlayerTurret(player, ctx){
    ctx.fillStyle = player.turret.color;
  
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
    ctx.fillStyle = player.color;
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    ctx.rotate(player.theta * (Math.PI / 180));
    ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
    drawPlayerTurret(player, ctx)
    ctx.translate(-(player.x + player.width / 2), -(player.y + player.height / 2));
    ctx.restore();
}

function draw(player,ctx){

    drawPlayerTank(player,ctx)

    for(let i = 0 ; i < player.turret.active.length; i++){
        drawBullet(player.turret.active[i],ctx)
    }
      
}
