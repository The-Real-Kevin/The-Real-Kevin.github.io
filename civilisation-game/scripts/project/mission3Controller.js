// mission3Controller.js - Mission 4 (IceBook delivery in Mission3 layout)

import { handlePlayerMovement } from "./playerController.js";
import { hideMissionText } from "./missionProgressionSystem.js"; // ADD THIS IMPORT

const MISSION3_SCENE = "Mission3";
const UNIVERSITY1_LAYOUT = "University1";

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
	x: 300,
	y: 240,
	radius: 40
};

export function isMission3Active() {
	return missionActive;
}

export function startMission3(runtime, player) {
	console.log("=== STARTING MISSION 4 (IceBook) ===");
	console.log("Talk to NPC3 to begin");
	
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
	runtime.goToLayout(MISSION3_SCENE);
}

export function updateMission3(runtime) {
	const currentLayout = runtime.layout?.name;
	
	// Only run if in Mission3 layout and mission is active
	if (currentLayout !== MISSION3_SCENE || !missionActive) return;
	
	const player = runtime.objects.Player?.getFirstInstance();
	if (!player) return;
	
	const keyboard = runtime.keyboard;
	
	// IMPORTANT: Always allow player movement in mission
	handlePlayerMovement(runtime, player, keyboard);
	
	const eKeyPressed = keyboard.isKeyDown("KeyE");
	
	// PHASE 1: Haven't started mission yet - need to talk to NPC3
	if (!missionState.hasStartedMission) {
		checkStartNPC(runtime, player, eKeyPressed);
		missionState.eKeyWasPressed = eKeyPressed;
		return;
	}
	
	// PHASE 2: Mission started but IceBook not delivered yet
	if (!missionState.itemDelivered) {
		handleItemMechanics(runtime, player, eKeyPressed);
		missionState.eKeyWasPressed = eKeyPressed;
		return;
	}
	
	// PHASE 3: Item delivered - talk to MissionNPC3 to complete
	checkCompletionNPC(runtime, player, eKeyPressed);
	missionState.eKeyWasPressed = eKeyPressed;
}

// PHASE 1: Check for NPC3 to start mission
function checkStartNPC(runtime, player, eKeyPressed) {
	const npc3 = runtime.objects.NPC3?.getFirstInstance();
	
	if (!npc3) {
		console.warn("NPC3 not found in Mission3!");
		return;
	}
	
	const distance = Math.hypot(player.x - npc3.x, player.y - npc3.y);
	
	// Show hint when near
	if (distance < 35 && runtime.tickCount % 60 === 0) {
		console.log("Press E to talk to NPC3");
	}
	
	// Start mission dialogue
	if (distance < 30 && eKeyPressed && !missionState.eKeyWasPressed) {
		startMissionDialogue();
	}
}

function startMissionDialogue() {
	console.log("✓ Mission Started");
	console.log("NPC3: Deliver the IceBook to the drop zone!");
	
	missionState.hasStartedMission = true;
}

// PHASE 2: IceBook pickup and delivery
function handleItemMechanics(runtime, player, eKeyPressed) {
	const iceBook = runtime.objects.IceBook?.getFirstInstance();
	
	if (!iceBook) {
		console.warn("IceBook not found!");
		return;
	}
	
	// If carrying item
	if (missionState.isCarryingItem) {
		// Make item follow player
		iceBook.x = player.x;
		iceBook.y = player.y - 10;
		
		// Check if E pressed to drop
		if (eKeyPressed && !missionState.eKeyWasPressed) {
			tryDropItem(runtime, player, iceBook);
		}
	}
	// Not carrying - check if can pick up
	else {
		const distanceToItem = Math.hypot(player.x - iceBook.x, player.y - iceBook.y);
		
		// Show hint when near
		if (distanceToItem < 35 && runtime.tickCount % 60 === 0) {
			console.log("Press E to pick up IceBook");
		}
		
		// Pick up if near and E pressed
		if (distanceToItem < 30 && eKeyPressed && !missionState.eKeyWasPressed) {
			pickUpItem();
		}
	}
}

function pickUpItem() {
	missionState.isCarryingItem = true;
	console.log("✓ Picked up IceBook");
}

function tryDropItem(runtime, player, iceBook) {
	const distanceToDropZone = Math.hypot(player.x - DROP_ZONE.x, player.y - DROP_ZONE.y);
	
	if (distanceToDropZone < DROP_ZONE.radius) {
		// Success!
		console.log("✓ IceBook Delivered!");
		console.log("→ Talk to MissionNPC3 to complete");
		
		missionState.isCarryingItem = false;
		missionState.itemDelivered = true;
		
		// Position item at drop zone
		iceBook.x = DROP_ZONE.x;
		iceBook.y = DROP_ZONE.y;
		
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

// PHASE 3: Check for MissionNPC3 to complete mission
function checkCompletionNPC(runtime, player, eKeyPressed) {
	const missionNPC = runtime.objects.MissionNPC3?.getFirstInstance();
	
	if (!missionNPC) {
		console.warn("MissionNPC3 not found!");
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
	console.log("→ Returning to University1 instead of Scene1");

		hideMissionText(runtime); // ADD THIS LINE

	// Mark mission as no longer active
	missionActive = false;
	
	// Get the mission number we were on
	const missionNumber = globalThis.currentMissionNumber || 4;
	
	// Call the global completion handler
	if (globalThis.onMissionComplete) {
		globalThis.onMissionComplete(runtime, missionNumber);
	}
	
	// SPECIAL: Return to University1 instead of Scene1
	setTimeout(() => {
		if (globalThis.showLoadingAndGoTo) {
			// Override the return scene to be University1
			globalThis.returnSceneName = UNIVERSITY1_LAYOUT;
			globalThis.showLoadingAndGoTo(runtime, UNIVERSITY1_LAYOUT, 160, 230);
		}
	}, 500);
	
	// Clear mission-specific return data (but keep returnSceneName for forum system)
	globalThis.returnPlayerX = undefined;
	globalThis.returnPlayerY = undefined;
	globalThis.currentMissionNumber = undefined;
}

export function getMission3State() {
	return { ...missionState, missionActive };
}