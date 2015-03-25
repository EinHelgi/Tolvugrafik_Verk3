/////////////////////////////////////////////////////////////////
//      gert fyrir verkefni í Tölvugrafík
//
//
//      Line á y-ás í WebGL tilbúinn fyrir buffering og render
//
//      Einar Helgi Þrastarson Febrúar, 2015
/////////////////////////////////////////////////////////////////
var LineNumVertices  = 2;

var colorsLine = [
	[ 1.0, 0.0, 0.0, 1.0 ],
	[ 1.0, 0.0, 0.0, 1.0 ]
	];
var pointsLine = [
	[ 0.0, 0.0, 0.0],
	[ 0.0, 1.0, 0.0]
	];
var lineVBuffer;
var lineCBuffer;

function bufferLine() {
    lineCBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, lineCBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsLine), gl.STATIC_DRAW );

    lineVBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, lineVBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsLine), gl.STATIC_DRAW );
}

function renderLine() {
    gl.bindBuffer( gl.ARRAY_BUFFER, lineCBuffer );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, lineVBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.LINES, 0, LineNumVertices );
}