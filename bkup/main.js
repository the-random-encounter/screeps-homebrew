var roleBuilder 		= 	require('roles.building');
var roleCollector 	= 	require('roles.mining');
var roleHarvester 	= 	require('roles.mining');
var roleMiner 			= 	require('roles.mining');
var roleUpgrader	 	= 	require('roles.building');

<<<<<<< Updated upstream:main.js
const creepFunctions = require('creepFunctions');
	
module.exports.loop = function () {

	let dailyHarv = 0;
	let dailyUpgr = 0;
	let dailyBuil = 0;
	let dailyMine = 0;
	let dailyColl = 0;
	let dailyGath = 0;

	for (var name in Memory.creeps) {
=======
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
const roleCrane 		= require('role.crane'		);
const roleMiner 		= require('role.miner'		);
const roleScientist = require('role.scientist');
const roleClaimer 	= require('role.claimer'	);
const roleProvider = require('role.provider');
const roleRemoteHarvester = require('role.remoteHarvester');
const roleRemoteRunner 		= require('role.remoteRunner'		);
const roleRemoteBuilder 	= require('role.remoteBuilder'	);
const roleRemoteGuard 		= require('role.remoteGuard'		);

// require other modules
require('roomDefense'			);
require('miscFunctions'		);
require('marketFunctions'	);

// require prototype extension modules
require('creepFunctions'					);
require('roomFunctions'						);
require('roomPositionFunctions'		);

/*class Colony {

	id = HEAP_MEMORY.numColonies + 1;
	room = '';
	outposts = [];

	constructor(id, room, level, outposts) {
		this.id = id;
		this.room = room;
		this.level = level;
		this.outposts = outposts;
	}

	designateOutpost(roomName, colonyRoom) {
		newOutpost = new Outpost(id + 0.1, roomName, colonyRoom);
		outposts.push(newOutpost);	
	}
}

class Outpost {
	constructor(id, room, parent) {
		this.id = id;
		this.room = room;
		this.parent = parent;
	}


}*/

class ROOM_HEAP_MEMORY {

	constructor() {
		this.inboxCounter = 0;
		this.outboxCounter = 0;
		this.sitesLastTick = 0;
		this.sitesThisTick = 0;
	}
}

// define heap memory for use on various things and stuff
global.HEAP_MEMORY = {
	'TOWER_DATA': {
		'652e4025c40f9d0858e95789': {
			'maxDistance': 15
		}
	},
	'containerCounter': 0,
	'outpostRoomCounter': 0,
	'outpostSourceCounter': 0,
	'outpostCounter': 0,
	'towerLRT': ""
};

global.manualCmdQueue = [];

// define pre-configured creep bodypart arrays as key/value pairs in an object
const spawnVariants = {
	'harvester200':		[ WORK, CARRY, MOVE	],
	'harvester300':  	[	WORK, WORK,	CARRY, MOVE	],
	'harvester400':  	[	WORK, WORK,	WORK, CARRY, MOVE	],
	'harvester500': 	[	WORK, WORK,	WORK, CARRY, CARRY, MOVE, MOVE	],
	'harvester800': 	[	WORK, WORK,	WORK,	WORK, WORK, WORK, CARRY, CARRY, MOVE	],
	'harvester1000': 	[	WORK, WORK,	WORK,	WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE	],
	'collector100': 	[	CARRY, MOVE	],
	'collector300': 	[	CARRY, CARRY, CARRY, MOVE, MOVE, MOVE	],
	'collector500':  	[	CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE	],
	'collector800':  	[	CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE	],
	'collector1000': 	[	CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE,MOVE, MOVE, MOVE	],
	'upgrader300':	 	[	WORK, WORK, CARRY, MOVE	],
	'upgrader500': 		[	WORK, WORK, WORK, WORK, CARRY, MOVE	],
	'upgrader550': 		[	WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE	],
	'upgrader800':   	[	WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE	],
	'upgrader1000':  	[	WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE	],
	'builder300':  	 	[	WORK, WORK, CARRY, MOVE	],
	'builder500':  	 	[	WORK, WORK, WORK, WORK, CARRY, MOVE	],
	'builder800':  	 	[	WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE	],
	'builder1000': 		[	WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE	],
	'builder1600': 		[	WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE	],
	'repairer300':   	[	WORK, WORK, CARRY, MOVE	],
	'repairer500':   	[	WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE	],
	'repairer800':   	[	WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE	],
	'repairer1000':  	[	WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE	],
	'repairer1400': 	[	WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE	],
	'runner300': 			[	MOVE, MOVE, CARRY, CARRY, CARRY, CARRY	],
	'runner500': 			[	MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY	],
	'runner800': 			[	MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY ],
	'warrior520': 		[	MOVE, MOVE, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK	],
	'crane500': 			[	CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE	],
	'crane800': 			[	CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE	]
}

// define working variant set for use in the main loop, assigned based on current energy capacity limits
let availableVariants = {
	'harvester': [],
	'collector': [],
	'upgrader': [],
	'builder': [],
	'repairer': [],
	'runner': [],
	'warrior': [],
	'crane': [],
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
let minerCount			= 0;
let scientistCount 	= 0;

let remoteHarvesterCount 	= 0;
let remoteRunnerCount 		= 0;
let remoteBuilderCount 		= 0;
let remoteGuardCount 			= 0;

// declare other global variables
let tickCount = 0;
let newName 	= '';
let spawnAnnounced 				= false;
let harvesterDying 				= false;
let runnerDying 					= false;
let reserverDying 				= false;
let collectorDying 				= false;
let remoteHarvesterDying 	= false;
let remoteGuardDying 			= false;
let minerDying 						= false;

/* #region MAIN LOOP, ENTIRE FUNCTION */
module.exports.loop = function () {
	/* #region  MAIN LOOP, ONCE EACH TICK SECTION */
	// This is code to run in the main loop, just once each tick

	if (Memory.colonies === undefined) Memory.colonies = {};
	if (Memory.colonies.colonyList === undefined) Memory.colonies.colonyList = [];
	
	if (manualCmdQueue.length) manualCmdQueue.shift()();

	calcTickTime();
	
	// Generate pixels with extra CPU time
	if (Game.shard.name === 'shard3') {
		if (Game.cpu.bucket == 10000) {
			Game.cpu.generatePixel()
			console.log('CPU Bucket at limit, generating pixel...');
		}
	}

	/* #region CREEP MEMORY GARBAGE COLLECTION */
	for (let name in Memory.creeps) {
>>>>>>> Stashed changes:bkup/main.js
		if (!Game.creeps[name]) {
			delete Memory.creeps[name];
			console.log('Clearing non-existant creep memory:', name);
		}
	}
<<<<<<< Updated upstream:main.js
=======
	/* #endregion */
	
	/* #region  MAIN LOOP, ONCE FOR EVERY ROOM SECTION */
	// main code loop to run inside each room containing our units/structures
	_.forEach(Game.rooms, function (room) {
		
		if (!room.memory.objects) {
			room.cacheObjects();
		}

		if (!room.memory.settings) {
			room.initSettings();
			room.initFlags();
		}
		/*if (ROOM_HEAP === undefined) {
			let ROOM_HEAP = new ROOM_HEAP_MEMORY();
		}
>>>>>>> Stashed changes:bkup/main.js

	_.forEach(Game.rooms, function (roomName) {
		let room = Game.rooms[roomName];
		if (room && room.controller && room.controller.my) {

<<<<<<< Updated upstream:main.js
			let builderTarget 	= _.get(room.memory, ['census', 'builder'		], 3);
			let collectorTarget = _.get(room.memory, ['census', 'collector'	], 1);
			let harvesterTarget = _.get(room.memory, ['census', 'harvester'	], 2);
			let minerTarget 		= _.get(room.memory, ['census', 'miner'			], 5);
			let upgraderTarget = _.get(room.memory, ['census', 'upgrader'], 2);
			let gathererTarget = _.get(room.memory, ['census', 'gatherer'], 1);
=======
			if (tickCount % 1000 == 0) {
				console.log('MAIN LOOP, CACHING OBJECTS EVERY 1000 TICKS --- Tick#: ' + tickCount);
				room.cacheObjects();
			}

			if (Memory.colonies[room.name] === undefined) {
				Memory.colonies[room.name] = {};
				colonyListArray = Memory.colonies.colonyList || [];
				console.log(colonyListArray);
				colonyListArray.push(room.name);
				Memory.colonies.colonyList = colonyListArray;
				Memory.colonies[room.name].id = Memory.colonies.colonyList.length;
				Memory.colonies[room.name].level = room.controller.level;
				Memory.colonies[room.name].spawns = [];
				Memory.colonies[room.name].outposts = {};
			}

			if (room.controller.level !== Memory.colonies[room.name].level)
				Memory.colonies[room.name].level = room.controller.level;

			const roomSpawns = room.find(FIND_MY_SPAWNS);
			let roomSpawnsNames = [];
			for (let i = 0; i < roomSpawns.length; i++) {
				roomSpawnsNames.push(roomSpawns[i].name);
			}
			if (Memory.colonies[room.name].spawns.length < roomSpawnsNames.length)
				Memory.colonies[room.name].spawns = roomSpawnsNames;

			const upgraderBucket = room.controller.pos.findInRange(FIND_STRUCTURES, 5, { filter: (i) => i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE });
>>>>>>> Stashed changes:bkup/main.js

			//#region builders
			var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
			console.log('Builders: ' + builders.length);
			dailyBuil++;
			var sites = room.find(FIND_CONSTRUCTION_SITES);
			if (sites.length > 0 && builders.length < builderTarget) {
				var newName = '🔧 Builder #' + dailyBuil;
				console.log('Spawning new builder: ' + newName);
				Game.spawns['HomeSpawn'].spawnCreep(
						[WORK, CARRY, MOVE], newName, {memory: {role: 'builder'}});
			}
			//#endregion
			//#region collectors
			var collectors = _.filter(Game.creeps, (creep) => creep.memory.role == 'collector');
			console.log('Collectors: ' + collectors.length);
			dailyColl++;

			if (collectors.length < collectorTarget) {
				var newName = '💎 Collector #' + dailyColl;
				console.log('Spawning new collector: ' + newName);
				Game.spawns['HomeSpawn'].spawnCreep(
						[WORK, CARRY, MOVE], newName, {memory: {role: 'collector'}});
			}
			//#endregion
			//#region harvesters
			var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
			console.log('Harvesters: ' + harvesters.length);
			dailyHarv++;

<<<<<<< Updated upstream:main.js
			if (harvesters.length < harvesterTarget) {
				var newName = '⛏️ Harvester #' + dailyHarv;
				console.log('Spawning new harvester: ' + newName);
				Game.spawns['HomeSpawn'].spawnCreep(
						[WORK, CARRY, MOVE], newName, {memory: {role: 'harvester'}});
			}
			//#endregion
			//#region miners
			var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
			console.log('Miners: ' + miners.length);
			dailyMine++;

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
			//#region gatherers
			var gatherers = _.filter(Game.creeps, (creep) => creep.memory.role == 'gatherer');
			console.log('Gatherers: ' + gatherers.length);
			dailyGath++;

			if (gatherers.length < gathererTarget) {
				var newName = '🕵🏼‍♂️ Gatherer #' + dailyGath;
				console.log('Spawning new gatherer: ' + newName);
				Game.spawns['HomeSpawn'].spawnCreep(
						[WORK, CARRY, MOVE], { memory: { role: 'gatherer' } });
			}
			//#endregion
=======
			if (!room.memory.objects)		room.cacheObjects();
			if (!room.memory.flags)			room.initFlags();
			if (!room.memory.settings)	room.initSettings();
			if (!room.memory.targets)		room.initTargets();

			const spawn = Game.getObjectById(room.memory.objects.spawns[0]);
			
			// tower logic function
			roomDefense(room);

			/* #region ROOM LINK LOGIC */
			if (room.memory.objects.links) {

				if (room.memory.data.linkRegistry === undefined)
					room.registerLinks();

				if (room.memory.objects.links.length < 4) {
					let counter = 0;
					if (room.memory.data.linkRegistry.sourceOne)
						counter++;
					if (room.memory.data.linkRegistry.central)
						counter++;
					if (room.memory.data.linkRegistry.sourceTwo)
						counter++;
					if (room.memory.data.linkRegistry.destination)
						counter++;

					if (room.memory.objects.links.length !== counter) {
						room.cacheObjects();
						room.registerLinks();
					}
				}

				let linkOne, linkTwo, linkCentral, linkDest;
				if (room.memory.data.linkRegistry.sourceOne)
					linkOne = Game.getObjectById(room.memory.data.linkRegistry.sourceOne);
				if (room.memory.data.linkRegistry.sourceTwo)
					linkTwo = Game.getObjectById(room.memory.data.linkRegistry.sourceTwo);
				if (room.memory.data.linkRegistry.destination)
					linkDest = Game.getObjectById(room.memory.data.linkRegistry.destination);
				if (room.memory.data.linkRegistry.central)
					linkCentral = Game.getObjectById(room.memory.data.linkRegistry.central);

				if (linkCentral && linkOne) {
					if ((linkOne.store.getFreeCapacity() < 100) && linkOne.cooldown == 0 && (linkCentral.store.getFreeCapacity() >= linkOne.store.getUsedCapacity())) {
						//console.log('Fired S1toC (' + linkOne.store[RESOURCE_ENERGY] + '/ ' + linkCentral.store[RESOURCE_ENERGY] + ')');
						linkOne.transferEnergy(linkCentral);
					}
				}
				if (linkCentral && linkTwo) {
					if ((linkTwo.store.getFreeCapacity() < 100) && linkTwo.cooldown == 0 && (linkCentral.store.getFreeCapacity() >= linkTwo.store.getUsedCapacity())) {
						//console.log('Fired S2toC (' + linkTwo.store[RESOURCE_ENERGY] + '/ ' + linkCentral.store[RESOURCE_ENERGY] + ')');
						linkTwo.transferEnergy(linkCentral);
					}
				}
				if (linkCentral && linkDest) {
					if ((linkCentral.store.getUsedCapacity() > 0) && linkCentral.cooldown == 0 && (linkDest.store.getFreeCapacity() >= linkCentral.store.getUsedCapacity())) {
						//console.log('Fired CtoD (' + linkCentral.store[RESOURCE_ENERGY] + '/ ' + linkDest.store[RESOURCE_ENERGY] + ')');
						linkCentral.transferEnergy(linkDest);
					}
				}
			}
			/* #endregion */

			/* #region  SPAWNING QUOTA & CURRENT SPAWN COUNT DECLARATIONS  */
			// pull creep role caps from room memory, or set to default value if none are set
			let harvesterTarget = _.get(room.memory, ['targets', 'harvester'], 2);
			let collectorTarget = _.get(room.memory, ['targets', 'collector'], 2);
			let upgraderTarget = _.get(room.memory, ['targets', 'upgrader'], 2);
			let builderTarget = _.get(room.memory, ['targets', 'builder'], 2);
			let repairerTarget = _.get(room.memory, ['targets', 'repairer'], 1);
			let runnerTarget = _.get(room.memory, ['targets', 'runner'], 0);
			let rebooterTarget = _.get(room.memory, ['targets', 'rebooter'], 0);
			let reserverTarget = _.get(room.memory, ['targets', 'reserver'], 0);
			let rangerTarget = _.get(room.memory, ['targets', 'ranger'], 1);
			let warriorTarget = _.get(room.memory, ['targets', 'warrior'], 1);
			let healerTarget = _.get(room.memory, ['targets', 'healer'], 1);
			let craneTarget = _.get(room.memory, ['targets', 'crane'], 1);
			let minerTarget = _.get(room.memory, ['targets', 'miner'], 1);
			let scientistTarget = _.get(room.memory, ['targets', 'scientist'], 1);

			
			let remoteHarvesterTarget;
			if (room.memory.outposts)
				remoteHarvesterTarget = room.memory.outposts.aggregateSourceList.length;
			else
				remoteHarvesterTarget = _.get(room.memory, ['targets', 'remoteharvester'], 1);
			 
			let remoteRunnerTarget = _.get(room.memory, ['targets', 'remoterunner'], 1);
			let remoteBuilderTarget = _.get(room.memory, ['targets', 'remotebuilder'], 1);
			let remoteGuardTarget = _.get(room.memory, ['targets', 'remoteguard'], 1);

			// pull current amount of creeps alive by roleForQuota
			let harvesters = _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'harvester' && creep.memory.homeRoom == roomName);
			let collectors = _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'collector' && creep.memory.homeRoom == roomName);
			let upgraders = _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'upgrader' && creep.memory.homeRoom == roomName);
			let builders = _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'builder' && creep.memory.homeRoom == roomName);
			let repairers = _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'repairer' && creep.memory.homeRoom == roomName);
			let runners = _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'runner' && creep.memory.homeRoom == roomName);
			let rebooters = _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'rebooter' && creep.memory.homeRoom == roomName);
			let reservers = _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'reserver' && creep.memory.homeRoom == roomName);
			let rangers = _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'ranger' && creep.memory.homeRoom == roomName);
			let warriors = _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'warrior' && creep.memory.homeRoom == roomName);
			let healers = _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'healer' && creep.memory.homeRoom == roomName);
			let cranes = _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'crane' && creep.memory.homeRoom == roomName);
			let miners = _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'miner' && creep.memory.homeRoom == roomName);
			let scientists = _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'scientist' && creep.memory.homeRoom == roomName);

			let remoteHarvesters = _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'remoteharvester' && creep.memory.homeRoom == roomName);
			let remoteRunners = _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'remoterunner' && creep.memory.homeRoom == roomName);
			let remoteBuilders = _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'remotebuilder' && creep.memory.homeRoom == roomName);
			let remoteGuards = _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'remoteguard' && creep.memory.homeRoom == roomName);

			let sites = room.find(FIND_CONSTRUCTION_SITES);
			//let westSites = Game.rooms.E57S51.find(FIND_CONSTRUCTION_SITES);
			//	let northSites = Game.rooms.E59S48.find(FIND_CONSTRUCTION_SITES);
			/* #endregion */

			// Select a non-geriatric collector to loot compounds or energy from enemy corpses
			if (room.find(FIND_HOSTILE_CREEPS).length) {
				if (collectors.length) {
					for (let i = 0; i < collectors.length; i++) {
						if (collectors[i].ticksToLive > 300) {
							collectors[i].memory.invaderLooter = true;
							console.log(collectors[i] + ' is now the invader looter');
							break;
						}
					}
				}
			}
			
			/* #region  CONSOLE LOG - SPAWN INFO */
			if (tickCount % 10) {
				console.log('H:' + harvesters.length + '(' + harvesterTarget + ') | C:' + collectors.length + '(' + collectorTarget + ') | U:' + upgraders.length + '(' + upgraderTarget + ')| B:' + builders.length + '(' + builderTarget + ') | Rn:' + runners.length + '(' + runnerTarget + ') | Rp:' + repairers.length + '(' + repairerTarget + ') | Cn:' + cranes.length + '(' + craneTarget + ') | Rb:' + rebooters.length + '(' + rebooterTarget + ') | Rv:' + reservers.length + '(' + reserverTarget + ') || Rng:' + rangers.length + '(' + rangerTarget + ') | War:' + warriors.length + '(' + warriorTarget + ') | Hlr:' + healers.length + '(' + healerTarget + ') || RH:' + remoteHarvesters.length + '(' + remoteHarvesterTarget + ') | RR:' + remoteRunners.length + '(' + remoteRunnerTarget + ') | RB:' + remoteBuilders.length + '(' + remoteBuilderTarget + ') | RG:' + remoteGuards.length + '(' + remoteGuardTarget + ') || Energy: ' + room.energyAvailable + '(' + room.energyCapacityAvailable + ')');
			}
			/* #endregion */
			/* #region  ROOM VISUAL - SPAWN INFO */
			if (room.memory.settings.visualSettings.spawnInfo === undefined)
				room.initSettings();
			const alignment = room.memory.settings.visualSettings.spawnInfo.alignment;
			const spawnColor = room.memory.settings.visualSettings.spawnInfo.color;
			const spawnFont = room.memory.settings.visualSettings.spawnInfo.fontSize || 0.5;
			let spawnX = 49;
			if (alignment == 'left')
				spawnX = 0;
			/* #region BOTTOM RIGHT CORNER */
			room.visual.rect(39.75, 44.25, 9.5, 5, { fill: '#555555', stroke: '#aaaaaa', opacity: 0.3, strokeWidth: 0.2 })
			// Harvesters, Collectors, Upgraders, Builders, Cranes
			room.visual.text('H:' + harvesters.length + '(' + harvesterTarget + ') | C:' + collectors.length + '(' + collectorTarget + ') | U:' + upgraders.length + '(' + upgraderTarget + ') | B:' + builders.length + '(' + builderTarget + ') | Cn:' + cranes.length + '(' + craneTarget + ')', spawnX, 49, { align: alignment, color: spawnColor, font: spawnFont });
			// Remote Harvesters, Remote Runners, Remote Builders, Remote Guards
			room.visual.text('RH:' + remoteHarvesters.length + '(' + remoteHarvesterTarget + ') | RR:' + remoteRunners.length + '(' + remoteRunnerTarget + ') | RB:' + remoteBuilders.length + '(' + remoteBuilderTarget + ') | RG:' + remoteGuards.length + '(' + remoteGuardTarget + ')', spawnX, 48, { align: alignment, color: spawnColor, font: spawnFont });
			// Runners, Repaireres, Rebooters, Reservers
			room.visual.text('Rn:' + runners.length + '(' + runnerTarget + ') | Rp:' + repairers.length + '(' + repairerTarget + ') | Rb:' + rebooters.length + '(' + rebooterTarget + ') | Rv:' + reservers.length + '(' + reserverTarget + ')', spawnX, 47, { align: alignment, color: spawnColor, font: spawnFont });
			// Rangers, Warriors, Healers
			room.visual.text('Rng:' + rangers.length + '(' + rangerTarget + ') | War:' + warriors.length + '(' + warriorTarget + ') | Hlr:' + healers.length + '(' + healerTarget + ')', spawnX, 46, { align: alignment, color: spawnColor, font: spawnFont });
			// Energy Available, Energy Capacity
			room.visual.text('Energy: ' + room.energyAvailable + '(' + room.energyCapacityAvailable + ')', spawnX, 45, { align: alignment, color: spawnColor, font: spawnFont });
			/* #endregion */
			/* #region TOP RIGHT CORNER */
			room.visual.rect(39.75, -0.25, 9.5, 5, { fill: '#555555', stroke: '#aaaaaa', opacity: 0.3, strokeWidth: 0.2 })
			// Harvesters, Collectors, Upgraders, Builders, Cranes
			room.visual.text('H:' + harvesters.length + '(' + harvesterTarget + ') | C:' + collectors.length + '(' + collectorTarget + ') | U:' + upgraders.length + '(' + upgraderTarget + ') | B:' + builders.length + '(' + builderTarget + ') | Cn:' + cranes.length + '(' + craneTarget + ')', spawnX, 0.5, { align: alignment, color: spawnColor, font: spawnFont });
			// Remote Harvesters, Remote Runners, Remote Builders, Remote Guards
			room.visual.text('RH:' + remoteHarvesters.length + '(' + remoteHarvesterTarget + ') | RR:' + remoteRunners.length + '(' + remoteRunnerTarget + ') | RB:' + remoteBuilders.length + '(' + remoteBuilderTarget + ') | RG:' + remoteGuards.length + '(' + remoteGuardTarget + ')', spawnX, 1.5, { align: alignment, color: spawnColor, font: spawnFont });
			// Runners, Repaireres, Rebooters, Reservers
			room.visual.text('Rn:' + runners.length + '(' + runnerTarget + ') | Rp:' + repairers.length + '(' + repairerTarget + ') | Rb:' + rebooters.length + '(' + rebooterTarget + ') | Rv:' + reservers.length + '(' + reserverTarget + ')', spawnX, 2.5, { align: alignment, color: spawnColor, font: spawnFont });
			// Rangers, Warriors, Healers
			room.visual.text('Rng:' + rangers.length + '(' + rangerTarget + ') | War:' + warriors.length + '(' + warriorTarget + ') | Hlr:' + healers.length + '(' + healerTarget + ')', spawnX, 3.5, { align: alignment, color: spawnColor, font: spawnFont });
			// Energy Available, Energy Capacity
			room.visual.text('Energy: ' + room.energyAvailable + '(' + room.energyCapacityAvailable + ')', spawnX, 4.5, { align: alignment, color: spawnColor, font: spawnFont });
			/* #endregion */
			/* #endregion */
			/* #region  ROOM VISUAL - ROOM FLAGS */
			const xCoord = room.memory.settings.visualSettings.roomFlags.displayCoords[0];
			const yCoord = room.memory.settings.visualSettings.roomFlags.displayCoords[1];
			const displayColor = room.memory.settings.visualSettings.roomFlags.color;
			const fontSize = room.memory.settings.visualSettings.roomFlags.fontSize || 0.4;
			room.visual.rect(xCoord - 0.15, yCoord - 1.2, 13, 1.35, { fill: '#770000', stroke: '#aa0000', opacity: 0.3, strokeWidth: 0.1 })
			room.visual.text('[' + room.name + ']:  CU(' + room.memory.flags.craneUpgrades + ')  CSL(' + room.memory.flags.centralStorageLogic + ')   RDM(' + room.memory.flags.runnersDoMinerals + ')   RDP(' + room.memory.flags.runnersDoPiles + ')   HFA(' + room.memory.flags.harvestersFixAdjacent + ')', xCoord, (yCoord - 0.6), { align: 'left', font: fontSize, color: displayColor });
			room.visual.text('[' + room.name + ']:   RB(' + room.memory.flags.repairBasics + ')   RR(' + room.memory.flags.repairRamparts + ')    RW(' + room.memory.flags.repairWalls + ')   TRB(' + room.memory.flags.towerRepairBasic + ')   TRD(' + room.memory.flags.towerRepairDefenses + ')', xCoord, yCoord - 0.1, { align: 'left', font: fontSize, color: displayColor });

			/* #endregion */

			let creepCount = 0;

			if (Memory.creeps)
				creepCount = Object.keys(Memory.creeps).length;
			let capacity;
			if (creepCount.length < 2)
				capacity = room.energyAvailable;
			else
				capacity = room.energyCapacityAvailable;

			/* #region  AVAILABLE VARIANTS ASSIGNMENTS */
			if (room.energyCapacityAvailable < 401) {
				availableVariants.harvester = spawnVariants.harvester300;
				availableVariants.collector = spawnVariants.collector100;
				availableVariants.upgrader = spawnVariants.upgrader300;
				availableVariants.builder = spawnVariants.builder300;
				availableVariants.repairer = spawnVariants.repairer300;
				availableVariants.runner = spawnVariants.runner300;
				availableVariants.crane = spawnVariants.crane500;
			} else if (room.energyCapacityAvailable < 500) {
				availableVariants.harvester = spawnVariants.harvester400;
				availableVariants.collector = spawnVariants.collector300;
				availableVariants.upgrader = spawnVariants.upgrader300;
				availableVariants.builder = spawnVariants.builder300;
				availableVariants.repairer = spawnVariants.repairer300;
				availableVariants.runner = spawnVariants.runner300;
				availableVariants.crane = spawnVariants.crane500;
			} else if (room.energyCapacityAvailable <= 800) {
				availableVariants.harvester = spawnVariants.harvester500;
				availableVariants.collector = spawnVariants.collector500;
				availableVariants.upgrader = spawnVariants.upgrader550;
				availableVariants.builder = spawnVariants.builder500;
				availableVariants.repairer = spawnVariants.repairer500;
				availableVariants.runner = spawnVariants.runner300;
				availableVariants.warrior = spawnVariants.warrior520;
				availableVariants.crane = spawnVariants.crane500;
			} else if (room.energyCapacityAvailable <= 1000) {
				availableVariants.harvester = spawnVariants.harvester800;
				availableVariants.collector = spawnVariants.collector500;
				availableVariants.upgrader = spawnVariants.upgrader800;
				availableVariants.builder = spawnVariants.builder800;
				availableVariants.repairer = spawnVariants.repairer800;
				availableVariants.runner = spawnVariants.runner300;
				availableVariants.crane = spawnVariants.crane500;
			} else if (room.energyCapacityAvailable <= 1300) {
				availableVariants.harvester = spawnVariants.harvester800;
				availableVariants.collector = spawnVariants.collector500;
				availableVariants.upgrader = spawnVariants.upgrader800;
				availableVariants.builder = spawnVariants.builder1000;
				availableVariants.repairer = spawnVariants.repairer1000;
				availableVariants.runner = spawnVariants.runner300;
				availableVariants.crane = spawnVariants.crane500;
			} else if (room.energyCapacityAvailable > 1600) {
				availableVariants.harvester = spawnVariants.harvester800;
				availableVariants.collector = spawnVariants.collector500;
				availableVariants.upgrader = spawnVariants.upgrader800;
				availableVariants.builder = spawnVariants.builder1000;
				availableVariants.repairer = spawnVariants.repairer1000;
				availableVariants.runner = spawnVariants.runner300;
				availableVariants.crane = spawnVariants.crane500;
			}
			if (room.memory.flags.craneUpgrades == true) availableVariants.crane = spawnVariants.crane800;
			/* #endregion */
			
			// if we have no collectors, and our energy supply is not enough for a 500 energy spawn, do a 300.
			if (!collectors.length) {
				if (capacity < 500)
					availableVariants.collector = spawnVariants.collector300;
			}

			// ensure that two harvesters never use the same source for harvesting, when spawning 6-work harvesters
			// if it happens, send the older one to the opposite source
			if (harvesters.length >= 2 && harvesters[0].getActiveBodyparts(WORK).length >= 6) {
				if (harvesters[0].memory.source == harvesters[1].memory.source) {
					if (harvesters[0].ticksToLive > harvesters[1].ticksToLive) {
						harvesters[1].assignHarvestSource(true);
						console.log('[' + room.name + ']: Reassigned ' + harvesters[1].name + '\'s source due to conflict.')
					}
					if (harvesters[1].ticksToLive > harvesters[0].ticksToLive) {
						harvesters[0].assignHarvestSource(true);
						console.log('[' + room.name + ']: Reassigned ' + harvesters[0].name + '\'s source due to conflict.')
					}
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

			for (i = 0; i < runners.length; i++) {
				runnerDying = false;
				if (runners[i].ticksToLive <= 20) {
					runnerDying = true;
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

			for (i = 0; i < miners.length; i++) {
				minerDying = false;
				if (miners[i].ticksToLive <= 60) {
					minerDying = true;
					break;
				}
			}
			/* #endregion */
			
			/* #region  SPAWN MANAGEMENT SYSTEM */
			let readySpawn = spawn;

			for (let i = 0; i < room.memory.objects.spawns.length; i++) {
				const thisSpawn = Game.getObjectById(room.memory.objects.spawns[i]);

				if (thisSpawn.spawning)	continue;
				else readySpawn = thisSpawn;
			}

			if (creepCount == 0 && rebooters.length < 1 && room.memory.objects.storage && GOBI(room.memory.objects.storage[0]).store[RESOURCE_ENERGY] <= 1000) {
				newName = 'Rb' + (rebooters.length + 1);
				while (readySpawn.spawnCreep([WORK, WORK, MOVE, CARRY], newName, { memory: { role: 'rebooter', roleForQuota: 'rebooter' } }) == ERR_NAME_EXISTS) {
					newName = 'Rb' + (rebooters.length + 1 + rebooterCount);
					rebooterCount++;
				}
			} else {
				if ((harvesters.length < harvesterTarget) || (harvesters.length <= harvesterTarget && harvesterDying && harvesterTarget !== 0)) {
					newName = 'H' + (harvesters.length + 1);
					while (readySpawn.spawnCreep(availableVariants.harvester, newName, { memory: { role: 'harvester', roleForQuota: 'harvester', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
						newName = 'H' + (harvesters.length + 1 + harvesterCount);
						harvesterCount++;
					}
				} else if ((collectors.length < collectorTarget) || (collectors.length <= collectorTarget && collectorDying && collectorTarget !== 0)) {
					newName = 'C' + (collectors.length + 1);
					while (readySpawn.spawnCreep(availableVariants.collector, newName, { memory: { role: 'collector', roleForQuota: 'collector', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
						newName = 'C' + (collectors.length + 1 + collectorCount);
						collectorCount++;
					}
				} else {
					// REBOOTERS/COLLECTORS/HARVESTERS are at quota, move on to the rest:
					if ((runners.length < runnerTarget) || (runners.length <= runnerTarget && runnerDying && runnerTarget !== 0)) {
						newName = 'Rn' + (runners.length + 1);
						while (readySpawn.spawnCreep(availableVariants.runner, newName, { memory: { role: 'runner', roleForQuota: 'runner', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
							newName = 'Rn' + (runners.length + 1 + runnerCount);
							runnerCount++;
						}
					} else if (upgraders.length < upgraderTarget) {
						newName = 'U' + (upgraders.length + 1);
						while (readySpawn.spawnCreep(availableVariants.upgrader, newName, { memory: { role: 'upgrader', roleForQuota: 'upgrader', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
							newName = 'U' + (upgraders.length + 1 + upgraderCount);
							upgraderCount++;
						}
					} else if (sites.length > 0 && builders.length < builderTarget) {
						newName = 'B' + (builders.length + 1);
						while (readySpawn.spawnCreep(availableVariants.builder/*[WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]*/, newName, { memory: { role: 'builder', roleForQuota: 'builder', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
							newName = 'B' + (builders.length + 1 + builderCount);
							builderCount++;
						}
					} else if (repairers.length < repairerTarget) {
						newName = 'Rp' + (repairers.length + 1);
						while (readySpawn.spawnCreep(availableVariants.repairer, newName, { memory: { role: 'repairer', roleForQuota: 'repairer', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
							newName = 'Rp' + (repairers.length + 1 + repairerCount);
							repairerCount++;
						}
					} else if (cranes.length < craneTarget) {
						newName = 'Cn' + (cranes.length + 1);
						while (readySpawn.spawnCreep(availableVariants.crane, newName, { memory: { role: 'crane', roleForQuota: 'crane', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
							newName = 'Cr' + (cranes.length + 1 + craneCount);
							craneCount++;
						}
					} else if (miners.length < minerTarget && room.memory.objects.extractor) {
						newName = 'M' + (miners.length + 1);
						while (readySpawn.spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], newName, { memory: { role: 'miner', roleForQuota: 'miner', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
							newName = 'M' + (miners.length + 1 + minerCount);
							minerCount++;
						}
					} else if ((scientists.length < scientistTarget && room.objects.labs) /*&& room.memory.flags.doScience*/) {
						newName = 'S' + (scientists.length + 1);
						while (readySpawn.spawnCreep([MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY], newName, { memory: { role: 'scientist', roleForQuota: 'scientist', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
							newName = 'S' + (scientists.length + 1 + scientistCount);
							scientistCount++;
						}
					} else if ((reservers.length < reserverTarget) || (reservers.length <= reserverTarget && reserverDying && reserverTarget !== 0)) {
						console.log('spawn reserver');
						newName = 'Rv' + (reservers.length + 1);
						while (readySpawn.spawnCreep([MOVE, MOVE, CLAIM, CLAIM], newName, { memory: { role: 'reserver', roleForQuota: 'reserver', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
							newName = 'Rv' + (reservers.length + 1 + reserverCount);
							reserverCount++;
						}
					} else if ((remoteHarvesters.length < remoteHarvesterTarget) || (remoteHarvesters.length <= remoteHarvesterTarget && remoteHarvesterDying && remoteHarvesterTarget !== 0)) {
						newName = 'RH' + (remoteHarvesters.length + 1);
						while (readySpawn.spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName, { memory: { role: 'remoteharvester', roleForQuota: 'remoteharvester', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
							newName = 'RH' + (remoteHarvesters.length + 1 + remoteHarvesterCount);
							remoteHarvesterCount++;
						}
					} else if (remoteRunners.length < remoteRunnerTarget) {
						newName = 'RR' + (remoteRunners.length + 1);
						while (readySpawn.spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, WORK], newName, { memory: { role: 'remoterunner', roleForQuota: 'remoterunner', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
							newName = 'RR' + (remoteRunners.length + 1 + remoteRunnerCount);
							remoteRunnerCount++;
						}
					} else if (/*sites.length > 0 && */remoteBuilders.length < remoteBuilderTarget) {
						newName = 'RB' + (remoteBuilders.length + 1);
						while (readySpawn.spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName, { memory: { role: 'remotebuilder', roleForQuota: 'remotebuilder', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
							newName = 'RB' + (remoteBuilders.length + 1 + remoteBuilderCount);
							remoteBuilderCount++;
						}
					} else if ((remoteGuards.length < remoteGuardTarget) || (remoteGuards.length <= remoteGuardTarget && remoteGuardDying && remoteGuardTarget !== 0)) {
						newName = 'RG' + (remoteGuards.length + 1);
						while (readySpawn.spawnCreep(availableVariants.remoteGuard, newName, { memory: { role: 'remoteguard', roleForQuota: 'remoteguard', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
							newName = 'RG' + (remoteGuards.length + 1 + remoteGuardCount);
							remoteGuardCount++;
						}
					} else {
						//RESERVERS/REMOTE RUNNERS/HARVESTERS/BUILDERS/GUARDS are at quota, move on to defensive creeps:
						if (rangers.length < rangerTarget) {
							newName = 'Rng' + (rangers.length + 1);
							while (readySpawn.spawnCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE], newName, { memory: { role: 'ranger', roleForQuota: 'ranger', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
								newName = 'Rng' + (rangers.length + 1 + rangerCount);
								rangerCount++;
							}
						} else if (warriors.length < warriorTarget) {
							newName = 'War' + (warriors.length + 1);
							while (readySpawn.spawnCreep(/*[TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE]*/availableVariants.warrior, newName, { memory: { role: 'warrior', roleForQuota: 'warrior', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
								newName = 'War' + (warriors.length + 1 + warriorCount);
								warriorCount++;
							}
						} else if (healers.length < healerTarget) {
							newName = 'Hlr' + (healers.length + 1);
							while (readySpawn.spawnCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName, { memory: { role: 'healer', roleForQuota: 'healer', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
								newName = 'Hlr' + (healers.length + 1 + healerCount);
								healerCount++;
							}
						}
					}
				}
				
			}
			/* #endregion */

			// Display creep spawning information next to spawn
			if (readySpawn.spawning) {
		
				let spawningCreep = Game.creeps[readySpawn.spawning.name];
				if (!spawnAnnounced) {
					console.log('Spawning new creep: ' + spawningCreep.memory.role + ' (' + spawningCreep.name + ')');
					spawnAnnounced = true;
				}
				readySpawn.room.visual.text('     ' + spawningCreep.memory.role + ' - ' + readySpawn.spawning.remainingTime + '/' + readySpawn.spawning.needTime, readySpawn.pos.x + 1, readySpawn.pos.y - 1, { align: 'left', opacity: 0.8, font: 0.4 });
			} else {
				spawnAnnounced = false;
			}

			if (room.controller.level > 1)
				visualRCProgress(room.controller);
			
			room.visual.text('     Energy: ' + room.energyAvailable
			+ '/' + room.energyCapacityAvailable,
			readySpawn.pos.x + 1,
			readySpawn.pos.y - 2,
			{ align: 'left', opacity: 0.5, color: '#aa5500', font: 0.4 });
			//console.log('[' + room.name + ']: Consumed ' + Game.cpu.getUsed().toFixed(3) + ' this tick.');
		} // end of (for each room owned by player code)
		/* #endregion */

	});// end of (for each room we have visibility in)
	/* #endregion */

	
	
	// Assign what actions for each creep to take by role
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
			case 'miner':
				roleMiner.run(creep);
				break;
			case 'scientist':
				roleScientist.run(creep);
				break;
			case 'claimer':
				roleClaimer.run(creep);
				break;
			case 'provider':
				roleProvider.run(creep);
				break;
>>>>>>> Stashed changes:bkup/main.js
		}
	})
	
	if(Game.spawns['HomeSpawn'].spawning) {
			var spawningCreep = Game.creeps[Game.spawns['HomeSpawn'].spawning.name];
			Game.spawns['HomeSpawn'].room.visual.text(
					'🛠️' + spawningCreep.memory.role,
					Game.spawns['HomeSpawn'].pos.x + 1,
					Game.spawns['HomeSpawn'].pos.y,
					{align: 'left', opacity: 0.8});
	}

<<<<<<< Updated upstream:main.js
	for (var name in Game.creeps) {
		var creep = Game	.creeps[name];
				
		if (creep.memory	.role == 'harvester') {
			roleHarvester		.run(creep);
		}
		if (creep.memory	.role == 'miner') {
			roleMiner				.run(creep);
		}
		if (creep.memory	.role == 'builder') {
			roleBuilder			.run(creep);
		}
		if (creep.memory	.role == 'upgrader') {
			roleUpgrader		.run(creep);
		}
		if (creep.memory	.role == 'collector') {
			roleCollector		.run(creep);
		}
	}
=======
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

function determineCraneSpot(room) {
	if (!room.memory.objects) room.cacheObjects();
	if (!room.memory.objects.storage || !room.memory.objects.links || !room.memory.objects.terminal || !room.memory.objects.labs) room.cacheObjects();

	const storage 	= Game.getObjectById(room.memory.objects.storage[0]	);
	const terminal 	= Game.getObjectById(room.memory.objects.terminal[0]);
	const link 			= Game.getObjectById(room.memory.objects.links[0]		);
	const lab 			= Game.getObjectById(room.memory.objects.labs[0]		);
	
	const storagePos 	= [	storage		.pos.x, storage	.pos.y	];
	const terminalPos = [	terminal	.pos.x, terminal.pos.y	];
	const linkPos 		= [	link			.pos.x, link		.pos.y	];
	const labPos 			= [lab.pos.x, lab.pos.y];
	
	const storageAdjacent = room.lookAtArea(storage.pos.y)
>>>>>>> Stashed changes:bkup/main.js
}