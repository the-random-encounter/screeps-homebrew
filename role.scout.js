const roleScout = {

	run: function (creep) {
		
		if (creep.memory.moveTarget) {
			if (creep.pos !== creep.memory.moveTarget) {
				creep.moveTo(creep.memory.moveTarget);
			}
		}
	}
}

module.exports = roleScout;