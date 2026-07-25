# /bsppp — Pollinator Pathway, Belmont Lake State Park

A guide to the 54 native species planted along the Pollinator Pathway, reached by QR
code on a sign at the garden. One HTML file, three map images, 54 photos. No build step
and no dependencies.

Source document, the photo-extraction script, and the original map photographs live
outside this repo in `~/pollinator-pathway/`. Photos and maps here are derived from it.

`/bsppp` must stay listed in `../_routes.json` under `exclude`. Without it the
Airtable catch-all in `functions/[slug].js` claims every single-segment path and
returns a hard 404 — same reason `/plant` is excluded.

## Reading the map

Beds are labelled with the species number and the first letters of the scientific name
(`45 Sym cor`). The search box matches either half, so there are no pins to place or
maintain. Four beds are painted with a label that does not match the species list; the
`PAINTED` object in `index.html` maps them to the right plant:

| Painted on the map | Actually |
|---|---|
| `32 Ger cal` | *Geranium carolinianum* — `Ger car` |
| `38 Min fis` | *Monarda fistulosa* — `Mon fis` |
| `54 Hel ang` | Swamp Sunflower, species **10** |
| `24 ○` in the legend | *Rudbeckia maxima*, species **25** |

Twelve species have no bed on the map: Zig Zag Goldenrod, Christmas Fern, Sweetfern,
Canada Anemone, Blue Stem Goldenrod, Goat's Beard, Jumpseed, Bleeding Heart, Woodland
Sunflower, Obedient Plant, Royal Catchfly, Swamp Milkweed. They are still in the
species list.

## Editing

Everything is in the `<script>` block at the bottom of `index.html`: `PLANTS` (species
text, transcribed from the source document), `CARE` (four lines, one job per season),
`PAINTED` (the mislabelled beds). The maintenance section highlights the current season
by itself; nothing else changes over time.

Every plant page carries a note that the original document did not record its reference
sources. That should stay until they are found.
