

function fitToContainer(){
  canvas.style.width='100%';
  canvas.style.height='100%';  
  canvas.width  = canvas.offsetWidth/graphics_scale;
  canvas.height = canvas.offsetHeight/graphics_scale;
  
    
    var padding = 10; // Padding around the square region
    var dimension = Math.min(canvas.width, canvas.height) - padding * 2;
    canvasScale = dimension/2;
    canvasOffsetX = canvas.width/2;
    canvasOffsetY = canvas.height/2;
}

function update(dt) {
    fitToContainer()
    
    all_balls.forEach( b => b.update(dt, all_walls) )
    playerBall.update(dt,all_walls)
    
    //var aimAngle = playerBall.pos.sub(mousePos).getAngle()
    //aimGeo = Geodesic.withPoints(playerBall.pos.sub(Vector.polar(aimAngle,5e-10)), playerBall.pos)
    aimGeo = Geodesic.withPoints(mousePos,playerBall.pos)
    
    var angle = playerBall.pos.sub(aimGeo.center).getAngle()
    var tailHLen = 1 //hyperbolic
    var tailLen = tailHLen * getDistScaleFactor(playerBall.pos)//euclidian
    var da = tailLen / aimGeo.radius
    var mouseDa = Math.abs(cleanAngle(mousePos.sub(aimGeo.center).getAngle() - angle))
    var da = Math.min( da, mouseDa )
    if( isClockwise(playerBall.pos, aimGeo.center, mousePos ) ){
        da *= -1
    }
    aimStrength = da
    aimTailPos = aimGeo.center.add( Vector.polar( angle-da, aimGeo.radius ) )
    aimSeg = GeoSegment.betweenPoints(aimTailPos, playerBall.pos)
}