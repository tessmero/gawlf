
    
function drawp(p,color){
    
    var rad = .04*getDistScaleFactor(p)
    
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(p.x,p.y,rad,0,2*Math.PI)
    ctx.fill()
}

function drawc(p,r,color){
    ctx.strokeStyle = color
    ctx.lineWidth = .001
    ctx.beginPath()
    ctx.arc(p.x,p.y,r,0,Math.PI*2)
    ctx.stroke()
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
    drawc(center,crad,'black')
    
    //walls
    ctx.lineWidth = .002
    ctx.strokeStyle = 'black'
    all_walls.forEach(w => {
        //ctx.strokeStyle = w.intersect(aimSeg) ? 'red' : 'black'
        w.draw(ctx)
    })
    
    //balls
    ctx.fillStyle = 'blue'
    ctx.strokeStyle = 'blue'
    all_balls.forEach(b => b.draw(ctx) )
    playerBall.draw(ctx)
    
    // aiming cursor
    ctx.lineWidth = .005
    //aimSeg.draw(ctx)
    if( aimGeo ) drawAimArrow()
    //var gints = circle_intersections(...geo, center, crad)
    //gints.forEach( p => drawp( p, 'purple' ) )
    
    // draw lattice
    //xLats.forEach( geo => drawc(...geo,'black') )
    //yLats.forEach( geo => drawc(...geo,'black') )
    
    debugPoints.forEach(p => drawp(p,'red'))
    debugEuclidSegs.forEach(abc => drawl(...abc))
    
    
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
    
    if( Math.abs(playerBall.speed) > 1e-4 ){
        return
    }
    
    ctx.strokeStyle = 'black'
    ctx.lineWidth = .001
    //if( aimGeo ) aimGeo.draw(ctx)
    
    if( aimArrowSeg ){
        ctx.strokeStyle = 'orange'
        ctx.lineWidth = .02
        var b = null
        for( var i = 0 ; i < 2 ; i++ ){
            if( b == null ){
                b = aimBall
            } else {
                b = b.getNextBall()
            }
            var laserSeg = b.getNextIntersection(debug=i>0)
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
    
    ctx.strokeStyle = 'black'
    ctx.lineWidth = .002
    for( var i = 0 ; i < verts.length ; i++ ){
        GeoSegment.betweenPoints( verts[i], verts[(i+1)%verts.length] ).draw(ctx)
    }
}