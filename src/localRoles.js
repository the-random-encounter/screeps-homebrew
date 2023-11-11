const roleHarvester = {

  /** @param {Creep} creep **/
  run: function (creep) {
  
    if (creep.memory.disableAI === undefined) creep.memory.disableAI = false;

    if (!creep.memory.disableAI) {

      if (creep.ticksToLive <= 2) {
        creep.unloadEnergy();
        creep.say('☠️');
      } else {

        // a specific fix for local room harvesters standing in a dumb spot
        if (creep.room.name == 'E58S51' && Game.shard.name == 'shard3') {
          if (creep.pos.x == 41 && creep.pos.y == 7) creep.move(7);
        }

        // deposit energy into container, storage, or link when close to full
        if (creep.store.getFreeCapacity() < (creep.getActiveBodyparts(WORK) * 2)) {
          if (!creep.memory.bucket) {
            if (creep.memory.source) {
              const sourceTarget = Game.getObjectById(creep.memory.source);

              //const possibleBuckets = sourceTarget.pos.findInRange(FIND_STRUCTURES, 3, { filter: (i) => i.structureType == STRUCTURE_LINK || i.structureType == STRUCTURE_STORAGE || i.structureType == STRUCTURE_CONTAINER });
              //const chosenBucket = sourceTarget.pos.findClosestByRange(possibleBuckets);
              const chosenBucket = sourceTarget.pos.findClosestByRange(FIND_STRUCTURES, 3, { filter: (i) => i.structureType == STRUCTURE_LINK || i.structureType == STRUCTURE_STORAGE || i.structureType == STRUCTURE_CONTAINER });
              if (chosenBucket) creep.memory.bucket = chosenBucket.id;
            }
          } else {
            const dropBucket = Game.getObjectById(creep.memory.bucket);
            //console.log('Harvester ' + creep.name + ': Unloading into ' + creep.memory.bucket);
            if (creep.pos.isNearTo(dropBucket)) creep.unloadEnergy(); 
            else creep.moveTo(dropBucket);
          }
        }
      
        if (!creep.pos.findInRange(FIND_MY_CREEPS, 1, { filter: (creep) => creep.memory.role == 'crane' }) && Game.getObjectById(creep.room.memory.objects.links[0]).store.getUsedCapacity() > 0) {
          // if the crane isn't there but the link has energy, go ahead and pull it out
          if (creep.pos.x == 40 && creep.pos.y == 7) {
            creep.withdraw(Game.getObjectById(creep.room.memory.objects.links[0]), RESOURCE_ENERGY);
            console.log('[' + creep.room.name + ']: Harvester \'' + creep.name + '\' filling in as crane due to full link.');
          } else creep.harvestEnergy();
        } else creep.harvestEnergy();
      }
    }
    else {
      console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
      creep.say('AI Disabled');
    }
  }
}

/*--------------- CREEP ROLE: 'COLLECTOR' ----------------*/
//	when room memory flag 'centralStorageLogic' is set to 'true', //
//	collectors  will  transfer energy from room  storage	//
//	into any empty extensions and spawns as needed. when	//
//	centralStorageLogic is 'false', collectors instead will pick 	//
//	up energy from dropped piles and move to extensions, 	//
//	spawns,  towers,  storage and containers -  in  that	//
//	order.  They  will always prioritize  saving  energy	//
//	from  tombstones  and  will  secondarily  prioritize 	//
//	dropped    energy   when   in   centralStorageLogic    mode.	//
/*--------------------------------------------------------*/

// DEFAULT 'COLLECTOR' PATH VISUALIZER SETTINGS:
//,{ visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } }

