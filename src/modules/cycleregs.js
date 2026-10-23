/* ---------------- Cell cycle control & cancer ---------------- */
(function cycleregs(){
  const cv=$('#cr-canvas');if(!cv)return;
  let gf='on',dmg=false,p53=true,spin=true;
  function outcome(){if(gf==='off')return {stop:0,r:'stops at the G₁ checkpoint (enters G₀)',w:'no growth factor: the cell does not get the signal to divide'};
    if(dmg)return p53?{stop:0,r:'stops at the checkpoint: repair or apoptosis',w:'p53 detects the damage, halts the cycle and triggers repair; severe damage leads to apoptosis'}:{stop:-1,r:'passes the checkpoint and divides with damaged DNA',w:'without working p53 the damage is not detected, so mutations are passed on (a step toward cancer)'};
    if(!spin)return {stop:2,r:'stops at the M (spindle) checkpoint',w:'chromosomes are not all attached to the spindle, so anaphase is blocked'};
    return {stop:-1,r:'passes all checkpoints and divides normally',w:'conditions are right: growth signal present, DNA intact, spindle attached'};}
  const GATES=[{a:20,nm:'G₁'},{a:200,nm:'G₂'},{a:250,nm:'M'}];
  const sim=sim2d(cv,{h:w=>clamp(w*.44,240,310),draw(ctx,w,h,t){const cx=w/2,cy=h/2,R=Math.min(h*.36,w*.22),o=outcome(),rad=a=>(a-90)*Math.PI/180;
    [[-70,20,'G₁',T.cx],[20,130,'S',T.ce],[130,200,'G₂',T.cv],[200,290,'M',T.ca]].forEach(([a0,a1,nm,col])=>{ctx.beginPath();ctx.arc(cx,cy,R,rad(a0+90-90+0),rad(a1));ctx.strokeStyle=col;ctx.lineWidth=14;ctx.stroke();const m=(a0+a1)/2;label(ctx,nm,cx+Math.cos(rad(m))*(R+28),cy+Math.sin(rad(m))*(R+28),T.ink,'center','middle',MONO);});
    GATES.forEach((g,k)=>{const x=cx+Math.cos(rad(g.a))*R,y=cy+Math.sin(rad(g.a))*R,blocked=(o.stop===0&&(k===0))||(o.stop===2&&k===2);ctx.fillStyle=blocked?T.bad:T.good;ctx.beginPath();ctx.arc(x,y,9,0,6.283);ctx.fill();ctx.strokeStyle=T.surface;ctx.lineWidth=2;ctx.stroke();label(ctx,blocked?'✕':'✓',x,y,T.surface,'center','middle',MONO);});
    let a;if(o.stop===0)a=20-8;else if(o.stop===2)a=250-8;else a=(t*50)%360-70;const x=cx+Math.cos(rad(a))*R,y=cy+Math.sin(rad(a))*R;dot2(ctx,x,y,T.accent,8);
    if(!p53)label(ctx,'p53 mutated',cx,cy-6,T.bad,'center','middle',MONO);if(dmg)label(ctx,'DNA damage',cx,cy+10,T.bad,'center','middle',MONO);
    label(ctx,'green = checkpoint passed, red = blocked',w/2,h-8,T.muted,'center','middle',MONO);}});
  function upd(){const o=outcome();setText('cr-res',o.r);setText('cr-why',o.w);sim.render();}
  function tog(id,f,txtFn){const b=$('#'+id);b.addEventListener('click',()=>{f();b.setAttribute('aria-pressed',String(b.getAttribute('aria-pressed')!=='true'));b.textContent=txtFn();upd();});}
  segBind('cr-gf','k',v=>{gf=v;upd();});
  tog('cr-dmg',()=>{dmg=!dmg;},()=>'DNA damage: '+(dmg?'yes':'no'));tog('cr-p53',()=>{p53=!p53;},()=>'p53: '+(p53?'working':'mutated'));tog('cr-spin',()=>{spin=!spin;},()=>'Spindle attached: '+(spin?'yes':'no'));
  $('#cr-lab').addEventListener('labreset',()=>{gf='on';dmg=false;p53=true;spin=true;segSet('cr-gf',0);$('#cr-dmg').textContent='DNA damage: no';$('#cr-dmg').setAttribute('aria-pressed','false');$('#cr-p53').textContent='p53: working';$('#cr-p53').setAttribute('aria-pressed','true');$('#cr-spin').textContent='Spindle attached: yes';$('#cr-spin').setAttribute('aria-pressed','true');upd();});upd();
  let dt=24,days=14;
  const N=(d,t0)=>Math.pow(2,d*24/t0);
  const sim2=sim2d($('#cr-canvas2'),{h:w=>clamp(w*.42,210,270),draw(ctx,w,h){const A=axes2(ctx,w,h,{x0:0,x1:30,y0:0,y1:18,xt:5,yt:3,xl:'days',yl:'log₁₀ (cells)',L:44});ctx.setLineDash([5,4]);ctx.strokeStyle=T.muted;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(A.X(0),A.Y(0));ctx.lineTo(A.X(30),A.Y(0));ctx.stroke();ctx.setLineDash([]);label(ctx,'no division',A.R-4,A.Y(0)-8,T.muted,'right','middle',MONO);
      curve2(ctx,A,d=>Math.log10(N(d,dt)),0,30,T.ca);dot2(ctx,A.X(days),A.Y(Math.log10(N(days,dt))),T.accent,6);}});
  function upd2(){const n=N(days,dt);setText('cr-n',fmt(n,0));setText('cr-x',fmt(days*24/dt,1)+' doublings');sim2.render();}
  bindRange('cr-dt',v=>v+' h',v=>{dt=v;upd2();});bindRange('cr-days',v=>String(v),v=>{days=v;upd2();});
  $('#cr-lab2').addEventListener('labreset',()=>{dt=24;days=14;setCtl('cr-dt',24,v=>v+' h');setCtl('cr-days',14);upd2();});upd2();
  drawers.cycleregs=()=>{sim.render();sim2.render();};
  KEYS['cr-canvas']=['Colored arcs are the phases. Circles are the three checkpoints. The orange dot is the cell.',[['cx','G₁'],['ce','S'],['cv','G₂'],['ca','M'],['good','checkpoint passed'],['bad','checkpoint blocked']]];
  KEYS['cr-canvas2']=['Pink: a population starting from one cell that keeps dividing (log scale). Dashed: one cell that does not divide.',[['ca','dividing cells']]];
  TIPS['cr-p53']=()=>'p53 is a tumor suppressor: it stops cells with damaged DNA.';
  GLOSS['checkpoint']='A point in the cell cycle where the cell checks conditions before continuing.';GLOSS['cyclin']='A protein whose level rises and falls and activates CDKs.';GLOSS['cdk']='Cyclin-dependent kinase: an enzyme active only when bound to a cyclin, driving the cell cycle.';GLOSS['p53']='A tumor suppressor protein that halts the cell cycle after DNA damage.';GLOSS['apoptosis']='Programmed cell death.';GLOSS['oncogene']='A mutated, overactive version of a proto-oncogene that promotes division.';GLOSS['tumor suppressor']='A gene whose product restrains cell division. Loss of function removes a brake.';
  TT.cycleregs='Ask students to assign each mutation to "stuck accelerator" or "broken brake".';
})();
(function(){
  PROBS.push({id:'cr-dbl',topic:'cycleregs',title:'Doubling cells',gen(){const [t,d]=pick([[12,2],[12,3],[24,2],[24,4],[24,6],[24,8],[48,4],[48,6],[36,3],[36,6]]),k=d*24/t;const n0=pick([1,2,5]),ans=n0*Math.pow(2,k);return {q:`A cell population starts with ${n0} cell${n0>1?'s':''} and doubles every ${t} hours with no cell death. How many cells are there after ${d} days?`,ans,unit:'cells',tol:0,chk:n0*Math.pow(2,d*24/t),hint:'Number of doublings = time / doubling time. Cells = start × 2^doublings.',sol:`Doublings = ${d*24}/${t} = ${k}. Cells = ${n0} × 2<sup>${k}</sup> = <b>${fmt(ans,0)}</b>.`};}});
  const q=[['A mutation inactivates p53 in a cell with damaged DNA. The most likely result is','the cell divides with damaged DNA',['the cell stops at the G₁ checkpoint','the cell dies by apoptosis','the cell repairs its DNA faster']],['A mutated gene that is always "on" and promotes division is called a(n)','oncogene',['tumor suppressor gene','checkpoint','proto-oncogene']],['A gene whose normal product restrains the cell cycle is a','tumor suppressor gene',['proto-oncogene','oncogene','cyclin only']],['The M (spindle) checkpoint ensures that','all chromosomes are attached to spindle fibers before anaphase',['DNA is replicated accurately','the cell has grown enough','growth factor is present']],['A CDK is active only when it is bound to','a cyclin',['p53','ATP only','DNA']]];
  PROBS.push({id:'cr-fact',topic:'cycleregs',title:'Cycle control facts',gen(){const p=pick(q),m=mcq(p[1],p[2]);return {q:p[0],choices:m.choices,ans:m.ans,hint:'Name the checkpoint or gene type first.',sol:`<b>${p[1]}</b>.`};}});
})();
