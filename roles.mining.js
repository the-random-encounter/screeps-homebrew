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
            const homeSpawn = creep.room.find(FIND_MY_SPAWNS);    
            creep.transfer(homeSpawn, RESOURCE_ENERGY);
            creep.transfer(creep.room.find(STRUCTURE_EXTENSION));
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

        if (creep.memory.busy && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.busy = false;
            creep.say('🔄 reloading!');
            console.log(creep.name + ': 🔄 reloading!');
            
            const closestRes = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            creep.moveTo(closestRes);
            creep.pickup(closestRes);
        }
        if (!creep.memory.busy && creep.store.getFreeCapacity() == 0) {
            creep.memory.busy = true;
            creep.say('🚧 halt! hammerzeit!');
            console.log(creep.name + ': 🚧 halt! hammerzeit!');
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                var sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }

        if (!creep.memory.busy) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

var roleGatherer = {
    
    run: function (creep) {
        
        const closestRes = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        const homeSpawn = creep.room.find(FIND_MY_SPAWNS);
        creep.moveTo(closestRes);
        creep.pickup(closestRes);
        
        creep.moveTo(closestRes);
        creep.pickup(closestRes);
        creep.moveTo(homeSpawn);
                
        creep.transfer(homeSpawn, RESOURCE_ENERGY);
        creep.transfer(creep.room.find(STRUCTURE_EXTENSION))
                
        if (!creep.memory.busy) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        } else {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {
                        visualizePathStyle: { stroke: '#ffffff' }
                    });
                }
            }
        }
    }
};

module.exports = roleHarvester;
module.exports = roleMiner;
module.exports = roleCollector;
module.exports = roleGatherer;