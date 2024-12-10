[displayLinks](displayLinks.md)

```js

app.commands.executeCommandById("link-navigation:force-refresh-link-navigation");

function handleNumberKeyPress(event) {
    // Check if the pressed key is a number from 1 to 9 or a letter from A to F
    if ((event.key >= '1' && event.key <= '9' && !isNaN(event.key)) || 
        (event.key >= 'a' && event.key <= 'z')) {
        
        // Check if the link navigation details are visible
        if (app.plugins.plugins["link-navigation"].depthInput && app.plugins.plugins["link-navigation"].depthInput.inputEl.isShown()) {
            let numberPressed;
            
            if (event.key >= '1' && event.key <= '9') {
                numberPressed = parseInt(event.key);
            } else {
                // Convert A-F to 10-15
                numberPressed = event.key.charCodeAt(0) - 'a'.charCodeAt(0) + 10;
            }
            
            // Find the corresponding number hint
            const numberHints = document.querySelectorAll('.link-navigator-content .number-hint');
            const numberHint = Array.from(numberHints).find(hint => hint.textContent.includes(`[${numberPressed}]`));
            
            if (numberHint) {
                // Find the associated internal link
                const associatedLink = numberHint.nextElementSibling;
                
                if (associatedLink && associatedLink.classList.contains('internal-link')) {
                    // Simulate a click on the internal link
                    associatedLink.click();
                }
            }
        }
    }
}

// Add the event listener
document.addEventListener('keydown', handleNumberKeyPress);

```
