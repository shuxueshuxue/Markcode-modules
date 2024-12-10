const http = require('http');
const fs = require('fs');
const path = require('path');

module.exports = async (params) => {

console.log("Start setting up local Obsidian server.");

const PORT = 3300;
const CODE_FILE = path.join(app.vault.adapter.basePath, 'code.js');

const server = http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/run') {
        try {
            const code = await fs.promises.readFile(CODE_FILE, 'utf8');
            
            // Wrap the code in an async function and await its execution
            const asyncFunction = new Function(`return (async () => { ${code} })();`);
            const result = await asyncFunction();
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(error.toString());
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

};
