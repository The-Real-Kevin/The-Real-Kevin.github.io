// tutorialController.js - Handles start screen and tutorial sequence

import { startTimer } from "./timerController.js";

// Layout names
const START_SCREEN_LAYOUT = "StartScreen";
const TUTORIAL_LAYOUT = "TutorialScene";
const CUTSCENE_LAYOUT = "Cutscene";
const FIRST_GAME_SCENE = "Scene1";

// Tutorial state
let inStartScreen = false;
let inTutorial = false;
let isCarryingBucket = false;
let eKeyWasPressed = false;
let systemInitialized = false;

// Drop zone configuration
const DROP_ZONE = {
	x: 160,
	y: 128,
	radius: 40
};

export function initTutorialSystem(runtime) {
	if (systemInitialized) return;
	systemInitialized = true;
	
	console.log("Initializing tutorial system");
	
	runtime.addEventListener("beforelayoutstart", () => {
		const layoutName = runtime.layout.name;
		console.log("Layout starting:", layoutName);
		
		if (layoutName === START_SCREEN_LAYOUT) {
			inStartScreen = true;
			inTutorial = false;
			console.log("Start screen loaded - Press E to start");
		} else if (layoutName === TUTORIAL_LAYOUT) {
			inStartScreen = false;
			inTutorial = true;
			isCarryingBucket = false;
			console.log("Tutorial started");
		} else {
			inStartScreen = false;
			inTutorial = false;
			isCarryingBucket = false;
		}
	});
	
	// ALSO check the current layout immediately
	setTimeout(() => {
		const currentLayout = runtime.layout.name;
		console.log("Current layout on init:", currentLayout);
		if (currentLayout === START_SCREEN_LAYOUT) {
			inStartScreen = true;
			console.log("Detected start screen - ready for E key");
		}
	}, 100);
}

export function updateTutorialSystem(runtime) {
	// ALWAYS check current layout to sync state
	const currentLayout = runtime.layout?.name;
	
	// Force update state based on current layout
	if (currentLayout === START_SCREEN_LAYOUT) {
		if (!inStartScreen) {
			inStartScreen = true;
			inTutorial = false;
			console.log("State synced: On start screen");
		}
	} else if (currentLayout === TUTORIAL_LAYOUT) {
		if (!inTutorial) {
			inStartScreen = false;
			inTutorial = true;
			console.log("State synced: In tutorial");
		}
	} else {
		if (inStartScreen || inTutorial) {
			inStartScreen = false;
			inTutorial = false;
			console.log("State synced: In main game");
		}
	}
	
	const keyboard = runtime.keyboard;
	const eKeyPressed = keyboard.isKeyDown("KeyE");
	
	// Only log occasionally to avoid spam
	if (runtime.tickCount % 60 === 0) {
		console.log("Current layout:", currentLayout, "- inStartScreen:", inStartScreen, "inTutorial:", inTutorial);
	}
	
	if (inStartScreen) {
		if (eKeyPressed && !eKeyWasPressed) {
			console.log("E pressed on start screen - starting timer and going to tutorial");
			
			// START THE TIMER HERE - MOVED FROM UNUSED FUNCTION
			startTimer();
			
			runtime.goToLayout(TUTORIAL_LAYOUT);
		}
	} else if (inTutorial) {
		updateTutorial(runtime, eKeyPressed);
	}
	
	eKeyWasPressed = eKeyPressed;
}

function updateTutorial(runtime, eKeyPressed) {
	const player = runtime.objects.Player?.getFirstInstance();
	const bucket = runtime.objects.WaterBucket?.getFirstInstance();
	
	if (!player) {
		console.warn("Player not found in tutorial");
		return;
	}
	
	if (!bucket) {
		console.warn("WaterBucket not found in tutorial");
		return;
	}
	
	// DEBUG: Log player position occasionally
	if (runtime.tickCount % 60 === 0) {
		console.log("Player at:", player.x, player.y, "Bucket at:", bucket.x, bucket.y);
		console.log("Carrying bucket:", isCarryingBucket);
	}
	
	if (isCarryingBucket) {
		bucket.x = player.x;
		bucket.y = player.y - 10;
		
		if (eKeyPressed && !eKeyWasPressed) {
			dropBucket(runtime, player, bucket);
		}
	} else {
		const distanceToBucket = Math.hypot(player.x - bucket.x, player.y - bucket.y);
		
		// DEBUG: Show distance when near
		if (distanceToBucket < 50) {
			console.log("Distance to bucket:", distanceToBucket);
		}
		
		if (distanceToBucket < 30 && eKeyPressed && !eKeyWasPressed) {
			pickUpBucket(runtime);
		}
	}
}

function pickUpBucket(runtime) {
	isCarryingBucket = true;
	console.log("Picked up bucket!");
}

function dropBucket(runtime, player, bucket) {
	isCarryingBucket = false;
	
	const distanceToDropZone = Math.hypot(player.x - DROP_ZONE.x, player.y - DROP_ZONE.y);
	
	if (distanceToDropZone < DROP_ZONE.radius) {
		console.log("Bucket placed correctly! Starting cutscene...");
		bucket.x = DROP_ZONE.x;
		bucket.y = DROP_ZONE.y;
		
		setTimeout(() => {
			runtime.goToLayout(CUTSCENE_LAYOUT);
		}, 1000);
	} else {
		console.log("Bucket dropped - not in correct location");
	}
}

export function isTutorialActive() {
	return inStartScreen || inTutorial;
}

export function canPlayerMove() {
	return !inStartScreen; // Can move in tutorial, just not on start screen
}