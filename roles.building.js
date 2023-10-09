const creepFunctions = require('creepFunctions');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.busy && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.busy = false;
            creep.say('🔄 we require more minerals');
            console.log(creep.name + ': 🔄 we require more minerals');
            const droppedResources = creep.room.find(FIND_DROPPED_RESOURCES);
            const closestRes = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            const homeSpawn = creep.room.find(FIND_MY_SPAWNS);
        
        
        //while (droppedResources.length > 0) {
        
        // if (droppedResources.length) {
        // targetRes = droppedResources.shift();
                
        creep.moveTo(closestRes);
        creep.pickup(closestRes);
        }
        if (!creep.memory.busy && creep.store.getFreeCapacity() == 0) {
            creep.memory.busy = true;
            creep.say('🚧 building our own heaven, bigger and better');
            console.log(creep.name + ': 🚧 building our own heaven, bigger and better');
        }

        if (creep.memory.busy) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {
                        visualizePathStyle: { stroke: '#ffffff' }
                    });
                }
            }
        }
        else {
            let source = Game.getObjectById(creep.memory.source) || creep.findEnergySource();
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.busy && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.busy = false;
            creep.say('🔄 we do not have enough vespene gas');
            console.log(creep.name + ': 🔄 we do not have enough vespene gas');
        }
        if(!creep.memory.busy && creep.store.getFreeCapacity() == 0) {
            creep.memory.busy = true;
            creep.say('⚡ upgrade it with the latest nVidia chips');
            console.log(creep.name + ': ⚡ upgrade it with the latest nVidia chips');
        }

        if(!creep.memory.busy) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            let source = Game.getObjectById(creep.memory.source) || creep.findEnergySource();
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleBuilder;
module.exports = roleUpgrader;