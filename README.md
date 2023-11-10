<!-- omit from toc -->
# Random Encounter's Screeps Codebase
[![forthebadge](https://forthebadge.com/images/badges/fixed-bugs.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/mom-made-pizza-rolls.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/designed-in-ms-paint.svg)](https://forthebadge.com)

[![forthebadge](https://forthebadge.com/images/badges/compatibility-pc-load-letter.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/approved-by-george-costanza.svg)](https://forthebadge.com)

[![forthebadge](https://forthebadge.com/images/badges/built-by-crips.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/fo-sho.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/0-percent-optimized.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/fuck-it-ship-it.svg)](https://forthebadge.com)

---
# Still Writing the README, so don't waste your time scrolling down...
---
<!-- omit from toc -->
## Table of Contents

- [Main Loop Features](#main-loop-features)
  - [Global Variables](#global-variables)
  - [Spawn System](#spawn-system)
  - [Information Displays](#information-displays)
- [Available Room Settings](#available-room-settings)
  - [Objects](#objects)
  - [Flags](#flags)
  - [Settings](#settings)
- [Creep Roles Available](#creep-roles-available)
  - [Primary Roles](#primary-roles)
    - [Harvester](#harvester)
    - [Collector](#collector)
    - [Builder](#builder)
    - [Upgrader](#upgrader)
    - [Runner](#runner)
  - [Secondary Roles](#secondary-roles)
    - [Repairer](#repairer)
    - [Crane](#crane)
    - [Miner](#miner)
    - [Rebooter](#rebooter)
    - [Scout](#scout)
  - [Remote Roles](#remote-roles)
    - [Remote Harvester](#remote-harvester)
    - [Remote Runner](#remote-runner)
    - [Remote Builder](#remote-builder)
    - [Remote Guard](#remote-guard)
    - [Reserver](#reserver)
  - [Combat Roles](#combat-roles)
    - [Warrior](#warrior)
    - [Ranger](#ranger)
    - [Healer](#healer)
- [Prototype \& Global Functions](#prototype--global-functions)
  - [Creep Prototype Functions](#creep-prototype-functions)
    - [findEnergySource](#findenergysource)
    - [assignHarvestSource](#assignharvestsource)
    - [assignRemoteHarvestSource](#assignremoteharvestsource)
    - [unloadEnergy](#unloadenergy)
    - [harvestEnergy](#harvestenergy)
    - [getDroppedResource](#getdroppedresource)
    - [pickupClosestEnergy](#pickupclosestenergy)
    - [unloadMineral](#unloadmineral)
    - [harvestMineral](#harvestmineral)
  - [Room Prototype Functions](#room-prototype-functions)
    - [cacheObjects](#cacheobjects)
    - [initTargets](#inittargets)
    - [setTarget](#settarget)
    - [sendEnergy](#sendenergy)
    - [initRoomData](#initroomdata)
    - [initRoomFlags](#initroomflags)
    - [initRoomSettings](#initroomsettings)
    - [setRoomFlags](#setroomflags)
    - [setRoomSettings](#setroomsettings)
    - [setRepairRampartsTo](#setrepairrampartsto)
    - [setRepairWallsTo](#setrepairwallsto)
    - [calcPath](#calcpath)
  - [RoomPosition Prototype Functions](#roomposition-prototype-functions)
    - [getNearbyPositions](#getnearbypositions)
    - [getOpenPositions](#getopenpositions)
  - [Global Functions](#global-functions)
    - [calcTickTime](#calcticktime)
    - [randomName](#randomname)
    - [partCost](#partcost)
    - [GOBI](#gobi)
    - [MC](#mc)
    - [visualRCProgress](#visualrcprogress)
    - [queue](#queue)
- [Future Goals](#future-goals)
  - [Spawn Manager Daemon](#spawn-manager-daemon)
    - [Dynamic Spawning Queue](#dynamic-spawning-queue)
    - [Dynamic Creep Roles](#dynamic-creep-roles)
    - [Need & Capacity-based Creep Bodies](#need-capacity-based-creep-bodies)
  - [Combat AI](#combat-ai)
    - [Offensive Creep Code](#offensive-creep-code)
    - [Improved Room Defense](#improved-room-defense)
  - [Level 7+8 RCL Structures](#level-78-rcl-structures)
    - [Labs Implementation](#labs-implementation)
    - [Factory Implementation](#factory-implementation)
    - [Power Creeps](#power-creeps)
  - [Automated Construction Goals](#automated-construction-goals)

---

## Main Loop Features

### Global Variables

	Description

### Spawn System

	Description

### Information Displays

	Description
---

## Available Room Settings

### Objects

	Description

### Flags

	Description

### Settings

	Description

---

## Creep Roles Available

### Primary Roles

#### Harvester

	Description

#### Collector

	Description

#### Builder

	Description

#### Upgrader

	Description

#### Runner

	Description
---

### Secondary Roles

#### Repairer

	Description

#### Crane

	Description

#### Miner

	Description

#### Rebooter

	Description

#### Scout

	Description
---

### Remote Roles

#### Remote Harvester

	Description

#### Remote Runner

	Description

#### Remote Builder

	Description

#### Remote Guard

	Description

#### Reserver

	Description
---

### Combat Roles

#### Warrior

	Description

#### Ranger

	Description

#### Healer

	Description
---

## Prototype & Global Functions

### Creep Prototype Functions

#### findEnergySource

	Description

#### assignHarvestSource

	Description

#### assignRemoteHarvestSource

	Description

#### unloadEnergy

	Description

#### harvestEnergy

	Description

#### getDroppedResource

	Description

#### pickupClosestEnergy

	Description

#### unloadMineral

	Description

#### harvestMineral

	Description
---

### Room Prototype Functions

#### cacheObjects

	Description

#### initTargets

	Description

#### setTarget

	Description

#### sendEnergy

	Description

#### initRoomData

	Description

#### initRoomFlags

	Description

#### initRoomSettings

	Description

#### setRoomFlags

	Description

#### setRoomSettings

	Description

#### setRepairRampartsTo

	Description

#### setRepairWallsTo

	Description

#### calcPath

	Description
---

### RoomPosition Prototype Functions

#### getNearbyPositions

	Description

#### getOpenPositions

	Description
---

### Global Functions

#### calcTickTime

	Description

#### randomName

	Description

#### partCost

	Description

#### GOBI

	Description

#### MC

	Description

#### visualRCProgress

	Description

#### queue

	Description

---

# Future Goals

## Spawn Manager Daemon
### Dynamic Spawning Queue
  Description
### Dynamic Creep Roles
  Description
### Need & Capacity-based Creep Bodies
  Description
## Combat AI

### Offensive Creep Code
  Description
### Improved Room Defense
  Description
## RCL 7+8 Structures
### Labs Implementation
  Description
### Factory Implementation
  Description
### Power Creeps
  Description
## Automated Construction Goals
  Description


[![forthebadge](https://forthebadge.com/images/badges/no-ragrets.svg)](https://forthebadge.com)