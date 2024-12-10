module.exports = async (params) => {
    const { app } = params;

    // Get the active leaf (current tab)
    const activeLeaf = app.workspace.activeLeaf;

    if (!activeLeaf || !activeLeaf.history) {
        new Notice("No active tab or history found.");
        return;
    }

    // Clear the history
    activeLeaf.history.backHistory = [];
    activeLeaf.history.forwardHistory = [];

    // Optionally, you might want to reset the current state
    // This part is commented out as it might cause unexpected behavior
    // activeLeaf.history.state = null;

    new Notice("Current tab history has been cleared.");

    console.log("Tab history cleared for the current leaf.");
};