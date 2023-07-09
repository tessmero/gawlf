
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
// reset ball
function playerHitReset(){
    playerBall = Ball.fromPosVel( v(1e-5,1e-5), v(5e-5,0) )
}

// 
function ballHitTarget(){
        
}