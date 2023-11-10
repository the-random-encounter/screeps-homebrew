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
        
                switch (creep.room.memory.flags.centralStorageLogic || false) {
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

module.exports = roleBuilder;