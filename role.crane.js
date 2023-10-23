const roleCrane = {
    
    run: function(creep) {
        
        if (!creep.memory.disableAI) {
		
            creep.memory.disableAI = false;
            
            if (!creep.memory.link)
                creep.memory.link = creep.room.memory.objects.links[0];
            if (!creep.memory.storage)
                creep.memory.storage = creep.room.memory.objects.storage[0];
            
            const objLink = Game.getObjectById(creep.memory.link);
            const objStorage = Game.getObjectById(creep.memory.storage);
            const craneSpot = new RoomPosition(39, 7, 'E58S51');
            const linkFromLocal = Game.getObjectById(Memory.rooms.E58S51.objects.links[1]);
            const linkToLocal = Game.getObjectById(Memory.rooms.E58S51.objects.links[0]);

            if (creep.pos !== craneSpot) {
                creep.moveTo(craneSpot);
            }
            
            if (linkFromLocal.store.getUsedCapacity() > 400) {
                console.log('test');
                if (linkFromLocal.cooldown == 0) {
                    console.log('Transferring energy.');
                    linkFromLocal.transferEnergy(linkToLocal);
                }
            }

            if (creep.store.getUsedCapacity() == 0) {
                
                if (objLink.store.getUsedCapacity() !== 0) {
                    creep.withdraw(objLink, RESOURCE_ENERGY);
                    //creep.withdraw(Game.getObjectById(Memory.rooms.E58S51.objects.links[0]), RESOURCE_ENERGY);
                }
            } else if (creep.store.getUsedCapacity() !== 0) {
                //creep.transfer(Game.getObjectById(Memory.rooms.E58S51.objects.storage[0]), RESOURCE_ENERGY)
                creep.transfer(objStorage, RESOURCE_ENERGY);
            }
        }
    }
}
module.exports = roleCrane;