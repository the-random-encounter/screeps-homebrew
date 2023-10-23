const roleRemoteRunner = {

	run: function (creep) {

		if (!creep.memory.disableAI) {
		
			creep.memory.disableAI = false;

			if (creep.ticksToLive <= 2)
				creep.say('☠️');
			if (!creep.memory.container)
				creep.memory.container = Memory.rooms.E57S51.objects.containers[0];
			if (!creep.memory.link)
				creep.memory.link = Memory.rooms.E58S51.objects.links[1];

			if (creep.store[RESOURCE_ENERGY] == 0) {
				const target = Game.getObjectById(creep.memory.container)
				if (target) {
					if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
						creep.moveTo(target, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted' } });
				}
			}
			
			if (creep.store.getUsedCapacity() !== 0) {
				const target = Game.getObjectById(creep.memory.link);
				if (target) {
					if (creep.pos.isNearTo(target)) {
						if (target.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
							creep.transfer(target, RESOURCE_ENERGY);
					}
					else {
						const roadUnderCreep = creep.room.find(FIND_STRUCTURES, { filter: (i) => (i.structureType == STRUCTURE_ROAD && i.pos.x == creep.pos.x && i.pos.y == creep.pos.y && i.hits !== i.hitsMax) })
						const roadTarget = creep.pos.findClosestByRange(roadUnderCreep);
						if (roadTarget) {
							creep.repair(roadTarget);
						} else {
							creep.moveTo(target, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted' } });
						}
					}
				}
			}
		}
	}
}

module.exports = roleRemoteRunner;