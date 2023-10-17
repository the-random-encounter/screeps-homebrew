const roleRebooter = require('role.rebooter');
const roleHarvester = require('role.harvester');
const roleUpgrader 	= require('role.upgrader'	);
const roleBuilder 	= require('role.builder'	);
const roleCollector = require('role.collector');
const roleRanger 		= require('role.ranger'		);
const roleWarrior 	= require('role.warrior'	);
const roleRepairer 	= require('role.repairer'	);
const roleReserver = require('role.reserver');
const roleRunner = require('role.runner');

require('calculateTickTimeInGame');

const creepFunctions 				= require('creepFunctions'				);
const roomPositionFunctions = require('roomPositionFunctions'	);
const roomDefense 					= require('roomDefense'						);
const randomName 						= require('miscFunctions'					);

let harvesterCount 	= 1;
let builderCount	 	= 1;
let upgraderCount 	= 1;
let collectorCount 	= 1;
let rangerCount 		= 1;
let warriorCount 		= 1;
let repairerCount = 1;
let runnerCount = 1;
let tickCount = 0;
let newName 				= '';

function getBody(segment, room) {
	let body = [];

	// How much each segment costs
	let segmentCost = _.sum(segment, s => BODYPART_COST[s]);

	// how much energy we can use total
	let energyAvailable = room.energyCapacityAvailable;

	// how many times we can include the segment with room energy
	let maxSegments = Math.floor(energyAvailable / segmentCost);

	// push the segment multiple times
	_.times(maxSegments, function () {
		_.forEach(segment, s => body.push(s));
	});

	return body;
}

