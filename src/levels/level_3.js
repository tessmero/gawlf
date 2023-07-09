class Level3 extends Level {

    getStartPos(){
        return v(-.2,.2)
    }
    
    getTargetPos(){
        return v(.2,-.4)
    }

    getObstacles(){   
        return getPolygonSegs( .7, 5 ).concat( getPolygonSegs( .15, 5 ) )
    }
    
}