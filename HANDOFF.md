# Biology Lab: handoff

The repo has the full engine, shell and AP Labs conventions, plus modules as they are built (see `src/groups.json` for the planned 47). It is committed locally with no GitHub remote yet.

## To publish
1. Create `jiacode2030/biology-lab` (public), add it as `origin`, push `main`; enable Pages from `main` root (`.nojekyll` is present).
2. Register on the landing page: `git apply ap-labs-integration.patch` in the `jiacode2030/ap-labs` repo (adds the course entry, privacy/terms wording, app shortcut, feedback label table). If the Calculus Lab patch is not applied yet, `ap-labs-integration-with-calculus.patch` applies both. Create the `course:bio` label in `ap-labs-feedback`. Set `status: 'soon'` in `courses.js` until the site is live.
3. When the site changes, bump `SITE_VERSION` in `src/js/report.js` and the "Last updated" lines.
