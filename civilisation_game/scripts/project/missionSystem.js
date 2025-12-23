// missionSystem.js - Add Statue2 destroy mission

import { startMission1, updateMission1, isMission1Active } from "./mission1Controller.js";
import { startMission2, updateMission2, isMission2Active } from "./mission2Controller.js";
import { startMission3, updateMission3, isMission3Active } from "./mission3Controller.js";
import { startMission4, updateMission4, isMission4Active } from "./mission4Controller.js";
import { startMission5, updateMission5, isMission5Active } from "./mission5Controller.js";
import { startMission6, updateMission6, isMission6Active } from "./mission6Controller.js";
import { startMission7, updateMission7, isMission7Active } from "./mission7Controller.js";
import { updateStatueSystem, isStatueMissionActive } from "./statueController.js";
import { updateScene2System, isScene2MissionActive } from "./scene2Controller.js";
import { updateStatue2DestroySystem, isStatue2DestroyActive } from "./statue2DestroyController.js"; // NEW

export function initMissionSystem(runtime) {
	console.log("Mission system initialized");
}

export function updateMissionSystem(runtime) {
	const currentLayout = runtime.layout?.name;
	
	// ALWAYS update Mission 6 when in Court1 (special case - no NPC, auto-activates)
	if (currentLayout === "Court1") {
		updateMission6(runtime);
		return;
	}
	
	// ALWAYS update Mission 7 when in Scene6 (special case - no NPC, auto-activates)
	if (currentLayout === "Scene6") {
		updateMission7(runtime);
		return;
	}
	
	// Update active missions
	if (isMission1Active()) {
		updateMission1(runtime);
	} else if (isMission2Active()) {
		updateMission2(runtime);
	} else if (isMission3Active()) {
		updateMission3(runtime);
	} else if (isMission4Active()) {
		updateMission4(runtime);
	} else if (isMission5Active()) {
		updateMission5(runtime);
	} else if (isMission6Active()) {
		updateMission6(runtime);
	} else if (isMission7Active()) {
		updateMission7(runtime);
	} else if (isStatueMissionActive()) {
		updateStatueSystem(runtime);
	} else if (isScene2MissionActive()) {
		updateScene2System(runtime);
	} else if (isStatue2DestroyActive()) { // NEW
		updateStatue2DestroySystem(runtime);
	}
}

export function isInMission() {
	return isMission1Active() || isMission2Active() || isMission3Active() || isMission4Active() || isMission5Active() || isMission6Active() || isMission7Active();
}