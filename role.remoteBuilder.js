const roleRemoteBuilder = {

	/** @param {Creep} creep **/
	run: function(creep) {

		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		
		if (!creep.memory.disableAI) {

			if (creep.ticksToLive <= 2) {
				creep.drop(RESOURCE_ENERGY);
				creep.say('☠️');
			}

			if (creep.memory.working === undefined) {
				creep.memory.working = false;
			}
			
			if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
				creep.memory.working = false;
				creep.say('🔼');
			}
			if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
				creep.memory.working = true;
				creep.say('🏗️');
			}

			if (creep.room.name == 'E58S51')
				creep.moveTo(Game.getObjectById(Game.rooms.E57S51.memory.objects.sources[0]), { visualizePathStyle: { stroke: '#ffff00', opaciy: 0.3, ignroeCreeps: true } });

			if (creep.room.name == 'E57S51' && creep.pos.x == 49)
				creep.move(LEFT);

			if (creep.store.getFreeCapacity() > 0 && creep.memory.working == false) {
				switch (creep.room.memory.flags.runnerLogic) {
					case true: {
						
						const containersWithEnergy = Game.getObjectById(Game.rooms.E57S51.memory.objects.containers[0])
						
						if (containersWithEnergy) {
							
							if (creep.withdraw(containersWithEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
								creep.moveTo(containersWithEnergy, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
							else
								creep.withdraw(containersWithEnergy, RESOURCE_ENERGY);
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
								creep.moveTo(target, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
							} else {
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
			} else if (creep.store.getUsedCapacity() !== 0 && creep.memory.working) {
				var targets = Game.rooms.E57S51.find(FIND_CONSTRUCTION_SITES);
				if (targets.length) {
					if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#0000ff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
					}
				}
			}
		}
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
};

module.exports = roleRemoteBuilder;