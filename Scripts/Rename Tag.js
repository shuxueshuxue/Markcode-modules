const app = require("obsidian/app");
const input  = await app.plugins.plugins.quickadd.api.inputPrompt('Tag Name:');
if (input) {
	a = app.plugins.getPlugin("tag-wrangler")
	a.rename(input)
}