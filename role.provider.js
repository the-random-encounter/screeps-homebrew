const roleProvider = {

	run: function (creep) {

		if (creep.memory.disableAI === undefined)
            creep.memory.disableAI = false;

		if (!creep.memory.disableAI) {
					
			if (creep.store.getUsedCapacity() == 0) {

				const storageID = '6530e110fb12195485fc0a2a';

				if (creep.withdraw(Game.getObjectById(storageID), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(Game.getObjectById(storageID), { visualizePathStyle: { stroke: '#ff0033', opacity: 0.3, lineStyle: 'dotted' } });
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

module.exports = roleProvider;