const roleRanger = {

	/** @param {Creep} creep **/
	run: function (creep) {

		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		
		if (!creep.memory.disableAI) {

			if (creep.ticksToLive <= 2) {
				creep.drop(RESOURCE_ENERGY);
				creep.say('☠️');
			}
			
			const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
			
			const target = creep.pos.findClosestByRange(hostiles);
			
			if (creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
				creep.move(target);
			}
		}
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
}

module.exports = roleRanger;
