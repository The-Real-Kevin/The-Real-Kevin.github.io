// endingController.js - Handles the game ending sequence after all missions complete

import { getCurrentMissionNumber } from "./missionProgressionSystem.js";

const SCENE1_LAYOUT = "Scene1";

// Ending sequence state
let endingState = {
	endingStarted: false,
	endSceneVisible: false,
	endSceneFrame: 0,
	endSceneComplete: false,
	gardenBoxVisible: false,
	greenhouseVisible: false
};

let eKeyWasPressed = false;

export function initEndingSystem(runtime) {
	console.log("Ending system initialized");
	
	// Initialize global state
	if (globalThis.endingComplete === undefined) {
		globalThis.endingComplete = false;
	}
	if (globalThis.greenhouseRevealed === undefined) {
		globalThis.greenhouseRevealed = false;
	}
}

export function updateEndingSystem(runtime) {
	const currentLayout = runtime.layout?.name;
	
	// Only run in Scene1
	if (currentLayout !== SCENE1_LAYOUT) return;
	
	// Restore ending state if needed
	restoreEndingState(runtime);
	
	// Check if all missions complete (mission number > 10)
	const currentMission = getCurrentMissionNumber();
	if (currentMission <= 10) return;
	
	const player = runtime.objects.Player?.getFirstInstance();
	const forum = runtime.objects.Forum?.getFirstInstance();
	
	if (!player) return;
	
	const keyboard = runtime.keyboard;
	const eKeyPressed = keyboard.isKeyDown("KeyE");
	
	// Handle different phases of ending
	if (!endingState.endingStarted) {
		// Phase 1: Check if player presses E on forum to start ending
		checkStartEnding(runtime, player, forum, eKeyPressed);
	} else if (!endingState.endSceneComplete) {
		// Phase 2: Cycle through EndScene frames
		handleEndSceneFrames(runtime, player, eKeyPressed);
	} else if (!endingState.greenhouseVisible) {
		// Phase 3: GardenBox interaction
		handleGardenBox(runtime, player, eKeyPressed);
	}
	
	eKeyWasPressed = eKeyPressed;
}

function checkStartEnding(runtime, player, forum, eKeyPressed) {
	if (!forum) return;
	
	// Check if player is near forum
	const distance = Math.hypot(player.x - forum.x, player.y - forum.y);
	
	if (distance < 60 && runtime.tickCount % 60 === 0) {
		console.log("Press E to start ending sequence");
	}
	
	if (distance < 50 && eKeyPressed && !eKeyWasPressed) {
		startEndingSequence(runtime, forum);
	}
}

function startEndingSequence(runtime, forum) {
	console.log("=== STARTING ENDING SEQUENCE ===");
	
	endingState.endingStarted = true;
	endingState.endSceneVisible = true;
	endingState.endSceneFrame = 0;
	
	// Hide the forum
	forum.isVisible = false;
	console.log("Forum hidden");
	
	// Show EndScene at frame 0
	const endScene = runtime.objects.EndScene?.getFirstInstance();
	if (endScene) {
		endScene.isVisible = true;
		endScene.animationFrame = 0;
		console.log("EndScene visible at frame 0");
	} else {
		console.warn("EndScene sprite not found!");
	}
	
	// Save state
	globalThis.endingStarted = true;
}

function handleEndSceneFrames(runtime, player, eKeyPressed) {
	const endScene = runtime.objects.EndScene?.getFirstInstance();
	if (!endScene) return;
	
	// Check if player is near EndScene (at forum position)
	const distance = Math.hypot(player.x - 160, player.y - 128);
	
	if (distance < 60 && runtime.tickCount % 60 === 0) {
		console.log(`EndScene at frame ${endingState.endSceneFrame} - Press E to continue`);
	}
	
	if (distance < 50 && eKeyPressed && !eKeyWasPressed) {
		if (endingState.endSceneFrame < 9) {
			// Advance to next frame
			endingState.endSceneFrame++;
			endScene.animationFrame = endingState.endSceneFrame;
			console.log(`EndScene advanced to frame ${endingState.endSceneFrame}`);
		} else {
			// Frame 9 reached, pressing E again completes EndScene
			completeEndScene(runtime, endScene);
		}
	}
}

