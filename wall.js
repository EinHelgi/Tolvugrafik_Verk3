/////////////////////////////////////////////////////////////////
//      gert fyrir verkefni í Tölvugrafík    
//
//
/////////////////////////////////////////////////////////////////
var colorsWall = [];
var pointsWall = [];
var texCoordsWall = [];
var pointsgridWall = [];
var wallVBuffer;
var wallCBuffer;
var tBuffer;


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

    /*
    var colors = [
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 0.0, 1.0, 0.0, 1.0 ]  // green
    ];*/

    
    var colors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // blue
        [ 0.0, 0.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 0.0, 0.0, 1.0 ],  // cyan
        [ 0.0, 0.0, 0.0, 1.0 ]  // green
    ];

    var texCo = [
        vec2(0, 0),
        vec2(0, 3),
        vec2(1, 3),
        vec2(1, 0)
    ];

    var indices = [ 0, 1, 3, 0, 3, 2, 4, 5, 1, 4, 1, 0, 2, 3, 7, 2, 7, 6, 7, 5, 4, 7, 4, 6];
    var texind =  [ 3, 2, 1, 3, 1, 0, 3, 2, 1, 3, 1, 0, 3, 2, 1, 3, 1, 0, 2, 1, 0, 2, 0, 3]; 
    var k = -1;

    for ( var i = 0; i < indices.length; ++i ) {
        pointsWall.push( vertices[indices[i]] );
        texCoordsWall.push(texCo[texind[i]]);
        
        if(i%6 === 0) k++;
    
        // for solid colored faces use black
        colorsWall.push(colors[k]);   
    }

    indices = [4, 0, 2, 4, 2, 6];
    texind =  [3, 2, 1, 3, 1, 0]; 

    for ( var i = 0; i < indices.length; ++i ) {
        pointsWall.push( vertices[indices[i]] );
        //texCoordsWall.push(texCo[texind[i]]);
        
        // for solid colored faces use black
        colorsWall.push([ 1.0, 0.0, 1.0, 1.0 ]);
        
    }

}

function bufferWall() {
    colorWall();
    for(var i=0; i<20000; ++i) {
        texCoordsWall.push(vec2(0, 0));
    }
    var wallpaper = document.getElementById("wallpaper");
    configureTexture( wallpaper );

    tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsWall), gl.STATIC_DRAW );
   
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
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, wallVBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    ctm = mult( ctm, scale4( 0.2, 0.2, 0.2) );
    gl.enableVertexAttribArray( vTexCoord );
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
    gl.bindTexture(gl.TEXTURE_2D, textures[0]);
    gl.drawArrays( gl.TRIANGLES, 0, pointsWall.length );
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.disableVertexAttribArray( vTexCoord );

}