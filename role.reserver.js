const roleReserver = {

	run: function (creep) {
	
		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		
		if (!creep.memory.disableAI) {
			if (creep.room.name == 'E57S51') {
			
				if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.3 } });
				}
			} else {
				creep.moveTo(Game.flags.WestRoomRC, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.3 } });
			}
		}
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
}

module.exports = roleReserver;