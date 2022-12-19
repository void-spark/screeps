var roleWorker = require('role.worker');
var plan = require('plan');
var { notBlocked, forSquare } = require('util');

module.exports.loop = function () {

    const workerRole = 'W';
    const roles = [workerRole];

    const spawn = Game.spawns['Spawn1'];
    const room = spawn.room;

    const creeps = Object.values(Game.creeps);
    const sources = room.find(FIND_SOURCES);

    const creepsByRole = {};
    roles.forEach(role => creepsByRole[role] = creeps.filter(creep => creep.memory.role == role));

    const workers = creepsByRole[workerRole];

    if (!Memory.sources) {
        Memory.sources = {};

        sources.forEach(source => {
            let free = 0;
            forSquare(source.pos.x, source.pos.y, 1, 0, (x, y) => {
                const ok = notBlocked(room, x, y);
                if (ok) {
                    free++;
                }
            });

            Memory.sources[source.id] = { free: free };
        });
    }

    const totalFree = Object.values(Memory.sources).map(source => source.free).reduce((acc, curr) => acc + curr);

    if (!global.sources) {
        console.log("Global seems reset");
        global.sources = {};

        sources.forEach(source => {
            global.sources[source.id] = source;
        });
    }

    const units = roles.map(role => `${role}: ${creepsByRole[role].length}`).join(', ');
    const resources = `e: ${room.energyAvailable} / ${spawn.store.getCapacity(RESOURCE_ENERGY)}`;
    room.visual.text(`${units} - ${resources}`, 2, 2, { font: 1.5, align: 'left', opacity: 0.7 });


    if (Game.time % 30 == 0) {
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log(`Clearing non-existing creep memory: ${name}`);
            }
        }
    }


    const workersPerFreeSpace = 2;

    if (spawn.spawning) {
        var spawningCreep = Game.creeps[spawn.spawning.name];
        spawn.room.visual.text('🛠️' + spawningCreep.memory.role, spawn.pos.x + 1, spawn.pos.y, { align: 'left', opacity: 0.8 });
    } else if (workers.length < totalFree * workersPerFreeSpace) {
        var newName = 'Worker' + Game.time;
        console.log(`Spawning new worker: ${newName}`);
        spawn.spawnCreep([WORK, CARRY, MOVE], newName,
            { memory: { role: workerRole } });
    }

    var tower = Game.getObjectById('0dedb3a4b26a35f52fb25eba');
    if (tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }

    plan(spawn);

    //workers.forEach(creep => roleWorker.run(creep));
    //creeps.forEach(creep => roleWorker.run(creep));

    const creepIt = creeps[Symbol.iterator]();
    sources.forEach(source => {
        const free = Memory.sources[source.id].free;
        for (let cnt = 0; cnt < free; cnt++) {
            for (let cnt2 = 0; cnt2 < workersPerFreeSpace; cnt2++) {
                const next = creepIt.next();
                if (!next.done) {
                    roleWorker.run(next.value, source);
                }
            }
        }
    });
}
