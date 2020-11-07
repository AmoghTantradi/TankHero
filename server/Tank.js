//game dependencies
const Turret = require('./Turret')
const Bullet = require('./Bullet')

//lib dependencies
const Constants = require('../lib/Constants')
const Hitbox = require('../lib/Hitbox')

class Tank {

  constructor(x=Constants.TANK_DEFAULT_CENTER_X, y=Constants.TANK_DEFAULT_CENTER_Y, color=Constants.TANK_DEFAULT_COLOR,turretColor=Constants.TURRET_DEFAULT_COLOR, name) {
    
    this.centerX = x 
    this.centerY = y 
   
    this.name = name;
    this.color =  color
    this.turretColor = turretColor
    this.team = (color === 'brown') ? ('axis') : 'allied'
  

    this.turret = new Turret()
    this.hitbox = new Hitbox()

    this.health = Constants.TANK_HEALTH
    this.maxPossibleHealth = Constants.TANK_MAX_HEALTH
    this.damage = Constants.TANK_DAMAGE
    this.width = Constants.TANK_WIDTH
    this.height = Constants.TANK_HEIGHT
    this.dTheta = Constants.TANK_DTHETA
    this.speed = Constants.TANK_SPEED
    this.reloadTime = Constants.TANK_RELOAD_TIME// 1 second


    this.diagnol = Math.sqrt(Math.pow(this.width,2) + Math.pow(this.height,2))
    this.theta = 0.0;
    this.omega = Math.atan2(this.height, this.width) * 180.0/Math.PI
    this.lastShotTime = 0.0
    this.lastUpdateTime = 0.0
  }


  update(last,dT){

      this.lastUpdateTime = last

      for(let i = 0 ; i < this.turret.active.length; i++){


        if(this.hitbox.isOutsideGamescreen(0,0,800,600,this.turret.active[i], this.turret.active[i].dx, this.turret.active[i].dy)){
          this.turret.active.splice(i, 1)
          i--
        }
        else{
          this.turret.active[i].update(last, dT)
        }

      }

  }

  applyInput(data){
    if(data.forward){//w key 
      this.centerX += this.speed*Math.cos(this.theta*Math.PI/180.0)
      this.centerY += this.speed*Math.sin(this.theta*Math.PI/180.0)
    }
    if(data.back){//s key TANK_THETA: 0.0,
        this.centerX -= this.speed*Math.cos(this.theta*Math.PI/180.0)
        this.centerY -= this.speed*Math.sin(this.theta*Math.PI/180.0)
    }
    if(data.turnLeft){// a key 
        //update x,y coordinates in rotation math
        this.theta -= this.dTheta
        this.theta %= 360.0
    }
    if(data.turnRight){// d key 
        //update x,y coordinates with rotation math
        this.theta += this.dTheta
        this.theta %= 360.0
    }
    if(data.turnTurretLeft){//left arrow key 
        this.turret.theta -= this.turret.dTheta
        this.turret.theta %= 360.0
    }
    if(data.turnTurretRight){//right arrow key 
        this.turret.theta += this.turret.dTheta
        this.turret.theta %= 360.0
    }
    if(data.shoot){
        this.shoot()
    }

  }


  shoot(){
    
    if(this.lastUpdateTime > this.lastShotTime + this.reloadTime){
      this.turret.active.push(new Bullet(this.centerX+2.0*this.turret.width*Math.cos((this.turret.theta+this.theta)*Math.PI/180.0), this.centerY+2.0*this.turret.width*Math.sin((this.turret.theta + this.theta)*Math.PI/180.0), this.turret.theta+this.theta))
      this.lastShotTime = this.lastUpdateTime
    }

  }
}

module.exports = Tank
