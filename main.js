
// require creep role modules
const roleHarvester = require('role.harvester');
const roleUpgrader 	= require('role.upgrader'	);
const roleBuilder 	= require('role.builder'	);
const roleCollector = require('role.collector');
const roleRepairer 	= require('role.repairer'	);
const roleReserver 	= require('role.reserver'	);
const roleRunner 		= require('role.runner'		);
const roleRebooter 	= require('role.rebooter'	);
const roleRanger 		= require('role.ranger'		);
const roleWarrior 	= require('role.warrior'	);
const roleHealer 		= require('role.healer'		);

// require other modules
require('roomDefense'		);
require('miscFunctions'	);

// require prototype extension modules
require('creepFunctions'					);
require('roomFunctions'						);
require('roomPositionFunctions'		);

// define pre-configured creep bodypart arrays as key/value pairs in an object
const spawnVariants = {
	'harvester300': [WORK, WORK, CARRY, MOVE],
	'harvester400':  [WORK, WORK, WORK, CARRY, MOVE],
	'harvester500':  [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
	'harvester1000':  [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE,
		MOVE],
	'collector300':  [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
	'collector500':  [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
	'collector800':  [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE,
		MOVE, MOVE, MOVE, MOVE],
	'collector1000':  [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE,
		MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
	'upgrader300':  [WORK, WORK, CARRY, MOVE],
	'upgrader500':  [WORK, WORK, WORK, WORK, CARRY, MOVE],
	'upgrader800':  [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
	'upgrader1000':  [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE,
		MOVE],
	'builder300':  [WORK, WORK, CARRY, MOVE],
	'builder500':  [WORK, WORK, WORK, WORK, CARRY, MOVE],
	'builder800':  [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
	'builder1000':  [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE,
		MOVE, MOVE],
	'repairer300':  [WORK, WORK, CARRY, MOVE],
	'repairer500':  [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
	'repairer800':  [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
	'repairer1000':  [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE,
		MOVE]
}

// define working variant set for use in the main loop, assigned based on current energy capacity limits
let availableVariants = {
	'harvester': [],
	'collector': [],
	'upgrader': [],
	'builder': [],
	'repairer': []
}

// declare creep counting integers for spawning purposes
let harvesterCount 	= 0;
let builderCount	 	= 0;
let upgraderCount 	= 0;
let collectorCount 	= 0;
let repairerCount 	= 0;
let runnerCount 		= 0;
let rebooterCount 	= 0;
let reserverCount 	= 0;
let rangerCount 		= 0;
let warriorCount 		= 0;
let healerCount 		= 0;

// declare other global variables
let tickCount = 0;
let newName = '';
let spawnAnnounce = false;

// main game loop function
module.exports.loop = function () {
	
	calcTickTime();

	for (let name in Memory.creeps) {
		if (!Game.creeps[name]) {
			delete Memory.creeps[name];
			console.log('Clearing nonexistent creep memory: ', name);
		}
	}

	// main code loop to run inside each room containing our units or structures
	_.forEach(Game.rooms, function (room) {
		
		// code to run if room contains a controller owned by us
		if (room && room.controller && room.controller.my) {
			
			// tower logic function
			roomDefense(room);

			// pull creep role caps from room memory, or set to default value if none are set
			let harvesterTarget = _.get(room.memory, ['targets', 'harvester'	], 2);
			let collectorTarget = _.get(room.memory, ['targets', 'collector'	], 2);
			let upgraderTarget 	= _.get(room.memory, ['targets', 'upgrader'		], 2);
			let builderTarget 	= _.get(room.memory, ['targets', 'builder'		], 2);
			let repairerTarget 	= _.get(room.memory, ['targets', 'repairer'		], 1);
			let runnerTarget 		= _.get(room.memory, ['targets', 'runner'			], 0);
			let rebooterTarget 	= _.get(room.memory, ['targets', 'rebooter'		], 0);
			let reserverTarget 	= _.get(room.memory, ['targets', 'reserver'		], 0);
			let rangerTarget 		= _.get(room.memory, ['targets', 'ranger'			], 1);
			let warriorTarget 	= _.get(room.memory, ['targets', 'warrior'		], 1);
			let healerTarget 		= _.get(room.memory, ['targets', 'healer'			], 1);

			// pull current amount of creeps alive by role
			let harvesters 	= _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester'	);
			let collectors 	= _.filter(Game.creeps, (creep) => creep.memory.role == 'collector'	);
			let upgraders 	= _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader'	);
			let builders 		= _.filter(Game.creeps, (creep) => creep.memory.role == 'builder'		);
			let repairers 	= _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer'	);
			let runners 		= _.filter(Game.creeps, (creep) => creep.memory.role == 'runner'		);
			let rebooters 	= _.filter(Game.creeps, (creep) => creep.memory.role == 'rebooter'	);
			let reservers 	= _.filter(Game.creeps, (creep) => creep.memory.role == 'reserver'	);
			let rangers 		= _.filter(Game.creeps, (creep) => creep.memory.role == 'ranger'		);
			let warriors 		= _.filter(Game.creeps, (creep) => creep.memory.role == 'warrior'		);
			let healers			= _.filter(Game.creeps, (creep) => creep.memory.role == 'healer'		);

			let sites = room.find(FIND_CONSTRUCTION_SITES);

			if (tickCount == 10) {
				console.log('H:' + harvesters.length + '(' + harvesterTarget + ') | C:' + collectors.length + '(' + collectorTarget + ') | U:' + upgraders.length + '(' + upgraderTarget + ')| B:' + builders.length + '(' + builderTarget + ') | Rp:' + repairers.length + '(' + repairerTarget + ') | Rn:' + runners.length + '(' + runnerTarget + ') | Rb:' + rebooters.length + '(' + rebooterTarget + ') | Rv:' + reservers.length + '(' + reserverTarget + ') || Rng:' + rangers.length + '(' + rangerTarget + ') | War:' + warriors.length + '(' + warriorTarget + ') | Hlr:' + healers.length + '(' + healerTarget + ' || Energy: ' + room.energyAvailable + '(' + room.energyCapacityAvailable + ')');
				tickCount = 0;
			}
			room.visual.text('H:' + harvesters.length + '(' + harvesterTarget + ') | C:' + collectors.length + '(' + collectorTarget + ') | U:' + upgraders.length + '(' + upgraderTarget + ')| B:' + builders.length + '(' + builderTarget + ') | Rp:' + repairers.length + '(' + repairerTarget + ') | Rn:' + runners.length + '(' + runnerTarget + ') | Rb:' + rebooters.length + '(' + rebooterTarget + ') | Rv:' + reservers.length + '(' + reserverTarget + ') || Rng:' + rangers.length + '(' + rangerTarget + ') | War:' + warriors.length + '(' + warriorTarget + ') | Hlr:' + healers.length + '(' + healerTarget + ' || Energy: ' + room.energyAvailable + '(' + room.energyCapacityAvailable + ')', 49, 49, { align: 'right' })
			
			if (room.energyCapacityAvailable < 500) {
				availableVariants.harvester = spawnVariants.harvester300;
				availableVariants.collector = spawnVariants.collector300;
				availableVariants.upgrader = spawnVariants.upgrader300;
				availableVariants.builder = spawnVariants.builder300;
				availableVariants.repairer = spawnVariants.repairer300;
			} else if (room.energyCapacityAvailable < 800) {
				availableVariants.harvester = spawnVariants.harvester500;
				availableVariants.collector = spawnVariants.collector500;
				availableVariants.upgrader = spawnVariants.upgrader500;
				availableVariants.builder = spawnVariants.builder500;
				availableVariants.repairer = spawnVariants.repairer500;
			} else if (room.energyCapacityAvailable < 1000) {
				availableVariants.harvester = spawnVariants.harvester800;
				availableVariants.collector = spawnVariants.collector800;
				availableVariants.upgrader = spawnVariants.upgrader800;
				availableVariants.builder = spawnVariants.builder800;
				availableVariants.repairer = spawnVariants.repairer800;
			} else if (room.energyCapacityAvailable >= 1000) {
				availableVariants.harvester = spawnVariants.harvester1000;
				availableVariants.collector = spawnVariants.collector1000;
				availableVariants.upgrader = spawnVariants.upgrader1000;
				availableVariants.builder = spawnVariants.builder1000;
				availableVariants.repairer = spawnVariants.repairer1000;
			}

			if (harvesters.length < harvesterTarget) {
				newName = 'H' + (harvesters.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep(availableVariants.harvester, newName, { memory: { role: 'harvester' } }) == ERR_NAME_EXISTS) {
					newName = 'H' + (harvesters.length + 1 + harvesterCount);
					harvesterCount++;
				}
			} else if (collectors.length < collectorTarget) {
				newName = 'C' + (collectors.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep(availableVariants.collector, newName, { memory: { role: 'collector' } }) == ERR_NAME_EXISTS) {
					newName = 'C' + (collectors.length + 1 + collectorCount);
					collectorCount++;
				}
			} else if (upgraders.length < upgraderTarget) {
				newName = 'U' + (upgraders.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep(availableVariants.upgrader, newName, { memory: { role: 'upgrader' } }) == ERR_NAME_EXISTS) {
					newName = 'U' + (upgraders.length + 1 + upgraderCount);
					upgraderCount++;
				}
			} else if (sites.length > 0 && builders.length < builderTarget) {
				newName = 'B' + (builders.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep(availableVariants.builder, newName, { memory: { role: 'builder' } }) == ERR_NAME_EXISTS) {
					newName = 'B' + (builders.length + 1 + builderCount);
					builderCount++;
				}
			} else if (repairers.length < repairerTarget) {
				newName = 'Rp' + (repairers.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep(availableVariants.repairer, newName, { memory: { role: 'repairer' } }) == ERR_NAME_EXISTS) {
					newName = 'Rp' + (repairers.length + 1 + repairerCount);
					repairerCount++;
				}
			} else if (rangers.length < rangerTarget) {
				newName = 'R' + (rangers.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE], newName, { memory: { role: 'ranger' } }) == ERR_NAME_EXISTS) {
					newName = 'R' + (rangers.length + 1 + rangerCount);
					rangerCount++;
				}
			} else if (warriors.length < warriorTarget) {
				newName = 'W' + (warriors.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE], newName, { memory: { role: 'warrior' } }) == ERR_NAME_EXISTS) {
					newName = 'W' + (warriors.length + 1 + warriorCount);
					warriorCount++;
				}
			} else if (runners.length < runnerTarget) {
				newName = 'Rn' + (runners.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY], newName, { memory: { role: 'runner' } }) == ERR_NAME_EXISTS) {
					newName = 'Rn' + (runners.length + 1 + runnerCount);
					runnerCount++;
				}
			} else if (Memory.creeps.length == 0 && rebooters.length < 1) {
				newName = 'Rb' + (rebooters.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep([WORK, WORK, MOVE, CARRY], newName, { memory: { role: 'rebooter' } }) == ERR_NAME_EXISTS) {
					newName = 'Rb' + (rebooters.length + 1 + rebooterCount);
					rebooterCount++;
				}
			}
		}
	});
	
		if (Game.spawns['Spawn1'].spawning) {
			
			let spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
			if (!spawnAnnounce) {
				console.log('Spawning new creep: ' + spawningCreep.memory.role + ' (' + spawningCreep.name + ')');
				spawnAnnounce = true;
			}
			Game.spawns['Spawn1'].room.visual.text(
				spawningCreep.memory.role + ' - ' + Game.spawns['Spawn1'].spawning.remainingTime + '/' + Game.spawns['Spawn1'].spawning.needTime,
				Game.spawns['Spawn1'].pos.x + 1,
				Game.spawns['Spawn1'].pos.y,
				{ align: 'left', opacity: 0.8, font: 0.4 });
		} else {
			spawnAnnounce = false;
		}
	
	for(let name in Game.creeps) {
		let creep = Game.creeps[name];

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
			case 'healer':
				roleHealer.run(creep);
				break;
		}
	
		Game.spawns['Spawn1'].room.controller.room.visual.text('L' + Game.spawns['Spawn1'].room.controller.level + ' - ' + Game.spawns['Spawn1'].room.controller.progress + '/' + Game.spawns['Spawn1'].room.controller.progressTotal, Game.spawns['Spawn1'].room.controller.pos.x + 1, Game.spawns['Spawn1'].room.controller.pos.y - 1, {align: 'left', opacity: 0.5, color: '#00ffff', font: 0.4} )
		Game.spawns['Spawn1'].room.visual.text(
				'Energy: ' + Game.spawns['Spawn1'].room.energyAvailable + '/' + Game.spawns['Spawn1'].room.energyCapacityAvailable,
				Game.spawns['Spawn1'].pos.x + 1,
				Game.spawns['Spawn1'].pos.y - 1,
				{ align: 'left', opacity: 0.5, color: '#aa5500', font: 0.4 });
		
	}

	tickCount++;
}

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