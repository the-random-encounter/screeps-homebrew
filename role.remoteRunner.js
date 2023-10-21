const roleRemoteRunner = {

	run: function (creep) {

		if (creep.ticksToLive <= 2)
      creep.say('☠️');
		if (!creep.memory.container)
			creep.memory.container = Memory.rooms.E57S51.objects.containers[0];
		if (!creep.memory.storage)
				creep.memory.storage = Memory.rooms.E58S51.objects.storage[0];

		if (creep.store[RESOURCE_ENERGY] == 0) {
			const target = Game.getObjectById(creep.memory.container)
			if (target) {
				if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
					creep.moveTo(target, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted' } });
			}
		}
		
		if (creep.store.getFreeCapacity() == 0) {
			const target = Game.getObjectById(creep.memory.storage);
			if (target) {
				if (creep.pos.isNearTo(target))
					creep.transfer(target, RESOURCE_ENERGY);
				else
					creep.moveTo(target, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted' } });
			}
		}
	}
}

module.exports = roleRemoteRunner;