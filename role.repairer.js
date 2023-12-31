const roleRepairer = {

	run: function (creep) {
		
		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		
		if (!creep.memory.disableAI) {
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
								creep.moveTo(target, { visualizePathStyle: { stroke: '#ff6600', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
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
								creep.moveTo(target, { visualizePathStyle: { stroke: '#ff6600', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
							}
							else {
								creep.withdraw(target, RESOURCE_ENERGY);
								creep.pickup(target);
							}
						}
						break;
					}
				}

				// now that we have some energy on hand, let's find something to fix (or towers to juice up)
			} else {

				var towers = creep.room.find(FIND_STRUCTURES);

				towers = _.filter(towers, function (struct) {
					return (struct.structureType == STRUCTURE_TOWER && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 500);
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
							creep.moveTo(towerTarget, { visualizePathStyle: { stroke: '#ff6600', opacity: 0.3, ignoreCreeps: true } });
						}
					}
				} else {
			
					let basics = [];
					let ramparts = [];
					let walls = [];
					let validTargets = [];
					let rampartsMax, wallsMax;
					
					if (creep.room.controller !== undefined) {
						if (creep.room.controller.my) {
							rampartsMax = creep.room.memory.settings.repairSettings.repairRampartsTo;
							wallsMax = creep.room.memory.settings.repairSettings.repairWallsTo;
						}
					}

					// search for basically everything that's not a wall or a rampart
					if (creep.room.memory.flags.repairBasics) {
						basics = creep.room.find(FIND_STRUCTURES, {
							filter: (i) => (i.hits < i.hitsMax) && (i.structureType ==
								STRUCTURE_TOWER || i.structureType == STRUCTURE_SPAWN || i.structureType == STRUCTURE_EXTENSION || i.structureType == STRUCTURE_ROAD || i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_EXTRACTOR || i.structureType == STRUCTURE_LAB || i.structureType == STRUCTURE_LINK || i.structureType == STRUCTURE_STORAGE || i.structureType == STRUCTURE_TERMINAL)
						});
						validTargets = validTargets.concat(basics);
					}
					
					// add ramparts to the repair list, based on room flag & room max repair limit
					if (creep.room.memory.flags.repairRamparts) {
						ramparts = creep.room.find(FIND_STRUCTURES, { filter: (i) => ((i.hits / i.hitsMax * 100) <= rampartsMax) && (i.structureType == STRUCTURE_RAMPART) });
						validTargets = validTargets.concat(ramparts);
					}
					// add walls to the repair list, based on room flag & room max repair limit
					if (creep.room.memory.flags.repairWalls) {
						walls = creep.room.find(FIND_STRUCTURES, { filter: (i) => (i.structureType == STRUCTURE_WALL && (i.hits / i.hitsMax * 100) <= wallsMax) })
						validTargets = validTargets.concat(walls);
					}

					const target = creep.pos.findClosestByRange(validTargets);
						
					// travel to closest object within repair criteria and start repairing!
					if (target) {
						if (creep.repair(target) == ERR_NOT_IN_RANGE)
							creep.moveTo(target, { visualizePathStyle: { stroke: '#ff6600', opacity: 0.3, ignoreCreeps: true } });
					}
				}
			}
		}
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
}
module.exports = roleRepairer;