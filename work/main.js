var roleWorker = require('role.worker');
var plan = require('plan');


module.exports.loop = function () {

    const workerRole = 'W';
    const roles = [workerRole];

    const spawn = Game.spawns['Spawn1'];
    const room = spawn.room;

    const creeps = Object.values(Game.creeps);
    const creepsByRole = {};
    roles.forEach(role => creepsByRole[role] = creeps.filter(creep => creep.memory.role == role));

    const workers = creepsByRole[workerRole];


    const units = roles.map(role => `${role}: ${creepsByRole[role].length}`).join(', ');
    const resources = `e: ${room.energyAvailable} / ${spawn.store.getCapacity(RESOURCE_ENERGY)}`;
    room.visual.text(`${units} - ${resources}` , 2, 2, {font: 1.5, align: 'left', opacity: 0.7});


    if(Game.time % 30 == 0) {
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log(`Clearing non-existing creep memory: ${name}`);
            }
        }
    }


    if(spawn.spawning) { 
        var spawningCreep = Game.creeps[spawn.spawning.name];
        spawn.room.visual.text('🛠️' + spawningCreep.memory.role, spawn.pos.x + 1, spawn.pos.y, {align: 'left', opacity: 0.8});
    } else if(workers.length < 4) {
        var newName = 'Worker' + Game.time;
        console.log(`Spawning new worker: ${newName}`);
        spawn.spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: workerRole}});
    }

    var tower = Game.getObjectById('0dedb3a4b26a35f52fb25eba');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
    
    plan(spawn);

    //workers.forEach(creep => roleWorker.run(creep));
    creeps.forEach(creep => roleWorker.run(creep));
}
