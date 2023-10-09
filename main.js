var roleBuilder 		= 	require('roles.building');
var roleCollector 	= 	require('roles.mining');
var roleHarvester 	= 	require('roles.mining');
var roleMiner 			= 	require('roles.mining');
var roleUpgrader	 	= 	require('roles.building');

const creepFunctions = require('creepFunctions');
	
module.exports.loop = function () {

	let dailyHarv = 0;
	let dailyUpgr = 0;
	let dailyBuil = 0;
	let dailyMine = 0;
	let dailyColl = 0;
	let dailyGath = 0;

	for (var name in Memory.creeps) {
		if (!Game.creeps[name]) {
			delete Memory.creeps[name];
			console.log('Clearing non-existant creep memory:', name);
		}
	}

	_.forEach(Game.rooms, function (roomName) {
		let room = Game.rooms[roomName];
		if (room && room.controller && room.controller.my) {

			let builderTarget 	= _.get(room.memory, ['census', 'builder'		], 3);
			let collectorTarget = _.get(room.memory, ['census', 'collector'	], 1);
			let harvesterTarget = _.get(room.memory, ['census', 'harvester'	], 2);
			let minerTarget 		= _.get(room.memory, ['census', 'miner'			], 5);
			let upgraderTarget = _.get(room.memory, ['census', 'upgrader'], 2);
			let gathererTarget = _.get(room.memory, ['census', 'gatherer'], 1);

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
}