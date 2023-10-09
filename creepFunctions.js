Creep.prototype.findEnergySource = function () {
    let sources = this.room.find(FIND_SOURCES);
    if (sources.length) {
        this.memory.source = sources[0].id;
        return sources[0];
    }
}

function newEnergySourcePOS(posX, posY, posName) {
	
	const energyPOS = new RoomPosition(posX, posY, posName);
    
	if (energyPOS) {
		//console.log('Successfully created POS at X=' + posX + ', Y=' + posY + ', and with a name of "' + posName + '."');
		console.log(`Successfully created POS at X=${posX}, Y=${posY}, and with a name of "${posName}".`);
		return energyPOS;
	} else {
		console.log('Invalid Coords, or POS already exists.');
		return null;
	}
}

function getTerrainForEnergySource(resX, resY) {

	let wallCount = 0;
	let plainCount = 0;
	let swampCount = 0;
	
	const terrain = new Room.Terrain(Game.creeps.name.room.name);

	const ptTL = {x: resX-1,  y: resY+1};
	const ptTC = {x: resX,    y: resY+1};
	const ptTR = {x: resX+1,  y: resY+1};
	const ptCL = {x: resX-1,  y: resY  };
	const ptMC = {x: resX, 		y: resY  };
	const ptCR = {x: resX+1,  y: resY  };
	const ptBL = {x: resX-1,  y: resY-1};
	const ptBC = {x: resX,    y: resY-1};
	const ptBR = {x: resX+1,  y: resY-1};
    
	let [pointList] = { ptTL, ptTC, ptTR, ptCL, ptMC, ptCR, ptBL, ptBC, ptBR };
 
	for (i = 0; i < pointList.length; i++) {
		switch(terrain.get(pointList[i].x, pointList[i].y)) {
			case TERRAIN_MASK_WALL:
				wallCount++;
        break;
			case TERRAIN_MASK_SWAMP:
				swampCount++;
        break;
			case 0:
				plainCount++;
				break;
			default:
				console.log('Unknown error!');
				return null;
		}
	}
	console.log('Walls: ' + wallCount);
	console.log('Plains: ' + plainCount + ' and Swamps: ' + swampCount);

	return true;
}