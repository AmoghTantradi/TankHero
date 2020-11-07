const Constants = require('../lib/Constants')

class Bullet{
    constructor(x,y,theta){

        this.centerX = x
        this.centerY = y

        this.dx = 0 
        this.dy = 0 
        this.theta = theta


        this.speed = Constants.BULLET_SPEED
        this.color = Constants.BULLET_DEFAULT_COLOR
        this.width = Constants.BULLET_WIDTH
        this.height = Constants.BULLET_HEIGHT


        this.diagnol = Math.sqrt(Math.pow(this.width,2) + Math.pow(this.height,2))
        this.omega = Math.atan2(this.height,this.width)*180.0/Math.PI
        
        
        this.last = 0
        this.dT = 0 
    }


    update(last, dT){

        //console.log('last',this.last, 'dT',  this.dT)

        this.last = last

        const current = Date.now()


        if(dT){
            this.dT = dT
        }
        else if(this.last === 0){
            this.dT = 0 
        }
        else{
            this.dT = (current - this.last)
        }

        //this.last = current
        this.dx = this.speed*Math.cos(this.theta*Math.PI/180)*this.dT
        this.dy = this.speed*Math.sin(this.theta*Math.PI/180)*this.dT
        this.centerX += this.dx
        this.centerY += this.dy

      //  console.log('dT',this.dT, 'dx',this.dx,'dy', this.dy)

    }


}

module.exports = Bullet