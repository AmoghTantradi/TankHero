const Constants = require('../../lib/Constants')

class Brush{

    constructor(ctx){
        this.ctx = ctx
    }  


      drawCheckpointProgressBar(checkpoint, ctx = this.ctx){
        ctx.fillStyle = Constants.CHECKPOINT_PROGRESSBAR_COLOR
        const progressRatio = checkpoint.progress
        const length = checkpoint.radius*2*progressRatio
        ctx.fillRect(-checkpoint.radius, -checkpoint.radius*5/4, length, 2)
        return
      }

      drawCheckpoint(checkpoint, ctx=this.ctx){
        ctx.fillStyle = checkpoint.color
        ctx.save()
        ctx.translate(checkpoint.centerX, checkpoint.centerY)
        ctx.fillRect(-checkpoint.radius, -checkpoint.radius, checkpoint.radius*2, checkpoint.radius*2)
        this.drawCheckpointProgressBar(checkpoint)
        ctx.translate(-checkpoint.centerX, -checkpoint.centerY)
        ctx.restore()
        return
      }


      drawBullet(bullet,ctx){
        ctx.fillStyle = bullet.color
        ctx.save()
        ctx.translate(bullet.centerX, bullet.centerY)
        ctx.rotate(bullet.theta *(Math.PI/180))
        ctx.fillRect(-bullet.width/2, -bullet.height/2, bullet.width, bullet.height)
        ctx.translate(-(bullet.centerX), -(bullet.centerY))
        ctx.restore()
        return
    }
    
      drawPlayerName(player, ctx){
        ctx.fillStyle = Constants.PLAYER_NAME_COLOR
        const status = (player.health > 0) ? 'Alive' : `Dead : Will respawn in ${(Constants.TANK_RESPAWN_TIME - ( Date.now() - player.timeOfDeath))/1000.0} seconds`
        ctx.fillText(`${player.name} : ${status}`,player.centerX - 3*player.width/2,player.centerY - 3*player.height/2, 500, 50)
        return
      }
    //draw this behind the player
      drawPlayerHealthbar(player,ctx){
        ctx.fillStyle = Constants.PLAYER_HEALTHBAR_COLOR
        const ratio = player.health/Constants.TANK_MAX_HEALTH
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
    
      drawPlayerTurret(player, ctx){
        ctx.fillStyle = player.turretColor
        ctx.save()
        ctx.rotate(player.turret.theta*(Math.PI/180.0))
        ctx.fillRect(-player.turret.width/2,-player.turret.height/2,player.turret.width, player.turret.height)
        ctx.fillRect(0, -player.turret.height/8, player.turret.width*2, player.turret.height/4) 
        ctx.restore() 
        return;
    }
    
      drawPlayerTank(player,ctx){
        ctx.save();
        ctx.fillStyle = player.color;
        ctx.translate(player.centerX,player.centerY);
        ctx.rotate(player.theta * (Math.PI / 180));
        ctx.fillRect(-player.width/2,-player.height/2, player.width, player.height);
        this.drawPlayerTurret(player, ctx)
        this.drawPlayerHealthbar(player,ctx)
        ctx.translate(-(player.centerX), -(player.centerY));
        ctx.restore();
    }
    
      draw(player,ctx=this.ctx){
        this.drawPlayerName(player, ctx)
        this.drawPlayerTank(player,ctx)
        for(let i = 0 ; i < player.turret.active.length; i++){
            this.drawBullet(player.turret.active[i],ctx)
        }
    }

}

module.exports = Brush

