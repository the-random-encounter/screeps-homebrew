const roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.ticksToLive <= 2) {
            creep.drop(RESOURCE_ENERGY);
            creep.say('☠️');
        }

        if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.say('🔼');
        }
        if(!creep.memory.working && creep.store.getFreeCapacity() == 0 ) {
            creep.memory.working = true;
            creep.say('🏗️');
        }

        if (creep.store.getUsedCapacity() == 0) {
    
            switch (creep.room.memory.flags.runnerLogic || false) {
                case true: {
                    const containersWithEnergy = Game.getObjectById(creep.room.memory.objects.storage[0]) || creep.room.find(FIND_MY_STRUCTURES, {
                        filter: (i) => (i.structureType == STRUCTURE_STORAGE) && i.store[RESOURCE_ENERGY] > 0
                    });
                    let target;
                    
                    if (containersWithEnergy.length) {
                        target = creep.pos.findClosestByRange(containersWithEnergy);
                    } else if (containersWithEnergy) {
                        target = containersWithEnergy;
                    }
						
                    if (target) {
                        if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                            creep.moveTo(target, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3, lineStyle: 'dotted' } });
                        else
                            creep.withdraw(target, RESOURCE_ENERGY);
                    }
                    break;
                }
				case false:
                default: {
                    const containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
                        filter: (i) => (i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE) && i.store[RESOURCE_ENERGY] > 0
                    });
                    const droppedPiles = creep.room.find(FIND_DROPPED_RESOURCES);
                    const resourceList = containersWithEnergy.concat(droppedPiles);
							
                    const target = creep.pos.findClosestByRange(resourceList);
						
                    if (target) {
                        if (creep.pickup(target) == ERR_NOT_IN_RANGE || creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3, lineStyle: 'dotted' } });
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
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#0000ff', opacity: 0.3, lineStyle: 'dotted'}});
                }
            }
        } 
    }
};

module.exports = roleBuilder;