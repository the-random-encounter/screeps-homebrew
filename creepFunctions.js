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

Creep.prototype.assignHarvestSource = function assignHarvestSource() {

	const room = this.room;

	if (!room.memory.objects)
		room.cacheObjects();

	const roomSources = room.memory.objects.sources;

	if (room.memory.objects.lastAssigned == undefined) {
		room.memory.objects.lastAssigned = 0;
		console.log('Creating \'lastAssigned\' memory object.')
	}
	
	let nextAssigned = room.memory.objects.lastAssigned + 1;
	
	if (nextAssigned >= roomSources.length) {
		nextAssigned = 0;
	}

	let assignedSource = roomSources[nextAssigned];

	this.memory.source = assignedSource;
	room.memory.objects.lastAssigned = room.memory.objects.lastAssigned + 1;

	if (room.memory.objects.lastAssigned >= roomSources.length) {
		room.memory.objects.lastAssigned = 0
	}

	console.log('Assigned creep ' + this.name + ' to source ID ' + assignedSource)

	return assignedSource;

}

Creep.prototype.harvestEnergy = function harvestEnergy() {
	let storedSource = Game.getObjectById(this.memory.source);

	if (!storedSource /*|| (!storedSource.pos.getOpenPositions().length && !this.pos.isNearTo(storedSource))*/) {
		delete this.memory.source;
		storedSource = this.assignHarvestSource();
		//storedSource = this.findEnergySource();
	}
	
	if (storedSource) {
		if (this.pos.isNearTo(storedSource)) {
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