
It it launched by [startup](startup.md)

```js

const handleFileOpen = async (file) => {
	if (file) {
		const cache = app.metadataCache.getFileCache(file);
		const frontmatter = cache?.frontmatter;

		setTimeout(async () => {
			await app.commands.executeCommandById("obsidian-shellcommands:shell-command-3d1f0udsqu");
		}, 300);
		
		if (frontmatter && frontmatter.trigger_command) {
			const commandId = frontmatter.trigger_command;

			// Delay of 0.3 seconds before executing the command
			setTimeout(async () => {
				await app.commands.executeCommandById(commandId);
			}, 300);
		}

		// The following command is regaining focus for mindmap. 
		// It can only be executed when the view is mindmap.
		if (isMindMapView()) {
			console.log('Current view is a mindmap. Executing focus command.');
			await app.commands.executeCommandById("quickadd:choice:b507cd1f-44cc-40b1-a537-0368470a7bc1");
		} else {
			// console.log('Current view is not a mindmap. Skipping focus command.');
		}

	}
};

// Function to check if current view is a mind map
function isMindMapView() {
    let activeFileView = app.workspace.getActiveFileView();
    return activeFileView && 
           activeFileView.yamlString && 
           activeFileView.yamlString.includes("mindmap-plugin");
}

    // Register the event
    app.workspace.on('file-open', handleFileOpen);

// Function to get all leaves (tabs) in the workspace
function getAllLeaves() {
    const workspace = app.workspace;
    return workspace.rootSplit.children.flatMap(split => {
        if (split.type === 'leaf') return [split];
        if (split.children) return split.children.filter(child => child.type === 'leaf');
        return [];
    });
}

// Function to toggle tabs (can go forward or backward)
function toggleTab(direction) {
    const workspace = app.workspace;
    const leaves = getAllLeaves();

    if (leaves.length <= 1) {
        console.log("No other tabs to toggle to.");
        return;
    }

    const activeLeafIndex = leaves.findIndex(leaf => leaf === workspace.activeLeaf);
    let nextLeafIndex;

    if (direction === 'next') {
        nextLeafIndex = (activeLeafIndex + 1) % leaves.length;
    } else {
        nextLeafIndex = (activeLeafIndex - 1 + leaves.length) % leaves.length;
    }

    const nextLeaf = leaves[nextLeafIndex];
    workspace.setActiveLeaf(nextLeaf, {focus: true});

}

// Event handler for keydown events
function handleKeyDown(event) {
    if (event.altKey) {
        if (event.key === 'j') {
            event.preventDefault();
            toggleTab('next');
            app.commands.executeCommandById("quickadd:choice:1c98f413-5bff-411e-832a-fa2129bfd4f4");
        } else if (event.key === 'k') {
            event.preventDefault();
            toggleTab('previous');
            app.commands.executeCommandById("quickadd:choice:1c98f413-5bff-411e-832a-fa2129bfd4f4");
        }
    }
}

// Add event listener
document.addEventListener('keydown', handleKeyDown);

console.log("Bi-directional tab toggle initialized. Use Alt+J for next tab, Alt+K for previous tab.");
```
