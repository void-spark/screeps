var { canBuild, forSquare } = require('util');

function plan(spawn) {
    const room = spawn.room;
    const extensionsAvailable = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][room.controller.level];
    const extensions = room.find(FIND_MY_STRUCTURES).filter(structure => structure.structureType == STRUCTURE_EXTENSION);

    if (extensionsAvailable >= extensions.length) {
        const sites = room.find(FIND_CONSTRUCTION_SITES);
        if (sites.length == 0) {
            forSquare(spawn.pos.x, spawn.pos.y, 1, 1, (x, y) => {
                const ok = canBuild(room, x, y);
                if (ok) {
                    console.log(`Build at: ${x}, ${y}`);
                    room.createConstructionSite(x, y, STRUCTURE_EXTENSION);
                }
                return ok;
            });
        }
    }
}

module.exports = plan;