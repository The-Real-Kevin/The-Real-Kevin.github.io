// audioController.js - FIXED: Using Audio plugin directly

let musicStarted = false;
const MUSIC_TAG = "background-music";

export function initAudioSystem(runtime) {
	console.log("Audio system initialized");
}

export function startBackgroundMusic(runtime) {
	if (musicStarted) return;
	
	try {
		// Play music file using the Audio plugin
		// Replace "BackgroundMusic" with your actual audio file name from the Sounds/Music folder
		runtime.assets.audio.play("BackgroundMusic", {
			loop: true,
			volume: 0.5,
			tag: MUSIC_TAG
		});
		
		musicStarted = true;
		console.log("Background music started (looping)");
	} catch (error) {
		console.warn("Failed to start background music:", error);
	}
}

export function updateAudioSystem(runtime) {
	if (!musicStarted) {
		startBackgroundMusic(runtime);
	}
}

export function stopBackgroundMusic(runtime) {
	try {
		runtime.assets.audio.stopByTag(MUSIC_TAG);
		musicStarted = false;
		console.log("Background music stopped");
	} catch (error) {
		console.warn("Failed to stop background music:", error);
	}
}

export function setMusicVolume(runtime, volume) {
	try {
		runtime.assets.audio.setVolumeByTag(MUSIC_TAG, volume);
		console.log("Music volume set to:", volume);
	} catch (error) {
		console.warn("Failed to set music volume:", error);
	}
}