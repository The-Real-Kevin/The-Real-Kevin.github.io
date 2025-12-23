// endingMission1Controller.js - COMPLETELY FIXED

import { handlePlayerMovement } from "./playerController.js";
import { showLoadingAndGoTo } from "./forumController.js";

let npcDialogueComplete = false;
let wasEKeyDown = false;

export function initEndingMission1(runtime) {
	console.log("Ending Mission 1 system initialized");
	
	// Initialize flag
	if (globalThis.npc6DialogueComplete === undefined) {
		globalThis.npc6DialogueComplete = false;
	}
}

export function updateEndingMission1(runtime) {
	const currentLayout = runtime.layout?.name;
	
	// Only run in Court6
	if (currentLayout !== "Court6") {
		return;
	}
	
	const player = runtime.objects.Player?.getFirstInstance();
	if (!player) return;
	
	const keyboard = runtime.keyboard;
	
	// Allow player movement
	handlePlayerMovement(runtime, player, keyboard);
	
	// Check for MissionNPC6 interaction (if NPC6 dialogue was completed)
	if (globalThis.npc6DialogueComplete) {
		checkMissionNPC6(runtime, player, keyboard);
	}
}

function checkMissionNPC6(runtime, player, keyboard) {
	const missionNPC6 = runtime.objects.MissionNPC6?.getFirstInstance();
	if (!missionNPC6) {
		console.warn("MissionNPC6 not found in Court6!");
		return;
	}
	
	const distance = Math.hypot(player.x - missionNPC6.x, player.y - missionNPC6.y);
	
	if (distance < 30 && runtime.tickCount % 60 === 0) {
		console.log(">>> Press E on MissionNPC6 to complete Ending Mission 1 <<<");
		console.log("    Distance:", Math.round(distance));
	}
	
	const eKeyPressed = keyboard.isKeyDown("KeyE");
	
	if (distance < 30 && eKeyPressed && !wasEKeyDown) {
		console.log("!!! MissionNPC6 E KEY PRESSED !!!");
		completeEndingMission1(runtime);
	}
	
	wasEKeyDown = eKeyPressed;
}

function completeEndingMission1(runtime) {
	console.log("=== ENDING MISSION 1 COMPLETE ===");
	
	// Mark mission as complete
	globalThis.endingMission1Complete = true;
	
	console.log("Set globalThis.endingMission1Complete = true");
	
	// Return to Scene1 with loading screen
	setTimeout(() => {
		console.log("Teleporting back to Scene1...");
		showLoadingAndGoTo(runtime, "Scene1", 160, 180);
	}, 500);
}

export function startEndingMission1(runtime) {
	console.log("=== STARTING ENDING MISSION 1 (NPC6 triggered) ===");
	// This gets called when NPC6 dialogue finishes
	// We don't need to do anything here, the mission is "active" when in Court6
}

// Called by NPC6 dialogue completion
export function onNPC6DialogueComplete() {
	console.log("NPC6 dialogue complete - MissionNPC6 now active");
	globalThis.npc6DialogueComplete = true;
}

export function isEndingMission1Active() {
	return false; // Never blocks other systems
}