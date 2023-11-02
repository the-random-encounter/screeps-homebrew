const roleHarvester = {

  /** @param {Creep} creep **/
  run: function (creep) {
  
    if (creep.memory.disableAI === undefined)
      creep.memory.disableAI = false;

    if (!creep.memory.disableAI) {

      if (creep.ticksToLive <= 2) {
        creep.unloadEnergy();
        creep.say('☠️');
      } else {

        // a specific fix for local room harvesters standing in a dumb spot
        if (creep.room.name == 'E58S51' && Game.shard.name == 'shard3') {
          if (creep.pos.x == 41 && creep.pos.y == 7)
            creep.move(7);
        }

        if (!creep.memory.working && creep.store[RESOURCE_ENERGY] > 0) {
          creep.memory.working = true;
          creep.say('⛏️');
        }

        if (creep.memory.working && creep.store.getFreeCapacity() < (creep.getActiveBodyparts(WORK) * 2))
          creep.memory.working = false;

        // deposit energy into container, storage, or link when close to full
        if (creep.store.getFreeCapacity() < (creep.getActiveBodyparts(WORK) * 2)) {
          if (!creep.memory.bucket) {
            const containers = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE || i.structureType == STRUCTURE_LINK});
            creep.memory.bucket = containers.id;
          }
          const target = Game.getObjectById(creep.memory.bucket);
          if (!creep.pos.isNearTo(target))
            creep.moveTo(target);
          else {
            if (target.hits < target.hitsMax)
              creep.repair(target);
            else
              creep.unloadEnergy();
          }
        }
      
        if (!creep.pos.findInRange(FIND_MY_CREEPS, 1, { filter: (creep) => creep.memory.role == 'crane' }) && Game.getObjectById(creep.room.memory.objects.links[0]).store.getUsedCapacity() > 0) {
          // if the crane isn't there but the link has energy, go ahead and pull it out
          if (creep.pos.x == 40 && creep.pos.y == 7) {
            creep.withdraw(Game.getObjectById(creep.room.memory.objects.links[0]), RESOURCE_ENERGY);
            console.log('[' + creep.room.name + ']: Harvester \'' + creep.name + '\' filling in as crane due to full link.');
          } else {
            creep.harvestEnergy();
          }
        } else {
          creep.harvestEnergy();
        }
      }
    }
    else {
      console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
      creep.say('AI Disabled');
    }
  }
}

module.exports = roleHarvester;