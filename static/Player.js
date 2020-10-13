
import Brush from './Brush.js';

export default class Player{

    constructor(ctx){
        this.player =  { //json object that represents the player's state of motion
            forward:false,
            back:false,
            turnLeft:false,
            turnRight: false,
            turnTurretLeft: false,
            turnTurretRight: false,
            shoot :false
        }
        this.input()
        this.brush = new Brush(ctx)
    }

    input(){
        document.addEventListener('keydown', (event) => {
            switch(event.keyCode){
                case 87:
                    this.player.forward = true
                    break
                case 83:
                    this.player.back = true
                    break
                case 65:
                    this.player.turnLeft = true
                    break
                case 68:
                    this.player.turnRight = true
                    break
                case 37:
                    this.player.turnTurretLeft = true
                    break
                case 39:
                    this.player.turnTurretRight = true
                    break
                case 38:
                    this.player.shoot = true
                    break
                default:
                    break
            }
    
        })
    
        document.addEventListener('keyup', (event) => {
            
            switch(event.keyCode){
                case 87:
                    this.player.forward = false
                    break
                case 83:
                    this.player.back = false
                    break
                case 65:
                    this.player.turnLeft = false
                    break
                case 68:
                    this.player.turnRight = false
                    break
                case 37:
                    this.player.turnTurretLeft = false
                    break
                case 39:
                    this.player.turnTurretRight = false
                    break
                case 38:
                    this.player.shoot = false
                    break 
                default:
                    break 
            }
        })
    }




}