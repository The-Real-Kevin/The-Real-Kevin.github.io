// mainController.js - Add Scene3 minigame

import { handlePlayerMovement, handleSceneTransitions } from "./playerController.js";
import { updateNPCDialogue, animateAllNPCs, isPlayerInDialogue } from "./npcController.js";
import { initTutorialSystem, updateTutorialSystem, isTutorialActive, canPlayerMove } from "./tutorialController.js";
import { initCutsceneSystem, updateCutsceneSystem, isCutsceneActive } from "./cutsceneController.js";
import { initForumSystem, updateForumSystem, isForumSystemActive } from "./forumController.js";
import { initMissionSystem, updateMissionSystem, isInMission } from "./missionSystem.js";
import { initProgressionSystem } from "./missionProgressionSystem.js";
import { initStatueSystem, updateStatueSystem } from "./statueController.js";
import { initUniversitySystem, updateUniversitySystem } from "./universityController.js";
import { initCourtSystem, updateCourtSystem } from "./courtController.js";
import { initFactorySystem, updateFactorySystem } from "./factoryController.js";
import { initLabSystem, updateLabSystem } from "./labController.js";
import { initCarSystem, updateCarSystem, isPlayerInCar } from "./carController.js";
import { initScene2System, updateScene2System } from "./scene2Controller.js";
import { initTimerSystem, updateTimerSystem } from "./timerController.js";
import { initIceCourtSystem, updateIceCourtSystem } from "./iceCourtController.js";
import { initIceCitySystem, updateIceCitySystem } from "./iceCityController.js";
import { initSpraySystem, updateSpraySystem } from "./sprayController.js";
import { initLighterSystem, updateLighterSystem } from "./lighterController.js";
import { initStatue2DestroySystem } from "./statue2DestroyController.js";
import { initInstructionSystem, updateInstructionSystem } from "./instructionController.js";
import { initCreditsSystem, updateCreditsSystem } from "./creditsController.js";
import { initPlaneSystem, updatePlaneSystem } from "./planeController.js";
import { initRemoteSystem, updateRemoteSystem } from "./remoteController.js";
import { initScene3Minigame, updateScene3Minigame } from "./scene3MinigameController.js"; // NEW
// Add these imports at the top:
import { initGreenhouseSystem, updateGreenhouseSystem } from "./greenhouseController.js";
import { initEndingMission1, updateEndingMission1 } from "./endingMission1Controller.js";
import { initEndingMission2, updateEndingMission2 } from "./endingMission2Controller.js";
import { initTrueEndingSystem, updateTrueEndingSystem } from "./trueEndingController.js";



runOnStartup(async runtime => {
	console.log("=== GAME STARTED ===");
	
	// Initialize all systems
	initTutorialSystem(runtime);
	initCutsceneSystem(runtime);
	initForumSystem(runtime);
	initMissionSystem(runtime);
	initProgressionSystem();
	initStatueSystem(runtime);
	initUniversitySystem(runtime);
	initCourtSystem(runtime);
	initFactorySystem(runtime);
	initLabSystem(runtime);
	initCarSystem(runtime);
	initScene2System(runtime);
	initTimerSystem(runtime);
	initIceCourtSystem(runtime);
	initIceCitySystem(runtime);
	initSpraySystem(runtime);
	initLighterSystem(runtime);
	initStatue2DestroySystem(runtime);
	initInstructionSystem(runtime);
	initCreditsSystem(runtime);
	initPlaneSystem(runtime);
	initRemoteSystem(runtime);
	initScene3Minigame(runtime); // NEW
	initGreenhouseSystem(runtime);
	initEndingMission1(runtime);
	initEndingMission2(runtime);

	initTrueEndingSystem(runtime); // ADD THIS

	console.log("All systems initialized");	
	
	runtime.addEventListener("beforelayoutstart", () => {
		setTimeout(() => {
			const player = runtime.objects.Player?.getFirstInstance();
			if (player && globalThis.playerSpawnX !== undefined) {
				console.log("Respawning player at:", globalThis.playerSpawnX, globalThis.playerSpawnY);
				player.x = globalThis.playerSpawnX;
				player.y = globalThis.playerSpawnY;
				globalThis.playerSpawnX = undefined;
				globalThis.playerSpawnY = undefined;
			}
		}, 0);
	});
	
	runtime.addEventListener("tick", () => {
		// Update all systems
		updateTutorialSystem(runtime);
		updateCutsceneSystem(runtime);
		updateForumSystem(runtime);
		updateMissionSystem(runtime);
		updateStatueSystem(runtime);
		updateUniversitySystem(runtime);
		updateCourtSystem(runtime);
		updateFactorySystem(runtime);
		updateLabSystem(runtime);
		updateScene2System(runtime);
		updateTimerSystem(runtime);
		updateIceCourtSystem(runtime);
		updateIceCitySystem(runtime);
		updateSpraySystem(runtime);
		updateLighterSystem(runtime);
		updateInstructionSystem(runtime);
		updateCreditsSystem(runtime);
		updateGreenhouseSystem(runtime);
		updateEndingMission1(runtime);
		updateEndingMission2(runtime);
		updateTrueEndingSystem(runtime); // ADD THIS

		
		// Run main game logic if not in special states
		if (!isCutsceneActive() && !isForumSystemActive() && !isInMission()) {
			updateGameLogic(runtime);
		}
	});
});

function updateGameLogic(runtime) {
	const player = runtime.objects.Player?.getFirstInstance();
	if (!player) return;
	
	const keyboard = runtime.keyboard;
	
	// Always update car, plane, remote, and Scene3 minigame systems
	updateCarSystem(runtime, player, keyboard);
	updatePlaneSystem(runtime, player, keyboard);
	updateRemoteSystem(runtime, player, keyboard);
	updateScene3Minigame(runtime, player, keyboard); // NEW
	
	// Allow movement only if not in car and other conditions are met
	if (canPlayerMove() && !isPlayerInDialogue() && !isPlayerInCar()) {
		handlePlayerMovement(runtime, player, keyboard);
		
		// Scene transitions only in main game
		if (!isTutorialActive()) {
			handleSceneTransitions(runtime, player);
		}
	}
	
	// Scene transitions for cars
	if (isPlayerInCar() && !isTutorialActive()) {
		handleSceneTransitions(runtime, player);
	}
	
	// Update NPCs only in main game
	if (!isTutorialActive()) {
		updateNPCDialogue(runtime, player, keyboard);
		animateAllNPCs(runtime);
	}
}