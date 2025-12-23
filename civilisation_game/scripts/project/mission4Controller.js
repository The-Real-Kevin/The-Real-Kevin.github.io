// mission4Controller.js - Mission 7 (Engine activation in Mission4 layout)

import { handlePlayerMovement } from "./playerController.js";
import { hideMissionText } from "./missionProgressionSystem.js"; // ADD THIS IMPORT

const MISSION4_SCENE = "Mission4";
const LAB4_LAYOUT = "Lab4";  // CHANGED: Return to Lab4 instead of University9

// Mission state
let missionActive = false;
let missionState = {
	hasStartedMission: false,
	engineActivated: false,
	eKeyWasPressed: false
};

export function isMission4Active() {
	return missionActive;
}

export function startMission4(runtime, player) {
	console.log("=== STARTING MISSION 7 (Engine) ===");
	console.log("Talk to NPC4 to begin");
	
	missionActive = true;
	
	// Reset mission state
	missionState = {
		hasStartedMission: false,
		engineActivated: false,
		eKeyWasPressed: false
	};
	
	// Set spawn position
	globalThis.playerSpawnX = 160;
	globalThis.playerSpawnY = 200;
	
	// Go to mission scene
	runtime.goToLayout(MISSION4_SCENE);
}

export function updateMission4(runtime) {
	const currentLayout = runtime.layout?.name;
	
	// Only run if in Mission4 layout and mission is active
	if (currentLayout !== MISSION4_SCENE || !missionActive) return;
	
	const player = runtime.objects.Player?.getFirstInstance();
	if (!player) return;
	
	const keyboard = runtime.keyboard;
	
	// IMPORTANT: Always allow player movement in mission
	handlePlayerMovement(runtime, player, keyboard);
	
	const eKeyPressed = keyboard.isKeyDown("KeyE");
	
	// PHASE 1: Haven't started mission yet - need to talk to NPC4
	if (!missionState.hasStartedMission) {
		checkStartNPC(runtime, player, eKeyPressed);
		missionState.eKeyWasPressed = eKeyPressed;
		return;
	}
	
	// PHASE 2: Mission started but Engine not activated yet
	if (!missionState.engineActivated) {
		checkEngineBox(runtime, player, eKeyPressed);
		missionState.eKeyWasPressed = eKeyPressed;
		return;
	}
	
	// PHASE 3: Engine activated - talk to MissionNPC4 to complete
	checkCompletionNPC(runtime, player, eKeyPressed);
	missionState.eKeyWasPressed = eKeyPressed;
}

// PHASE 1: Check for NPC4 to start mission
function checkStartNPC(runtime, player, eKeyPressed) {
	const npc4 = runtime.objects.NPC4?.getFirstInstance();
	
	if (!npc4) {
		console.warn("NPC4 not found in Mission4!");
		return;
	}
	
	const distance = Math.hypot(player.x - npc4.x, player.y - npc4.y);
	
	// Show hint when near
	if (distance < 35 && runtime.tickCount % 60 === 0) {
		console.log("Press E to talk to NPC4");
	}
	
	// Start mission dialogue
	if (distance < 30 && eKeyPressed && !missionState.eKeyWasPressed) {
		startMissionDialogue();
	}
}

function startMissionDialogue() {
	console.log("✓ Mission Started");
	console.log("NPC4: Activate the Engine by pressing E on the EngineBox!");
	
	missionState.hasStartedMission = true;
}

// PHASE 2: Check EngineBox interaction
function checkEngineBox(runtime, player, eKeyPressed) {
	const engineBox = runtime.objects.EngineBox?.getFirstInstance();
	
	if (!engineBox) {
		console.warn("EngineBox not found!");
		return;
	}
	
	const distance = Math.hypot(player.x - engineBox.x, player.y - engineBox.y);
	
	// Show hint when near
	if (distance < 50 && runtime.tickCount % 60 === 0) {
		console.log("Press E to activate Engine");
	}
	
	// Activate if E pressed while near
	if (distance < 45 && eKeyPressed && !missionState.eKeyWasPressed) {
		activateEngine(runtime);
	}
}

function activateEngine(runtime) {
	const engine = runtime.objects.Engine?.getFirstInstance();
	
	if (!engine) {
		console.warn("Engine sprite not found!");
		return;
	}
	
	// Change Engine from frame 0 to frame 1
	if (engine.animationFrame === 0) {
		engine.animationFrame = 1;
		missionState.engineActivated = true;
		console.log("✓ Engine activated! Frame changed to 1");
		console.log("→ Talk to MissionNPC4 to complete mission");
	} else {
		console.log("Engine already activated");
	}
}

// PHASE 3: Check for MissionNPC4 to complete mission
function checkCompletionNPC(runtime, player, eKeyPressed) {
	const missionNPC = runtime.objects.MissionNPC4?.getFirstInstance();
	
	if (!missionNPC) {
		console.warn("MissionNPC4 not found!");
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
	console.log("=== MISSION 7 COMPLETE ===");
	console.log("→ Returning to Lab4");  // CHANGED

	hideMissionText(runtime); // ADD THIS LINE
	// Mark mission as no longer active
	missionActive = false;
	
	// Get the mission number we were on
	const missionNumber = globalThis.currentMissionNumber || 7;
	
	// Call the global completion handler
	if (globalThis.onMissionComplete) {
		globalThis.onMissionComplete(runtime, missionNumber);
	}
	
	// CHANGED: Return to Lab4 instead of University9
	setTimeout(() => {
		if (globalThis.showLoadingAndGoTo) {
			globalThis.showLoadingAndGoTo(runtime, LAB4_LAYOUT, 160, 200);
		}
	}, 500);
	
	// Clear return data
	globalThis.returnSceneName = undefined;
	globalThis.returnPlayerX = undefined;
	globalThis.returnPlayerY = undefined;
	globalThis.currentMissionNumber = undefined;
}

export function getMission4State() {
	return { ...missionState, missionActive };
}