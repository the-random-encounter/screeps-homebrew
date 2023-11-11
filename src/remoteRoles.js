const roleRemoteHarvester = {

	run: function (creep) {
		
		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		
		if (!creep.memory.disableAI) {

			if (creep.ticksToLive <= 2) {
				creep.unloadEnergy();
				creep.say('☠️');
			} else {

				// a specific fix for a remote harvesting source, to ensure position near container
				if (creep.room.name == 'E57S51') {
					if (creep.pos.x == 11 && creep.pos.y == 6)
						creep.move(1);
					else if (creep.pos.x == 11 && creep.pos.y == 7)
						creep.move(1);
				}

				if (!creep.memory.working && creep.store[RESOURCE_ENERGY] > 0) {
					creep.memory.working = true;
					creep.say('⛏️');
				}
			
				if (creep.memory.working && creep.store.getFreeCapacity() < (creep.getActiveBodyparts(WORK) * 2))
					creep.memory.working = false;

				if (creep.store.getFreeCapacity() == 0 || creep.store.getFreeCapacity() < (creep.getActiveBodyparts(WORK) * 2)) {
					const containers = creep.room.find(FIND_STRUCTURES, { filter: (i) => (i.structureType == STRUCTURE_CONTAINER && (i.hits < i.hitsMax)) });
					const target = creep.pos.findClosestByRange(containers);
					if (!creep.pos.isNearTo(target))
						creep.moveTo(target);
					else {
						if (target.hits < target.hitsMax)
							creep.repair(target);
						else
							creep.unloadEnergy();
					}
				} else {
					creep.harvestEnergy();
				}
			}
		}
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
}

const roleRemoteBuilder = {

	/** @param {Creep} creep **/
	run: function(creep) {

		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		
		if (creep.memory.workRoom === undefined)
			creep.memory.workRoom = 'W8N2';

		if (!creep.memory.disableAI) {

			const workRoom = creep.memory.workRoom;

			if (creep.ticksToLive <= 2) {
				creep.drop(RESOURCE_ENERGY);
				creep.say('☠️');
			}

			if (creep.memory.working === undefined) {
				creep.memory.working = false;
			}
			
			if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
				creep.memory.working = false;
				creep.say('🔼');
			}
			if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
				creep.memory.working = true;
				creep.say('🏗️');
			}

			if (creep.pos.x == 49)
				creep.move(LEFT);
			if (creep.pos.x == 0)
				creep.move(RIGHT);
			if (creep.pos.y == 49)
				creep.move(TOP);
			if (creep.pos.y == 0)
				creep.move(BOTTOM);

			if (creep.store.getFreeCapacity() >= (creep.getActiveBodyparts(WORK) * 5) && creep.memory.working == false) {

						const tombstones = creep.room.find(FIND_TOMBSTONES);
						const containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
							filter: (i) => (i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE) && i.store[RESOURCE_ENERGY] > 0
						});
						const droppedPiles = creep.room.find(FIND_DROPPED_RESOURCES);
						let resourceList = containersWithEnergy.concat(droppedPiles);
						resourceList = tombstones.concat(resourceList);

						const target = creep.pos.findClosestByRange(resourceList);
		
						if (target) {
							if (creep.pickup(target) == ERR_NOT_IN_RANGE || creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
								creep.moveTo(target, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
							} else {
								switch (target.structureType) {
									case STRUCTURE_CONTAINER:
									case STRUCTURE_STORAGE:
										creep.withdraw(target, RESOURCE_ENERGY);
										break;
									default:
										creep.pickup(target);
										break;
								}
							}
						} else {
							creep.harvestEnergy();
						}
						creep.memory.working = true;
					
					
				
			} else if (creep.store.getUsedCapacity() !== 0 && creep.memory.working) {

				if (creep.room.name !== workRoom)
					creep.moveTo(Game.getObjectById(Game.rooms[workRoom].memory.objects.controller[0]), { visualizePathStyle: { stroke: '#ffff00', opaciy: 0.3, ignroeCreeps: true } });
				else {
					let targets = Game.rooms[workRoom].find(FIND_CONSTRUCTION_SITES);
					if (targets.length) {
						targets = creep.pos.findClosestByRange(targets);
						if (creep.build(targets) == ERR_NOT_IN_RANGE) {
							creep.moveTo(targets, { visualizePathStyle: { stroke: '#0000ff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
						}
					}
				}
			}
		}
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
};

const roleRemoteRunner = {

	run: function (creep) {

		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		
		if (!creep.memory.disableAI) {

			if (creep.ticksToLive <= 2)
				creep.say('☠️');
			if (!creep.memory.container)
				creep.memory.container = Memory.rooms.E57S51.objects.containers[0];
			if (!creep.memory.link)
				creep.memory.link = Memory.rooms.E58S51.objects.links[1];

			if (creep.store[RESOURCE_ENERGY] == 0) {
				const target = Game.getObjectById(creep.memory.container)
				if (target) {
					if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
						creep.moveTo(target, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
				}
			}
			
			if (creep.store.getUsedCapacity() !== 0) {
				const target = Game.getObjectById(creep.memory.link);
				if (target) {
					if (creep.pos.isNearTo(target)) {
						if (target.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
							creep.transfer(target, RESOURCE_ENERGY);
					}
					else {
						const roadUnderCreep = creep.room.find(FIND_STRUCTURES, { filter: (i) => (i.structureType == STRUCTURE_ROAD && i.pos.x == creep.pos.x && i.pos.y == creep.pos.y && i.hits !== i.hitsMax) })
						const roadTarget = creep.pos.findClosestByRange(roadUnderCreep);
						if (roadTarget) {
							creep.repair(roadTarget);
						} else {
							creep.moveTo(target, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
						}
					}
				}
			}
		}
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
}

const roleRemoteGuard = {

	/** @param {Creep} creep **/
	run: function (creep) {

		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		
		if (!creep.memory.disableAI) {
			if (creep.ticksToLive <= 2) {
				creep.drop(RESOURCE_ENERGY);
				creep.say('☠️');
			}
		
			if (!creep.memory.room) {
				creep.memory.room = 'E57S51';
			}

			const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
		
			const target = creep.pos.findClosestByRange(hostiles);

			if (!target) {
				creep.moveTo(Game.flags.WestRoomRally, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });

			} else {
	
				if (creep.attack(target) == ERR_NOT_IN_RANGE)
					creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.3, lineStyle: 'undefined', ignoreCreeps: true } });
			}
		}
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
}

const roleReserver = {

	run: function (creep) {
	
		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		if (creep.memory.homeRoom === undefined)
			creep.memory.homeRoom = creep.room.name;
		if (creep.memory.rallyFlag === undefined)
			creep.memory.rallyFlag = false;
		if (creep.memory.targetRoom === undefined) {
			creep.memory.targetRoom = Game.rooms[creep.memory.homeRoom].memory.outposts.roomList[HEAP_MEMORY.outpostCounter];
			
			HEAP_MEMORY.outpostCounter++;
			
			if (HEAP_MEMORY.outpostCounter >= Game.rooms[creep.memory.homeRoom].memory.outposts.roomList.length)
				HEAP_MEMORY.outpostCounter = 0;
		}
		
		
		if (!creep.memory.disableAI) {
			if (creep.room.name == creep.memory.targetRoom) {
			
				if (!creep.room.memory.objects) {
					creep.room.cacheObjects();
				}
				if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.3 } });
				}
			} else {
				if (Game.flags[creep.memory.targetRoom])
					creep.moveTo(Game.flags[creep.memory.targetRoom], { visualizePathStyle: { stroke: '#ffffff', opacity: 0.3 } });
			}
		}
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
}

