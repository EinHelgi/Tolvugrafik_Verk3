/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

_entities : [],

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

getNewSpatialID : function() {
    var id = this._nextSpatialID;
    this._nextSpatialID++;
    return id;
},

register: function(entity) {
    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();
    this._entities[spatialID]=entity;

},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();
    this._entities[spatialID]=false;
},

findEntityInRange: function(posX, posY, radius) {
    for(var i=1; i<this._nextSpatialID; ++i) 
    {
        var thing = this._entities[i];
        if (thing) {
            var dist = Math.sqrt(util.distSq(posX, posY, thing.cx, thing.cy));
            if(dist<(radius+thing.getRadius())) {
                return thing;
            }
        }
    }
},

render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";
    
    for (var ID in this._entities) {
        var e = this._entities[ID];
        if(e){util.strokeCircle(ctx, e.cx, e.cy, e.getRadius());}
    }
    ctx.strokeStyle = oldStyle;
}

}
