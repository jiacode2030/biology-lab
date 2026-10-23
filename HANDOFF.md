# Biology Lab: handoff

The repo has the full engine, shell and AP Labs conventions, all 47 modules (4 math and science practices, then Units 1-8), 10 original free-response questions, 26 "which approach?" clues and 22 practice items, and 144 randomized problem generators. It is committed locally with no GitHub remote yet.

## To publish
1. Create `jiacode2030/biology-lab` (public), add it as `origin`, push `main`; enable Pages from `main` root (`.nojekyll` is present).
2. Register on the landing page: `git apply ap-labs-integration.patch` in the `jiacode2030/ap-labs` repo (adds the course entry, privacy/terms wording, app shortcut, feedback label table). If the Calculus Lab patch is not applied yet, `ap-labs-integration-with-calculus.patch` applies both. Create the `course:bio` label in `ap-labs-feedback`. Set `status: 'soon'` in `courses.js` until the site is live.
3. When the site changes, bump `SITE_VERSION` in `src/js/report.js` and the "Last updated" lines.


## Before you rely on it
- Content was written from the eight-unit course framework and checked by calculation (every generator has an independent check in `tests/audit.js`), but it has **not been reviewed by a biology teacher**. FRQ point values are practice, not official scoring.
- Exam facts to reconfirm on AP Central each year: date and session (`AP_EXAM_DATES` in `src/js/ui.js`), question counts and times, calculator rules (the exam page says to check AP Central).
- Simulations are simplified models (arbitrary units, illustrative thresholds); each says so near the lab.
