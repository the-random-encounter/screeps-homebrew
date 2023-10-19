const roleUpgrader = {

		/** @param {Creep} creep **/
		run: function(creep) {

			if (creep.ticksToLive <= 2)
			creep.drop(RESOURCE_ENERGY);

			if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
					creep.memory.working = false;
					creep.say('🔼');
			}
			if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
					creep.memory.working = true;
					creep.say('⚡');
			}

			// if working flag is true, upgrade local controller
			if(creep.store.getUsedCapacity() !== 0) {
					if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
							creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffff00', opacity: 0.3}});
					}
			}
	
			// if not working & inventory is empty, collect more energy
			if (creep.store.getUsedCapacity() == 0) {
					
				const containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
						filter: (i) => (i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE) && i.store[RESOURCE_ENERGY] > 0
				});
				const droppedPiles = creep.room.find(FIND_DROPPED_RESOURCES);
				const resourceList = containersWithEnergy.concat(droppedPiles);
					
				const target = creep.pos.findClosestByRange(resourceList);
				
				if (target) {
					if (creep.pickup(target) == ERR_NOT_IN_RANGE || creep.withdraw(target, RESOURCE_ENERGY) == 	ERR_NOT_IN_RANGE) {
						creep.moveTo(target, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3 } });
					}
					else {
						switch (target.structureType) {
							case STRUCTURE_CONTAINER:
							case STRUCTURE_STORAGE:
								creep.withdraw(target, RESOURCE_ENERGY);
								break;
							default:
								creep.pickup(target);
						}
					}
				}
					
				}
		}
};

module.exports = roleUpgrader;