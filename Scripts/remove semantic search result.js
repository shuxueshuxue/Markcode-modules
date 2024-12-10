
document.addEventListener('keydown', (event) => {
    // Check if ESC key is pressed (key code 27)
    if (event.key === 'Escape') {
        // Find all fixed position divs
        const fixedDivs = document.querySelectorAll('div[style*="position: fixed"]');
        
        // Look for the specific div with the title
        for (const div of fixedDivs) {
            const h3 = div.querySelector('h3');
            if (h3 && h3.textContent === 'Semantic Similarity Results') {
                event.preventDefault(); // Prevent default ESC behavior
                div.remove();
                console.log('Semantic Similarity Results popup removed');
                return;
            }
        }
    }
});
