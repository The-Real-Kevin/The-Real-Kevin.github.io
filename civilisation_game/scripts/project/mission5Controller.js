// mission5Controller.js - Mission 8 (Library activation in Mission5 layout)

import { handlePlayerMovement } from "./playerController.js";
import { hideMissionText } from "./missionProgressionSystem.js"; // ADD THIS IMPORT

const MISSION5_SCENE = "Mission5";
const UNIVERSITY4_LAYOUT = "University4";

// Mission state
let missionActive = false;
let missionState = {
	hasStartedMission: false,
	libraryActivated: false,
	eKeyWasPressed: false
};

// Drop zone configuration
const DROP_ZONE = {
	x: 294,
	y: 230,
	radius: 35
};

export function isMission5Active() {
	return missionActive;
}

export function startMission5(runtime, player) {
	console.log("=== STARTING MISSION 8 (Library) ===");
	console.log("Talk to NPC5 to begin");
	
	missionActive = true;
	
	// Reset mission state
	missionState = {
		hasStartedMission: false,
		libraryActivated: false,
		eKeyWasPressed: false
	};
	
	// Set spawn position
	globalThis.playerSpawnX = 160;
	globalThis.playerSpawnY = 200;
	
	// Go to mission scene
	runtime.goToLayout(MISSION5_SCENE);
}

export function updateMission5(runtime) {
	const currentLayout = runtime.layout?.name;
	
	// Only run if in Mission5 layout and mission is active
	if (currentLayout !== MISSION5_SCENE || !missionActive) return;
	
	const player = runtime.objects.Player?.getFirstInstance();
	if (!player) return;
	
	const keyboard = runtime.keyboard;
	
	// IMPORTANT: Always allow player movement in mission
	handlePlayerMovement(runtime, player, keyboard);
	
	const eKeyPressed = keyboard.isKeyDown("KeyE");
	
	// PHASE 1: Haven't started mission yet - need to talk to NPC5
	if (!missionState.hasStartedMission) {
		checkStartNPC(runtime, player, eKeyPressed);
		missionState.eKeyWasPressed = eKeyPressed;
		return;
	}
	
	// PHASE 2: Mission started but Library not activated yet
	if (!missionState.libraryActivated) {
		checkDropZone(runtime, player, eKeyPressed);
		missionState.eKeyWasPressed = eKeyPressed;
		return;
	}
	
	// PHASE 3: Library activated - talk to MissionNPC5 to complete
	checkCompletionNPC(runtime, player, eKeyPressed);
	missionState.eKeyWasPressed = eKeyPressed;
}

// PHASE 1: Check for NPC5 to start mission
function checkStartNPC(runtime, player, eKeyPressed) {
	const npc5 = runtime.objects.NPC5?.getFirstInstance();
	
	if (!npc5) {
		console.warn("NPC5 not found in Mission5!");
		return;
	}
	
	const distance = Math.hypot(player.x - npc5.x, player.y - npc5.y);
	
	// Show hint when near
	if (distance < 35 && runtime.tickCount % 60 === 0) {
		console.log("Press E to talk to NPC5");
	}
	
	// Start mission dialogue
	if (distance < 30 && eKeyPressed && !missionState.eKeyWasPressed) {
		startMissionDialogue();
	}
}

function startMissionDialogue() {
	console.log("✓ Mission Started");
	console.log("NPC5: Walk to the drop zone and activate the library!");
	
	missionState.hasStartedMission = true;
}

// PHASE 2: Check drop zone interaction
function checkDropZone(runtime, player, eKeyPressed) {
	const dropZone = runtime.objects.DropZoneMarker?.getFirstInstance();
	
	if (!dropZone) {
		console.warn("DropZoneMarker not found!");
		return;
	}
	
	const distance = Math.hypot(player.x - DROP_ZONE.x, player.y - DROP_ZONE.y);
	
	// Show hint when near
	if (distance < 45 && runtime.tickCount % 60 === 0) {
		console.log("Press E to activate the library");
	}
	
	// Activate if E pressed while near
	if (distance < DROP_ZONE.radius && eKeyPressed && !missionState.eKeyWasPressed) {
		activateLibrary(runtime);
	}
}

function activateLibrary(runtime) {
	const library = runtime.objects.Mission5Library?.getFirstInstance();
	
	if (!library) {
		console.warn("Mission5Library sprite not found!");
		return;
	}
	
	// Change Library to next frame
	const currentFrame = library.animationFrame;
	const totalFrames = library.animation.frameCount;
	
	if (currentFrame < totalFrames - 1) {
		library.animationFrame = currentFrame + 1;
		missionState.libraryActivated = true;
		console.log("✓ Library activated! Frame changed to", library.animationFrame);
		console.log("→ Talk to MissionNPC5 to complete mission");
		
		// Hide drop zone marker
		const dropZone = runtime.objects.DropZoneMarker?.getFirstInstance();
		if (dropZone) {
			dropZone.isVisible = false;
		}
	} else {
		console.log("Library already at max frame");
	}
}

// PHASE 3: Check for MissionNPC5 to complete mission
function checkCompletionNPC(runtime, player, eKeyPressed) {
	const missionNPC = runtime.objects.MissionNPC5?.getFirstInstance();
	
	if (!missionNPC) {
		console.warn("MissionNPC5 not found!");
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
	console.log("=== MISSION 8 COMPLETE ===");
	console.log("→ Returning to University4");

	hideMissionText(runtime); // ADD THIS LINE
	// Mark mission as no longer active
	missionActive = false;
	
	// Get the mission number we were on
	const missionNumber = globalThis.currentMissionNumber || 8;
	
	// Call the global completion handler
	if (globalThis.onMissionComplete) {
		globalThis.onMissionComplete(runtime, missionNumber);
	}
	
	// SPECIAL: Return to University4 instead of Scene1
	setTimeout(() => {
		if (globalThis.showLoadingAndGoTo) {
			// Override the return scene to be University4
			globalThis.returnSceneName = UNIVERSITY4_LAYOUT;
			globalThis.showLoadingAndGoTo(runtime, UNIVERSITY4_LAYOUT, 160, 200);
		}
	}, 500);
	
	// Clear mission-specific return data
	globalThis.returnPlayerX = undefined;
	globalThis.returnPlayerY = undefined;
	globalThis.currentMissionNumber = undefined;
}

export function getMission5State() {
	return { ...missionState, missionActive };
}