const roleScout = {

	run: function (creep) {
		
		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		
		if (!creep.memory.disableAI) {
			if (creep.memory.moveTarget) {
				if (creep.pos !== creep.memory.moveTarget) {
					creep.moveTo(creep.memory.moveTarget);
				}
			}
		}
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
};
	
module.exports = roleScout;