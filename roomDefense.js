"use strict";
global.roomDefense = function (room) {
	
	let towers = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
	
	_.forEach(towers, function (tower) {
		if (tower) {
			const tID = tower.id;
			const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
			
			if (closestHostile) {
				tower.room.visual.circle(tower.pos, { fill: '#110000', radius: 35, stroke: '#ff0000', opacity: 0.3, lineStyle: 'dashed' });
				tower.attack(closestHostile);
			} else {
				const closestDamagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
					filter: (creep) => creep.hits < creep.hitsMax
				});
				
				if (closestDamagedCreep) {
					tower.heal(closestDamagedCreep);
				} else {
					
					if (room.memory.flags.towerRepairBasic == true) {

						let ramparts = [];
						let walls = [];
						let validTargets = [];
						
						const rampartsMax 	= tower.room.memory.settings.repairRampartsTo;
						const wallsMax 			= tower.room.memory.settings.repairWallsTo;

						// search for roads, spawns, extensions, or towers under 95%
						let targets = tower.room.find(FIND_STRUCTURES, {
							filter: (i) => (i.hits < i.hitsMax) && (i.structureType ==
								STRUCTURE_TOWER 		|| i.structureType == STRUCTURE_SPAWN 		|| i.structureType == STRUCTURE_EXTENSION || i.structureType == STRUCTURE_ROAD 			|| i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_EXTRACTOR || i.structureType == STRUCTURE_LAB 			|| i.structureType == STRUCTURE_LINK 			|| i.structureType == STRUCTURE_STORAGE 	|| i.structureType == STRUCTURE_TERMINAL)
						});
					
						validTargets = validTargets.concat(targets);
						
						if (tower.room.memory.flags.towerRepairDefenses) {
							if (tower.room.memory.flags.repairRamparts) {
								ramparts = tower.room.find(FIND_STRUCTURES, { filter: (i) => ((i.hits / i.hitsMax * 100) < rampartsMax) && (i.structureType == STRUCTURE_RAMPART) });
								validTargets = validTargets.concat(ramparts);
							}

							if (tower.room.memory.flags.repairWalls) {
								walls = tower.room.find(FIND_STRUCTURES, { filter: (i) => (i.structureType == STRUCTURE_WALL && (i.hits / i.hitsMax * 100) < wallsMax) })
								validTargets = validTargets.concat(walls);
							}
						}
						
						const target = tower.pos.findClosestByRange(validTargets);
						tower.repair(target);
					}
				}
			}	
		}
	});
}