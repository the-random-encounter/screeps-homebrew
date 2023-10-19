"use strict";
global.roomDefense = function (room) {
	

	let towers = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
	
	_.forEach(towers, function (tower) {
		if (tower) {
			var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
			if (closestHostile) {
				tower.attack(closestHostile);
			} else {
				var closestDamagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
					filter: (creep) => creep.hits < creep.hitsMax
				});
				if (closestDamagedCreep) {
					tower.heal(closestDamagedCreep);
				}
			}
			
		}
	});
}