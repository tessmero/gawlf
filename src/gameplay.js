

// return true if the ball is
// not moving much and is ready to be hit by the player
function ballIsHittable(){
    return Math.abs(playerBall.speed) < 1e-4   
}

// set ball trajectory
// moving away from the mouse
function playerHitBall(){
    if( (!aimBall) || (!ballIsHittable()) ) return
    playerBall = aimBall
}

// player clicked red button
// also called on game start and level advancement
function resetLevel(){
    playerBall = Ball.fromPosVel(startPos,v(2e-5,1e-5))
}

// called when ball is contained in target
function ballHitTarget(){
    advanceLevel()
}

// called on game start
// called after hitting target
function advanceLevel(){
    currentLevel = getNextLevel()
    allWalls = currentLevel.getObstacles()
    startPos = currentLevel.getStartPos()
    targetPos = currentLevel.getTargetPos()
    resetLevel()
}