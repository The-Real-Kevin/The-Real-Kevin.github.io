// instructionController.js - Toggleable instruction window

let mKeyWasPressed = false;
let instructionsVisible = false;

export function initInstructionSystem(runtime) {
	console.log("Instruction system initialized");
	
	// Initialize state
	if (globalThis.instructionsVisible === undefined) {
		globalThis.instructionsVisible = false;
	}
	
	instructionsVisible = globalThis.instructionsVisible;
	
	// Set initial visibility
	updateInstructionVisibility(runtime);
}

export function updateInstructionSystem(runtime) {
	const keyboard = runtime.keyboard;
	const mKeyPressed = keyboard.isKeyDown("KeyM");
	
	// Toggle visibility when M is pressed
	if (mKeyPressed && !mKeyWasPressed) {
		toggleInstructions(runtime);
	}
	
	mKeyWasPressed = mKeyPressed;
	
	// Always restore visibility state (in case of layout changes)
	updateInstructionVisibility(runtime);
}

function toggleInstructions(runtime) {
	instructionsVisible = !instructionsVisible;
	globalThis.instructionsVisible = instructionsVisible;
	
	console.log("Instructions toggled:", instructionsVisible ? "visible" : "hidden");
	
	updateInstructionVisibility(runtime);
}

function updateInstructionVisibility(runtime) {
	const instructionText = runtime.objects.InstructionText?.getFirstInstance();
	const instructionBox = runtime.objects.InstructionBox?.getFirstInstance();
	
	if (instructionText) {
		instructionText.isVisible = instructionsVisible;
		
		// Set the text content if visible
		if (instructionsVisible) {
			instructionText.text = 'Controls: arrow keys to move, "e" to pickup/drop objects and enter locations or vehicles, "f", "r", "n" and "wasd" to use objects held. This is an open-world game, please walk around and explore the world and find out how to play. Go to the forum and press "e" for missions, complete missions to progress the story.\n\n(close this window "m")';
		}
	}
	
	if (instructionBox) {
		instructionBox.isVisible = instructionsVisible;
	}
}

export function getInstructionState() {
	return instructionsVisible;
}