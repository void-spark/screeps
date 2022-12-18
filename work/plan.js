function plan(spawn) {
    const room = spawn.room;
    const extensionsAvailable = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][room.controller.level];
    const extensions = room.find(FIND_MY_STRUCTURES).filter(structure => structure.structureType == STRUCTURE_EXTENSION);

    if(extensionsAvailable >= extensions.length) {
        const sites = room.find(FIND_CONSTRUCTION_SITES);
        if(sites.length == 0) {

            var found = false;            
            for (let x = 0; !found && x < 3; x++) {            
                for (let y = 0; !found && y < 3; y++) {
                    if((x != 0 && x != 2) && (y != 0 && y != 2)) {
                        continue;
                    }
                    const xVal = spawn.pos.x + (x * 2 - 2);
                    const yVal = spawn.pos.y  + (y * 2 - 2);
                    const look = room.lookAt(xVal, yVal);
                    var ok = true;
                    look.forEach(lookObject => {
                        if(lookObject.type == LOOK_TERRAIN && lookObject[LOOK_TERRAIN] == 'wall') {
                            ok = false;
                        } else if(lookObject.type == LOOK_STRUCTURES) {
                            ok = false;
                        }
                    });
                    if(ok) {
                        console.log(`Build at: ${xVal}, ${yVal}`);
                        room.createConstructionSite(xVal, yVal, STRUCTURE_EXTENSION);
                        found = true;
                    }
                }
            }
        }
    }
}

module.exports = plan;