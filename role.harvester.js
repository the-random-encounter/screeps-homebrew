const roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
    
        if (creep.ticksToLive <= 2) {
            creep.unloadEnergy();
            creep.say('☠️');
        }

        // a specific fix for local room harvesters standing in a dumb spot
        if (creep.room.name == 'E58S51') {
            if (creep.pos.x == 41 && creep.pos.y == 7)
                creep.move(7);
            if (creep.pos.x == 41 && creep.pos.y == 18)
                creep.move(1);
        }

        if (!creep.memory.working && creep.store[RESOURCE_ENERGY] > 0) {
            creep.memory.working = true;
            creep.say('⛏️');
        }
        if (creep.memory.working && creep.store.getFreeCapacity() < (creep.getActiveBodyparts(WORK) * 2)) {
            creep.memory.working = false;
        }

        if (creep.store.getFreeCapacity() == 0 || creep.store.getFreeCapacity() < (creep.getActiveBodyparts(WORK) * 2)) {
            creep.unloadEnergy();
        }
        else {
            creep.harvestEnergy();
        }
    }
}

module.exports = roleHarvester;