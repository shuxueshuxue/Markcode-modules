
const toggleMusic = async () => {
	const activeView = app.workspace.getActiveFileView();
	if (!activeView) {
		console.log("No active markdown view");
		return;
	}

	const editor = activeView.editor;
	const content = editor.getValue();

	// Check if music is currently set to play
	const isPlaying = content.includes('&auto=1&');

	// Prepare the replacement
	const searchValue = isPlaying ? '&auto=1&' : '&auto=0&';
	const replaceValue = isPlaying ? '&auto=0&' : '&auto=1&';

	// Perform the replacement
	const newContent = content.replace(searchValue, replaceValue);

	if (newContent !== content) {
		editor.setValue(newContent);
		console.log(isPlaying ? "Stopping music" : "Playing music");
	} else {
		console.log("No music iframe found or no change needed");
	}
};

module.exports = async (params) => {

	const audios = document.querySelectorAll("audio")[0];
	if (audios) {
		const visibleAudios = Array.from(document.querySelectorAll("audio")).filter(audio => audio.offsetParent !== null);
		if (visibleAudios.length > 0) {
			const audio = visibleAudios[0];
			if (audio.paused) {
				audio.play();
			} else {
				audio.pause();
			}
		} else {
			await toggleMusic();
		}
	} else {
	    await toggleMusic();
	}

}
