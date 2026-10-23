
/* ---------------- Overview: particles crossing a membrane ---------------- */
(function hero(){
  const cv=$('#hero-canvas'),seg=$('#hero-fn'),cap=$('#hero-cap');if(!cv)return;
  const MEM=[['open','Wide pores',.9,'With wide pores, solute moves both ways and the two sides even out: net movement is always from high to low concentration.'],['small','Small pores',.25,'Smaller pores slow the exchange, but the end state is the same: equal concentration on both sides.'],['none','No pores',0,'With no way through, nothing crosses. A selectively permeable membrane lets some things in and keeps others out.']];
  let cur=0,N=70,ps=[];
  const reset=()=>{ps=Array.from({length:N},()=>({x:Math.random()*.46,y:Math.random(),vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5}));};reset();
  seg.innerHTML=MEM.map(([k,l],i)=>`<button type="button" data-k="${i}" aria-pressed="${i===0}">${l}</button>`).join('');
  const say=()=>{cap.textContent=MEM[cur][3];};say();
  const sim=sim2d(cv,{h:w=>clamp(w*.6,240,330),step(dt){const q=MEM[cur][2];ps.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx+=(Math.random()-.5)*dt*3;p.vy+=(Math.random()-.5)*dt*3;p.vx=clamp(p.vx,-.6,.6);p.vy=clamp(p.vy,-.6,.6);
      if(p.y<0){p.y=0;p.vy=Math.abs(p.vy);}if(p.y>1){p.y=1;p.vy=-Math.abs(p.vy);}if(p.x<0){p.x=0;p.vx=Math.abs(p.vx);}if(p.x>1){p.x=1;p.vx=-Math.abs(p.vx);}
      if(p.x>.48&&p.x<.52){const poreY=(Math.floor(p.y*6)%2===0);if(!(poreY&&Math.random()<q)){p.x=p.vx>0?.48:.52;p.vx=-p.vx;}}});},
    draw(ctx,w,h){const pad=14,bw=w-2*pad,bh=h-2*pad;ctx.fillStyle=alpha(T.cx,.07);ctx.fillRect(pad,pad,bw,bh);ctx.strokeStyle=T.line;ctx.lineWidth=1.5;ctx.strokeRect(pad+.5,pad+.5,bw,bh);
      ctx.fillStyle=T.muted;for(let i=0;i<6;i++){if(i%2===0){continue;}ctx.fillRect(pad+bw*.5-2,pad+bh*i/6,4,bh/6);}
      let L=0;ps.forEach(p=>{if(p.x<.5)L++;ctx.beginPath();ctx.arc(pad+p.x*bw,pad+p.y*bh,4.2,0,6.283);ctx.fillStyle=p.x<.5?T.cx:T.ca;ctx.fill();});
      label(ctx,`left ${L}`,pad+10,pad+14,T.cx,'left','middle',MONO);label(ctx,`right ${N-L}`,w-pad-10,pad+14,T.ca,'right','middle',MONO);label(ctx,'membrane',pad+bw/2,h-4,T.muted,'center','middle',MONO);}});
  segBind('hero-fn','k',k=>{cur=+k;reset();say();sim.render();});
  drawers.overview=()=>sim.render();
})();

function renderMods(){const solved=store('bio-solved')||{};const cnt={};let k=0;PROBS.forEach(p=>{const c=cnt[p.topic]=cnt[p.topic]||[0,0];c[1]++;if(solved[p.id])c[0]++;});
  $('#modgrid').innerHTML=ROADMAP.map(g=>`<div class="modgroup${g.bc?' bc':''}"><div class="eyebrow">${g.w}${g.bc?' <span class="bcbadge">BC</span>':''}</div><h3 class="gtitle">${g.name}</h3><div class="modgrid-inner">${g.ids.map(id=>{const m=MODS[id],c=cnt[id]||[0,0];
    return `<a class="mod" href="#${id}" style="--i:${Math.min(k++,14)}">${GLYPH[id]?`<span class="glyph" aria-hidden="true"><svg viewBox="0 0 24 24">${GLYPH[id]}</svg></span>`:''}<h3>${m.t}</h3><p>${m.d}</p><div class="row"><span class="tag ${apTag(id)}">${m.ap}</span><span class="prog">${c[1]?`${c[0]}/${c[1]} solved`:''}</span></div></a>`;}).join('')}${g.soon.map(id=>{const m=MODS[id];
    return `<div class="mod soon" aria-disabled="true"><h3>${m.t}</h3><p>${m.d}</p><div class="row"><span class="tag na">Coming soon</span></div></div>`;}).join('')}</div></div>`).join('');}
(function ovStatic(){
  const first=GROUPS.length?GROUPS[0].ids[0]:null,st=$('#ov-start');if(first&&st){st.href='#'+first;st.textContent='Start with '+MODS[first].t;}
  $('#ov-map').innerHTML=ROADMAP.map(g=>`<tr${g.bc?' class="bc"':''}><td>${g.w==='Optional'?'—':g.w==='BC'?'BC':g.w.replace('Unit ','')}</td><td>${g.name}</td><td>${g.ids.map(id=>`<a href="#${id}">${MODS[id].t}</a>`).concat(g.soon.map(id=>`<span class="small">${MODS[id].t} (soon)</span>`)).join(', ')}</td></tr>`).join('');
})();

/* ---------------- Side menu: one link per module, grouped by unit, then the review pages ---------------- */
(function buildNav(){let nh='<a href="#overview" data-view="overview">Overview</a>',sh='<option value="overview">Overview</option>';
  let bcStart=false;
  GROUPS.forEach(g=>{const lab=g.w==='Optional'||g.w==='BC'?g.name:`${g.w} · ${g.name}`;
    if(g.bc&&!bcStart){bcStart=true;nh+='<div class="bcdiv bc">BC only</div>';sh+='<option disabled class="bc">── BC only ──</option>';}
    nh+=`<div class="grp${g.bc?' bc':''}">${lab}</div>`;sh+=`<optgroup label="${lab}"${g.bc?' class="bc"':''}>`;
    g.ids.forEach(id=>{nh+=`<a href="#${id}" data-view="${id}"${g.bc?' class="bc"':''}>${MODS[id].t}${g.bc?'<span class="bcbadge">BC</span>':''}</a>`;sh+=`<option value="${id}">${MODS[id].t}${g.bc?' (BC)':''}</option>`;});sh+='</optgroup>';});
  const REV=[['practice','Practice set'],['methods','Which tool?'],['exam','Exam review'],['review','Review my mistakes'],['frq','FRQ practice']];
  nh+='<div class="grp">Review</div>'+REV.map(([v,t])=>`<a href="#${v}" data-view="${v}">${t}</a>`).join('');
  sh+='<optgroup label="Review">'+REV.map(([v,t])=>`<option value="${v}">${t}</option>`).join('')+'</optgroup>';
  $('#nav').innerHTML=nh;const sel=$('#navsel');sel.innerHTML=sh;sel.addEventListener('change',()=>{location.hash=sel.value;});})();
