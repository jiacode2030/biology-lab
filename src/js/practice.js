
/* ---------------- Problem cards: used by the practice set, exam review and the mistakes queue ---------------- */
function probCard(p,o={}){
  const mode=o.mode||'practice',exam=mode==='exam',d=p.gen(),uid='q'+Math.random().toString(36).slice(2,9),el=document.createElement('article');
  const solvedMap=store('bio-solved')||{};
  el.className='prob'+(isBC(p)?' bc':'')+(mode==='practice'&&solvedMap[p.id]?' solved':'');el.pid=p.id;el.dataset.topic=p.topic;if(mode==='practice')el.id='prob-'+p.id;
  el.rpCtx={pid:p.id,title:p.title,ans:d.choices?d.choices[d.ans]:d.ans,unit:d.unit||'',exam};
  const ch=d.choices;let sel=-1;
  const input=ch?`<div class="sopts" role="group" aria-label="Choices">${ch.map((c,i)=>`<button type="button" data-i="${i}">${c}</button>`).join('')}</div>`
    :`<form class="ans"><label class="small" for="${uid}">Answer</label><input type="text" inputmode="text" id="${uid}" autocomplete="off" spellcheck="false"><span class="unit">${d.unit||''}</span>${exam?'':'<button type="submit" class="btn primary">Check</button>'}</form>`;
  el.innerHTML=`<header><span class="tag">${MODS[p.topic].t}</span>${o.badge||`<span class="tag ${apTag(p.topic)}">${MODS[p.topic].ap}</span>`}${isBC(p)?'<span class="bcbadge" style="margin:0">BC</span>':''}<span class="done">${mode==='practice'&&solvedMap[p.id]?'Solved':''}</span></header>
    <h3>${p.title}</h3><p class="q">${d.q}</p>${d.fig?`<div class="pfig">${d.fig}</div>`:''}${input}
    <p class="fb" aria-live="polite"></p>
    <div class="row">${exam?'':'<button type="button" class="btn link" data-act="hint">Hint</button>'}<button type="button" class="btn link" data-act="sol"${exam?' hidden':''}>Show solution</button>${mode==='practice'?'<button type="button" class="btn link" data-act="new">New numbers</button>':''}<button type="button" class="btn link rp-link" data-report="${p.topic}" style="margin-left:auto">Report this problem</button></div>
    <div class="box" data-box="hint" hidden><p>${d.hint}</p></div><div class="box" data-box="sol" hidden><p>${d.sol}</p></div>`;
  const fb=$('.fb',el),inp=$('input',el);
  const ansText=ch?ch[d.ans]:d.expr?pretty(d.expr)+(d.c?' + C':''):`${d.show||fmt(d.ans,3)}${d.unit?' '+d.unit:''}`;
  function evaluate(){if(ch)return {blank:sel<0,ok:sel===d.ans};if(d.expr){const s=inp.value.replace(/\+\s*C\s*$/i,'').trim();if(!s)return {blank:true,ok:false};try{parseExpr(s);}catch(e){return {blank:true,ok:false};}return {blank:false,ok:sameFn(s,d.expr,{c:d.c})};}const x=parseNum(inp.value);if(!isFinite(x))return {blank:true,ok:false};
    return {blank:false,ok:ansOK(x,d),flip:!ansOK(x,d)&&ansOK(-x,d)};}
  function lock(){if(inp)inp.disabled=true;$$('.sopts button',el).forEach(b=>b.disabled=true);const s=$('button[type=submit]',el);if(s)s.disabled=true;}
  el.grade=()=>{const r=evaluate();fb.className='fb '+(r.ok?'ok':'no');fb.textContent=r.ok?`Correct: ${ansText}.`:`${r.blank?'No answer.':'Not quite.'} The answer is ${ansText}.`;lock();$('[data-act=sol]',el).hidden=false;return r.ok;};
  function right(){fb.className='fb ok';fb.textContent=`Correct: ${ansText}.`;lock();if(mode==='practice'){const s=store('bio-solved')||{};s[p.id]=1;store('bio-solved',s);el.classList.add('solved');$('.done',el).textContent='Solved';o.onSolved&&o.onSolved();}o.onRight&&o.onRight(el);}
  function wrong(r){fb.className='fb no';fb.textContent=(r.flip?'Check your sign. ':'Not yet. Try the hint, or check your algebra and your rounding (three decimal places unless told otherwise). ')+(mode==='practice'?'(Added to Review my mistakes.)':'');if(mode==='practice')reviewMiss(p.id);o.onWrong&&o.onWrong(el);}
  if(ch){$$('.sopts button',el).forEach(b=>b.addEventListener('click',()=>{sel=+b.dataset.i;$$('.sopts button',el).forEach(x=>x.classList.toggle('picked',x===b));
      if(exam)return;const r=evaluate();b.classList.add(r.ok?'right':'wrong');if(r.ok)right();else{wrong(r);b.disabled=true;}}));}
  else $('form',el).addEventListener('submit',e=>{e.preventDefault();if(exam)return;const r=evaluate();if(r.blank){fb.className='fb no';fb.textContent=d.expr?'Type an expression like 3x^2 + 2x, sin(x) or e^(2x). Use ^ for powers and * or a space for times.':'Enter a number or exact value (like 0.25, 3/4, 2pi, ln(2) or sqrt(3)/2), without units.';return;}r.ok?right():wrong(r);});
  $$('[data-act]',el).forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.act;if(a==='new'){el.replaceWith(o.again?o.again():probCard(p,o));return;}
    const bx=$(`[data-box="${a}"]`,el);bx.hidden=!bx.hidden;if(a==='sol')b.textContent=bx.hidden?'Show solution':'Hide solution';}));
  return el;}

