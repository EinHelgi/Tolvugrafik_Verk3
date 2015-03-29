/////////////////////////////////////////////////////////////////
//      gert fyrir verkefni í Tölvugrafík    
//
//
/////////////////////////////////////////////////////////////////
var colorsWall = [];
var pointsWall = [];
var pointsgridWall = [];
var wallVBuffer;
var wallCBuffer;


function colorWall()
{
    var p = 3.0;
    var h = 10.0;
    var vertices = [
        vec3( -p, -h,  p ),
        vec3( -p,  h,  p ),
        vec3(  p, -h,  p ),
        vec3(  p,  h,  p ),
        vec3( -p, -h, -p ),
        vec3( -p,  h, -p ),
        vec3(  p, -h, -p ),
        vec3(  p,  h, -p )
    ];

    var indices = [ 0, 1, 3, 0, 3, 2, 4, 5, 1, 4, 1, 0, 2, 3, 7, 2, 7, 6, 7, 5, 4, 7, 4, 6];

    for ( var i = 0; i < indices.length; ++i ) {
        pointsWall.push( vertices[indices[i]] );
    
        // for solid colored faces use black
        colorsWall.push([ 0.0, 1.0, 0.0, 1.0 ]);
        
    }

    var indices = [4, 0, 2, 4, 2, 6];

    for ( var i = 0; i < indices.length; ++i ) {
        pointsWall.push( vertices[indices[i]] );
    
        // for solid colored faces use black
        colorsWall.push([ 1.0, 0.0, 1.0, 1.0 ]);
        
    }
}

function bufferWall() {
    colorWall();
    wallCBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, wallCBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsWall), gl.STATIC_DRAW );

    wallVBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, wallVBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsWall), gl.STATIC_DRAW );
}

function renderWall(ctm) {
    gl.bindBuffer( gl.ARRAY_BUFFER, wallCBuffer );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, wallVBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    ctm = mult( ctm, scale4( 0.2, 0.2, 0.2) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
    gl.drawArrays( gl.TRIANGLES, 0, pointsWall.length );
}