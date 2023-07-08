// a geodesic is a circle that intersects with the 
// edge of the poincare disk at right angles

class Geodesic{
    constructor(center,radius){
        this.center = center
        this.radius = radius
    }
    
    // construct geodesic containing points p and q
    static withPoints(p,q){
        var pi = invert(p)
        var qi = invert(q)
        var n = perp_bisect(p,pi)
        var m = perp_bisect(q,qi)
        var c = intersection(n,m)
        var r = c.sub(p).getMagnitude()
        return new Geodesic(c,r)
    }
    
    draw(g){
        g.beginPath()
        this.path(g)
        g.stroke()
    }
    
    path(g){
        g.arc(
            this.center.x, this.center.y, 
            this.radius, 0,Math.PI*2)
    }
}