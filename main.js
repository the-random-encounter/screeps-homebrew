
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
const roleHealer 		= require('role.healer');
const roleCrane 		= require('role.crane');

const roleRemoteHarvester = require('role.remoteHarvester');
const roleRemoteRunner 		= require('role.remoteRunner');
const roleRemoteBuilder 	= require('role.remoteBuilder');
const roleRemoteGuard 		= require('role.remoteGuard');

// require other modules
require('roomDefense'		);
require('miscFunctions'	);

// require prototype extension modules
require('creepFunctions'					);
require('roomFunctions'						);
require('roomPositionFunctions'		);

// define heap memory for use on various things and stuff
global.HEAP_MEMORY = {
	'TOWER_DATA': {
		'652e4025c40f9d0858e95789': {
			'maxDistance': 15
		}
	}
};

global.manualCmdQueue = [];

// define pre-configured creep bodypart arrays as key/value pairs in an object
const spawnVariants = {
	'harvester300':  	[	WORK, WORK,	 CARRY, MOVE],
	'harvester400':  	[	WORK, WORK,		WORK, CARRY, MOVE],
	'harvester500': 	[	WORK, WORK,		WORK, CARRY, CARRY, MOVE, MOVE],
	'harvester800': 	[	WORK, WORK,		WORK,		WORK, WORK, WORK, CARRY, CARRY, MOVE],
	'harvester1000': 	[	WORK, WORK,		WORK,		WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
	'collector300':  	[CARRY, CARRY, CARRY, 	MOVE, MOVE],
	'collector500':  	[CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
	'collector800':  	[CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
	'collector1000': 	[CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE,MOVE, MOVE, MOVE],
	'upgrader300':	 	[WORK, WORK, CARRY, MOVE],
	'upgrader500':   	[WORK, WORK, WORK, WORK, CARRY, MOVE],
	'upgrader800':   	[WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
	'upgrader1000':  	[WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE,
		MOVE],
	'builder300':  	 	[WORK, WORK, CARRY, MOVE],
	'builder500':  	 	[WORK, WORK, WORK, WORK, CARRY, MOVE],
	'builder800':  	 	[WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
	'builder1000':   	[WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE,MOVE, MOVE],
	'repairer300':   	[WORK, WORK, CARRY, MOVE],
	'repairer500':   [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
	'repairer800':   [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
	'repairer1000':  [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE,
		MOVE],
	'repairer1300': [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
	'runner300': [MOVE, MOVE, CARRY, CARRY, CARRY, CARRY],
	'runner500': [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY],
	'runner800': [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]
}

// define working variant set for use in the main loop, assigned based on current energy capacity limits
let availableVariants = {
	'harvester': [],
	'collector': [],
	'upgrader': [],
	'builder': [],
	'repairer': [],
	'runner': [],
	'remoteGuard': [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
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
let craneCount 			= 0;

let remoteHarvesterCount 	= 0;
let remoteRunnerCount 		= 0;
let remoteBuilderCount 		= 0;
let remoteGuardCount 			= 0;

// declare other global variables
let tickCount = 0;
let newName 	= '';
let spawnAnnounce 				= false;
let harvesterDying 				= false;
let remoteHarvesterDying 	= false;
let reserverDying 				= false;
let collectorDying 				= false;
let remoteGuardDying 			= false;

// main game loop function
module.exports.loop = function () {

	if (manualCmdQueue.length)
		manualCmdQueue.shift()();

	calcTickTime();

	// remove creeps from memory who no longer exist
	for (let name in Memory.creeps) {
		if (!Game.creeps[name]) {
			const role = Memory.creeps[name].role;
			delete Memory.creeps[name];
			console.log('Clearing nonexistent creep memory: ', name);
			// reset naming counter for type of creep that died
			switch (role) {
				case 'harvester':
					harvesterCount = 0;
					break;
				case 'collector':
					collectorCount = 0;
					break;
				case 'upgrader':
					upgraderCount = 0;
					break;
				case 'builder':
					builderCount = 0;
					break;
				case 'runner':
					runnerCount = 0;
					break;
				case 'repairer':
					repairerCount = 0;
					break;
				case 'crane':
					craneCount = 0;
					break;
				case 'ranger':
					rangerCount = 0;
					break;
				case 'warrior':
					warriorCount = 0;
					break;
				case 'healer':
					healerCount = 0;
					break;
				case 'reserver':
					reserverCount = 0;
					break;
				case 'rebooter':
					rebooterCount = 0;
					break;
				case 'remoteharvester':
					remoteHarvesterCount = 0;
					break;
				case 'remoterunner':
					remoteRunnerCount = 0;
					break;
				case 'remotebuilder':
					remoteBuilderCount = 0;
					break;
			}
		}
	}
	
	// main code loop to run inside each room containing our units or structures
	_.forEach(Game.rooms, function (room) {
		
		// code to run if room contains a controller owned by us
		if (room && room.controller && room.controller.my) {
			
			// tower logic function
			roomDefense(room);

			// declare links
			const linkToLocal 	= Game.getObjectById(room.memory.objects.links[0]);
			const linkFromLocal = Game.getObjectById(room.memory.objects.links[1]);
			
			if (linkFromLocal.store[RESOURCE_ENERGY] > 400) { ;
				if (linkFromLocal.cooldown == 0) {
					console.log('[' + room.name + ']: Link transferring energy.');
					linkFromLocal.transferEnergy(linkToLocal);
				}
			} 
			
			/* #region  SPAWNING QUOTA & CURRENT SPAWN COUNT DECLARATIONS  */
			// pull creep role caps from room memory, or set to default value if none are set
			let harvesterTarget = _.get(room.memory, ['targets', 'harvester'], 2);
			let collectorTarget = _.get(room.memory, ['targets', 'collector'], 2);
			let upgraderTarget 	= _.get(room.memory, ['targets', 'upgrader'	], 2);
			let builderTarget 	= _.get(room.memory, ['targets', 'builder'	], 2);
			let repairerTarget 	= _.get(room.memory, ['targets', 'repairer'	], 1);
			let runnerTarget 		= _.get(room.memory, ['targets', 'runner'		], 0);
			let rebooterTarget 	= _.get(room.memory, ['targets', 'rebooter'	], 0);
			let reserverTarget 	= _.get(room.memory, ['targets', 'reserver'	], 0);
			let rangerTarget 		= _.get(room.memory, ['targets', 'ranger'		], 1);
			let warriorTarget 	= _.get(room.memory, ['targets', 'warrior'	], 1);
			let healerTarget 		= _.get(room.memory, ['targets', 'healer'		], 1);
			let craneTarget 		= _.get(room.memory, ['targets', 'crane'		], 1);

			let remoteHarvesterTarget = _.get(room.memory, ['targets', 'remoteharvester'], 1);
			let remoteRunnerTarget 		= _.get(room.memory, ['targets', 'remoterunner'		], 1);
			let remoteBuilderTarget 	= _.get(room.memory, ['targets', 'remotebuilder'	], 1);
			let remoteGuardTarget			= _.get(room.memory, ['targets', 'remoteguard'		], 1);

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
			let healers 		= _.filter(Game.creeps, (creep) => creep.memory.role == 'healer'		);
			let cranes 			= _.filter(Game.creeps, (creep) => creep.memory.role == 'crane'			);

			let remoteHarvesters 	= _.filter(Game.creeps, (creep) => creep.memory.role == 'remoteharvester'	);
			let remoteRunners 		= _.filter(Game.creeps, (creep) => creep.memory.role == 'remoterunner'		);
			let remoteBuilders 		= _.filter(Game.creeps, (creep) => creep.memory.role == 'remotebuilder'		);
			let remoteGuards 			= _.filter(Game.creeps, (creep) => creep.memory.role == 'remoteguard'			);

			let sites = room.find(FIND_CONSTRUCTION_SITES);
			//let westSites = Game.rooms.E57S51.find(FIND_CONSTRUCTION_SITES);
			/* #endregion */

			if (room.find(FIND_HOSTILE_CREEPS).length) {
				collectors[0].memory.invaderLooter = true;
				console.log(collectors[0] + ' is now the invader looter');
			}
			
			/* #region  CONSOLE LOG - SPAWN INFO */
			if (tickCount == 10) {
				console.log('H:' + harvesters.length + '(' + harvesterTarget + ') | C:' + collectors.length + '(' + collectorTarget + ') | U:' + upgraders.length + '(' + upgraderTarget + ')| B:' + builders.length + '(' + builderTarget + ') | Rn:' + runners.length + '(' + runnerTarget + ') | Rp:' + repairers.length + '(' + repairerTarget + ') | Cn:' + cranes.length + '(' + craneTarget + ') | Rb:' + rebooters.length + '(' + rebooterTarget + ') | Rv:' + reservers.length + '(' + reserverTarget + ') || Rng:' + rangers.length + '(' + rangerTarget + ') | War:' + warriors.length + '(' + warriorTarget + ') | Hlr:' + healers.length + '(' + healerTarget + ') || RH:' + remoteHarvesters.length + '(' + remoteHarvesterTarget + ') | RR:' + remoteRunners.length + '(' + remoteRunnerTarget + ') | RB:' + remoteBuilders.length + '(' + remoteBuilderTarget + ') || Energy: ' + room.energyAvailable + '(' + room.energyCapacityAvailable + ')');
				tickCount = 0;
			}
			/* #endregion */
	
			/* #region  ROOM VISUAL - SPAWN INFO */
			room.visual.text('H:' + harvesters.length + '(' + harvesterTarget + ') | C:' + collectors.length + '(' + collectorTarget + ') | U:' + upgraders.length + '(' + upgraderTarget + ') | B:' + builders.length + '(' + builderTarget + ') | Cn:' + cranes.length + '(' + craneTarget + ')', 49, 45, { align: 'right' })
			room.visual.text('Rn:' + runners.length + '(' + runnerTarget + ') | Rp:' + repairers.length + '(' + repairerTarget + ') | Rb:' + rebooters.length + '(' + rebooterTarget + ') | Rv:' + reservers.length + '(' + reserverTarget + ')', 49, 46, { align: 'right' })
			room.visual.text('Rng:' + rangers.length + '(' + rangerTarget + ') | War:' + warriors.length + '(' + warriorTarget + ') | Hlr:' + healers.length + '(' + healerTarget + ')', 49, 47, { align: 'right' })
			room.visual.text('RH:' + remoteHarvesters.length + '(' + remoteHarvesterTarget + ') | RR:' + remoteRunners.length + '(' + remoteRunnerTarget + ') | RB:' + remoteBuilders.length + '(' + remoteBuilderTarget + ')', 49, 48, { align: 'right' })
			room.visual.text('Energy: ' + room.energyAvailable + '(' + room.energyCapacityAvailable + ')', 49, 49, { align: 'right' });

			room.visual.text('H:' + harvesters.length + '(' + harvesterTarget + ') | C:' + collectors.length + '(' + collectorTarget + ') | U:' + upgraders.length + '(' + upgraderTarget + ') | B:' + builders.length + '(' + builderTarget + ') | Cn:' + cranes.length + '(' + craneTarget + ')', 49, 1, { align: 'right' })
			room.visual.text('Rn:' + runners.length + '(' + runnerTarget + ') | Rp:' + repairers.length + '(' + repairerTarget + ') | Rb:' + rebooters.length + '(' + rebooterTarget + ') | Rv:' + reservers.length + '(' + reserverTarget + ')', 49, 0, { align: 'right' })
			room.visual.text('Rng:' + rangers.length + '(' + rangerTarget + ') | War:' + warriors.length + '(' + warriorTarget + ') | Hlr:' + healers.length + '(' + healerTarget + ')', 49, 2, { align: 'right' })
			room.visual.text('RH:' + remoteHarvesters.length + '(' + remoteHarvesterTarget + ') | RR:' + remoteRunners.length + '(' + remoteRunnerTarget + ') | RB:' + remoteBuilders.length + '(' + remoteBuilderTarget + ')', 49, 3, { align: 'right' })
			room.visual.text('Energy: ' + room.energyAvailable + '(' + room.energyCapacityAvailable + ')', 49, 4, { align: 'right' });
			/* #endregion */


			let creepCount = Object.keys(Memory.creeps);
			let capacity;
			if (creepCount.length <= 2) {
				capacity = room.energyAvailable;
				room.memory.flags.runnerLogic = false;
			}
			else {
				capacity = room.energyCapacityAvailable;
				room.memory.flags.runnerLogic = true;
			}

			/* #region  AVAILABLE VARIANTS ASSIGNMENTS */		
			if (room.energyCapacityAvailable < 500) {
				availableVariants.harvester = spawnVariants.harvester300;
				availableVariants.collector = spawnVariants.collector300;
				availableVariants.upgrader = spawnVariants.upgrader300;
				availableVariants.builder = spawnVariants.builder300;
				availableVariants.repairer = spawnVariants.repairer300;
				availableVariants.runner = spawnVariants.runner300;
			} else if (room.energyCapacityAvailable < 800) {
				availableVariants.harvester = spawnVariants.harvester500;
				availableVariants.collector = spawnVariants.collector500;
				availableVariants.upgrader = spawnVariants.upgrader500;
				availableVariants.builder = spawnVariants.builder500;
				availableVariants.repairer = spawnVariants.repairer500;
				availableVariants.runner = spawnVariants.runner300;
			} else if (room.energyCapacityAvailable < 1000) {
				availableVariants.harvester = spawnVariants.harvester800;
				availableVariants.collector = spawnVariants.collector500;
				availableVariants.upgrader = spawnVariants.upgrader800;
				availableVariants.builder = spawnVariants.builder800;
				availableVariants.repairer = spawnVariants.repairer800;
				availableVariants.runner = spawnVariants.runner300;
			} else if (room.energyCapacityAvailable < 1300) {
				availableVariants.harvester = spawnVariants.harvester800;
				availableVariants.collector = spawnVariants.collector500;
				availableVariants.upgrader = spawnVariants.upgrader800;
				availableVariants.builder = spawnVariants.builder1000;
				availableVariants.repairer = spawnVariants.repairer1000;
				availableVariants.runner = spawnVariants.runner300;
			} else if (room.energyCapacityAvailable >= 1300) {
				availableVariants.harvester = spawnVariants.harvester800;
				availableVariants.collector = spawnVariants.collector500;
				availableVariants.upgrader = spawnVariants.upgrader800;
				availableVariants.builder = spawnVariants.builder1000;
				availableVariants.repairer = spawnVariants.repairer1300;
				availableVariants.runner = spawnVariants.runner300;
			}
			/* #endregion */

			if (!collectors.length) {
				if (room.energyAvailable <= 1000) {
					availableVariants.collector = spawnVariants.collector1000;
				} else if (room.energyAvailable <= 800) {
					availableVariants.collector = spawnVariants.collector800;
				} else if (room.energyAvailable <= 500) {
					availableVariants.collector = spawnVariants.collector500;
				} else if (room.energyAvailable <= 300) {
					availableVariants.collector = spawnVariants.collector300;
				}
			}

			/* #region  LOGIC TO ALLOW FOR PRE-SPAWNING HARVESTERS/REMOTE HARVESTERS/RESERVERS */
			
			for (i = 0; i < harvesters.length; i++) {
				harvesterDying = false;
				if (harvesters[i].ticksToLive <= 50) {
					harvesterDying = true;
					break;
				}
			}

			for (i = 0; i < reservers.length; i++) {
				reserverDying = false;
				if (reservers[i].ticksToLive <= 90) {
					reserverDying = true;
					break;
				}
			}

			for (i = 0; i < remoteHarvesters.length; i++) {
				remoteHarvesterDying = false;
				if (remoteHarvesters[i].ticksToLive <= 110) {
					remoteHarvesterDying = true;
					break;
				}
			}

			for (i = 0; i < collectors.length; i++) {
				collectorDying = false;
				if (collectors[i].ticksToLive <= 30) {
					collectorDying = true;
					break;
				}
			}

			for (i = 0; i < remoteGuards.length; i++) {
				remoteGuardDying = false;
				if (remoteGuards[i].ticksToLive <= 110) {
					remoteGuardDying = true;
					break;
				}
			}
			/* #endregion */
			
			
			/* #region  SPAWN QUEUE LOGIC CHAIN */
			if ((harvesters.length < harvesterTarget) || (harvesters.length <= harvesterTarget && harvesterDying == true)) {
				newName = 'H' + (harvesters.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep(availableVariants.harvester, newName, { memory: { role: 'harvester' } }) == ERR_NAME_EXISTS) {
					newName = 'H' + (harvesters.length + 1 + harvesterCount);
					harvesterCount++;
				}
			} else if ((collectors.length < collectorTarget) || (collectors.length <= collectorTarget && collectorDying == true)) {
				newName = 'C' + (collectors.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep(availableVariants.collector, newName, { memory: { role: 'collector' } }) == ERR_NAME_EXISTS) {
					newName = 'C' + (collectors.length + 1 + collectorCount);
					collectorCount++;
				}
			} else if (runners.length < runnerTarget) {
				newName = 'Rn' + (runners.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep(availableVariants.runner, newName, { memory: { role: 'runner' } }) == ERR_NAME_EXISTS) {
					newName = 'Rn' + (runners.length + 1 + runnerCount);
					runnerCount++;
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
			} else if (warriors.length < warriorTarget) {
				newName = 'W' + (warriors.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName, { memory: { role: 'warrior' } }) == ERR_NAME_EXISTS) {
					newName = 'W' + (warriors.length + 1 + warriorCount);
					warriorCount++;
				}
			} else if (Memory.creeps.length == 0 && rebooters.length < 1) {
				newName = 'Rb' + (rebooters.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep([WORK, WORK, MOVE, CARRY], newName, { memory: { role: 'rebooter' } }) == ERR_NAME_EXISTS) {
					newName = 'Rb' + (rebooters.length + 1 + rebooterCount);
					rebooterCount++;
				}
			} else if ((reservers.length < reserverTarget) || (reservers.length <= reserverTarget && reserverDying)) {
				newName = 'Rv' + (reservers.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, CLAIM, CLAIM], newName, { memory: { role: 'reserver' } }) == ERR_NAME_EXISTS) {
					newName = 'Rv' + (reservers.length + 1 + reserverCount);
					reserverCount++;
				}
			} else if ((remoteHarvesters.length < remoteHarvesterTarget) || (remoteHarvesters.length <= remoteHarvesterTarget && remoteHarvesterDying)) {
				newName = 'RH' + (remoteHarvesters.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName, { memory: { role: 'remoteharvester' } }) == ERR_NAME_EXISTS) {
					newName = 'RH' + (remoteHarvesters.length + 1 + remoteHarvesterCount);
					remoteHarvesterCount++;
				}
			} else if (remoteRunners.length < remoteRunnerTarget) {
				newName = 'RR' + (remoteRunners.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, WORK], newName, { memory: { role: 'remoterunner' } }) == ERR_NAME_EXISTS) {
					newName = 'RR' + (remoteRunners.length + 1 + remoteRunnerCount);
					remoteRunnerCount++;
				}
			} else if (sites.length > 0 && remoteBuilders.length < remoteBuilderTarget) {
				newName = 'RB' + (remoteBuilders.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName, { memory: { role: 'remotebuilder' } }) == ERR_NAME_EXISTS) {
					newName = 'RB' + (remoteBuilders.length + 1 + remoteBuilderCount);
					remoteBuilderCount++;
				}
			} else if ((remoteGuards.length < remoteGuardTarget) || (remoteGuards.length <= remoteGuardTarget && remoteGuardDying)) {
				newName = 'RG' + (remoteGuards.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep(availableVariants.remoteGuard, newName, { memory: { role: 'remoteguard' } }) == ERR_NAME_EXISTS) {
					newName = 'RG' + (remoteGuards.length + 1 + remoteGuardCount);
					remoteGuardCount++;
				}
			}
			if (cranes.length < craneTarget) {
				newName = 'Cn' + (cranes.length + 1);
				while (Game.spawns['Spawn1'].spawnCreep([CARRY,CARRY,CARRY,CARRY,MOVE], newName, { memory: { role: 'crane' } }) == ERR_NAME_EXISTS) {
					newName = 'Cr' + (cranes.length + 1 + craneCount);
					craneCount++;
				}
			}
		}
		/* #endregion */

		visualRCProgress(room.memory.objects.controller[0]);

	});
	
		if (Game.spawns['Spawn1'].spawning) {
			
			let spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
			if (!spawnAnnounce) {
				console.log('Spawning new creep: ' + spawningCreep.memory.role + ' (' + spawningCreep.name + ')');
				spawnAnnounce = true;
			}
			Game.spawns['Spawn1'].room.visual.text('     ' + spawningCreep.memory.role + ' - ' +
				Game.spawns['Spawn1'].spawning.remainingTime + '/' + Game.spawns['Spawn1'].spawning.needTime,
				Game.spawns['Spawn1'].pos.x + 1,
				Game.spawns['Spawn1'].pos.y - 1,
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
			case 'remoteharvester':
				roleRemoteHarvester.run(creep);
				break;
			case 'remoterunner':
				roleRemoteRunner.run(creep);
				break;
			case 'remotebuilder':
				roleRemoteBuilder.run(creep);
				break;
			case 'remoteguard':
				roleRemoteGuard.run(creep);
				break;
			case 'crane':
				roleCrane.run(creep);
				break;
		}
	
		//Game.spawns['Spawn1'].room.controller.room.visual.text('L' + Game.spawns['Spawn1'].room.controller.level + ' - ' + Game.spawns['Spawn1'].room.controller.progress + '/' + Game.spawns['Spawn1'].room.controller.progressTotal, Game.spawns['Spawn1'].room.controller.pos.x + 1, Game.spawns['Spawn1'].room.controller.pos.y - 1, {align: 'left', opacity: 0.5, color: '#00ffff', font: 0.4} )
		

		Game.spawns['Spawn1'].room.visual.text('     Energy: ' + Game.spawns['Spawn1'].room.energyAvailable
			+ '/' + Game.spawns['Spawn1'].room.energyCapacityAvailable,
			Game.spawns['Spawn1'].pos.x + 1,
			Game.spawns['Spawn1'].pos.y - 2,
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