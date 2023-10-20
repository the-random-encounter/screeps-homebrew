const roleRanger = {

	/** @param {Creep} creep **/
	run: function(creep) {

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
}

module.exports = roleRanger;
