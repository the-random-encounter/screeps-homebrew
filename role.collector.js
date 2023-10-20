/*--------------- CREEP ROLE: 'COLLECTOR' ----------------*/
//	when room memory flag 'runnerLogic' is set to 'true', //
//	collectors  will  transfer energy from room  storage	//
//	into any empty extensions and spawns as needed. when	//
//	runnerLogic is 'false', collectors instead will pick 	//
//	up energy from dropped piles and move to extensions, 	//
//	spawns,  towers,  storage and containers -  in  that	//
//	order.  They  will always prioritize  saving  energy	//
//	from  tombstones  and  will  secondarily  prioritize 	//
//	dropped    energy   when   in   runnerLogic    mode.	//
/*--------------------------------------------------------*/

const roleCollector = {

	run: function (creep) {
		
		if (creep.ticksToLive <= 2) {
			creep.drop(RESOURCE_ENERGY);
			creep.say('☠️');
		}
		
		if (creep.memory.invaderLooter) {
			const tombstones = creep.room.find(FIND_TOMBSTONES, {filter: { creep: {my: false}}});
			const target = creep.pos.findClosestByRange(tombstones);
			const lootTypes = Object.keys(target.store);

			if (creep.store.getFreeCapacity() !== 0) {
				if (creep.pos.isNearTo(target)) {
					for (i = lootTypes.length - 1; i >= 0; i--) {
						creep.withdraw(target, lootTypes[i]);
						if (creep.store.getFreeCapacity() == 0)
							break;
					}
				} else {
					creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined' } });
				}
			} else {
				const storage = Game.getObjectById(creep.room.memory.objects.storage[0]) || creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_STORAGE } });

				const creepLootTypes = Object.keys(creep.store)
				if (creep.pos.isNearTo(storage)) {
					for (i = 0; i < creepLootTypes.length; i++) {
						creep.transfer(storage, creepLootTypes[i]);
					}
				} else {
					creep.moveTo(storage, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined' } });
				}
			}
			if (!creep.room.find(FIND_TOMBSTONES, { filter: (i) => !i.creep.my && i.store.getUsedCapacity() > 0 })) {
				creep.memory.invaderLooter = false;
			}
		} else {

			switch (creep.room.memory.flags.runnerLogic) {
				case true: {

					// prioritize saving any energy dropped on friendly creep tombstones
					if (creep.room.find(FIND_TOMBSTONES, { filter: (i) => ((i.store[RESOURCE_ENERGY] > 0) && i.creep.my) })) {
						const tombstones = creep.room.find(FIND_TOMBSTONES, { filter: (i) => ((i.store[RESOURCE_ENERGY] > 0) && i.creep.my) });					
						const tombstone = creep.pos.findClosestByRange(tombstones);
						if (tombstone) {
							if (creep.withdraw(tombstone, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
									creep.moveTo(tombstone, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted' } });
								}
						}
					// secondarily, prioritize saving any energy dropped by a creep (usually when near death)
					} else if (creep.room.find(FIND_DROPPED_RESOURCES) && creep.store.getFreeCapacity() > 0) {
							const droppedPile = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);

							if (creep.pickup(droppedPile) == ERR_NOT_IN_RANGE)
								creep.moveTo(droppedPile, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted' } });
						}

						// if collector is carrying nothing, collect energy from nearest storage
						if (creep.store[RESOURCE_ENERGY] == 0) {
					
							const target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_STORAGE } })
					
							if (target) {
								if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
									creep.moveTo(target, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted' } });
								}
							}
				
							// if carrying energy, locate closest spawns & extensions to deposit
						} else {

							// build structure list & filter for spawns & extensions
							var targets = creep.room.find(FIND_STRUCTURES);

							targets = _.filter(targets, function (struct) {
								return (struct.structureType == STRUCTURE_SPAWN || struct.structureType == STRUCTURE_EXTENSION) && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
							});

							if (targets.length) {

								// find closest spawn or extension to creep
								const target = creep.pos.findClosestByRange(targets);

								// move to the target
								if (creep.pos.isNearTo(target)) {
									// transfer energy
									creep.transfer(target, RESOURCE_ENERGY);
								} else {
									creep.moveTo(target, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted' } });
								}
							}
						}
						break;
					}
				case false:
				default: {

					// prioritize saving any energy dropped on creep tombstones
					if (creep.room.find(FIND_TOMBSTONES) && creep.store.getFreeCapacity() > 0) {
						const tombstones = creep.room.find(FIND_TOMBSTONES);
						for (i = 0; i < tombstones.length; i++) {
							if (tombstones[i].store[RESOURCE_ENERGY] > 0) {
								if (creep.withdraw(tombstones[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
									creep.moveTo(tombstones[i], { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3 } });
								}
							}
						}
					}

					// if collector is carrying nothing, hunt for dropped energy and collect
					if (creep.store[RESOURCE_ENERGY] == 0) {
					
						let target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
					
						if (target) {
							if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
								creep.moveTo(target, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3 } });
							}
						} else {
							target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_CONTAINER } })
							if (target) {
								if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
									creep.moveTo(target, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3 } });
								}
							}
						}
				
						// if carrying energy, locate closest structure to deposit, prioritizing spawns & extensions
					} else {

						// build structure list & filter for spawns & extensions
						let targets = creep.room.find(FIND_STRUCTURES);

						targets = _.filter(targets, function (struct) {
							return (struct.structureType == STRUCTURE_SPAWN || struct.structureType == STRUCTURE_EXTENSION) && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
						});

						if (targets.length) {

							// find closest spawn or extension to creep
							const target = creep.pos.findClosestByRange(targets);

							// move to the target
							if (creep.pos.isNearTo(target)) {
								// transfer energy
								creep.transfer(target, RESOURCE_ENERGY);
							} else {
								creep.moveTo(target, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3 } });
							}

							// spawns & extensions are full, so deposit in towers, containers, and storage
						} else {

							// build structure list & filter for towers, containers, and storage
							let secondTargets = creep.room.find(FIND_STRUCTURES);

							secondTargets = _.filter(secondTargets, function (struct) {
								return (struct.structureType == STRUCTURE_TOWER || struct.structureType == STRUCTURE_STORAGE || struct.structureType == STRUCTURE_CONTAINER) && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
							});

							// find closest tower, container, or storage to creep
							const target = creep.pos.findClosestByRange(secondTargets);

							// move to the target
							if (secondTargets) {
								if (creep.pos.isNearTo(target)) {
									// transfer energy
									creep.transfer(target, RESOURCE_ENERGY);
								} else {
									creep.moveTo(target, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3 } });
								}
							}
						}
					}
					break;
				}
			}
		}
	}
}
module.exports = roleCollector;