const roleReserver = {

	run: function (creep) {
	
		if (creep.room.name == 'E57S51') {
			
			if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller, {visualizePathStyle: { stroke: '#ffffff', opacity: 0.3}});
				}
			} else {
				creep.moveTo(Game.flags.WestRoomRC,{visualizePathStyle: { stroke: '#ffffff', opacity: 0.3}});
			}
		}
	
}

module.exports = roleReserver;