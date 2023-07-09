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
    
    updateAim()
}

// touch device
function touchStart(event){
    isMobileDevice = true
    updateMousePos(event.touches[0])
    
}
function touchMove(event){
    isMobileDevice = true
    updateMousePos(event.touches[0])
}
function touchEnd(event){
    isMobileDevice = true
    playerHitBall()
}

function mouseMove(event){
    if(isMobileDevice) return
    
    updateMousePos(event)
}

function mouseClick(event){   
    if(isMobileDevice) return
    
    updateMousePos(event)
    playerHitBall()
}