module.exports.loop = function () {
	
	calcTickTime();
	
	for (var name in Memory.creeps) {
		if (!Game.creeps[name]) {
			delete Memory.creeps[name];
			console.log('Clearing nonexistent creep memory: ', name);
		}
	}

	_.forEach(Game.rooms, function (room) {
		//let room = Game.rooms[roomName];
		if (room && room.controller && room.controller.my) {
			
			roomDefense(room);

			//getBody([WORK, CARRY, MOVE], room);

			let harvesterTarget = _.get(room.memory, ['targets', 'harvester'], 2);
			let collectorTarget = _.get(room.memory, ['targets', 'collector'], 2);
			let upgraderTarget = _.get(room.memory, ['targets', 'upgrader'], 2);
			let builderTarget = _.get(room.memory, ['targets', 'builder'], 2);
			let rangerTarget = _.get(room.memory, ['targets', 'ranger'], 1);
			let warriorTarget = _.get(room.memory, ['targets', 'warrior'], 1);
			let repairerTarget = _.get(room.memory, ['targets', 'repairer'], 1);
			let runnerTarget = _.get(room.memory, ['targets', 'runner'], 0);

			var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
			var collectors = _.filter(Game.creeps, (creep) => creep.memory.role == 'collector');
			var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
			var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
			var rangers = _.filter(Game.creeps, (creep) => creep.memory.role == 'ranger');
			var warriors = _.filter(Game.creeps, (creep) => creep.memory.role == 'warrior');
			var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
			var runners = _.filter(Game.creeps, (creep) => creep.memory.role == 'runner');

			var sites = room.find(FIND_CONSTRUCTION_SITES);

			if (tickCount == 10) {
				console.log('H:' + harvesters.length + '(' + harvesterTarget + ') | C:' + collectors.length + '(' + collectorTarget + ') | U:' + upgraders.length + '(' + upgraderTarget + ')| B:' + builders.length + '(' + builderTarget + ') | Rp:' + repairers.length + '(' + repairerTarget + ') | R:' + rangers.length + '(' + rangerTarget + ') | W:' + warriors.length + '(' + warriorTarget + ') || Energy: ' + room.energyAvailable + '(' + room.energyCapacityAvailable + ')');
				tickCount = 0;
			}
			room.visual.text('H:' + harvesters.length + '(' + harvesterTarget + ') | C:' + collectors.length + '(' + collectorTarget + ') | U:' + upgraders.length + '(' + upgraderTarget + ')| B:' + builders.length + '(' + builderTarget + ') | Rp:' + repairers.length + '(' + repairerTarget + ') | R:' + rangers.length + '(' + rangerTarget + ') | W:' + warriors.length + '(' + warriorTarget + ') || Energy: ' + room.energyAvailable + '(' + room.energyCapacityAvailable + ')', 49, 49, { align: 'right' })
			
			if (harvesters.length < harvesterTarget) {
				//let nearDeadHarvesters = _.filter(harvesters, (creep) => creep.ticksToLive < 60)
				//console.log('nearDeadHarvesters: ' + nearDeadHarvesters);
				//if (nearDeadHarvesters) {
				newName = 'H' + (harvesters.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY, MOVE], newName, { memory: { role: 'harvester' } }) == ERR_NAME_EXISTS) {
					newName = 'H' + (harvesters.length + 1 + harvesterCount);
					harvesterCount++;
				}
			} else if (collectors.length < collectorTarget) {
				newName = 'C' + (collectors.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep(getBody([CARRY,MOVE], room), newName, { memory: { role: 'collector' } }) == ERR_NAME_EXISTS) {
					newName = 'C' + (collectors.length + 1 + collectorCount);
					collectorCount++;
				}
			} else if (upgraders.length < upgraderTarget) {
				newName = 'U' + (upgraders.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep(getBody([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], room), newName, { memory: { role: 'upgrader' } }) == ERR_NAME_EXISTS) {
					newName = 'U' + (upgraders.length + 1 + upgraderCount);
					upgraderCount++;
				}
			} else if (sites.length > 0 && builders.length < builderTarget) {
				newName = 'B' + (builders.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep(getBody([WORK, CARRY, MOVE], room), newName, { memory: { role: 'builder' } }) == ERR_NAME_EXISTS) {
					newName = 'B' + (builders.length + 1 + builderCount);
					builderCount++;
				}
			} else if (repairers.length < repairerTarget) {
				newName = 'Rp' + (repairers.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep(getBody([WORK, CARRY, MOVE], room), newName, { memory: { role: 'repairer' } }) == ERR_NAME_EXISTS) {
					newName = 'Rp' + (repairers.length + 1 + repairerCount);
					repairerCount++;
				}
			} else if (rangers.length < rangerTarget) {
				newName = 'R' + (rangers.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, MOVE], newName, { memory: { role: 'ranger' } }) == ERR_NAME_EXISTS) {
					newName = 'R' + (rangers.length + 1 + rangerCount);
					rangerCount++;
				}
			} else if (warriors.length < warriorTarget) {
				newName = 'W' + (warriors.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE], newName, { memory: { role: 'warrior' } }) == ERR_NAME_EXISTS) {
					newName = 'W' + (warriors.length + 1 + warriorCount);
					warriorCount++;
				}
			} else if (runners.length < runnerTarget) {
				newName = 'Rn' + (runners.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY], newName, { memory: { role: 'runner' } }) == ERR_NAME_EXISTS) {
					newName = 'Rn' + (runners.length + 1 + runnerCount);
				}
			}
		}
	});
	
		if (Game.spawns['Spawn1'].spawning) {
			var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
			console.log('Spawning new creep: ' + newName);
			Game.spawns['Spawn1'].room.visual.text(
				spawningCreep.memory.role,
				Game.spawns['Spawn1'].pos.x + 1,
				Game.spawns['Spawn1'].pos.y,
				{ align: 'left', opacity: 0.8 });
		}

	for(var name in Game.creeps) {
		var creep = Game.creeps[name];

		switch (creep.memory.role) {
			case 'reserver':
				roleReserver.run(creep);
				break;
			case 'rebooter':
				roleRebooter.run(creep);
				break;
			case 'harvester':
				roleHarvester.run(creep);
				break;
			case 'upgrader':
				roleUpgrader.run(creep);
				break;
			case 'builder':
				roleBuilder.run(creep);
				break;
			case 'collector':
				roleCollector.run(creep);
				break;
			case 'repairer':
				roleRepairer.run(creep);
				break;
			case 'ranger':
				roleRanger.run(creep);
				break;
			case 'warrior':
				roleWarrior.run(creep);
				break;
			case 'runner':
				roleRunner.run(creep);
				break;
		}
	
		
	}

	tickCount++;
}