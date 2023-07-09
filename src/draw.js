
    
function drawp(p,color){
    
    var rad = .04*getDistScaleFactor(p)
    
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(p.x,p.y,rad,0,2*Math.PI)
    ctx.fill()
}

function drawc(p,r,color,fill=false){
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.arc(p.x,p.y,r,0,Math.PI*2)
    ctx.stroke()
    if( fill ){
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(p.x,p.y,r,0,Math.PI*2)
        ctx.fill()
    }
}

function drawl(a,b,color){
    ctx.strokeStyle = color
    ctx.lineWidth = .001
    ctx.beginPath()
    ctx.moveTo(a.x,a.y)
    ctx.lineTo(b.x,b.y)
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
    ctx.lineWidth = .006
    drawc(center,crad,'black')
    
    //walls
    ctx.lineWidth = .004
    ctx.strokeStyle = 'black'
    allWalls.forEach(w => {
        //ctx.strokeStyle = w.intersect(aimSeg) ? 'red' : 'black'
        w.draw(ctx)
    })
    
    // target
    drawc( targetPos, targetEuclidRad, 'black', fill = true )
    
    //balls
    ctx.fillStyle = 'blue'
    ctx.strokeStyle = 'blue'
    all_balls.forEach(b => b.draw(ctx) )
    playerBall.draw(ctx)
    
    
    // draw reset button
    ctx.lineWidth = .004
    var hoverReset = mouseInResetButton()
    drawc( ...resetButton, '#FAA', fill=hoverReset)
    drawc( ...resetButton, 'red')
    ctx.font = ".05px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = 'middle';
    ctx.fillStyle = "black";
    var x = .4
    var y = .4
    ctx.fillText("RESET", resetButton[0].x, resetButton[0].y+.01 );
    if( hoverReset ){
        return
    }
    
    // aiming cursor
    ctx.lineWidth = .005
    //aimSeg.draw(ctx)
    if( aimGeo ) drawAimIndicator()
        
    //var gints = circle_intersections(...geo, center, crad)
    //gints.forEach( p => drawp( p, 'purple' ) )
    
    // draw lattice
    //xLats.forEach( geo => drawc(...geo,'black') )
    //yLats.forEach( geo => drawc(...geo,'black') )
    
    debugPoints.forEach(p => drawp(p,'red'))
    //debugEuclidSegs.forEach(abc => drawl(...abc))
    
    
    
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

function drawAimIndicator(){
    
    if( !ballIsHittable() ){
        return
    }
    
    ctx.strokeStyle = 'black'
    ctx.lineWidth = .001
    if( aimGeo ) aimGeo.draw(ctx)
    
    if( aimArrowSeg ){
        ctx.strokeStyle = '#AAF'
        ctx.lineWidth = .01
        var dash = .1*aimStrength
        var b = null
        for( var i = 0 ; i < 2 ; i++ ){
            if( b == null ){
                b = aimBall
            } else {
                b = b.getNextBall()
            }
            var laserSeg = b.getNextIntersection()
            if( !laserSeg ){
                break
            }
            laserSeg.draw(ctx)
        }
    }
    
    var basethickness = aimStrength*.5
    var headBasePos = aimArrowSeg.getMidPoint(.7)
    var tailPos = aimTailPos
    var tipPos = aimArrowSeg.getMidPoint(.9)
    
    var headBaseAngle = headBasePos.sub(aimGeo.center).getAngle()
    var tailAngle = tailPos.sub(aimGeo.center).getAngle()
    if( false & aimClockwise ){
        var t = headBaseAngle
        headBaseAngle = tailAngle
        tailAngle = t
    }
    
    var tailThickness = basethickness*getDistScaleFactor(aimTailPos)
    var tailNorm = Vector.polar( tailAngle, tailThickness/2 )
    
    var headBaseThickness = basethickness*getDistScaleFactor(headBasePos)
    var headBaseNorm = Vector.polar( headBaseAngle, headBaseThickness/2 )
    var headFlairNorm = headBaseNorm.mul(2)
    
    var verts = [
        aimTailPos.add(tailNorm),
        headBasePos.add(headBaseNorm),
        headBasePos.add(headFlairNorm),
        tipPos,
        headBasePos.sub(headFlairNorm),
        headBasePos.sub(headBaseNorm),
        aimTailPos.sub(tailNorm),
    ]
    
    ctx.strokeStyle = 'blue'
    ctx.lineWidth = .008
    ctx.lineCap = 'round'
    for( var i = 0 ; i < verts.length ; i++ ){
        GeoSegment.betweenPoints( verts[i], verts[(i+1)%verts.length] ).draw(ctx)
    }
}