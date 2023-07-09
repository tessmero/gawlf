

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
    debugPoints = []
    debugEuclidSegs = []
    fitToContainer()
    
    all_balls.forEach( b => b.update(dt, all_walls) )
    playerBall.update(dt,all_walls)
    
    updateAim()
}

function updateAim(){
    if( !mousePos ){
        return
    }
    
    aimGeo = Geodesic.withPoints(mousePos,playerBall.pos)
    var angle = playerBall.pos.sub(aimGeo.center).getAngle()
    var tailHLen = 1 //hyperbolic
    var tailLen = tailHLen * getDistScaleFactor(playerBall.pos)//euclidian
    var da = tailLen / aimGeo.radius
    var mouseDa = Math.abs(cleanAngle(mousePos.sub(aimGeo.center).getAngle() - angle))
    var da = Math.min( da, mouseDa )
    aimClockwise = isClockwise(playerBall.pos, aimGeo.center, mousePos )
    if( aimClockwise ){
        da *= -1
    }
    aimStrength = da*aimGeo.radius
    aimTailPos = aimGeo.center.add( Vector.polar( angle-da, aimGeo.radius ) )
    aimArrowSeg = GeoSegment.betweenPoints(aimTailPos, playerBall.pos)

    angle = playerBall.pos.sub(aimGeo.center).getAngle()
    var speed = 2e-2 * Math.abs(aimStrength)
    if( isClockwise(playerBall.pos, aimGeo.center, mousePos ) ){
        speed *= -1
    }
    aimBall = new Ball( aimGeo, angle, speed )
}