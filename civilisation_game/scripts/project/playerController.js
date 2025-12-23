// playerController.js - Add plane system integration

import { handleUniversityTransitions } from "./universityController.js";
import { handleCourtTransitions } from "./courtController.js";
import { handleFactoryTransitions } from "./factoryController.js";
import { handleLabTransitions } from "./labController.js";
import { isPlayerInCar, getCurrentCar, updateCarSceneBeforeTransition } from "./carController.js";
import { isPlayerInPlane, getCurrentPlane, updatePlaneSceneBeforeTransition } from "./planeController.js"; // NEW
import { isPlayerCarryingRemote } from "./remoteController.js"; // ADD THIS IMPORT


const SCENES = ["Scene1", "Scene2", "Scene3", "Scene4", "Scene5", "Scene6", "Scene7", "Scene8", "Scene9", "Scene10", "Scene11", "Scene12", "Scene13", "Scene14", "Scene15"];
const PLAYER_SPEED = 2;

export function handlePlayerMovement(runtime, player, keyboard) {
	// Movement and animation
	if (keyboard.isKeyDown("ArrowDown")) {
		player.y += PLAYER_SPEED;
		player.animationFrame = 0; // Down
	}
	if (keyboard.isKeyDown("ArrowLeft")) {
		player.x -= PLAYER_SPEED;
		player.animationFrame = 1; // Left
	}
	if (keyboard.isKeyDown("ArrowUp")) {
		player.y -= PLAYER_SPEED;
		player.animationFrame = 2; // Up
	}
	if (keyboard.isKeyDown("ArrowRight")) {
		player.x += PLAYER_SPEED;
		player.animationFrame = 3; // Right
	}
	
	// Keep within vertical bounds
	player.y = Math.max(128, Math.min(256, player.y));
}

export function handleSceneTransitions(runtime, player) {
	const currentLayout = runtime.layout.name;
	
	// Check if in university - if so, use university transitions
	if (currentLayout.startsWith("University")) {
		handleUniversityTransitions(runtime, player);
		return;
	}
	
	// Check if in court - if so, use court transitions
	if (currentLayout.startsWith("Court")) {
		handleCourtTransitions(runtime, player);
		return;
	}
	
	// Check if in factory - if so, use factory transitions
	if (currentLayout.startsWith("Factory")) {
		handleFactoryTransitions(runtime, player);
		return;
	}
	
	// Check if in lab - if so, use lab transitions
	if (currentLayout.startsWith("Lab")) {
		handleLabTransitions(runtime, player);
		return;
	}
	
	// Main scene transitions
	const sceneIndex = SCENES.indexOf(currentLayout);
	
	// Only do scene transitions if we're in a main scene (not mission)
	if (sceneIndex === -1) return;
	
	// Check if player is in a car or plane
	const inCar = isPlayerInCar();
	const car = getCurrentCar();
	const inPlane = isPlayerInPlane(); // NEW
	const plane = getCurrentPlane(); // NEW
	
	// Moving right - go to next scene
	if (player.x > 320) {
		const nextSceneIndex = (sceneIndex + 1) % SCENES.length;
		const nextScene = SCENES[nextSceneIndex];
		
		console.log("→ Transitioning from", currentLayout, "to", nextScene);
		
		if (inPlane && plane) {
			// PLANE TRANSITION
			updatePlaneSceneBeforeTransition(nextScene);
			
			plane.x = 10;
			player.x = 10;
			
			globalThis.playerSpawnX = 10;
			globalThis.playerSpawnY = player.y;
			
			runtime.goToLayout(nextScene);
		} else if (inCar && car) {
			// CAR TRANSITION
			updateCarSceneBeforeTransition(nextScene);
			
			car.x = 10;
			car.y = player.y;
			player.x = 10;
			player.y = car.y;
			
			globalThis.playerSpawnX = 10;
			globalThis.playerSpawnY = player.y;
			
			runtime.goToLayout(nextScene);
		} else {
			// Normal player transition
			player.x = 10;
			globalThis.playerSpawnX = 10;
			globalThis.playerSpawnY = player.y;
			runtime.goToLayout(nextScene);
		}
	}
	
	// Moving left - go to previous scene
	if (player.x < 0) {
		const prevSceneIndex = (sceneIndex - 1 + SCENES.length) % SCENES.length;
		const prevScene = SCENES[prevSceneIndex];
		
		console.log("← Transitioning from", currentLayout, "to", prevScene);
		
		if (inPlane && plane) {
			// PLANE TRANSITION
			updatePlaneSceneBeforeTransition(prevScene);
			
			plane.x = 300;
			player.x = 300;
			
			globalThis.playerSpawnX = 300;
			globalThis.playerSpawnY = player.y;
			
			runtime.goToLayout(prevScene);
		} else if (inCar && car) {
			// CAR TRANSITION
			updateCarSceneBeforeTransition(prevScene);
			
			car.x = 300;
			car.y = player.y;
			player.x = 300;
			player.y = car.y;
			
			globalThis.playerSpawnX = 300;
			globalThis.playerSpawnY = player.y;
			
			runtime.goToLayout(prevScene);
		} else {
			// Normal player transition
			player.x = 300;
			globalThis.playerSpawnX = 300;
			globalThis.playerSpawnY = player.y;
			runtime.goToLayout(prevScene);
		}
	}
}