# DESIGN.md — Commas Dashboard Design System (Reverse-Engineered)

Goal: reproduce the existing Commas product faithfully for the AI Evidence Copilot prototype. **Not a redesign.**

## Sources and confidence

1. **Authenticated live inspection** of `commas.com/dashboard/org_idyOx8DPfH6S/resolution-center` via real
   Chrome + CDP (user logged in; strictly read-only — page loads, one filter-popover open, screenshots,
   computed-style reads). This is the primary source; values from it are marked **(measured)**.
   Captures: `references/live-authed-resolution-center.png`, `references/live-authed-reason-popover.png`.
2. **Reference screenshots** in `references/` (9 timestamped files) — cross-checks and coverage of states.
3. **Login-page live inspection** (same app bundle): `references/live-capture-login-page.png` — source for
   the blue primary button and stacked-input patterns not present on the Resolution Center page.
4. Background asset downloaded from the live app: `references/commas_bg_draft.webp`.

Values marked **(observed)** are read from screenshots; **(inferred)** fills gaps with stated reasoning.
No changes were made to the real Commas account.

Stack facts (measured): Tailwind CSS v4, fonts **Inter** (UI default) + **Geist** (headings, `font-geist`
labels), custom utilities (`text-13px`, `gap-4px`, `rounded-15px`, `glass-card`, `glass-shadow-glass`).

**Important account reality**: even authenticated, the disputes list shows the error state
("Couldn't load your disputes") — the account has no loadable dispute data. A populated dispute table and
the dispute-detail page were therefore never observable; see §16.

---

## 1. Typography (measured on the authenticated dashboard)

Font stacks:

```css
--font-body:    Inter, Geist, ui-sans-serif, system-ui, "Segoe UI", Roboto, sans-serif;
--font-heading: Geist, ui-sans-serif, system-ui, "Segoe UI", Roboto, sans-serif;
```

| Role | Font | Size / line-height | Weight | Tracking | Color |
|---|---|---|---|---|---|
| Page title h1 ("Resolution Center") | Geist | 20px / 26px | 600 | −0.4px | `#1a1a1a` |
| Tab labels | Geist | 13px / 17px (14px <768px) | 500 | −0.13px | `#1a1a1a` |
| Buttons (Retry, Clear, Apply, Export) | Inter | 14px | 500 | 0 (Clear: +0.24px) | `#1a1a1a` / white |
| Filter pill labels | Inter | 13px / 17px | 400 | 0 | `#000` |
| Toolbar search input | Inter | 13px / 17px | 500 | 0 | `#1a1a1a` |
| Empty/error title | Geist | 13px / 19px | 600 | 0 | `#1a1a1a` |
| Empty/error subtitle | Geist | 12px / 17px | 400 | 0 | `#727272` |
| Popover section header | Inter | 11px / 10px | 600 | +0.22px, UPPERCASE | `rgba(0,0,0,.4)` |
| Popover option labels | Inter | 14px / 20px | 500 | 0 | `#404040` |
| Widget/card titles ("Finish setup") | Inter | 14px / 21px | 600 | −0.2px | `#1a1a1a` |
| Small dark button label | Inter | 12.5px | 600 | 0 | white |

Text color system (measured): primary `#1a1a1a` · secondary/labels `#404040` · quaternary `#727272` ·
muted overlines `rgba(0,0,0,.4)` · org name `#111111`.

Note: the login page uses a larger display scale (h1 32px/500/−0.6px Inter) — dashboard pages use the
compact scale above. Use the dashboard scale for the prototype.

## 2. Application shell (measured)

```
app-shell-bg (white + background-image: commas_bg_draft.webp — soft pastel blue/lavender wash)
padding: 12px top, 16px right at ≥992px; full height 100dvh
├─ sidebar rail: 48px wide column, ~10px from left edge, gap 4px, pb 10px
├─ content column (flex-1)
│  ├─ header (transparent, z-30, ~64px): org glass pill · AI search · icon cluster
│  └─ main surface (the big rounded panel)
```

Main surface (measured):

