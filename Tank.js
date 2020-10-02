const Turret = require('./Turret')


class Tank {

  constructor(x=400, y=300, color='brown',turretColor='green') {
    this.dTheta = 1.0;
    this.speed = 1.75;
    this.color =  color
    this.turretColor = turretColor
    this.health = 100;
    this.maxPossibleHealth = 100
    this.damage = 0.5;
    this.width = 40.0;
    this.height = 20.0;
    this.diagnol = Math.sqrt(Math.pow(20,2) + Math.pow(40,2))
    this.theta = 0;
    this.omega = Math.atan2(this.height, this.width) * 180.0/Math.PI
    this.centerX = x + this.width / 2;
    this.centerY = y + this.height / 2;
    this.turret = new Turret();
    
  }

}

module.exports = Tank
