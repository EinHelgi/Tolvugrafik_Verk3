
//----------------------------------------------------------------------------
// Define the transformation scale here (two scale functions in MV.js)
function scale4( x, y, z )
{
    if ( Array.isArray(x) && x.length == 3 ) {
        z = x[2];
        y = x[1];
        x = x[0];
    }

    var result = mat4();
    result[0][0] = x;
    result[1][1] = y;
    result[2][2] = z;

    return result;
}

function rotateStuff(x, y, z, ctm) {
    ctm = mult( ctm, rotate( x, [1, 0, 0] ) );
    ctm = mult( ctm, rotate( y, [0, 1, 0] ) );
    ctm = mult( ctm, rotate( z, [0, 0, 1] ) );
    return ctm;
}

function gotToTile(x, y, z, ctm) {
    ctm = mult( ctm, translate( (2-x)*tileSize+0.1, (10-y)*tileSize-0.1, (2-z)*tileSize+0.1));
    return ctm;
}

function toRadians (angle) {
  return angle * (Math.PI / 180);
}

function checkOutofBounds() {
    getTiles();
    if(posM[0]<0 || posL[0]<0 || posR[0]<0 || posM[0]>5 || posL[0]>5 || posR[0]>5 ||
       posM[2]>5 || posL[2]>5 || posR[2]>5 || posM[2]<0 || posL[2]<0 || posR[2]<0) {
        return true;
    }
    return false;
}

function calcPos(pos) {
    var x = toRadians(rotX);
    var y = toRadians(rotY);
    var z = toRadians(rotZ);
    var postemp = [Math.round(pos[0]*Math.cos(z)-pos[1]*Math.sin(z)), 
                Math.round(pos[0]*Math.sin(z)+pos[1]*Math.cos(z)), 
                pos[2]];
    postemp = [Math.round(postemp[2]*Math.sin(y)+postemp[0]*Math.cos(y)), 
                postemp[1],
                Math.round(postemp[2]*Math.cos(y)-postemp[0]*Math.sin(y))];
    postemp = [postemp[0],
                Math.round(postemp[1]*Math.cos(x)-postemp[2]*Math.sin(x)),
                Math.round(postemp[1]*Math.sin(x)+postemp[2]*Math.cos(x))];
    return [posM[0]+postemp[0], posM[1]+postemp[1], posM[2]+postemp[2]];
}

function getTiles() {
    if(isIbeam) {
        posL = [-1,  0,  0];
        posR = [ 1,  0,  0];
    }
    else {
        posL = [ 0, -1,  0];
        posR = [ 1,  0,  0];
    }
    posL = calcPos(posL);
    posR = calcPos(posR);
    return [posL, posM, posR];
}