// End-to-end flows: practice (right and wrong answers), mistakes queue, exam builder, quiz, theme switch, search, reference drawer, report dialog.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  let bad = 0; const ok = (c, m) => { if (!c) { bad++; console.log('FAIL', m); } else console.log('ok  ', m); };
  p.on('pageerror', e => { bad++; console.log('PAGEERR', e.message); });
  await p.goto('file://' + path.join(__dirname, '..', 'index.html') + '?debug'); await p.waitForTimeout(400);
  // practice: wrong then right on a choice problem
  await p.evaluate(() => location.hash = 'practice'); await p.waitForTimeout(400);
  const first = await p.evaluate(() => { const c = document.querySelector('#pr-list .prob:not([hidden])'); return c.id; });
  const card = '#' + first;
  const info = await p.evaluate(sel => { const c = document.querySelector(sel); return { choice: !!c.querySelector('.sopts'), ans: c.rpCtx.ans }; }, card);
  console.log('first problem', first, JSON.stringify(info));
  if (info.choice) {
    const wrongIdx = await p.evaluate(sel => { const c = document.querySelector(sel); return Array.from(c.querySelectorAll('.sopts button')).findIndex(b => b.textContent !== c.rpCtx.ans); }, card);
    await p.click(`${card} .sopts button:nth-child(${wrongIdx + 1})`);
    ok(await p.evaluate(sel => document.querySelector(sel + ' .fb').classList.contains('no'), card), 'wrong answer shows red feedback');
    ok(await p.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('bio-review') || '{}')).length === 1), 'wrong answer queued for review');
    await p.evaluate(sel => { const c = document.querySelector(sel); Array.from(c.querySelectorAll('.sopts button')).find(b => b.textContent === c.rpCtx.ans).click(); }, card);
    ok(await p.evaluate(sel => document.querySelector(sel).classList.contains('solved'), card), 'right answer marks solved');
  }
  // a numeric problem: the answer box accepts fractions and exact values
  const num = '#prob-tr-pct';
  await p.fill(`${num} input`, '999'); await p.click(`${num} button[type=submit]`);
  ok(await p.evaluate(sel => document.querySelector(sel + ' .fb').classList.contains('no'), num), 'wrong numeric answer is marked wrong');
  await p.click(`${num} [data-act=new]`); await p.waitForTimeout(100);
  const ans = await p.evaluate(sel => document.querySelector(sel).rpCtx.ans, num);
  await p.fill(`${num} input`, String(ans)); await p.click(`${num} button[type=submit]`);
  ok(await p.evaluate(sel => document.querySelector(sel).classList.contains('solved'), num), 'right numeric answer marks solved');
  ok((await p.textContent('#pr-score')).startsWith('2 of') || (await p.textContent('#pr-score')).startsWith('1 of'), 'score updates');
  // review queue
  await p.evaluate(() => location.hash = 'review'); await p.waitForTimeout(400);
  ok(await p.evaluate(() => document.querySelectorAll('#rv-list .prob').length >= 1), 'mistakes queue lists the missed problem');
  // exam
  await p.evaluate(() => location.hash = 'exam'); await p.waitForTimeout(300);
  await p.click('#ex-all'); await p.click('#ex-start'); await p.waitForTimeout(300);
  ok(await p.evaluate(() => document.querySelectorAll('#ex-list .prob').length > 0), 'exam set built');
  await p.click('#ex-submit'); await p.waitForTimeout(300);
  ok(await p.evaluate(() => !document.querySelector('#ex-result').hidden), 'exam graded');
  // quizzes and done flag
  await p.evaluate(() => location.hash = 'transport'); await p.waitForTimeout(500);
  await p.evaluate(() => { const q = document.querySelectorAll('#v-transport .quiz'); q.forEach(z => z.querySelectorAll('.opts button')[+z.dataset.correct].click()); }); await p.waitForTimeout(300);
  ok(await p.evaluate(() => JSON.parse(localStorage.getItem('bio-done') || '{}').transport === 1), 'right quiz answers mark the module done');
  await p.evaluate(() => { const b = document.querySelector('#v-transport [data-next]'); b.click(); b.click(); });
  ok(await p.evaluate(() => document.querySelectorAll('#v-transport .exsteps li:not([hidden])').length === 2), 'worked example reveals one step per click');
  // the lab responds to a Set-it-up button and the zoom slider
  await p.evaluate(() => document.querySelector('#v-transport [data-show]').click()); await p.waitForTimeout(300);
  ok(await p.evaluate(() => /left|right|balanced|water/.test(document.querySelector('#tr-state').textContent)), 'Set it up for me drives the membrane lab');
  // countdown
  ok((await p.textContent('#ap-count')).includes('May 3, 2027'), 'countdown shows the AP Biology exam date');
  // theme + search + drawer + report
  await p.click('#theme-btn'); ok(await p.evaluate(() => document.documentElement.getAttribute('data-theme') === 'light'), 'theme button cycles');
  await p.keyboard.press('/'); await p.waitForTimeout(300); await p.keyboard.type('osmosis'); await p.waitForTimeout(200);
  ok(await p.evaluate(() => document.querySelectorAll('#cmd-list li[data-id]').length >= 1), 'search finds osmosis'); await p.keyboard.press('Escape'); await p.waitForTimeout(400);
  await p.click('#fs-btn'); await p.click('#fs-tabs [data-tab=gc]');
  ok((await p.textContent('#fs-gc')).includes('AUG'), 'reference drawer shows the genetic code');
  await p.click('#fs-close'); await p.waitForTimeout(400);
  await p.evaluate(() => document.querySelector('[data-report="transport"]').click()); await p.waitForTimeout(300);
  ok(await p.evaluate(() => document.getElementById('rp').open), 'report dialog opens');
  console.log(bad ? bad + ' failure(s)' : 'all flows passed'); await b.close(); process.exit(bad ? 1 : 0);
})();
