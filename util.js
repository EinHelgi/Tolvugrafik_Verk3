
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

function configureTexture(image) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
    textures.push(texture);
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
    updatePos();
    if(posM[0]<0 || posL[0]<0 || posR[0]<0 || posM[0]>5 || posL[0]>5 || posR[0]>5 ||
       posM[2]>5 || posL[2]>5 || posR[2]>5 || posM[2]<0 || posL[2]<0 || posR[2]<0) {
        return true;
    }
    if(grid[posR[1]] !== 0 && grid[posR[1]] !== undefined) {
        if(grid[posR[1]][posR[0]][posR[2]] !== 0) {
            return true;
        }
    }
    if(grid[posM[1]] !== 0 && grid[posM[1]] !== undefined) {
        if(grid[posM[1]][posM[0]][posM[2]] !== 0) {
            return true;
        }
    }
    if(grid[posL[1]] !== 0 && grid[posL[1]] !== undefined) {
        if(grid[posL[1]][posL[0]][posL[2]] !== 0) {
            return true;
        }
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

function updatePos() {
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
}

function checkIfLanding(beamtype) {
    updatePos();
    var landing = false;
    if(posR[1] === 19 || posM[1] === 19 || posL[1] === 19) {
        count = 0.0;
        landing = true;
    }
    if(grid[posR[1]+1] !== 0 && grid[posR[1]+1] !== undefined) {
        if(grid[posR[1]+1][posR[0]][posR[2]] !== 0 && grid[posR[1]+1][posR[0]][posR[2]] !== undefined) {
            landing = true;
        }
    }
    if(grid[posM[1]+1] !== 0 && grid[posM[1]+1] !== undefined) {
        if(grid[posM[1]+1][posM[0]][posM[2]] !== 0 && grid[posM[1]+1][posM[0]][posM[2]] !== undefined) {
            landing = true;
        }
    }
    if(grid[posL[1]+1] !== 0 && grid[posL[1]+1] !== undefined) {
        if(grid[posL[1]+1][posL[0]][posL[2]] !== 0 && grid[posL[1]+1][posL[0]][posL[2]] !== undefined) {
            landing = true;
        }
    }
    if(landing) landingBeam(beamtype);
}

function landingBeam(beamtype) {
    count = 0.0;
    if(posM[1]<=0) return restartGame();

    if(grid[posL[1]] === 0) grid[posL[1]] = giveEmptyFloor();
    if(grid[posM[1]] === 0) grid[posM[1]] = giveEmptyFloor();
    if(grid[posR[1]] === 0) grid[posR[1]] = giveEmptyFloor();

    grid[posL[1]][posL[0]][posL[2]] = [rotX, rotY, rotZ, beamtype];
    grid[posM[1]][posM[0]][posM[2]] = [rotX, rotY, rotZ, beamtype];
    grid[posR[1]][posR[0]][posR[2]] = [rotX, rotY, rotZ, beamtype];
    
    newBeam();
}

function checkGrid() {
    var cubePerFloor;
    for(var y=0; y<grid.length; ++y) {
        if(grid[y]!==0) {
            cubePerFloor = 0;
            for(var x=0; x<grid[y].length; ++x) {
                for(var z=0; z<grid[y][x].length; ++z) {
                    if(grid[y][x][z] !== 0) {
                        cubePerFloor++;
                    }
                }
            }
            if(cubePerFloor === 36) deleteFloor(y);
        }
    }
}

function deleteFloor(y0) {
    grid[y0] = giveEmptyFloor();
    for(var x=0; x<6; ++x) {
        for(var z=0; z<6; ++z) {
            for(var y=19; y>=0; --y) {
                if(grid[y-1] !== 0) {
                    if(grid[y] !== 0) {
                        if(grid[y-1][x][z] !== 0) {
                            grid[y][x][z] = grid[y-1][x][z];
                            grid[y-1][x][z] = 0;
                        }
                    }
                }
            }
        }
    }
}

function makeFloor() {
    var y = 19
    if(grid[y]===0) grid[y] = giveEmptyFloor();
    for(var x=0; x<grid[y].length; ++x) {
        for(var z=0; z<grid[y][x].length; ++z) {
            grid[y][x][z] = [0, 0, 0];
        }
    }
}

function giveEmptyFloor() {
    return [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];
}

function restartGame() {
    points = 0;
    label.innerHTML = points;
    grid = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    newBeam();
}