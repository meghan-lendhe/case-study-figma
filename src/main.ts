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

        for (const line of lines) {
            const trimmed = line.trim();

            // Skip empty lines
            if (!trimmed) {
                continue;
            }

            // Check for headings
            const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
            if (headingMatch) {
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

            // Check for list items (-, *, +) - EACH ITEM SEPARATE
            const listMatch = line.match(/^[\s]*[-*+]\s+(.+)$/);
            if (listMatch) {
                blocks.push({
                    type: 'list',
                    text: listMatch[1].trim(),
                    id: `list-${blockId++}`
                });
                continue;
            }

            // Everything else is body text - each line separate
            blocks.push({
                type: 'body',
                text: trimmed,
                id: `body-${blockId++}`
            });
        }

        return blocks;
    }


    onunload() {
        // Cleanup if needed
    }
}