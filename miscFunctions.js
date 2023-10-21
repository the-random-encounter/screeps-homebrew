"use strict";
// Tick length calculation by Kamots 17 januari 2019
// Provides global.tickTime as seconds
global.calcTickTime = function(tickSamples = 1000) { // Call this from 1st line of main loop. Can adjust samples used for calculation from there.
    let millis = Date.now();

    // Set some sane defaults
    if (typeof Memory.lastTickMillis == "undefined") Memory.lastTickMillis = millis - 1010;
    if (typeof Memory.lastTickTime == "undefined") Memory.lastTickTime = 1.01;
    if (typeof Memory.tickTimeCount == "undefined") Memory.tickTimeCount = 0;
    if (typeof Memory.tickTimeTotal == "undefined") Memory.tickTimeTotal = 0;
    
    let lastTickMillis = Number(Memory.lastTickMillis);
    let tickTimeCount = Number(Memory.tickTimeCount);
    let tickTimeTotal = Number(Memory.tickTimeTotal);

    if (tickTimeCount >= (tickSamples-1)) {
        tickTimeTotal += millis - lastTickMillis;
        tickTimeCount++;
        global.tickTime = (tickTimeTotal / tickTimeCount) / 1000;
        console.log("Calculated tickTime as", global.tickTime, "from", tickTimeCount, "samples.");
        Memory.lastTickTime = global.tickTime;
        Memory.tickTimeTotal = millis - lastTickMillis;
        Memory.tickTimeCount = 1;
        Memory.lastTickMillis = millis;
    } else { 
        global.tickTime = Number(Memory.lastTickTime);
        tickTimeTotal += millis - lastTickMillis;
        Memory.tickTimeTotal = tickTimeTotal;
        tickTimeCount++;
        Memory.tickTimeCount = tickTimeCount;
        Memory.lastTickMillis = millis;
    }
    return 'Done';
}

global.randomName = function() {

	const nameArray = ['Olivia', 'Emma', 'Charlotte', 'Amelia', 'Sophia', 'Isabella', 'Ava', 'Mia', 'Evelyn', 'Luna', 'Harper', 'Camila', 'Sofia', 'Scarlett', 'Elizabeth', 'Eleanor', 'Emily', 'Chloe', 'Mila', 'Violet', 'Penelope', 'Gianna', 'Aria', 'Abigail', 'Ella', 'Avery', 'Hazel', 'Nora', 'Layla', 'Lily', 'Aurora', 'Nova', 'Ellie', 'Madison', 'Grace', 'Isla', 'Willow', 'Zoe', 'Riley', 'Stella', 'Eliana', 'Ivy', 'Victoria', 'Emilia', 'Zoey', 'Naomi', 'Hannah', 'Lucy', 'Elena', 'Lillian', 'Maya', 'Leah', 'Paisley', 'Addison', 'Natalie', 'Valentina', 'Everly', 'Delilah', 'Leilani', 'Madelyn', 'Kinsley', 'Ruby', 'Sophie', 'Alice', 'Genesis', 'Claire', 'Audrey', 'Sadie', 'Aaliyah', 'Josephine', 'Autumn', 'Brooklyn', 'Quinn', 'Kennedy', 'Cora', 'Savannah', 'Caroline', 'Athena', 'Natalia', 'Hailey', 'Aubrey', 'Emery', 'Anna', 'Iris', 'Bella', 'Eloise', 'Skylar', 'Jade', 'Gabriella', 'Ariana', 'Maria', 'Adeline', 'Lydia', 'Sarah', 'Nevaeh', 'Serenity', 'Liliana', 'Ayla', 'Everleigh', 'Raelynn', 'Liam', 'Noah', 'Oliver', 'James', 'Elijah', 'William', 'Henry', 'Lucas', 'Benjamin', 'Theodore', 'Mateo', 'Levi', 'Sebastian', 'Daniel', 'Jack', 'Michael', 'Alexander', 'Owen', 'Asher', 'Samuel', 'Ethan', 'Leo', 'Jackson', 'Mason', 'Ezra', 'John', 'Hudson', 'Luca', 'Aiden', 'Joseph', 'David', 'Jacob', 'Logan', 'Luke', 'Julian', 'Gabriel', 'Grayson', 'Wyatt', 'Matthew', 'Maverick', 'Dylan', 'Isaac', 'Elias', 'Anthony', 'Thomas', 'Jayden', 'Carter', 'Santiago', 'Ezekiel', 'Charles', 'Josiah', 'Caleb', 'Cooper', 'Lincoln', 'Miles', 'Christopher', 'Nathan', 'Isaiah', 'Kai', 'Joshua', 'Andrew', 'Angel', 'Adrian', 'Cameron', 'Nolan', 'Waylon', 'Jaxon', 'Roman', 'Eli', 'Wesley', 'Aaron', 'Ian', 'Christian', 'Ryan', 'Leonardo', 'Brooks', 'Axel', 'Walker', 'Jonathan', 'Easton', 'Everett', 'Weston', 'Bennett', 'Robert', 'Jameson', 'Landon', 'Silas', 'Jose', 'Beau', 'Micah', 'Colton', 'Jordan', 'Jeremiah', 'Parker', 'Greyson', 'Rowan', 'Adam', 'Nicholas', 'Theo', 'Xavier'];

	const randIndex = Math.floor(Math.random() * (nameArray.length + 1));

	console.log('Random Index: ' + randIndex);
	console.log('Random Name: ' + nameArray[randIndex]);

	return nameArray[randIndex];

};