```css
background: rgba(255,255,255,.88);
border-radius: 12px;
padding: 30px 20px 20px;
box-shadow:
  0 0 0 1px rgba(16,24,40,.05),
  0 2px 10px rgba(26,31,50,.08),
  0 16px 40px -18px rgba(26,31,50,.16),
  inset 0 1px 0 rgba(255,255,255,.9),
  inset 0 -1px 0 rgba(0,0,0,.06),
  inset 1px 0 0 rgba(255,255,255,.5),
  inset -1px 0 0 rgba(255,255,255,.5);
/* fills to bottom of viewport: height ≈ calc(100dvh - 0.75rem) on the column */
```

Glass cards — org switcher pill, and the general floating-surface recipe (measured, `.glass-card`):

```css
background: rgba(255,255,255,.42);
backdrop-filter: blur(24px) saturate(1.25);
border: 1px solid rgba(255,255,255,.6);
border-radius: 12px;
box-shadow: 0 0 0 1px rgba(16,24,40,.035),
            0 8px 30px -14px rgba(16,24,40,.2),
            inset 0 1px 0 rgba(255,255,255,.5);
```

## 3. Sidebar (measured geometry + observed content)

- Rail: 48px wide, vertical flex, centered, gap 4px, offset ~10px from window edge, transparent bg
  (canvas shows through). Hidden below 992px.
- Top: logo tile (white rounded square ~40px with blue comma mark, soft shadow).
- Nav icons top group (~20px line icons, dark gray): home, library, arrow-up-right, wallet,
  **gavel = Resolution Center**.
- Active item (observed): white rounded-xl tile (~40px) with soft shadow around the icon; short divider
  line below the tile.
- Middle: app tiles (~36–40px, rounded-xl, colored: black "S", diamond on yellow-green, purple funnel,
  red asterisk), then a "+" tile.
- Bottom: settings gear, user/org avatar tile.

## 4. Top navigation (measured + observed)

Transparent header on the canvas, ~64px, containing:

- Left (~220px column): **org switcher** — glass card (recipe above), width 256px, inner row gap 6px:
  dark rounded-square avatar (~28px) with comma mark, org name 15–16px `#111`, chevron-down.
- Center: **AI search bar** — wide glass pill (max ~900px), leading sparkle icon, placeholder cycles
  ("Search apps… / invoices… / transactions… / anything…"), 16px gray-400 text (observed).
- Right: icon buttons (+, gear, ?, bell) ~36px hit areas, 20px line icons, gray-700 (observed);
  in some states a dark "Finish setup" pill with progress ring (observed).

## 5. Page container (measured)

- h1 padding-left 5px, sits at top of main surface; content x-inset 20px (surface padding) + internal 0.
- Vertical rhythm: h1 (26px) → 18px gap → tab row (41px) → divider → 20px gap → filters row (29px) →
  18px gap → content card.

## 6. Tabs (measured)

- Item: flex row, gap 4px, padding 6px 10px, height 41px, cursor-pointer; label per §1; leading 16px icons
  (alert-circle, burst/spinner, none, x-circle, check-circle).
- **Active**: `border-bottom: 1.5px solid #000`; label + icon `#1a1a1a`.
- **Inactive**: no underline; same label color (icon renders lighter gray) (measured label identical —
  differentiation is the underline, not text color).
- A hairline divider runs under the full tab row (observed): 1px `rgba(0,0,0,.06)`-ish.
- Tab sets (observed): Needs response · In review · All disputes · Lost · Won. "All disputes" adds a
  `Status` filter pill.

## 7. Filters row (measured)

Filter pill (`Reason`, `Amount`, `Dispute date`, `Evidence due by`, + `Status` on All disputes):

```css
display: inline-flex; align-items: center; gap: 5px;
height: 29px; padding: 7px 8px;
border: 1px solid rgba(0,0,0,.1); border-radius: 9999px;
font: 400 13px/17px Inter; color: #000; background: transparent;
```

Leading 16px line icon per pill (?-circle, $, calendar, calendar, dashed-circle). Open state shows a blue
focus ring (observed).

Toolbar search (right side; measured):

```css
/* wrapper */ background: rgba(255,255,255,.4); border-radius: 8px; height: 29px;
padding: 0 8px; gap: 5px; box-shadow: inset -5px -2px 44px -29px rgba(17,17,17,.1);
/* input */ font: 500 13px/17px Inter; color: #1a1a1a; background: transparent;
placeholder gray-400; leading magnifier icon 16px;
```

Export button (toolbar-compact secondary; measured):

