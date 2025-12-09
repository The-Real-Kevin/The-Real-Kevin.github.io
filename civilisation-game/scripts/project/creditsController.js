// creditsController.js - Toggleable credits window

let cKeyWasPressed = false;
let creditsVisible = false;

export function initCreditsSystem(runtime) {
	console.log("Credits system initialized");
	
	// Initialize state
	if (globalThis.creditsVisible === undefined) {
		globalThis.creditsVisible = false;
	}
	
	creditsVisible = globalThis.creditsVisible;
	
	// Set initial visibility
	updateCreditsVisibility(runtime);
}

export function updateCreditsSystem(runtime) {
	const keyboard = runtime.keyboard;
	const cKeyPressed = keyboard.isKeyDown("KeyC");
	
	// Toggle visibility when C is pressed
	if (cKeyPressed && !cKeyWasPressed) {
		toggleCredits(runtime);
	}
	
	cKeyWasPressed = cKeyPressed;
	
	// Always restore visibility state (in case of layout changes)
	updateCreditsVisibility(runtime);
}

function toggleCredits(runtime) {
	creditsVisible = !creditsVisible;
	globalThis.creditsVisible = creditsVisible;
	
	console.log("Credits toggled:", creditsVisible ? "visible" : "hidden");
	
	updateCreditsVisibility(runtime);
}

function updateCreditsVisibility(runtime) {
	const creditsText = runtime.objects.CreditsText?.getFirstInstance();
	const creditsBox = runtime.objects.CreditsBox?.getFirstInstance();
	
	if (creditsText) {
		creditsText.isVisible = creditsVisible;
		
		// Set the text content if visible (you can customize this text)
		if (creditsVisible) {
			//creditsText.text = 'Game Credits\n\nDeveloped by: [Your Name]\nMusic by: [Artist Name]\nArt by: [Artist Name]\nSpecial Thanks: [Names]\n\nThank you for playing!\n\n(close this window "c")';
		}
	}
	
	if (creditsBox) {
		creditsBox.isVisible = creditsVisible;
	}
}

export function getCreditsState() {
	return creditsVisible;
}