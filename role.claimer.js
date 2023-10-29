const roleClaimer = {

	run: function (creep) {

		if (creep.memory.disableAI === undefined) {
			creep.memory.disableAI = false;
		}

		if (creep.memory.claimRoomName === undefined) {
			creep.memory.claimRoomName = 'define me';
		}

		if (!creep.memory.disableAI) {

			if (creep.memory.claimFlag === undefined) {
				creep.memory.claimFlag = 'none';
			}

			const claimRoom = creep.memory.claimRoomName;

			if (creep.room.name !== claimRoom) {
				if (creep.memory.claimFlag !== 'none' && !creep.memory.claimFlag !== undefined) {
					if (!creep.pos.isNearTo(Game.flags[creep.memory.claimFlag])) {
						creep.moveTo(Game.flags[creep.memory.claimFlag]);
					}
				}
			} else {

				if (creep.pos.x == 49)
					creep.move(7);
				else if (creep.pos.x == 0)
					creep.move(3);
				else if (creep.pos.y == 49)
					creep.move(1);
				else if (creep.pos.y == 0)
					creep.move(5);
				else {
					if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
						creep.moveTo(creep.room.controller);
					}
				}
			}
		} else {
			creep.say('AI Disabled');
		}
	}
}

module.exports = roleClaimer;