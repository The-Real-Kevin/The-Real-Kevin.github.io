// mission1Controller.js - Mission 3 (AC Unit delivery in Mission1 layout)

import { handlePlayerMovement } from "./playerController.js";
import { hideMissionText } from "./missionProgressionSystem.js"; // ADD THIS IMPORT

const MISSION1_SCENE = "Mission1";
const FACTORY1_LAYOUT = "Factory1";  // CHANGED: Return to Factory1 instead of Scene1

// Mission state
let missionActive = false;
let missionState = {
	hasStartedMission: false,
	isCarryingACUnit: false,
	acUnitDelivered: false,
	eKeyWasPressed: false
};

// Drop zone configuration
const DROP_ZONE = {
	x: 256,
	y: 216,
	radius: 40
};

export function isMission1Active() {
	return missionActive;
}

export function startMission1(runtime, player) {
	console.log("=== STARTING MISSION 3 (AC Unit) ===");
	console.log("Talk to NPC1 to begin");
	
	missionActive = true;
	
	// Reset mission state
	missionState = {
		hasStartedMission: false,
		isCarryingACUnit: false,
		acUnitDelivered: false,
		eKeyWasPressed: false
	};
	
	// Set spawn position
	globalThis.playerSpawnX = 160;
	globalThis.playerSpawnY = 200;
	
	// Go to mission scene
	runtime.goToLayout(MISSION1_SCENE);
}

export function updateMission1(runtime) {
	const currentLayout = runtime.layout?.name;
	
	// Only run if in Mission1 layout and mission is active
	if (currentLayout !== MISSION1_SCENE || !missionActive) return;
	
	const player = runtime.objects.Player?.getFirstInstance();
	if (!player) return;
	
	const keyboard = runtime.keyboard;
	
	// IMPORTANT: Always allow player movement in mission
	handlePlayerMovement(runtime, player, keyboard);
	
	const eKeyPressed = keyboard.isKeyDown("KeyE");
	
	// PHASE 1: Haven't started mission yet - need to talk to NPC1
	if (!missionState.hasStartedMission) {
		checkStartNPC(runtime, player, eKeyPressed);
		missionState.eKeyWasPressed = eKeyPressed;
		return;
	}
	
	// PHASE 2: Mission started but AC Unit not delivered yet
	if (!missionState.acUnitDelivered) {
		handleACUnitMechanics(runtime, player, eKeyPressed);
		missionState.eKeyWasPressed = eKeyPressed;
		return;
	}
	
	// PHASE 3: AC Unit delivered - talk to MissionNPC1 to complete
	checkCompletionNPC(runtime, player, eKeyPressed);
	missionState.eKeyWasPressed = eKeyPressed;
}

// PHASE 1: Check for NPC1 to start mission
function checkStartNPC(runtime, player, eKeyPressed) {
	const npc1 = runtime.objects.NPC1?.getFirstInstance();
	
	if (!npc1) {
		console.warn("NPC1 not found in Mission1!");
		return;
	}
	
	const distance = Math.hypot(player.x - npc1.x, player.y - npc1.y);
	
	// Show hint when near
	if (distance < 35 && runtime.tickCount % 60 === 0) {
		console.log("Press E to talk to NPC1");
	}
	
	// Start mission dialogue
	if (distance < 30 && eKeyPressed && !missionState.eKeyWasPressed) {
		startMissionDialogue();
	}
}

function startMissionDialogue() {
	console.log("✓ Mission Started");
	console.log("NPC1: Deliver the AC Unit to the drop zone!");
	
	missionState.hasStartedMission = true;
}

// PHASE 2: AC Unit pickup and delivery
function handleACUnitMechanics(runtime, player, eKeyPressed) {
	const acUnit = runtime.objects.ACUnit?.getFirstInstance();
	
	if (!acUnit) {
		console.warn("ACUnit not found!");
		return;
	}
	
	// If carrying AC Unit
	if (missionState.isCarryingACUnit) {
		// Make AC Unit follow player
		acUnit.x = player.x;
		acUnit.y = player.y - 10;
		
		// Check if E pressed to drop
		if (eKeyPressed && !missionState.eKeyWasPressed) {
			tryDropACUnit(runtime, player, acUnit);
		}
	}
	// Not carrying - check if can pick up
	else {
		const distanceToACUnit = Math.hypot(player.x - acUnit.x, player.y - acUnit.y);
		
		// Show hint when near
		if (distanceToACUnit < 35 && runtime.tickCount % 60 === 0) {
			console.log("Press E to pick up AC Unit");
		}
		
		// Pick up if near and E pressed
		if (distanceToACUnit < 30 && eKeyPressed && !missionState.eKeyWasPressed) {
			pickUpACUnit();
		}
	}
}

function pickUpACUnit() {
	missionState.isCarryingACUnit = true;
	console.log("✓ Picked up AC Unit");
}

function tryDropACUnit(runtime, player, acUnit) {
	const distanceToDropZone = Math.hypot(player.x - DROP_ZONE.x, player.y - DROP_ZONE.y);
	
	if (distanceToDropZone < DROP_ZONE.radius) {
		// Success!
		console.log("✓ AC Unit Delivered!");
		console.log("→ Talk to MissionNPC1 to complete");
		
		missionState.isCarryingACUnit = false;
		missionState.acUnitDelivered = true;
		
		// Position AC Unit at drop zone
		acUnit.x = DROP_ZONE.x;
		acUnit.y = DROP_ZONE.y;
		
		// Hide drop zone marker
		const dropZone = runtime.objects.DropZoneMarker?.getFirstInstance();
		if (dropZone) {
			dropZone.isVisible = false;
		}
	} else {
		// Dropped in wrong place
		console.log("✗ Not at drop zone - pick it up and try again");
		missionState.isCarryingACUnit = false;
	}
}

// PHASE 3: Check for MissionNPC1 to complete mission
function checkCompletionNPC(runtime, player, eKeyPressed) {
	const missionNPC = runtime.objects.MissionNPC1?.getFirstInstance();
	
	if (!missionNPC) {
		console.warn("MissionNPC1 not found!");
		return;
	}
	
	const distance = Math.hypot(player.x - missionNPC.x, player.y - missionNPC.y);
	
	// Show hint when near
	if (distance < 35 && runtime.tickCount % 60 === 0) {
		console.log("Press E to complete mission");
	}
	
	// Complete mission if E pressed while near
	if (distance < 30 && eKeyPressed && !missionState.eKeyWasPressed) {
		completeMission(runtime);
	}
}

function completeMission(runtime) {
	console.log("=== MISSION 3 COMPLETE ===");
	console.log("→ Returning to Factory1");  // CHANGED
	hideMissionText(runtime); // ADD THIS LINE
	
	// Mark mission as no longer active
	missionActive = false;
	
	// Get the mission number we were on
	const missionNumber = globalThis.currentMissionNumber || 3;
	
	// Call the global completion handler
	if (globalThis.onMissionComplete) {
		globalThis.onMissionComplete(runtime, missionNumber);
	}
	
	// CHANGED: Return to Factory1 instead of Scene1
	setTimeout(() => {
		if (globalThis.showLoadingAndGoTo) {
			globalThis.showLoadingAndGoTo(runtime, FACTORY1_LAYOUT, 160, 200);
		}
	}, 500);
	
	// Clear return data
	globalThis.returnSceneName = undefined;
	globalThis.returnPlayerX = undefined;
	globalThis.returnPlayerY = undefined;
	globalThis.currentMissionNumber = undefined;
}

export function getMission1State() {
	return { ...missionState, missionActive };
}