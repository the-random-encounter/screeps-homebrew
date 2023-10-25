const roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
    
        if (creep.memory.disableAI === undefined)
            creep.memory.disableAI = false;

        if (!creep.memory.disableAI) {

            if (creep.ticksToLive <= 2) {
                creep.unloadEnergy();
                creep.say('☠️');
            }

            // a specific fix for local room harvesters standing in a dumb spot
            if (creep.room.name == 'E58S51') {
                if (creep.pos.x == 41 && creep.pos.y == 7)
                    creep.move(7);
            }

            if (!creep.memory.working && creep.store[RESOURCE_ENERGY] > 0) {
                creep.memory.working = true;
                creep.say('⛏️');
            }

            if (creep.memory.working && creep.store.getFreeCapacity() < (creep.getActiveBodyparts(WORK) * 2))
                creep.memory.working = false;

            // deposit energy into container, storage, or link when close to full
            if (creep.store.getFreeCapacity() < (creep.getActiveBodyparts(WORK) * 2))
                creep.unloadEnergy();
            else {
                // if the crane isn't there but the link has energy, go ahead and pull it out
                if (creep.pos.x == 40 && creep.pos.y == 7) {
                    const crane = creep.pos.findInRange(FIND_MY_CREEPS, 1, { filter: (creep) => creep.memory.role == 'crane' });
                    
                    if (!creep.pos.isNearTo(crane[0])) {
                        if (Game.getObjectById(creep.room.memory.objects.links[0]).store.getUsedCapacity() > 0)
                            creep.withdraw(Game.getObjectById(creep.room.memory.objects.links[0]), RESOURCE_ENERGY);
                    } else {
                        creep.harvestEnergy();
                    }
                } else {
                    creep.harvestEnergy();
                }
            }
        }
        else {
            console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
            creep.say('AI Disabled');
        }
    }
}

module.exports = roleHarvester;