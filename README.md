# Golden Getaway — GTA 6 Cover Art Maker

[![make.fun](https://img.shields.io/badge/make.fun-bounty-blue)](https://make.fun)
[![gta6-cover-art-01](https://img.shields.io/badge/gta6--cover--art--01-entry-orange)](https://make.fun)

Turn your crew into a sunset movie-poster cast. **Golden Getaway** builds a
1024×576 landscape cast collage in the classic movie-poster structure: a
five-star pull-quote strip (“A JOYRIDE WORTH EVERY TICKET” — *The Sunset
Herald*), seven labelled character panels (The Wheelman, The Inside Man, The
Charmer, The Mechanic, The Siren, The Ghost, The Muscle), a giant
orange-to-gold gradient title, a pink neon script subtitle (“one last summer
job”), the tagline “SEVEN CREW • ONE SUNSET • NO WAY BACK”, production
credits, a barcode and a gold BEST CAST seal.

## How it works

1. Pick a cast panel, then click a photo in the library (7 fresh sunset
   portraits bundled under `app/samples/`) or upload your own photos.
2. Drag any panel to reframe its photo; use the zoom slider for a closer crop.
   One photo can fill all 7 panels with different crops.
3. Edit the title, subtitle, quote, gazette name, tagline, credits and every
   role label — the preview updates live.
4. Export PNG in **1920×1080**, **1080×1080** or **1080×1350** — three clicks
   from photo to PNG.

Everything runs offline in the browser: no network, no uploads. Photos are
read locally with FileReader and never leave the machine. The Anton title font
(OFL) is bundled under `app/fonts/`.

## Run it

```sh
node serve.ts   # then open http://localhost:8080
```

## Shots

- `?shot=cover&size=1280x720` — the exported landscape cover, full-frame
- `?shot=editor` — the editor with a sample photo loaded
- `?shot=cover&size=1080x1080` / `?shot=cover&size=1080x1350` — square / portrait covers

## Build

```sh
MAKEFUN_OUTPUT_DIR=/tmp/out node main.ts
```
