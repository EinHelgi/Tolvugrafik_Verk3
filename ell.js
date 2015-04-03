/////////////////////////////////////////////////////////////////
//      gert fyrir verkefni í Tölvugrafík    
//
//
//      Cube í WebGL tilbúinn fyrir buffering og render
//
//      Einar Helgi Þrastarson Febrúar, 2015
/////////////////////////////////////////////////////////////////
var LNumVertices  = 108;

var colorsL = [];
var pointsL = [];
var LVBuffer;
var LCBuffer;

function colorL()
{
    quadL( 1, 0, 3, 2 );
    quadL( 2, 3, 7, 6 );
    quadL( 3, 0, 4, 7 );
    quadL( 6, 5, 1, 2 );
    quadL( 4, 5, 6, 7 );
    quadL( 5, 4, 0, 1 );
}

function quadL(a, b, c, d) 
{
    var p = 0.48;
    var vertexColors = [
        [ 0.0, 0.0, 0.3, 1.0 ],  // black
        [ 0.0, 0.0, 0.4, 1.0 ],  // red
        [ 0.0, 0.0, 0.5, 1.0 ],  // yellow
        [ 0.0, 0.0, 0.6, 1.0 ],  // green
        [ 0.0, 0.0, 0.7, 1.0 ],  // blue
        [ 0.0, 0.0, 0.8, 1.0 ],  // magenta
        [ 0.0, 0.0, 0.9, 1.0 ],  // cyan
        [ 0.0, 0.0, 1.0, 1.0 ]   // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices
    
    //vertex color assigned by the index of the vertex
    
    var indices = [ a, b, c, a, c, d ];
    for(k = -1; k < 1; ++k) {
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
	        pointsL.push( vertices[indices[i]] );
	    
	        // for solid colored faces use 
	        colorsL.push(vertexColors[a]);
	        
	    }
	}

    var vertices = [
        vec3( -p, -p+k,  p ),
        vec3( -p,  p+k,  p ),
        vec3(  p,  p+k,  p ),
        vec3(  p, -p+k,  p ),
        vec3( -p, -p+k, -p ),
        vec3( -p,  p+k, -p ),
        vec3(  p,  p+k, -p ),
        vec3(  p, -p+k, -p )
        ];
        for ( var i = 0; i < indices.length; ++i ) {
            pointsL.push( vertices[indices[i]] );
        
            // for solid colored faces use 
            colorsL.push(vertexColors[a]);
            
        }
}

function bufferL() {
    LCBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, LCBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsL), gl.STATIC_DRAW );

    LVBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, LVBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsL), gl.STATIC_DRAW );
}

function renderL(ctm) {
    gl.bindBuffer( gl.ARRAY_BUFFER, LCBuffer );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, LVBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    
    ctm = mult( ctm, scale4( 0.2, 0.2, 0.2) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
    gl.drawArrays( gl.TRIANGLES, 0, LNumVertices );
}