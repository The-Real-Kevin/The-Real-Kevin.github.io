// mission6Controller.js - Mission 9 (IceCourt reveal in Court1 layout) with Mission9Card

import { handlePlayerMovement } from "./playerController.js";
import { getCurrentMissionNumber } from "./missionProgressionSystem.js";
import { hideMissionText } from "./missionProgressionSystem.js";


const COURT1_SCENE = "Court1";

// Mission state
let missionActive = false;
let missionState = {
	iceCourtRevealed: false,
	eKeyWasPressed: false,
	cardShown: false // NEW: Track if card has been shown
};

// Drop zone configuration
const DROP_ZONE = {
	x: 160,
	y: 140,
	radius: 35
};

export function isMission6Active() {
	return missionActive;
}

export function startMission6(runtime, player) {
	console.log("=== STARTING MISSION 9 (IceCourt) ===");
	console.log("Walk to the drop zone and press E to reveal IceCourt");
	
	missionActive = true;
	
	// Reset mission state
	missionState = {
		iceCourtRevealed: false,
		eKeyWasPressed: false,
		cardShown: false // NEW
	};
	
	// Set spawn position
	globalThis.playerSpawnX = 160;
	globalThis.playerSpawnY = 230;
	
	// Go to Court1
	runtime.goToLayout(COURT1_SCENE);
}

export function updateMission6(runtime) {
	const currentLayout = runtime.layout?.name;
	
	// Only run if in Court1 layout
	if (currentLayout !== COURT1_SCENE) {
		return;
	}
	
	const player = runtime.objects.Player?.getFirstInstance();
	if (!player) return;
	
	const keyboard = runtime.keyboard;
	
	// ALWAYS allow player movement in Court1
	handlePlayerMovement(runtime, player, keyboard);
	
	// Check if we should activate the mission
	const currentMissionNumber = getCurrentMissionNumber();
	
	// Activate mission if we're on mission 9 and not yet active and not already completed
	if (currentMissionNumber === 9 && !missionActive && !globalThis.iceCourtRevealed) {
		console.log("=== ACTIVATING MISSION 9 (IceCourt) ===");
		missionActive = true;
		missionState = {
			iceCourtRevealed: false,
			eKeyWasPressed: false,
			cardShown: false // NEW
		};
	}
	
	const eKeyPressed = keyboard.isKeyDown("KeyE");
	
	// Handle Mission9Card - NEW
	handleMission9Card(runtime, eKeyPressed);
	
	// If mission not active or already completed, skip interaction checks
	if (!missionActive) {
		missionState.eKeyWasPressed = eKeyPressed;
		return;
	}
	
	// Mission: Reveal IceCourt
	if (!missionState.iceCourtRevealed) {
		checkDropZone(runtime, player, eKeyPressed);
	}
	
	missionState.eKeyWasPressed = eKeyPressed;
}

// NEW FUNCTION: Handle Mission9Card
function handleMission9Card(runtime, eKeyPressed) {
	const mission9Card = runtime.objects.Mission9Card?.getFirstInstance();
	if (!mission9Card) {
		console.warn("Mission9Card not found in Court1!");
		return;
	}
	
	// Check if card should be shown
	if (missionActive && !globalThis.mission9CardDismissed && !missionState.cardShown) {
		// Show card for the first time
		mission9Card.isVisible = true;
		missionState.cardShown = true;
		console.log("Mission9Card shown");
	}
	
	// Check if card is showing and E is pressed
	if (mission9Card.isVisible && eKeyPressed && !missionState.eKeyWasPressed) {
		mission9Card.isVisible = false;
		globalThis.mission9CardDismissed = true;
		console.log("Mission9Card dismissed permanently");
	}
	
	// Ensure card is hidden if already dismissed
	if (globalThis.mission9CardDismissed && mission9Card.isVisible) {
		mission9Card.isVisible = false;
	}
}

function checkDropZone(runtime, player, eKeyPressed) {
	const distance = Math.hypot(player.x - DROP_ZONE.x, player.y - DROP_ZONE.y);
	
	// Show hint when near
	if (distance < 45 && runtime.tickCount % 60 === 0) {
		console.log("Press E to reveal IceCourt");
	}
	
	// Activate if E pressed while near
	if (distance < DROP_ZONE.radius && eKeyPressed && !missionState.eKeyWasPressed) {
		console.log("E pressed near drop zone - revealing IceCourt");
		revealIceCourt(runtime);
	}
}

function revealIceCourt(runtime) {
	console.log("Attempting to reveal IceCourt...");
	
	const iceCourt = runtime.objects.IceCourt?.getFirstInstance();
	
	if (!iceCourt) {
		console.warn("IceCourt not found!");
		return;
	}
	
	// Make IceCourt visible
	iceCourt.isVisible = true;
	missionState.iceCourtRevealed = true;
	
	console.log("✓ IceCourt revealed!");
	
	// Hide drop zone marker
	const dropZone = runtime.objects.DropZoneMarker?.getFirstInstance();
	if (dropZone) {
		dropZone.isVisible = false;
		console.log("DropZoneMarker hidden");
	}
	
	// Complete mission immediately
	completeMission(runtime);
}

function completeMission(runtime) {
	console.log("=== MISSION 9 COMPLETE ===");
	console.log("→ You can now explore Court freely");

	hideMissionText(runtime);
	
	// Mark mission as no longer active
	missionActive = false;
	
	// Get the mission number we were on
	const missionNumber = globalThis.currentMissionNumber || 9;
	
	// Call the global completion handler
	if (globalThis.onMissionComplete) {
		globalThis.onMissionComplete(runtime, missionNumber);
	}
	
	// Save IceCourt state for persistence
	globalThis.iceCourtRevealed = true;
	
	// Clear mission-specific return data
	globalThis.returnPlayerX = undefined;
	globalThis.returnPlayerY = undefined;
	globalThis.currentMissionNumber = undefined;
}

export function getMission6State() {
	return { ...missionState, missionActive };
}

export function isIceCourtRevealed() {
	return globalThis.iceCourtRevealed === true;
}