# Temporary homepage section ports

Lakebase's Architecture and Autoscaling sections were ported from
[PR #222](https://github.com/pixel-point/neon-next/pull/222), pinned to
`01403f1213de5dea293637be4d99713c8af9bcfc`. No commits from that branch were merged
or cherry-picked. The source homepage components and their existing assets are
unchanged.

The Lakebase wrappers use `lakebasePageContent` for the Figma copy and section
headings. Their layout now follows the updated Neon Website 3.0 designs:
[Architecture](https://www.figma.com/design/tg8jA75ScOMcRf95D5JHv0/Neon-Website-3.0?node-id=37601-20027)
and [Autoscaling](https://www.figma.com/design/tg8jA75ScOMcRf95D5JHv0/Neon-Website-3.0?node-id=37601-20363).
Both use a centered 1344 px content area. Architecture places its caption and
icon features below the diagram; Autoscaling uses a contained chart on a gray
background with three numbered benefits beneath it. On mobile these rows stack.
The PR's Rive interactions, mobile image fallbacks, and statistic/tab behavior
are preserved. The shared Markdown mirror reads the same content in page order.
Architecture additionally keeps all tooltip flags off while idle; the original
file otherwise reopens its default Compute tooltip without pointer input. The
neutral/hover synchronization runs only while the diagram is visible.
The Architecture Rive fills the container at its native 2770 × 1530 artboard
ratio. Its height follows the width; no cropped stage, extra background, or
bottom rule is added around it. Pointer coordinates use the full artboard.

## Source mapping

| Lakebase file                   | Source in PR #222                                         |
| ------------------------------- | --------------------------------------------------------- |
| `architecture/architecture.jsx` | `src/components/pages/home/architecture/architecture.jsx` |
| `architecture/animation.jsx`    | `src/components/pages/home/architecture/animation.jsx`    |
| `autoscaling/autoscaling.jsx`   | `src/components/pages/home/autoscaling/autoscaling.jsx`   |
| `autoscaling/animation.jsx`     | `src/components/pages/home/autoscaling/animation.jsx`     |
| `use-section-rive-animation.js` | `src/hooks/use-rive-animation.js`                         |

The local hook preserves the PR's resize/ready handling and listener control.
The new Architecture asset requires the PR's Rive Canvas runtime 2.40.0
(`@rive-app/react-canvas` 4.32.0); the older 2.32.0 runtime cannot import it.
The runtime helper and self-hosted WASM files therefore also come from the PR,
while the existing hero preload list and font loader are preserved. The shared
animation hook and WebGL2 renderer are unchanged.

## Assets and eventual consolidation

- `public/animations/pages/home/lakebase-postgres.riv` and the three new mobile
  PNGs keep their original PR paths and exact bytes.
- `public/animations/rive/` keeps the PR's matching Canvas WASM files and paths.
- The PR's `public/animations/pages/home/autoscaling.riv` is copied unchanged to
  `public/animations/pages/lakebase/autoscaling.riv`. The old homepage still uses
  the existing, different file at the original path.
- The three dark legend SVGs are copied unchanged under
  `src/icons/lakebase/autoscaling/legend/` for the same reason: replacing their
  existing counterparts would change the old homepage.
- The three Architecture feature SVGs in `src/icons/lakebase/architecture/`
  are exact exports from the updated Figma design, not homepage PR assets.

After the homepage PR lands in `main`, compare its final components and hook
with these pinned copies. Consolidate the animation components/hook first,
switch Autoscaling and the legend imports back to their shared paths when the
bytes match, and remove the temporary duplicates. Then consider content props
for the section wrappers; the updated Lakebase layout, headings, and feature
groups must remain. Matching assets at their original paths should merge identically as
long as upstream has not subsequently changed them.
