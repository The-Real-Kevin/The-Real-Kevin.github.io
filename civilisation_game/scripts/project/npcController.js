// npcController.js - Fixed with safety checks for undefined dialogues

import { startMission1 } from "./mission1Controller.js";
import { startMission2 } from "./mission2Controller.js";
import { startMission3 } from "./mission3Controller.js";
import { startMission4 } from "./mission4Controller.js";
import { startMission5 } from "./mission5Controller.js";
import { startEndingMission1, onNPC6DialogueComplete } from "./endingMission1Controller.js"; // NEW
import { startEndingMission2, onNPC7DialogueComplete } from "./endingMission2Controller.js"; // NEW

export const NPC_DIALOGUES = {
	"NPC1": [
		"This city is too hot; we need to cool it down.",
		"Can you show them how to build a few coolers at the factory?",
		"Carry the AC unit to the drop zone.",
		"Great, that will fight off the worst of the heat!"
	],
	"NPC2": [
		"Can you find the computer and deliver it to my colleague?",
		"It contains information on ice research for cooling the city.",
		"Thank you for your help!"
	],
	"NPC3": [
		"Our people's thoughts are too consumed by Fire ideas.",
		"The library shelves are filled with their writings,",
		"while our own scholars hesitate to speak.",
		"We must gather our thinkers and compose a collective treatise.",
		"The people think that we bring corruption to the land.",
		"We must show them that our contributions brought the great growth",
		"whose fruit they enjoy today.",
		"Show that we are not rejecting the fire ideals this city was built from,",
		"but only complement them.",
		"Order is not oppression; it is the soil in which prosperity grows.",
		"Give the book to the librarian to get published and printed."
	],
	"NPC4": [
		"The new project is going great!",
		"It's going to improve the northern park's heating system and humidifiers,",
		"allowing more tropical plants to grow.",
		"We found a Fire person hijacking the project to burn the park.",
		"The Fire researcher said that's not his work!",
		"We can't trust the project. What if there's more that we don't know of?",
		"Stop it!"
	],
	"NPC5": [
		"These fire people are spreading extreme thoughts",
		"and poisoning our minds.",
		"Get their books out of the library.",
		"Use the hydrant to destroy the Fire books.",
		"Good. Keep our people safe from those radicals."
	],
	"NPC6": [
		"Fire speaker: I respect the Ice scholars.",
		"But they've gone too far on this.",
		"They want to change the education curriculum",
		"and replace some fire ideals with theirs.",
		"Ice speaker: We've been on the path of progress for a long time,",
		"and we've come a long way since the last great fires.",
		"We must continue on this path,",
		"and away from glorifying the blazing flame",
		"as it might breed extreme thoughts.",
		"Mayor: You spread fear based on extremists long gone.",
		"The fire of today isn't the one that destroyed the city,",
		"but it is the one that keeps the people's drive,",
		"fuels our ambition, and keeps the warm connection",
		"between our community.",
		"So I ask you, what is wrong with the fire of today?",
		"Ice speaker: Nothing.",
		"Mayor: We mustn't march blindly in one direction",
		"in the name of progress; not all change is progress.",
		"The new curriculum won't pass."
	],
	"NPC7": [
		"Ice speaker: I respect the Fire scholars.",
		"But they've gone too far on this.",
		"They're trying to remove some of our books from the library,",
		"saying that they are straying from the values of our forefathers.",
		"Fire speaker: Do you forget what happened before the Great Fire?",
		"We had a thriving city… until those who abandoned our values",
		"weakened us.",
		"Their neglect froze us into stagnation",
		"— and we nearly perished for it.",
		"It is happening again.",
		"If we let go of the flame that shaped us, we will lose ourselves.",
		"Mayor: You superstitiously hang on to the practices of our fathers,",
		"not thinking about what's right or wrong.",
		"Holding us back, even when we have found a better way.",
		"The contributions of the Ice people have induced great growth",
		"and stability in our city.",
		"So I ask you, what is wrong with these books?",
		"Fire speaker: Nothing.",
		"Mayor: Not all change is corruption. We must grow.",
		"The books stay."
	]
};

const NPC_MISSION_HANDLERS = {
	"NPC1": startMission1,
	"NPC2": startMission2,
	"NPC3": startMission3,
	"NPC4": startMission4,
	"NPC5": startMission5,
	"NPC6": startEndingMission1, // NEW
	"NPC7": startEndingMission2  // NEW
};

const NPC_DIALOGUE_COMPLETE_HANDLERS = {
	"NPC6": onNPC6DialogueComplete, // NEW
	"NPC7": onNPC7DialogueComplete  // NEW
};

