# Biology Lab: notes for Claude

Interactive, intuition-first AP Biology study site. One self-contained `index.html`, built from `src/` by `python3 build.py`. Sibling of Mechanics, E&M, Chemistry and Calculus Lab (under github.com/jiacode2030): they share the engine and design but are separate repos and sites.

## Workflow
- Edit `src/`, never `index.html` directly. Run `python3 build.py` (needs Python 3 and Node for the JS syntax check), then commit both `src/` and the rebuilt `index.html`.
- Module = `src/modules/<id>.html` + `<id>.js`. The HTML is **generated** from `tools/units/*.py` by `python3 tools/mk.py` (one `mod(...)` call per module; edit the Python, not the HTML). The JS is hand-written. Add new modules to `src/groups.json` (unit order) and `src/mods.json` (title, description).
- Shared engine: `src/js/core.js` (helpers, panels), `biolib.js` (`sim2d`, `glab` graph labs, numerics, `svgG`, `mcq`, answer parsing), `teach.js` (Coach, Reset, Set-it-up buttons), `practice.js` (problem cards, FRQs, "Which approach?"). Data banks: `src/data/*.js` (FRQs, method clues). Reference sheets: `src/ref/` (equations, genetic code, tables).
- Theme tokens: end of `src/css/bio.css` (amber layer). Color roles: **blue water/solute/dominant allele, green products/producers, pink protein/RNA/recessive allele, orange energy/ATP, gold light/sugar**.

## Rules that break the site if ignored
- The page has no doctype (quirks mode): ids and class names match case-insensitively. Never use two names that differ only by case (`x-A` and `x-a`), and never reuse an id across modules (`build.py` stops on case clashes).
- localStorage keys use the prefix `bio-`; "marked as done" is `bio-done` = `{moduleId: 1}` (the Intulab landing page reads it).
- A `sim2d`/`glab` step function must not call its own `render()`. Other sims' `render()` is fine.
- In canvas draw code, do not shadow the global theme object `T` with a local variable.
- Problem generators (`PROBS.push({id,topic,title,gen})`) return `{q, ans|choices, unit, tol|abs, hint, sol}`. Give numeric generators an independent `chk`; `tests/audit.js` compares it with `ans`.

## Intulab conventions
Follow `jiacode2030/intulab` (README): `.morelabs` back link, head tags with `/intulab/` paths, issue reports to `intulab-feedback` with `course:bio`, analytics honor Do Not Track / GPC, privacy and terms at `/intulab/privacy.html` and `/terms.html`, `sw.js` with cache `aplabs-bio-v1`. Keep "Last updated" and `SITE_VERSION` (`src/js/report.js`) current. The landing-page entry already lives in `courses.js` of `jiacode2030/intulab`.

## Content rules
- Accuracy first. Run `N=400 node tests/audit.js` after changing problems, and verify answers by hand.
- Keep the notices: "Unofficial study aid. Not affiliated with the College Board." and the study-only note.
- AP exam: `AP_EXAM_DATES` in `src/js/ui.js` (2027-05-03, Session 2, afternoon). Format card in `src/review/exam.html` (60 MCQ in 90 min, 6 FRQ in 90 min, hybrid digital). Reconfirm each year.

## Tests (Playwright + Chromium)
`node tests/check.js [moduleId ...]` (all views, desktop and phone, light and dark; slow for all modules, run in the background), `node tests/flow.js`, `node tests/audit.js`, `node tests/design.js`.

## Known uncertainties
The unit and topic list follows the eight-unit course framework from memory (verify against the current course and exam description); FRQs and "Which approach?" items are original and want teacher review.
