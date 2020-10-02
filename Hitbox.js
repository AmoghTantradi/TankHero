//helper function to determine the vertices of a rectangle rotated clockwise given its center and the length of its diagnol

function getPoints(centerX, centerY,diagnol, theta, omega){
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
function intersects(rectA,centerX,centerY){

	return (centerX >= Math.min(rectA[0].x, rectA[1].x,rectA[2].x,rectA[3].x) && centerX <= Math.max(rectA[0].x, rectA[1].x,rectA[2].x,rectA[3].x) && centerY >= Math.min(rectA[0].y,rectA[1].y,rectA[2].y,rectA[3].y) && centerY <= Math.max(rectA[0].y,rectA[1].y,rectA[2].y,rectA[3].y))
}



function isHit(player, bullet){//checks if a player has been hit by a bullet 
		
	
	playerRect = getPoints(player.centerX,player.centerY, player.diagnol, player.theta, player.omega) //finds the vertices of the tank given its center points and its diagnol

	//only an approximation
	return intersects(playerRect, bullet.centerX, bullet.centerY) //doPolygonsIntersect(playerRect,bulletRect)
}


function hitbox(players){ //this will handle the logic for a tank being hit by a bullet

	for(id in players){

		const player = players[id]

		for(otherId in players){

			const otherPlayer = players[otherId] 

			if(id != otherId){
				for(let i = 0; i < player.turret.active.length; i++){
					if (isHit(otherPlayer,player.turret.active[i])){

					//	otherPlayer.color = 'blue' //debugging purposes
					//	console.log('hit!') // debugging
						if( !(player.team === otherPlayer.team)){
							otherPlayer.health -= otherPlayer.damage
						}
						player.turret.active.splice(i,1)
						i--
					}
				}
			}
		}
	}
	return 
}

module.exports = hitbox
