"""Module page generator (Biology Lab): python3 tools/mk.py  (imports every tools/units/*.py, each defines modules with mod(...))
Writes src/modules/<id>.html. The module's JS (src/modules/<id>.js) is written by hand.
Keeps all modules structurally identical: idea, assumption upgrade, equations, labs, try this, worked example,
common mistakes, explanation, quizzes. BC-only modules and BC extension boxes are marked."""
import pathlib, json, html as H

ROOT = pathlib.Path(__file__).resolve().parent.parent
GROUPS = json.loads((ROOT / 'src/groups.json').read_text())
MODS = json.loads((ROOT / 'src/mods.json').read_text())
GOF = {i: g for g in GROUPS for i in g['ids']}

def esc(s): return H.escape(s, quote=True)

def lab(id, title, canvas=None, aria='', ctl=(), out=(), pre='', post='', own=False, seg=None, canvas2=None):
    """ctl: (id,label,min,max,step,value) sliders; out: (id,label,cls); seg: (id,label,[(key,text)])"""
    s = f'      <div class="lab" id="{id}"{" data-reset=\"own\"" if own else ""}>\n        <div class="labbar"><span class="title">{title}</span></div>\n'
    if seg:
        sid, lbl, items = seg
        s += f'        <div class="ctl"><span class="lbl">{lbl}</span><div class="seg" id="{sid}" role="group" aria-label="{lbl}">' + ''.join(
            f'<button type="button" data-k="{k}" aria-pressed="{"true" if i == 0 else "false"}">{t}</button>' for i, (k, t) in enumerate(items)) + '</div></div>\n'
    if pre: s += '        ' + pre + '\n'
    if canvas: s += f'        <canvas id="{canvas}" aria-label="{esc(aria)}"></canvas>\n'
    if canvas2: s += f'        <canvas id="{canvas2[0]}" aria-label="{esc(canvas2[1])}"></canvas>\n'
    if ctl:
        s += '        <div class="controls">' + ''.join(
            f'<div class="ctl"><label for="{i}"><span>{l}</span> <output id="{i}-out"></output></label><input type="range" id="{i}" min="{a}" max="{b}" step="{st}" value="{v}"></div>' for i, l, a, b, st, v in ctl) + '</div>\n'
    if out:
        s += '        <div class="readout">' + ''.join(f'<div><span>{l}</span><strong class="{c}" id="{i}">—</strong></div>' for i, l, c in out) + '</div>\n'
    if post: s += '        ' + post + '\n'
    return s + '      </div>\n'

def stagelab(id, title, canvas, aria, p, n, pre_extra='', out_extra=()):
    """A lab that steps through n stages of a process (buttons, slider, optional autoplay)."""
    pre = '<div class="row"><button type="button" class="btn" id="%s-prev">Previous</button><button type="button" class="btn primary" id="%s-next">Next stage</button><button type="button" class="btn" id="%s-play">Play</button></div>' % (p, p, p) + pre_extra
    return lab(id, title, canvas=canvas, aria=aria, pre=pre, ctl=[(p + '-st', 'Stage', 0, n - 1, 1, 0)],
               out=[(p + '-name', 'stage', 'x'), (p + '-txt', 'what is happening', '')] + list(out_extra))

def show(*acts):
    return json.dumps(list(acts), ensure_ascii=False).replace("'", '&#39;')

def mod(id, title, lede, idea, up, eqs, labs, tries, ex, oops, prose=None, quizzes=(), bcx=None, extra_after_labs=''):
    g = GOF[id]; bc = g.get('bc', False)
    tag = g['tag']; course = ''
    cls = ' class="view bc"' if False else ''
    s = f'  <section class="view{" bc" if bc else ""}" id="v-{id}" hidden>\n    <div class="wrap">\n      <div class="head">\n        <div class="eyebrow"><span class="tag {"ap" if tag.startswith("AP") else "na"}">{tag}</span>{('<span class="tag">'+course+'</span>') if course else ''}</div>\n        <h1>{title}</h1>\n        <p class="lede">{lede}</p>\n      </div>\n'
    s += '      <div class="intuit"><b class="k">The idea</b>\n' + ''.join(f'        <p>{p}</p>\n' for p in idea) + '      </div>\n'
    b, n, w, nd = up
    s += f'      <div class="assume upgrade"><h3>Assumption upgrade</h3><dl><dt>Before</dt><dd>{b}</dd><dt>So we didn\'t need</dt><dd>{n}</dd><dt>Now</dt><dd>{w}</dd><dt>So we need</dt><dd>{nd}</dd></dl></div>\n'
    s += '      <div class="eqgrid">' + ''.join(f'<div class="eqn"><span>{m}</span><small>{sm}</small></div>' for m, sm in eqs) + '</div>\n'
    s += ''.join(labs) + extra_after_labs
    if bcx: s += f'      <div class="bcx"><b>BC extension</b>{bcx}</div>\n'
    s += '      <div class="try"><h3>Try this</h3><p class="small" style="margin:0">Predict what will happen first. Then set it up and check.</p><ol>\n'
    for q, sh, a in tries:
        btn = f' <button type="button" class="btn link" data-show=\'{sh}\'>Set it up for me</button>' if sh else ''
        s += f'        <li><p>{q}{btn}</p><details><summary>What you should see</summary><p>{a}</p></details></li>\n'
    s += '      </ol></div>\n'
    pr, steps = ex
    s += f'      <div class="example"><h3>Worked example</h3><p class="prob">{pr}</p><p class="small" style="margin:0">Try it yourself first, then reveal one step at a time.</p>\n        <div class="exbody"><ol class="exsteps">\n' + ''.join(f'          <li hidden>{t}</li>\n' for t in steps) + f'        </ol><div class="row"><button type="button" class="btn primary" data-next>Show step 1 of {len(steps)}</button><button type="button" class="btn" data-all>Show all steps</button></div></div>\n      </div>\n'
    s += '      <div class="oops"><h3>Common mistakes</h3><ul>\n' + ''.join(f'        <li>{o}</li>\n' for o in oops) + '      </ul></div>\n'
    if prose:
        h2, ps = prose
        s += f'      <div class="prose"><h2>{h2}</h2>\n' + ''.join(f'        <p>{p}</p>\n' for p in ps) + '      </div>\n'
    for q, opts, c, ex_ in quizzes:
        s += f'      <div class="quiz" data-correct="{c}" data-explain="{esc(ex_)}">\n        <p class="q">Check yourself: {q}</p>\n        <div class="opts">' + ''.join(f'<button type="button">{o}</button>' for o in opts) + '</div>\n        <p class="fb" aria-live="polite"></p>\n      </div>\n'
    s += '    </div>\n  </section>\n'
    (ROOT / 'src/modules' / f'{id}.html').write_text(s, encoding='utf-8')

if __name__ == '__main__':
    import importlib.util, sys
    sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
    for p in sorted((pathlib.Path(__file__).resolve().parent / 'units').glob('*.py')):
        spec = importlib.util.spec_from_file_location(p.stem, p); m = importlib.util.module_from_spec(spec)
        m.__dict__.update({'mod': mod, 'lab': lab, 'show': show, 'stagelab': stagelab}); spec.loader.exec_module(m)
        print('ran', p.name)
