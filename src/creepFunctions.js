Creep.prototype.findEnergySource = function findEnergySource() {
	
	let sources = this.room.find(FIND_SOURCES);
			
	if (sources.length) {
		
		let source = _.find(sources, function (s) {
			return s.pos.getOpenPositions().length == 1 || s.pos.getOpenPositions().length > 0 && !s.room.lookForAtArea(LOOK_CREEPS, s.pos.y - 1, s.pos.x - 1, s.pos.y + 1, s.pos.x + 1, true).length
		});
		
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

	if (this.memory.role == 'miner') {
		const assignedMineral = room.memory.objects.minerals[0];
		console.log('Assigned miner ' + this.name + ' to mineral ID ' + assignedMineral);
		this.memory.mineral = assignedMineral;
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

	console.log('Assigned harvester ' + this.name + ' to source #' + (LA + 1) + ' (ID: ' + assignedSource + ') in room ' + this.room.name)

	if (noIncrement)
		room.memory.objects.lastAssigned = LA;

	return assignedSource;

}

Creep.prototype.assignRemoteHarvestSource = function assignRemoteHarvestSource(roomName, noIncrement = false) {
	const room = Memory.rooms[roomName];

	console.log(roomName);
	let LA = Game.rooms[this.memory.homeRoom].memory.outposts.registry[roomName].lastAssigned;

	//if (!room.objects)
	//	room.cacheObjects();

	const roomSources = Game.rooms[this.memory.homeRoom].memory.outposts.registry[roomName].sources;

	if (this.memory.role == 'remoteminer') {
		const assignedMineral = room.objects.minerals[0];
		console.log('Assigned remote miner ' + this.name + ' to remote mineral ID ' + assignedMineral);
		return assignedMineral;
	}

	if (Game.rooms[this.memory.homeRoom].memory.outposts.registry[roomName].lastAssigned === undefined) {
		Game.rooms[this.memory.homeRoom].memory.outposts.registry[roomName].lastAssigned = 0;
		console.log('Creating \'aggLastAssigned\' memory outpost object.')
	}
	
	let nextAssigned = Game.rooms[this.memory.homeRoom].memory.outposts.registry[roomName].lastAssigned + 1;
	
	if (nextAssigned >= roomSources.length) {
		nextAssigned = 0;
		HEAP_MEMORY.outpostRoomCounter++;
	}

	let assignedSource = roomSources[nextAssigned];

	this.memory.source = assignedSource;

	if (Game.rooms[this.memory.homeRoom].memory.outposts.registry[roomName].lastAssigned >= roomSources.length)
		Game.rooms[this.memory.homeRoom].memory.outposts.registry[roomName].lastAssigned = 0;

	console.log('Assigned remote harvester ' + this.name + ' to remote source #' + (LA + 1) + ' (ID: ' + assignedSource + ') in room ' + roomName);

	if (noIncrement)
		Game.rooms[this.memory.homeRoom].memory.outposts.registry[roomName].lastAssigned = LA;

	return assignedSource;

}

Creep.prototype.unloadEnergy = function unloadEnergy() {

	if (this.memory.bucket) {
		const target = Game.getObjectById(this.memory.bucket);

		if (target.hits == target.hitsMax) {
			this.say('⛏️');
			this.transfer(target, RESOURCE_ENERGY);
		}
		else {
			this.say('🔧');
			this.repair(target);
		}
		return;
	} else {
		const sourceTarget = Game.getObjectById(this.memory.source);
		const nearbyObj = sourceTarget.pos.findClosestByRange(FIND_STRUCTURES, { filter: (obj) => ( obj.structureType == STRUCTURE_LINK || obj.structureType == STRUCTURE_STORAGE || obj.structureType == STRUCTURE_CONTAINER)/* && obj.pos.isNearTo(this)*/ });
	
		if (nearbyObj.structureType == STRUCTURE_CONTAINER) {
			if (!this.room.checkOutbox(nearbyObj.id))
				this.room.setOutbox(nearbyObj.id);
		}

		if (!nearbyObj) {
			if (this.drop(RESOURCE_ENERGY) == 0) {
				this.say('🗑️');
				console.log(this.name + ' dropped.');
			}
			return;
		} else {
			//const target = nearbyObj[0];
			this.memory.bucket = nearbyObj.id;
			if (nearbyObj.hits == nearbyObj.hitsMax) {
				if (this.isNearbyTo(nearbyObj)) {
					this.say('⛏️');
					this.transfer(nearbyObj, RESOURCE_ENERGY);
				} else {
					this.moveTo(nearbyObj);
				}
			}
			else {
				this.say('🔧');
				this.repair(nearbyObj);
			}
			return;
		}
	}
}

Creep.prototype.harvestEnergy = function harvestEnergy() {
	let storedSource = Game.getObjectById(this.memory.source);

	if (!storedSource) {
		delete this.memory.source;
		if (this.memory.role == 'harvester' || this.memory.role == 'miner') {
			storedSource = this.assignHarvestSource(false);
		} else if (this.memory.role == 'remoteharvester' || this.memory.role == 'remoteminer') {
			console.log(Game.rooms[this.memory.homeRoom].memory.outposts.roomList[HEAP_MEMORY.outpostRoomCounter]);
			console.log(JSON.stringify(HEAP_MEMORY));
			storedSource = this.assignRemoteHarvestSource(Game.rooms[this.memory.homeRoom].memory.outposts.roomList[HEAP_MEMORY.outpostRoomCounter], false);
			if (HEAP_MEMORY.outpostSourceCounter < Game.rooms[this.memory.homeRoom].memory.outposts.registry[Game.rooms[this.memory.homeRoom].memory.outposts.roomList[HEAP_MEMORY.outpostRoomCounter]].sources.length) {
				HEAP_MEMORY.outpostSourceCounter += 1;
			
				HEAP_MEMORY.outpostSourceCounter = 0;
				HEAP_MEMORY.outpostRoomCounter += 1;
				if (HEAP_MEMORY.outpostRoomCounter <= Game.rooms[this.memory.homeRoom].memory.outposts.roomList.length) {
					HEAP_MEMORY.outpostRoomCounter = 0;
				}
			}
		}	
	}
	
	if (storedSource) {
		if (this.pos.isNearTo(storedSource)) {
			if (storedSource.energy == 0 && this.store.getUsedCapacity() > 0) {
				this.unloadEnergy();
			}
			this.harvest(storedSource);
		} else {
			this.moveTo(storedSource, { visualizePathStyle: { stroke: '#ffaa00', ignoreCreeps: true } });
		}
	}
}

Creep.prototype.getDroppedResource = function getDroppedResource(pileID) {

	if (pileID === undefined)
		pileID = this.pos.findClosestByRange(FIND_DROPPED_RESOURCES).id;

	if (pileID) {
		const target = Game.getObjectById(pileID);
		if (target) {
			if (this.pickup(target) == ERR_NOT_IN_RANGE)
				this.moveTo(target);
		}
	}
}

Creep.prototype.pickupClosestEnergy = function pickupClosestEnergy() {
	
	const containersWithEnergy = this.room.find(FIND_STRUCTURES, {
		filter: (obj) => (obj.structureType == STRUCTURE_CONTAINER || obj.structureType == STRUCTURE_STORAGE) && obj.store[RESOURCE_ENERGY] > 0
	});

	const droppedPiles = this.room.find(FIND_DROPPED_RESOURCES);
	const resourceList = containersWithEnergy.concat(droppedPiles);
	const target = this.pos.findClosestByRange(resourceList);

	if (target) {
			if (this.pickup(target) == ERR_NOT_IN_RANGE || this.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
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
		const nearbyObj = this.room.find(FIND_STRUCTURES, { filter: (obj) => (obj.structureType == STRUCTURE_STORAGE || obj.structureType == STRUCTURE_CONTAINER || obj.structureType == STRUCTURE_LINK) && obj.pos.isNearTo(this) });
	
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
	
	let storedMineral = Game.getObjectById(this.memory.mineral);

	if (!storedMineral) {
		delete this.memory.mineral;
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
			this.moveTo(storedMineral, { visualizePathStyle: { stroke: '#ff00ff', ignoreCreeps: true } });
		}
	}
}

Creep.prototype.moveBySerializedPath = function moveBySerializedPath(serializedPath) {

	const path = Room.deserializePath(serializedPath);
	this.moveByPath(path);
}

Creep.prototype.recursivePathMove = function recursivePathMove(serializedPath, stepNum = 0) {

	const path = Room.deserializePath(serializedPath);

	if (this.move(path[stepNum].direction) == OK)
		stepNum++;

	if (stepNum < serializedPath.length)
		return recursivePathMove(serializedPath, stepNum);
}

Creep.prototype.disable = function disable() {
	this.memory.disableAI = true;
	return true;
}

Creep.prototype.enable = function enable() {
	this.memory.disableAI = false;
	return false;
}

Creep.prototype.getBoost = function getBoost(compound = false, sourceLab = false, numParts = 1) {
	if (compound) {
		if (sourceLab) {
			if (typeof sourceLab === 'string')
				sourceLab = Game.getObjectById(sourceLab);
			sourceLab.boostCreep()
		}
		
		if (sourceLab.boostCreep(this,numParts) == ERR_NOT_IN_RANGE) {
			this.moveTo(sourceLab, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.5, lineStyle: 'undefined' } });
		}
	}
}

Creep.prototype.assignOutbox = function assignOutbox(noIncrement) {

	const room = this.room;
	const LA = room.memory.settings.containerSettings.lastOutbox;

	if (!room.memory.settings)
		room.initSettings();

	if (!room.memory.objects)
		room.cacheObjects();

	const roomOutboxes = room.memory.settings.containerSettings.outboxes;

	if (room.memory.settings.containerSettings.lastOutbox == undefined) {
		room.memory.settings.containerSettings.lastOutbox = 0;
		console.log('Creating \'lastOutbox\' memory setting.')
	}
	
	let nextOutbox = room.memory.settings.containerSettings.lastOutbox + 1;
	
	if (nextOutbox >= roomOutboxes.length)
		nextAssigned = 0;

	let assignedOutbox = roomOutboxes[nextOutbox];

	this.memory.pickup = assignedOutbox;

	room.memory.settings.containerSettings.lastOutbox += 1;

	if (room.memory.settings.containerSettings.lastOutbox >= roomOutboxes.length)
		room.memory.settings.containerSettings.lastOutbox = 0;

	console.log('Assigned ' + this.memory.role + ' ' + this.name + ' to outbox ID ' + assignedOutbox)

	if (noIncrement)
		room.memory.settings.containerSettings.lastOutbox = LA;

	return assignedOutbox;

}

Creep.prototype.assignInbox = function assignInbox(noIncrement) {

	const room = this.room;
	const LA = room.memory.settings.containerSettings.lastInbox;

	if (!room.memory.settings)
		room.initSettings();

	if (!room.memory.objects)
		room.cacheObjects();

	const roomInboxes = room.memory.settings.containerSettings.inboxes;

	if (room.memory.settings.containerSettings.lastInbox == undefined) {
		room.memory.settings.containerSettings.lastInbox = 0;
		console.log('Creating \'lastInbox\' memory setting.')
	}
	
	let nextInbox = room.memory.settings.containerSettings.lastInbox + 1;
	
	if (nextInbox >= roomInboxes.length)
		nextAssigned = 0;

	let assignedInbox = roomInboxes[nextInbox];

	this.memory.dropoff = assignedInbox;

	room.memory.settings.containerSettings.lastInbox += 1;

	if (room.memory.settings.containerSettings.lastInbox >= roomInboxes.length)
		room.memory.settings.containerSettings.lastInbox = 0;

	console.log('Assigned ' + this.memory.role + ' ' + this.name + ' to inbox ID ' + assignedInbox)

	if (noIncrement)
		room.memory.settings.containerSettings.lastInbox = LA;

	return assignedInbox;

}

Creep.prototype.assignLogisticalPair = function assignLogisticalPair(source = false, destination = false) {
	if ((source && !destination) || (!source && destination))
		return 'If including parameters, you must specify both the source AND destination.';

	if (source && destination) {
		if (typeof source === 'string')
			this.memory.pickup = source;
		else
			this.memory.pickup = source.id;

		if (typeof destination === 'string')
			this.memory.dropoff = destination;
		else
			this.memory.dropoff = destination.id;
	} else {

		if (!this.room.memory.data)
			this.room.initSettings();
		if (this.room.memory.data.logisticalPairs === undefined)
			this.room.memory.data.logisticalPairs = [];
			
			this.room.registerLogisticalPairs();

		if (this.room.memory.data.noPairs) {
			this.memory.pickup = 'none';
			this.memory.dropoff = 'none';
			return;
		}
		if (this.room.memory.data.pairCounter === undefined)
			this.room.memory.data.pairCounter = 0;

		const assignedPair = this.room.memory.data.logisticalPairs[this.room.memory.data.pairCounter];

		this.room.memory.data.pairCounter += 1;

		if (this.room.memory.data.pairCounter >= this.room.memory.data.logisticalPairs.length)
			this.room.memory.data.pairCounter = 0;

		if (!this.room.memory.data.logisticalPairs) {
			this.memory.pickup = 'none';
			this.memory.dropoff = 'none';
			return 'No pairs available to assign. Set \'none\'.';
		} else if (assignedPair && assignedPair.length < 3) {
			console.log('No pairs to assign.');
			return;
		}
		else if (assignedPair && assignedPair.length >= 3) {
			this.memory.pickup = assignedPair[0];
			this.memory.dropoff = assignedPair[1];
			this.memory.cargo = assignedPair[2];
			console.log('assignedPair: ' + assignedPair);
			return 'Assigned pair (PICKUP: ' + assignedPair[0] + ') | (DROPOFF: ' + assignedPair[1] + ') | (CARGO: ' + assignedPair[2] + ')';
		} else {
			return 'Unable to assign pair.';
		}
	}
	
	

}