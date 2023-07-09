// a segment of a geodesic

class GeoSegment extends Geodesic{
    constructor(center,radius,a1,a2,p=null,q=null){
        super(center,radius)
        this.a1 = a1
        this.a2 = a2
        this.p = p || center.add(Vector.polar(a1,radius))
        this.q = q || center.add(Vector.polar(a2,radius))
        
        if( Math.abs(cleanAngle(a1-a2)) < 10e-4 ){
            console.log('decided segment is straight',a1,a2,Math.abs(cleanAngle(a1-a2)))
            this.straight = true
        }
    }
    
    // construct segment connecting points p and q
    static betweenPoints(p,q){
        var geo = Geodesic.withPoints(p,q)
        var c = geo.center
        var r = geo.radius
        var a1 = cleanAngle(p.sub(c).getAngle())
        var a2 = cleanAngle(q.sub(c).getAngle())
        var a = cleanAngle(a2 - a1)
        
        if( a < 0 ){
            var t = a2
            a2 = a1
            a1 = t
        }
        
        return new GeoSegment( c, r, a1, a2, p, q )
    }
    
    // get point on segment
    getMidPoint(r=.5){
        var a = midpoint( this.p, this.q, r ).sub( this.center ).getAngle()
        return this.center.add( Vector.polar( a, this.radius ) ) 
    }
    
    // assuming the given point is on our geodesic,
    // return true if it is contained in thie segment
    containsPoint(p){
        var a = p.sub(this.center).getAngle()
        var da = Math.abs(this.a1-this.a2)
        var d1 = Math.abs(cleanAngle(a-this.a1))
        var d2 = Math.abs(cleanAngle(a-this.a2))
        return (d1<=da) & (d2<=da)
    }
    
    // get intersection point with another segment
    // or null if they do not intersect
    intersect(o){
        var cints = circle_intersections( this.center, this.radius, o.center, o.radius )
        return cints.find( ci => ((ci.getMagnitude() < crad) && this.containsPoint(ci) && o.containsPoint(ci)) )
    }
    
    draw(g){
        g.beginPath()
        
        if( this.straight ){
            g.moveTo(this.p.x,this.p.y)
            g.lineTo(this.q.x,this.q.y)
            
        } else {
            g.arc(this.center.x, this.center.y, 
                this.radius, this.a1, this.a2)
        }
        
        g.stroke()
    }
}