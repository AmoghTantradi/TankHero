//helper  class  to determine intersection logic, boundary logic, and other necessary physics for this game

const Tank = require('../server/Tank')

class Hitbox{

	//checks if a point is within a certain zones

	isInsideCheckpoint(Xmin, Ymin, Xmax, Ymax, object, dx=0, dy=0){
		const points = this.getPoints(object.centerX + dx, object.centerY + dy, object.diagnol, object.theta, object.omega)

		for(let i = 0 ; i < points.length; i++){

			const point = points[i]
			
			const x = point.x
			const y = point.y

			if(x >= Xmin && y >= Ymin && x <= Xmax && y <= Ymax ){
				return true
			}


		}

		return false

	}


	isOutsideGamescreen(boundaryX1, boundaryY1, boundaryX2, boundaryY2, object, dx=0,dy=0, dTheta = 0){

		const points = this.getPoints(object.centerX + dx, object.centerY + dy, object.diagnol, object.theta, object.omega)


		for(let i = 0 ; i < points.length; i++){

			const point = points[i]
			
			const x = point.x
			const y = point.y

			if(x < Math.min(boundaryX1,boundaryX2) || x > Math.max(boundaryX1, boundaryX2) || y < Math.min(boundaryY1, boundaryY2) || y > Math.max(boundaryY1, boundaryY2)){
				return true
			}
		}
	
		return false
	}

	getPoints(centerX, centerY,diagnol, theta, omega){
		const x1 =  centerX - 0.5*diagnol*Math.cos((theta+omega)*Math.PI/180.0)
		const y1 =  centerY - 0.5*diagnol*Math.sin((theta+omega)*Math.PI/180.0)
		
		const x2 = centerX + 0.5*diagnol*Math.cos((theta-omega)*Math.PI/180.0)
		const y2 = centerY + 0.5*diagnol*Math.sin((theta-omega)*Math.PI/180.0)
		
		const x3 = centerX  + 0.5*diagnol*Math.cos((theta+omega) *Math.PI/180.0) 
		const y3 = centerY + 0.5*diagnol*Math.sin((theta+omega)*Math.PI/180.0)

		const x4 = centerX - 0.5*diagnol*Math.cos((theta-omega)*Math.PI/180.0)
		const y4 = centerY - 0.5*diagnol*Math.sin((theta-omega)*Math.PI/180.0) 

		return [{x:x1, y:y1},{x:x2,y:y2},{x:x3,y:y3},{x:x4,y:y4}]
	}



	//approximation that serves our purpose: since the size of the tanks are small, it makes no difference to simply give a bounding box. The tradeoff for O(1) complexity is worth the small 
	//discrepency in accurcay
	intersects(rectA,centerX,centerY, dx = 0 , dy = 0){

		return (((centerX+dx >= Math.min(rectA[0].x, rectA[1].x,rectA[2].x,rectA[3].x)) || ( centerX >= Math.min(rectA[0].x, rectA[1].x,rectA[2].x,rectA[3].x))) && ((centerX + dx <= Math.max(rectA[0].x, rectA[1].x,rectA[2].x,rectA[3].x)) || (centerX <= Math.max(rectA[0].x, rectA[1].x,rectA[2].x,rectA[3].x))) && ((centerY + dy >= Math.min(rectA[0].y,rectA[1].y,rectA[2].y,rectA[3].y)) || (centerY >= Math.min(rectA[0].y,rectA[1].y,rectA[2].y,rectA[3].y))) && ((centerY+dy <= Math.max(rectA[0].y,rectA[1].y,rectA[2].y,rectA[3].y)) || (centerY <=  Math.max(rectA[0].y,rectA[1].y,rectA[2].y,rectA[3].y) )))
	}



	isHit(player, bullet){//checks if a player has been hit by a bullet 
			
		
		const playerRect = this.getPoints(player.centerX,player.centerY, player.diagnol, player.theta, player.omega) //finds the vertices of the tank given its center points and its diagnol

		//only an approximation
		return this.intersects(playerRect, bullet.centerX, bullet.centerY, bullet.dx, bullet.dy) //doPolygonsIntersect(playerRect,bulletRect)
	}


	hitbox(players){ //this will handle the logic for a tank being hit by a bullet

		players.forEach((player, socket) =>{

			players.forEach((otherPlayer, otherSocket) =>{
				if(socket !== otherSocket){
					for(let i = 0 ; i < player.turret.active.length; i++){
						if(this.isHit(otherPlayer, player.turret.active[i])){

							if(!(player.team === otherPlayer.team)){
								otherPlayer.health -= otherPlayer.damage
							}
							player.turret.active.splice(i, 1)
							i--
						}
					}
				}
			})


		})
		return 
	}

}

module.exports = Hitbox
