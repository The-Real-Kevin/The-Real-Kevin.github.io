// endingMission2Controller.js - COMPLETELY FIXED

import { handlePlayerMovement } from "./playerController.js";
import { showLoadingAndGoTo } from "./forumController.js";

let npcDialogueComplete = false;
let wasEKeyDown = false;

export function initEndingMission2(runtime) {
	console.log("Ending Mission 2 system initialized");
	
	// Initialize flag
	if (globalThis.npc7DialogueComplete === undefined) {
		globalThis.npc7DialogueComplete = false;
	}
}

export function updateEndingMission2(runtime) {
	const currentLayout = runtime.layout?.name;
	
	// Only run in Court7
	if (currentLayout !== "Court7") {
		return;
	}
	
	const player = runtime.objects.Player?.getFirstInstance();
	if (!player) return;
	
	const keyboard = runtime.keyboard;
	
	// Allow player movement
	handlePlayerMovement(runtime, player, keyboard);
	
	// Check for MissionNPC7 interaction (if NPC7 dialogue was completed)
	if (globalThis.npc7DialogueComplete) {
		checkMissionNPC7(runtime, player, keyboard);
	}
}

function checkMissionNPC7(runtime, player, keyboard) {
	const missionNPC7 = runtime.objects.MissionNPC7?.getFirstInstance();
	if (!missionNPC7) {
		console.warn("MissionNPC7 not found in Court7!");
		return;
	}
	
	const distance = Math.hypot(player.x - missionNPC7.x, player.y - missionNPC7.y);
	
	if (distance < 30 && runtime.tickCount % 60 === 0) {
		console.log(">>> Press E on MissionNPC7 to complete Ending Mission 2 <<<");
		console.log("    Distance:", Math.round(distance));
	}
	
	const eKeyPressed = keyboard.isKeyDown("KeyE");
	
	if (distance < 30 && eKeyPressed && !wasEKeyDown) {
		console.log("!!! MissionNPC7 E KEY PRESSED !!!");
		completeEndingMission2(runtime);
	}
	
	wasEKeyDown = eKeyPressed;
}

function completeEndingMission2(runtime) {
	console.log("=== ENDING MISSION 2 COMPLETE ===");
	
	// Mark mission as complete
	globalThis.endingMission2Complete = true;
	
	console.log("Set globalThis.endingMission2Complete = true");
	
	// Return to Scene1 with loading screen
	setTimeout(() => {
		console.log("Teleporting back to Scene1...");
		showLoadingAndGoTo(runtime, "Scene1", 160, 180);
	}, 500);
}

export function startEndingMission2(runtime) {
	console.log("=== STARTING ENDING MISSION 2 (NPC7 triggered) ===");
	// This gets called when NPC7 dialogue finishes
	// We don't need to do anything here, the mission is "active" when in Court7
}

// Called by NPC7 dialogue completion
export function onNPC7DialogueComplete() {
	console.log("NPC7 dialogue complete - MissionNPC7 now active");
	globalThis.npc7DialogueComplete = true;
}

export function isEndingMission2Active() {
	return false; // Never blocks other systems
}