/////////////////////////////////////////////////////////////////
//      gert fyrir verkefni í Tölvugrafík    
//
//
//      Cube í WebGL tilbúinn fyrir buffering og render
//
//      Einar Helgi Þrastarson Febrúar, 2015
/////////////////////////////////////////////////////////////////
var greenCubeNumVertices  = 36;

var colorsGreenCube = [];
var pointsGreenCube = [];
var greenCubeVBuffer;
var greenCubeCBuffer;


function greenCube()
{
    greenQuad( 1, 0, 3, 2 );
    greenQuad( 2, 3, 7, 6 );
    greenQuad( 3, 0, 4, 7 );
    greenQuad( 6, 5, 1, 2 );
    greenQuad( 4, 5, 6, 7 );
    greenQuad( 5, 4, 0, 1 );
}

function greenQuad(a, b, c, d) 
{
    var p = 0.48;
    var vertices = [
        vec3( -p, -p,  p ),
        vec3( -p,  p,  p ),
        vec3(  p,  p,  p ),
        vec3(  p, -p,  p ),
        vec3( -p, -p, -p ),
        vec3( -p,  p, -p ),
        vec3(  p,  p, -p ),
        vec3(  p, -p, -p )
    ];

    var vertexColors = [
        [ 0.0, 0.3, 0.0, 1.0 ],  // dark green
        [ 0.0, 0.4, 0.0, 1.0 ],  //  ^^  green
        [ 0.0, 0.5, 0.0, 1.0 ],  //  ^^  green
        [ 0.0, 0.6, 0.0, 1.0 ],  //  ^^  green
        [ 0.0, 0.7, 0.0, 1.0 ],  //  ^^  green
        [ 0.0, 0.8, 0.0, 1.0 ],  //  ^^  green
        [ 0.0, 0.9, 0.0, 1.0 ],  //  ^^  green
        [ 0.0, 1.0, 0.0, 1.0 ]   //light green
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices
    
    //vertex color assigned by the index of the vertex
    
    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        pointsGreenCube.push( vertices[indices[i]] );
        //colors.push( vertexColors[indices[i]] );
    
        // for solid colored faces use 
        colorsGreenCube.push(vertexColors[a]);
        
    }
}

/*
function quad(a, b, c, d) 
{
    var p = 0.48;
    var vertices = [
        vec3( -p, -p,  p ),
        vec3( -p,  p,  p ),
        vec3(  p,  p,  p ),
        vec3(  p, -p,  p ),
        vec3( -p, -p, -p ),
        vec3( -p,  p, -p ),
        vec3(  p,  p, -p ),
        vec3(  p, -p, -p )
    ];

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices
    
    //vertex color assigned by the index of the vertex
    
    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        pointsGreenCube.push( vertices[indices[i]] );
        //colors.push( vertexColors[indices[i]] );
    
        // for solid colored faces use 
        colorsGreenCube.push(vertexColors[a]);
        
    }
}
*/

function bufferGreenCube() {
    greenCubeCBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, greenCubeCBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsGreenCube), gl.STATIC_DRAW );

    greenCubeVBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, greenCubeVBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsGreenCube), gl.STATIC_DRAW );
}

function renderGreenCube(ctm) {
    gl.bindBuffer( gl.ARRAY_BUFFER, greenCubeCBuffer );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, greenCubeVBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    ctm = mult( ctm, scale4( 0.2, 0.2, 0.2) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
    gl.drawArrays( gl.TRIANGLES, 0, greenCubeNumVertices );
}