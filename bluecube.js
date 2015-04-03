/////////////////////////////////////////////////////////////////
//      gert fyrir verkefni í Tölvugrafík    
//
//
//      Cube í WebGL tilbúinn fyrir buffering og render
//
//      Einar Helgi Þrastarson Febrúar, 2015
/////////////////////////////////////////////////////////////////
var blueCubeNumVertices  = 36;

var colorsBlueCube = [];
var pointsBlueCube = [];
var blueCubeVBuffer;
var blueCubeCBuffer;


function blueCube()
{
    blueQuad( 1, 0, 3, 2 );
    blueQuad( 2, 3, 7, 6 );
    blueQuad( 3, 0, 4, 7 );
    blueQuad( 6, 5, 1, 2 );
    blueQuad( 4, 5, 6, 7 );
    blueQuad( 5, 4, 0, 1 );
}

function blueQuad(a, b, c, d) 
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
        [ 0.0, 0.0, 0.3, 1.0 ],  // dark blue
        [ 0.0, 0.0, 0.4, 1.0 ],  //  ^^  blue
        [ 0.0, 0.0, 0.5, 1.0 ],  //  ^^  blue
        [ 0.0, 0.0, 0.6, 1.0 ],  //  ^^  blue
        [ 0.0, 0.0, 0.7, 1.0 ],  //  ^^  blue
        [ 0.0, 0.0, 0.8, 1.0 ],  //  ^^  blue
        [ 0.0, 0.0, 0.9, 1.0 ],  //  ^^  blue
        [ 0.0, 0.0, 1.0, 1.0 ]   //light blue
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices
    
    //vertex color assigned by the index of the vertex
    
    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        pointsBlueCube.push( vertices[indices[i]] );
        //colors.push( vertexColors[indices[i]] );
    
        // for solid colored faces use 
        colorsBlueCube.push(vertexColors[a]);
        
    }
}

function bufferBlueCube() {
    blueCubeCBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, blueCubeCBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsBlueCube), gl.STATIC_DRAW );

    blueCubeVBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, blueCubeVBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsBlueCube), gl.STATIC_DRAW );
}

function renderBlueCube(ctm) {
    gl.bindBuffer( gl.ARRAY_BUFFER, blueCubeCBuffer );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, blueCubeVBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    ctm = mult( ctm, scale4( 0.2, 0.2, 0.2) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
    gl.drawArrays( gl.TRIANGLES, 0, blueCubeNumVertices );
}