function completeEndScene(runtime, endScene) {
	console.log("=== END SCENE COMPLETE ===");
	
	endingState.endSceneComplete = true;
	endingState.gardenBoxVisible = true;
	
	// Hide EndScene
	endScene.isVisible = false;
	console.log("EndScene hidden");
	
	// Show GardenBox at 160, 128
	const gardenBox = runtime.objects.GardenBox?.getFirstInstance();
	if (gardenBox) {
		gardenBox.isVisible = true;
		gardenBox.x = 160;
		gardenBox.y = 128;
		console.log("GardenBox visible at 160, 128");
	} else {
		console.warn("GardenBox sprite not found!");
	}
	
	// Save state
	globalThis.endSceneComplete = true;
}

function handleGardenBox(runtime, player, eKeyPressed) {
	const gardenBox = runtime.objects.GardenBox?.getFirstInstance();
	if (!gardenBox) return;
	
	const distance = Math.hypot(player.x - gardenBox.x, player.y - gardenBox.y);
	
	if (distance < 45 && runtime.tickCount % 60 === 0) {
		console.log("Press E to reveal Greenhouse");
	}
	
	if (distance < 40 && eKeyPressed && !eKeyWasPressed) {
		revealGreenhouse(runtime);
	}
}

function revealGreenhouse(runtime) {
	console.log("=== GREENHOUSE REVEALED ===");
	
	endingState.greenhouseVisible = true;
	
	// Show Greenhouse
	const greenhouse = runtime.objects.Greenhouse?.getFirstInstance();
	if (greenhouse) {
		greenhouse.isVisible = true;
		console.log("Greenhouse is now visible!");
	} else {
		console.warn("Greenhouse sprite not found!");
	}
	
	// Save state
	globalThis.greenhouseRevealed = true;
	globalThis.endingComplete = true;
	
	console.log("🎉 STAGE 1 ENDING COMPLETE! 🎉");
}

function restoreEndingState(runtime) {
	// Restore Forum visibility based on ending state
	const forum = runtime.objects.Forum?.getFirstInstance();
	if (forum && globalThis.endingStarted) {
		forum.isVisible = false;
	}
	
	// Restore EndScene state
	const endScene = runtime.objects.EndScene?.getFirstInstance();
	if (endScene) {
		if (globalThis.endingStarted && !globalThis.endSceneComplete) {
			endScene.isVisible = true;
			endScene.animationFrame = endingState.endSceneFrame;
		} else {
			endScene.isVisible = false;
		}
	}
	
	// Restore GardenBox state
	const gardenBox = runtime.objects.GardenBox?.getFirstInstance();
	if (gardenBox) {
		if (globalThis.endSceneComplete && !globalThis.greenhouseRevealed) {
			gardenBox.isVisible = true;
			gardenBox.x = 160;
			gardenBox.y = 128;
		} else if (!globalThis.endSceneComplete) {
			gardenBox.isVisible = false;
		}
	}
	
	// Restore Greenhouse state
	const greenhouse = runtime.objects.Greenhouse?.getFirstInstance();
	if (greenhouse) {
		if (globalThis.greenhouseRevealed) {
			greenhouse.isVisible = true;
		}
	}
	
	// Sync local state with global
	if (globalThis.endingStarted) {
		endingState.endingStarted = true;
	}
	if (globalThis.endSceneComplete) {
		endingState.endSceneComplete = true;
		endingState.endSceneFrame = 9;
	}
	if (globalThis.greenhouseRevealed) {
		endingState.greenhouseVisible = true;
	}
}

export function isEndingActive() {
	return endingState.endingStarted && !endingState.greenhouseVisible;
}

export function getEndingState() {
	return { ...endingState };
}