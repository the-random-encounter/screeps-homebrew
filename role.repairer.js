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
		
			var towers = creep.room.find(FIND_STRUCTURES);

			towers = _.filter(towers, function (struct) {
				return (struct.structureType == STRUCTURE_TOWER && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
			});
			
			if (towers.length) {

				// find closest spawn or extension to creep
				const towerTarget = creep.pos.findClosestByRange(towers);
                if (towerTarget) {
				// move to the target
				if (creep.pos.isNearTo(towerTarget)) {
					// transfer energy
					creep.transfer(towerTarget, RESOURCE_ENERGY);
				} else {
					creep.moveTo(towerTarget, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3 } });
				}
                } 
			} else {
			    
				let targets = creep.room.find(FIND_STRUCTURES, {
					filter: object => (object.hits !== object.hitsMax) && (object.structureType == STRUCTURE_ROAD || object.structureType == STRUCTURE_CONTAINER || object.structureType == STRUCTURE_TOWER || object.structureType == STRUCTURE_SPAWN || object.structureType == STRUCTURE_EXTENSION) /*|| object.structureType == STRUCTURE_WALL*/
				});
				
				//targets.sort((a, b) => a.hits - b.hits);

				if (!targets) {
					targets = creep.room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_WALL } });
				}
				
				const target = creep.pos.findClosestByRange(targets);

				if (target) {
					if (creep.repair(target) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target, { visualizePathStyle: { stroke: '#ff6600', opacity: 0.3 } });
					}
				}
			}
		}
	}
}
module.exports = roleRepairer;