// shorthand
var pio2 = Math.PI/2
var pi = Math.PI
var twopi = 2*Math.PI
function v(){
    return new Vector(...arguments)
}

// compute hyperbolic distance bewteen points p and q
function hdist(p,q){
    var geo = Geodesic.withPoints(p,q)
    var ab = circle_intersections(geo.center, geo.radius, center, crad)
    var ad = [p.sub(ab[0]).getMagnitude(), q.sub(ab[0]).getMagnitude()]
    var bd = [p.sub(ab[1]).getMagnitude(), q.sub(ab[1]).getMagnitude()]
    return Math.log( (Math.max(...ad)*Math.max(...bd)) / (Math.min(...ad)*Math.min(...bd)) )
}


// construct geodesic containing points p and q
// return center and radius of geodesic
function geodesic(p,q){
    var pi = invert(p)
    var qi = invert(q)
    var n = perp_bisect(p,pi)
    var m = perp_bisect(q,qi)
    var c = intersection(n,m)
    var r = c.sub(p).getMagnitude()
    return [c,r]
}

// compute arc length of geodesic on disk
function geo_arclength(c,r){
    var dints = circle_intersections(c,r,center,crad)
    var da = Math.abs(dints[1].sub(c).getAngle() - dints[0].sub(c).getAngle())
    if( da > Math.PI ){
        da = 2*Math.PI - da
    }
    return twopi*r * (da/twopi)
}

// compute points where the given geodesic intersects the disk
function circle_intersections(c1,r1,c2,r2){
    var d = c2.sub(c1)
    var dist = d.getMagnitude()
    
    var a = ((r1*r1) - (r2*r2) + (dist*dist)) / (2.0 * dist)
    var x2 = c1.x + (d.x * a/dist);
    var y2 = c1.y + (d.y * a/dist);
    var h = Math.sqrt((r1*r1) - (a*a));
    var rx = -d.y * (h/dist);
    var ry = d.x * (h/dist);
    
    var xi = x2 + rx;
    var xi_prime = x2 - rx;
    var yi = y2 + ry;
    var yi_prime = y2 - ry;
    
    return [
        new Vector(xi,yi),
        new Vector(xi_prime,yi_prime)
    ]
}

// circle inversion of xy point
function invert(p){
    
    var d = p.sub(center)
    var dist = d.getMagnitude()
    var angle = d.getAngle()
    var r = dist/crad
    return center.add( Vector.polar( angle, crad/r ) )
    
}


// compute perpendicular bisector line of the given segment
// return a list of two xy points on the result line
function perp_bisect( a, b ){
    var mid = midpoint(a,b)
    var angle = b.sub(a).getAngle() + pio2
    var d = Vector.polar( angle, 10 )
    return [
        mid.sub(d),mid.add(d)
    ]
}

// compute intersection point of two lines
// the two lines are described by pairs of points
// requires two lists, each containing 2 xy points
function intersection( ab1, ab2 ){
    var mb1 = mb(...ab1)
    var mb2 = mb(...ab2)
    //m1*x+b1 = m2*x+b2
    //m1*x-m2*x = b2-b1
    //x = (b2-b1)/(m1-m2)
    var x = (mb2.b-mb1.b)/(mb1.m-mb2.m)
    var y = mb1.m*x + mb1.b
    return new Vector( x, y )
}

// estimate scale factor at the given position
// euclidian distance vs hyperbolic distance
function getDistScaleFactor(p){
    var r = p.getMagnitude() / crad
    var dsi = Math.min(dscales.length-1, Math.floor(r*dscales.length))
    return 1/dscales[dsi]
}

// compute slope and intercept
// euclidean line with points a and b
function mb(a,b){
    var m = (b.y-a.y)/(b.x-a.x)
    var b = a.y - m*a.x 
    return {m:m,b:b}
}

// euclidean midpoint
function midpoint(a,b){
    return a.add(b).mul(.5)
}

function isClockwise(p, q, r) {
    var crossProduct = (q.x - p.x) * (r.y - q.y) - (q.y - p.y) * (r.x - q.x);
    return (crossProduct < 0)
}

function cleanAngle(a){
    if( a > Math.PI ){
        a -= twopi
    }
    if( a < -Math.PI ){
        a += twopi
    }
    return a        
}