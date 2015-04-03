
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
var label;

var vColor;
var vPosition;
var vTexCoord;

var texture;
var textures = [];
var choose;

var movement = false;     // Do we rotate?
var notMoving = true;
var pause = false;
var tileSize = 0.2;
var grid = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var points = 0;

var isIbeam = false;
var isBox = true;
var speeding = false;
var count = 0.0;
var posL = [0, 0, 0];
var posM = [3, -2, 3];
var posR = [0, 0, 0];

var rotX = 0;
var rotY = 0;
var rotZ = 0;

var spinX = 0;//-55;
var spinY = 0;//-25;
var origX;
var origY;

var zDist = -5.5;

var proLoc;
var mvLoc;


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    label = document.getElementById( "label" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorL();
    colorI();
    greenCube();
    blueCube();
    bufferBlack();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    bufferI();
    bufferL();
    bufferBox();
    bufferGreenCube();
    bufferBlueCube();
    bufferWall();

    vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    //TEXTURES OFF, ÞAÐ KEMUR BJAGAÐUR TEXTURE ÞEGAR VIÐ HÖFUM ÞÁ Á, þarf að laga í wall.js
    // Veit ekki hvort það gæti lagað error skilaboðinn, vonandi :/
    
    vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    proLoc = gl.getUniformLocation( program, "projection" );
    mvLoc = gl.getUniformLocation( program, "modelview" );
    choose = gl.getUniformLocation( program, "choose" );
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

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
            case 32:    // spacebar to speed game
                speeding = true;
                break;

            case 66:    // "B" on/off grid
                isBox = !isBox;
                break;
            case 84:    // "T" testing
                gl.uniform1i(choose, false);
                newBeam();
                break;
            case 80:    // "P" pause
                pause = !pause;
                break;
            case 77:    // "M" makefloor 
                makeFloor();
                break;
            case 75:    // "K" kill floor
                checkGrid();
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

function findSpinY() {
    console.log("y is: "+spinY);
    if(spinY <= 45 && spinY >= -45 || spinY <= -315 || spinY >= 315) return 0;
    if(spinY < 135 && spinY > 45 || spinY > -315 && spinY < -225) return 90;
    if(spinY <= 225 && spinY >= 135 || spinY >= -225 && spinY <= -135) return 180;
    if(spinY > -135 && spinY < -45 || spinY < 315 && spinY > 225) return 270;
    return 0;
}

function newBeam() {
    speeding = false;
    var rot = [0, 90, 180, 270];
    rotX = rot[Math.floor(4*Math.random(4))];
    rotY = rot[Math.floor(4*Math.random(4))];
    rotZ = rot[Math.floor(4*Math.random(4))];
    posM = [3, -2, 3];
    if(Math.random()<=0.5) isIbeam = !isIbeam;
    count = 0.0;
    updatePos();
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var ctmstack = [];

    if(!pause) count+=4;
    if(speeding) count+= 20;
    if(Math.floor(count/100) == 1) {
        posM[1]++;
        count = 0;
    }
    if(count>50) {
        checkIfLanding(isIbeam);
    }

    var ctm = lookAt( vec3(0.0, 0.0, zDist), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0) );
    ctm = mult( ctm, rotate( parseFloat(spinX), [1, 0, 0] ) );
    ctm = mult( ctm, rotate( parseFloat(spinY), [0, 1, 0] ) );

    ctmstack.push(ctm);
    gl.uniform1i(choose, false);

    // Moving triominos
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

    // Box
    if(isBox) {
        ctm = ctmstack.pop();
        ctmstack.push(ctm);
        renderBox(ctm, spinY);
    }

    // Stopped triominos
    for(var y=0; y<grid.length; ++y) {
        if(grid[y]!==0) {
            var howMany = 0;
            var howManyOn = 0;
            for(var x=0; x<grid[y].length; ++x) {
                for(var z=0; z<grid[y][x].length; ++z) {
                    if(grid[y][x][z] !== 0) {
                        var beamtype = grid[y][x][z][3];
                        ctm = ctmstack.pop();
                        ctmstack.push(ctm);
                        ctm = gotToTile(x, y, z, ctm);
                        ctm = rotateStuff(grid[y][x][z][0], grid[y][x][z][1], grid[y][x][z][2], ctm);
                        if(beamtype) renderGreenCube(ctm);
                        else renderBlueCube(ctm);
                        howManyOn++;
                    }
                    else {howMany++;}
                }
            }
            if(howMany === 36) {
                grid[y] = 0;
            }
            if(howManyOn === 36) {
                checkGrid();
                points++;
                label.innerHTML = points;
            }
        }
    }
   
    // Wall shadows
    updatePos();
    var pos = [posL, posM, posR];
    for(var i=0; i<pos.length; ++i) {
        if(pos[i][1] >= 0) {
            ctm = ctmstack.pop();
            ctmstack.push(ctm);
            ctm = gotToTile(pos[i][0], pos[i][1], 0, ctm);
            renderBlack(ctm);

            ctm = ctmstack.pop();
            ctmstack.push(ctm);
            ctm = gotToTile(0 , pos[i][1], pos[i][2], ctm);
            ctm = rotateStuff(0, 90, 0, ctm);
            renderBlack(ctm);

            ctm = ctmstack.pop();
            ctmstack.push(ctm);
            ctm = gotToTile(pos[i][0], pos[i][1], 5, ctm);
            ctm = rotateStuff(0, 180, 0, ctm);
            renderBlack(ctm);

            ctm = ctmstack.pop();
            ctmstack.push(ctm);
            ctm = gotToTile(5 , pos[i][1], pos[i][2], ctm);
            ctm = rotateStuff(0, 270, 0, ctm);
            renderBlack(ctm);
        }
    }

    gl.uniform1i(choose, true);
    // Wall
    ctm = ctmstack.pop();
    ctmstack.push(ctm);
    renderWall(ctm);
    gl.uniform1i(choose, false);
    
    requestAnimFrame( render );
}
