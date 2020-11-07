const Constants = require('../lib/Constants')

class Turret {
    constructor() {
      this.theta = 0;
      this.active = []

      this.dTheta = Constants.TURRET_DTHETA
      this.width = Constants.TURRET_WIDTH
      this.height = Constants.TURRET_HEIGHT
    }


  }
  
  module.exports = Turret
