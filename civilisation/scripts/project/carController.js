// carController.js - Fixed version with better scene transition handling

const CAR_SPEED = 5;
let playerInCar = false;
let currentCar = null;
let wasEKeyDown = false;


// Track which scene each car is currently in
const carSceneMap = new Map(); // Map<car instance, scene name>

export function initCarSystem(runtime) {
	
	console.log("Car system initialized");
	playerInCar = false;
	currentCar = null;
	wasEKeyDown = false;
	carSceneMap.clear();
	
	// Initialize all cars to Scene10 when layout changes
	runtime.addEventListener("beforelayoutstart", () => {
		setTimeout(() => {
			const mayorCars = runtime.objects.MayorCar?.getAllInstances() || [];
			
			// Only initialize if map is empty (first time)
			if (carSceneMap.size === 0) {
				for (const car of mayorCars) {
					carSceneMap.set(car, "Scene10");
					car.animationFrame = 0; // Set all cars to face right (frame 0)
				}
				console.log("Initialized", mayorCars.length, "cars in Scene10, all facing right");
			}
			
			// Force update visibility after scene load
			updateCarVisibilityImmediate(runtime);
		}, 50);
	});
}

export function isPlayerInCar() {
	return playerInCar;
}

export function getCurrentCar() {
	return currentCar;
}

function updateCarVisibilityImmediate(runtime) {
	const currentLayout = runtime.layout.name;
	const mayorCars = runtime.objects.MayorCar?.getAllInstances() || [];
	
	console.log("=== Updating car visibility in", currentLayout, "===");
	
	for (const car of mayorCars) {
		const carScene = carSceneMap.get(car) || "Scene10";
		const shouldBeVisible = (carScene === currentLayout);
		
		car.isVisible = shouldBeVisible;
		
		
		console.log("Car at", Math.round(car.x), Math.round(car.y), 
			"- tracked scene:", carScene, 
			"- visible:", shouldBeVisible,
			"- is current car:", car === currentCar);
	}
}

export function updateCarSystem(runtime, player, keyboard) {
	const eKeyDown = keyboard.isKeyDown("KeyE");
	
	// Manage car visibility based on their tracked scenes
	manageCarVisibility(runtime);
	
	// Detect E key press (not held)
	if (eKeyDown && !wasEKeyDown) {
		if (!playerInCar) {
			// Try to enter a car
			tryEnterCar(runtime, player);
		} else {
			// Exit the car
			exitCar(runtime, player);
		}
	}
	
	wasEKeyDown = eKeyDown;
	
	// Handle car movement if player is in car
	if (playerInCar && currentCar) {
		handleCarMovement(runtime, player, currentCar, keyboard);
	}
}

function manageCarVisibility(runtime) {
	const currentLayout = runtime.layout.name;
	const mayorCars = runtime.objects.MayorCar?.getAllInstances() || [];
	
	for (const car of mayorCars) {
		// Get the scene this car is currently in
		const carScene = carSceneMap.get(car);
		
		// If car scene is not tracked, it's in Scene10 by default
		if (!carScene) {
			carSceneMap.set(car, "Scene10");
		}
		
		// Car is only visible if it's in the current scene
		const shouldBeVisible = (carSceneMap.get(car) === currentLayout);
		car.isVisible = shouldBeVisible;
	}
}

function tryEnterCar(runtime, player) {
	const currentLayout = runtime.layout.name;
	
	// Get all MayorCar instances
	const mayorCars = runtime.objects.MayorCar?.getAllInstances() || [];
	
	console.log("Trying to enter car. Current scene:", currentLayout);
	
	// Check if player is touching any car that's in the current scene
	for (const car of mayorCars) {
		const carScene = carSceneMap.get(car) || "Scene10";
		
		console.log("Checking car at", Math.round(car.x), Math.round(car.y), "in scene", carScene);
		
		// Only check cars that are in the current scene
		if (carScene !== currentLayout) {
			console.log("  - Car not in current scene, skipping");
			continue;
		}
		
		const distance = Math.hypot(player.x - car.x, player.y - car.y);
		console.log("  - Distance to player:", Math.round(distance));
		
		// If player is close enough to the car (within 40 pixels)
		if (distance < 40) {
			enterCar(player, car);
			console.log("Player entered car in", currentLayout);
			return;
		}
	}
	
	console.log("No car close enough to enter");
}

function enterCar(player, car) {
	playerInCar = true;
	currentCar = car;
	
	// Hide the player sprite
	player.isVisible = false;
	
	// Position player at car location
	player.x = car.x;
	player.y = car.y;
	
	console.log("✓ Player now in car at", Math.round(car.x), Math.round(car.y));
}

function exitCar(runtime, player) {
	if (!currentCar) return;
	
	const currentLayout = runtime.layout.name;
	console.log("Player exiting car in", currentLayout);
	
	playerInCar = false;
	
	// Show the player sprite again
	player.isVisible = true;
	
	// Position player slightly offset from car
	player.x = currentCar.x;
	player.y = currentCar.y + 10;
	
	// Update the car's scene to current scene (it stays where it was left)
	carSceneMap.set(currentCar, currentLayout);
	console.log("✓ Car left in scene:", currentLayout);
	
	currentCar = null;
}

function handleCarMovement(runtime, player, car, keyboard) {
	let moved = false;
	
	// Movement controls
	if (keyboard.isKeyDown("ArrowDown")) {
		car.y += CAR_SPEED;
		player.y = car.y;
		moved = true;
	}
	if (keyboard.isKeyDown("ArrowLeft")) {
		car.x -= CAR_SPEED;
		player.x = car.x;
		car.animationFrame = 1; // Left frame
		moved = true;
	}
	if (keyboard.isKeyDown("ArrowUp")) {
		car.y -= CAR_SPEED;
		player.y = car.y;
		moved = true;
	}
	if (keyboard.isKeyDown("ArrowRight")) {
		car.x += CAR_SPEED;
		player.x = car.x;
		car.animationFrame = 0; // Right frame
		moved = true;
	}
	
	// Keep car within vertical bounds (same as player)
	car.y = Math.max(128, Math.min(256, car.y));
	player.y = car.y;
}

// Update the car's tracked scene BEFORE transitioning
export function updateCarSceneBeforeTransition(newScene) {
	if (currentCar) {
		console.log("🚗 Moving car from", carSceneMap.get(currentCar), "to", newScene);
		carSceneMap.set(currentCar, newScene);
	}
}

// Get debug info about all cars
export function debugCarInfo(runtime) {
	const mayorCars = runtime.objects.MayorCar?.getAllInstances() || [];
	console.log("=== CAR DEBUG INFO ===");
	console.log("Current scene:", runtime.layout.name);
	console.log("Player in car:", playerInCar);
	console.log("Total cars:", mayorCars.length);
	
	mayorCars.forEach((car, index) => {
		const carScene = carSceneMap.get(car) || "UNKNOWN";
		console.log(`Car ${index + 1}:`, {
			position: `(${Math.round(car.x)}, ${Math.round(car.y)})`,
			scene: carScene,
			visible: car.isVisible,
			isCurrentCar: car === currentCar
		});
	});
	console.log("===================");
}