/* ---------------- Practice set ---------------- */
(function practice(){
  const list=$('#pr-list');if(!list)return;let filter='all';const inGroup=(f,tp)=>f==='all'||GROUPS[+f].ids.includes(tp);
  const vis=()=>PROBS.filter(p=>!(COURSE()==='AB'&&isBC(p)));
  function score(){const s=store('bio-solved')||{};const V=vis(),n=V.filter(p=>s[p.id]).length;setText('pr-score',`${n} of ${V.length} solved`);const m=$('#pr-meter');if(m)m.style.width=(V.length?100*n/V.length:0)+'%';renderMods();}
  document.addEventListener('coursechange',score);
  function card(p){const el=probCard(p,{mode:'practice',onSolved:score,again:()=>card(p)});el.hidden=!inGroup(filter,p.topic);return el;}
  PROBS.forEach(p=>list.appendChild(card(p)));
  $('#pr-filter').innerHTML='<button type="button" data-f="all" aria-pressed="true">All</button>'+GROUPS.map((g,i)=>`<button type="button" data-f="${i}" aria-pressed="false">${g.w==='Optional'?'Math':g.w==='BC'?'BC':g.w.replace('Unit ','U')}</button>`).join('');
  $$('#pr-filter button').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.f;$$('#pr-filter button').forEach(x=>x.setAttribute('aria-pressed',x===b));$$('.prob',list).forEach(el=>el.hidden=!inGroup(filter,el.dataset.topic));}));
  setText('pr-count',vis().length);document.addEventListener('coursechange',()=>setText('pr-count',vis().length));
  $('#pr-reset').addEventListener('click',()=>{store('bio-solved',{});$$('.prob',list).forEach(el=>{el.classList.remove('solved');$('.done',el).textContent='';});score();});
  score();
})();

