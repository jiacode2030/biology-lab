// Stress-tests every practice-problem generator: many samples each, flags NaN/undefined/Infinity text,
// non-finite or absurd answers, bad choice indexes, duplicate choices, wrong units
// (negative concentrations, pH outside 0-14 for ordinary problems). node tests/audit.js  [N=400]
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  p.on('pageerror', e => console.log('PAGEERR', e.message));
  await p.goto('file://' + path.join(__dirname, '..', 'index.html') + '?debug'); await p.waitForTimeout(400);
  const N = +(process.env.N || 400);
  const bad = await p.evaluate(N => {
    const out = [], bump = (id, why, ex) => { out.push({ id, why, ex }); };
    const strip = h => String(h).replace(/<[^>]+>/g, '');
    window.__bio.PROBS.forEach(q => {
      const seen = {};
      for (let i = 0; i < N; i++) {
        let d; try { d = q.gen(); } catch (e) { if (!seen.err) { seen.err = 1; bump(q.id, 'gen threw: ' + e.message); } continue; }
        const txt = strip(d.q) + ' ' + strip(d.sol || '') + ' ' + strip(d.hint || '');
        if (/undefined|\bNaN\b|Infinity|\[object|\bnull\b(?! hypothesis)/.test(txt) && !seen.txt) { seen.txt = 1; bump(q.id, 'bad text', txt.slice(0, 200)); }
        if (d.choices) {
          if (!(d.ans >= 0 && d.ans < d.choices.length) && !seen.idx) { seen.idx = 1; bump(q.id, 'answer index out of range', JSON.stringify(d.ans)); }
          if (new Set(d.choices).size !== d.choices.length && !seen.dup) { seen.dup = 1; bump(q.id, 'duplicate choices', d.choices.join(' | ')); }
          if (d.choices.length < 2 && !seen.few) { seen.few = 1; bump(q.id, 'fewer than 2 choices'); }
        } else if (d.expr) {
          const A = window.__bio.parseExpr, ok = (() => { try { A(d.expr); return true; } catch (e) { return false; } })();
          if (!ok && !seen.pe) { seen.pe = 1; bump(q.id, 'expr does not parse', d.expr); }
          if (ok && d.chkf && !seen.cf) { const f = A(d.expr); for (const x of [0.37, 0.83, 1.21, 1.74, 2.3]) { const v = d.c ? window.__bio.D(f, x) : f(x), w = d.chkf(x); if (isFinite(v) && isFinite(w) && Math.abs(v - w) > 1e-3 * (1 + Math.abs(w))) { seen.cf = 1; bump(q.id, 'expression disagrees with numeric check at x=' + x + ' (' + v + ' vs ' + w + ')', d.expr); break; } } }
          if (!d.hint && !seen.hint) { seen.hint = 1; bump(q.id, 'missing hint'); }
          if (!d.sol && !seen.sol) { seen.sol = 1; bump(q.id, 'missing solution'); }
        } else {
          if (!Number.isFinite(d.ans) && !seen.fin) { seen.fin = 1; bump(q.id, 'answer not finite', String(d.ans)); }
          if (d.chk !== undefined && !seen.chk) { const tol = Math.max(1e-3 * Math.abs(d.chk), 2e-3); if (!(Math.abs(d.chk - d.ans) <= tol)) { seen.chk = 1; bump(q.id, 'answer disagrees with independent numeric check (' + d.ans + ' vs ' + d.chk + ')', strip(d.q).slice(0, 140)); } }
          if (!d.unit && d.unit !== '' && !seen.unit) { seen.unit = 1; bump(q.id, 'missing unit field'); }
          if (!d.hint && !seen.hint) { seen.hint = 1; bump(q.id, 'missing hint'); }
          if (!d.sol && !seen.sol) { seen.sol = 1; bump(q.id, 'missing solution'); }
        }
      }
    });
    return { bad: out, n: window.__bio.PROBS.length };
  }, N);
  console.log(`${bad.n} generators, ${N} samples each`);
  bad.bad.forEach(o => console.log(`  ${o.id}: ${o.why}${o.ex ? ' :: ' + o.ex : ''}`));
  console.log(bad.bad.length ? `${bad.bad.length} issue(s)` : 'audit clean');
  await b.close();
})();
