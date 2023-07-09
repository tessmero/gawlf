class Level1a extends Level {

    getStartPos(){
        return v(-.1,.3)
    }
    
    getTargetPos(){
        return v(0,-.6)
    }

    getObstacles(){   
        var lr = .4
        var r = .5
        var br = .7
        return getSegs( [v(-lr,r),v(-lr,-r),v(0,-br),v(lr,-r),v(lr,r),v(0,br)] )
    }
    
}