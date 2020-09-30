

function isHit(player, bullet){//checks if a player has been hit by a bullet (to do this we will use vectors)
		
	//basically want to see if the bullet is within the player

	const bulletCenterX = bullet.x + bullet.width / 2
	const bulletCenterY = bullet.y + bullet.height / 2

	const x1 = player.x
	const y1 = player.y

	const x2 = x1 + player.width*Math.cos(player.theta * Math.PI/180.0)
	const y2 = y1 + player.width*Math.sin(player.theta * Math.PI/180.0)

	const x3 = x1 -  player.height* Math.cos((90-player.theta)*Math.PI/180.0)
	const y3 = y1 + player.height * Math.sin((90-player.theta)*Math.PI/180.0)

	const x4 = x2 - player.height*Math.cos((90-player.theta)*Math.PI/180.0)
	const y4 = y2 + player.height*Math.sin((90-player.theta)*Math.PI/180.0)

	console.log('y1',y1, 'y2', y2, 'y3', y3, 'y4', y4)

	//console.log( 'bulletCenterY', bulletCenterY, 'v1: ', v1*(bulletCenterX-x1) + y1, 'v2: ' , v2*(bulletCenterX-x1)+ y1, 'v3: ', v3*(bulletCenterX-x3)+ y3, 'v4: ', v4*(bulletCenterX - x2)+ y2)
	//this will do for now 
	return (bulletCenterY >= Math.min(y1,y2,y3,y4) && bulletCenterY <= Math.max(y1,y2,y3,y4) && bulletCenterX <= Math.max(x1,x2,x3,x4) && bulletCenterX >= Math.min(x1,x2,x3,x4))

}






function hitbox(players){ //this will handle the logic for a tank being hit by a bullet

	for(id in players){

		const player = players[id]

		for(otherId in players){

			const otherPlayer = players[otherId] 

			if(id != otherId){
				for(let i = 0; i < player.turret.active.length; i++){
					if (isHit(otherPlayer,player.turret.active[i])){

						otherPlayer.color = 'blue' //debugging purposes
						otherPlayer.health -= otherPlayer.damage
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
