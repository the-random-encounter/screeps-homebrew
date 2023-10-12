const roleRepairer = {

	run: function (creep) {
		
		
		if (creep.store.getUsedCapacity() == 0) {

			const containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
				filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
					i.store[RESOURCE_ENERGY] > 0
			});
			const droppedPiles = creep.room.find(FIND_DROPPED_RESOURCES);
			const resourceList = containersWithEnergy.concat(droppedPiles);
	
			const target = creep.pos.findClosestByRange(resourceList);
			if (target) {
				if (creep.pickup(target) == ERR_NOT_IN_RANGE || creep.withdraw(target, RESOURCE_ENERGY)) {
					creep.moveTo(target, { visualizePathStyle: { stroke: '#ff6600', opacity: 0.3 } });
				}
				else {
					creep.withdraw(target, RESOURCE_ENERGY);
					creep.pickup(target);
				}
			}
		} else {
		
			const targets = creep.room.find(FIND_STRUCTURES, {
				filter: object => (object.hits < object.hitsMax) && object.structureType !== STRUCTURE_WALL
			});

			//targets.sort((a, b) => a.hits - b.hits);
		
			const target = creep.pos.findClosestByRange(targets);
			if (target) {
				if (creep.repair(target) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target, { visualizePathStyle: { stroke: '#ff6600', opacity: 0.3 } });
				}
			}
		}
	}
}

module.exports = roleRepairer;