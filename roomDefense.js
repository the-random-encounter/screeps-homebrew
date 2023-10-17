function roomDefense(room) {
	

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
	/*const hostiles = room.find(FIND_HOSTILE_CREEPS);

	let towers = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
	
	if (hostiles) {

		_.forEach(towers, function (tower) {
			let target = tower.pos.findInRange(hostiles, 20);

			if (target) {
				tower.attack(target);
			} else if (tower.pos.getRangeTo(target)) {
			
				target = tower.pos.findInRange(hostiles, 10, {
					filter: function (o) {
						return o.getActiveBodyParts(TOUGH) <= 10;
					}
				});

				if (target) {
					tower.attack(target);
				} 
			}
			
			else {
					const target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
						filter: function (object) {
							return object.hits < object.hitsMax;
						}
					});

					if (target) {
						tower.heal(target)
					}
			}
		});
	}
} */

module.exports = roomDefense;