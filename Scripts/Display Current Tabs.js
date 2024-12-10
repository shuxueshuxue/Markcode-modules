// Ensure activeNotice is stored globally by attaching it to the window object
if (!window.activeTabsNotice) {
    window.activeTabsNotice = null;
}

// Function to get all leaves (tabs) in the workspace
function getAllLeaves() {
    const workspace = app.workspace;
    return workspace.rootSplit.children.flatMap(split => {
        if (split.type === 'leaf') return [split];
        if (split.children) return split.children.filter(child => child.type === 'leaf');
        return [];
    });
}

// Function to create and show floating message
function showFloatingMessage(message, duration = 2500) {
    if (window.activeTabsNotice) {
        window.activeTabsNotice.textContent = message;
    } else {
        const box = document.createElement('div');
        box.style.position = 'fixed';
        box.style.top = '5%';
        box.style.left = '50%';
        box.style.transform = 'translateX(-50%)';
        box.style.padding = '10px';
        box.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        box.style.borderRadius = '5px';
        box.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        box.style.zIndex = '9999';
        box.style.transition = 'opacity 0.3s ease-in-out';
        box.style.fontFamily = 'monospace';
        box.style.fontSize = '16px';
		box.style.fontWeight = 'bold';
        box.style.maxHeight = '80%';
        box.style.overflow = 'auto';
        box.style.color = 'white';
        box.style.display = 'inline-block';
        box.style.whiteSpace = 'pre';
        box.style.maxWidth = '90vw';
        box.textContent = message;

        document.body.appendChild(box);
        window.activeTabsNotice = box;
    }

    if (window.activeTabsNoticeTimeout) {
        clearTimeout(window.activeTabsNoticeTimeout);
    }
    window.activeTabsNoticeTimeout = setTimeout(() => {
        if (window.activeTabsNotice) {
            window.activeTabsNotice.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(window.activeTabsNotice);
                window.activeTabsNotice = null;
            }, 200);
        }
    }, duration);
}

module.exports = async (params) => {
    const { app } = params;

    let output = "-------------------------TABS ⚓-------------------------\n";
    // let output = "";

    // Get all leaves
    const leaves = getAllLeaves();

    // Get the active leaf
    const activeLeaf = app.workspace.activeLeaf;

    leaves.forEach((leaf, index) => {
        const view = leaf.view;
        let tabName = 'Unknown';

        if (view.file) {
            tabName = view.file.name;
        } else if (view.getDisplayText) {
            tabName = view.getDisplayText();
        } else if (view.getViewType) {
            tabName = `${view.getViewType()} view`;
        }

        const isActive = leaf === activeLeaf;
        const indicator = isActive ? '▶' : '  ';
        
        output += `${indicator} ${tabName}\n`;
    });

    // Show the floating message
    showFloatingMessage(output);

    // Also log to console for easier reading
    // console.log(output);
};