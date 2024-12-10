
```js
const settingsTabNavigator = (event) => {
    // Check if it's your desired keyboard shortcut (e.g., Ctrl/Cmd + Shift + ,)
	if (event.altKey && event.key === 'o') {
        // Check if settings modal is open
        const settingsModal = document.querySelector('.modal-container .modal.mod-settings');
        if (!settingsModal) {
            // If settings isn't open, let the event pass through
            return;
        }

        // Prevent default behavior since we're handling it
        event.preventDefault();

        // Get all setting tabs
        const tabGroups = Array.from(document.querySelectorAll('.vertical-tab-header-group'));
        const tabs = [];

        tabGroups.forEach((group, groupIndex) => {
            const groupName = group.querySelector('.vertical-tab-header-group-title')?.textContent || 'Group ' + (groupIndex + 1);
            const groupTabs = Array.from(group.querySelectorAll('.vertical-tab-header-group-items .vertical-tab-nav-item'));
            
            groupTabs.forEach((tab, tabIndex) => {
                tabs.push({
                    name: `${groupName} > ${tab.textContent.trim()}`,
                    group: groupIndex + 1,
                    index: tabIndex + 1,
                    element: tab
                });
            });
        });

        // Create the suggester
        app.plugins.plugins.quickadd.api.suggester(
            tabs.map(tab => tab.name),
            tabs
        ).then(chosen => {
            if (chosen) {
                chosen.element.click();
            }
        });
    }
};

// Register the event listener
document.addEventListener('keydown', settingsTabNavigator);
```