// List of all NPC types
const ALL_NPC_TYPES = ["NPC1", "NPC2", "NPC3", "NPC4", "NPC5", "NPC6", "NPC7", "MissionNPC1", "MissionNPC2", "MissionNPC3", "MissionNPC4", "MissionNPC5", "FireCivilianNPC"]; // REMOVED MissionNPC6 and MissionNPC7

// Dialogue system state
let currentDialogueNPC = null;
let currentDialogueIndex = 0;
let isShowingDialogue = false;
let eKeyWasPressed = false;

// NPC animation state
let npcAnimationTimer = 0;
let npcMoveUp = true;

export function isPlayerInDialogue() {
	return isShowingDialogue;
}

export function updateNPCDialogue(runtime, player, keyboard) {
	if (!isShowingDialogue) {
		// Not in dialogue - check for nearby NPCs
		handleNPCInteraction(runtime, player, keyboard);
	} else {
		// In dialogue - handle progression
		handleDialogueProgression(runtime, player, keyboard);
	}
}

// Update handleNPCInteraction function:
function handleNPCInteraction(runtime, player, keyboard) {
	// Check if player is near any NPC
	const nearbyNPC = checkNearbyNPC(runtime, player);
	
	// Check if E key is pressed (with debouncing)
	const eKeyPressed = keyboard.isKeyDown("KeyE");
	
	if (eKeyPressed && !eKeyWasPressed && nearbyNPC) {
		// SAFETY CHECK: Only start dialogue if NPC has dialogue defined
		if (NPC_DIALOGUES[nearbyNPC]) {
			// NEW: Block NPC6 dialogue if already talked to
			if (nearbyNPC === "NPC6") {
				if (globalThis.npc6DialogueShown) {
					console.log("NPC6 dialogue already shown - ignoring");
					eKeyWasPressed = eKeyPressed;
					return;
				}
			}
			
			// NEW: Block NPC7 dialogue if already talked to
			if (nearbyNPC === "NPC7") {
				if (globalThis.npc7DialogueShown) {
					console.log("NPC7 dialogue already shown - ignoring");
					eKeyWasPressed = eKeyPressed;
					return;
				}
			}
			
			startDialogue(runtime, nearbyNPC);
		} else {
			console.log(`${nearbyNPC} has no dialogue defined - ignoring interaction`);
		}
	}
	
	eKeyWasPressed = eKeyPressed;
}

function checkNearbyNPC(runtime, player) {
	const interactionDistance = 30; // pixels
	
	for (const npcType of ALL_NPC_TYPES) {
		const npcObject = runtime.objects[npcType];
		if (!npcObject) continue;
		
		const instances = npcObject.getAllInstances();
		for (const npc of instances) {
			const distance = Math.hypot(player.x - npc.x, player.y - npc.y);
			if (distance < interactionDistance) {
				return npcType;
			}
		}
	}
	
	return null;
}

function startDialogue(runtime, npcType) {
	console.log("Starting dialogue with:", npcType);
	currentDialogueNPC = npcType;
	currentDialogueIndex = 0;
	isShowingDialogue = true;
	
	updateDialogueText(runtime);
}

function updateDialogueText(runtime) {
	const dialogues = NPC_DIALOGUES[currentDialogueNPC];
	
	// SAFETY CHECK: Make sure dialogues exist
	if (!dialogues) {
		console.error(`No dialogues found for ${currentDialogueNPC}`);
		hideDialogue(runtime);
		return;
	}
	
	const currentText = dialogues[currentDialogueIndex];
	
	//console.log(`[${currentDialogueNPC}]: ${currentText}`);
	//console.log(`(Dialogue ${currentDialogueIndex + 1}/${dialogues.length}) - Press E to continue`);
	
	// UPDATE THE DIALOGUE TEXT
	const dialogueTextObj = runtime.objects.DialogueText?.getFirstInstance();
	if (dialogueTextObj) {
		//dialogueTextObj.text = `[${currentDialogueNPC}]\n${currentText}\n\n(Press E to continue)`;
		dialogueTextObj.text = `[${currentDialogueNPC}]${currentText}`;
		dialogueTextObj.isVisible = true;
		//console.log("DialogueText updated and made visible");
	} else {
		//console.warn("DialogueText object not found in this layout!");
	}
	
	// SHOW THE DIALOGUE BOX
	const dialogueBox = runtime.objects.DialogueBox?.getFirstInstance();
	if (dialogueBox) {
		dialogueBox.isVisible = true;
		console.log("DialogueBox shown");
	} else {
		console.warn("DialogueBox object not found in this layout!");
	}
}

