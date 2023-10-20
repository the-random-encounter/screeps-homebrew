"use strict";
global.roomDefense = function (room) {
	

	let towers = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
	
	let towerArray = [];
	for (let i = 0; i < room.memory.objects.towers.length; i++) {
		towerArray.push(Game.getObjectById(room.memory.objects.towers[i]));
	}
	
	_.forEach(towers, function (tower) {
		if (tower) {
			const tID = tower.id;
			var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
			if (closestHostile) {
				tower.room.visual.circle(tower.pos, { fill: '#110000', radius: 18, stroke: '#ff0000', opacity: 0.3, lineStyle: 'dashed' });
				if (tower.pos.getRangeTo(closestHostile) <= 18)
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