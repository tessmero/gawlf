class Level5 extends Level {

    getStartPos(){
        return v(-.2,.2)
    }
    
    getTargetPos(){
        return v(.2,-.4)
    }

    getObstacles(){   
        return getPolygonSegs( .15, 5 )
    }
    
}