
// graphics context
var canvas;
var ctx;
var graphics_scale = 1;

// tranlsate pixels on canvas to internal units
var canvasOffsetX = 0
var canvasOffsetY = 0
var canvasScale = 0

var backgroundColor = '#DDD'

// parameters for poincare disk
var center = new Vector(0,0)
var crad = .85

// compute distance scaling factors
// at varying radii on disk
var delta = 1e-4
var nsteps = 1000
var dx = crad / nsteps
var dscales = []
for( var x = dx ; x < crad ; x += dx ){
    let a = new Vector( x+delta, -delta )
    let b = new Vector( x+delta, delta )
    let d = hdist(a,b)
    let r = d / (delta*2)
    dscales.push(r)
}


// game physics
var bounceLoss = 1e-1 // fraction of speed lost on bounce
var friction = 1e-3 // fraction of speed lost per ms

playerBallRadius = .05 //hyperbolic
targetRadius = .1 
playerEuclidRad = 0 // euclidian computed on update
targetEuclidRad = 0 

// game objects
var currentLevel = null
var startPos = null
var targetPos = null
var allWalls = null
var playerBall = null
advanceLevel()



var aimGeo = null
var aimArrowSeg = null
var aimTailPos = null
var aimStrength = 0 // ball (hyperbolic) speed multiplier
var aimClockwise = false
var aimBall = null

var debugPoints = []
var debugEuclidSegs = []

var all_balls = []

//geo = new Geodesic( new Vector(,),  )
//angle = 

//geo = new Geodesic( new Vector(1.025652065835253,0.22327813368886673),0.6158857727985811  )
//angle = -2.971543910049636


/*
var all_balls = []
for( var i = 0 ; i < 10 ; i++ ){
    a = Vector.polar( Math.random()*twopi, .1 )
    b = Vector.polar( Math.random()*twopi, .1 )
    geo = Geodesic.withPoints(a,b)
    angle = a.sub(geo.center).getAngle()
    all_balls.push( new Ball( geo,angle ) )
}
*/


var resetButton = [v(.8,.8),.15]


// mouse
var isMobileDevice = false
var canvasMousePos = null //pixels on canvas
var mousePos = null //internal units

