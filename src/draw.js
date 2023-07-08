
    
function drawp(p,color){
    
    var rad = .04*getDistScaleFactor(p)
    
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(p.x,p.y,rad,0,2*Math.PI)
    ctx.fill()
}

function drawc(p,r,color){
    ctx.strokeStyle = 'black'
    ctx.lineWidth = .001
    ctx.beginPath()
    ctx.arc(p.x,p.y,r,0,Math.PI*2)
    ctx.stroke()
}
    
// Render graphics
function draw(fps, t) {
   
    ctx.fillStyle = backgroundColor
    ctx.fillRect( 0, 0, canvas.width, canvas.height )
    ctx.setTransform(canvasScale, 0, 0, canvasScale, canvasOffsetX, canvasOffsetY);
    // test
    //ctx.fillStyle = 'black'
    //ctx.fillRect( .25,.25,.5,.5 )
    
    //clip edges
    ctx.globalCompositeOperation = 'destination-in'
    ctx.fillStyle = "white";
    ctx.fillRect(-1,-1,2,2)
    ctx.globalCompositeOperation = 'source-over'
    
    // draw mouse position
    //drawp(mousePos,'red')
    
    // draw second position
    //drawp(secondPos,'blue')
    
    
    // draw edge circle
    drawc(center,crad,'black')
    
    
    
    //walls
    ctx.lineWidth = .001
    ctx.strokeStyle = 'black'
    all_walls.forEach(w => {
        w.draw(ctx)
    })
    
    //balls
    ctx.fillStyle = 'blue'
    ctx.strokeStyle = 'blue'
    all_balls.forEach(b => b.draw(ctx) )
    playerBall.draw(ctx)
    
    // aiming cursor
    ctx.strokeStyle = 'purple'
    ctx.fillStyle = 'purple'
    ctx.lineWidth = .001
    aimGeo.draw(ctx)
    ctx.lineWidth = .005
    //aimSeg.draw(ctx)
    drawAimArrow()
    //var gints = circle_intersections(...geo, center, crad)
    //gints.forEach( p => drawp( p, 'purple' ) )
    
    // draw lattice
    //xLats.forEach( geo => drawc(...geo,'black') )
    //yLats.forEach( geo => drawc(...geo,'black') )
    
    
    // Draw FPS on the screen
    //ctx.font = ".025px Arial";
    //ctx.textAlign = "left";
    //ctx.fillStyle = "black";
    //var x = .4
    //var y = .4
    //ctx.fillText("FPS: " + fps, x, y);
    
    
    // draw mouse location
    //if( mouse_forget_countdown > 0 ){
    //    ctx.fillStyle = "red"
    //    ctx.beginPath()
    //    ctx.arc( canvasMouseX, canvasMouseY, 10, 0, Math.PI*2 )
    //    ctx.fill()
    //}
    
    //y += 30
    //ctx.fillText(`camera: ${cameraX.toFixed(2)}, ${cameraY.toFixed(2)}, ${zoomLevel.toFixed(2)}`, x, y);
    //y += 30
    //ctx.fillText(gameState, x, y);
    //y += .03
    //ctx.fillText(`canvas pos: ${canvasMousePos.x}, ${canvasMousePos.y}`, x, y);
    //y += .03
    //ctx.fillText(`virtual pos: ${mousePos.x}, ${mousePos.y}`, x, y);
}

function drawAimArrow(){
    var tailThickness = .4*getDistScaleFactor(aimTailPos)
    var tailNorm = Vector.polar( aimSeg.a1, tailThickness/2 )
    
    var tipThickness = .4*getDistScaleFactor(playerBall.pos)
    var tipNorm = Vector.polar( aimSeg.a2, tipThickness/2 )
    
    var verts = [
        playerBall.pos.add(tipNorm),
        playerBall.pos.sub(tipNorm),
        aimTailPos.sub(tailNorm),
        aimTailPos.add(tailNorm)
    ]
    
    for( var i = 0 ; i < verts.length ; i++ ){
        GeoSegment.betweenPoints( verts[i], verts[(i+1)%verts.length] ).draw(ctx)
    }
}


function drawArrow(a,b) {
  var headlen = .1; 
  var angle = b.sub(a).getAngle()
  ctx.beginPath()
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.lineTo(b.x - headlen * Math.cos(angle - pi/6), b.y - headlen * Math.sin(angle - pi/6));
  ctx.moveTo(b.x, b.y);
  ctx.lineTo(b.x - headlen * Math.cos(angle + pi/6), b.y - headlen * Math.sin(angle + pi/6));
  ctx.fill()
}