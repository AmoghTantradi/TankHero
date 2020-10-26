const Turret = require('./Turret')
const Hitbox = require('../lib/Hitbox')
const Bullet = require('./Bullet')

class Tank {

  constructor(x=400, y=300, color='brown',turretColor='green', name='') {
    this.name = name;
    this.dTheta = 1.0
    this.speed = 1.75;
    this.color =  color
    this.turretColor = turretColor
    this.team = (color === 'brown') ? ('axis') : 'allied'
    this.health = 100;
    this.maxPossibleHealth = 100
    this.damage = 5;
    this.width = 40.0;
    this.height = 20.0;
    this.diagnol = Math.sqrt(Math.pow(20,2) + Math.pow(40,2))
    this.theta = 0;
    this.omega = Math.atan2(this.height, this.width) * 180.0/Math.PI
    this.centerX = x 
    this.centerY = y 
    this.turret = new Turret()
    this.hitbox = new Hitbox()

    this.reloadTime = 1000 // 5 seconds 
    this.lastShotTime = 0 
    this.lastUpdateTime = 0 

    //prediction and reconcilliation

    this.lastProcessedInput = 0

    //interpolation

    //this.bufferQueue = []

  }


  update(last,dT){

      this.lastUpdateTime = last

      for(let i = 0 ; i < this.turret.active.length; i++){


        if(this.hitbox.isOutside(0,0,800,600,this.turret.active[i], this.turret.active[i].dx, this.turret.active[i].dy)){
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
    if(data.back){//s key 
        this.centerX -= this.speed*Math.cos(this.theta*Math.PI/180.0)
        this.centerY -= this.speed*Math.sin(this.theta*Math.PI/180.0)
    }
    if(data.turnLeft){// a key 
        //update x,y coordinates in rotation math
        this.theta -= this.dTheta
        this.theta %= 360
    }
    if(data.turnRight){// d key 
        //update x,y coordinates with rotation math
        this.theta += this.dTheta
        this.theta %= 360
    }
    if(data.turnTurretLeft){//left arrow key 
        this.turret.theta -= this.turret.dTheta
        this.turret.theta %= 360
    }
    if(data.turnTurretRight){//right arrow key 
        this.turret.theta += this.turret.dTheta
        this.turret.theta %= 360
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
