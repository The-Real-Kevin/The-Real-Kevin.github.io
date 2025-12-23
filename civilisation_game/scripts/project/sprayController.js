// sprayController.js - Fixed with correct layer parameter (just the number!)

const SPRAY_OFFSET_Y = -10; // Spray floats above player when carried

// Track spray state per layout
let sprayStates = {};

function getLayoutState(layoutName) {
	if (!sprayStates[layoutName]) {
		sprayStates[layoutName] = {
			isCarrying: false,
			sprayX: 0,
			sprayY: 0,
			eKeyWasPressed: false,
			rKeyWasPressed: false,
			initialized: false
		};
	}
	return sprayStates[layoutName];
}

export function initSpraySystem(runtime) {
	console.log("Spray system initialized (works in any layout with Spray + Puddle)");
}

export function updateSpraySystem(runtime) {
	const currentLayout = runtime.layout?.name;
	const player = runtime.objects.Player?.getFirstInstance();
	if (!player) return;
	
	const spray = runtime.objects.Spray?.getFirstInstance();
	const puddleType = runtime.objects.Puddle;
	
	// Only run if this layout has both Spray and Puddle objects
	if (!spray || !puddleType) return;
	
	const state = getLayoutState(currentLayout);
	
	// Initialize spray position on first run
	if (!state.initialized) {
		state.sprayX = spray.x;
		state.sprayY = spray.y;
		state.initialized = true;
	}
	
	const keyboard = runtime.keyboard;
	const eKeyPressed = keyboard.isKeyDown("KeyE");
	const rKeyPressed = keyboard.isKeyDown("KeyR");
	
	// Handle spray
	if (state.isCarrying) {
		// Spray follows player
		spray.x = player.x;
		spray.y = player.y + SPRAY_OFFSET_Y;
		spray.isVisible = true;
		
		// Drop spray with E
		if (eKeyPressed && !state.eKeyWasPressed) {
			dropSpray(player, spray, state);
		}
		
		// Create puddle with R
		if (rKeyPressed && !state.rKeyWasPressed) {
			createPuddle(runtime, player, currentLayout);
		}
	} else {
		// Spray is on ground
		spray.x = state.sprayX;
		spray.y = state.sprayY;
		spray.isVisible = true;
		
		// Pick up spray
		const distance = Math.hypot(player.x - spray.x, player.y - spray.y);
		
		if (distance < 35 && runtime.tickCount % 60 === 0) {
			console.log("Press E to pick up Spray");
		}
		
		if (distance < 30 && eKeyPressed && !state.eKeyWasPressed) {
			pickUpSpray(spray, state, currentLayout);
		}
	}
	
	state.eKeyWasPressed = eKeyPressed;
	state.rKeyWasPressed = rKeyPressed;
}

function pickUpSpray(spray, state, layoutName) {
	console.log("✓ Picked up Spray in", layoutName);
	state.isCarrying = true;
	state.sprayX = spray.x;
	state.sprayY = spray.y;
}

function dropSpray(player, spray, state) {
	console.log("✓ Dropped Spray");
	state.isCarrying = false;
	state.sprayX = player.x;
	state.sprayY = player.y;
	
	// Position spray at player location
	spray.x = player.x;
	spray.y = player.y;
}

function createPuddle(runtime, player, layoutName) {
	const puddleType = runtime.objects.Puddle;
	if (!puddleType) {
		console.error("Puddle object not found!");
		return;
	}
	
	try {
		// Create new puddle at player position on layer 0 (just the number!)
		const newPuddle = puddleType.createInstance(0, player.x, player.y);
		
		// Set random rotation
		const randomAngle = Math.random() * 360;
		newPuddle.angle = randomAngle;
		newPuddle.isVisible = true;
		
		console.log("✓ Created puddle in", layoutName, "at:", Math.round(player.x), Math.round(player.y), "angle:", Math.round(randomAngle));
	} catch (error) {
		console.error("Error creating puddle in", layoutName, ":", error);
	}
}

export function getSprayStates() {
	return { ...sprayStates };
}