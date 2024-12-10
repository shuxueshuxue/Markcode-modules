
[Hint Keyboard Listen](Hint%20Keyboard%20Listen.md)

```js
export function showHints(items, position = null) {
    // Remove existing hint window if any
    const existingContainer = document.querySelector('.custom-hint-container');
    if (existingContainer) {
        existingContainer.remove();
    }

    // If no items, return
    if (!items || items.length === 0) return;

    // Get cursor position if not provided
    if (!position) {
        let view = app.workspace.activeLeaf.view.editor.cm;
        position = view.coordsAtPos(view.state.selection.main.head);
    }

    // Create container
    const container = document.createElement('div');
    container.className = 'custom-hint-container';
    container.style.position = 'absolute';
    container.style.left = `${position.left + 5}px`;
    container.style.top = `${position.top + 20}px`;
    container.style.backgroundColor = 'var(--background-primary)';
    container.style.border = '1px solid var(--background-modifier-border)';
    container.style.borderRadius = '5px';
    container.style.padding = '5px';
    container.style.zIndex = '1000';

    // Create hints
    items.forEach((item, index) => {
        const hintDiv = document.createElement('div');
        hintDiv.className = 'custom-hint-item';
        hintDiv.style.padding = '3px 8px';
        hintDiv.style.cursor = 'pointer';
        hintDiv.innerHTML = `<span class="hint-number">[${index + 1}]</span> ${item}`;
        
        hintDiv.addEventListener('mouseover', () => {
            hintDiv.style.backgroundColor = 'var(--background-modifier-hover)';
        });
        hintDiv.addEventListener('mouseout', () => {
            hintDiv.style.backgroundColor = 'transparent';
        });
        
        container.appendChild(hintDiv);
    });

    document.body.appendChild(container);

    return container;
}
```

# Usage

```js
//xx
const showHints = await dynamicImport('/showHints.js?update=' + Date.now());
showHints.showHints(["hello", "yes"])
```
