const roleRepairer = {

	run: function (creep) {
		
		if (creep.ticksToLive <= 2) {
			creep.drop(RESOURCE_ENERGY);
			creep.say('☠️');
		}
		
		if (creep.store.getUsedCapacity() == 0) {

			switch (creep.room.memory.flags.runnerLogic) {
				case true: {
					const containersWithEnergy = creep.room.find(FIND_MY_STRUCTURES, {
						filter: (i) => i.structureType == STRUCTURE_STORAGE &&
							i.store[RESOURCE_ENERGY] > 0
					});

					const target = creep.pos.findClosestByRange(containersWithEnergy);
					if (target) {
						if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
							creep.moveTo(target, { visualizePathStyle: { stroke: '#ff6600', opacity: 0.3, lineStyle: 'dotted' } });
						else
							creep.withdraw(target, RESOURCE_ENERGY);
					}
					break;
				}
				case false: 
				default: {

					const containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
						filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
							i.store[RESOURCE_ENERGY] > 0
					});
					const droppedPiles = creep.room.find(FIND_DROPPED_RESOURCES);
					const resourceList = containersWithEnergy.concat(droppedPiles);

					const target = creep.pos.findClosestByRange(resourceList);
					if (target) {
						if (creep.pickup(target) == ERR_NOT_IN_RANGE || creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(target, { visualizePathStyle: { stroke: '#ff6600', opacity: 0.3, lineStyle: 'dotted' } });
						}
						else {
							creep.withdraw(target, RESOURCE_ENERGY);
							creep.pickup(target);
						}
					}
					break;
				}
			}
		} else {

			var towers = creep.room.find(FIND_STRUCTURES);

			towers = _.filter(towers, function (struct) {
				return (struct.structureType == STRUCTURE_TOWER && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
			});
	
			if (towers.length) {

				// find closest tower to creep
				const towerTarget = creep.pos.findClosestByRange(towers);
				if (towerTarget) {
					// move to the target
					if (creep.pos.isNearTo(towerTarget)) {
						// transfer energy
						creep.transfer(towerTarget, RESOURCE_ENERGY);
					} else {
						creep.moveTo(towerTarget, { visualizePathStyle: { stroke: '#ff6600', opacity: 0.3 } });
					}
				}
			} else {
			
				// search for ramparts under 90% health
				let targets = creep.room.find(FIND_STRUCTURES, { filter: (i) => ((i.hits / i.hitsMax * 100) <= 90) && (i.structureType == STRUCTURE_RAMPART) });

				// if no ramparts under 90%, search for roads/spawns/towers/extensions under 95%
				if (!targets.length)
					targets = creep.room.find(FIND_STRUCTURES, { filter: (i) => ((i.hits / i.hitsMax * 100) <= 95) && (i.structureType == STRUCTURE_TOWER || i.structureType == STRUCTURE_SPAWN || i.structureType == STRUCTURE_EXTENSION || i.structureType == STRUCTURE_ROAD) });
				
				const target = creep.pos.findClosestByRange(targets);

				// travel to closest object within repair criteria and start repairing!
				if (target) {
					if (creep.repair(target) == ERR_NOT_IN_RANGE)
						creep.moveTo(target, { visualizePathStyle: { stroke: '#ff6600', opacity: 0.3 } });
				}
			}
		}
	}
}
module.exports = roleRepairer;