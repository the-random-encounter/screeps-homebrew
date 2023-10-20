const roleRunner = {

	run: function (creep) {

		if (creep.ticksToLive <= 2) {
            creep.drop(RESOURCE_ENERGY);
            creep.say('☠️');
		}
		
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
			let target = Game.getObjectById(creep.room.memory.objects.storage[0]);
			if (target) {
				if (creep.pos.isNearTo(target))
					creep.transfer(target, RESOURCE_ENERGY);
				else
					creep.moveTo(target, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted' } });
			}
		}
	}
}

module.exports = roleRunner;