var roleWorker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var say = false;

        if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
	    }

	    if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
	        creep.memory.working = true;
	        say = true;
	    }


	    if(!creep.memory.working) {
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            return;
	    }


        var targets = creep.room.find(FIND_STRUCTURES).filter( structure => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && 
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
        );
        if(targets.length) {
            if(say) { creep.say('feed') };
            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return;
        }
        
        targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if(targets.length) {
	        if (say) { creep.say('🚧 build')};
            if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return;
        }

        if(say) { creep.say('⚡ upgrade') };
        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};

module.exports = roleWorker;