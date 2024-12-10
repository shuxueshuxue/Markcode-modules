
```js
const scriptHotkeys = {
    // "⚙️ Open Settings": "Mod+,",
    "ToLaTex": "Alt+,",
	"🔇Mute This Block": "Alt+d",
	"EditText": "Mod+j",
	"open draft": "Alt+n",
	"open chat": "Alt+c",
	"🧹 Clear Section": "",
};
```

```js
// Function to check if custom hotkeys are properly loaded
function areHotkeysProperlyLoaded() {
    const customKeys = app.hotkeyManager.customKeys;
    let scriptHotkeyCount = 0;
    
    // Count hotkeys that start with "execute-script-"
    Object.keys(customKeys).forEach(key => {
        if (key.startsWith("execute-script-")) {
            scriptHotkeyCount++;
        }
    });
    
    // If all hotkeys are script hotkeys, it's likely that the main hotkeys haven't loaded
    return Object.keys(customKeys).length > scriptHotkeyCount;
}

// Function to wait for hotkeys to load with timeout
async function waitForHotkeysToLoad(maxAttempts = 10, delayMs = 500) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        if (areHotkeysProperlyLoaded()) {
            return true;
        }
        console.log(`Waiting for hotkeys to load... Attempt ${attempt + 1}/${maxAttempts}`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    return false;
}

// Main execution
const hotkeysSafe = await waitForHotkeysToLoad();

if (!hotkeysSafe) {
    console.error("Warning: Main hotkeys appear to not be loaded. Aborting save to prevent data loss.");
    throw new Error("Hotkey save aborted: Main hotkeys not detected");
}

// Original hotkey registration code...
Object.entries(app.hotkeyManager.customKeys).forEach((key) => {
    if (key[0].startsWith("execute-script-")) {
        delete app.hotkeyManager.customKeys[key[0]];
    }
});

// Function to execute a script
function executeScript(scriptName) {
  const vaultPath = app.vault.adapter.basePath;
  const fullPath = `${vaultPath}/Scripts/${scriptName}.md`;

  // Set the script file path
  window.scriptFile = fullPath;

  // Execute the script
  app.commands.executeCommandById("editor:save-file");
  app.commands.executeCommandById("markcode-engine:run-script");
}

// Register commands and hotkeys for each script
Object.entries(scriptHotkeys).forEach(([scriptName, hotkey]) => {
    const script_id = `execute-script-${scriptName.replace(/\s+/g, "-").toLowerCase()}`;
    app.commands.addCommand({
        id: script_id,
        name: `Execute Script: ${scriptName}`,
        callback: () => executeScript(scriptName),
    });
    if (hotkey) {
        app.hotkeyManager.customKeys[script_id] = [{ key: "0", modifiers: "Mod" }];
        app.hotkeyManager.customKeys[script_id][0].modifiers = hotkey
            .split("+")
            .filter((key) => key.length > 1);
        app.hotkeyManager.customKeys[script_id][0].key = hotkey.split("+").pop();
    }
});

// Only save if the safety check passed
if (hotkeysSafe) {
    await app.hotkeyManager.save();
} else {
    console.error("Hotkey save skipped due to safety check failure");
}
```
