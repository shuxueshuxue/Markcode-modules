module.exports = async (params) => {
    
    const { app } = params;

    // Get the active view
    const activeView = app.workspace.getActiveFileView();

    // Check if a file is open
    if (!activeView || !activeView.file) {
        new Notice('Please open a file before running this command.');
        return;
    }

    // Check if the file is a PDF
    if (activeView.file.extension !== 'pdf') {
        new Notice('The current file is not a PDF. Please open a PDF file before running this command.');
        return;
    }

    const pdfFile = activeView.file;
    const pdfPath = pdfFile.path;
    const vaultPath = app.vault.adapter.basePath;
    const absolutePdfPath = `${vaultPath}/${pdfPath}`;

    // Generate HTML content
    const htmlContent = generateHTMLContent(absolutePdfPath, pdfFile);

    // Create HTML file name and path
    const htmlFileName = `${pdfFile.basename}-viewer.html`;
    const htmlFilePath = `${pdfFile.parent.path}/${htmlFileName}`;

    // Check if the HTML viewer already exists
    const existingFile = app.vault.getAbstractFileByPath(htmlFilePath);
    
    try {
        if (existingFile) {
            // Update existing file
            await app.vault.modify(existingFile, htmlContent);
            new Notice(`HTML viewer updated: ${htmlFileName}`);
        } else {
            // Create new file
            await app.vault.create(htmlFilePath, htmlContent);
            new Notice(`HTML viewer created: ${htmlFileName}`);
        }
        
        // Optionally, open the HTML file
        const newFile = app.vault.getAbstractFileByPath(htmlFilePath);
        if (newFile) {
            await app.workspace.getLeaf().openFile(newFile);
        }
    } catch (error) {
        new Notice(`Error ${existingFile ? 'updating' : 'creating'} HTML viewer: ${error.message}`);
    }
};



function generateHTMLContent(pdfPath, pdfFile) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pdfFile.basename}</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }
        #pdf-viewer {
            width: 100%;
            height: calc(100vh - 50px);
            overflow: auto;
            background-color: #f0f0f0;
        }
        .page-canvas {
            display: block;
            margin: 10px auto;
            border: 1px solid #ddd;
            background-color: white;
        }
        #controls {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,0.7);
            padding: 10px;
            text-align: center;
            color: white;
        }
        button {
            margin: 0 5px;
            padding: 5px 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
        }
        button:hover {
            background-color: #45a049;
        }
        #jump-dialog {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        #jump-dialog input {
            width: 100%;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div id="pdf-viewer"></div>
    <div id="controls">
        <button id="prev">Previous</button>
        <span id="page-num"></span> / <span id="page-count"></span>
        <button id="next">Next</button>
    </div>
    <div id="jump-dialog">
        <input type="number" id="jump-page-input" min="1" placeholder="Enter page number">
        <button id="jump-confirm">Go</button>
        <button id="jump-cancel">Cancel</button>
    </div>
    <script>
        var pdfjsLib = window['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js';

        var url = '${pdfPath}';
        var pdfDoc = null;
        var pageNum = 1;
        var pageRendering = false;
        var pageNumPending = null;
        var scale = 1.5;
        var viewer = document.getElementById('pdf-viewer');
        var currentPageNum = document.getElementById('page-num');
        var totalPages = document.getElementById('page-count');
        var jumpDialog = document.getElementById('jump-dialog');
        var jumpPageInput = document.getElementById('jump-page-input');

        function renderPage(num) {
            pageRendering = true;
            pdfDoc.getPage(num).then(function(page) {
                var viewport = page.getViewport({scale: scale});
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                canvas.className = 'page-canvas';

                var renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                };
                var renderTask = page.render(renderContext);

                renderTask.promise.then(function() {
                    while (viewer.firstChild) {
                        viewer.removeChild(viewer.firstChild);
                    }
                    viewer.appendChild(canvas);
                    currentPageNum.textContent = num;
                    pageRendering = false;
                    if (pageNumPending !== null) {
                        renderPage(pageNumPending);
                        pageNumPending = null;
                    }
                    viewer.scrollTo(0, 0);  // Scroll to top after rendering
                });
            });
        }

        function queueRenderPage(num) {
            if (pageRendering) {
                pageNumPending = num;
            } else {
                renderPage(num);
            }
        }

        function onPrevPage() {
            if (pageNum <= 1) return;
            pageNum--;
            queueRenderPage(pageNum);
        }

        function onNextPage() {
            if (pageNum >= pdfDoc.numPages) return;
            pageNum++;
            queueRenderPage(pageNum);
        }

        function showJumpDialog() {
            jumpDialog.style.display = 'block';
            jumpPageInput.focus();
        }

        function hideJumpDialog() {
            jumpDialog.style.display = 'none';
            jumpPageInput.value = '';
        }

        function onJumpToPage() {
            var num = parseInt(jumpPageInput.value);
            if (num >= 1 && num <= pdfDoc.numPages) {
                pageNum = num;
                queueRenderPage(pageNum);
                hideJumpDialog();
            }
        }

        pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
            pdfDoc = pdfDoc_;
            totalPages.textContent = pdfDoc.numPages;
            renderPage(pageNum);
        });

        document.getElementById('prev').addEventListener('click', onPrevPage);
        document.getElementById('next').addEventListener('click', onNextPage);
        document.getElementById('jump-confirm').addEventListener('click', onJumpToPage);
        document.getElementById('jump-cancel').addEventListener('click', hideJumpDialog);

        jumpPageInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                onJumpToPage();
            } else if (event.key === 'Escape') {
                hideJumpDialog();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'd') onNextPage();
            if (e.key === 'u') onPrevPage();
            if (e.key === 'j') viewer.scrollBy(0, 100);
            if (e.key === 'k') viewer.scrollBy(0, -100);
            if (e.key === 'p') showJumpDialog();
        });
    </script>
</body>
</html>
    `;
}