# Case Study → Figma (Obsidian Plugin)

Export a case study written in Obsidian (Markdown) into structured JSON blocks, optimized to be pasted into the companion Figma plugin that generates **separate text layers** for fast case study page layout.

- **Command:** `Case Study -> Figma: Export case study to Figma (clipboard)`
- **Plugin ID:** `case-study-figma`
- **Author:** Meghan Lendhe — https://meghan-lendhe.github.io/
- **License:** MIT

---

## What it does

- Adds a command in Obsidian’s Command Palette to export the current note as JSON.
- Converts Markdown into ordered blocks:
  - Headings (`#` … `######`) → `h1`–`h6`
  - Body → **each non-empty line becomes its own block**
  - Bullets (`-`, `*`, `+`) → **each bullet becomes its own block**

---

## Companion plugin (Figma)

This exporter is intended to be used with:

- **Case Study Importer (Figma Plugin):** https://github.com/meghan-lendhe/Case-Study-Importer

---

## Output format

The plugin copies JSON like:

```json
[
  { "type": "h1", "level": 1, "text": "Title", "id": "h1-0" },
  { "type": "h2", "level": 2, "text": "Overview", "id": "h2-1" },
  { "type": "body", "text": "Problem: ...", "id": "body-2" },
  { "type": "body", "text": "Time: 14 weeks", "id": "body-3" },
  { "type": "list", "text": "A bullet item", "id": "list-4" }
]
```

### Block fields

- `type` (required): `h1`–`h6` | `body` | `list`
- `level` (optional): 1–6 (for headings)
- `text` (required): string content for that line/item
- `id` (required): identifier generated during export (useful for ordering and potential “update” flows later)

---

## How to use

1. Open your case study note in Obsidian.
2. Press `Ctrl + P` to open Command Palette.
3. Run: **Case Study -> Figma: Export case study to Figma (clipboard)**
4. Open Figma → run the Case Study Importer plugin.
5. Paste JSON into the plugin UI and click Import.

---

## Installation (manual)

1. Build the plugin (see Development).
2. Copy the built files into your vault:

`<YourVault>/.obsidian/plugins/case-study-figma/`

Files needed:
- `manifest.json`
- `main.js`
- `styles.css` (optional)

This matches the common layout used by the Obsidian sample plugin template.

3. In Obsidian: Settings → Community plugins → enable **Case Study → Figma**.

> If `.obsidian/plugins` doesn’t exist yet, create it.

---

## Development

This project was bootstrapped from the Obsidian sample plugin template (TypeScript → compiled `main.js`).

### Prerequisites
- Node.js + npm
- Obsidian desktop app

### Install
```bash
npm install
```

### Dev build (watch)
```bash
npm run dev
```

### Production build
```bash
npm run build
```

After rebuilding, reload the plugin in Obsidian (toggle it off/on) to pick up changes.

---

## Parsing rules (current)

- Headings: `#{1,6} Heading` → a heading block (`h1`–`h6`)
- Body: each non-empty line that isn’t a heading or list item → `body`
- Lists: `- item` / `* item` / `+ item` → `list`
- Empty lines are ignored

---

## Known limitations

- Markdown styling isn’t preserved (bold/italic/links are exported as plain text).
- Tables, callouts, embeds, and images aren’t converted.
- IDs are generated during export; editing the note can change ordering/IDs.

---