```css
height: 29px; padding: 0 16px; gap: 4px; border-radius: 8px;
background: #fff; border: 1.5px solid rgba(0,0,0,.05);
font: 500 14px Inter; color: #1a1a1a;
box-shadow: 1px 1px 2px rgba(0,0,0,.05), 3px 2px 3px rgba(0,0,0,.04),
            6px 5px 5px rgba(0,0,0,.03), 10px 9px 5px rgba(0,0,0,.01);  /* soft directional stack */
/* trailing external-link icon */
```

## 8. Filter popover (measured — see live-authed-reason-popover.png)

```css
/* card */ position: absolute; z-index: 20; width: 256px; margin-top: 8px;
background: #fff; border-radius: 16px; overflow: hidden;
box-shadow: 0 0 0 1px #e5e5e5, 0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -4px rgba(0,0,0,.1);
```

- Header: "FILTER BY REASON" — 11px/600 uppercase +0.22px `rgba(0,0,0,.4)`, padding 12px 14px 6px.
- Option rows: flex, gap 10px, padding 6px 10px, height 32px, border-radius 8px (hover bg),
  inside ~6px list padding; label 14px/500 `#404040`.
- Checkbox: 16×16px, border-radius 4px, `box-shadow: inset 0 0 0 1px #d1d5db`, white bg;
  checked state: dark fill + white check (observed).
- List scrolls (thin scrollbar) when long.
- Footer: two buttons, gap ~8px, padding ~10px 14px:
  - **Clear**: white, border 1px `#d1d5db`, radius 12px, height 37px, padding 0 12px, 14px/500 +0.24px,
    shadow `0 1px 2px rgba(0,0,0,.05)`.
  - **Apply ✓**: dark gradient `linear-gradient(#343434, #0c0c0c)`, radius 12px, height 37px,
    padding 0 16px, white 14px/500, trailing check icon, glossy inset:
    `inset 1px 1px 1px rgba(255,255,255,.18), inset -1px -1px 1px rgba(0,0,0,.6), 0 1px 2px rgba(0,0,0,.25)`.

### Dispute reason taxonomy (observed live, use verbatim)

`Fraudulent`, `Product not received`, `Product unacceptable`, `Duplicate`, `Subscription canceled`,
`Unrecognized`, `Credit not processed`, `General` (list scrolls; possibly more below).

## 9. Buttons (all measured)

| Variant | Recipe |
|---|---|
| **Dark primary** (Apply, Start verification) | gradient `#343434 → #0c0c0c` (small widget version: flat `#111`), white 14px/500 (12.5px/600 in widgets), radius 12px (8px in widgets), height 37–40px, glossy inset shadows as §8. |
| **Blue primary** (login CTAs; use for "Collect evidence with AI") | gradient `#88C0FD → #2E78EF`, white 14px/500, radius 12px, padding 10px 14px, height 40px, `inset 1px 1px 1px rgba(255,255,255,.5), inset -1px -1px 1px rgba(28,72,143,.5), 0 1px 2px rgba(0,0,0,.05)`. |
| **Secondary** (Retry, Clear) | white bg, border 1px `#d1d5db`, radius 12px, height 37–40px, padding 0 12–16px, `#1a1a1a` 14px/500, gap 4px, shadow `0 1px 2px rgba(0,0,0,.05)`. |
| **Toolbar-compact secondary** (Export) | as §7: 29px tall, radius 8px, border 1.5px `rgba(0,0,0,.05)`, directional soft shadow stack. |
| **Icon-only** | ~36px hit area, 20px line icon, transparent; hover `rgba(255,255,255,.42)` glass tint. |

Focus: `focus-visible:ring-2` blue ring (`rgba(15,117,220,.8)`-class token) + ring-offset (measured classes).

## 10. Inputs (measured on login; dashboard toolbar variant in §7)

Standard form input — two-layer construction:

```html
<div style="padding:1px; background:#d1d5db; border-radius:12px; box-shadow:0 1px 2px rgba(0,0,0,.05)">
  <div style="background:#fff; border-radius:10.5px; height:40px; display:flex; align-items:center">
    <input style="padding:8px 12px; font:300 16px/24px Inter; color:#1a1a1a; background:transparent; border:0">
  </div>
</div>
```

Focus tints the outer layer blue (`transition-colors 150ms linear`). Labels: 13px `#404040`,
margin-bottom 6px, padding-left 8px.

