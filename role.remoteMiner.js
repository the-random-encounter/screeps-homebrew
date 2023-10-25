const roleRemoteMiner = {

	run: function (creep) {
			
		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		
		if (!creep.memory.disableAI) {

			if (creep.ticksToLive <= 2) {
				creep.say('☠️');
			}

			if (!creep.memory.working && creep.store.getUsedCapacity() > 0) {
				creep.memory.working = true;
				creep.say('⛏️');
			}
			
			if (creep.memory.working && creep.store.getFreeCapacity() < (creep.getActiveBodyparts(WORK) * 2))
				creep.memory.working = false;

			if (creep.store.getFreeCapacity() == 0 || creep.store.getFreeCapacity() < (creep.getActiveBodyparts(WORK) * 2)) {
				const containers = creep.room.find(FIND_STRUCTURES, { filter: (i) => ((i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE || i.structureType == STRUCTURE_LINK) && (i.hits < i.hitsMax)) });
				const target = creep.pos.findClosestByRange(containers);
				if (target)
					creep.repair(target);
				else
					creep.unloadEnergy();
			}
			else
				creep.harvestEnergy();
			
		}
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
	}
};

module.exports = roleRemoteMiner;