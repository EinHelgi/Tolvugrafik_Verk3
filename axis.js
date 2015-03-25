/////////////////////////////////////////////////////////////////
//		gert fyrir verkefni í Tölvugrafík
//
//
//		Axis í WebGL tilbúinn fyrir buffering og render
//
//      Einar Helgi Þrastarson Febrúar, 2015
/////////////////////////////////////////////////////////////////
var AxisNumVertices  = 6;

var axisVBuffer;
var axisCBuffer;

var colorsAxis = [
    [ 1.0, 0.0, 0.0, 1.0 ],     // X-ás er rauður
    [ 1.0, 0.0, 0.0, 1.0 ],
    [ 0.0, 1.0, 0.0, 1.0 ],     // Y-ás er grænn
    [ 0.0, 1.0, 0.0, 1.0 ],
    [ 0.0, 0.0, 1.0, 1.0 ],     // Z-ás er blár
    [ 0.0, 0.0, 1.0, 1.0 ]
    ];
var pointsAxis = [
	[ -1.5,  0.0,  0.0 ],
    [  1.5,  0.0,  0.0 ],
    [  0.0, -1.5,  0.0 ],
    [  0.0,  1.5,  0.0 ],
    [  0.0,  0.0, -1.5 ],
    [  0.0,  0.0,  1.5 ]
    ];

function bufferAxis() {
    axisCBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, axisCBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsAxis), gl.STATIC_DRAW );

    axisVBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, axisVBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsAxis), gl.STATIC_DRAW );
}

function renderAxis() {
    gl.bindBuffer( gl.ARRAY_BUFFER, axisCBuffer );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, axisVBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.LINES, 0, AxisNumVertices );
}