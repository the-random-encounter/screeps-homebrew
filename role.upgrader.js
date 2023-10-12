const roleUpgrader = {

		/** @param {Creep} creep **/
		run: function(creep) {

				if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
						creep.memory.working = false;
						creep.say('🔼 collect');
				}
				if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
						creep.memory.working = true;
						creep.say('⚡ upgrade');
				}

				// if working flag is true, upgrade local controller
				if(creep.store.getUsedCapacity() !== 0) {
						if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
								creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffff00', opacity: 0.3}});
						}
				}
		
				// if not working & inventory is empty, collect more energy
				if (!creep.memory.working && creep.store.getUsedCapacity() == 0) {
					
						
						//creep.pickupClosestEnergy();
						const containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
    						filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
								i.store[RESOURCE_ENERGY] > 0
						});
						const droppedPiles = creep.room.find(FIND_DROPPED_RESOURCES);
						const resourceList = containersWithEnergy.concat(droppedPiles);
						
					const target = creep.pos.findClosestByRange(resourceList);
								if (target) {
									if (creep.pickup(target) == ERR_NOT_IN_RANGE || creep.withdraw(target, RESOURCE_ENERGY)) {
										creep.moveTo(target, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3 } });
									}
									else {
										creep.withdraw(target, RESOURCE_ENERGY);
										creep.pickup(target);
									}
								}
					
				}
		}
};

module.exports = roleUpgrader;