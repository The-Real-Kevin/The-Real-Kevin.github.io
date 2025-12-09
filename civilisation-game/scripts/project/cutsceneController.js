// cutsceneController.js - Handles the cutscene after tutorial (DEBUG VERSION)

const CUTSCENE_LAYOUT = "Cutscene";
const FIRST_GAME_SCENE = "Scene1";

let inCutscene = false;
let currentCutsceneFrame = 0;
let maxCutsceneFrames = 5;
let eKeyWasPressed = false;
let framesSinceStart = 0;

export function initCutsceneSystem(runtime) {
	runtime.addEventListener("beforelayoutstart", () => {
		const layoutName = runtime.layout.name;
		console.log("initCutsceneSystem - Layout:", layoutName);
		
		if (layoutName === CUTSCENE_LAYOUT) {
			inCutscene = true;
			currentCutsceneFrame = 0;
			eKeyWasPressed = false; // CHANGED: Start with false
			framesSinceStart = 0;
			console.log("=== CUTSCENE STARTED ===");
			console.log("Press E to advance through cutscene");
			
			setTimeout(() => {
				const cutsceneSprite = runtime.objects.CutsceneSprite?.getFirstInstance();
				if (cutsceneSprite) {
					cutsceneSprite.animationFrame = 0;
					maxCutsceneFrames = cutsceneSprite.animation.frameCount;
					console.log("CutsceneSprite found!");
					console.log("Total frames:", maxCutsceneFrames);
					console.log("Currently showing frame 0");
				} else {
					console.error("CutsceneSprite NOT FOUND!");
				}
			}, 100);
		} else {
			inCutscene = false;
		}
	});
}

export function updateCutsceneSystem(runtime) {
	// ALWAYS sync state with current layout (like we do in tutorial)
	const currentLayout = runtime.layout?.name;
	
	if (currentLayout === CUTSCENE_LAYOUT) {
		if (!inCutscene) {
			// Just entered cutscene layout
			inCutscene = true;
			currentCutsceneFrame = 0;
			eKeyWasPressed = false;
			framesSinceStart = 0;
			console.log("=== CUTSCENE DETECTED ===");
			console.log("Press E to advance through cutscene");
			
			const cutsceneSprite = runtime.objects.CutsceneSprite?.getFirstInstance();
			if (cutsceneSprite) {
				cutsceneSprite.animationFrame = 0;
				maxCutsceneFrames = cutsceneSprite.animation.frameCount;
				console.log("CutsceneSprite found! Total frames:", maxCutsceneFrames);
			} else {
				console.error("CutsceneSprite NOT FOUND!");
			}
		}
	} else {
		if (inCutscene) {
			inCutscene = false;
			console.log("Left cutscene layout");
		}
	}
	
	// Only run cutscene logic if we're in cutscene
	if (!inCutscene) return;
	
	framesSinceStart++;
	
	const keyboard = runtime.keyboard;
	const eKeyPressed = keyboard.isKeyDown("KeyE");
	
	// Log E key state every half second
	if (framesSinceStart % 30 === 0) {
		console.log("In cutscene - E key:", eKeyPressed, "- Frame:", currentCutsceneFrame);
	}
	
	// Detect E key press
	if (eKeyPressed && !eKeyWasPressed) {
		console.log("!!! E KEY DETECTED !!! - Advancing cutscene");
		advanceCutscene(runtime);
	}
	
	eKeyWasPressed = eKeyPressed;
}


function advanceCutscene(runtime) {
	console.log("advanceCutscene called - Current frame:", currentCutsceneFrame);
	
	const cutsceneSprite = runtime.objects.CutsceneSprite?.getFirstInstance();
	
	if (!cutsceneSprite) {
		console.error("CutsceneSprite not found in advanceCutscene!");
		startMainGame(runtime);
		return;
	}
	
	// Move to next frame
	currentCutsceneFrame++;
	console.log("Advanced to frame:", currentCutsceneFrame);
	
	// Check if we should show another frame or end cutscene
	if (currentCutsceneFrame < maxCutsceneFrames) {
		cutsceneSprite.animationFrame = currentCutsceneFrame;
		console.log("Set sprite to frame", currentCutsceneFrame, "(", (currentCutsceneFrame + 1), "of", maxCutsceneFrames, ")");
	} else {
		console.log("=== CUTSCENE COMPLETE ===");
		console.log("All", maxCutsceneFrames, "frames shown. Starting main game...");
		startMainGame(runtime);
	}
}

function startMainGame(runtime) {
	console.log("=== STARTING MAIN GAME ===");
	inCutscene = false;
	
	// Set player spawn position for Scene1
	globalThis.playerSpawnX = 80;
	globalThis.playerSpawnY = 180;
	
	console.log("Player will spawn at:", globalThis.playerSpawnX, globalThis.playerSpawnY);
	
	setTimeout(() => {
		console.log("Transitioning to:", FIRST_GAME_SCENE);
		try {
			runtime.goToLayout(FIRST_GAME_SCENE);
			console.log("Successfully loaded", FIRST_GAME_SCENE);
		} catch (error) {
			console.error("ERROR loading Scene1:", error);
		}
	}, 100);
}

export function isCutsceneActive() {
	return inCutscene;
}