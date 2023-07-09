class Level4 extends Level {

    getStartPos(){
        return v(-.4,.4)
    }
    
    getTargetPos(){
        return v(.2,-.4)
    }

    getObstacles(){   
        return []
    }
    
}