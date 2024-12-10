
// Function to set tabindex of wb-search-bar
function setSearchBarTabIndex() {
    const searchBars = document.querySelectorAll('.wb-search-bar');
    searchBars.forEach((searchBar) => {searchBar.setAttribute('tabindex', '-1');});
    // console.log('Set tabindex=-1 for .wb-search-bar');
}

// Set up interval to check every second
const setSearchBarTabIndexInterval = setInterval(setSearchBarTabIndex, 1000);

// Log that the script has started
console.log('Started checking for .wb-search-bar every second');


console.log("Surfing focus script started");

// Create a global object to store our configurations
window.surfingFocusConfigs = window.surfingFocusConfigs || {};

// Initialize websiteConfigs if it doesn't exist
window.surfingFocusConfigs.websiteConfigs = window.surfingFocusConfigs.websiteConfigs || [];

let intervalId;
const injectedViews = new Map();

const loadConfigs = async () => {
    const configFile = app.vault.getAbstractFileByPath('Scripts/SurfingFocusConfigs.md');
    if (configFile) {
        const content = await app.vault.read(configFile);
        const codeBlock = content.match(/```javascript\n([\s\S]*?\n)```/);
        if (codeBlock && codeBlock[1]) {
            try {
                const configFunction = new Function(`return (${codeBlock[1]})`);
                window.surfingFocusConfigs.websiteConfigs = configFunction();
                console.log('Surfing Focus configurations loaded successfully');
            } catch (error) {
                console.error('Error parsing Surfing Focus configurations:', error);
            }
        }
    } else {
        console.error('SurfingFocusConfigs.md file not found in Scripts folder');
    }
};

const injectScript = async (leaf, config) => {
    try {
        await leaf.view.webviewEl.executeJavaScript(config.script);
        console.log(`Focus script injected into ${config.urlPattern} Surfing view`);
        return true;
    } catch (error) {
        console.error(`Error injecting focus script for ${config.urlPattern}:`, error);
        return false;
    }
};

const removeScript = async (leaf) => {
    const removeScriptCode = `
        if (window.surfingFocusHandlerAdded) {
            document.removeEventListener('keydown', surfingFocusHandler);
            delete window.surfingFocusHandlerAdded;
            console.log('Focus script removed');
        }
    `;
    try {
        await leaf.view.webviewEl.executeJavaScript(removeScriptCode);
        console.log("Focus script removed from Surfing view");
        return true;
    } catch (error) {
        console.error("Error removing focus script:", error);
        return false;
    }
};

const checkAndUpdateScript = async (leaf) => {
    if (!leaf.view || !leaf.view.webviewEl) return;

    const currentUrl = leaf.view.currentUrl;
    // console.log("Current URL in Surfing view:", currentUrl);

    const matchedConfig = window.surfingFocusConfigs.websiteConfigs.find(config => currentUrl.includes(config.urlPattern));
    const injectedConfig = injectedViews.get(leaf);

    if (matchedConfig) {
        if (!injectedConfig || injectedConfig.urlPattern !== matchedConfig.urlPattern) {
            if (injectedConfig) {
                await removeScript(leaf);
            }
            const injected = await injectScript(leaf, matchedConfig);
            if (injected) {
                injectedViews.set(leaf, matchedConfig);
            }
        }
    } else if (injectedConfig) {
        const removed = await removeScript(leaf);
        if (removed) {
            injectedViews.delete(leaf);
        }
    }
};

const checkAllViews = async () => {
    const surfingViews = app.workspace.getLeavesOfType("surfing-view");
    for (const leaf of surfingViews) {
        await checkAndUpdateScript(leaf);
    }
};

// Function to start the script
const startScript = async () => {
    await loadConfigs();
    intervalId = setInterval(checkAllViews, 1000); // Check every 1 second
    console.log("Surfing focus script interval started");
};

// Function to stop the script
const stopScript = () => {
    if (intervalId) {
        clearInterval(intervalId);
        console.log("Surfing focus script interval stopped");
    }
};

// Add functions to reload configurations and restart the script
window.reloadSurfingFocusConfigs = async () => {
    await loadConfigs();
    console.log("Surfing Focus configurations reloaded");
};

window.restartSurfingFocusScript = () => {
    stopScript();
    startScript();
    console.log("Surfing focus script restarted");
};

