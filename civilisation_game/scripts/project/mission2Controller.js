// mission2Controller.js - Mission 4 (ScienceItem delivery in Mission2 layout)

import { handlePlayerMovement } from "./playerController.js";
import { hideMissionText } from "./missionProgressionSystem.js"; // ADD THIS IMPORT

const MISSION2_SCENE = "Mission2";
const LAB2_LAYOUT = "Lab2";  // CHANGED: Return to Lab2 instead of Scene1

// Mission state
let missionActive = false;
let missionState = {
	hasStartedMission: false,
	isCarryingItem: false,
	itemDelivered: false,
	eKeyWasPressed: false
};

// Drop zone configuration
const DROP_ZONE = {
	x: 24,
	y: 160,
	radius: 40
};

export function isMission2Active() {
	return missionActive;
}

export function startMission2(runtime, player) {
	console.log("=== STARTING MISSION 4 (ScienceItem) ===");
	console.log("Talk to NPC2 to begin");
	
	missionActive = true;
	
	// Reset mission state
	missionState = {
		hasStartedMission: false,
		isCarryingItem: false,
		itemDelivered: false,
		eKeyWasPressed: false
	};
	
	// Set spawn position
	globalThis.playerSpawnX = 160;
	globalThis.playerSpawnY = 200;
	
	// Go to mission scene
	runtime.goToLayout(MISSION2_SCENE);
}

export function updateMission2(runtime) {
	const currentLayout = runtime.layout?.name;
	
	// Only run if in Mission2 layout and mission is active
	if (currentLayout !== MISSION2_SCENE || !missionActive) return;
	
	const player = runtime.objects.Player?.getFirstInstance();
	if (!player) return;
	
	const keyboard = runtime.keyboard;
	
	// IMPORTANT: Always allow player movement in mission
	handlePlayerMovement(runtime, player, keyboard);
	
	const eKeyPressed = keyboard.isKeyDown("KeyE");
	
	// PHASE 1: Haven't started mission yet - need to talk to NPC2
	if (!missionState.hasStartedMission) {
		checkStartNPC(runtime, player, eKeyPressed);
		missionState.eKeyWasPressed = eKeyPressed;
		return;
	}
	
	// PHASE 2: Mission started but ScienceItem not delivered yet
	if (!missionState.itemDelivered) {
		handleItemMechanics(runtime, player, eKeyPressed);
		missionState.eKeyWasPressed = eKeyPressed;
		return;
	}
	
	// PHASE 3: Item delivered - talk to MissionNPC2 to complete
	checkCompletionNPC(runtime, player, eKeyPressed);
	missionState.eKeyWasPressed = eKeyPressed;
}

// PHASE 1: Check for NPC2 to start mission
function checkStartNPC(runtime, player, eKeyPressed) {
	const npc2 = runtime.objects.NPC2?.getFirstInstance();
	
	if (!npc2) {
		console.warn("NPC2 not found in Mission2!");
		return;
	}
	
	const distance = Math.hypot(player.x - npc2.x, player.y - npc2.y);
	
	// Show hint when near
	if (distance < 35 && runtime.tickCount % 60 === 0) {
		console.log("Press E to talk to NPC2");
	}
	
	// Start mission dialogue
	if (distance < 30 && eKeyPressed && !missionState.eKeyWasPressed) {
		startMissionDialogue();
	}
}

function startMissionDialogue() {
	console.log("✓ Mission Started");
	console.log("NPC2: Deliver the ScienceItem to the table!");
	
	missionState.hasStartedMission = true;
}

// PHASE 2: ScienceItem pickup and delivery
function handleItemMechanics(runtime, player, eKeyPressed) {
	const scienceItem = runtime.objects.ScienceItem?.getFirstInstance();
	
	if (!scienceItem) {
		console.warn("ScienceItem not found!");
		return;
	}
	
	// If carrying item
	if (missionState.isCarryingItem) {
		// Make item follow player
		scienceItem.x = player.x;
		scienceItem.y = player.y - 10;
		
		// Check if E pressed to drop
		if (eKeyPressed && !missionState.eKeyWasPressed) {
			tryDropItem(runtime, player, scienceItem);
		}
	}
	// Not carrying - check if can pick up
	else {
		const distanceToItem = Math.hypot(player.x - scienceItem.x, player.y - scienceItem.y);
		
		// Show hint when near
		if (distanceToItem < 35 && runtime.tickCount % 60 === 0) {
			console.log("Press E to pick up ScienceItem");
		}
		
		// Pick up if near and E pressed
		if (distanceToItem < 30 && eKeyPressed && !missionState.eKeyWasPressed) {
			pickUpItem();
		}
	}
}

function pickUpItem() {
	missionState.isCarryingItem = true;
	console.log("✓ Picked up ScienceItem");
}

function tryDropItem(runtime, player, scienceItem) {
	const distanceToDropZone = Math.hypot(player.x - DROP_ZONE.x, player.y - DROP_ZONE.y);
	
	if (distanceToDropZone < DROP_ZONE.radius) {
		// Success!
		console.log("✓ ScienceItem Delivered!");
		console.log("→ Talk to MissionNPC2 to complete");
		
		missionState.isCarryingItem = false;
		missionState.itemDelivered = true;
		
		// Position item at drop zone
		scienceItem.x = DROP_ZONE.x;
		scienceItem.y = DROP_ZONE.y;
		
		// Hide drop zone marker
		const dropZone = runtime.objects.DropZoneMarker?.getFirstInstance();
		if (dropZone) {
			dropZone.isVisible = false;
		}
	} else {
		// Dropped in wrong place
		console.log("✗ Not at drop zone - pick it up and try again");
		missionState.isCarryingItem = false;
	}
}

// PHASE 3: Check for MissionNPC2 to complete mission
function checkCompletionNPC(runtime, player, eKeyPressed) {
	const missionNPC = runtime.objects.MissionNPC2?.getFirstInstance();
	
	if (!missionNPC) {
		console.warn("MissionNPC2 not found!");
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
	console.log("=== MISSION 4 COMPLETE ===");
	console.log("→ Returning to Lab2");  // CHANGED

	hideMissionText(runtime); // ADD THIS LINE

	// Mark mission as no longer active
	missionActive = false;
	
	// Get the mission number we were on
	const missionNumber = globalThis.currentMissionNumber || 4;
	
	// Call the global completion handler
	if (globalThis.onMissionComplete) {
		globalThis.onMissionComplete(runtime, missionNumber);
	}
	
	// CHANGED: Return to Lab2 instead of Scene1
	setTimeout(() => {
		if (globalThis.showLoadingAndGoTo) {
			globalThis.showLoadingAndGoTo(runtime, LAB2_LAYOUT, 160, 200);
		}
	}, 500);
	
	// Clear return data
	globalThis.returnSceneName = undefined;
	globalThis.returnPlayerX = undefined;
	globalThis.returnPlayerY = undefined;
	globalThis.currentMissionNumber = undefined;
}

export function getMission2State() {
	return { ...missionState, missionActive };
}