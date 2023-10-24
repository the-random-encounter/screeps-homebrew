const roleMiner = {

	run: function (creep) {
    
		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		
		if (!creep.memory.disableAI) {

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
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
}

module.exports = roleMiner;