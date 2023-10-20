const roleClaimer = {

	run: function (creep) {
	
		if (creep.ticksToLive <= 2) {
            creep.drop(RESOURCE_ENERGY);
            creep.say('☠️');
		}
		
		if (creep.room == Game.flags.Flag2.room) {
			
			if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller, {visualizePathStyle: { stroke: '#ffffff', opacity: 0.3}});
				}
			} else {
				creep.moveTo(Game.flags.Flag1,{visualizePathStyle: { stroke: '#ffffff', opacity: 0.3}});
			}
		}
	
}

module.exports = roleClaimer;