/////////////////////////////////////////////////////////////////
//      gert fyrir verkefni í Tölvugrafík    
//
//
//      Black í WebGL tilbúinn fyrir buffering og render
//
//      Einar Helgi Þrastarson Febrúar, 2015
/////////////////////////////////////////////////////////////////
var colorsBlack = [];
var pointsBlack = [];
var blackVBuffer;
var blackCBuffer;


function colorBlack()
{
    var p = 0.5;
    var vertices = [
        vec3( -p, -p,  p ),
        vec3( -p,  p,  p ),
        vec3(  p, -p,  p ),
        vec3(  p,  p,  p )
    ];

    var indices = [ 0, 1, 3, 0, 3, 2 ];

    for ( var i = 0; i < indices.length; ++i ) {
        pointsBlack.push( vertices[indices[i]] );
    
        // for solid colored faces use black
        colorsBlack.push([ 0.0, 0.0, 0.0, 1.0 ]);
        
    }
}

function bufferBlack() {
    colorBlack();
    blackCBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, blackCBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsBlack), gl.STATIC_DRAW );

    blackVBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, blackVBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsBlack), gl.STATIC_DRAW );
}

function renderBlack(ctm) {
    gl.bindBuffer( gl.ARRAY_BUFFER, blackCBuffer );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, blackVBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    ctm = mult( ctm, scale4( 0.2, 0.2, 0.2) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
    gl.drawArrays( gl.TRIANGLES, 0, pointsBlack.length );
}