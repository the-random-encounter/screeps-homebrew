const creepFunctions = require('creepFunctions');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            if(creep.transfer(Game.spawns['HomeSpawn'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['HomeSpawn']);
            }
        }
    }
};

var roleMiner = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            if (creep.store.getFreeCapacity() === 0) {
                creep.drop(RESOURCE_ENERGY);
            }
        }
    }
};

var roleCollector = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.busy && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.busy = false;
            creep.say('🔄 reloading!');
            console.log(creep.name + ': 🔄 reloading!');
        }
        if(!creep.memory.busy && creep.store.getFreeCapacity() == 0) {
            creep.memory.busy = true;
            creep.say('🚧 halt! hammerzeit!');
            console.log(creep.name + ': 🚧 halt! hammerzeit!');
        }

        if(creep.memory.busy) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleHarvester;
module.exports = roleMiner;
module.exports = roleCollector;