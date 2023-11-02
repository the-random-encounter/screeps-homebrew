
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
	'outpostCounter': 0
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
	'upgrader500': 		[WORK, WORK, WORK, WORK, CARRY, MOVE],
	'upgrader550': 		[WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
	'upgrader800':   	[WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
	'upgrader1000':  	[WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE,
		MOVE],
	'builder300':  	 	[WORK, WORK, CARRY, MOVE],
	'builder500':  	 	[WORK, WORK, WORK, WORK, CARRY, MOVE],
	'builder800':  	 	[WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
	'builder1000': 		[WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
	'builder1600': 		[WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
	'repairer300':   	[WORK, WORK, CARRY, MOVE],
	'repairer500':   	[WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
	'repairer800':   	[WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
	'repairer1000':  	[WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
	'repairer1400': 	[WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
	'runner300': 			[MOVE, MOVE, CARRY, CARRY, CARRY, CARRY],
	'runner500': 			[MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY],
	'runner800': 			[MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
	'warrior520': 		[MOVE,MOVE,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,ATTACK]
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
	if (manualCmdQueue.length)
		manualCmdQueue.shift()();

	calcTickTime();
	
	// Generate pixels with extra CPU time
	//if (Game.cpu.bucket == 10000) {
	//	Game.cpu.generatePixel()
	//	console.log('CPU Bucket at limit, generating pixel...');
	//}

	/* #region CREEP MEMORY GARBAGE COLLECTION */
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
				case 'remoteguard':
					remoteGuardCount = 0;
					break;
				case 'miner':
					minerCount = 0;
					break;
			}
		}
	}
	/* #endregion */
	
	/* #region  MAIN LOOP, ONCE FOR EVERY ROOM SECTION */
	// main code loop to run inside each room containing our units/structures
	_.forEach(Game.rooms, function (room) {
		
		/*if (ROOM_HEAP === undefined) {
			let ROOM_HEAP = new ROOM_HEAP_MEMORY();
		}

		// check for completed buildings to automatically cache completed constructions
		ROOM_HEAP.sitesLastTick = ROOM_HEAP.sitesThisTick;
		ROOM_HEAP.sitesThisTick = room.find(FIND_CONSTRUCTION_SITES).length;
		
		console.log(ROOM_HEAP.sitesLastTick + ' ' + ROOM_HEAP.sitesThisTick);
		if ((ROOM_HEAP.sitesThisTick < ROOM_HEAP.sitesLastTick) && (_.filter(room.getEventLog(), function (n) { if (n.event == 'EVENT_BUILD' && n.event !== 'EVENT_OBJECT_DESTROYED') return true })))
			room.cacheObjects();*/
		
		/* #region  EACH ROOM LOOP, FOR OWNED ROOMS */
		// code to run if room contains a controller owned by us
		if (room && room.controller && room.controller.my) {

			const upgraderBucket = room.controller.pos.findInRange(FIND_STRUCTURES, 5, { filter: (i) => i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE });

			if (!room.memory.data)
				room.memory.data = {};
			if (!room.memory.data.upgraderBucket && upgraderBucket.length > 0)
				room.memory.data.upgraderBucket = upgraderBucket[0].id;

			const roomName = room.name;

			if (!room.memory.objects)
				room.cacheObjects();
			if (!room.memory.flags)
				room.initFlags();
			if (!room.memory.settings)
				room.initSettings();
			if (!room.memory.targets)
				room.initTargets();

			const spawn = Game.getObjectById(room.memory.objects.spawns[0]);
			

			// tower logic function
			roomDefense(room);

			// declare links
			if (room.memory.objects.links) {
				const numLinks = room.memory.objects.links.length;

				let linkToLocal;
				let linkFromLocal;
				let linkFromLocal2;
				if (numLinks > 0)
					linkToLocal = Game.getObjectById(room.memory.objects.links[0]);
				if (numLinks > 1)
					linkFromLocal = Game.getObjectById(room.memory.objects.links[1]);
				if (numLinks > 2)
					linkFromLocal2 = Game.getObjectById(room.memory.objects.links[2]);
		
				if (linkFromLocal.store[RESOURCE_ENERGY] > 400) {
					if (linkFromLocal.cooldown == 0) {
						console.log('[' + room.name + ']: Link transferring energy.');
						linkFromLocal.transferEnergy(linkToLocal);
					}
				}
		
				if (linkFromLocal2.store[RESOURCE_ENERGY] > 700) {
					if (linkFromLocal2.cooldown == 0) {
						console.log('[' + room.name + ']: Link2 transferring energy.');
						linkFromLocal2.transferEnergy(linkToLocal);
					}
				}
			}
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
			if (tickCount == 10) {
				console.log('H:' + harvesters.length + '(' + harvesterTarget + ') | C:' + collectors.length + '(' + collectorTarget + ') | U:' + upgraders.length + '(' + upgraderTarget + ')| B:' + builders.length + '(' + builderTarget + ') | Rn:' + runners.length + '(' + runnerTarget + ') | Rp:' + repairers.length + '(' + repairerTarget + ') | Cn:' + cranes.length + '(' + craneTarget + ') | Rb:' + rebooters.length + '(' + rebooterTarget + ') | Rv:' + reservers.length + '(' + reserverTarget + ') || Rng:' + rangers.length + '(' + rangerTarget + ') | War:' + warriors.length + '(' + warriorTarget + ') | Hlr:' + healers.length + '(' + healerTarget + ') || RH:' + remoteHarvesters.length + '(' + remoteHarvesterTarget + ') | RR:' + remoteRunners.length + '(' + remoteRunnerTarget + ') | RB:' + remoteBuilders.length + '(' + remoteBuilderTarget + ') | RG:' + remoteGuards.length + '(' + remoteGuardTarget + ') || Energy: ' + room.energyAvailable + '(' + room.energyCapacityAvailable + ')');
				tickCount = 0;
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
			room.visual.rect(39.75,44.25,9.5,5, {fill: '#555555', stroke: '#aaaaaa', opacity: 0.3, strokeWidth: 0.2})
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
			room.visual.rect(39.75,-0.25,9.5,5, {fill: '#555555', stroke: '#aaaaaa', opacity: 0.3, strokeWidth: 0.2})
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
			room.visual.rect(xCoord - 0.15,yCoord - 1.2, 12.5, 1.35, {fill: '#770000', stroke: '#aa0000', opacity: 0.3, strokeWidth: 0.1})
			room.visual.text('[' + room.name + ']:  CU(' + room.memory.flags.craneUpgrades + ')   RL(' + room.memory.flags.runnerLogic + ')   RDM(' + room.memory.flags.runnersDoMinerals + ')   RDP(' + room.memory.flags.runnersDoPiles + ')   HFA(' + room.memory.flags.harvestersFixAdjacent + ')', xCoord, (yCoord - 0.6), { align: 'left', font: fontSize, color: displayColor });
			room.visual.text('[' + room.name + ']:   RB(' + room.memory.flags.repairBasics + ')   RR(' + room.memory.flags.repairRamparts + ')   RW(' + room.memory.flags.repairWalls + ')   TRB(' + room.memory.flags.towerRepairBasic + ')   TRD(' + room.memory.flags.towerRepairDefenses + ')', xCoord, yCoord-0.1, { align: 'left', font: fontSize, color: displayColor });

			/* #endregion */

			let creepCount = Object.keys(Memory.creeps);
			let capacity;
			if (creepCount.length < 2)
				capacity = room.energyAvailable;
			else
				capacity = room.energyCapacityAvailable;

			/* #region  AVAILABLE VARIANTS ASSIGNMENTS */		
			if (room.energyCapacityAvailable < 500) {
				availableVariants.harvester = spawnVariants.harvester300;
				availableVariants.collector = spawnVariants.collector300;
				availableVariants.upgrader 	= spawnVariants.upgrader300;
				availableVariants.builder 	= spawnVariants.builder300;
				availableVariants.repairer 	= spawnVariants.repairer300;
				availableVariants.runner 		= spawnVariants.runner300;
			} else if (room.energyCapacityAvailable <= 800) {
				availableVariants.harvester = spawnVariants.harvester500;
				availableVariants.collector = spawnVariants.collector500;
				availableVariants.upgrader 	= spawnVariants.upgrader550;
				availableVariants.builder 	= spawnVariants.builder500;
				availableVariants.repairer 	= spawnVariants.repairer500;
				availableVariants.runner 		= spawnVariants.runner300;
				availableVariants.warrior 	= spawnVariants.warrior520;
			} else if (room.energyCapacityAvailable <= 1000) {
				availableVariants.harvester = spawnVariants.harvester800;
				availableVariants.collector = spawnVariants.collector500;
				availableVariants.upgrader 	= spawnVariants.upgrader800;
				availableVariants.builder 	= spawnVariants.builder800;
				availableVariants.repairer	= spawnVariants.repairer800;
				availableVariants.runner 		= spawnVariants.runner300;
			} else if (room.energyCapacityAvailable <= 1300) {
				availableVariants.harvester = spawnVariants.harvester800;
				availableVariants.collector = spawnVariants.collector500;
				availableVariants.upgrader 	= spawnVariants.upgrader800;
				availableVariants.builder 	= spawnVariants.builder1000;
				availableVariants.repairer 	= spawnVariants.repairer1000;
				availableVariants.runner 		= spawnVariants.runner300;
			} else if (room.energyCapacityAvailable > 1600) {
				availableVariants.harvester = spawnVariants.harvester800;
				availableVariants.collector = spawnVariants.collector500;
				availableVariants.upgrader 	= spawnVariants.upgrader800;
				availableVariants.builder 	= spawnVariants.builder1000;
				availableVariants.repairer 	= spawnVariants.repairer1000;
				availableVariants.runner 		= spawnVariants.runner300;
			}
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

			if (creepCount == 0 && rebooters.length < 1 && GOBI(room.memory.objects.storage[0]).store[RESOURCE_ENERGY] <= 1000) {
				newName = 'Rb' + (rebooters.length + 1);
				while (spawn.spawnCreep([WORK, WORK, MOVE, CARRY], newName, { memory: { role: 'rebooter', roleForQuota: 'rebooter' } }) == ERR_NAME_EXISTS) {
					newName = 'Rb' + (rebooters.length + 1 + rebooterCount);
					rebooterCount++;
				}
			} else {
				if ((collectors.length < collectorTarget) || (collectors.length <= collectorTarget && collectorDying && collectorTarget !== 0)) {
					newName = 'C' + (collectors.length + 1);
					while (spawn.spawnCreep(availableVariants.collector, newName, { memory: { role: 'collector', roleForQuota: 'collector', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
						newName = 'C' + (collectors.length + 1 + collectorCount);
						collectorCount++;
					}
				} else if ((harvesters.length < harvesterTarget) || (harvesters.length <= harvesterTarget && harvesterDying && harvesterTarget !== 0)) {
					newName = 'H' + (harvesters.length + 1);
					while (spawn.spawnCreep(availableVariants.harvester, newName, { memory: { role: 'harvester', roleForQuota: 'harvester', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
						newName = 'H' + (harvesters.length + 1 + harvesterCount);
						harvesterCount++;
					}
				} else {
					// REBOOTERS/COLLECTORS/HARVESTERS are at quota, move on to the rest:
					if ((runners.length < runnerTarget) || (runners.length <= runnerTarget && runnerDying && runnerTarget !== 0)) {
						newName = 'Rn' + (runners.length + 1);
						while (spawn.spawnCreep(availableVariants.runner, newName, { memory: { role: 'runner', roleForQuota: 'runner', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
							newName = 'Rn' + (runners.length + 1 + runnerCount);
							runnerCount++;
						}
					} else if (upgraders.length < upgraderTarget) {
						newName = 'U' + (upgraders.length + 1);
						while (spawn.spawnCreep(availableVariants.upgrader, newName, { memory: { role: 'upgrader', roleForQuota: 'upgrader', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
							newName = 'U' + (upgraders.length + 1 + upgraderCount);
							upgraderCount++;
						}
					} else if (sites.length > 0 && builders.length < builderTarget) {
						newName = 'B' + (builders.length + 1);
						while (spawn.spawnCreep(availableVariants.builder/*[WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]*/, newName, { memory: { role: 'builder', roleForQuota: 'builder', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
							newName = 'B' + (builders.length + 1 + builderCount);
							builderCount++;
						}
					} else if (repairers.length < repairerTarget) {
						newName = 'Rp' + (repairers.length + 1);
						while (spawn.spawnCreep(availableVariants.repairer, newName, { memory: { role: 'repairer', roleForQuota: 'repairer', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
							newName = 'Rp' + (repairers.length + 1 + repairerCount);
							repairerCount++;
						}
					} else if (cranes.length < craneTarget) {
						newName = 'Cn' + (cranes.length + 1);
						while (spawn.spawnCreep([CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE], newName, { memory: { role: 'crane', roleForQuota: 'crane', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
							newName = 'Cr' + (cranes.length + 1 + craneCount);
							craneCount++;
						}
					} else if (miners.length < minerTarget && room.objects.extractor) {
						newName = 'M' + (miners.length + 1);
						while (spawn.spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], newName, { memory: { role: 'miner', roleForQuota: 'miner', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
							newName = 'M' + (miners.length + 1 + minerCount);
							minerCount++;
						}
					} else if ((scientists.length < scientistTarget && room.objects.labs) /*&& room.memory.flags.doScience*/) {
						newName = 'S' + (scientists.length + 1);
						while (spawn.spawnCreep([MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY], newName, { memory: { role: 'scientist', roleForQuota: 'scientist', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
							newName = 'S' + (scientists.length + 1 + scientistCount);
							scientistCount++;
						}
					} else if ((reservers.length < reserverTarget) || (reservers.length <= reserverTarget && reserverDying && reserverTarget !== 0)) {
						console.log('spawn reserver');
						newName = 'Rv' + (reservers.length + 1);
						while (spawn.spawnCreep([MOVE, MOVE, CLAIM, CLAIM], newName, { memory: { role: 'reserver', roleForQuota: 'reserver', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
							newName = 'Rv' + (reservers.length + 1 + reserverCount);
							reserverCount++;
						}
					} else if ((remoteHarvesters.length < remoteHarvesterTarget) || (remoteHarvesters.length <= remoteHarvesterTarget && remoteHarvesterDying && remoteHarvesterTarget !== 0)) {
						newName = 'RH' + (remoteHarvesters.length + 1);
						while (spawn.spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName, { memory: { role: 'remoteharvester', roleForQuota: 'remoteharvester', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
							newName = 'RH' + (remoteHarvesters.length + 1 + remoteHarvesterCount);
							remoteHarvesterCount++;
						}
					} else if (remoteRunners.length < remoteRunnerTarget) {
						newName = 'RR' + (remoteRunners.length + 1);
						while (spawn.spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, WORK], newName, { memory: { role: 'remoterunner', roleForQuota: 'remoterunner', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
							newName = 'RR' + (remoteRunners.length + 1 + remoteRunnerCount);
							remoteRunnerCount++;
						}
					} else if (/*sites.length > 0 && */remoteBuilders.length < remoteBuilderTarget) {
						newName = 'RB' + (remoteBuilders.length + 1);
						while (spawn.spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName, { memory: { role: 'remotebuilder', roleForQuota: 'remotebuilder', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
							newName = 'RB' + (remoteBuilders.length + 1 + remoteBuilderCount);
							remoteBuilderCount++;
						}
					} else if ((remoteGuards.length < remoteGuardTarget) || (remoteGuards.length <= remoteGuardTarget && remoteGuardDying && remoteGuardTarget !== 0)) {
						newName = 'RG' + (remoteGuards.length + 1);
						while (spawn.spawnCreep(availableVariants.remoteGuard, newName, { memory: { role: 'remoteguard', roleForQuota: 'remoteguard', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
							newName = 'RG' + (remoteGuards.length + 1 + remoteGuardCount);
							remoteGuardCount++;
						}
					} else {
						//RESERVERS/REMOTE RUNNERS/HARVESTERS/BUILDERS/GUARDS are at quota, move on to defensive creeps:
						if (rangers.length < rangerTarget) {
							newName = 'Rng' + (rangers.length + 1);
							while (spawn.spawnCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE], newName, { memory: { role: 'ranger', roleForQuota: 'ranger', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
								newName = 'Rng' + (rangers.length + 1 + rangerCount);
								rangerCount++;
							}
						} else if (warriors.length < warriorTarget) {
							newName = 'War' + (warriors.length + 1);
							while (spawn.spawnCreep(/*[TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE]*/availableVariants.warrior, newName, { memory: { role: 'warrior', roleForQuota: 'warrior', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
								newName = 'War' + (warriors.length + 1 + warriorCount);
								warriorCount++;
							}
						} else if (healers.length < healerTarget) {
							newName = 'Hlr' + (healers.length + 1);
							while (spawn.spawnCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName, { memory: { role: 'healer', roleForQuota: 'healer', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
								newName = 'Hlr' + (healers.length + 1 + healerCount);
								healerCount++;
							}
						}
					}
				}
				
			}
			/* #endregion */

			// Display creep spawning information next to spawn
			if (spawn.spawning) {
		
				let spawningCreep = Game.creeps[spawn.spawning.name];
				if (!spawnAnnounced) {
					console.log('Spawning new creep: ' + spawningCreep.memory.role + ' (' + spawningCreep.name + ')');
					spawnAnnounced = true;
				}
				spawn.room.visual.text('     ' + spawningCreep.memory.role + ' - ' + spawn.spawning.remainingTime + '/' + spawn.spawning.needTime, spawn.pos.x + 1, spawn.pos.y - 1, { align: 'left', opacity: 0.8, font: 0.4 });
			} else {
				spawnAnnounced = false;
			}

			if (room.controller.level > 1)
				visualRCProgress(room.controller);
			
			room.visual.text('     Energy: ' + room.energyAvailable
			+ '/' + room.energyCapacityAvailable,
			spawn.pos.x + 1,
			spawn.pos.y - 2,
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
				//roleReserver.run(creep);
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
		}
	
		//Game.spawns['Spawn1'].room.controller.room.visual.text('L' + Game.spawns['Spawn1'].room.controller.level + ' - ' + Game.spawns['Spawn1'].room.controller.progress + '/' + Game.spawns['Spawn1'].room.controller.progressTotal, Game.spawns['Spawn1'].room.controller.pos.x + 1, Game.spawns['Spawn1'].room.controller.pos.y - 1, {align: 'left', opacity: 0.5, color: '#00ffff', font: 0.4} )
		
	}
/* #endregion */
	tickCount++;
	//console.log('Full main loop used ' + Game.cpu.getUsed().toFixed(3) + ' this tick.');
}
/* #endregion */

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