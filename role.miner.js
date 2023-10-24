const roleMiner = {

	run: function (creep) {
    
        if (!creep.memory.disableAI) {
		
            creep.memory.disableAI = false;
            
            if (creep.ticksToLive <= 2) {
                creep.unloadMineral();
                creep.say('☠️');
            }
                
            if (!creep.memory.working && creep.store[RESOURCE_ENERGY] > 0) {
                creep.memory.working = true;
                creep.say('⛏️');
            }

            if (creep.memory.working && creep.store.getFreeCapacity() < (creep.getActiveBodyparts(WORK) * 2))
                creep.memory.working = false;

            if (creep.store.getFreeCapacity() == 0 || creep.store.getFreeCapacity() < (creep.getActiveBodyparts(WORK) * 2))
                creep.unloadMineral();
            else
                creep.harvestMineral();

        }
    }
}

module.exports = roleMiner;