const roleClaimer = {

	run: function (creep) {

		if (creep.memory.disableAI === undefined) {
			creep.memory.disableAI = false;
		}

		if (creep.memory.claimRoomName === undefined) {
			creep.memory.claimRoomName = 'define me';
		}

		if (!creep.memory.disableAI) {

			if (creep.memory.claimFlag === undefined) {
				creep.memory.claimFlag = 'none';
			}

			const claimRoom = creep.memory.claimRoomName;

			if (creep.room.name !== claimRoom) {
				/*if (creep.memory.claimFlag !== 'none' && !creep.memory.claimFlag !== undefined) {
					let to = new RoomPosition(25, 25, 'E59S48');
					let from = new RoomPosition(creep.pos.x, creep.pos.y, creep.pos.roomName);

					// Use `findRoute` to calculate a high-level plan for this path,
					// prioritizing highways and owned rooms
					let allowedRooms = { [ from.roomName ]: true };
					const route = Game.map.findRoute(from.roomName, to.roomName, {
							routeCallback(roomName) {
									let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
									let isHighway = (parsed[1] % 10 === 0) || 
																	(parsed[2] % 10 === 0);
									let isMyRoom = Game.rooms[roomName] &&
											Game.rooms[roomName].controller &&
											Game.rooms[roomName].controller.my;
									if (isHighway || isMyRoom) {
											return 1;
									} else {
											return 2.5;
									}
							}
					}).forEach(function(info) {
							allowedRooms[info.room] = true;
					});

					// Invoke PathFinder, allowing access only to rooms from `findRoute`
					let ret = PathFinder.search(from, to, {
							roomCallback(roomName) {
									if (allowedRooms[roomName] === undefined) {
											return false;
									}
							}
					});
					if (creep.room.name = creep.memory.homeRoom) {
						creep.moveTo(new RoomPosition(25, 25, 'E59S48'), {visualizePathStyle: {stroke: '#00ff00', opacity: 0.3, lineStyle: 'undefined'}});
					} else {
						console.log(ret.path);
						if (ret.length > 0) {
							console.log('Now heading to room ' + route[0].room);
							const exit = creep.pos.findClosestByPath(route[0].exit);
							creep.moveTo(exit, {visualizePathStyle: {stroke: '#00ff00', opacity: 0.3, lineStyle: 'undefined'}});
						}
					}
				}*/

				if (creep.memory.waypointTwoReached !== undefined) {
					creep.moveTo(Game.flags.ClaimFlag, {visualizePathStyle: {stroke: '#00ff00', opacity: 0.3, lineStyle: 'undefined'}});
				} else {
					if (creep.memory.waypointOneReached !== undefined) {
						if (!creep.pos.isNearTo(Game.flags.ClaimPoint2))
							creep.moveTo(Game.flags.ClaimPoint2, {visualizePathStyle: {stroke: '#00ff00', opacity: 0.3, lineStyle: 'undefined'}});
						else
							creep.memory.waypointTwoReached = true;
					} else {
						if (creep.store.getUsedCapacity() == 0 && creep.getActiveBodyparts(CARRY) > 0) {
							if (creep.memory.gotBoosted === undefined) {
								const lab = Game.getObjectById('653943a3ab148e155d563b71')
								if (!creep.pos.isNearTo(lab))
									creep.moveTo(lab)
								else {
									lab.boostCreep(creep, 25)
									creep.memory.gotBoosted = true;
								}
							} else {
								const storage = Game.getObjectById('6530e110fb12195485fc0a2a');

								if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
									creep.moveTo(storage);
							}
						} else {
							if (!creep.pos.isNearTo(Game.flags.ClaimPoint1))
								creep.moveTo(Game.flags.ClaimPoint1, { visualizePathStyle: { stroke: '#00ff00', opacity: 0.3, lineStyle: 'undefined' } });
							else {
								creep.memory.waypointOneReached = true;
							}
						}
					}
				}
			} else {

				if (creep.pos.x == 49)
					creep.move(7);
				else if (creep.pos.x == 0)
					creep.move(3);
				else if (creep.pos.y == 49)
					creep.move(1);
				else if (creep.pos.y == 0)
					creep.move(5);
				else {
					if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
						creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#00ff00', opacity: 0.3, lineStyle: 'undefined'}});
					}
				}
			}
		} else {
			creep.say('AI Disabled');
		}
	}
}

