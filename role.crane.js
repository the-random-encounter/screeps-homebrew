const roleCrane = {
    
    run: function (creep) {
        
        if (creep.memory.disableAI === undefined)
            creep.memory.disableAI = false;

        if (!creep.memory.disableAI) {

            if (!creep.memory.link)
                creep.memory.link = creep.room.memory.objects.links[0];
            if (!creep.memory.storage)
                creep.memory.storage = creep.room.memory.objects.storage[0];
            
            const objLink = Game.getObjectById(creep.memory.link);
            const objStorage = Game.getObjectById(creep.memory.storage);
            const craneSpot = new RoomPosition(39, 7, 'E58S51');

            if (creep.pos !== craneSpot) {
                creep.moveTo(craneSpot);
            }
            
            if (creep.memory.dropLink == true) {
                creep.transfer(objStorage, RESOURCE_ENERGY);
                creep.memory.dropLink = false;
            }

            if (objLink.store[RESOURCE_ENERGY] >= 200) {
                creep.withdraw(objLink, RESOURCE_ENERGY);
                creep.memory.dropLink = true;
            } else {
                if (creep.store.getUsedCapacity() == 0)
                    creep.withdraw(objStorage, RESOURCE_ENERGY);
                else
                    creep.upgradeController(creep.room.controller)
            }
        }
        else {
            console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
            creep.say('AI Disabled');
        }        
    }
}

module.exports = roleCrane;