
"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function I_beam(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

I_beam.prototype.setPos = function (cx, cy, cz) {
    this.cx = cx;
    this.cy = cy;
    this.cz = cz;
}

I_beam.prototype.buffer = function () {
	ICBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, ICBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsI), gl.STATIC_DRAW );

    IVBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, IVBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsI), gl.STATIC_DRAW );
}

I_beam.prototype.render = function (ctm) {
    gl.bindBuffer( gl.ARRAY_BUFFER, ICBuffer );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, IVBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    
    ctm = mult( ctm, scale4( 0.2, 0.2, 0.2) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
    gl.drawArrays( gl.TRIANGLES, 0, INumVertices );
};