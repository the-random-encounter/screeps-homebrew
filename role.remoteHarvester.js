const roleRemoteHarvester = {

	run: function (creep) {
		
		if (creep.ticksToLive <= 2) {
			creep.unloadEnergy();
			creep.say('☠️');
		}

		if (!creep.memory.working && creep.store[RESOURCE_ENERGY] > 0) {
			creep.memory.working = true;
			creep.say('⛏️');
		}
		
		if (creep.memory.working && creep.store.getFreeCapacity() < (creep.getActiveBodyparts(WORK) * 2))
				creep.memory.working = false;

		if (creep.store.getFreeCapacity() == 0 || creep.store.getFreeCapacity() < (creep.getActiveBodyparts(WORK) * 2)) {
			const containers = creep.room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_CONTAINER } });
			const target = creep.pos.findClosestByRange(containers);
			if (target)
				creep.repair(target);
			else
				creep.unloadEnergy();
		}
		else
			creep.harvestEnergy();
	}
}

module.exports = roleRemoteHarvester;