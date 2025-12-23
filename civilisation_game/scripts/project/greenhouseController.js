// greenhouseController.js - Add TrueEnding sequence

import { showLoadingAndGoTo } from "./forumController.js";

const SCENE1_LAYOUT = "Scene1";

let eKeyWasPressed = false;
let greenhouseFrame = 0;

export function initGreenhouseSystem(runtime) {
	console.log("Greenhouse system initialized");
	
	// Initialize greenhouse frame tracking
	if (globalThis.greenhouseFrame === undefined) {
		globalThis.greenhouseFrame = 0;
	}
	
	greenhouseFrame = globalThis.greenhouseFrame;
	
	// Initialize ending mission flags
	if (globalThis.endingMission1Complete === undefined) {
		globalThis.endingMission1Complete = false;
	}
	if (globalThis.endingMission2Complete === undefined) {
		globalThis.endingMission2Complete = false;
	}
	
	// Initialize dialogue shown flags
	if (globalThis.npc6DialogueShown === undefined) {
		globalThis.npc6DialogueShown = false;
	}
	if (globalThis.npc7DialogueShown === undefined) {
		globalThis.npc7DialogueShown = false;
	}
	
	// Initialize true ending flag
	if (globalThis.trueEndingComplete === undefined) {
		globalThis.trueEndingComplete = false;
	}
}

export function updateGreenhouseSystem(runtime) {
	const currentLayout = runtime.layout?.name;
	
	// Only run in Scene1
	if (currentLayout !== SCENE1_LAYOUT) {
		return;
	}
	
	// Only run if greenhouse is revealed
	if (!globalThis.greenhouseRevealed) {
		return;
	}
	
	const greenhouse = runtime.objects.Greenhouse?.getFirstInstance();
	if (!greenhouse) return;
	
	// Restore greenhouse frame
	if (greenhouse.animationFrame !== greenhouseFrame) {
		greenhouse.animationFrame = greenhouseFrame;
		globalThis.greenhouseFrame = greenhouseFrame;
	}
	
	const player = runtime.objects.Player?.getFirstInstance();
	if (!player) return;
	
	const keyboard = runtime.keyboard;
	const eKeyPressed = keyboard.isKeyDown("KeyE");
	
	// Check if player is near greenhouse
	const distance = Math.hypot(player.x - greenhouse.x, player.y - greenhouse.y);
	
	if (distance < 70 && runtime.tickCount % 60 === 0) {
		if (greenhouseFrame === 0 && !globalThis.endingMission1Complete) {
			console.log("Press E on Greenhouse to go to Court6 (Ending Mission 1)");
		} else if (greenhouseFrame === 0 && globalThis.endingMission1Complete) {
			console.log("Press E on Greenhouse to advance to next frame");
		} else if (greenhouseFrame === 1 && !globalThis.endingMission2Complete) {
			console.log("Press E on Greenhouse to go to Court7 (Ending Mission 2)");
		} else if (greenhouseFrame === 1 && globalThis.endingMission2Complete) {
			console.log("Press E on Greenhouse to advance to final frame");
		} else if (greenhouseFrame === 2 && !globalThis.trueEndingComplete) {
			console.log("Press E on Greenhouse to begin TRUE ENDING");
		} else if (greenhouseFrame === 2 && globalThis.trueEndingComplete) {
			console.log("True ending already complete - enjoy the open world!");
		}
	}
	
	// Handle E key press
	if (distance < 70 && eKeyPressed && !eKeyWasPressed) {
		handleGreenhouseInteraction(runtime, greenhouse, player);
	}
	
	eKeyWasPressed = eKeyPressed;
}

function handleGreenhouseInteraction(runtime, greenhouse, player) {
	console.log("=== GREENHOUSE INTERACTION ===");
	console.log("Current frame:", greenhouseFrame);
	console.log("EndingMission1 complete:", globalThis.endingMission1Complete);
	console.log("EndingMission2 complete:", globalThis.endingMission2Complete);
	console.log("True ending complete:", globalThis.trueEndingComplete);
	
	// Frame 0: Either go to Court6 OR advance if mission 1 complete
	if (greenhouseFrame === 0) {
		if (globalThis.endingMission1Complete) {
			// Mission 1 complete - advance frame
			advanceGreenhouse(greenhouse);
		} else {
			// Go to Court6 for Ending Mission 1
			console.log("→ Teleporting to Court6 for Ending Mission 1");
			showLoadingAndGoTo(runtime, "Court6", 160, 200);
		}
		return;
	}
	
	// Frame 1: Either go to Court7 OR advance if mission 2 complete
	if (greenhouseFrame === 1) {
		if (globalThis.endingMission2Complete) {
			// Mission 2 complete - advance frame
			advanceGreenhouse(greenhouse);
		} else {
			// Go to Court7 for Ending Mission 2
			console.log("→ Teleporting to Court7 for Ending Mission 2");
			showLoadingAndGoTo(runtime, "Court7", 160, 200);
		}
		return;
	}
	
	// Frame 2: Go to TrueEnding (if not already complete)
	if (greenhouseFrame === 2) {
		if (!globalThis.trueEndingComplete) {
			console.log("→ Beginning TRUE ENDING sequence!");
			showLoadingAndGoTo(runtime, "TrueEnding", 160, 200);
		} else {
			console.log("True ending already complete!");
		}
	}
}

function advanceGreenhouse(greenhouse) {
	if (greenhouseFrame < 2) {
		greenhouseFrame++;
		greenhouse.animationFrame = greenhouseFrame;
		globalThis.greenhouseFrame = greenhouseFrame;
		console.log(`✓ Greenhouse advanced to frame ${greenhouseFrame}`);
	}
}

export function isGreenhouseSystemActive() {
	return false;
}