const roleCollector = {

	run: function (creep) {
		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		if (creep.memory.rallyPoint === undefined)
			creep.memory.rallyPoint = 'none';
		
		if (!creep.memory.disableAI) { // MY AI ISN'T DISABLED, SO...

			if (creep.memory.rallyPoint == 'none') { // I HAVE NO RALLY POINT, SO...

				if (creep.ticksToLive <= 2) // I'M DYING!!!!
					creep.say('☠️');

				if (creep.memory.invaderLooter && creep.room.memory.objects.storage[0]) { // THERE ARE INVADERS TO LOOT AND STORAGE TO PUT IT IN!
					const tombstones = creep.room.find(FIND_TOMBSTONES, { filter: { creep: { my: false } } });
					const target = creep.pos.findClosestByRange(tombstones);
					
					if (target) { // I FOUND THE CLOSEST ENEMY TOMBSTONE
						const lootTypes = Object.keys(target.store);

						if (lootTypes.length == 1 && lootTypes[0] == 'energy' && target.store[RESOURCE_ENERGY] < 100) { // NOTHING BUT A TRIVIAL AMOUNT OF ENERGY, DON'T BOTHER
							creep.memory.invaderLooter = false;
						} else { // THERE'S WORTHWHILE LOOT
							if (creep.store.getFreeCapacity() !== 0) { // AND I HAVE FREE SPACE
								if (creep.pos.isNearTo(target)) { // IF I'M NEXT TO THE TOMBSTONE
									for (i = lootTypes.length - 1; i >= 0; i--) { // START LOOING FROM THE BOTTOM OF THE LIST
										creep.withdraw(target, lootTypes[i]);
										if (creep.store.getFreeCapacity() == 0) // NOW THAT I'M FULL, STOP
											break;
									}
								} else { // NOT NEXT TO THE STONE, GET MOVIN!
									creep.moveTo(target);
								}
							}
							else { // I NEED TO UNLOAD MY INVENTORY
								const storage = Game.getObjectById(creep.room.memory.objects.storage[0]) || creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_STORAGE } });

								const creepLootTypes = Object.keys(creep.store);
								if (creep.pos.isNearTo(storage)) { // SINCE I'M BY STORAGE,
									for (i = 0; i < creepLootTypes.length; i++) { // START TRANSFERRING EVERYTHING
										creep.transfer(storage, creepLootTypes[i]);
									}
								} else { // STORAGE IS TOO FAR, GET MOVIN!
									creep.moveTo(storage, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined', ignoreCreeps: true } });
								}
							}
							const zeroLengthTomb = creep.room.find(FIND_TOMBSTONES, { filter: { creep: { my: false } } }).length;
							let nullTomb;
							let emptyTomb;

							if (creep.room.find(FIND_TOMBSTONES, { filter: { creep: { my: false } } }).length == undefined) {
								nullTomb = true;
							}

							if (creep.room.find(FIND_TOMBSTONES, { filter: (i) => { i.store.getUsedCapacity() == 0 } })) {
								emptyTomb = true;
							}
							const creepGonnaDie = creep.ticksToLive; //< 100
							console.log('zeroLengthTomb: ' + zeroLengthTomb + ', nullTomb: ' + nullTomb + ', emptyTomb: ' + emptyTomb + ', creepGonnaDie: ' + creepGonnaDie);

							if (zeroLengthTomb == 0 || nullTomb || emptyTomb || creepGonnaDie < 100) {
								creep.memory.invaderLooter = false;
							}
						} // end of (worthwhile to loot)
					} // end of (looting closest tombstone)
				} // end of (invaders available for looting logic)
				else { // NO INVADERS TO LOOT, SO...

					if (creep.store[RESOURCE_ENERGY] == 0) { // NO ENERGY, SO...
						
						const nearestPile = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);

						if (nearestPile) {
							if (creep.pickup(nearestPile, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
								creep.moveTo(nearestPile, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
						} // end of (if there are dropped piles)
						else { // NO DROPPED PILES, NEED TO FIND OTHER SOURCES OF ENERGY...
							
							if (creep.room.memory.objects.storage && creep.room.memory.objects.storage[0]) { // IF RCL IS OVER 3 AND WE HAVE A STORAGE

								if (!creep.memory.pickup) // MAKE THE STORAGE MY PICKUP TARGET AND GET ENERGY
									creep.memory.pickup = creep.room.memory.objects.storage[0];

								const storage = Game.getObjectById(creep.memory.pickup);

								if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
									creep.moveTo(storage, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
							} // end of (RCL > 3 & storage is built)
							else if (creep.room.controller.level <= 3) { // IF RCL IS 3 OR LESS (AND THUS NO STORAGE)
								
								if (!creep.memory.pickup) // IF NO PICKUP TARGET IS SET, REQUEST A LOGISTICAL PAIR
									creep.assignLogisticalPair();

								if (creep.memory.pickup == 'none') { // IF NO PAIRS ARE AVAILABLE, SEE IF THERE ARE SOURCE CONTAINERS BUILT
									const sources = creep.room.find(FIND_SOURCES);
									let sourceBoxes = [];
									for (let i = 0; i < sources.length; i++) {
										let box = sources[i].pos.findInRange(FIND_STRUCTURES, 3, { filter: { structureType: STRUCTURE_CONTAINER } });
										sourceBoxes.push(box);
									}
									sourceBoxes = sourceBoxes.sort((a, b) => b.store.getUsedCapacity() - a.store.getUsedCapacity());
									creep.memory.pickup = sourceBoxes[ROOM_HEAP.outboxCounter].id;
									creep.memory.cargo = 'energy';

									ROOM_HEAP.outboxCounter++;
									if (ROOM_HEAP.outboxCounter >= sourceBoxes.length)
										ROOM_HEAP.outboxCounter = 0;
								}

								if (creep.memory.dropoff == 'none') { // IF NO PAIRS ARE AVAILABLE, SEE IF THERE IS A CONTROLLER UPGRADE BOX BUILT
									const controllerBox = creep.room.controller.pos.findInRange(FIND_STRUCTURES, 5, { filter: { structureType: STRUCTURE_CONTAINER } });
									if (controllerBox)
										creep.memory.dropoff = controllerBox[0].id;
								}

								if (creep.memory.pickup !== 'none' && creep.memory.pickup !== undefined) { // IF I HAVE A VALID PICKUP TARGET, GO GET ENERGY FROM IT
									const target = Game.getObjectById(creep.memory.pickup);
									if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
										creep.moveTo(target, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
								}	
							} // end of (energy directives when RCL < 4)
						} // end of (no piles, find main energy)
					} // end of (finding energy directives)
					else { // IF MY STORE IS FULL OF ENERGY...
						const targets = creep.room.find(FIND_STRUCTURES, { filter: (i) => ((i.structureType == STRUCTURE_SPAWN || i.structureType == STRUCTURE_EXTENSION) && i.store.getFreeCapacity(RESOURCE_ENERGY) > 0) });

						if (targets.length) { // FIND SPAWNS & EXTENSIONS THAT NEED TO  BE FILLED

							const target = creep.pos.findClosestByRange(targets);
							
							if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) // HEAD TO CLOSEST NON-FULL TARGET AND FILL IT
								creep.moveTo(target, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
						} //end of (spawn/extension filling directives)
						else { // NO SPAWNS/EXTENSIONS NEED FILLING, WHAT ABOUT TOWERS...?
							//let towers = creep.room.find(FIND_STRUCTURES, { filter: (i) => (i.structureType == STRUCTURE_TOWER && i.store[RESOURCE_ENERGY] <= 800) });
							//towers.sort((a, b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]); 
							const tower = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_TOWER && (i.store[RESOURCE_ENERGY] <= 800)})
							//if (towers.length > 0) { // THERE ARE TOWERS TO FILL, SO...
							//const towerTarget = creep.pos.findClosestByRange(towers);
								
							if (tower) { // HEAD TO CLOSEST NON-FULL TOWER AND FILL IT
								if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
									creep.moveTo(tower, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
							} else { // TOWERS FULL UP
								if (creep.room.controller && creep.room.controller.level > 3 && creep.room.memory.objects.storage[0]) { // NOTHING LEFT, RETURN ENERGY TO STORAGE
									const storage = Game.getObjectById(creep.room.memory.objects.storage[0]);
									if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
										creep.moveTo(storage, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } })
								} else {
									if (!creep.memory.dropoff) {
										if (creep.room.memory.settings.containerSettings.inboxes !== undefined) {
											creep.memory.dropoff = creep.room.memory.settings.containerSettings.inboxes[0];
										} else {
											creep.memory.dropoff = creep.room.controller.pos.findClosestByRange(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_CONTAINER } });
										}
									
										const storage = Game.getObjectById(creep.memory.dropoff);
										if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
											creep.moveTo(storage, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } })
									}
								} // end of (no other directives, empty inventory)
							} // end of (refilling tower energy directive)
						} // end of (if no spawns/extensions to fill)
					} // end of (if creep's store is full)
				} // end of (no invaders to loot, main logic chain)
			} // end of (no rally point to go to)
			else { // I HAVE A RALLY POINT, LET'S BOOGY!
				const rally = Game.flags[creep.memory.rallyPoint];
				if (creep.pos.isNearTo(rally))
					creep.memory.rallyPoint = 'none';
				else
					creep.moveTo(rally, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
			}
		} // end of (if disableAI is false)
		else { // MY AI IS DISABLED, DURRRRR..... *drools*
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
    } // end of (if disableAI is true)
	} // end of (run function)
} // end of (module)

const roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.disableAI === undefined)
            creep.memory.disableAI = false;
        
        if (!creep.memory.disableAI) {
		            
            if (creep.ticksToLive <= 2) {
                creep.drop(RESOURCE_ENERGY);
                creep.say('☠️');
            }

            if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.working = false;
                creep.say('🔼');
            }
            if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
                creep.memory.working = true;
                creep.say('🏗️');
            }

            if (creep.pos.x == 49) {
				creep.move(7);
			} else if (creep.pos.x == 0) {
				creep.move(3);
			} else if (creep.pos.y == 0) {
				creep.move(5);
			} else if (creep.pos.y == 49) {
				creep.move(1)
            }
            
            if (creep.store.getUsedCapacity() == 0) {
        
                switch (creep.room.memory.settings.flags.centralStorageLogic || false) {
                    case true: {
                        
                        // look for the closest pile of energy, storage, or container for energy to use
                        const droppedPiles = creep.room.find(FIND_DROPPED_RESOURCES);
                        const containersWithEnergy = /*Game.getObjectById(creep.room.memory.objects.storage[0]) ||*/ creep.room.find(FIND_STRUCTURES, {
                            filter: (i) => ((i.structureType == STRUCTURE_STORAGE || i.structureType == STRUCTURE_CONTAINER) && i.store[RESOURCE_ENERGY] > 0)
                        });
                        const targets = droppedPiles.concat(containersWithEnergy);
                        let target = creep.pos.findClosestByRange(targets);
                        if (target) {
                            if (creep.pickup(target) == ERR_NOT_IN_RANGE || creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                                creep.moveTo(target, { visualizePathStyle: { stroke: '#0000ff', opacity: 0.3, lineStyle: 'dotted' } });
                            else
                                creep.withdraw(target, RESOURCE_ENERGY);
                        }
                        break;
                    }
                    case false:
                    default: {

                        // look for the closest pile of energy, container, or storage for energy to use
                        const containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
                            filter: (i) => (i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE) && i.store[RESOURCE_ENERGY] > 0
                        });
                        const droppedPiles = creep.room.find(FIND_DROPPED_RESOURCES);
                        const resourceList = containersWithEnergy.concat(droppedPiles);
                                
                        const target = creep.pos.findClosestByRange(resourceList);
                            
                        if (target) {
                            if (creep.pickup(target) == ERR_NOT_IN_RANGE || creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target, { visualizePathStyle: { stroke: '#0000ff', opacity: 0.3, lineStyle: 'dotted' } });
                            }
                            else {
                                switch (target.structureType) {
                                    case STRUCTURE_CONTAINER:
                                    case STRUCTURE_STORAGE:
                                        creep.withdraw(target, RESOURCE_ENERGY);
                                        break;
                                    default:
                                        creep.pickup(target);
                                        break;
                                }
                            }
                        }
                        break;
                    }
                }
            } else {
                // seek construction sites to work on and build!
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if (targets.length) {
                    if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#0000ff', opacity: 0.3, lineStyle: 'dotted' } });
                    }
                }// else {
                    //const remoteSites = Game.rooms.E57S51.find(FIND_CONSTRUCTION_SITES);
                    //if (remoteSites.length) {
                    //    if (creep.build(remoteSites[0]) == ERR_NOT_IN_RANGE) {
                    //        creep.moveTo(remoteSites[0], {visualizePathStyle: { stroke: '#0000ff', opacity: 0.3, lineStyle: 'dashed'}})
                    //    }
                    //}
                //}
            }
        }
        else {
            console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
            creep.say('AI Disabled');
        }
    }
};

