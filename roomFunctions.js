Room.prototype.cacheObjects = function cacheObjects() {

	// begin timer for function time cost calculation
	let timer = Date.now();

	// declare storage array for objects to cache
	let storageArray = [];

	// search room for each object type
	const sources 		= this.find(FIND_SOURCES	);
	const minerals 		= this.find(FIND_MINERALS	);
	const deposits 		= this.find(FIND_DEPOSITS	);
	const controller 	= this.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_CONTROLLER  } });
	const spawns 			= this.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN 			} });
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
			if (storageArray.length > 1)
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
			if (storageArray.length > 1)
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
			if (storageArray.length > 1)
				console.log('Cached ' + storageArray.length + ' observers.');
			else
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
			if (storageArray.length > 1)
				console.log('Cached ' + storageArray.length + ' power spawns.');
			else
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
			if (storageArray.length > 1)
				console.log('Cached 1 nuker.');
		}
		storageArray = [];
	}

	timer = (Date.now() - timer);
	return 'Caching objects for room ' + this.name + ' completed in ' + timer + 'ms.';
}


Room.prototype.initTargets = function initTargets(array) {

	const targetArray = array || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	this.memory.targets = {};
}

Room.prototype.setTarget = function setTarget(roleTarget, newTarget) {

	const oldTarget = this.memory.targets[roleTarget];

	console.log(oldTarget);
	this.memory.targets[roleTarget] = newTarget;

	return ('[' + this.name + ']: Set role \'' + roleTarget + '\' target to ' + newTarget + ' (was ' + oldTarget + ').');
}

Room.prototype.sendEnergy = function sendEnergy() {

	const linkToLocal = this.memory.objects.links[0];
	const linkFromLocal = this.memory.objects.links[1];

	if (linkFromLocal.cooldown === 0) {
		linkFromLocal.transferEnergy(linkToLocal)
		return '[' + this.name + ']: Transferring energy.';
	} else {
		return '[' + this.name + ']: On cooldown, ' + linkFromLocal.cooldown + ' ticks remaining.';
	}
}

Room.prototype.initRoomFlags = function initRoomFlags(flag1 = false, flag2 = false, flag3 = false) {

	if (this.memory.flags.runnerLogic === undefined)
		this.memory.flags.runnerLogic = flag1;

	if (this.memory.flags.repairRamparts === undefined)
		this.memory.flags.repairRamparts = flag2;

	if (this.memory.flags.towerRepair === undefined)
		this.memory.flags.towerRepair = flag3;

	return '[' + this.name + ']: Room flags initialized: runnerLogic(' + flag1 + ') repairRamparts(' + flag2 + ') towerRepair(' + flag3 + ')';
}

Room.prototype.setRoomFlags = function setRoomFlags(flag1 = false, flag2 = false, flag3 = false) {

		this.memory.flags.runnerLogic = flag1;

		this.memory.flags.repairRamparts = flag2;

		this.memory.flags.towerRepair = flag3;

	return '[' + this.name + ']: Room flags set: runnerLogic(' + flag1 + ') repairRamparts(' + flag2 + ') towerRepair(' + flag3 + ')';
}