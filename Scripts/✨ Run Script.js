//!
const blacklist = ['executor.md', 'tts.md', "startup.md", "fetch_module_source.md", "SurfingFocusConfigs.md", "✨ Run Script.md", "Script Hotkey Manager.md", "previous file in chain.md", "next file in chain.md", "up file in chain.md", "down file in chain.md", "displayTabHistory.md", "Display Current Tabs.md", "openFileManager.md", "displayLinks.md", "handleNumberKey.md", "Toggle Play Button.md", "Graph View Filter.md", "setting menu quick switcher.js"];

//!
module.exports = async (params) => {
	// Get the vault path
	const vaultPath = app.vault.adapter.basePath;
	
	// Specify the Scripts folder path
	const scriptsPath = `${vaultPath}/Scripts`;
	
	// Get all .md files in the Scripts folder, excluding blacklisted files
	const scriptFiles = app.vault.getFiles()
	    .filter(file => 
	        file.path.startsWith('Scripts/') && 
	        file.extension === 'md' &&
	        !blacklist.includes(file.name)
	    )
	    .map(file => file.path);
	
	if (scriptFiles.length === 0) {
	    new Notice("No .md files found in the Scripts folder (or all are blacklisted).");
	} else {
	    // Let the user choose a script file, removing the .md suffix from display
	    const chosenScript = await app.plugins.plugins.quickadd.api.suggester(
	        scriptFiles.map(path => path.replace('Scripts/', '').replace('.md', '')),
	        scriptFiles
	    );
	
	    if (chosenScript) {
	        // Construct the full path
	        const fullPath = `${vaultPath}/${chosenScript}`;
	
	        // Set the script file path
	        window.scriptFile = fullPath;

	        // Execute the script
	        app.commands.executeCommandById("editor:save-file");
	        // app.commands.executeCommandById("obsidian-shellcommands:shell-command-iowy1h0ge6");
	        app.commands.executeCommandById("markcode-engine:run-script");
	
	    } else {
	        // new Notice("No script selected.");
	    }
	}
}