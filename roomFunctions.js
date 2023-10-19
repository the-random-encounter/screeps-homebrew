Room.prototype.cacheObjects = function cacheObjects() {

	// declare storage array for objects to cache
	let storageArray = [];

	// search room for each object type
	let sources 		= this.find(FIND_SOURCES	);
	let minerals 		= this.find(FIND_MINERALS	);
	let deposits 		= this.find(FIND_DEPOSITS	);
	let controller 	= this.find(FIND_STRUCTURES		, { filter: { structureType: STRUCTURE_CONTROLLER } });
	let spawn 			= this.find(FIND_STRUCTURES		,	{ filter: { structureType: STRUCTURE_SPAWN 			} });
	let towers 			= this.find(FIND_STRUCTURES		, { filter: { structureType: STRUCTURE_TOWER 			} });
	let containers 	= this.find(FIND_STRUCTURES		, { filter: { structureType: STRUCTURE_CONTAINER 	} });
	let storage 		= this.find(FIND_STRUCTURES		, { filter: { structureType: STRUCTURE_STORAGE 		} });

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
				console.log('Cahced 1 source.');
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
				console.log('Cahced 1 mineral.');
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
				console.log('Cahced 1 deposit.');
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
				console.log('Cahced 1 controller.');
		}
		storageArray = [];
	}
	
	// if a spawn is found, add its ID to array and add array to room's 'objects' memory
	if (spawn) {
		for (i = 0; i < spawn.length; i++)
			storageArray.push(spawn[i].id);
		if (storageArray.length) {
			this.memory.objects.spawn = storageArray;
			if (storageArray.length > 1) 
				console.log('Cached ' + storageArray.length + ' spawns.');
			else 
				console.log('Cahced 1 spawn.');
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
				console.log('Cahced 1 tower.');
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
				console.log('Cahced 1 container.');
		}
		storageArray = [];
	}

	// if storage is found, add its ID to array and add array to room's 'objects' memory
	if (storage) {
		for (i = 0; i < storage.length; i++)
			storageArray.push(towers[i].id);
		if (storageArray.length) {
			this.memory.objects.storage = storageArray;
			if (storageArray.length > 1)
				console.log('Cached ' + storageArray.length + ' storages.');
			else
				console.log('Cahced 1 storage.');
		}
		storageArray = [];
	}

	return 'Complete';
}