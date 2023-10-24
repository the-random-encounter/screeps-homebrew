const roleWarrior = {

	/** @param {Creep} creep **/
	run: function(creep) {

		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		
		if (!creep.memory.disableAI) {
			if (creep.ticksToLive <= 2) {
				creep.drop(RESOURCE_ENERGY);
				creep.say('☠️');
			}
		
			if (!creep.memory.room) {
				creep.memory.room = 'E57S51';
			}

			const targetRoom = creep.memory.room;

			if (creep.room.name !== targetRoom) {
				creep.moveTo(Game.flags.WestRoomRally, { visualizePathStyle: { sroke: '#ff0000', opacity: 0.3, lineStyle: 'dotted' } });
			}

			if (creep.pos.x == 49) {
				creep.move(7);
			}

			const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
		
			const target = creep.pos.findClosestByRange(hostiles);
		
			if (creep.attack(target) == ERR_NOT_IN_RANGE) {
				creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.3, lineStyle: 'undefined' } });
			}
		}
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
}

module.exports = roleWarrior;
