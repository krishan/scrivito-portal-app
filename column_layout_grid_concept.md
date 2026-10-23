# Column layout on CSS grid

This branch changes how `ColumnContainerWidget` renders its columns. Nothing else in the app is
touched. It is deliberately free of the designability work this was originally entangled with:
no `design` attribute, no `designTagProps`, no `design` prop on a tag.

## What changed

|            | before                                               | after                                                               |
| ---------- | ---------------------------------------------------- | ------------------------------------------------------------------- |
| mechanism  | Bootstrap `.row` + `.col-md-*`                       | one `<div class="column-container-widget">` that is `display: grid` |
| `colSize`  | a width in twelfths; had to sum to 12                | a relative weight; need not sum to anything                         |
| tracks     | `col-md-{n}` classes per column                      | `--column-template: 4fr 4fr 4fr` on the container                   |
| gutters    | `--bs-gutter-x`, switchable off via `disableGutters` | `gap: 1.5rem`, always                                               |
| modes      | `layoutMode: grid \| flex`, two render paths         | one path                                                            |
| `flexGrow` | per-column boolean, only meaningful in flex mode     | gone                                                                |
| stacking   | `col-md-*` collapses below `md`                      | `@media (max-width: 767.98px)` sets `grid-template-columns: 1fr`    |
| size       | —                                                    | 289 lines removed, 60 added                                         |

`normalizeColSizes` survives, but only `ColumnsEditor` calls it now: it is no longer layout math,
it is the editor's display metaphor (the 12-unit ruler the user drags). The renderer uses the raw
weights.

The container's `alignment` enum (`start | center | end | stretch`) is unchanged, including its
`AdvancedEnumEditor` and icons. `align-items-*` works the same on a grid container as on a flex
one. `stretch` additionally needs the column itself to be a flex box, which is what
`.column-container-widget__column--fill` does for a column holding a single widget.

`disableResponsiveAdaption` is unchanged and still decides whether the mobile media query applies.

## Why

A gap between columns could not be expressed in Bootstrap's grid. `.col-md-4` resolves to
`flex: 0 0 auto; width: 33.3333%`, so `flex-shrink: 0` inside a `flex-wrap: wrap` parent. Three
of them consume exactly 100% of the line, and because they refuse to shrink, any gap you add
pushes the third column onto a line of its own. The gutter mechanism works around this by
_faking_ the gap with padding inside each column, which is why the gutter is inside the column
box rather than between the boxes, and why a column's own background has no inset.

`fr` is defined as a share of what remains _after_ the gaps are subtracted. With grid the failure
mode is therefore structurally impossible, and the gap is a real gap between the boxes.

Two further simplifications fall out of this:

- One mechanism instead of two. The flex mode existed because the grid mode could not do
  "columns that just share the space"; `1fr 1fr 1fr` is that, so the mode is redundant.
- No cross-sibling invariant. "The widths must sum to 12" was an invariant over a widget list
  that the editor had to keep true on every add, delete and drag. Weights have no such rule,
  so the editor can set whatever it likes and the renderer cannot be handed an invalid state.

## Content compatibility

Weights versus twelfths is free: existing values are already the ratios we want. `4,4,4` means
"three equal columns" either way, `3,9` means "a quarter and three quarters" either way. No
migration is needed for the normal case.

The three removals are data-safe (unknown attributes are simply not read) but they do change
behaviour for content that used them:

- `layoutMode: 'flex'`: in flex mode the renderer _discarded_ `colSize` and used
  `columns.map(() => 1)`. Those stored `colSize` values were dead, and are now live — they
  determine the track widths. Content that was visually "equal columns" may come back as
  whatever `colSize` happened to be left in the database.
- `disableGutters: true`: these containers get the 1.5rem gap back. There is no way to turn it
  off any more.
- `.row`'s negative margins are gone. They used to pull the row 0.75rem outside its parent on
  each side, cancelling the columns' gutter padding; without them a column's box is inset by
  about 0.75rem at the container's left and right edge.

Three ways to deal with that, in increasing order of laziness:

1. Audit the content: query for `layoutMode` and `disableGutters` being set and fix those
   widgets by hand (there should not be many).
2. Read the legacy attributes transitionally: keep them on the class for one release, let the
   renderer fall back to `1fr` per column when `layoutMode` is `flex` and to `gap: 0` when
   `disableGutters` is set, and drop that code once the content is clean.
3. Accept it and say so in the release notes.

## What this branch deliberately does not do

**No per-breakpoint column counts or gutters.** "Three columns on desktop, two on tablet, one on
phone" and "a smaller gap on phones" are the obvious next asks, and grid makes them trivial in
CSS. They are not here because the _attribute_ side is missing: expressing them needs a
responsive-attribute capability in the SDK, which does not exist yet. Until then the single
mobile breakpoint is all there is, exactly as before.

**No move of the editor into the SDK.** A separate plan exists for extracting `ColumnsEditor`
into the SDK as a reusable layout editor. It should lift _this_ model and not the Bootstrap one.
In particular, `colSize` as a weight removes most of that plan's contract checks: there is
nothing to validate if any list of positive numbers is a valid layout.
