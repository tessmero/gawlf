
// reset ball trajectory
// moving away from the mouse
function playerHitBall(){
    var angle = playerBall.pos.sub(aimGeo.center).getAngle()
    var speed = 10e-4
    if( isClockwise(playerBall.pos, aimGeo.center, mousePos ) ){
        speed *= -1
    }
    playerBall = new Ball( aimGeo, angle, speed )
}