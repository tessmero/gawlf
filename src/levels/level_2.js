class Level2 extends Level {

    getStartPos(){
        return v(-.2,.2)
    }
    
    getTargetPos(){
        return v(.295,-.67)
    }

    getObstacles(){   
        return getPolygonSegs( .8, 10 )
    }
    
}