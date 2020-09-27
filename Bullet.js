class Bullet{
    constructor(x=0, y=0, theta = 0){
        this.theta = theta  
        this.speed = 10.0
        this.x = x
        this.y = y
        this.width = 5
        this.height = 5
    }
}

module.exports = Bullet