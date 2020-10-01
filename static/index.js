
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
    
    for(let id in players){
        let player = players[id]
        draw(player,ctx)
    }
})



function drawBullet(bullet,ctx){
    ctx.fillStyle = bullet.color
    ctx.save()
    ctx.translate(bullet.centerX, bullet.centerY)
    ctx.rotate(bullet.theta *(Math.PI/180))
    ctx.fillRect(-bullet.width/2, -bullet.height/2, bullet.width, bullet.height)
    ctx.translate(-(bullet.centerX), -(bullet.centerY))
    ctx.restore()
    return
}

//draw this behind the player
function drawPlayerHealthbar(player,ctx){
    ctx.fillStyle = 'blue'
    const ratio = player.health/player.maxPossibleHealth
    let height = player.height
    if(ratio < 0){
        height = 0.1
    }
    else{
        height *= ratio
    }
    ctx.fillRect(-player.width*3/4, -player.height/2, 2, height)
    return
}

function drawPlayerTurret(player, ctx){
    ctx.fillStyle = player.turret.color;
    ctx.save()
    ctx.rotate(player.turret.theta*(Math.PI/180.0))
    ctx.fillRect(-player.turret.width/2,-player.turret.height/2,player.turret.width, player.turret.height)
    ctx.fillRect(0, -player.turret.height/8, player.turret.width*2, player.turret.height/4) 
    ctx.restore() 
    return;
}

function drawPlayerTank(player,ctx){
    ctx.save();
    ctx.fillStyle = player.color;
    ctx.translate(player.centerX,player.centerY);
    ctx.rotate(player.theta * (Math.PI / 180));
    ctx.fillRect(-player.width/2,-player.height/2, player.width, player.height);
    drawPlayerTurret(player, ctx)
    drawPlayerHealthbar(player,ctx)
    ctx.translate(-(player.centerX), -(player.centerY));
    ctx.restore();
}

function draw(player,ctx){
    drawPlayerTank(player,ctx)
    for(let i = 0 ; i < player.turret.active.length; i++){
        drawBullet(player.turret.active[i],ctx)
    }
}

