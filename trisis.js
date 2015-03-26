
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
var tileSize = 0.2;
var grid = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var floor = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];

var isIbeam = false;
var isBox = true;
var count = 200.0;
var pos = [3, 3, 3];
var rotX = 0;
var rotY = 0;
var rotZ = 0;

var spinX = -55;
var spinY = -25;
var origX;
var origY;

var zDist = -5.5;

var proLoc;
var mvLoc;


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorL();
    colorI();
    colorCube();

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
    bufferCube();

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
        console.log(Math.floor(1.3));
        switch( e.keyCode ) {
            case 65:    // 
                rotZ += 90;
                break;
            case 90:    // 
                rotZ -= 90;
                break;
            case 83:    // 
                rotX += 90;
                break;
            case 88:    // 
                rotX -= 90;
                break;
            case 68:    // 
                rotY += 90;
                break;
            case 67:    // 
                rotY -= 90;
                break;
            case 37:    // left arrow
                pos[0]--;
                break;
            case 38:    // up arrow
                pos[2]--;
                break;
            case 39:    // right arrow
                pos[0]++;
                break;
            case 40:    // down arrow
                pos[2]++;
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
     grid[19] = floor;
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

function rotateStuff(x, y, z, ctm) {
    ctm = mult( ctm, rotate( x, [1, 0, 0] ) );
    ctm = mult( ctm, rotate( y, [0, 1, 0] ) );
    ctm = mult( ctm, rotate( z, [0, 0, 1] ) );
    return ctm;
}

function gotToTile(x, y, z, ctm) {
    ctm = mult( ctm, translate( (2-x)*tileSize+0.1, (10-y)*tileSize-0.1, (2-z)*tileSize+0.1));
    return ctm;
}


function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var ctmstack = [];
    //count++;
    pos[1] = Math.floor(count/100);
    if(pos[1] === 19) {
        console.log("please stop!!");
    }

    var ctm = lookAt( vec3(0.0, 0.0, zDist), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0) );
    ctm = mult( ctm, rotate( parseFloat(spinX), [1, 0, 0] ) );
    ctm = mult( ctm, rotate( parseFloat(spinY), [0, 1, 0] ) );

    ctmstack.push(ctm);
    if(isIbeam) {
        ctm = ctmstack.pop();
        ctmstack.push(ctm);
        ctm = gotToTile(pos[0], pos[1], pos[2], ctm);
        ctm = rotateStuff(rotX, rotY, rotZ, ctm);
        renderI(ctm)
    }
    else {
        ctm = ctmstack.pop();
        ctmstack.push(ctm);
        ctm = gotToTile(pos[0], pos[1], pos[2], ctm);
        ctm = rotateStuff(rotX, rotY, rotZ, ctm);
        renderL(ctm);
    }

    if(isBox) {
        ctm = ctmstack.pop();
        ctmstack.push(ctm);
        renderBox(ctm);
    }

    for(var y=0; y<grid.length; ++y) {
        if(grid[y]!==0) {
            for(var x=0; x<grid[y].length; ++x) {
                for(var z=0; z<grid[y][x].length; ++z) {
                    if(grid[y][x][z] !== 0) {
                        ctm = ctmstack.pop();
                        ctmstack.push(ctm);
                        ctm = gotToTile(x, y, z, ctm);
                        renderCube(ctm);
                    }
                }
            }
        }
    }
    
    requestAnimFrame( render );
}
