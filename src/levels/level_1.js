class Level1 extends Level {

    getStartPos(){
        return v(-.2,.2)
    }
    
    getTargetPos(){
        return v(.2,-.2)
    }

    getObstacles(){   
        return getPolygonSegs( .6, 10 )
    }
    
}