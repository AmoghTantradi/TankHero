const Turret = require('./Turret')
//import InputHandler from "/src/InputHandler";

class Tank {

  constructor(x=400, y=300) {
    this.theta = 0;
    this.dTheta = 1.0;
    this.speed = 1.75;
    this.moving = false;
    this.health = 100;
    this.damage = 5.5;
    this.width = 40.0;
    this.height = 20.0;
    this.x = x
    this.y = y
    this.centerX = this.x + this.width / 2;
    this.centerY = this.y + this.height / 2;
    this.turret = new Turret(this.x, this.y);
    
  }

}

module.exports = Tank