function roomData(room) {
	let output;
}

function spawnClaimer() {
	Game.spawns['Spawn1'].spawnCreep([CLAIM, CLAIM, MOVE, MOVE], 'Claimer', { memory: { role: 'claimer' } });
}

global.partCost = function (array) {
	
	let runningTotal = 0;

	for (i = 0; i < array.length; i++) {
		switch (array[i]) {
			case WORK:
				runningTotal += 100;
				break;
			case CARRY:
				runningTotal += 50;
				break;
			case MOVE:
				runningTotal += 50;
				break;
			case ATTACK:
				runningTotal += 80;
				break;
			case RANGED_ATTACK:
				runningTotal += 150;
				break;
			case HEAL:
				runningTotal += 250;
				break;				
			case TOUGH:
				runningTotal += 10;
				break;
			case CLAIM:
				runningTotal += 600;
				break;
			default:
				return 'Invalid part in array';
		}
	}

	return runningTotal;
}

global.GOBI = function (ID) {
	return Game.getObjectById(ID);
}

global.MC = function (name, dir) {
	
	switch (dir) {
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
		case 7:
		case 8:
			break;
		case 'N':
		case 'TOP':
		case 'T':
			dir = 1;
			break;
		case 'NE':
		case 'TOP_RIGHT':
		case 'TR':
			dir = 2;
			break;
		case 'E':
		case 'RIGHT':
		case 'R':
			dir = 3;
			break;
		case 'SE':
		case 'BOTTOM_RIGHT':
		case 'BR':
			dir = 4;
			break;
		case 'S':
		case 'BOTTOM':
		case 'B':
			dir = 5;
			break;
		case 'SW':
		case 'BOTTOM_LEFT':
		case 'BL':
			dir = 6;
			break;
		case 'W':
		case 'LEFT':
		case 'L':
			dir = 7;
			break;
		case 'NW':
		case 'TOP_LEFT':
		case 'TL':
			dir = 8;
			break;
	}
	
	return Game.creeps[name].move(dir)
}

global.visualRCProgress = function (controllerID) {

	const cont = GOBI(controllerID);

	cont.room.visual.text('L' + cont.level + ' - ' + cont.progress + '/' + cont.progressTotal, cont.pos.x + 1, cont.pos.y - 1, { align: 'left', opacity: 0.5, color: '#00ffff', font: 0.4 });

	cont.room.visual.text('          ' + ((cont.progress / cont.progressTotal) * 100).toFixed(2) + '%', cont.pos.x + 1, cont.pos.y, { align: 'left', opacity: 0.5, color: '#00ffff', font: 0.4 });
		
}

global.queue = function (command) {
	manualCmdQueue.push(command);
}

Object.assign(exports, {

	POLYBLUEDOTTED3: {
		stroke: '#0000ff',
		strokeWidth: 0.1,
		lineStyle: 'dashed'
	}
}) 