const roleUpgrader = {

			/** @param {Creep} creep **/
		run: function(creep) {
		
		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;

		if (creep.memory.upgradeRoom === undefined)
			creep.memory.upgradeRoom = creep.room.name;

		if (creep.memory.canSeekEnergy === undefined) {
			if (creep.room.memory.settings.flags.upgradersSeekEnergy !== undefined)
				creep.memory.canSeekEnergy = creep.room.memory.settings.flags.upgradersSeekEnergy;
			else
				creep.memory.canSeekEnergy = true;
		}

		if (!creep.memory.mainBucket) {
			if (creep.room.memory.data.linkRegistry.destination)
				creep.memory.mainBucket = creep.room.memory.data.linkRegistry.destination;
			else if (creep.room.memory.settings.containerSettings.inboxes)
				creep.memory.mainBucket = creep.room.memory.settings.containerSettings.inboxes[0];
			else {
				const nearbyBuckets = creep.room.controller.pos.findInRange(FIND_STRUCTURES, 1, { filter: (i) => i.structureType == STRUCTURE_LINK || i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE });
				const closestBucket = creep.room.controller.pos.findClosestByRange(nearbyBuckets);
				if (closestBucket)
					creep.memory.mainBucket = closestBucket.id;
				else
					creep.memory.mainBucket = 'none';
			}
		}
				
		if (!creep.memory.disableAI) {

			if (creep.room.name == 'E58S51' && Game.shard.name == 'shard3') { // AM I IN A SPECIFIC ROOM ON SHARD 3? IF SO, STAND IN THE RIGHT SPOT
				const badPosC = new RoomPosition(39, 9, 'E58S51');
				const badPosSW = new RoomPosition(38, 9, 'E58S51');
				const badPosW = new RoomPosition(38, 8, 'E58S51');
				const badPosSE = new RoomPosition(40, 9, 'E58S51');

				if (creep.pos.x == badPosC.x && creep.pos.y == badPosC.y) {
					if (creep.move(8) !== 0)
						creep.move(1);
				} else if ((creep.pos.x == badPosSW.x || creep.pos.x == badPosSE.x) && creep.pos.y == badPosSW.y) {
					creep.move(1);
				} else if (creep.pos.x == badPosW.x && creep.pos.y == badPosW.y)
					creep.move(1);
			}

			const upgradeRoom = creep.memory.upgradeRoom;

			if (creep.ticksToLive <= 2) {
				creep.say('☠️');
			}

			if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
				creep.memory.working = false;
				creep.say('🔼');
			}

			if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
				creep.memory.working = true;
				creep.say('⚡');
			}
			
			// IF STANDING ON ROOM EXIT, STEP OFF
			if (creep.pos.x == 49)
				creep.move(7);
			else if (creep.pos.x == 0)
				creep.move(3);
			if (creep.pos.y == 0)
				creep.move(5);
			else if (creep.pos.y == 49)
				creep.move(1)

			if (creep.store.getUsedCapacity() == 0) { // I HAVE NO ENERGY, SO...
				
				if (!creep.memory.mainBucket) { // I HAVE NO MAIN BUCKET IN MEMORY, SO...

					const adjacentBucket = creep.pos.findInRange(FIND_STRUCTURES, 1, { filter: (i) => i.structureType == STRUCTURE_LINK || i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE} );
					
					if (adjacentBucket.length > 1) { // MULTIPLE BUCKETS! WINNOW IT DOWN...
						creep.memory.mainBucket = adjacentBucket.pos.findClosestByRange(FIND_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_LINK || i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE} );
					} else if (adjacentBucket.length <= 1) // IF THERE'S ONE NEXT TO ME, THAT'S MY MAIN BUCKET.
						creep.memory.mainBucket = adjacentBucket[0].id;
				} // end of (if there is no mainBucket in memory)
				const mainBucket = Game.getObjectById(creep.memory.mainBucket);
				if (mainBucket) { // MY MAIN BUCKET IS HERE AND ISN'T EMPTY, SO...
					if (creep.withdraw(mainBucket, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) // WITHDRAW FROM IT
						creep.moveTo(mainBucket, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });	
				} // end of (if main bucket is present & not empty)
				else if (creep.memory.canSeekEnergy) { // MY MAIN BUCKET EITHER ISN'T HERE OR IT'S EMPTY, LET'S FIND ENERGY ELSEWHERE...

					const containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
						filter: (i) => (i.structureType == STRUCTURE_LINK || i.structureType == STRUCTURE_STORAGE || i.structureType == STRUCTURE_CONTAINER) && i.store[RESOURCE_ENERGY] > 0
					});
					const piles = creep.room.find(FIND_DROPPED_RESOURCES);
					//let controllerContainers = creep.room.controller.pos.findInRange(FIND_STRUCTURES, 5, { filter: { strucutreType: STRUCTURE_CONTAINER } });
				
					const all = containersWithEnergy.concat(piles);
					//all = all.concat(controllerContainers);
					const target = creep.pos.findClosestByRange(all);
			
					if (target) { // I FOUND SOME ENERGY SOMEWHERE, LET'S GET IT
						if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE || creep.pickup(target) == ERR_NOT_IN_RANGE)
							creep.moveTo(target, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
					}
				} // end of (no bucket or bucket energy, find other source)
			} // end of (find energy if empty)	
			else { // I HAVE ENERGY, LET'S UPGRADE THE CONTROLLER, IF MY BUCKET DOESN'T NEED FIXING FIRST...
            
			/*if (creep.room.name !== upgradeRoom) { // AM I IN THE ROOM I'M TOLD TO UPGRADE? IF NOT, GO THERE
				creep.moveTo(Game.flags.ClaimFlag);
			} else { // CHECK MY BUCKET DOESN'T HAVE A LEAK...*/
				if (!creep.memory.mainBucket) {
					const containers = creep.room.controller.pos.findInRange(FIND_STRUCTURES, 5, { filter: (i) => i.structureType == STRUCTURE_LINK || i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE});
					const closestContainer = creep.pos.findClosestByRange(containers);
					creep.memory.mainBucket = closestContainer.id;
				}
				const mainBucket = Game.getObjectById(creep.memory.mainBucket);
				if (mainBucket && mainBucket.structureType == STRUCTURE_CONTAINER) {
					if (mainBucket && mainBucket.hits < mainBucket.hitsMax) // I FOUND A LEAK, FIX IT
						creep.repair(mainBucket);
					else if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
						creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
						//console.log('got energy');
					}
				}
			
			} 
			if (creep.memory.working) {
		        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
	        }
	    
			} // end of (fix bucket/upgrade controller)
		} // end of (disableAI is disabled)
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		} // end of (disableAI is enabled)
	} // end of (run function)
};// end of (role)

//, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted' } }

const roleRunner = {

	run: function (creep) {

		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		
		if (!creep.memory.disableAI) {
			
			if (creep.ticksToLive <= 2) {
				creep.drop(RESOURCE_ENERGY);
				creep.say('☠️');
			}
		
			if (!creep.memory.pickup && !creep.memory.dropoff)
				creep.assignLogisticalPair();

			if (creep.store[creep.memory.cargo] == 0) {
				let target = Game.getObjectById(creep.memory.pickup);
				if (target) {
					if (creep.withdraw(target, creep.memory.cargo) == ERR_NOT_IN_RANGE)
						creep.moveTo(target, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted' } });
				}
			} else {
				const roadUnderCreep = creep.room.find(FIND_STRUCTURES, { filter: (i) => (i.structureType == STRUCTURE_ROAD && i.pos.x == creep.pos.x && i.pos.y == creep.pos.y && i.hits !== i.hitsMax) })
				const roadTarget = creep.pos.findClosestByRange(roadUnderCreep);
				if (roadTarget) {
					creep.repair(roadTarget);
				} else {
					let target = Game.getObjectById(creep.memory.dropoff);
					if (target) {
						if (creep.transfer(target, creep.memory.cargo) == ERR_NOT_IN_RANGE)
							creep.moveTo(target, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted' } });
					}
				}
			}

		}	else {
			if (Memory.globalSettings.alertDisabled)
				console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
}

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

				switch (creep.room.memory.settings.flags.centralStorageLogic) {
					case true: {
						const target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
							filter: (i) => i.structureType == STRUCTURE_STORAGE &&
								i.store[RESOURCE_ENERGY] > 0
						});
						if (target) {
							if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
								creep.moveTo(target, { visualizePathStyle: { stroke: '#ff6600', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
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
							if (creep.pickup(target) == ERR_NOT_IN_RANGE || creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
								creep.moveTo(target, { visualizePathStyle: { stroke: '#ff6600', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
						}
						break;
					}
				}

				// now that we have some energy on hand, let's find something to fix (or towers to juice up)
			} else {

				const tower = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_TOWER && (i.store[RESOURCE_ENERGY] <= 800)});
				if (tower) {
					// transfer energy
					if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
						creep.moveTo(tower, { visualizePathStyle: { stroke: '#ff6600', opacity: 0.3, lineStyle: 'undefined', ignoreCreeps: true } });
				} else {
					// towers are stocked up, look for fix'er'uppers
					let basics = [];
					let ramparts = [];
					let walls = [];
					let validTargets = [];
					const rampartsMax = Memory.rooms[creep.memory.homeRoom].settings.repairSettings.repairRampartsTo;
					const wallsMax = Memory.rooms[creep.memory.homeRoom].settings.repairSettings.repairWallsTo;
					
					// search for basically everything that's not a wall or a rampart
					if (Memory.rooms[creep.memory.homeRoom].settings.flags.repairBasics) {
						basics = creep.room.find(FIND_STRUCTURES, {
							filter: (i) => (i.hits < i.hitsMax) && (i.structureType ==
								STRUCTURE_TOWER || i.structureType == STRUCTURE_SPAWN || i.structureType == STRUCTURE_EXTENSION || i.structureType == STRUCTURE_ROAD || i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_EXTRACTOR || i.structureType == STRUCTURE_LAB || i.structureType == STRUCTURE_LINK || i.structureType == STRUCTURE_STORAGE || i.structureType == STRUCTURE_TERMINAL)
						});
						validTargets = validTargets.concat(basics);
					}
					
					// add ramparts to the repair list, based on room flag & room max repair limit
					if (Memory.rooms[creep.memory.homeRoom].settings.flags.repairRamparts) {
						ramparts = creep.room.find(FIND_STRUCTURES, { filter: (i) => ((i.structureType == STRUCTURE_RAMPART) && ((i.hits / i.hitsMax * 100) <= rampartsMax)) });
						validTargets = validTargets.concat(ramparts);
					}
					// add walls to the repair list, based on room flag & room max repair limit
					if (Memory.rooms[creep.memory.homeRoom].settings.flags.repairWalls) {
						walls = creep.room.find(FIND_STRUCTURES, { filter: (i) => ((i.structureType == STRUCTURE_WALL) && ((i.hits / i.hitsMax * 100) <= wallsMax)) })
						validTargets = validTargets.concat(walls);
					}

					const target = creep.pos.findClosestByRange(validTargets);
						
					// travel to closest object within repair criteria and start repairing!
					if (target) {
						if (creep.repair(target) == ERR_NOT_IN_RANGE)
							creep.moveTo(target, { visualizePathStyle: { stroke: '#ff6600', lineStyle: 'dashed', opacity: 0.3, ignoreCreeps: true } });
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

const roleCrane = {
    
    run: function (creep) {
        
        if (creep.memory.disableAI === undefined)
            creep.memory.disableAI = false;

        if (!creep.memory.disableAI) {

            if (!creep.memory.link)
                creep.memory.link = creep.room.memory.data.linkRegistry.central;
            if (!creep.memory.storage)
                creep.memory.storage = creep.room.memory.objects.storage[0];
            if (!creep.memory.terminal && creep.room.memory.objects.terminal[0])
                creep.memory.terminal = creep.room.memory.objects.terminal[0];
            if (!creep.memory.destination && creep.room.memory.data.linkRegistry.destination)
                creep.memory.destination = creep.room.memory.data.linkRegistry.destination;
            if (!creep.memory.atCraneSpot === undefined)
                creep.memory.atCraneSpot = false;
            if (creep.memory.upgrading == true && creep.store.getUsedCapacity() == 0) {
                creep.memory.upgrading = false;
            }

            const objLink = Game.getObjectById(creep.memory.link);
            const objStorage = Game.getObjectById(creep.memory.storage);
            const objTerminal = Game.getObjectById(creep.memory.terminal);
            const objDestination = Game.getObjectById(creep.memory.destination);

            let craneSpot;
            if (creep.room.name == 'E58S51') {
                craneSpot = [39, 7];
            } else if (creep.room.name == 'W23N35') {
                craneSpot = [25, 22];
            }

            if (!creep.memory.atCraneSpot) {
                if (creep.pos.x !== craneSpot[0] || creep.pos.y !== craneSpot[1]) {
                    creep.moveTo(new RoomPosition(craneSpot[0], craneSpot[1], creep.room.name));
                } else {
                    creep.memory.atCraneSpot = true;
                    //console.log('crane at spot');
                }
            }

            if (creep.memory.atCraneSpot == true) {
                if (creep.store.getFreeCapacity() == 0 && creep.memory.dropLink == false) {
                    //console.log('full inventory, droplink false');
                    const resTypes = Object.keys(creep.store);
        
                    for (let types in resTypes) {

                        if (creep.store[types] !== 'energy')
                            creep.transfer(objStorage, types)
                    }
                }

                if (creep.memory.dropLink == true) {
                    //console.log('droplink true');
                    creep.transfer(objStorage, RESOURCE_ENERGY)
                    creep.say('🎇');
                    creep.memory.dropLink = false;
                    creep.memory.upgrading = false;
                    return;
                } else if (creep.memory.xferDest == true) {
                    creep.transfer(objLink, RESOURCE_ENERGY);
                    creep.say('🎆');
                    creep.memory.xferDest = false;
                    creep.memory.upgrading = false;
                    objLink.transferEnergy(objDestination);
                    return;
                } else if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0 && creep.memory.upgrading == false) {
                    //console.log('free energy capacity is zero, upgrading is false');
                    creep.transfer(objStorage, RESOURCE_ENERGY);
                    creep.say('🎇');
                } else {
                    if (objLink.store[RESOURCE_ENERGY] >= 30) {
                        //console.log('link store >= 30');
                        if (creep.withdraw(objLink, RESOURCE_ENERGY) == OK) {
                            creep.say('⚡');
                            creep.memory.dropLink = true;
                            creep.memory.upgrading = false;
                            return;
                        }
                    } else if (objTerminal.store.getUsedCapacity() > 0 && Object.keys(objTerminal.store).length > 1) {
                        //console.log('terminal used capacity > 0 and multiple resource types in terminal');
                        if (creep.store[RESOURCE_ENERGY] > 0) {
                            //console.log('crane energy store > 0')
                            creep.transfer(objStorage, RESOURCE_ENERGY)
                            creep.say('🎇');
                            creep.memory.upgrading = false;
                            return;
                        } else if (creep.store.getFreeCapacity() == 0) {
                            //console.log('crane free capacity = 0');
                            const resourceTypes = Object.keys(objTerminal.store);
                            for (let i = 0; i < resourceTypes.length; i++) {
                                if (resourceTypes[i] !== 'energy') {
                                    creep.say('🧮');
                                    creep.transfer(objStorage, resourceTypes[i]);
                                    creep.memory.upgrading = false;
                                    return;
                                }
                            }
                        } else {
                            //console.log('withdrawing remaining terminal resource types');
                            const resourceTypes = Object.keys(objTerminal.store);
                            for (let i = 0; i < resourceTypes.length; i++) {
                                if (resourceTypes[i] !== 'energy') {
                                    creep.withdraw(objTerminal, resourceTypes[i]);
                                    creep.say('🧮');
                                    creep.memory.upgrading = false;
                                    return;
                                }
                            }
                        }
                    } else if ((creep.room.memory.settings.flags.craneUpgrades) && (creep.memory.upgrading == false)) {
                        if (creep.store.getUsedCapacity() == 0) {
                            creep.withdraw(objStorage, RESOURCE_ENERGY);
                            creep.say('⚡');
                            creep.memory.upgrading = true;
                        } else {
                            creep.upgradeController(creep.room.controller)
                        }
                    } else if (objDestination && objDestination.store.getFreeCapacity() >= objLink.store.getUsedCapacity() && objLink.cooldown == 0) {
                        if (creep.store.getFreeCapacity() > 0) {
                            console.log('crane: getting energy for C2D xfer');
                            creep.withdraw(objStorage, RESOURCE_ENERGY);
                            creep.say('⚡');
                            creep.memory.xferDest = true;
                        }
                    }
                
                }
            }
        } else {
            console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
            creep.say('AI Disabled');
        }        
    }
}

const roleMiner = {

	run: function (creep) {
    
		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		
		if (!creep.memory.disableAI) {

			if (creep.ticksToLive <= 2) {
				creep.unloadMineral();
				creep.say('☠️');
			}
					
			if (!creep.memory.working && creep.store[RESOURCE_ENERGY] > 0) {
				creep.memory.working = true;
				creep.say('⛏️');
			}

			if (creep.memory.working && creep.store.getFreeCapacity() < (creep.getActiveBodyparts(WORK) * 2))
				creep.memory.working = false;

			if (creep.store.getFreeCapacity() == 0 || creep.store.getFreeCapacity() < (creep.getActiveBodyparts(WORK) * 2))
				creep.unloadMineral();
			else {
				if (Game.getObjectById(creep.room.memory.objects.extractor[0]).cooldown == 0)
					creep.harvestMineral();
			}
		}
		else {
			creep.say('AI Disabled');
		}
	}
}

const roleScientist = {

	run: function (creep) {

		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;

		if (!creep.memory.disableAI) {
			if (!creep.room.memory.objects.labs)
				creep.room.cacheObjects();
			if (!creep.room.memory.settings.labSettings)
				creep.room.memory.settings.labSettings = {};
			if (!creep.room.memory.settings.labSettings.reagantOne)
				creep.room.memory.settings.labSettings.reagantOne = 'none';
			if (!creep.room.memory.settings.labSettings.reagantTwo)
				creep.room.memory.settings.labSettings.reagantTwo = 'none';
			if (!creep.room.memory.settings.labSettings.boostingCompound)
				creep.room.memory.settings.labSettings.boostingCompound = 'none';

			const reagentLab1 	= Game.getObjectById(creep.room.memory.objects.labs[0]);
			const reagentLab2 	= Game.getObjectById(creep.room.memory.objects.labs[1]);
			const reactionLab1 	= Game.getObjectById(creep.room.memory.objects.labs[2]);
			const storage 			= Game.getObjectById(creep.room.memory.objects.storage[0]);

			const baseReg1 			= creep.room.memory.settings.labSettings.reagantOne;
			const baseReg2 			= creep.room.memory.settings.labSettings.reagantTwo;
			const boostChem 		= creep.room.memory.settings.labSettings.boostingCompound;
			const outputChem 		= creep.room.calcLabReaction();

			if (creep.room.memory.objects.labs[2])
				outputLab = Game.getObjectById(creep.room.memory.objects.labs[2]);

			if (reagentLab1.store[RESOURCE_ENERGY] < 2000) {
				if (creep.store[RESOURCE_ENERGY] == 0) {
					if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
						creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.8, lineStyle: 'undefined' } });
				}
			} else if (reagentLab2.store[RESOURCE_ENERGY] < 2000) {
				if (creep.store[RESOURCE_ENERGY] == 0) {
					if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
						creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.8, lineStyle: 'undefined' } });
				}
			} else if (creep.room.memory.settings.flags.doScience) {
				if (reagentLab1.store[baseReg1] < 3000) {
					if (creep.store[baseReg1] == 0) {
						if (creep.withdraw(storage, baseReg1) == ERR_NOT_IN_RANGE)
							creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.8, lineStyle: 'undefined' } });
					}
				} else if (reagentLab2.store[baseReg2] < 3000) {
					if (creep.store[baseReg2] == 0) {
						if (creep.withdraw(storage, baseReg2) == ERR_NOT_IN_RANGE)
							creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.8, lineStyle: 'undefined' } });
					}
				} else {
					reactionLab1.runReaction(reagentLab1, reagentLab2);
				}
			
				if (reactionLab1.store[outputChem] > 0) {
					if (creep.withdraw(reactionLab1, outputChem) == ERR_NOT_IN_RANGE) {
						creep.moveTo(reactionLab1, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.8, lineStyle: 'undefined' } });
					}
				} else {
					if (creep.transfer(storage, outputChem) == ERR_NOT_IN_RANGE) {
						creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.8, lineStyle: 'undefined' } });
					}	
				}
			}
		}	
	}
};

module.exports = roleHarvester;
module.exports = roleCollector;
module.exports = roleBuilder;
module.exports = roleUpgrader;
module.exports = roleRunner;
module.exports = roleRepairer;
module.exports = roleCrane;
module.exports = roleMiner;
module.exports = roleScientist;