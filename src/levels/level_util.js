// get line segments tracing regular polygon in hyperbolic space
// radius is euclidian sdistance of verts from disk center
function getPolygonSegs( r, n, angleOffset=.1 ){
    
    var da = twopi / n
    var corners = []
    for( let i = 0 ; i < n ; i++ ){
        corners.push( Vector.polar( da*i+angleOffset, r ) )
    }
    return getSegs(corners)
}

// get line segments tracing the given vertices
function getSegs(verts){
    
    var result = []
    for( let i = 0 ; i < verts.length ; i++ ) {
        result.push( GeoSegment.betweenPoints( verts[i], verts[(i+1)%verts.length] ) ) 
    }
    return result
}