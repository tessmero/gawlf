// get line segments tracing regular polygon in hyperbolic space
// radius is euclidian sdistance of verts from disk center
function getPolygonSegs( r, n, angleOffset=.1 ){
    
    var da = twopi / n
    var corners = []
    for( let i = 0 ; i < (n+1) ; i++ ){
        corners.push( Vector.polar( da*i+angleOffset, r ) )
    }
    var result = []
    for( let i = 0 ; i < n ; i++ ) {
        result.push( GeoSegment.betweenPoints( corners[i], corners[i+1] ) ) 
    }
    return result
}