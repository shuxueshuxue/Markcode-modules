import re
from graphviz import Digraph

def parse_bullet_list(text, root_text):
    lines = text.strip().split('\n')
    root = root_text
    graph = Digraph(comment='Mind Map')
    graph.attr(rankdir='LR')  # Left to right layout
    graph.node(root, root)
    
    current_levels = {-1: root}  # Start with root at level -1
    
    for line in lines:
        if line.strip() == '':
            continue
        
        level = len(re.match(r'\s*', line).group(0)) // 2
        node = line.strip().split('-')[-1].strip()
        
        # Find the closest parent level
        parent_level = max(k for k in current_levels.keys() if k < level)
        parent = current_levels[parent_level]
        graph.edge(parent, node)
        
        current_levels[level] = node
        # Remove any levels deeper than the current one
        current_levels = {k: v for k, v in current_levels.items() if k <= level}
    
    return graph
