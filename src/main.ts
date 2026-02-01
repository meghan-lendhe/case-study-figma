import { App, Editor, MarkdownView, Notice, Plugin } from 'obsidian';

interface Block {
    type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'list';
    level?: number;
    text?: string;
    items?: string[];
    id: string;
}

export default class CaseStudyFigmaPlugin extends Plugin {
    async onload() {
        // Add command to export current note
        this.addCommand({
            id: 'export-to-figma',
            name: 'Export case study to Figma (clipboard)',
            editorCallback: (editor: Editor, view: MarkdownView) => {
                const content = editor.getValue();
                const blocks = this.parseMarkdown(content);
                
                const json = JSON.stringify(blocks, null, 2);
                navigator.clipboard.writeText(json);
                
                new Notice(`✓ Copied ${blocks.length} blocks to clipboard. Paste in Figma plugin!`);
            }
        });

        // Add ribbon icon for quick access
        this.addRibbonIcon('upload-cloud', 'Export to Figma', () => {
            const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
            if (activeView) {
                const content = activeView.editor.getValue();
                const blocks = this.parseMarkdown(content);
                
                const json = JSON.stringify(blocks, null, 2);
                navigator.clipboard.writeText(json);
                
                new Notice(`✓ ${blocks.length} blocks ready for Figma`);
            } else {
                new Notice('No active markdown file');
            }
        });
    }

    parseMarkdown(markdown: string): Block[] {
        const lines = markdown.split('\n');
        const blocks: Block[] = [];
        let blockId = 0;
        
        let currentBody: string[] = [];
        let currentList: string[] = [];
        
        const flushBody = () => {
            if (currentBody.length > 0) {
                blocks.push({
                    type: 'body',
                    text: currentBody.join('\n').trim(),
                    id: `body-${blockId++}`
                });
                currentBody = [];
            }
        };
        
        const flushList = () => {
            if (currentList.length > 0) {
                blocks.push({
                    type: 'list',
                    items: currentList,
                    id: `list-${blockId++}`
                });
                currentList = [];
            }
        };
        
        for (const line of lines) {
            const trimmed = line.trim();
            
            // Skip empty lines
            if (!trimmed) {
                continue;
            }
            
            // Check for headings
            const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
            if (headingMatch) {
                flushBody();
                flushList();
                
                const level = headingMatch[1].length;
                const text = headingMatch[2].trim();
                
                blocks.push({
                    type: `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
                    level: level,
                    text: text,
                    id: `h${level}-${blockId++}`
                });
                continue;
            }
            
            // Check for list items (-, *, +)
            const listMatch = line.match(/^[\s]*[-*+]\s+(.+)$/);
            if (listMatch) {
                flushBody();
                currentList.push(listMatch[1].trim());
                continue;
            }
            
            // Everything else is body text
            flushList();
            currentBody.push(trimmed);
        }
        
        // Flush remaining content
        flushBody();
        flushList();
        
        return blocks;
    }

    onunload() {
        // Cleanup if needed
    }
}