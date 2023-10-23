const roleHealer = {

	/** @param {Creep} creep **/
	run: function (creep) {
		
		if (!creep.memory.disableAI) {
		
			creep.memory.disableAI = false;

			if (creep.ticksToLive <= 2) {
				creep.drop(RESOURCE_ENERGY);
				creep.say('☠️');
			}
			
			const target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
				filter: function (object) {
					return object.hits < object.hitsMax;
				}
			});
		
			if (target) {
				creep.moveTo(target);
				if (creep.pos.isNearTo(target)) {
					creep.heal(target);
				}
				else {
					creep.rangedHeal(target);
				}
			}
		}
	}
}

module.exports = roleHealer;