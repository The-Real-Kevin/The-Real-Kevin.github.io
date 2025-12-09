// mission7Controller.js - Mission 10 (IceCity reveal in Scene6 layout) with Mission10Card

import { handlePlayerMovement } from "./playerController.js";
import { getCurrentMissionNumber } from "./missionProgressionSystem.js";
import { hideMissionText } from "./missionProgressionSystem.js";



const SCENE6_LAYOUT = "Scene6";

// Mission state
let missionActive = false;
let missionState = {
	iceCityRevealed: false,
	eKeyWasPressed: false,
	card1Shown: false,  // NEW: Track if card 1 has been shown
	card2Shown: false   // NEW: Track if card 2 has been shown
};

// Drop zone configuration
const DROP_ZONE = {
	x: 160,
	y: 128,
	radius: 35
};

export function isMission7Active() {
	return missionActive;
}

export function startMission7(runtime, player) {
	console.log("=== STARTING MISSION 10 (IceCity) ===");
	console.log("Walk to the drop zone and press E to reveal IceCity");
	
	missionActive = true;
	
	// Reset mission state
	missionState = {
		iceCityRevealed: false,
		eKeyWasPressed: false,
		card1Shown: false,  // NEW
		card2Shown: false   // NEW
	};
	
	// Set spawn position
	globalThis.playerSpawnX = 160;
	globalThis.playerSpawnY = 200;
	
	// Go to Scene6
	runtime.goToLayout(SCENE6_LAYOUT);
}

export function updateMission7(runtime) {
	const currentLayout = runtime.layout?.name;
	
	// Only run if in Scene6 layout
	if (currentLayout !== SCENE6_LAYOUT) {
		return;
	}
	
	const player = runtime.objects.Player?.getFirstInstance();
	if (!player) return;
	
	const keyboard = runtime.keyboard;
	
	// ALWAYS allow player movement in Scene6
	handlePlayerMovement(runtime, player, keyboard);
	
	// Check if we should activate the mission
	const currentMissionNumber = getCurrentMissionNumber();
	
	// Activate mission if we're on mission 10 and not yet active and not already completed
	if (currentMissionNumber === 10 && !missionActive && !globalThis.iceCityRevealed) {
		console.log("=== ACTIVATING MISSION 10 (IceCity) ===");
		missionActive = true;
		missionState = {
			iceCityRevealed: false,
			eKeyWasPressed: false,
			card1Shown: false,  // NEW
			card2Shown: false   // NEW
		};
	}
	
	const eKeyPressed = keyboard.isKeyDown("KeyE");
	
	// Handle Mission10Card - NEW
	handleMission10Card(runtime, eKeyPressed);
	
	// If mission not active or already completed, skip interaction checks
	if (!missionActive) {
		missionState.eKeyWasPressed = eKeyPressed;
		return;
	}
	
	// Mission: Reveal IceCity
	if (!missionState.iceCityRevealed) {
		checkDropZone(runtime, player, eKeyPressed);
	}
	
	missionState.eKeyWasPressed = eKeyPressed;
}

// NEW FUNCTION: Handle Mission10Card
function handleMission10Card(runtime, eKeyPressed) {
	const mission10Card = runtime.objects.Mission10Card?.getFirstInstance();
	if (!mission10Card) {
		console.warn("Mission10Card not found in Scene6!");
		return;
	}
	
	// CARD 1 (Frame 0): Show when Mission 10 starts
	if (missionActive && !globalThis.mission10Card1Dismissed && !missionState.iceCityRevealed) {
		if (!missionState.card1Shown) {
			// Show card 1 for the first time
			mission10Card.isVisible = true;
			mission10Card.animationFrame = 0;
			missionState.card1Shown = true;
			console.log("Mission10Card shown (frame 0)");
		} else {
			// Card 1 is showing, check for dismiss
			if (eKeyPressed && !missionState.eKeyWasPressed) {
				mission10Card.isVisible = false;
				globalThis.mission10Card1Dismissed = true;
				console.log("Mission10Card dismissed (frame 0)");
			}
		}
		return;
	}
	
	// CARD 2 (Frame 1): Show when IceCity revealed (mission complete)
	if (missionState.iceCityRevealed && !globalThis.mission10Card2Dismissed) {
		if (!missionState.card2Shown) {
			// Show card 2 for the first time
			mission10Card.isVisible = true;
			mission10Card.animationFrame = 1;
			missionState.card2Shown = true;
			console.log("Mission10Card shown (frame 1)");
		} else {
			// Card 2 is showing, check for dismiss
			if (eKeyPressed && !missionState.eKeyWasPressed) {
				mission10Card.isVisible = false;
				globalThis.mission10Card2Dismissed = true;
				console.log("Mission10Card dismissed permanently (frame 1)");
			}
		}
		return;
	}
	
	// Hide card if conditions not met
	if (mission10Card.isVisible && 
		(globalThis.mission10Card1Dismissed || globalThis.mission10Card2Dismissed)) {
		mission10Card.isVisible = false;
	}
}

function checkDropZone(runtime, player, eKeyPressed) {
	const distance = Math.hypot(player.x - DROP_ZONE.x, player.y - DROP_ZONE.y);
	
	// Show hint when near
	if (distance < 45 && runtime.tickCount % 60 === 0) {
		console.log("Press E to reveal IceCity");
	}
	
	// Activate if E pressed while near
	if (distance < DROP_ZONE.radius && eKeyPressed && !missionState.eKeyWasPressed) {
		console.log("E pressed near drop zone - revealing IceCity");
		revealIceCity(runtime);
	}
}

function revealIceCity(runtime) {
	console.log("Attempting to reveal IceCity...");
	
	const iceCity = runtime.objects.IceCity?.getFirstInstance();
	
	if (!iceCity) {
		console.warn("IceCity not found!");
		return;
	}
	
	// Make IceCity visible
	iceCity.isVisible = true;
	missionState.iceCityRevealed = true;
	
	console.log("✓ IceCity revealed!");
	
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
	console.log("=== MISSION 10 COMPLETE ===");
	console.log("→ Walk back to Scene1 and press E on forum for final upgrade!");
	
	hideMissionText(runtime);
	
	// Mark mission as no longer active
	missionActive = false;
	
	// Get the mission number we were on
	const missionNumber = globalThis.currentMissionNumber || 10;
	
	// Call the global completion handler
	if (globalThis.onMissionComplete) {
		globalThis.onMissionComplete(runtime, missionNumber);
	}
	
	// Save IceCity state for persistence
	globalThis.iceCityRevealed = true;
	
	// Clear mission-specific return data
	globalThis.returnPlayerX = undefined;
	globalThis.returnPlayerY = undefined;
	globalThis.currentMissionNumber = undefined;
}

export function getMission7State() {
	return { ...missionState, missionActive };
}

export function isIceCityRevealed() {
	return globalThis.iceCityRevealed === true;
}