function handleDialogueProgression(runtime, player, keyboard) {
	const eKeyPressed = keyboard.isKeyDown("KeyE");
	
	// E key pressed - advance dialogue
	if (eKeyPressed && !eKeyWasPressed) {
		const dialogues = NPC_DIALOGUES[currentDialogueNPC];
		
		// SAFETY CHECK: Make sure dialogues exist
		if (!dialogues) {
			console.error(`No dialogues found for ${currentDialogueNPC} during progression`);
			hideDialogue(runtime);
			eKeyWasPressed = eKeyPressed;
			return;
		}
		
		currentDialogueIndex++;
		
		// Check if there are more dialogues
		if (currentDialogueIndex < dialogues.length) {
			// Show next dialogue
			updateDialogueText(runtime);
		} else {
			// No more dialogues - start mission
			console.log("=== DIALOGUE ENDED - STARTING MISSION ===");
			startMission(runtime, player);
		}
	}
	
	eKeyWasPressed = eKeyPressed;
}

// Update startMission function to mark NPC6/NPC7 as shown:
function startMission(runtime, player) {
	const missionHandler = NPC_MISSION_HANDLERS[currentDialogueNPC];
	
	if (!missionHandler) {
		console.error("No mission handler for", currentDialogueNPC);
		hideDialogue(runtime);
		return;
	}
	
	// Mark NPC6/NPC7 dialogue as shown
	if (currentDialogueNPC === "NPC6") {
		globalThis.npc6DialogueShown = true;
		console.log("NPC6 dialogue marked as shown");
	}
	if (currentDialogueNPC === "NPC7") {
		globalThis.npc7DialogueShown = true;
		console.log("NPC7 dialogue marked as shown");
	}
	
	// Check if this NPC has a dialogue complete handler
	const dialogueCompleteHandler = NPC_DIALOGUE_COMPLETE_HANDLERS[currentDialogueNPC];
	if (dialogueCompleteHandler) {
		dialogueCompleteHandler();
	}
	
	// Save player's current position to return later (only for missions 1-5)
	if (currentDialogueNPC !== "NPC6" && currentDialogueNPC !== "NPC7") {
		globalThis.returnSceneName = runtime.layout.name;
		globalThis.returnPlayerX = player.x;
		globalThis.returnPlayerY = player.y;
	}
	
	// Hide dialogue
	hideDialogue(runtime);
	
	// Call the mission-specific start function
	missionHandler(runtime, player);
}

function hideDialogue(runtime) {
	isShowingDialogue = false;
	currentDialogueNPC = null;
	currentDialogueIndex = 0;
	
	// HIDE THE DIALOGUE TEXT
	const dialogueTextObj = runtime.objects.DialogueText?.getFirstInstance();
	if (dialogueTextObj) {
		dialogueTextObj.isVisible = false;
		console.log("DialogueText hidden");
	}
	
	// HIDE THE DIALOGUE BOX
	const dialogueBox = runtime.objects.DialogueBox?.getFirstInstance();
	if (dialogueBox) {
		dialogueBox.isVisible = false;
		console.log("DialogueBox hidden");
	}
}

export function animateAllNPCs(runtime) {
	// Animate NPCs every 1 second (60 ticks at 60 FPS)
	npcAnimationTimer++;
	
	if (npcAnimationTimer >= 60) {
		npcAnimationTimer = 0;
		
		const moveAmount = npcMoveUp ? -2 : 2; // Move up or down
		
		for (const npcType of ALL_NPC_TYPES) {
			const npcObject = runtime.objects[npcType];
			if (!npcObject) continue;
			
			const instances = npcObject.getAllInstances();
			for (const npc of instances) {
				npc.y += moveAmount;
			}
		}
		
		// Toggle direction for next time
		npcMoveUp = !npcMoveUp;
	}
}

// Helper function to return from any mission
export function returnFromMission(runtime) {
	if (globalThis.returnSceneName) {
		globalThis.playerSpawnX = globalThis.returnPlayerX;
		globalThis.playerSpawnY = globalThis.returnPlayerY;
		runtime.goToLayout(globalThis.returnSceneName);
		
		// Clear return data
		globalThis.returnSceneName = undefined;
		globalThis.returnPlayerX = undefined;
		globalThis.returnPlayerY = undefined;
		
		console.log("Returned from mission");
	}
}

// Export for global use
globalThis.returnFromMission = returnFromMission;