const roleScout = {

	run: function (creep) {
		
		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		if (creep.memory.homeRoom === undefined)
			creep.memory.homeRoom = creep.room.name;
		if (creep.memory.scoutList === undefined)
			creep.memory.scoutList = [];
		if (creep.memory.compiledList === undefined)
			creep.memory.compiledList = false;
		
		if (!creep.memory.disableAI) {
			let scoutArray = [];
			
			for (let i = 0; i < Memory.colonies[creep.memory.homeRoom].exitRooms.length; i++) {
				const theRoom = Memory.colonies[creep.memory.homeRoom].exitRooms[i];
				//console.log('theRoom: ' + theRoom);
				scoutArray.push(theRoom);
				//console.log(scoutArray);
				//createRoomFlag(theRoom);
			}
			creep.memory.scoutList = scoutArray;
			creep.memory.compiledList = true;
			//console.log('scoutList: ' + creep.memory.scoutList);

			if (creep.memory.compiledList) {
				if (creep.memory.targetRoom === undefined)
					creep.memory.targetRoom = creep.memory.scoutList[0];
				
				if (creep.pos.x == 49)
					creep.move(7);
				else if (creep.pos.x == 0)
					creep.move(3);
				else if (creep.pos.y == 49)
					creep.move(1);
				else if (creep.pos.y == 0)
					creep.move(5);

				let goToPos = new RoomPosition(25, 25, creep.memory.targetRoom);
				if (creep.memory.scoutList.length > 0 && creep.room.name == creep.memory.targetRoom) {
					if (!creep.room.memory.objects) {
						console.log('SCOUT REPORT: Room [' + creep.room.name + '], caching objects...');
						creep.room.cacheObjects();
					}
					creep.memory.scoutList.shift();
					delete creep.memory.targetRoom;
					delete creep.memory._move;
				}
				else if (creep.room.name !== creep.memory.targetRoom)
					creep.moveTo(goToPos, { visualizePathStyle: { stroke: '#ff00ff', opacity: 0.5, lineStyle: 'undefined', ignoreCreeps: true } });
			}
		}
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
};
	
module.exports = roleScout;
module.exports = roleClaimer;
module.exports = roleReserver;
module.exports = roleRemoteGuard;
module.exports = roleRemoteRunner;
module.exports = roleRemoteBuilder;
module.exports = roleRemoteHarvester;