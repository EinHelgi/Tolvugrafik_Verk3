
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


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorL();
    colorI();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.9, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    //bufferLine();
    bufferAxis();
    bufferI();
    bufferL();
    bufferBox();

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
        //console.log(e.keyCode );
        switch( e.keyCode ) {
            case 37:    // left arrow
                console.log("Y" );
                rotY += 90;
                break;
            case 38:    // up arrow
                console.log("X" );
                rotX += 90;
                break;
            case 39:    // right arrow
                console.log("Z" );
                rotZ += 90;
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

function rotateStuff(ctm) {
    var x = 0.0, y = 0.0, z = 0.0;
    ctm = mult( ctm, rotate( rotX, [1, 0, 0] ) );
    ctm = mult( ctm, rotate( rotY, [0, 1, 0] ) );
    ctm = mult( ctm, rotate( rotZ, [0, 0, 1] ) );
    return ctm;
}


function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var ctmstack = [];

    var ctm = lookAt( vec3(0.0, 0.0, zDist), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0) );
    ctm = mult( ctm, rotate( parseFloat(spinX), [1, 0, 0] ) );
    ctm = mult( ctm, rotate( parseFloat(spinY), [0, 1, 0] ) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
    //renderAxis();

    ctmstack.push(ctm);
    ctm = mult( ctm, translate( 0.1, 0.1, 0.1));
    ctm = rotateStuff(ctm);
    renderI(ctm)

    ctm = ctmstack.pop();
    ctmstack.push(ctm);
    renderBox(ctm);

    ctm = ctmstack.pop();
    ctm = mult( ctm, translate( 0.5, 0.5, 0.5) );
    ctm = rotateStuff(ctm);
    renderL(ctm);
    
    requestAnimFrame( render );
}