// Close these tabs that are left by the last time of using Obsidian to prevent bugs.
const initialSurfingViews = app.workspace.getLeavesOfType("surfing-view");
initialSurfingViews.forEach(leaf => {
    leaf.detach();
});

// Start the script
startScript();

console.log("Surfing focus script setup complete");

const surfingKeysScript = `
if (!window.surfingKeysAdded) {
	
(function() {
    let hintMode = false;
    let hints = [];
    let editableMode = false;
    
    function generateHintStrings(count) {
        const hintChars = 'asdfjklqwertyuiopzxcvbnm';
        
        class Node {
            constructor(value = '') {
                this.value = value;
                this.children = {};
            }
        }

        function getLeafCount(node) {
            if (Object.keys(node.children).length === 0) {
                return 1;
            }
            return Object.values(node.children).reduce((sum, child) => sum + getLeafCount(child), 0);
        }

        function getLeaves(node) {
            if (Object.keys(node.children).length === 0) {
                return [node.value];
            }
            return Object.values(node.children).flatMap(getLeaves);
        }

        const root = new Node();
        let currentNodes = [root];

        while (getLeafCount(root) < count) {
            const nextNodes = [];
            for (const node of currentNodes) {
                for (const char of hintChars) {
                    if (getLeafCount(root) >= count) break;
                    const newNode = new Node(node.value + char);
                    node.children[char] = newNode;
                    nextNodes.push(newNode);
                }
                if (getLeafCount(root) >= count) break;
            }
            currentNodes = nextNodes;
        }

        return getLeaves(root).slice(0, count);
    }

    function createHint(element, label) {
        const hint = document.createElement('div');
        hint.textContent = label;
        hint.style.cssText = 'position: absolute; background: rgba(255, 255, 0, 0.5); color: black; padding: 2px; border: 1px solid black; font-weight: bold; z-index: 10000; font-family: monospace; font-size: 12px;';
        const rect = element.getBoundingClientRect();
        hint.style.left = (rect.left + window.scrollX) + 'px';
        hint.style.top = (rect.top + window.scrollY) + 'px';
        document.body.appendChild(hint);
        return hint;
    }

    function showHints(editableOnly = false) {
        let selector = editableOnly 
            ? 'input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), [contenteditable="true"], select:not([disabled])'
            : 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        const elements = document.querySelectorAll(selector);
        const hintStrings = generateHintStrings(elements.length);
        elements.forEach((el, index) => {
            const label = hintStrings[index];
            const hint = createHint(el, label);
            hints.push({ element: el, hint: hint, label: label });
        });
        hintMode = true;
        editableMode = editableOnly;
    }

    function hideHints() {
        hints.forEach(({ hint }) => hint.remove());
        hints = [];
        hintMode = false;
        editableMode = false;
    }

    let partialHint = '';
    function handleHintInput(key) {
        partialHint += key;
        const matchingHints = hints.filter(h => h.label.startsWith(partialHint));
        
        if (matchingHints.length === 1) {
            matchingHints[0].element.focus();
            if (matchingHints[0].element.tagName === 'A') {
                matchingHints[0].element.click();
            }
            hideHints();
            partialHint = '';
        } else if (matchingHints.length === 0) {
            partialHint = '';
            hideHints();
        } else {
            hints.forEach(({ hint, label }) => {
                hint.style.display = label.startsWith(partialHint) ? '' : 'none';
            });
        }
    }

    document.addEventListener('keydown', function(e) {

        if (hintMode) {
            if ('asdfjklqwertyuiopzxcvbnm'.includes(e.key.toLowerCase())) {
                handleHintInput(e.key.toLowerCase());
                e.preventDefault();
            } else if (e.key === 'Escape') {
                hideHints();
                partialHint = '';
            }
            return;
        }

        if (e.key === '\`') {
            showHints(false);
            e.preventDefault();
        } else if (e.key === '~') {
            showHints(true);
            e.preventDefault();
        }
    });
})();
    window.surfingKeysAdded = true;
    console.log('Surfing Keys script injected successfully');
}

`;

const checkSurfingKeys = async () => {
    const surfingViews = app.workspace.getLeavesOfType("surfing-view");
    for (const leaf of surfingViews) {
        await leaf.view.webviewEl.executeJavaScript(surfingKeysScript);
    }
};

intervalSurfingKeys = setInterval(checkSurfingKeys, 1000); // Check every 1 second
console.log("surfingKeys script interval started");