if (!window.activeTabsNotice) {
    window.activeTabsNotice = null;
}

function showFloatingMessage(message, duration = 4000) {
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

    const activeLeaf = app.workspace.activeLeaf;

    if (!activeLeaf || !activeLeaf.history) {
        showFloatingMessage("No active tab or history found.");
        return;
    }

    const { backHistory, forwardHistory } = activeLeaf.history;

    let output = "------------------------HISTORY 🧭------------------------\n";
    // let output = "";

    const currentFileName = activeLeaf.view.file ? activeLeaf.view.file.name : 'Untitled';

    const limitedBackHistory = backHistory.slice(-2);  // Show last 5 items in back history

    // Display back history
    limitedBackHistory.forEach(item => {
        const title = item ? (item.title || 'Untitled') : '';
        output += `   ${title}\n`;
    });

    // Display current file
    output += `▶ ${currentFileName}\n`;

	forward_output = ""
    // Display forward history
    forwardHistory.forEach(item => {
        const title = item ? (item.title || 'Untitled') : '';
        forward_output = `   ${title}\n` + forward_output
    });

	output += forward_output

    // Show the floating message
    showFloatingMessage(output, 4000);

    // Also log to console for easier reading
    // console.log(output);
};
