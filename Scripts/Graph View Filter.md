#polymorphism #vaultBuilding 

```js

module.exports = async (params) => {

	const element = document.querySelector("div.tree-item-icon.collapse-icon");
	if (element && element.checkVisibility()) {
		element.click();
		document.querySelector("div.setting-item-control > div > input[type=search]").focus()
	}
	else {
		await app.commands.executeCommandById("editor:open-search");
    }

}

```
