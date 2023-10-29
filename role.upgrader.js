const roleUpgrader = {

			/** @param {Creep} creep **/
		run: function(creep) {

		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;

		if (creep.memory.upgradeRoom === undefined)
			creep.memory.upgradeRoom = creep.room.name;
		//if (creep.memory.upgradeRoom === undefined);
			//creep.memory.upgradeRoom = creep.room.name;
		
		if (!creep.memory.disableAI) {

			const badPosC = new RoomPosition(39, 9, 'E58S51');
			const badPosSW = new RoomPosition(38, 9, 'E58S51');
			const badPosW = new RoomPosition(38, 8, 'E58S51');
			const badPosSE = new RoomPosition(40, 9, 'E58S51');
			const upgradeRoom = creep.memory.upgradeRoom;
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
				creep.say('⚡');
			}

			if (creep.pos.x == badPosC.x && creep.pos.y == badPosC.y) {
				if (creep.move(8) !== 0)
					creep.move(1);
			} else if ((creep.pos.x == badPosSW.x || creep.pos.x == badPosSE.x) && creep.pos.y == badPosSW.y)
				creep.move(1);
			else if (creep.pos.x == badPosW.x && creep.pos.y == badPosW.y)
				creep.move(1);
			
			if (creep.pos.x == 49) {
				creep.move(7);
			} else if (creep.pos.x == 0) {
				creep.move(3);
			} else if (creep.pos.y == 0) {
				creep.move(5);
			} else if (creep.pos.y == 49) {
				creep.move(1)
			}

				// if working flag is true, upgrade local controller
			if (creep.store.getUsedCapacity() !== 0) {
				if (creep.room.name !== upgradeRoom) {
					creep.moveTo(Game.flags.ClaimFlag);
				} else {
					if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
						creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3, lineStyle: 'dotted' } });
				}
			}
	
				// if not working & inventory is empty, collect more energy
				if (creep.store.getUsedCapacity() == 0) {
				
					switch (creep.room.memory.flags.runnerLogic) {
						case true: {
							let containersWithEnergy = creep.room.find(FIND_MY_STRUCTURES, {
								filter: (i) => (i.structureType == STRUCTURE_STORAGE) && i.store[RESOURCE_ENERGY] > 0
							});
							let piles = creep.room.find(FIND_DROPPED_RESOURCES);
							
							let all = containersWithEnergy.concat(piles);
							let target = creep.pos.findClosestByRange(all);
						
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
							
							target = creep.pos.findClosestByRange(resourceList);
						
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
				
			}
		}
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
};

module.exports = roleUpgrader;