/*const roleCollector = {

	run: function (creep) {
		
		// prioritize saving any energy dropped on creep tombstones
		if (creep.room.find(FIND_TOMBSTONES) && creep.store.getFreeCapacity() > 0) {
			const tombstones = creep.room.find(FIND_TOMBSTONES);
			for (i = 0; i < tombstones.length; i++) {
				if (tombstones[i].store[RESOURCE_ENERGY] > 0) {
					if (creep.withdraw(tombstones[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(tombstones[i], { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3 } });
					}
				}
			}
		}

		// if collector is carrying nothing, hunt for dropped energy and collect
		if (creep.store[RESOURCE_ENERGY] == 0) {
			
			var target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
			
			if (target) {
				if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3 } });
				}
				target = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 2);
			
				if (creep.store.getUsedCapacity() > 0 && creep.store.getFreeCapacity() !== 0 && creep.pos.findInRange(FIND_DROPPED_RESOURCES, 2)) {
					console.log(target);

					if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3 } });
					}
				} else {

					// build structure list & filter for spawns & extensions
					var targets = creep.room.find(FIND_STRUCTURES);

					targets = _.filter(targets, function (struct) {
						return (struct.structureType == STRUCTURE_SPAWN || struct.structureType == STRUCTURE_EXTENSION) && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
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

						// spawns & extensions are full, so deposit in towers, containers, and storage
					} else {

						// buiild structure list & filter for towers, containers, and storage
						var secondTargets = creep.room.find(FIND_STRUCTURES);

						secondTargets = _.filter(secondTargets, function (struct) {
							return (struct.structureType == STRUCTURE_TOWER || struct.structureType == STRUCTURE_CONTAINER || struct.structureType == STRUCTURE_STORAGE) && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
						});

						// find closest tower, container, or storage to creep
						let target = creep.pos.findClosestByRange(secondTargets);

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
	}
}
*/

const roleCollector = {

	run: function (creep) {
		
		// prioritize saving any energy dropped on creep tombstones
		if (creep.room.find(FIND_TOMBSTONES) && creep.store.getFreeCapacity() > 0) {
			const tombstones = creep.room.find(FIND_TOMBSTONES);
			for (i = 0; i < tombstones.length; i++) {
				if (tombstones[i].store[RESOURCE_ENERGY] > 0) {
					if (creep.withdraw(tombstones[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(tombstones[i], { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3 } });
					}
				}
			}
		}

		// if collector is carrying nothing, hunt for dropped energy and collect
		if (creep.store[RESOURCE_ENERGY] == 0) {
			
			let target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
			
			if (target) {
				if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3 } });
				}
			} else {
				target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_STORAGE } })
				if (target) {
					if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3 } });
					}
				}
			}
			
		
			// if carrying energy, locate closest structure to deposit, prioritizing spawns & extensions
		} else {

			// build structure list & filter for spawns & extensions
			var targets = creep.room.find(FIND_STRUCTURES);

			targets = _.filter(targets, function (struct) {
				return (struct.structureType == STRUCTURE_SPAWN || struct.structureType == STRUCTURE_EXTENSION) && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
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

				// spawns & extensions are full, so deposit in towers, containers, and storage
			} else {

				// build structure list & filter for towers, containers, and storage
				var secondTargets = creep.room.find(FIND_STRUCTURES);

				secondTargets = _.filter(secondTargets, function (struct) {
					return (struct.structureType == STRUCTURE_TOWER || struct.structureType == STRUCTURE_CONTAINER || struct.structureType == STRUCTURE_STORAGE) && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
				});

				// find closest tower, container, or storage to creep
				let target = creep.pos.findClosestByRange(secondTargets);

				// move to the target
				if (secondTargets) {
					if (creep.pos.isNearTo(target)) {
						// transfer energy
						creep.transfer(target, RESOURCE_ENERGY);
					} else {
						creep.moveTo(target, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3 } });
					}
				} else {
					var finalTargets = creep.room.find(FIND_STRUCTURES);
					finalTargets = _.filter(finalTargets, function (struct) {
						return (struct.structureType == STRUCTURE_STORAGE) && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
					});

					target = creep.pos.findClosestByRange(finalTargets);

					if (target) {
						if (creep.pos.isNearTo(target)) {
							creep.transfer(target, RESOURCE_ENERGY);
						} else {
							creep.moveTo(target, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3 } });
						}
					}
				}
			}
		}
	}
}
module.exports = roleCollector;