const roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
    
        if (creep.ticksToLive <= 2) {
            creep.unloadEnergy();
            //creep.drop(RESOURCE_ENERGY);
            creep.say('☠️');
        }

        // declare specific RoomPosition objects
        const badSourcePos = new RoomPosition(41, 7, 'E57S51');

        if (creep.pos === badSourcePos) {
            creep.move(7);
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