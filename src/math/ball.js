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
    nextIntersection(){
        
        var start = this.geo.center.add( Vector.polar( this.angle, this.geo.radius) )
        var end = this.geo.center.add( Vector.polar( this.angle+.9*pi*Math.sign(this.speed), this.geo.radius) )
        var seg = GeoSegment.betweenPoints( start, end )
        
        
        var wints = []
        all_walls.forEach(w => {
            let wint = seg.intersect(w)
            if( wint ){
                let cw = isClockwise( start, wint, this.geo.center )
                if( cw != aimClockwise ){
                    return
                }
                
                wints.push(wint)
            }     
        })
        
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
        
        
        var start = this.geo.center.add( Vector.polar( this.angle, this.geo.radius) )
        var end = this.geo.center.add( Vector.polar( wints[0].a, this.geo.radius) )
        return GeoSegment.betweenPoints(start, end)
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
                this.bounce(w,wint,dt,da)
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
    bounce(w,wint,dt,da){
        
        // compute euclidian movement angle after bounce
        var nextPos = this.geo.center.add(Vector.polar( this.angle+da, this.geo.radius ) )
        var d = nextPos.sub(this.pos)
        var angle = d.getAngle()
        var wangle = wint.sub(w.center).getAngle() + Math.PI/2
        var newAngle = 2*wangle - angle
        
        // change trajectory
        var a = this.pos
        var b = this.pos.add(Vector.polar(newAngle,10e-4))
        this.geo = Geodesic.withPoints(a,b)
        this.angle = a.sub(this.geo.center).getAngle()
        this.speed = Math.abs(this.speed)
        if( isClockwise( a, b, this.geo.center ) ){
            this.speed *= -1
        }
        this.speed *= (1.0-bounceLoss)
        this.updatePos()
    }
    
    draw(g){
        //this.geo.draw(g)
        g.beginPath()
        g.arc( this.pos.x, this.pos.y, .05*this.ds, 0, Math.PI*2 )
        g.fill()
    }
}