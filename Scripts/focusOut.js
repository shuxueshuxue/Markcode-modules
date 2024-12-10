module.exports = async (params) => {

    // Object destructuring. We pull inputPrompt out of the QuickAdd API in params.
    const {
        quickAddApi: { inputPrompt },
        app,
    } = params;

    // Select the active tab header
    const activeTab = document.querySelector('div.workspace-tab-header.tappable.is-active.mod-active');

    if (activeTab) {
    // Set tabindex to make the element focusable
    activeTab.tabIndex = -1;
    
    // Focus on the tab header
    activeTab.focus();
    
    // Prevent focus from going inside the tab content
    activeTab.addEventListener('focus', function(event) {
        event.preventDefault();
        event.stopPropagation();
    }, true);
    }
}
