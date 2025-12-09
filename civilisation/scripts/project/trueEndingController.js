// trueEndingController.js - True ending sequence with TrueEnd sprite and dialogue

import { showLoadingAndGoTo } from "./forumController.js";

let eKeyWasPressed = false;
let trueEndFrame = 0;
const TOTAL_FRAMES = 25; // Frames 0-24

// True ending dialogue (frames 0-23 have dialogue, frame 24 is empty)
const TRUE_END_DIALOGUE = [
	"Mayor: Our city came out of a blazing inferno.",
	"Relentless, hostile destruction.",
	"And from the ashes, emerged order.",
	"We rebuilt, and deradicalized.",
	"Moving away from the hostile fires and towards prosperity.",
	"We arrived at a 'Golden Zone'.",
	"And life in the city seemed perfect.",
	"Still, we, the Ice people, kept pushing to cool the city further,",
	"in the name of progress.",
	"Further away from the destructive fire.",
	"Further towards the cool that made our city so beautiful.",
	"Then, the fire people opposed our 'Progress'.",
	"We, the Ice people, thought, what radicals!",
	"They want to pull us back into the fires!",
	"We cracked down on them and forced them from our city.",
	"And then we realized,",
	"the ice people too became radicals.",
	"And our beautiful city, frozen and unlivable.",
	"Fire is neither good nor bad.",
	"Ice is neither good nor bad.",
	"They are extremes.",
	"Neither direction is 'Good'.",
	"There is no 'Good' direction, only a good destination.",
	"What is 'good' is right here, in balance."
	// Frame 24 has no dialogue (empty)
];

export function initTrueEndingSystem(runtime) {
	console.log("True ending system initialized");
	
	// Initialize frame tracking
	if (globalThis.trueEndFrame === undefined) {
		globalThis.trueEndFrame = 0;
	}
	
	trueEndFrame = globalThis.trueEndFrame;
}

export function updateTrueEndingSystem(runtime) {
	const currentLayout = runtime.layout?.name;
	
	// Only run in TrueEnding layout
	if (currentLayout !== "TrueEnding") {
		return;
	}
	
	const player = runtime.objects.Player?.getFirstInstance();
	if (!player) return;
	
	const keyboard = runtime.keyboard;
	const eKeyPressed = keyboard.isKeyDown("KeyE");
	
	// Get TrueEnd sprite
	const trueEnd = runtime.objects.TrueEnd?.getFirstInstance();
	if (!trueEnd) {
		console.warn("TrueEnd sprite not found!");
		return;
	}
	
	// Restore frame
	if (trueEnd.animationFrame !== trueEndFrame) {
		trueEnd.animationFrame = trueEndFrame;
		globalThis.trueEndFrame = trueEndFrame;
	}
	
	// Update dialogue text based on current frame
	updateTrueEndDialogue(runtime);
	
	// Show hint every second
	if (runtime.tickCount % 60 === 0) {
		if (trueEndFrame < TOTAL_FRAMES - 1) {
			console.log(`TRUE ENDING - Frame ${trueEndFrame}/${TOTAL_FRAMES - 1} - Press E to continue`);
		} else {
			console.log("TRUE ENDING - Final frame reached - Press E to return to world");
		}
	}
	
	// Handle E key press
	if (eKeyPressed && !eKeyWasPressed) {
		handleTrueEndingProgression(runtime, trueEnd);
	}
	
	eKeyWasPressed = eKeyPressed;
}

function updateTrueEndDialogue(runtime) {
	const trueEndDialogue = runtime.objects.TrueEndDialogue?.getFirstInstance();
	const trueEndBox = runtime.objects.TrueEndBox?.getFirstInstance();
	
	if (!trueEndDialogue || !trueEndBox) {
		console.warn("TrueEndDialogue or TrueEndBox not found!");
		return;
	}
	
	// Frames 0-23: Show dialogue
	if (trueEndFrame < TOTAL_FRAMES - 1) {
		if (trueEndFrame < TRUE_END_DIALOGUE.length) {
			trueEndDialogue.text = TRUE_END_DIALOGUE[trueEndFrame];
			trueEndDialogue.isVisible = true;
			trueEndBox.isVisible = true;
		}
	} else {
		// Frame 24: Hide dialogue and box
		trueEndDialogue.text = "";
		trueEndDialogue.isVisible = false;
		trueEndBox.isVisible = false;
	}
}

function handleTrueEndingProgression(runtime, trueEnd) {
	console.log("=== TRUE ENDING PROGRESSION ===");
	console.log("Current frame:", trueEndFrame);
	
	if (trueEndFrame < TOTAL_FRAMES - 1) {
		// Advance to next frame
		trueEndFrame++;
		trueEnd.animationFrame = trueEndFrame;
		globalThis.trueEndFrame = trueEndFrame;
		console.log(`✓ Advanced to frame ${trueEndFrame}`);
		
		// Update dialogue for new frame
		updateTrueEndDialogue(runtime);
	} else {
		// Last frame reached - complete true ending and return to Scene1
		completeTrueEnding(runtime);
	}
}

function completeTrueEnding(runtime) {
	console.log("=== TRUE ENDING COMPLETE ===");
	console.log("🎉 Congratulations! You've completed the true ending! 🎉");
	console.log("The world is now open for exploration!");
	
	// Mark true ending as complete
	globalThis.trueEndingComplete = true;
	
	// Reset frame for potential replay
	trueEndFrame = 0;
	globalThis.trueEndFrame = 0;
	
	// Return to Scene1
	setTimeout(() => {
		console.log("Returning to the open world...");
		showLoadingAndGoTo(runtime, "Scene1", 160, 180);
	}, 1000);
}

export function isTrueEndingActive() {
	return false; // Never blocks other systems
}