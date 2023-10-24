Creep.prototype.findEnergySource = function findEnergySource() {
	
	let sources = this.room.find(FIND_SOURCES);
			
	if (sources.length) {
		
		let source = _.find(sources, function (s) {
			return s.pos.getOpenPositions().length == 1 || s.pos.getOpenPositions().length > 0 && !s.room.lookForAtArea(LOOK_CREEPS, s.pos.y - 1, s.pos.x - 1, s.pos.y + 1, s.pos.x + 1, true).length
		});

		
		//nearbyCreeps = this.room.lookForAtArea(LOOK_CREEPS, source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true)
		
		//this.room.memory.nearbyObj = nearbyCreeps;
		//console.log(nearbyCreeps);
		
		if (source) {
			this.memory.source = source.id;
		
			return source;
		} else {
		    source = _.find(sources, function (s) {
			return s.pos.getOpenPositions().length == 1 || s.pos.getOpenPositions().length > 0 
		});
			this.memory.source = source.id
			return source;
		}
	}
}

Creep.prototype.assignHarvestSource = function assignHarvestSource(noIncrement) {

	const room = this.room;
	const LA = room.memory.objects.lastAssigned;

	if (!room.memory.objects)
		room.cacheObjects();

	if (this.role == 'miner') {
		const assignedMineral = room.memory.objects.minerals[0];
		console.log('Assigned miner ' + this.name + ' to ' + assignedMineral);
		return assignedMineral;
	}
	const roomSources = room.memory.objects.sources;

	if (room.memory.objects.lastAssigned == undefined) {
		room.memory.objects.lastAssigned = 0;
		console.log('Creating \'lastAssigned\' memory object.')
	}
	
	let nextAssigned = room.memory.objects.lastAssigned + 1;
	
	if (nextAssigned >= roomSources.length)
		nextAssigned = 0;

	let assignedSource = roomSources[nextAssigned];

	this.memory.source = assignedSource;

	room.memory.objects.lastAssigned = room.memory.objects.lastAssigned + 1;

	if (room.memory.objects.lastAssigned >= roomSources.length)
		room.memory.objects.lastAssigned = 0;

	console.log('Assigned harvester ' + this.name + ' to source ID ' + assignedSource)

	if (noIncrement)
		room.memory.objects.lastAssigned = LA;

	return assignedSource;

}

Creep.prototype.assignRemoteHarvestSource = function assignRemoteHarvestSource(noIncrement) {
	const room = this.room;
	const LA = room.memory.objects.lastAssigned;

	if (!room.memory.objects)
		room.cacheObjects();

	const roomSources = Memory.rooms.E57S51.objects.sources;

	if (room.memory.objects.lastAssigned == undefined) {
		room.memory.objects.lastAssigned = 0;
		console.log('Creating \'lastAssigned\' memory object.')
	}
	
	let nextAssigned = room.memory.objects.lastAssigned;
	
	if (nextAssigned >= roomSources.length)
		nextAssigned = 0;

	let assignedSource = roomSources[nextAssigned];

	this.memory.source = assignedSource;

	if (room.memory.objects.lastAssigned >= roomSources.length)
		room.memory.objects.lastAssigned = 0

	console.log('Assigned remote harvester ' + this.name + ' to remote source ID ' + assignedSource)

	if (noIncrement)
		room.memory.objects.lastAssigned = LA;

	return assignedSource;

}

Creep.prototype.unloadEnergy = function unloadEnergy() {

	if (this.memory.bucket) {
		const target = Game.getObjectById(this.memory.bucket);
		this.transfer(target, RESOURCE_ENERGY);
		return;
	} else {
		const nearbyObj = this.room.find(FIND_STRUCTURES, { filter: (i) => (i.structureType == STRUCTURE_STORAGE || i.structureType == STRUCTURE_CONTAINER) && i.pos.isNearTo(this) });
	
		if (!nearbyObj.length) {
			if (this.drop(RESOURCE_ENERGY) == 0)
				console.log(this.name + ' dropped.');
			return;
		} else {
			const target = nearbyObj[0];
			this.memory.bucket = target.id;
			this.transfer(target, RESOURCE_ENERGY);
			return;
		}
	}
}

Creep.prototype.harvestEnergy = function harvestEnergy() {
	let storedSource = Game.getObjectById(this.memory.source);

	if (!storedSource) {
		delete this.memory.source;
		if (this.memory.role == 'harvester') {
			storedSource = this.assignHarvestSource(false);
		} else if (this.memory.role == 'remoteharvester') {
			storedSource = this.assignRemoteHarvestSource(false);
		}
	}
	
	if (storedSource) {
		if (this.pos.isNearTo(storedSource)) {
			if (storedSource.energy == 0 && this.store.getUsedCapacity() > 0) {
				this.unloadEnergy();
			}
			this.harvest(storedSource);
		} else {
			this.moveTo(storedSource, { visualizePathStyle: { stroke: '#ffaa00' } });
		}
	}
}

Creep.prototype.getDroppedResource = function getDroppedResource() {

	const target = this.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
			if (target) {
				if (this.pickup(target) == ERR_NOT_IN_RANGE) {
					this.moveTo(target);
				}
			}
}

Creep.prototype.pickupClosestEnergy = function pickupClosestEnergy() {
	
	const containersWithEnergy = this.room.find(FIND_STRUCTURES, {
		filter: (i) => (i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE) &&
			i.store[RESOURCE_ENERGY] > 0
	});

	const droppedPiles = this.room.find(FIND_DROPPED_RESOURCES);
	const resourceList = containersWithEnergy.concat(droppedPiles);
	const target = this.pos.findClosestByRange(resourceList);

	if (target) {
			if (this.pickup(target) == ERR_NOT_IN_RANGE) {
					this.moveTo(target);
			}
	}
}

Creep.prototype.unloadMineral = function unloadMineral() {

	const mineral = Object.keys(this.store).toString();
	
	if (this.memory.bucket) {
		const target = Game.getObjectById(this.memory.bucket);
		this.transfer(target, mineral);
		return;
	} else {
		const nearbyObj = this.room.find(FIND_STRUCTURES, { filter: (i) => (i.structureType == STRUCTURE_STORAGE || i.structureType == STRUCTURE_CONTAINER) && i.pos.isNearTo(this) });
	
		if (!nearbyObj.length) {
			if (this.drop(mineral) == 0)
				console.log(this.name + ' dropped ' + mineral + '.');
			return;
		} else {
			const target = nearbyObj[0];
			this.memory.bucket = target.id;
			this.transfer(target, mineral);
			return;
		}
	}
}

Creep.prototype.harvestMineral = function harvestMineral() {
	
	let storedMineral = Game.getObjectById(this.memory.extractor);

	if (!storedMineral) {
		delete this.memory.extractor;
		if (this.memory.role == 'miner')
			storedMineral = this.assignHarvestSource(false)
	}
	
	if (storedMineral) {
		if (this.pos.isNearTo(storedMineral)) {
			if (storedMineral.mineralAmount == 0 && this.store.getUsedCapacity() > 0) {
				this.unloadMineral();
			}
			this.harvest(storedMineral);
		} else {
			this.moveTo(storedMineral, { visualizePathStyle: { stroke: '#ffaa00' } });
		}
	}
}