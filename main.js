const roleHarvester = require('role.harvester');
const roleUpgrader 	= require('role.upgrader'	);
const roleBuilder 	= require('role.builder'	);
const roleCollector = require('role.collector');
const roleRanger 		= require('role.ranger'		);
const roleWarrior 	= require('role.warrior'	);
const roleRepairer 	= require('role.repairer'	);
//const roleOldHarvester = require('role.harvester');

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
let repairerCount 	= 1;

var newName = '';

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

<<<<<<< Updated upstream
	let dailyHarv = 0;
	let dailyUpgr = 0;
	let dailyBuil = 0;
	let dailyMine = 0;
	let dailyColl = 0;

=======
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
			let builderTarget 	= _.get(room.memory, ['census', 'builder'		], 2);
			let collectorTarget = _.get(room.memory, ['census', 'collector'	], 2);
			let harvesterTarget = _.get(room.memory, ['census', 'harvester'	], 2);
			let minerTarget 		= _.get(room.memory, ['census', 'miner'			], 2);
			let upgraderTarget 	= _.get(room.memory, ['census', 'upgrader'	], 2);
=======
			getBody([WORK, CARRY, MOVE], room);
>>>>>>> Stashed changes

			let harvesterTarget = _.get(room.memory, ['targets', 'harvester'], 2);
			let collectorTarget = _.get(room.memory, ['targets', 'collector'], 2);
			let upgraderTarget 	= _.get(room.memory, ['targets', 'upgrader'	], 2);
			let builderTarget 	= _.get(room.memory, ['targets', 'builder'	], 2);
			let rangerTarget		= _.get(room.memory, ['targets', 'ranger'		], 2);
			let warriorTarget 	= _.get(room.memory, ['targets', 'warrior'	], 2);
			let repairerTarget 	= _.get(room.memory, ['targets', 'repairer'	], 2);

			var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
			var collectors = _.filter(Game.creeps, (creep) => creep.memory.role == 'collector');
			var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
			var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
			var rangers = _.filter(Game.creeps, (creep) => creep.memory.role == 'ranger');
			var warriors = _.filter(Game.creeps, (creep) => creep.memory.role == 'warrior');
			var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
			var sites = room.find(FIND_CONSTRUCTION_SITES);

			console.log('H:' + harvesters.length + '(' + harvesterTarget + ') | C:' + collectors.length + '(' + collectorTarget + ') | U:' + upgraders.length + '(' + upgraderTarget + ')| B:' + builders.length + '(' + builderTarget + ') | Rp:' + repairers.length + '(' + repairerTarget + ') | R:' + rangers.length + '(' + rangerTarget + ') | W:' + warriors.length + '(' + warriorTarget + ') || Energy: ' + room.energyAvailable + '(' + room.energyCapacityAvailable + ')');

			if (harvesters.length < harvesterTarget) {
				newName = 'H' + (harvesters.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, CARRY, MOVE], newName, { memory: { role: 'harvester' } }) == ERR_NAME_EXISTS) {
					newName = 'H' + (harvesters.length + 1 + harvesterCount);
					harvesterCount++;
				}
				if (Game.spawns['Spawn1'].spawning) {
					console.log('Spawning new Harvester: ' + newName);
				}
			} else if (collectors.length < collectorTarget) {
				newName = 'C' + (collectors.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep(getBody([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], room), newName, { memory: { role: 'collector' } }) == ERR_NAME_EXISTS) {
					newName = 'C' + (collectors.length + 1 + collectorCount);
					collectorCount++;
				}
				if (Game.spawns['Spawn1'].spawning) {
					console.log('Spawning new Collector: ' + newName);
				}
			} else if (upgraders.length < upgraderTarget) {
				newName = 'U' + (upgraders.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep(getBody([WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE], room), newName, { memory: { role: 'upgrader' } }) == ERR_NAME_EXISTS) {
					newName = 'U' + (upgraders.length + 1 + upgraderCount);
					upgraderCount++;
				}
				if (Game.spawns['Spawn1'].spawning) {
					console.log('Spawning new Upgrader: ' + newName);
				}
			} else if (sites.length > 0 && builders.length < builderTarget) {
				newName = 'B' + (builders.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep(getBody([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], room), newName, { memory: { role: 'builder' } }) == ERR_NAME_EXISTS) {
					newName = 'B' + (builders.length + 1 + builderCount);
					builderCount++;
				}
				if (Game.spawns['Spawn1'].spawning) {
					console.log('Spawning new Builder: ' + newName);
				}
			} else if (repairers.length < repairerTarget) {
				newName = 'Rp' + (repairers.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep(getBody([WORK, MOVE, CARRY], room), newName, { memory: { role: 'repairer' } }) == ERR_NAME_EXISTS) {
					newName = 'Rp' + (repairers.length + 1 + reparierCount);
					repairerCount++;
				}
				if (Game.spawns['Spawn1'].spawning) {
					console.log('Spawning new Repairer: ' + newName);
				}
			} else if (rangers.length < rangerTarget) {
				newName = 'R' + (rangers.length + 1);
				Game.spawns['Spawn1'].spawnCreep(getBody([RANGED_ATTACK, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE], room), newName, { memory: { role: 'ranger' } });
				rangerCount++;
				if (Game.spawns['Spawn1'].spawning) {
					console.log('Spawning new Ranger: ' + newName);
				}
			} else if (warriors.length < warriorTarget) {
				newName = 'W' + (warriors.length + 1);
				Game.spawns['Spawn1'].spawnCreep(getBody([ATTACK, TOUGH, TOUGH, MOVE], room), newName, { memory: { role: 'warrior' } });
				warriorCount++;
				if (Game.spawns['Spawn1'].spawning) {
					console.log('Spawning new Warrior: ' + newName);
				}
			}
		}
	});

<<<<<<< Updated upstream
			if (miners.length < minerTarget) {
				var newName = '🚧 Miner #' + dailyMine;
				console.log('Spawning new miner: ' + newName);
				Game.spawns['HomeSpawn'].spawnCreep(
						[WORK, WORK, MOVE], newName, {memory: {role: 'miner'}});
			}
			//#endregion
			//#region upgraders	
			var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
			console.log('Upgraders: ' + upgraders.length);
			dailyUpgr++;
		
			if (upgraders.length < upgraderTarget) {
				var newName = '🚀 Upgrader #' + dailyUpgr;
				console.log('Spawning new upgrader: ' + newName);
				Game.spawns['HomeSpawn'].spawnCreep(
						[WORK, CARRY, MOVE], newName, {memory: {role: 'upgrader'}});
			}
			//#endregion
=======

		if (Game.spawns['Spawn1'].spawning) {
			var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
			//console.log('Spawning new ' + Game.spawns['Spawn1'].spawning.creep.memory.role + ': ' + newName);
			Game.spawns['Spawn1'].room.visual.text(
				spawningCreep.memory.role,
				Game.spawns['Spawn1'].pos.x + 1,
				Game.spawns['Spawn1'].pos.y,
				{ align: 'left', opacity: 0.8 });
>>>>>>> Stashed changes
		}

	for(var name in Game.creeps) {
		var creep = Game.creeps[name];

		switch (creep.memory.role) {
			case 'harvester':
				roleHarvester.run(creep);
				break;
			/*case 'oldharvester':
				roleOldHarvester.run(creep);
				break;*/
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
		}
			
	}
}