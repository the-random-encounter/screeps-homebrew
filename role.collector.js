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
		
		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		if (creep.memory.rallyPoint === undefined)
			creep.memory.rallyPoint = 'none';
		
		// If disableAI is enabled, do nothing - otherwise, main loop
		if (!creep.memory.disableAI) {

			if (creep.ticksToLive <= 2) {
				creep.drop(RESOURCE_ENERGY);
				creep.say('☠️');
			}
			
			// Interrupt main loop if a rallyPoint is set, and go to it. Otherwise, do job
			if (creep.memory.rallyPoint == 'none') {
				if (creep.memory.invaderLooter) {
					const tombstones = creep.room.find(FIND_TOMBSTONES, { filter: { creep: { my: false } } });
					const target = creep.pos.findClosestByRange(tombstones);
				
					if (target) {
						const lootTypes = Object.keys(target.store);

						if (creep.store.getFreeCapacity() !== 0) {
							if (creep.pos.isNearTo(target)) {
								for (i = lootTypes.length - 1; i >= 0; i--) {
									creep.withdraw(target, lootTypes[i]);
									if (creep.store.getFreeCapacity() == 0)
										break;
								}
							} else {
								creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined', ignoreCreeps: true } });
							}
						} else {
							const storage = Game.getObjectById(creep.room.memory.objects.storage[0]) || creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_STORAGE } });

							const creepLootTypes = Object.keys(creep.store)
							if (creep.pos.isNearTo(storage)) {
								for (i = 0; i < creepLootTypes.length; i++)
									creep.transfer(storage, creepLootTypes[i]);
							} else
								creep.moveTo(storage, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined', ignoreCreeps: true } });
						}
						const zeroLengthTomb = creep.room.find(FIND_TOMBSTONES, { filter: { creep: { my: false } } }).length;
						let nullTomb;
						let emptyTomb;

						if (creep.room.find(FIND_TOMBSTONES, { filter: { creep: { my: false } } }).length == undefined)
							nullTomb = true;

						if (creep.room.find(FIND_TOMBSTONES, { filter: (i) => { i.store.getUsedCapacity() == 0 } }))
							emptyTomb = true;

						const creepGonnaDie = creep.ticksToLive; //< 100
						console.log('zeroLengthTomb: ' + zeroLengthTomb + ', nullTomb: ' + nullTomb + ', emptyTomb: ' + emptyTomb + ', creepGonnaDie: ' + creepGonnaDie);

						if (zeroLengthTomb == 0 || nullTomb || emptyTomb || creepGonnaDie < 100)
							creep.memory.invaderLooter = false;
					}
				} else {

					switch (Game.rooms[creep.memory.homeRoom].memory.flags.runnerLogic) {
						case true: {

							// prioritize saving any energy dropped on friendly creep tombstones
							if (creep.room.find(FIND_TOMBSTONES, { filter: (i) => ((i.store[RESOURCE_ENERGY] > 0) && i.creep.my) })) {
								const tombstones = creep.room.find(FIND_TOMBSTONES, { filter: (i) => ((i.store[RESOURCE_ENERGY] > 0) && i.creep.my) });
								const tombstone = creep.pos.findClosestByRange(tombstones);
								if (tombstone) {
									if (creep.withdraw(tombstone, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
										creep.moveTo(tombstone, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
								}
								// secondarily, prioritize saving any energy dropped by a creep (usually when near death)
							} else if (creep.room.find(FIND_DROPPED_RESOURCES) && creep.store.getFreeCapacity() > 0) {
								const droppedPile = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);

								if (creep.pickup(droppedPile) == ERR_NOT_IN_RANGE)
									creep.moveTo(droppedPile, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
							}

							// if collector is carrying nothing, collect energy from nearest storage
							if (creep.store[RESOURCE_ENERGY] == 0) {
						
								const target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_STORAGE } })
						
								if (target) {
									if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
										creep.moveTo(target, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
								} else {
									const containers = creep.room.memory.settings.containerSettings.outboxes;
									let foundContainer = false;
									for (let cIndex = 0; cIndex < containers.length; cIndex++) {
										if (Game.getObjectById(containers[cIndex]).store.getUsedCapacity > 2000) {
											if (Game.getObjectById(containers[cIndex + 1].store.getUsedCapacity() < 2000)) {
												creep.memory.pickUp = containers[cIndex];
												foundContainer = true;
												break;
											} else {
												continue;
											}
										}
									}
									if (!foundContainer)
										creep.memory.pickUp = containers[0];											
									myBox = Game.getObjectById(creep.memory.pickUp);
									if (creep.withdraw(myBox, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
													creep.moveTo(myBox, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
								}
					
								// if carrying energy, locate closest spawns & extensions to deposit
							} else {

								let targets = creep.room.find(FIND_STRUCTURES);

								targets = _.filter(targets, function (struct) {
									return (struct.structureType == STRUCTURE_SPAWN || struct.structureType == STRUCTURE_EXTENSION) && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
								});

  							if (targets.length) {

									// find closest spawn or extension to creep
									const target = creep.pos.findClosestByRange(targets);

									// move to the target and transfer
									if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
										creep.moveTo(target, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
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
											if (creep.transfer(towerTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
												creep.moveTo(towerTarget, { visualizePathStyle: { stroke: '#ff6600', opacity: 0.3, ignoreCreeps: true } });
										}
									} else {
										const outBox = Game.getObjectById(creep.room.memory.settings.containerSettings.outboxes[0]);
										if (creep.transfer(outBox, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
												creep.moveTo(outBox, { visualizePathStyle: { stroke: '#ff6600', opacity: 0.3, ignoreCreeps: true } });
									}
								}
								break;
							}
						}
						/**  
						 * COLLECTOR BEHAVIOR WHEN ROOM FLAG 'runnerLogic' IS FALSE OR UNDEFINED
						 * Collector will seek for dropped piles of energy as their primary collection point,
						 * and look to fill spawns & extensions, followed by towers and then containers 
						 */
						case false:
						case undefined:
						default: {

							// prioritize saving any energy dropped on creep tombstones
							if (creep.room.find(FIND_TOMBSTONES) && creep.store.getFreeCapacity() > 0) {
								const tombstones = creep.room.find(FIND_TOMBSTONES);
								for (i = 0; i < tombstones.length; i++) {
									if (tombstones[i].store[RESOURCE_ENERGY] > 0) {
										if (creep.withdraw(tombstones[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
											creep.moveTo(tombstones[i], { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, ignoreCreeps: true } });
										}
									}
								}
							}

							// if collector is carrying nothing, hunt for dropped energy and collect
							if (creep.store[RESOURCE_ENERGY] == 0) {
								if (Game.getObjectById(creep.memory.pileTarget) === null)
									delete creep.memory.pileTarget;
								if (!creep.memory.pileTarget) {
									let piles = creep.room.find(FIND_DROPPED_RESOURCES);

									if (piles) {
										let target = piles[HEAP_MEMORY.containerCounter];
										HEAP_MEMORY.containerCounter++;

										if (HEAP_MEMORY.containerCounter > piles.length)
											HEAP_MEMORY.containerCounter = 0;
								
										if (target)
											creep.memory.pileTarget = target.id;
									} else {
										const containers = creep.room.memory.settings.containerSettings.outboxes;
										let foundContainer = false;
										for (let cIndex = 0; cIndex < containers.length; cIndex++) {
											if (Game.getObjectById(containers[cIndex]).store.getUsedCapacity > 1000) {
												if (Game.getObjectById(containers[cIndex + 1].store.getUsedCapacity() < 1000)) {
													creep.memory.pickUp = containers[cIndex];
													foundContainer = true;
													break;
												} else {
													continue;
												}
											}
										}
										if (!foundContainer)
											creep.memory.pickup = containers[0];											
										myBox = Game.getObjectById(creep.memory.pickUp);
										if (creep.withdraw(myBox, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
											creep.moveTo(myBox, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
									}	
								} else if (creep.memory.pileTarget) {
									const pileTarg = Game.getObjectById(creep.memory.pileTarget);
									if (creep.pickup(pileTarg) == OK)
										delete creep.memory.pileTarget;
									else if (creep.pickup(pileTarg) == ERR_NOT_IN_RANGE)
										creep.moveTo(pileTarg, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, ignoreCreeps: true } });
								} else {
									target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_CONTAINER } })
									if (target) {
										if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
											creep.moveTo(target, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, ignoreCreeps: true } });
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
										creep.moveTo(target, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, ignoreCreeps: true } });
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
											creep.moveTo(target, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, ignoreCreeps: true } });
										}
									}
								}
							}
							break;
						}
					}
				}
			// Rally Point logic
			} else {
				//const rally = Game.getObjectById(creep.memory.rallyPoint);
				const rally = Game.flags.ClaimFlag;
				if (!creep.pos.isNearTo(rally)) {
					creep.moveTo(rally, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, ignoreCreeps: true } });
				} else {
					creep.memory.rallyPoint = 'none';
				}
			}
		// Disabled AI alerts (log console if enabled, always 'say' Disabled)
		} else {
			if (Memory.globalSettings.alertDisabled)
				console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');	
			creep.say('AI Disabled');
		}
	}
}
module.exports = roleCollector;