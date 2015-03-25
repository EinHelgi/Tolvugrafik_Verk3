
/////////////////////////////////////////////////////////////////
//      gert fyrir verkefni í Tölvugrafík
//
//
//      Verkefni 2
//
//      Einar Helgi Þrastarson Febrúar, 2015
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

var vColor;
var vPosition;

var movement = false;     // Do we rotate?

var rotX = 0;
var rotY = 0;
var rotZ = 0;

var spinX = 0;
var spinY = 0;
var origX;
var origY;

var zDist = -4.5;

var proLoc;
var mvLoc;

var ctmstack = []; // Er þetta sniðugt?


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.9, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    bufferCube();
    bufferLine();
    bufferAxis();

    vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


    proLoc = gl.getUniformLocation( program, "projection" );
    mvLoc = gl.getUniformLocation( program, "modelview" );

    var proj = perspective( 50.0, 1.0, 0.2, 100.0 );
    gl.uniformMatrix4fv(proLoc, false, flatten(proj));
    
    //event listeners for mouse
    canvas.addEventListener("mousedown", function(e){
        movement = true;
        origX = e.offsetX;
        origY = e.offsetY;
        e.preventDefault();         // Disable drag and drop
    } );

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
            spinY = ( spinY + (e.offsetX - origX) ) % 360;
            spinX = ( spinX + (origY - e.offsetY) ) % 360;
            origX = e.offsetX;
            origY = e.offsetY;
        }
    } );
    
    // Event listener for keyboard
     window.addEventListener("keydown", function(e){
        console.log(e.keyCode );
        switch( e.keyCode ) {
            case 37:    // left arrow
                console.log("left" );
                break;
            case 38:    // up arrow
                console.log("up" );
                rotX += 90;
                break;
            case 39:    // right arrow
                console.log("right" );
                break;
            case 40:    // down arrow
                console.log("down" );
                break;
         }
     }  );  

     // Event listener for keyboard
     window.addEventListener("keyup", function(e){

     }  );  

    // Event listener for mousewheel
     window.addEventListener("mousewheel", function(e){
         if( e.wheelDelta > 0.0 ) {
             zDist += 0.1;
         } else {
             zDist -= 0.1;
         }
     }  );  

    render();
}

//----------------------------------------------------------------------------
// Define the transformation scale here (two scale functions in MV.js)
function scale4( x, y, z )
{
    if ( Array.isArray(x) && x.length == 3 ) {
        z = x[2];
        y = x[1];
        x = x[0];
    }

    var result = mat4();
    result[0][0] = x;
    result[1][1] = y;
    result[2][2] = z;

    return result;
}

function ITriomino(x, y, z, ctm) {

    ctmstack.push(ctm);
    ctm = mult( ctm, scale4( 0.2, 0.2, 0.2) );
    ctm = mult( ctm, translate( x, y, z) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
    renderCube();// teikna cube

    ctm = ctmstack.pop();
    ctmstack.push(ctm);
    ctm = mult( ctm, scale4( 0.2, 0.2, 0.2) );
    ctm = mult( ctm, translate( 1.0+x, y, z) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
    renderCube();// teikna cube

    ctm = ctmstack.pop();
    ctmstack.push(ctm);
    ctm = mult( ctm, scale4( 0.2, 0.2, 0.2) );
    ctm = mult( ctm, translate( -1.0+x, y, z) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
    renderCube();// teikna cube
}

function LTriomino(x, y, z, ctm) {
    ctmstack.push(ctm);
    ctm = mult( ctm, scale4( 0.2, 0.2, 0.2) );
    ctm = mult( ctm, translate( x, y, z) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
    renderCube();// teikna cube

    ctm = ctmstack.pop();
    ctmstack.push(ctm);
    ctm = mult( ctm, scale4( 0.2, 0.2, 0.2) );
    ctm = mult( ctm, translate( x, 1.0+y, z) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
    renderCube();// teikna cube

    ctm = ctmstack.pop();
    ctmstack.push(ctm);
    ctm = mult( ctm, scale4( 0.2, 0.2, 0.2) );
    ctm = mult( ctm, translate( 1.0+x, y, z) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
    renderCube();// teikna cube
}

function rotateY(ctm) {
    //ctm = mult( ctm, translate( 0.0, 0.0, -0.2 ) );
    ctm = mult( ctm, rotate( rotX, [1, 0, 0] ) );
    return ctm;
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var ctm = lookAt( vec3(0.0, 0.0, zDist), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0) );
    ctm = mult( ctm, rotate( parseFloat(spinX), [1, 0, 0] ) );
    ctm = mult( ctm, rotate( parseFloat(spinY), [0, 1, 0] ) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
    renderAxis();

    var offset = 0.0; // Offset tímabundið bara sett hér en skynsamara að hafa það inní föllunum
    //ITriomino(0.5+offset, 0.5+offset, 0.5+offset, ctm); // Er að staðsetja þá svo þeir skeri ekki ása
    ctm = rotateY(ctm);
    LTriomino(0.5+offset, 0.5+offset, -0.5-offset, ctm); // Hvernig lýst þér á að hafa það þannig?
    
    requestAnimFrame( render );
}
