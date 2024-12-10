
```js

const fs = require('fs');
const path = require('path');

const notesFolderPath = "Notes";

const isInNotesFolder = (filePath) => {
    return filePath.startsWith(notesFolderPath);
};

module.exports = async (params) => {

	const currentFilePath = app.workspace.getActiveFile().path;
	if (isInNotesFolder(currentFilePath)) {
		app.commands.executeCommandById('quick-explorer:browse-vault');	
	}else {
		app.commands.executeCommandById('quick-explorer:browse-current');	
	}

}
```