## 11. Cards / content containers (measured)

Standard content card (the disputes area):

```css
background: #fff; border: 1px solid rgba(0,0,0,.06); border-radius: 15px;
padding: 24px; display: flex; flex-direction: column; gap: 12px;
```

Widget card ("Finish setup", observed): width 324px, white bg, ~1.5px light-blue border
(≈ `#a9c6f8`), radius ~14px, internal padding ~16px; contains a 4px blue progress bar
(track light gray, fill `#4b83f0`-ish, rounded), checklist rows (20px green-tinted check circles:
`#e4f5d6` bg, `#4e9b11` check, 14–15px labels), a light inner promo card (`#f5f8fe` bg, 1px light border,
radius ~10px), and a full-width dark button. Footer link "View all →" 13px/500.

## 12. Modals (measured vars; none rendered live)

White surface, radius ~16px, shadow `0 0 25px rgba(0,0,0,.08)` (app CSS var) — the Finish-setup widget
(§11) is the closest live reference for header + body + dark-CTA anatomy. **(inferred)**: overlay
`rgba(0,0,0,.3)`, title 16px/600, footer right-aligned Secondary + Dark-primary pair (mirrors §8 footer).

## 13. Loading states (measured/observed)

- Spinner glyph: thin-stroke burst (the "In review" icon).
- Progress: thin 4px rounded blue bar (§11) and circular progress ring ("Finish setup" pill).
- Motion tokens (measured vars): 100–250ms, easing `cubic-bezier(.2,0,.4,.9)` (standard),
  `cubic-bezier(.12,.6,.4,.95)` (enter).
- No skeletons evidenced; for the prototype's investigation progress, prefer the checklist pattern from the
  product spec styled with §11/§15 tokens.

## 14. Error / empty states (measured)

Anatomy inside the standard content card (§11), centered, gap 12px:

- Icon circle: 40×40px, `border-radius: 9999px`, bg `#FDECEE`, icon color `#D5384B` (20px alert-circle).
- Title: 13px/19px, 600, Geist, `#1a1a1a` — "Couldn't load your disputes".
- Subtitle: 12px/17px, 400, `#727272` — "Check your connection and try again."
- Action: Secondary button with leading refresh icon — "Retry" (40px tall).

Reuse the same anatomy for empty states with swapped semantic colors.

## 15. Semantic / status colors (measured)

| Intent | Bg | Border | Text/icon |
|---|---|---|---|
| Danger / Lost / error | `#FDECEE` | — | `#D5384B` |
| Success / Won / verified | `#edfcde` (checkmark circles `#e4f5d6`) | `#b5ef72` | `#366f08` / `#4e9b11` |
| Warning / needs review | `#ffefdf` | `#f6ba94` | `#cb6301` |
| Info / AI accents | `#edf3ff` | `#aed3fa` | `#4f7fcd`; primary blue `#2E78EF` |

Neutral borders: `#d1d5db` (controls), `rgba(0,0,0,.1)` (pills), `rgba(0,0,0,.06)` (cards),
`#e5e5e5` (popover ring), `#ebebeb` (row dividers, app var). Table header bg `#fafafa` (app var).

## 16. Gaps the evidence cannot cover (explicit)

1. **Populated dispute list**: the account's disputes API errors even when authenticated, so no dispute
   rows exist to copy. Build rows from: table tokens (§15 neutrals, `#fafafa` header), filter-implied
   columns (reason, amount, dispute date, evidence due by, status), 13px/500 gray header labels and
   14px cell text **(inferred)**, inside the §11 card.
2. **Dispute detail page**: never rendered. Compose from documented primitives (h1 scale, cards, tabs,
   badges, buttons) — flag as new-but-consistent surface in the demo.
3. Modals/toasts: §12 basis is CSS vars + the Finish-setup widget, not a live modal.
4. Icons: thin-stroke rounded line icons; Lucide is a visually safe stand-in.

## Asset inventory

- `references/commas_bg_draft.webp` — the real app-shell background wash (use it verbatim).
- `references/live-authed-resolution-center.png` — authenticated Resolution Center, 1470px viewport.
- `references/live-authed-reason-popover.png` — filter popover open, with Finish-setup widget visible.
- `references/live-capture-login-page.png` — blue primary button + stacked input reference.
- 9 timestamped screenshots — earlier full-page states across all five tabs.
