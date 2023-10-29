const roleCrane = {
    
    run: function (creep) {
        
        if (creep.memory.disableAI === undefined)
            creep.memory.disableAI = false;

        if (!creep.memory.disableAI) {

            if (!creep.memory.link)
                creep.memory.link = creep.room.memory.objects.links[0];
            if (!creep.memory.storage)
                creep.memory.storage = creep.room.memory.objects.storage[0];
            if (!creep.memory.terminal)
                creep.memory.terminal = creep.room.memory.objects.terminal[0];
        
            if (creep.memory.upgrading = true && creep.store.getUsedCapacity() == 0) {
                creep.memory.upgrading = false;
            }

            const objLink = Game.getObjectById(creep.memory.link);
            const objStorage = Game.getObjectById(creep.memory.storage);
            const objTerminal = Game.getObjectById(creep.memory.terminal);
            const craneSpot = new RoomPosition(39, 7, 'E58S51');

            if (creep.pos !== craneSpot) {
                creep.moveTo(craneSpot);
            }
        
            if (creep.store.getFreeCapacity() == 0 && creep.memory.dropLink == false) {
                const resTypes = Object.keys(creep.store);
                console.log('not even in her');
            
                for (let types in resTypes) {
                    console.log(types);
                    if (creep.store[types] !== 'energy')
                        creep.transfer(objStorage, types)
                }
            }

            if (creep.memory.dropLink == true) {
                creep.transfer(objStorage, RESOURCE_ENERGY)
                creep.memory.dropLink = false;
                creep.memory.upgrading = false;
                return;
            } else if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0 && creep.memory.upgrading == false)
                creep.transfer(objStorage, RESOURCE_ENERGY); 
            else {
                if (objLink.store[RESOURCE_ENERGY] >= 30) {
                    if (creep.withdraw(objLink, RESOURCE_ENERGY) == OK) {
                        creep.memory.dropLink = true;
                        creep.memory.upgrading = false;
                        return;
                    }
                } else if (objTerminal.store.getUsedCapacity() > 0 && Object.keys(objTerminal.store).length > 1) {
                    if (creep.store[RESOURCE_ENERGY] > 0) {
                        creep.transfer(objStorage, RESOURCE_ENERGY)
                        creep.memory.upgrading = false;
                        return;
                    } else if (creep.store.getFreeCapacity() == 0) { 
                        console.log('yea')
                        const resourceTypes = Object.keys(objTerminal.store);
                        for (let i = 0; i < resourceTypes.length; i++) {
                            if (resourceTypes[i] !== 'energy') {
                                creep.transfer(objStorage, resourceTypes[i])
                                creep.memory.upgrading = false;
                                return;
                            }
                        }
                    } else {
                        const resourceTypes = Object.keys(objTerminal.store);
                        for (let i = 0; i < resourceTypes.length; i++) {
                            if (resourceTypes[i] !== 'energy') {
                                creep.withdraw(objTerminal, resourceTypes[i])
                                creep.memory.upgrading = false;
                                return;
                            }
                        }
                    }
                } else if ((creep.room.memory.flags.craneUpgrades) && (creep.memory.upgrading == false)) {
                    if (creep.store.getUsedCapacity() == 0) {
                        creep.withdraw(objStorage, RESOURCE_ENERGY);
                        creep.memory.upgrading = true;
                    } else {
                        creep.upgradeController(creep.room.controller)
                    }
                }
            }
        } else {
            console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
            creep.say('AI Disabled');
        }        
    }
}

module.exports = roleCrane;