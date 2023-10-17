const roleRunner = {

	run: function (creep) {


		if (creep.store[RESOURCE_ENERGY] == 0) {
			
			let target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_STORAGE } })
			if (target) {
				if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3 } });
				}
			}
		}
		
		else {
			var targets = creep.room.find(FIND_STRUCTURES);

			targets = _.filter(targets, function (struct) {
				return (struct.structureType == STRUCTURE_CONTAINER) && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
			});

			if (targets.length) {

				// find closest spawn or extension to creep
				let target = creep.pos.findClosestByRange(targets);

				// move to the target
				if (creep.pos.isNearTo(target)) {
					// transfer energy
					creep.transfer(target, RESOURCE_ENERGY);
				} else {
					creep.moveTo(target, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3 } });
				}
			}
		}
	}
}
module.exports = roleRunner;