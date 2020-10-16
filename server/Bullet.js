class Bullet{
    constructor(x,y,theta){
        this.speed = 1.2
        this.dx = 0 
        this.dy = 0 
        this.width = 5
        this.height = 5
        this.diagnol = Math.sqrt(Math.pow(this.width,2) + Math.pow(this.height,2))
        this.centerX = x
        this.centerY = y
        this.theta = theta  
        this.omega = Math.atan2(this.height,this.width)*180.0/Math.PI
        this.color = 'red'
        
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