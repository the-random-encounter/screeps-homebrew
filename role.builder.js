const roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.say('🔼');
        }
        if(!creep.memory.working && creep.store.getFreeCapacity() == 0 ) {
            creep.memory.working = true;
            creep.say('🏗️');
        }

        if (creep.store.getUsedCapacity() == 0) {
    
            //creep.pickupClosestEnergy();
            let containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
                filter: (i) => i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE
            });
            
            let droppedPiles;

            containersWithEnergy = _.filter(containersWithEnergy, (containersWithEnergy) => containersWithEnergy.store[RESOURCE_ENERGY] > 0);

            if (!containersWithEnergy.length) {
                droppedPiles = creep.room.find(FIND_DROPPED_RESOURCES);
            }

            const resourceList = containersWithEnergy.concat(droppedPiles);
            const target = creep.pos.findClosestByRange(resourceList);
  
            if (target) {
                if (creep.pickup(target) == ERR_NOT_IN_RANGE || creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3 } });
                }
                else {
                    creep.withdraw(target, RESOURCE_ENERGY);
                    creep.pickup(target);
                }
                //creep.memory.working = true;
            }
                    
        } else {
            
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#0000ff', opacity: 0.3}});
                }
            }
        }
        
    }
};

module.exports = roleBuilder;