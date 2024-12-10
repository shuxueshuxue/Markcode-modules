import asyncio
from crawl4ai import AsyncWebCrawler
import os
import re

async def crawl(url, cutoff=3000):
    async with AsyncWebCrawler(verbose=True) as crawler:
        result = await crawler.arun(url)
        markdown = f"# Content of Website {url}\n\n" + result.markdown + "\n\n---\n\n"
        print(f"length of {url}: {len(markdown)}")
        
        if len(markdown) > cutoff * 2:
            return markdown[:cutoff] + markdown[-cutoff:]
        else:
            return markdown

def readMarkdown(url, cutoff=3000):
    # Create an event loop
    loop = asyncio.get_event_loop()
    
    # Run the asynchronous function and return its result
    return loop.run_until_complete(crawl(url, cutoff))


def replace_links_with_content(text, cutoff=3000):
    lines = text.split('\n')
    new_lines = []
    
    for line in lines:
        if re.match(r'^https?://\S+$', line.strip()):
            # This line is a standalone URL
            try:
                content = readMarkdown(line.strip(), cutoff)
                new_lines.append(content)
            except Exception as e:
                new_lines.append(f"Error extracting content from {line}: {str(e)}")
        else:
            new_lines.append(line)
    
    return '\n'.join(new_lines)

if __name__ == "__main__":
    import iohelper
    result = readMarkdown("https://math.stackexchange.com/questions/4980143/prove-that-a-translation-is-or-is-not-essentially-surjective")
    iohelper.printh(result)
    