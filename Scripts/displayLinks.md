[handleNumberKey](handleNumberKey.md)

```js
function addNumberHintsToVisibleLinks() {
  const linkNavigatorContent = document.querySelector('.link-navigator-content');
  if (!linkNavigatorContent) return;

  const visibleInternalLinks = Array.from(linkNavigatorContent.querySelectorAll('a.internal-link')).filter(link => {
	return !link.closest('.inlink-outlinks.hidden');
  });
  
  visibleInternalLinks.forEach((link, index) => {
	const numberHint = document.createElement('span');
	numberHint.textContent = `[${index + 1}] `;
	numberHint.classList.add('number-hint');
	link.insertAdjacentElement('beforebegin', numberHint);
  });
}

module.exports = async (params) => {

	app.commands.executeCommandById("link-navigation:force-refresh-link-navigation");
	setTimeout(() => {
		app.commands.executeCommandById("link-navigation:toggle-link-navigation-detailed-view");
	}, 150);
	app.workspace.activeLeaf.view.sourceMode.cmEditor.blur()
	setTimeout(addNumberHintsToVisibleLinks, 300);

}
```
