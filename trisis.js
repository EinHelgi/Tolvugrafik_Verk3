
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
var pause = false;
var tileSize = 0.2;
var grid = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var floor = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];

var isIbeam = false;
var isBox = true;
var count = 0.0;
var posL = [0, 0, 0];
var posM = [2, 2, 2];
var posR = [0, 0, 0];

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
    gl.clearColor( 0.5, 0.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

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
        //console.log(e.keyCode );
        switch( e.keyCode ) {
            case 65:    // "A"
                rotZ += 90;
                if(checkOutofBounds()) rotZ -= 90;
                if(rotZ === 360) rotZ = 0;
                break;
            case 90:    // "Z"
                rotZ -= 90;
                if(checkOutofBounds()) rotZ += 90;
                if(rotZ === -90 ) rotZ = 270
                break;
            case 83:    // "S"
                rotX += 90;
                if(checkOutofBounds()) rotX -= 90;
                if(rotX === 360) rotX = 0;
                break;
            case 88:    // "X"
                rotX -= 90;
                if(checkOutofBounds()) rotX += 90;
                if(rotX === -90 ) rotX = 270
                break;
            case 68:    // "D"
                rotY += 90;
                if(checkOutofBounds()) rotY -= 90;
                if(rotY === 360) rotY = 0;
                break;
            case 67:    // "C"
                rotY -= 90;
                if(checkOutofBounds()) rotY += 90;
                if(rotY === -90 ) rotY = 270
                break;
            case 37:    // left arrow
                posM[0]--;
                if(checkOutofBounds()) posM[0]++;
                break;
            case 38:    // up arrow
                posM[2]--;
                if(checkOutofBounds()) posM[2]++;;
                break;
            case 39:    // right arrow
                posM[0]++;
                if(checkOutofBounds()) posM[0]--;
                break;
            case 40:    // down arrow
                posM[2]++;
                if(checkOutofBounds()) posM[2]--;
                break;

            case 66:    // "B" debug grid
                isBox = !isBox;
                break;
            case 84:    // "T" testing
                //getTiles();
                newBeam();
                break;
            case 80:    // "P" pause
                pause = !pause;
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

function newBeam() {
    var rot = [0, 90, 180, 270];
    rotX = rot[Math.floor(4*Math.random(4))];
    rotY = rot[Math.floor(4*Math.random(4))];
    rotZ = rot[Math.floor(4*Math.random(4))];
    posM = [3, 1, 3];
    if(Math.random()<=0.5) isIbeam = !isIbeam;
    count = 0.0;
    updatePos();
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var ctmstack = [];

    if(!pause) count+=2;
    if(Math.floor(count/100) == 1) {
        posM[1]++;
        count = 0;
    }
    if(count>50) {
        checkIfLanding();
    }

    var ctm = lookAt( vec3(0.0, 0.0, zDist), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0) );
    ctm = mult( ctm, rotate( parseFloat(spinX), [1, 0, 0] ) );
    ctm = mult( ctm, rotate( parseFloat(spinY), [0, 1, 0] ) );

    ctmstack.push(ctm);

    if(isIbeam) {
        ctm = ctmstack.pop();
        ctmstack.push(ctm);
        ctm = gotToTile(posM[0], posM[1], posM[2], ctm);
        ctm = rotateStuff(rotX, rotY, rotZ, ctm);
        renderI(ctm)
    }
    else {
        ctm = ctmstack.pop();
        ctmstack.push(ctm);
        ctm = gotToTile(posM[0], posM[1], posM[2], ctm);
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
