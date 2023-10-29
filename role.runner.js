const roleRunner = {

	run: function (creep) {

		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		
		if (!creep.memory.disableAI) {
			if (creep.ticksToLive <= 2) {
				creep.drop(RESOURCE_ENERGY);
				creep.say('☠️');
			}
		
			if (!creep.room.memory.flags.runnersDoMinerals) {
				if (!creep.memory.container)
					creep.memory.container = creep.room.memory.objects.containers[0];
				if (!creep.memory.storage)
					creep.memory.storage = creep.room.memory.objects.storage[0];

				if (creep.store[RESOURCE_ENERGY] == 0) {
					let target = Game.getObjectById(creep.memory.container);
					if (target) {
						if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
							creep.moveTo(target, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted' } });
					}
				} else {
					let target = Game.getObjectById(creep.memory.storage);
					if (target) {
						if (creep.pos.isNearTo(target))
							creep.transfer(target, RESOURCE_ENERGY);
						else
							creep.moveTo(target, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted' } });
					}
				}
			} else {

				if (!creep.memory.container)
					creep.memory.container = creep.room.memory.objects.containers[0];
				if (!creep.memory.storage)
					creep.memory.storage = creep.room.memory.objects.storage[0];

				let target, piles;
				if (creep.room.memory.flags.runnersDoPiles)
					piles = creep.room.find(FIND_DROPPED_RESOURCES);
				
				const thePile = creep.pos.findClosestByRange(piles);

				if (thePile) {
					if (creep.pickup(thePile) == ERR_NOT_IN_RANGE)
						creep.moveTo(thePile, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted' } });
				} else {
			
					target = Game.getObjectById(creep.memory.container);

					if (target) {
						const mineral = Object.keys(target.store).toString() || [];

						if (creep.store.getUsedCapacity() == 0) {
							if (target) {
								if (creep.withdraw(target, mineral) == ERR_NOT_IN_RANGE)
									//creep.moveByPath(creep.room.memory.paths.storeToMin, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted' } });
									creep.moveTo(target, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted' } });
							}
						} else {
							const target = Game.getObjectById(creep.memory.storage);
							if (target) {
								if (creep.pos.isNearTo(target))
									creep.transfer(target, mineral);
								else
									creep.moveByPath(creep.room.memory.paths.minToStore, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted' } });
								//creep.moveTo(target, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted' } });
							}
						}
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

module.exports = roleRunner;