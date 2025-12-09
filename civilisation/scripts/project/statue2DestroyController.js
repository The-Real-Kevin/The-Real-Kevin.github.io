// statue2DestroyController.js - Mission 11 with Mission11Card

const SCENE1_LAYOUT = "Scene1";

let missionActive = false;
let eKeyWasPressed = false;
let cardShown = false; // NEW: Track if card has been shown

export function initStatue2DestroySystem(runtime) {
	console.log("Statue2 destroy system initialized");
	
	// Initialize global state
	if (globalThis.statue2Destroyed === undefined) {
		globalThis.statue2Destroyed = false;
	}
	if (globalThis.statue2Built === undefined) {
		globalThis.statue2Built = true;
	}
	
	// Initialize Mission11Card flag - NEW
	if (globalThis.mission11CardDismissed === undefined) {
		globalThis.mission11CardDismissed = false;
	}
}

export function isStatue2DestroyActive() {
	return missionActive;
}

export function startStatue2DestroyMission(runtime) {
	console.log("=== MISSION 11: DESTROY STATUE 2 ===");
	console.log("Walk to Statue 2 and press E to destroy it");
	
	missionActive = true;
	cardShown = false; // NEW: Reset card shown flag
}

export function updateStatue2DestroySystem(runtime) {
	const currentLayout = runtime.layout?.name;
	
	// Only run in Scene1
	if (currentLayout !== SCENE1_LAYOUT) {
		return;
	}
	
	// Always restore Statue2 visibility in Scene1
	restoreStatue2State(runtime);
	
	if (!missionActive) return;
	
	const player = runtime.objects.Player?.getFirstInstance();
	if (!player) return;
	
	const keyboard = runtime.keyboard;
	const eKeyPressed = keyboard.isKeyDown("KeyE");
	
	// Handle Mission11Card - NEW
	handleMission11Card(runtime, eKeyPressed);
	
	// Check for Statue2 interaction
	if (!globalThis.statue2Destroyed) {
		checkStatue2Interaction(runtime, player, eKeyPressed);
	}
	
	eKeyWasPressed = eKeyPressed;
}

// NEW FUNCTION: Handle Mission11Card
function handleMission11Card(runtime, eKeyPressed) {
	const mission11Card = runtime.objects.Mission11Card?.getFirstInstance();
	if (!mission11Card) {
		console.warn("Mission11Card not found in Scene1!");
		return;
	}
	
	// Check if card should be shown
	if (missionActive && !globalThis.mission11CardDismissed && !cardShown) {
		// Show card for the first time
		mission11Card.isVisible = true;
		cardShown = true;
		console.log("Mission11Card shown");
	}
	
	// Check if card is showing and E is pressed
	if (mission11Card.isVisible && eKeyPressed && !eKeyWasPressed) {
		mission11Card.isVisible = false;
		globalThis.mission11CardDismissed = true;
		console.log("Mission11Card dismissed permanently");
	}
	
	// Ensure card is hidden if already dismissed
	if (globalThis.mission11CardDismissed && mission11Card.isVisible) {
		mission11Card.isVisible = false;
	}
}

function restoreStatue2State(runtime) {
	const statue2 = runtime.objects.Statue2?.getFirstInstance();
	if (!statue2) return;
	
	// Statue2 is always visible, but frame changes based on destroyed state
	statue2.isVisible = true;
	
	if (globalThis.statue2Destroyed) {
		statue2.animationFrame = 1; // Destroyed frame
	} else if (globalThis.statue2Built) {
		statue2.animationFrame = 0; // Built frame
	}
}

function checkStatue2Interaction(runtime, player, eKeyPressed) {
	const statue2 = runtime.objects.Statue2?.getFirstInstance();
	if (!statue2) return;
	
	const distance = Math.hypot(player.x - statue2.x, player.y - statue2.y);
	
	// Show hint when near
	if (distance < 50 && runtime.tickCount % 60 === 0) {
		console.log("Press E to destroy Statue 2");
	}
	
	// Destroy if E pressed while near
	if (distance < 45 && eKeyPressed && !eKeyWasPressed) {
		destroyStatue2(runtime, statue2);
	}
}

function destroyStatue2(runtime, statue2) {
	console.log("Destroying Statue 2...");
	
	// Change to destroyed frame
	statue2.animationFrame = 1;
	
	// Save state
	globalThis.statue2Destroyed = true;
	globalThis.statue2Built = false;
	
	console.log("✓ Statue 2 destroyed!");
	
	// Complete mission
	completeMission(runtime);
}

function completeMission(runtime) {
	console.log("=== MISSION 11 COMPLETE ===");
	console.log("→ Return to forum to cool it and complete all missions!");
	
	missionActive = false;
	
	// Mission is complete - player should return to forum
	// Forum controller will check globalThis.statue2Destroyed
}

export function getStatue2DestroyState() {
	return {
		missionActive,
		statue2Destroyed: globalThis.statue2Destroyed
	};
}