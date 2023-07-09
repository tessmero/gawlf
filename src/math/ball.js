// ball moving along a geodesic,

// moves a constant hyperbolic distance per ms
class Ball {
    
    // geo - the geodesic fo this ball to follow
    // angle - the position on the geodesic
    // speed - hyperbolic distance per millisecond
    constructor( geo, angle, speed ){
        this.geo = geo
        this.angle = angle
        this.speed = speed
        this.updatePos()
    }
    
    // construct ball with given position and velocity
    static fromPosVel( pos, vel ){
        var a = pos
        var b = pos.add(Vector.polar(vel.getAngle(),10e-4))
        var geo = Geodesic.withPoints(a,b)
        var angle = a.sub(geo.center).getAngle()
        var speed = vel.getMagnitude() * getDistScaleFactor(pos)
        if( isClockwise( a, b, geo.center ) ){
            speed *= -1
        }
        speed *= (1.0-bounceLoss)
        return new Ball( geo, angle, speed )
    }
    
    // get path from current pos to next obstacle
    // return null if no obstacles
    getNextIntersection(debug=false){
        
        if( this.nextInt ){
            return this.nextInt
        }
        
        var start = this.geo.center.add( Vector.polar( this.angle, this.geo.radius) )
        var end = this.geo.center.add( Vector.polar( this.angle+.9*pi*Math.sign(this.speed), this.geo.radius) )
        var seg = GeoSegment.betweenPoints( start, end )
        
        
        
        var wints = []
        all_walls.forEach(w => {
            let wint = seg.intersect(w)
            
            
            if( wint ){
                if(debug) debugPoints.push(wint)
                let cw = isClockwise( start, wint, this.geo.center )
                if( cw != aimClockwise ){
                    return
                }
                wint.wa = wint.sub(w.center).getAngle()
                wints.push(wint)
            }     
        })
        
        if(debug) return seg
        
        if( wints.length == 0 ){
            return null
        }
        
        wints.forEach(wint => {
            wint.a = wint.sub(this.geo.center).getAngle()
            wint.da = this.angle-wint.a
        })
        
                
        wints.sort(function(a, b) {
            return b.da - a.da
        });
        
        this.targetAngle = wints[0].a
        var start = this.geo.center.add( Vector.polar( this.angle, this.geo.radius) )
        var end = this.geo.center.add( Vector.polar( this.targetAngle, this.geo.radius) )
        var cw = isClockwise( this.geo.center, start, end )
        
        this.nextInt = GeoSegment.betweenPoints(start, end)
        this.nextInt.a = wints[0].a + (cw ? -pio2 : pio2 )
        this.nextInt.wa = wints[0].wa
        return this.nextInt
    }
    
    // get ball instance to replace this on the next bounce
    // return null if no obstacles in path
    getNextBall(){
        var nextInt = this.getNextIntersection()
        if( !nextInt ){
            return null
        }
        
        if( this.nextBall ){
            return this.nextBall
        }
        
        //compute trajectory after bounce
        var a = nextInt.q
        var angle = nextInt.a
        var wangle = nextInt.wa + pio2
        
        var params = this._bounce(a,angle,wangle)
        var nextBall = new Ball( ...params )
        nextBall.updatePos()
        
        //var dt = 10
        //var da = nextBall.angularVel * dt
        //nextBall.angle += da
        
        this.nextBall = nextBall
        return this.nextBall
    }
    
    updatePos(){
        
        // compute euclidian distance from center
        this.pos = this.geo.center.add(Vector.polar( this.angle, this.geo.radius ) )
        
        // compute hyperbolic distance scale factor
        this.ds = getDistScaleFactor(this.pos)
        
        this.angularVel = this.speed*this.ds / this.geo.radius
    }
    
    update(dt){
        this.updatePos()
        var da = this.angularVel * dt
        var prad = this.pos.getMagnitude()
        
        // check for intersections with walls
        var bounced = false
        var seg = new GeoSegment( this.geo.center, this.geo.radius, this.angle, this.angle+da )
        all_walls.every(w => {
            let wint = seg.intersect(w)
            if( wint ){
                this.bounce(w,wint,da)
                return false
            }               
            return true
        })
        
        // move forward
        var da = this.angularVel * dt
        this.angle += da
        this.speed *= (1.0-friction*dt)
    }
    
    // used in update
    bounce(w,wint,da){
        
        var nextPos = this.geo.center.add(Vector.polar( this.angle+da, this.geo.radius ) )
        var d = nextPos.sub(this.pos)
        var a = this.pos
        var angle = d.getAngle()
        var wangle = wint.sub(w.center).getAngle() + pio2
        var params = this._bounce(a,angle,wangle)
        this.geo = params[0]
        this.angle = params[1]
        this.speed = params[2]
        this.updatePos()
    }
    
    _bounce(a,angle,wangle){
        var newAngle = 2*wangle - angle
        var b = a.add(Vector.polar(newAngle,10e-4))
        var geo = Geodesic.withPoints(a,b)
        var gangle = a.sub(geo.center).getAngle()
        var speed = Math.abs(this.speed)
        if( isClockwise( a, b, geo.center ) ){
            speed *= -1
        }
        speed *= (1.0-bounceLoss)
        
        debugEuclidSegs.push([a,a.add(Vector.polar(angle,1e-1)),'green'])
        debugEuclidSegs.push([a,a.add(Vector.polar(wangle,1e-1)),'red'])
        debugEuclidSegs.push([a,a.add(Vector.polar(newAngle,1e-1)),'blue'])
        
        return [geo,gangle,speed]
    }
    
    draw(g){
        //this.geo.draw(g)
        g.beginPath()
        g.arc( this.pos.x, this.pos.y, .05*this.ds, 0, Math.PI*2 )
        g.fill()
    }
}