/* ---------------- "Which tool?" trainer ---------------- */
(function methods(){const tb=$('#mt-table'),host=$('#mt-items');if(!tb)return;
  tb.innerHTML=METHODS.clues.map(([c,t,bc])=>`<tr${bc?' class="bc"':''}><td>${c}${bc?' <span class="bcbadge">BC</span>':''}</td><td>${t}</td></tr>`).join('');
  host.innerHTML=METHODS.items.map((it,i)=>`<div class="mitem${it.bc?' bc':''}" data-correct="${it.correct}" data-opts="${JSON.stringify(it.opts).replace(/"/g,'&quot;')}" data-explain="${it.explain.replace(/"/g,'&quot;')}"${it.miss?` data-miss="${it.miss.replace(/"/g,'&quot;')}"`:''}><p>${i+1}. ${it.q}</p><div class="sopts"></div><p class="fb" aria-live="polite"></p></div>`).join('');
  if(!METHODS.items.length){$('#v-methods .tablewrap').hidden=true;$('#v-methods .sorter').hidden=true;$('#v-methods .wrap').insertAdjacentHTML('beforeend','<div class="note"><b>Coming with the rest of the modules</b>The clue table and the picking practice are built from every unit, so they appear as modules are added.</div>');return;}
  const items=$$('.mitem');if(!items.length)return;let right=0;const nv=()=>items.filter(i=>!(COURSE()==='AB'&&i.classList.contains('bc'))).length;const sc=()=>setText('mt-score',`${right} of ${nv()} right so far.`);document.addEventListener('coursechange',sc);
  items.forEach(it=>{const box=$('.sopts',it),fb=$('.fb',it),c=+it.dataset.correct,opts=JSON.parse(it.dataset.opts);let done=false;
    opts.forEach((o,i)=>{const b=document.createElement('button');b.type='button';b.textContent=o;b.addEventListener('click',()=>{$$('button',box).forEach(x=>x.classList.remove('right','wrong'));
      if(i===c){b.classList.add('right');fb.textContent='Yes. '+it.dataset.explain;if(!done){done=true;right++;sc();}}else{b.classList.add('wrong');fb.textContent=it.dataset.miss||'Not the best first tool. What is the question asking for, and what is it giving you?';}});box.appendChild(b);});});sc();})();

/* ---------------- FRQ practice: scoring guides with point-by-point checkboxes ---------------- */
(function frqs(){
  const host=$('#frq-list');if(!host)return;const saved=store('bio-frq')||{};
  if(!FRQS.length){host.innerHTML='<div class="note"><b>Coming with the rest of the modules</b>Original free-response questions are written unit by unit, so they appear as modules are added.</div>';$('#frq-reset').hidden=true;return;}
  host.innerHTML=FRQS.map(q=>{const total=q.parts.reduce((a,p)=>a+p.points.length,0);
    return `<article class="frq${q.bc?' bc':''}" id="${q.id}" data-total="${total}"><div class="fh"><div class="row"><span class="tag ap">${q.kind==='long'?'Long question':'Short question'}</span><span class="tag">${q.units}</span>${q.bc?'<span class="bcbadge" style="margin:0">BC</span>':''}</div><span class="score" id="${q.id}-score">0 / ${total}</span></div>
      <h3>${q.title}</h3><div class="stem">${q.stem}</div>
      ${q.parts.map((p,i)=>`<div class="part"><p><b>${p.label}</b> ${p.q}</p>
        <details><summary>Show the scoring guide</summary><div class="rub">${p.points.map((t,k)=>`<label class="pt"><input type="checkbox" data-frq id="${q.id}-${i}-${k}"><span>${t}</span></label>`).join('')}<div class="sol">${p.answer}</div></div></details></div>`).join('')}</article>`;}).join('');
  const boxes=$$('input[data-frq]',host);
  boxes.forEach(b=>{b.checked=!!saved[b.id];b.addEventListener('change',()=>{const s2=store('bio-frq')||{};s2[b.id]=b.checked;store('bio-frq',s2);tally();});});
  function tally(){let all=0,max=0;$$('.frq',host).filter(q=>!(COURSE()==='AB'&&q.classList.contains('bc'))).forEach(q=>{const n=$$('input[data-frq]',q).filter(b=>b.checked).length,t=+q.dataset.total;all+=n;max+=t;setText(q.id+'-score',`${n} / ${t}`);});
    setText('frq-total',`${all} of ${max} points`);const m=$('#frq-meter');if(m)m.style.width=(max?100*all/max:0)+'%';}
  document.addEventListener('coursechange',tally);$('#frq-reset').addEventListener('click',()=>{boxes.forEach(b=>b.checked=false);store('bio-frq',{});tally();});
  tally();
})();
