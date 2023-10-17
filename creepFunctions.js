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

Creep.prototype.harvestEnergy = function harvestEnergy() {
	let storedSource = Game.getObjectById(this.memory.source);

	if (!storedSource || (!storedSource.pos.getOpenPositions().length && !this.pos.isNearTo(storedSource))) {
		delete this.memory.source;
		storedSource = this.findEnergySource();
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

	const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
			if (target) {
				if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target);
				}
			}
}

Creep.prototype.pickupClosestEnergy = function pickupClosestEnergy() {
	
	const containersWithEnergy = this.room.find(FIND_STRUCTURES, {
		filter: (i) => i.structureType == (STRUCTURE_CONTAINER &&
			i.store[RESOURCE_ENERGY] > 0)
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

/*
Creep.prototype.renewSelf = function renewSelf() {

	if (this.ticksToLive <= 30) {
		this.memory.originalrole = this.memory.role;
		this.memory.role = 'renew';
	}
}
*/

/*
Creep.prototype.findTwoSource = function findTwoSource() {
	sourceId = '5bbcaca89099fc012e635f2c';
	this.memory.source = sourceId;

	if (this.pos.isNearTo(sourceId)) {
			this.harvest(sourceId);
		} else {
			this.moveTo(sourceId, { visualizePathStyle: { stroke: '#ffaa00' } });
		}
}

Creep.prototype.findOneSource = function findOneSource() {
	sourceId = '5bbcaca89099fc012e635f2d';
	this.memory.source = sourceId;

	if (this.pos.isNearTo(sourceId)) {
			this.harvest(sourceId);
		} else {
			this.moveTo(sourceId, { visualizePathStyle: { stroke: '#ffaa00' } });
		}
}
*/