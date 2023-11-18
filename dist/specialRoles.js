export const roleProvider = {

	run: function (creep) {

		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;

		if (!creep.memory.disableAI) {
			
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

				const tombstones = creep.room.find(FIND_DROPPED_RESOURCES);
				const closestTomb = creep.pos.findClosestByRange(tombstones);

				if (creep.pickup(closestTomb, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(closestTomb, { visualizePathStyle: { stroke: '#ff0033', opacity: 0.3, lineStyle: 'dotted' } });
				}
			
		
				if (creep.room.name !== 'E58S51') {
					creep.moveTo(Game.flags.NorthExit, { visualizePathStyle: { stroke: '#ff0033', opacity: 0.3, lineStyle: 'dotted' } });
				} else {
					const storage = Game.getObjectById('6530e110fb12195485fc0a2a');
					if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(storage, { visualizePathStyle: { stroke: '#ff0033', opacity: 0.3, lineStyle: 'dotted' } });
					}
				}
			
			} else {
				if (creep.room.name !== 'E5948') {
					creep.moveTo(Game.flags.Attack, { visualizePathStyle: { stroke: '#ff0033', opacity: 0.3, lineStyle: 'dotted' } })
				} else {
					if (creep.pos.x !== 21 && creep.pos.y !== 25) {
						creep.moveTo(Game.flags.Attack, { visualizePathStyle: { stroke: '#ff0033', opacity: 0.3, lineStyle: 'dotted' } });
					} else {
						creep.drop(RESOURCE_ENERGY);
					}
				}
		
			}
		} else {
			creep.say('Disabled');
		}
	}
}

export const roleRebooter = {

    /** @param {Creep} creep **/
    run: function (creep) {
       
        if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		
        if (!creep.memory.disableAI) {

            if (creep.ticksToLive <= 2) {
                creep.drop(RESOURCE_ENERGY);
                creep.say('☠️');
            }
            
            if (creep.store.getFreeCapacity() > 0)
                creep.harvestEnergy();
            
            else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                if (targets.length > 0) {
                    if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
    }
}

//module.exports = roleRebooter;
//module.exports = roleProvider;