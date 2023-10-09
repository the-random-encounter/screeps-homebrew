Creep.prototype.findEnergySource = function () {
	let sources = this.room.find(FIND_SOURCES);
	if (sources.length) {
		let source = _.find(sources, function (s) {
			console.log(s.pos, s.pos.getOpenPositions())
			return s.pos.getOpenPositions().length > 0;
		});

		console.log(sources.length, source);
		
		if (source) {
			this.memory.source = source.id;

			return source;
		}	
	}
}

Creep.prototype.harvestEnergy = function harvestEnergy() {
	let storedSource = Game.getObjectById(creep.memory.source);
	console.log(storedSource);
	if (storedSource && (storedSource.pos.getOpenPositions().length || creep.pos.isNearTo(storedSource))) {
		if (creep.harvest(storedSource) == ERR_NOT_IN_RANGE) {
			creep.moveTo(storedSource, { visualizePathStyle: { stroke: '#ffaa55' } });
		}
	} else {
		console.log(creep, "No Source")
		delete creep.memory.source;
		creep.findEnergySource();
	}
}