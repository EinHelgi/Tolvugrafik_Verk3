/////////////////////////////////////////////////////////////////
//      gert fyrir verkefni í Tölvugrafík    
//
//
//      Cube í WebGL tilbúinn fyrir buffering og render
//
//      Einar Helgi Þrastarson
//      Sigurður Birkir Sigurðsson
/////////////////////////////////////////////////////////////////
var INumVertices  = 108;

var colorsI = [];
var pointsI = [];
var IVBuffer;
var ICBuffer;

function colorI()
{
    quadI( 1, 0, 3, 2 );
    quadI( 2, 3, 7, 6 );
    quadI( 3, 0, 4, 7 );
    quadI( 6, 5, 1, 2 );
    quadI( 4, 5, 6, 7 );
    quadI( 5, 4, 0, 1 );
}

function quadI(a, b, c, d) 
{
    var p = 0.48;
    var vertexColors = [
        [ 0.0, 0.3, 0.0, 1.0 ],  // black
        [ 0.0, 0.4, 0.0, 1.0 ],  // red
        [ 0.0, 0.5, 0.0, 1.0 ],  // yellow
        [ 0.0, 0.6, 0.0, 1.0 ],  // green
        [ 0.0, 0.7, 0.0, 1.0 ],  // blue
        [ 0.0, 0.8, 0.0, 1.0 ],  // magenta
        [ 0.0, 0.9, 0.0, 1.0 ],  // cyan
        [ 0.0, 1.0, 0.0, 1.0 ]   // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices
    
    //vertex color assigned by the index of the vertex
    
    var indices = [ a, b, c, a, c, d ];
    for(k = -1; k < 2; ++k) {
    	var vertices = [
        vec3( -p+k, -p,  p ),
        vec3( -p+k,  p,  p ),
        vec3(  p+k,  p,  p ),
        vec3(  p+k, -p,  p ),
        vec3( -p+k, -p, -p ),
        vec3( -p+k,  p, -p ),
        vec3(  p+k,  p, -p ),
        vec3(  p+k, -p, -p )
    	];
	    for ( var i = 0; i < indices.length; ++i ) {
	        pointsI.push( vertices[indices[i]] );
	    
	        // for solid colored faces use 
	        colorsI.push(vertexColors[a]);
	        
	    }
	}
}

function bufferI() {
    ICBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, ICBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsI), gl.STATIC_DRAW );

    IVBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, IVBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsI), gl.STATIC_DRAW );
}

function renderI(ctm) {
    gl.bindBuffer( gl.ARRAY_BUFFER, ICBuffer );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, IVBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    ctm = mult( ctm, scale4( 0.2, 0.2, 0.2) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
    gl.drawArrays( gl.TRIANGLES, 0, INumVertices );
}