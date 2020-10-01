class Bullet{
    constructor(x=0, y=0, theta = 0){
        this.speed = 10.0
        this.width = 2.5
        this.height = 2.5
        this.diagnol = Math.sqrt(Math.pow(this.width,2) + Math.pow(this.height,2))
        this.theta = theta  
        this.omega = Math.atan2(this.height,this.width)*180.0/Math.PI
        this.centerX = x+this.width/2
        this.centerY = y+this.height/2
        this.color = 'red'
    }
}

module.exports = Bullet