const Turret = require('./Turret')
const Hitbox = require('./Hitbox')
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
    this.damage = 0.5;
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


  shoot(){
    
    if(this.lastUpdateTime > this.lastShotTime + this.reloadTime){
      this.turret.active.push(new Bullet(this.centerX+2.0*this.turret.width*Math.cos((this.turret.theta+this.theta)*Math.PI/180.0), this.centerY+2.0*this.turret.width*Math.sin((this.turret.theta + this.theta)*Math.PI/180.0), this.turret.theta+this.theta))
      this.lastShotTime = this.lastUpdateTime
    }

  }
}

module.exports = Tank