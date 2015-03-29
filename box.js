/////////////////////////////////////////////////////////////////
//      gert fyrir verkefni í Tölvugrafík    
//
//
//      Cube í WebGL tilbúinn fyrir buffering og render
//
//      Einar Helgi Þrastarson Febrúar, 2015
/////////////////////////////////////////////////////////////////
var BoxNumVertices  = 36;

var colorsBox = [];
var pointsBox = [];
var boxVBuffer;
var boxCBuffer;


function makeBox() {
    quadBox([0, 1, 1, 2, 2, 3, 3, 0]);
    quadBox([4, 5, 5, 6, 6, 7, 7, 4]);
    quadBox([0, 4, 1, 5, 2, 6, 3, 7]);
}

function quadBox(a) {
    for(var z = 0; z<6; ++z) {
        for(var y = 0; y<20; ++y) {
            for(var x = 0; x<6; ++x) {
                var vertices = [
                    vec3( 3.0-x, -10.0+y, -2.0+z ),
                    vec3( 3.0-x, -10.0+y, -3.0+z ),
                    vec3( 2.0-x, -10.0+y, -3.0+z ),
                    vec3( 2.0-x, -10.0+y, -2.0+z ),
                    vec3( 3.0-x,  -9.0+y, -2.0+z ),
                    vec3( 3.0-x,  -9.0+y, -3.0+z ),
                    vec3( 2.0-x,  -9.0+y, -3.0+z ),
                    vec3( 2.0-x,  -9.0+y, -2.0+z )
                ]

                for ( var i = 0; i < a.length; ++i ) {
                    pointsBox.push( vertices[a[i]] );
                    //colors.push( vertexColors[indices[i]] );
                
                    // for solid colored faces use 
                    colorsBox.push([ 0.0, 0.0, 0.0, 0.3 ]);
                    
                }
            }
        }
    }
}

function bufferBox() {
    makeBox();

    boxCBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, boxCBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsBox), gl.STATIC_DRAW );

    boxVBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, boxVBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsBox), gl.STATIC_DRAW );
}

function renderBox(ctm) {
    gl.bindBuffer( gl.ARRAY_BUFFER, boxCBuffer );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, boxVBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    var ctmstack = [];
    ctmstack.push(ctm);
    ctm = mult( ctm, translate( 0.0, 0.0, 0.6));
    ctm = mult( ctm, scale4( 0.2, 0.2, 0.00001) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
    gl.drawArrays( gl.LINES, 0, pointsBox.length );

    ctm = ctmstack.pop();
    ctmstack.push(ctm);
    ctm = mult( ctm, translate( 0.6, 0.0, 0.0));
    ctm = mult( ctm, scale4( 0.00001, 0.2, 0.2) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
    gl.drawArrays( gl.LINES, 0, pointsBox.length );

    ctm = ctmstack.pop();
    ctmstack.push(ctm);
    ctm = mult( ctm, translate( 0.0, 0.0, -0.6));
    ctm = mult( ctm, scale4( 0.2, 0.2, 0.00001) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
    gl.drawArrays( gl.LINES, 0, pointsBox.length );

    ctm = ctmstack.pop();
    ctmstack.push(ctm);
    ctm = mult( ctm, translate( -0.6, 0.0, 0.0));
    ctm = mult( ctm, scale4( 0.00001, 0.2, 0.2) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
    gl.drawArrays( gl.LINES, 0, pointsBox.length );

    ctm = ctmstack.pop();
    ctmstack.push(ctm);
    ctm = mult( ctm, translate( 0.0, -2.0, 0.0));
    ctm = mult( ctm, scale4( 0.2, 0.00001, 0.2) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
    gl.drawArrays( gl.LINES, 0, pointsBox.length );
}