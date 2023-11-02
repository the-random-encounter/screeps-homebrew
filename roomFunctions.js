Room.prototype.calcPath 									= function calcPath(pathName, start, end, walkOnCreeps = true, serializeData = false, maxOps) {

	PathFinder.use(true);
	
	if (typeof start === 'string' || start instanceof String)
		start = Game.getObjectById(start);

	if (typeof end === 'string' || end instanceof String)
		end = Game.getObjectById(end);

	let path;
	if (maxOps)
		path = this.findPath(start, end, { ignoreCreeps: walkOnCreeps, serialize: serializeData, maxOps: maxOps });

	if (!maxOps)
		path = this.findPath(start, end, { ignoreCreeps: walkOnCreeps, serialize: serializeData });

	if (path) {
		this.memory.paths[pathName] = path;
		return path;
	} else if (!path){
		console.log('Could not generate path.');
		return null;
	}	
}
Room.prototype.cacheObjects 							= function cacheObjects() {

	// declare storage array for objects to cache
	let storageArray = [];

	// search room for each object type
	const sources 		= this.find(FIND_SOURCES	);
	const minerals 		= this.find(FIND_MINERALS	);
	const deposits 		= this.find(FIND_DEPOSITS	);
	const controller 	= this.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_CONTROLLER  } });
	const spawns 			= this.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN 			} });
	const extensions 	= this.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION 	} });
	const towers 			= this.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER 			} });
	const containers 	= this.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_CONTAINER 	} });
	const storage 		= this.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_STORAGE 		} });
	const ramparts 		= this.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_RAMPART 		} });
  const links 			= this.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_LINK				} });
	const extractors 	= this.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_EXTRACTOR 	} });
	const labs 				= this.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_LAB 				} });
	const terminal 		= this.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_TERMINAL 		} });
	const factory 		= this.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_FACTORY 		} });
	const observer 		= this.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_OBSERVER 		} });
	const powerspawn 	= this.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_POWER_SPAWN } });
	const nuker 			= this.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_NUKER 			} });

	// check if the 'objects' object exists in room memory & create it if not
	if (!this.memory.objects) {
		this.memory.objects = {};
	}
	
	// if sources are found, add their IDs to array and add array to room's 'objects' memory
	if (sources) {
		for (i = 0; i < sources.length; i++)
			storageArray.push(sources[i].id);
		if (storageArray.length) {
			this.memory.objects.sources = storageArray;
			if (storageArray.length > 1)
				console.log('Cached ' + storageArray.length + ' sources.');
			else
				console.log('Cached 1 source.');
		}
		storageArray = [];
	}

	// if minerals are found, add their IDs to array and add array to room's 'objects' memory
	if (minerals) {
		for (i = 0; i < minerals.length; i++)
			storageArray.push(minerals[i].id);
		if (storageArray.length) {
			this.memory.objects.minerals = storageArray;
			if (storageArray.length > 1)
				console.log('Cached ' + storageArray.length + ' minerals.');
			else
				console.log('Cached 1 mineral.');
		}
		storageArray = [];
	}
	
	// if deposits are found, add their IDs to array and add array to room's 'objects' memory
	if (deposits) {
		for (i = 0; i < deposits.length; i++)
			storageArray.push(deposits[i].id);
		if (storageArray.length) {
			this.memory.objects.deposits = storageArray;
			if (storageArray.length > 1)
				console.log('Cached ' + storageArray.length + ' deposits.');
			else
				console.log('Cached 1 deposit.');
		}
		storageArray = [];
	}

	// if a controller is found, add its ID to array and add array to room's 'objects' memory
	if (controller) {
		for (i = 0; i < controller.length; i++)
			storageArray.push(controller[i].id);
		if (storageArray.length) {
			this.memory.objects.controller = storageArray;
			if (storageArray.length > 1)
				console.log('Cached ' + storageArray.length + '  controllers.');
			else
				console.log('Cached 1 controller.');
		}
		storageArray = [];
	}
	
	// if a spawn is found, add its ID to array and add array to room's 'objects' memory
	if (spawns) {
		for (i = 0; i < spawns.length; i++)
			storageArray.push(spawns[i].id);
		if (storageArray.length) {
			this.memory.objects.spawns = storageArray;
			if (storageArray.length > 1) 
				console.log('Cached ' + storageArray.length + ' spawns.');
			else 
				console.log('Cached 1 spawn.');
		}
		storageArray = [];
	}	

	// if an extension is found, add its ID to array and add array to room's 'objects' memory
	if (extensions) {
		for (i = 0; i < extensions.length; i++)
			storageArray.push(extensions[i].id);
		if (storageArray.length) {
			this.memory.objects.extensions = storageArray;
			if (storageArray.length > 1) 
				console.log('Cached ' + storageArray.length + ' extensions.');
			else 
				console.log('Cached 1 extebsion.');
		}
		storageArray = [];
	}	

	// if towers are found, add their IDs to array and add array to room's 'objects' memory
	if (towers) {
		for (i = 0; i < towers.length; i++)
			storageArray.push(towers[i].id);
		if (storageArray.length) {
			this.memory.objects.towers = storageArray;
			if (storageArray.length > 1)
				console.log('Cached ' + storageArray.length + ' towers.');
			else
				console.log('Cached 1 tower.');
		}
		storageArray = [];
	}

	// if containers are found, add their IDs to array and add array to room's 'objects' memory
	if (containers) {
		for (i = 0; i < containers.length; i++)
			storageArray.push(containers[i].id);
		if (storageArray.length) {
			this.memory.objects.containers = storageArray;
			if (storageArray.length > 1)
				console.log('Cached ' + storageArray.length + ' containers.');
			else
				console.log('Cached 1 container.');
		}
		storageArray = [];
	}

	// if storage is found, add its ID to array and add array to room's 'objects' memory
	if (storage) {
		for (i = 0; i < storage.length; i++)
			storageArray.push(storage[i].id);
		if (storageArray.length) {
			this.memory.objects.storage = storageArray;
			if (storageArray.length > 1)
				console.log('Cached ' + storageArray.length + ' storages.');
			else
				console.log('Cached 1 storage.');
		}
		storageArray = [];
	}

	// if ramparts are found, add their IDs to array and add array to room's 'objects' memory
	if (ramparts) {
		for (i = 0; i < ramparts.length; i++)
			storageArray.push(ramparts[i].id);
		if (storageArray.length) {
			this.memory.objects.ramparts = storageArray;
			if (storageArray.length > 1)
				console.log('Cached ' + storageArray.length + ' ramparts.');
			else
				console.log('Cached 1 rampart.');
		}
		storageArray = [];
	}
	
	// if links are found, add their IDs to array and add array to room's 'objects' memory
	if (links) {
		for (i = 0; i < links.length; i++)
			storageArray.push(links[i].id);
		if (storageArray.length) {
			this.memory.objects.links = storageArray;
			if (storageArray.length > 1)
				console.log('Cached ' + storageArray.length + ' links.');
			else
				console.log('Cached 1 link.');
		}
		storageArray = [];
	}

	// if extractors are found, add their IDs to array and add array to room's 'objects' memory
	if (extractors) {
		for (i = 0; i < extractors.length; i++)
			storageArray.push(extractors[i].id);
		if (storageArray.length) {
			this.memory.objects.extractors = storageArray;
			if (storageArray.length > 1)
				console.log('Cached ' + storageArray.length + ' extractors.');
			else
				console.log('Cached 1 extractor.');
		}
		storageArray = [];
	}

	// if labs are found, add their IDs to array and add array to room's 'objects' memory
	if (labs) {
		for (i = 0; i < labs.length; i++)
			storageArray.push(labs[i].id);
		if (storageArray.length) {
			this.memory.objects.labs = storageArray;
			if (storageArray.length > 1)
				console.log('Cached ' + storageArray.length + ' labs.');
			else
				console.log('Cached 1 lab.');
		}
		storageArray = [];
	}

	// if terminals are found, add their IDs to array and add array to room's 'objects' memory
	if (terminal) {
		for (i = 0; i < terminal.length; i++)
			storageArray.push(terminal[i].id);
		if (storageArray.length) {
			this.memory.objects.terminal = storageArray;
			if (storageArray.length >= 1)
				console.log('Cached 1 terminal.');
		}
		storageArray = [];
	}

	// if factory are found, add their IDs to array and add array to room's 'objects' memory
	if (factory) {
		for (i = 0; i < factory.length; i++)
			storageArray.push(factory[i].id);
		if (storageArray.length) {
			this.memory.objects.factory = storageArray;
			if (storageArray.length >= 1)
				console.log('Cached 1 factory.');
		}
		storageArray = [];
	}

	// if observers are found, add their IDs to array and add array to room's 'objects' memory
	if (observer) {
		for (i = 0; i < observer.length; i++)
			storageArray.push(observer[i].id);
		if (storageArray.length) {
			this.memory.objects.observer = storageArray;
			if (storageArray.length >= 1)
				console.log('Cached 1 observer.');
		}
		storageArray = [];
	}

	// if power spawns are found, add their IDs to array and add array to room's 'objects' memory
	if (powerspawn) {
		for (i = 0; i < powerspawn.length; i++)
			storageArray.push(powerspawn[i].id);
		if (storageArray.length) {
			this.memory.objects.powerspawn = storageArray;
			if (storageArray.length >= 1)
				console.log('Cached 1 power spawn.');
		}
		storageArray = [];
	}

	// if nukers are found, add their IDs to array and add array to room's 'objects' memory
	if (nuker) {
		for (i = 0; i < nuker.length; i++)
			storageArray.push(nuker[i].id);
		if (storageArray.length) {
			this.memory.objects.nuker = storageArray;
			if (storageArray.length >= 1)
				console.log('Cached 1 nuker.');
		}
		storageArray = [];
	}

	return 'Caching objects for room ' + this.name + ' completed.';
}
Room.prototype.initTargets 								= function initTargets(array) {

	const targetArray = array || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	this.memory.targets = {};
}
Room.prototype.setQuota 									= function setQuota(roleTarget, newTarget) {
	this.setTarget(roleTarget, newTarget);
}
Room.prototype.setTarget 									= function setTarget(roleTarget, newTarget) {

	const oldTarget = this.memory.targets[roleTarget];

	console.log(oldTarget);
	this.memory.targets[roleTarget] = newTarget;

	return ('[' + this.name + ']: Set role \'' + roleTarget + '\' target to ' + newTarget + ' (was ' + oldTarget + ').');
}
Room.prototype.sendEnergy 								= function sendEnergy() {

	const linkToLocal = this.memory.objects.links[0];
	const linkFromLocal = this.memory.objects.links[1];

	if (linkFromLocal.cooldown === 0) {
		linkFromLocal.transferEnergy(linkToLocal)
		return '[' + this.name + ']: Transferring energy.';
	} else {
		return '[' + this.name + ']: On cooldown, ' + linkFromLocal.cooldown + ' ticks remaining.';
	}
}
Room.prototype.initRoom 									= function initRoom() {
	this.initRoomData();
}
Room.prototype.initRoomData 							= function initRoomData() {

	if (!this.memory.objects)
		this.memory.objects = {};
	if (!this.memory.flags)
		this.memory.flags = {};
	if (!this.memory.settings)
		this.memory.settings = {};
	if (!this.memory.paths)
		this.memory.paths = {};
	if (this.memory.objects.lastAssigned === undefined)
		this.memory.objects.lastAssigned = 0;
		
	this.cacheObjects();
	this.initRoomFlags();
	this.initRoomSettings();
	this.initTargets();
}
Room.prototype.initTargets 								= function initTargets(targetArray = false) {

	if (!targetArray) {
		if (!this.memory.targets)
			this.memory.targets = {};

		this.memory.targets.harvester = 0;
		this.memory.targets.collector = 0;
		this.memory.targets.runner = 0;
		this.memory.targets.builder = 0;
		this.memory.targets.upgrader = 0;
		this.memory.targets.repairer = 0;
		this.memory.targets.ranger = 0;
		this.memory.targets.warrior = 0;
		this.memory.targets.healer = 0;
		this.memory.targets.rebooter = 0;
		this.memory.targets.reserver = 0;
		this.memory.targets.remoteharvester = 0;
		this.memory.targets.remoterunner = 0;
		this.memory.targets.remotebuilder = 0;
		this.memory.targets.remoteguard = 0;
		this.memory.targets.crane = 0;
		this.memory.targets.miner = 0;
		this.memory.targets.scientist = 0;

	} else {
		if (targetArray.length < 18)
			return 'Not enough array indices provided.'

		this.memory.targets.harvester = targetArray[0];
		this.memory.targets.collector = targetArray[1];
		this.memory.targets.runner = targetArray[2];
		this.memory.targets.builder = targetArray[3];
		this.memory.targets.upgrader = targetArray[4];
		this.memory.targets.repairer = targetArray[5];
		this.memory.targets.ranger = targetArray[6];
		this.memory.targets.warrior = targetArray[7];
		this.memory.targets.healer = targetArray[8];
		this.memory.targets.rebooter = targetArray[9];
		this.memory.targets.reserver = targetArray[10];
		this.memory.targets.remoteharvester = targetArray[11];
		this.memory.targets.remoterunner = targetArray[12];
		this.memory.targets.remotebuilder = targetArray[13];
		this.memory.targets.remoteguard = targetArray[14];
		this.memory.targets.crane = targetArray[15];
		this.memory.targets.miner = targetArray[16];
		this.memory.targets.scientist = targetArray[17];
	}
}
Room.prototype.initFlags									= function initFlags() {
	this.initRoomFlags();
}
Room.prototype.initRoomFlags 							= function initRoomFlags() {

	if (!this.memory.flags)
		this.memory.flags = {};

	if (this.memory.flags.craneUpgrades 			=== undefined)
		this.memory.flags.craneUpgrades 				= false;

	if (this.memory.flags.repairRamparts 			=== undefined)
		this.memory.flags.repairRamparts 				= false;
	
	if (this.memory.flags.repairWalls 				=== undefined)
		this.memory.flags.repairWalls 					= false;

	if (this.memory.flags.runnerLogic 				=== undefined)
		this.memory.flags.runnerLogic 					= false;

	if (this.memory.flags.runnersDoMinerals 	=== undefined)
		this.memory.flags.runnersDoMinerals 		= false;

	if (this.memory.flags.towerRepairBasic 		=== undefined)
		this.memory.flags.towerRepairBasic 			= false;

	if (this.memory.flags.towerRepairDefenses === undefined)
		this.memory.flags.towerRepairDefenses = false;
	
	if (this.memory.flags.runnersDoPiles === undefined)
		this.memory.flags.runnersDoPiles = false;

	if (this.memory.flags.harvestersFixAdjacent === undefined)
		this.memory.flags.harvestersFixAdjacent = false;

	if (this.memory.flags.repairBasics === undefined)
		this.memory.flags.repairBasics = false;

	return '[' + this.name + ']: Room flags initialized: craneUpgrades(' + this.memory.flags.craneUpgrades + ') runnerLogic(' + this.memory.flags.runnerLogic + ') repairRamparts(' + this.memory.flags.repairRamparts + ') repairWalls(' + this.memory.flags.repairWalls + ') runnersDoMinerals(' + this.memory.flags.runnersDoMinerals + ') towerRepairBasic(' + this.memory.flags.towerRepairBasic + ') towerRepairDefenses(' + this.memory.flags.towerRepairDefenses + ') runnersDoPiles(' + this.memory.flags.runnersDoPiles + ') harvestersFixAdjacent(' + this.memory.flags.harvestersFixAdjacent + ') repairBasics(' + this.memory.flags.repairBasics + ')';
}
Room.prototype.setRoomFlags 							= function setRoomFlags([flags]) {

	const flag1 = flags[0];
	const flag2 = flags[1];
	const flag3 = flags[2];
	const flag4 = flags[3];
	const flag5 = flags[4];
	const flag6 = flags[5];
	const flag7 = flags[6];
	const flag8 = flags[7];
	const flag9 = flags[8];
	const flag10 = flags[9];

	if (flag1)
		this.memory.flags.craneUpgrades 				= flag1;

	if (flag2)
		this.memory.flags.repairRamparts 				= flag2;
	
	if (flag3)
		this.memory.flags.repairWalls 					= flag3;

	if (flag4)
		this.memory.flags.runnerLogic 					= flag4;

	if (flag5)
		this.memory.flags.runnersDoMinerals 		= flag5;

	if (flag6)
		this.memory.flags.towerRepair 					= flag6;

	if (flag7)
		this.memory.flags.towerRepairDefenses 	= flag7;

	if (flag8)
		this.memory.flags.runnersDoPiles 				= flag8;
	
	if (flag9)
		this.memory.flags.harvestersFixAdjacent = flag9;

	if (flag10)
		this.memory.flags.repairBasics 					= flag10;

	return '[' + this.name + ']: Room flags set: runnerLogic(' + this.memory.flags.runnerLogic + ') repairRamparts(' + this.memory.flags.repairRamparts + ') repairWalls(' + this.memory.flags.repairWalls + ') runnersDoMinerals(' + this.memory.flags.runnersDoMinerals + ') towerRepairBasic(' + this.memory.flags.towerRepairBasic + ') towerRepairDefenses(' + this.memory.flags.towerRepairDefenses + ') runnersDoPiles(' + this.memory.flags.runnersDoPiles + ') harvestersFixAdjacent(' + this.memory.flags.harvestersFixAdjacent + ') repairBasics(' + this.memory.flags.repairBasics + ')';
}
Room.prototype.initSettings 							= function initSettings() {
	this.initRoomSettings();
}
Room.prototype.initRoomSettings 					= function initRoomSettings() {

	if (!this.memory.settings)
		this.memory.settings = {};

	if (!this.memory.data)
		this.memory.data = {};

	if (!this.memory.settings.repairSettings)
		this.memory.settings.repairSettings = {};
	
	if (!this.memory.settings.labSettings)
		this.memory.settings.labSettings = {};

	if (!this.memory.settings.visualSettings)
		this.memory.settings.visualSettings = {};

	if (!this.memory.settings.containerSettings)
		this.memory.settings.containerSettings = {};

	if (!this.memory.settings.visualSettings.spawnInfo)
		this.memory.settings.visualSettings.spawnInfo = {};

	if (!this.memory.settings.visualSettings.roomFlags)
		this.memory.settings.visualSettings.roomFlags = {};

	if (this.memory.settings.repairSettings.repairRampartsTo === undefined)
		this.memory.settings.repairSettings.repairRampartsTo = 1;

	if (this.memory.settings.repairSettings.repairWallsTo === undefined)
		this.memory.settings.repairSettings.repairWallsTo = 1;

	if (!this.memory.settings.visualSettings.spawnInfo.alignment)
		this.memory.settings.visualSettings.spawnInfo.alignment = 'right';

	if (!this.memory.settings.visualSettings.spawnInfo.color)
		this.memory.settings.visualSettings.spawnInfo.color = '#ffffff';
	
	if (!this.memory.settings.visualSettings.spawnInfo.fontSize)
		this.memory.settings.visualSettings.spawnInfo.fontSize = 0.4;

	if (!this.memory.settings.visualSettings.roomFlags.displayCoords)
		this.memory.settings.visualSettings.roomFlags.displayCoords = [0, 49];
		
	if (!this.memory.settings.visualSettings.roomFlags.color)
		this.memory.settings.visualSettings.roomFlags.color = '#ff0033';

	if (!this.memory.settings.visualSettings.roomFlags.fontSize)
		this.memory.settings.visualSettings.roomFlags.fontSize = 0.4;

	if (!this.memory.settings.labSettings.reagentOne)
		this.memory.settings.labSettings.reagentOne = 'none';

	if (!this.memory.settings.labSettings.reagentTwo)
		this.memory.settings.labSettings.reagentTwo = 'none';

	if (!this.memory.settings.containerSettings.inboxes)
		this.memory.settings.containerSettings.inboxes = [];
	
	if (!this.memory.settings.containerSettings.outboxes)
		this.memory.settings.containerSettings.outboxes = [];

	if (this.memory.settings.containerSettings.lastInbox === undefined)
		this.memory.settings.containerSettings.lastInbox = 0;

	if (this.memory.settings.containerSettings.lastOutbox === undefined)
		this.memory.settings.containerSettings.lastOutbox = 0;
	
	if (this.memory.data.logisticalPairs === undefined)
		this.memory.data.logisticalPairs = [];

	if (this.memory.data.pairCounter === undefined)
		this.memory.data.pairCounter = 0;
	
	return '[' + this.name + ']: Room settings initialized.';
}
Room.prototype.registerLogisticalPairs = function registerLogisticalPairs() {
	let energyOutboxes = [];
	let sources = this.find(FIND_SOURCES);
	console.log('RegisterLogisticalPairs: sources: ' + sources);
	let logisticalPairs = [];
	let minerals = this.find(FIND_MINERALS)
	console.log('RegisterLogisticalPairs: minerals: ' + minerals);
	let mineralOutbox;
	if (minerals) {
		mineralOutbox = minerals[0].pos.findInRange(FIND_STRUCTURES, 3, { filter: { structureType: STRUCTURE_CONTAINER } });
		if (mineralOutbox.length >= 1)
			mineralOutbox = mineralOutbox[0].id;
	}

	console.log('RegisterLogisticalPairs: mineralOutbox: ' + mineralOutbox);
	let energyInbox = this.controller.pos.findInRange(FIND_STRUCTURES, 5, { filter: { structureType: STRUCTURE_CONTAINER } });
	if (energyInbox.length > 0)
		energyInbox = energyInbox[0].id;
	console.log('RegisterLogisticalPairs: energyInbox: ' + energyInbox);
	let storage = this.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_STORAGE } });
	if (storage.length > 0)
		storage = storage[0].id;

	console.log('RegisterLogisticalPairs: storage: ' + storage);
	let roomOutboxes = this.memory.settings.containerSettings.outboxes;
	let roomInboxes = this.memory.settings.containerSettings.inboxes;

	for (let i = 0; i < sources.length; i++) {
		let sourceBox = sources[i].pos.findInRange(FIND_STRUCTURES, 3, { filter: { structureType: STRUCTURE_CONTAINER } });
		if (sourceBox.length > 0) {
			console.log('RegisterLogisticalPairs: sourceBox: ' + sourceBox[0].id);
			energyOutboxes.push(sourceBox[0].id);
		}
	}

	console.log('RegisterLogisticalPairs: energyOutboxes: ' + energyOutboxes);

	if (energyOutboxes.length == 0 && !energyInbox)
		this.memory.data.noPairs = true;
	else {
		if (this.memory.data.noPairs)
			delete this.memory.data.noPairs;
	}

	for (let i = 0; i < energyOutboxes.length; i++) {
		if (!roomOutboxes.includes(energyOutboxes[i]))
			roomOutboxes.push(energyOutboxes[i]);
	}

	if (!roomInboxes.includes(energyInbox))
		roomInboxes.push(energyInbox);

	this.memory.settings.containerSettings.outboxes = roomOutboxes;
	this.memory.settings.containerSettings.inboxes = roomInboxes;

	if (storage) {
		for (let i = 0; i < energyOutboxes.length; i++) {
			let onePair = [energyOutboxes[i], storage, 'energy'];
			logisticalPairs.push(onePair);
		}
		let onePair = [storage, energyInbox, 'energy'];
		logisticalPairs.push(onePair);
		if (mineralOutbox.length >= 1) {
			const mineral = Object.keys(Game.getObjectById(mineralOutbox[0]).store);
			onePair = [mineralOutbox[0], storage, mineral[0]];
			logisticalPairs.push(onePair);
		}
	} else {
		for (let i = 0; i < energyOutboxes.length; i++) {
			let onePair = [energyOutboxes[i], energyInbox, 'energy'];
			logisticalPairs.push(onePair);
		}
	}

	if (!this.memory.data)
		this.memory.data = {};
	if (!this.memory.data.logisticalPairs)
		this.memory.data.logisticalPairs = [];
	if (!this.memory.data.pairCounter)
		this.memory.data.pairCounter = 0;
	console.log('Registered logistical pairs: ' + logisticalPairs);
	this.memory.data.logisticalPairs = logisticalPairs;

	return;
}
Room.prototype.setRepairRampartsTo 				= function setRepairRampartsTo(percentMax) {

	if (percentMax === undefined || percentMax < 0 || percentMax > 100)
		return 'Requires a value 0-100.';

	this.memory.settings.repairRampartsTo = percentMax;
	return 'Ramparts will now repair to ' + this.memory.settings.repairRampartsTo + '% max.';
}
Room.prototype.setRepairWallsTo 					= function setRepairWallsTo(percentMax) {

	if (percentMax === undefined || percentMax < 0 || percentMax > 100)
		return 'Requires a value 0-100.';

	this.memory.settings.repairWallsTo = percentMax;
	return 'Walls will now repair to ' + this.memory.settings.repairWallsTo + '% max.';
}
Room.prototype.setRoomSettings 						= function setRoomSettings(repairToArray, labSettingsArray) {
	
	const rampartsPercent = repairToArray[0];
	const wallsPercent 		= repairToArray[1];

	if (rampartsPercent)
		this.memory.settings.repairRampartsTo = rampartsPercent;

	if (wallsPercent)
		this.memory.settings.repairWallsTo = wallsPercent;

	return '[' + this.name + ']: Room settings set: repairRampartsTo(' + this.memory.settings.	repairRampartsTo + ') repairWallsTo(' + this.memory.settings.repairWallsTo + ')';
}
Room.prototype.setInbox 									= function setInbox(boxID) {
	let inboxMem = [];
	if (this.memory.settings.containerSettings.inboxes !== undefined)
		inboxMem = inboxMem.concat(this.memory.settings.containerSettings.inboxes);
	if (inboxMem.includes(boxID))
		return 'This container ID is already in the inbox list.';
	else {
		inboxMem.push(boxID);
		this.memory.settings.containerSettings.inboxes = inboxMem;
		return true;
	}
}
Room.prototype.setOutbox 									= function setOutbox(boxID) {
	let outboxMem = [];
	outboxMem = outboxMem.concat(this.memory.settings.containerSettings.outboxes);
	if (outboxMem.includes(boxID))
		return 'This container ID is already in the outbox list.';
	else {
		outboxMem.push(boxID);
		this.memory.settings.containerSettings.outboxes = outboxMem;
		return true;
	}
}
Room.prototype.checkInbox = function checkInbox(boxID) {
	const inboxes = this.getInboxes();

	if (inboxes.includes(boxID))
		return true;
	else
		return false;
}
Room.prototype.checkOutbox = function checkOutbox(boxID) {
	const outboxes = this.getOutboxes();

	if (outboxes.includes(boxID))
		return true;
	else
		return false;
}
Room.prototype.getInboxes 								= function getInboxes() {
	return this.memory.settings.containerSettings.inboxes;
}
Room.prototype.getOutboxes 								= function getOutboxes() {
	return this.memory.settings.containerSettings.outboxes;
}
Room.prototype.enableFlag 								= function enableFlag(flag, initIfNull = false) {
	if (this.memory.flags[flag] === undefined && initIfNull === false)
		return 'The specified flag does not exist: ' + flag;
	if (initIfNull) {
		this.memory.flags[flag] = true;
		return true;
	}
}
Room.prototype.disableFlag 								= function disableFlag(flag, initIfNull = false) {
	if (this.memory.flags[flag] === undefined && initIfNull === false)
		return 'The specified flag does not exist: ' + flag;
	if (initIfNull) {
		this.memory.flags[flag] = false;
		return false;
	}	
}
Room.prototype.toggleFlag 								= function toggleFlag(flag, initIfNull = false, defaultValue) {
	if (this.memory.flags[flag] !== undefined) {
		const logicState = this.memory.flags[flag];
		if (logicState) {
			this.memory.flags[flag] = false;
			return false;
		}
		if (!logicState) {
			this.memory.flags[flag] = true;
			return true;
		}
	} else {
		if (initIfNull) {
			this.memory.flags[flag] = defaultValue || false;
			return this.memory.flags[flag];
		} else {
			return 'The specified flag does not exist: ' + flag;
		}
	}
}
Room.prototype.enableRunnerLogic 					= function enableRunnerLogic() {
	this.memory.flags.runnerLogic = true;
	return true;
}
Room.prototype.disableRunnerLogic 				= function disableRunnerLogic() {
	this.memory.flags.runnerLogic = false;
	return false;
}
Room.prototype.toggleRunnerLogic 					= function toggleRunnerLogic() {
	const logicState = this.memory.flags.runnerLogic;
	if (logicState) {
		this.memory.flags.runnerLogic = false;
		return false;
	}
	if (!logicState) {
		this.memory.flags.runnerLogic = true;
		return true;
	}
}
Room.prototype.enableCraneUpgrades 				= function enableCraneUpgrades() {
	this.memory.flags.craneUpgrades = true;
	return true;
}
Room.prototype.disableCraneUpgrades 			= function disableCraneUpgrades() {
	this.memory.flags.craneUpgrades = false;
	return false;
}
Room.prototype.toggleCraneUpgrades 				= function toggleCraneUpgrades() {
	const logicState = this.memory.flags.craneUpgrades;
	if (logicState) {
		this.memory.flags.craneUpgrades = false;
		return false;
	}
	if (!logicState) {
		this.memory.flags.craneUpgrades = true;
		return true;
	}
}
Room.prototype.enableBoostCreeps 					= function enableBoostCreeps(dontScience = false) {
	if (this.memory.flags.doScience && !dontScience)
		return 'Cannot enable \'boostCreeps\' flag when \'doScience\' is set to true. (Provide boolean arg "true" in parameters to allow disabling of this flag.';

	if (!this.memory.flags.doScience || dontScience) {
		this.memory.flags.boostCreeps = true;
		return true;
	}
}
Room.prototype.disableBoostCreeps 				= function disableBoostCreeps() {
	this.memory.flags.boostCreeps = false;
	return false;
}
Room.prototype.toggleBoostCreeps 					= function toggleBoostCreeps(dontScience = false) {
	const logicState = this.memory.flags.boostCreeps;
	const doScienceState = this.memory.flags.doScience;
	
	if (!logicState && doScienceState && !dontScience)
		return 'Cannot enable \'boostCreeps\' flag when \'doScience\' is set to true. (Provide boolean arg "true" in parameters to allow disabling of this flag.';
		
	if (logicState) {
		this.memory.flags.boostCreeps = false;
		return false;
	}
	if (!logicState) {
		if ((doScienceState || !doScienceState) && dontScience)
			this.memory.flags.doScience = false;
		this.memory.flags.boostCreeps = true;
		return true;
	}
}
Room.prototype.enableDoScience 						= function enableDoScience() {
	this.memory.flags.doScience = true;
	return true;
}
Room.prototype.disableDoScience 					= function disableDoScience() {
	this.memory.flags.doScience = false;
	return false;
}
Room.prototype.toggleDoScience 						= function toggleDoScience() {
	const logicState = this.memory.flags.doScience;
	if (logicState) {
		this.memory.flags.doScience = false;
		return false;
	}
	if (!logicState) {
		this.memory.flags.doScience = true;
		return true;
	}
}
Room.prototype.enableTowerRepairBasic 		= function enableTowerRepairBasic() {
	this.memory.flags.towerRepairBasic = true;
	return true;
}
Room.prototype.disableTowerRepairBasic 		= function disableTowerRepairBasic() {
	this.memory.flags.towerRepairBasic = false;
	return false;
}
Room.prototype.toggleTowerRepairBasic 		= function toggleTowerRepairBasic() {
	const logicState = this.memory.flags.towerRepairBasic;
	if (logicState) {
		this.memory.flags.towerRepairBasic = false;
		return false;
	}
	if (!logicState) {
		this.memory.flags.towerRepairBasic = true;
		return true;
	}
}
Room.prototype.enableTowerRepairDefenses 	= function enableTowerRepairDefenses() {
	this.memory.flags.towerRepairDefenses = true;
	return true;
}
Room.prototype.disableTowerRepairDefenses = function disableTowerRepairDefenses() {
	this.memory.flags.towerRepairDefenses = false;
	return false;
}
Room.prototype.toggleTowerRepairDefenses 	= function toggleTowerRepairDefenses() {
	const logicState = this.memory.flags.towerRepairDefenses;
	if (logicState) {
		this.memory.flags.towerRepairDefenses = false;
		return false;
	}
	if (!logicState) {
		this.memory.flags.towerRepairDefenses = true;
		return true;
	}
}
Room.prototype.enableRunnersDoMinerals 		= function enableRunnersDoMinerals() {
	this.memory.flags.runnersDoMinerals = true;
	return true;
}
Room.prototype.disableRunnersDoMinerals 	= function disableRunnersDoMinerals() {
	this.memory.flags.runnersDoMinerals = false;
	return false;
}
Room.prototype.toggleRunnersDoMinerals 		= function toggleRunnersDoMinerals() {
	const logicState = this.memory.flags.runnersDoMinerals;
	if (logicState) {
		this.memory.flags.runnersDoMinerals = false;
		return false;
	}
	if (!logicState) {
		this.memory.flags.runnersDoMinerals = true;
		return true;
	}
}
Room.prototype.enableRepairWalls 					= function enableRepairWalls() {
	this.memory.flags.repairWalls = true;
	return true;
}
Room.prototype.disableRepairWalls 				= function disableRepairWalls() {
	this.memory.flags.repairWalls = false;
	return false;
}
Room.prototype.toggleRepairWalls 					= function toggleRepairWalls() {
	const logicState = this.memory.flags.repairWalls;
	if (logicState) {
		this.memory.flags.repairWalls = false;
		return false;
	}
	if (!logicState) {
		this.memory.flags.repairWalls = true;
		return true;
	}
}
Room.prototype.enableRepairRamparts 			= function enableRepairRamparts() {
	this.memory.flags.repairRamparts = true;
	return true;
}
Room.prototype.disableRepairRamparts 			= function disableRepairRamparts() {
	this.memory.flags.repairRamparts = false;
	return false;
}
Room.prototype.toggleRepairRamparts 			= function toggleRepairRamparts() {
	const logicState = this.memory.flags.repairRamparts;
	if (logicState) {
		this.memory.flags.repairRamparts = false;
		return false;
	}
	if (!logicState) {
		this.memory.flags.repairRamparts = true;
		return true;
	}
}
Room.prototype.enableRepairBasics 				= function enableRepairBasics() {
	this.memory.flags.repairBasics = true;
	return true;
}
Room.prototype.disableRepairBasics 				= function disableRepairBasics() {
	this.memory.flags.repairBasics = false;
	return false;
}
Room.prototype.toggleRepairBasics 				= function toggleRepairBasics() {
	const logicState = this.memory.flags.repairBasics;
	if (logicState) {
		this.memory.flags.repairBasics = false;
		return false;
	}
	if (!logicState) {
		this.memory.flags.repairBasics = true;
		return true;
	}
}
Room.prototype.calcLabReaction 						= function calcLabReaction() {

	const baseReg1 = this.memory.settings.labSettings.reagentOne;
	const baseReg2 = this.memory.settings.labSettings.reagentTwo;
	let outputChem;

	// DETERMINE OUTPUT COMPOUND BASED ON INPUT COMPOUNDS
	if (baseReg1 === RESOURCE_OXYGEN || baseReg2 === RESOURCE_OXYGEN) {
		if (baseReg1 === RESOURCE_HYDROGEN || baseReg2 === RESOURCE_HYDROGEN)
			outputChem = RESOURCE_HYDROXIDE;
		else if (baseReg1 === RESOURCE_UTRIUM || baseReg2 === RESOURCE_UTRIUM)
			outputChem = RESOURCE_UTRIUM_OXIDE;
		else if (baseReg1 === RESOURCE_KEANIUM || baseReg2 === RESOURCE_KEANIUM)
			outputChem = RESOURCE_KEANIUM_OXIDE;
		else if (baseReg1 === RESOURCE_LEMERGIUM || baseReg2 === RESOURCE_LEMERGIUM)
			outputChem = RESOURCE_LEMERGIUM_OXIDE;
		else if (baseReg1 === RESOURCE_ZYNTHIUM || baseReg2 === RESOURCE_ZYNTHIUM)
			outputChem = RESOURCE_ZYNTHIUM_OXIDE;
		else if (baseReg1 === RESOURCE_GHODIUM || baseReg2 === RESOURCE_GHODIUM)
			outputChem = RESOURCE_GHODIUM_OXIDE;
	} else if (baseReg1 === RESOURCE_HYDROGEN || baseReg2 === RESOURCE_HYDROGEN) {
		if (baseReg1 === RESOURCE_UTRIUM || baseReg2 === RESOURCE_UTRIUM)
			outputChem = RESOURCE_UTRIUM_HYDRIDE;
		else if (baseReg1 === RESOURCE_KEANIUM || baseReg2 === RESOURCE_KEANIUM)
			outputChem = RESOURCE_KEANIUM_HYDRIDE;
		else if (baseReg1 === RESOURCE_LEMERGIUM || baseReg2 === RESOURCE_LEMERGIUM)
			outputChem = RESOURCE_LEMERGIUM_HYDRIDE;
		else if (baseReg1 === RESOURCE_ZYNTHIUM || baseReg2 === RESOURCE_ZYNTHIUM)
			outputChem = RESOURCE_ZYNTHIUM_HYDRIDE;
		else if (baseReg1 === RESOURCE_GHODIUM || baseReg2 === RESOURCE_GHODIUM)
			outputChem = RESOURCE_GHODIUM_HYDRIDE;
	} else if (baseReg1 === RESOURCE_ZYNTHIUM || baseReg2 === RESOURCE_ZYNTHIUM) {
		if (baseReg1 === RESOURCE_KEANIUM || baseReg2 === RESOURCE_KEANIUM)
			outputChem = RESOURCE_ZYNTHIUM_KEANITE;
	} else if (baseReg1 === RESOURCE_UTRIUM || baseReg2 === RESOURCE_UTRIUM) {
		if (baseReg1 === RESOURCE_LEMERGIUM || baseReg2 === RESOURCE_LEMERGIUM)
			outputChem = RESOURCE_UTRIUM_LEMERGITE;
	} else if (baseReg1 === RESOURCE_ZYNTHIUM_KEANITE || baseReg2 === RESOURCE_ZYNTHIUM_KEANITE) {
		if (baseReg1 === RESOURCE_UTRIUM_LEMERGITE || baseReg2 === RESOURCE_UTRIUM_LEMERGITE)
			outputChem = RESOURCE_GHODIUM;
	} else if (baseReg1 === RESOURCE_HYDROXIDE || baseReg2 === RESOURCE_HYDROXIDE) {
		if (baseReg1 === RESOURCE_UTRIUM_HYDRIDE || baseReg2 === RESOURCE_UTRIUM_HYDRIDE)
			outputChem = RESOURCE_UTRIUM_ACID;
		if (baseReg1 === RESOURCE_UTRIUM_OXIDE || baseReg2 === RESOURCE_UTRIUM_OXIDE)
			outputChem = RESOURCE_UTRIUM_ALKALIDE;
		if (baseReg1 === RESOURCE_KEANIUM_HYDRIDE || baseReg2 === RESOURCE_KEANIUM_HYDRIDE)
			outputChem = RESOURCE_KEANIUM_ACID;
		if (baseReg1 === RESOURCE_KEANIUM_OXIDE || baseReg2 === RESOURCE_KEANIUM_OXIDE)
			outputChem = RESOURCE_KEANIUM_ALKALIDE;
		if (baseReg1 === RESOURCE_LEMERGIUM_HYDRIDE || baseReg2 === RESOURCE_LEMERGIUM_HYDRIDE)
			outputChem = RESOURCE_LEMERGIUM_ACID;
		if (baseReg1 === RESOURCE_LEMERGIUM_OXIDE || baseReg2 === RESOURCE_LEMERGIUM_OXIDE)
			outputChem = RESOURCE_LEMERGIUM_ALKALIDE;
		if (baseReg1 === RESOURCE_ZYNTHIUM_HYDRIDE || baseReg2 === RESOURCE_ZYNTHIUM_HYDRIDE)
			outputChem = RESOURCE_ZYNTHIUM_ACID;
		if (baseReg1 === RESOURCE_ZYNTHIUM_OXIDE || baseReg2 === RESOURCE_ZYNTHIUM_OXIDE)
			outputChem = RESOURCE_ZYNTHIUM_ALKALIDE;
		if (baseReg1 === RESOURCE_GHODIUM_HYDRIDE || baseReg2 === RESOURCE_GHODIUM_HYDRIDE)
			outputChem = RESOURCE_GHODIUM_ACID;
		if (baseReg1 === RESOURCE_GHODIUM_OXIDE || baseReg2 === RESOURCE_GHODIUM_OXIDE)
			outputChem = RESOURCE_GHODIUM_ALKALIDE;
	} else if (baseReg1 === RESOURCE_CATALYST || baseReg2 === RESOURCE_CATALYST) {
		if (baseReg1 === RESOURCE_UTRIUM_ACID || baseReg2 == RESOURCE_UTRIUM_ACID)
			outputChem = RESOURCE_CATALYZED_UTRIUM_ACID;
		if (baseReg1 === RESOURCE_UTRIUM_ALKALIDE || baseReg2 == RESOURCE_UTRIUM_ALKALIDE)
			outputChem = RESOURCE_CATALYZED_UTRIUM_ALKALIDE;
		if (baseReg1 === RESOURCE_KEANIUM_ACID || baseReg2 == RESOURCE_KEANIUM_ACID)
			outputChem = RESOURCE_CATALYZED_KEANIUM_ACID;
		if (baseReg1 === RESOURCE_KEANIUM_ALKALIDE || baseReg2 == RESOURCE_KEANIUM_ALKALIDE)
			outputChem = RESOURCE_CATALYZED_KEANIUM_ALKALIDE;
		if (baseReg1 === RESOURCE_LEMERGIUM_ACID || baseReg2 == RESOURCE_LEMERGIUM_ACID)
			outputChem = RESOURCE_CATALYZED_LEMERGIUM_ACID;
		if (baseReg1 === RESOURCE_LEMERGIUM_ALKALIDE || baseReg2 == RESOURCE_LEMERGIUM_ALKALIDE)
			outputChem = RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE;
		if (baseReg1 === RESOURCE_ZYNTHIUM_ACID || baseReg2 == RESOURCE_ZYNTHIUM_ACID)
			outputChem = RESOURCE_CATALYZED_ZYNTHIUM_ACID;
		if (baseReg1 === RESOURCE_ZYNTHIUM_ALKALIDE || baseReg2 == RESOURCE_ZYNTHIUM_ALKALIDE)
			outputChem = RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE;
		if (baseReg1 === RESOURCE_GHODIUM_ACID || baseReg2 == RESOURCE_GHODIUM_ACID)
			outputChem = RESOURCE_CATALYZED_GHODIUM_ACID;
		if (baseReg1 === RESOURCE_GHODIUM_ALKALIDE || baseReg2 == RESOURCE_GHODIUM_ALKALIDE)
			outputChem = RESOURCE_CATALYZED_GHODIUM_ALKALIDE;
	}
	
	return outputChem;
}
Room.prototype.registerOutpost 						= function registerOutpost(roomName) {
	if (!this.memory.outposts)
		this.memory.outposts = {};
	if (!this.memory.outposts.roomList)
		this.memory.outposts.roomList = [];
	if (!this.memory.outposts.registry)
		this.memory.outposts.registry = {};
	if (!this.memory.outposts.aggregateSourceList)
		this.memory.outposts.aggregateSourceList = [];
	if (!this.memory.outposts.aggLastAssigned)
		this.memory.outposts.aggLastAssigned = 0;

	let currentOutpostList = this.memory.outposts.roomList;
	let exits;
	let outpostRoomName;
	let outpostDirection;

	if (typeof roomName === 'number') {
		exits = Game.map.describeExits(this.name);
		outpostRoomName = exits[roomName.toString()];

		switch (roomName) {
			case 1:
				outpostDirection = TOP;
				break;
			case 3:
				outpostDirection = RIGHT;
				break;
			case 5:
				outpostDirection = BOTTOM;
				break;
			case 7:
				outpostDirection = LEFT;
				break;
			default:
				return '[' + this.name + ']: You did not specify a valid room name or direction (numeric or string).';
		}
	} else if (typeof roomName === 'string') {
		exits = Game.map.describeExits()
		switch (roomName) {
			case 'north':
				outpostDirection = TOP;
				break;
			case 'east':
				outpostDirection = RIGHT;
				break;
			case 'south':
				outpostDirection = BOTTOM;
				break;
			case 'west':
				outpostDirection = LEFT;
				break;
			default:
				if (Game.map.describeExits(roomName) === null)
					return '[' + this.name + ']: You did not specify a valid room name or direction (numeric or string).'
			}
	} else
		return '[' + this.name + ']: You must provide a valid room name or direction (numeric or string). Other data types are not supported.';

	if (currentOutpostList.includes(outpostRoomName))
		return '[' + this.name + ']: This outpost is already registered.';

	const homeRoomName = this.name;
		
	const newOutpost = {
		name: outpostRoomName,
		homeRoom: homeRoomName,
		sources: Game.rooms[outpostRoomName].memory.objects.sources || null,
		lastAssigned: 0,
		direction: outpostDirection,
		rallyPoint: createRoomFlag(outpostRoomName)
	}
	this.memory.outposts.aggregateSourceList = this.memory.outposts.aggregateSourceList.concat(newOutpost.sources);
	this.memory.outposts.registry[outpostRoomName] = newOutpost;
	
	currentOutpostList.push(outpostRoomName);
	this.memory.outposts.roomList = currentOutpostList;

	return '[' + this.name + ']: Outpost at ' + outpostRoomName + ' successfully registered.';
}