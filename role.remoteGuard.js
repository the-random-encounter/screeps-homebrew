const roleWarrior = {

	/** @param {Creep} creep **/
	run: function (creep) {

		if (creep.ticksToLive <= 2) {
			creep.drop(RESOURCE_ENERGY);
			creep.say('☠️');
		}
		
		if (!creep.memory.room) {
			creep.memory.room = 'E57S51';
		}

		const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
		
		const target = creep.pos.findClosestByRange(hostiles);

		if (!target) {
			creep.moveTo(Game.flags.WestRoomRally, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.3, lineStyle: 'dotted' } });
			
			//if (creep.pos.x == 49)
			//creep.move(7);
			
		} else {
	
			if (creep.attack(target) == ERR_NOT_IN_RANGE)
				creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.3, lineStyle: 'undefined' } });
		}
	}
}

module.exports = roleWarrior;
