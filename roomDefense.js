"use strict";
global.roomDefense = function (room) {
	
	let towers = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
	
	_.forEach(towers, function (tower) {
		if (tower) {
			const tID = tower.id;
			var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
			if (closestHostile) {
				tower.room.visual.circle(tower.pos, { fill: '#110000', radius: 35, stroke: '#ff0000', opacity: 0.3, lineStyle: 'dashed' });
				//if (tower.pos.getRangeTo(closestHostile) <= 18)
					tower.attack(closestHostile);
			} else {
				var closestDamagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
					filter: (creep) => creep.hits < creep.hitsMax
				});
				if (closestDamagedCreep) {
					tower.heal(closestDamagedCreep);
				}
			}
			
			if (room.memory.flags.towerRepair == true) {
				const repairTargets = tower.room.find(FIND_STRUCTURES, {
					filter: (i) => ((i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_TOWER || i.structureType == STRUCTURE_ROAD || i.structureType == STRUCTURE_STORAGE || i.structureType == STRUCTURE_SPAWN || i.structureType == STRUCTURE_LINK || i.structureType == STRUCTURE_EXTENSION/* || i.structureType == STRUCTURE_RAMPART*/) && (i.hits < i.hitsMax))
				});
				const target = repairTargets[0];
				tower.repair(target);
			}
		}
	});
}