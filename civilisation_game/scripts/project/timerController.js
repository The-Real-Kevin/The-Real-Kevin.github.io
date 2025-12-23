// timerController.js - Global game timer system

let timerActive = false;
let startTime = 0;
let elapsedSeconds = 0;

export function initTimerSystem(runtime) {
	console.log("Timer system initialized");
	
	// Initialize global timer state
	if (globalThis.timerStarted === undefined) {
		globalThis.timerStarted = false;
	}
}

export function startTimer() {
	if (!timerActive) {
		timerActive = true;
		startTime = Date.now();
		globalThis.timerStarted = true;
		console.log("⏱️ Timer started!");
	}
}

export function updateTimerSystem(runtime) {
	// Only update if timer is active
	if (!timerActive) return;
	
	// Calculate elapsed time
	const currentTime = Date.now();
	elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
	
	// Update timer display
	updateTimerDisplay(runtime);
}

function updateTimerDisplay(runtime) {
	const timerText = runtime.objects.TimerText?.getFirstInstance();
	
	if (!timerText) {
		// Timer text not in this layout, skip
		return;
	}
	
	// Convert seconds to minutes:seconds format
	const minutes = Math.floor(elapsedSeconds / 60);
	const seconds = elapsedSeconds % 60;
	
	// Format with leading zeros
	const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	
	// Update the text
	timerText.text = formattedTime;
	
	// Make sure it's visible
	timerText.isVisible = true;
}

export function getElapsedTime() {
	return {
		totalSeconds: elapsedSeconds,
		minutes: Math.floor(elapsedSeconds / 60),
		seconds: elapsedSeconds % 60,
		formatted: `${Math.floor(elapsedSeconds / 60).toString().padStart(2, '0')}:${(elapsedSeconds % 60).toString().padStart(2, '0')}`
	};
}

export function isTimerActive() {
	return timerActive;
}