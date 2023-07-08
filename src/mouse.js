function updateMousePos(event){
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;
    
    canvasMousePos = new Vector( 
        (event.clientX - rect.left) * scaleX, 
        (event.clientY - rect.top) * scaleY 
    
    )
    mousePos = new Vector( 
        virtualMouseX = (canvasMousePos.x-canvasOffsetX)/canvasScale, 
        virtualMouseY = (canvasMousePos.y-canvasOffsetY)/canvasScale
    )
}

function mouseClicked(event){    
    //secondPos = mousePos.copy()

    updateMousePos(event)
    playerHitBall()
}