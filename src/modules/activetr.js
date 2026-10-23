/* ---------------- Active transport & bulk transport ---------------- */
(function activetr(){
  const cv=$('#at-canvas');if(!cv)return;
  const ST=[{n:'1 · sodium binds',t:'Three Na⁺ ions from inside the cell bind to the pump, which is open to the cytoplasm.',s:'inside'},{n:'2 · ATP phosphorylates the pump',t:'ATP transfers a phosphate to the pump (ATP → ADP).',s:'inside'},{n:'3 · shape change, Na⁺ released',t:'The phosphate changes the pump\'s shape. It opens outward and releases 3 Na⁺ outside.',s:'outside'},{n:'4 · potassium binds',t:'Two K⁺ ions from outside bind to the pump.',s:'outside'},{n:'5 · phosphate released',t:'The phosphate leaves, and the pump returns to its original shape, opening inward.',s:'inside'},{n:'6 · potassium released',t:'The two K⁺ ions are released inside the cell. The pump is ready to cycle again.',s:'inside'}];
  function ion(ctx,x,y,txt,col){dot2(ctx,x,y,col,8);label(ctx,txt,x,y,T.surface,'center','middle','700 9px '+MONO.split(' ').slice(1).join(' '));}
  const sc=stageLab('np','at-canvas',ST,(ctx,w,h,i)=>{const cy=h*.5,cx=w/2,tl=34;
    ctx.fillStyle=alpha(T.ce,.3);ctx.fillRect(6,cy-tl*.6,w-12,tl*1.2);ctx.strokeStyle=T.ce;ctx.lineWidth=2;ctx.strokeRect(6,cy-tl*.6,w-12,tl*1.2);
    label(ctx,'outside (high Na⁺, low K⁺)',12,12,T.muted,'left','middle',MONO);label(ctx,'inside (low Na⁺, high K⁺)',12,h-10,T.muted,'left','middle',MONO);
    for(let k=0;k<5;k++){ion(ctx,w*.1+k*w*.05+(k%2)*8,h*.22+(k%3)*10,'Na⁺',T.cx);}for(let k=0;k<5;k++){ion(ctx,w*.7+k*w*.05+(k%2)*8,h*.78-(k%3)*10,'K⁺',T.ce);}
    const open=ST[i].s,pw=70,ph=tl*1.6;ctx.fillStyle=alpha(T.ca,.7);ctx.strokeStyle=T.ca;ctx.lineWidth=2.5;ctx.beginPath();ctx.rect(cx-pw/2,cy-ph/2,pw,ph);ctx.fill();ctx.stroke();
    ctx.fillStyle=T.surface;ctx.beginPath();if(open==='inside'){ctx.moveTo(cx-20,cy+ph/2);ctx.lineTo(cx+20,cy+ph/2);ctx.lineTo(cx,cy-ph/4);}else{ctx.moveTo(cx-20,cy-ph/2);ctx.lineTo(cx+20,cy-ph/2);ctx.lineTo(cx,cy+ph/4);}ctx.closePath();ctx.fill();
    const nai=[[-14,26],[0,28],[14,26]],kc=[[-8,-26],[8,-26]];
    if(i===0)nai.forEach(p=>ion(ctx,cx+p[0],cy+ph/2+p[1]*.7,'Na⁺',T.cx));
    if(i===1){nai.forEach((p,k)=>ion(ctx,cx+p[0],cy+ph/2-8+(k%2)*8,'Na⁺',T.cx));ctx.fillStyle=T.hot;ctx.beginPath();ctx.arc(cx+pw/2+30,cy+ph/2+10,9,0,6.283);ctx.fill();label(ctx,'ATP',cx+pw/2+30,cy+ph/2+10,T.surface,'center','middle',MONO);dot2(ctx,cx+pw/2-4,cy-4,T.hot,6);}
    if(i===2)nai.forEach(p=>ion(ctx,cx+p[0]*1.3,cy-ph/2-18-(p[1]-26)*.3,'Na⁺',T.cx));
    if(i===3)kc.forEach(p=>ion(ctx,cx+p[0],cy-ph/2+10+(p[1]+26)*.4,'K⁺',T.ce));
    if(i===4){kc.forEach(p=>ion(ctx,cx+p[0],cy+ph/2-14,'K⁺',T.ce));dot2(ctx,cx+pw/2+26,cy-ph/2-8,T.hot,6);label(ctx,'Pi',cx+pw/2+44,cy-ph/2-8,T.muted,'left','middle',MONO);}
    if(i===5)kc.forEach(p=>ion(ctx,cx+p[0]*1.5,cy+ph/2+18,'K⁺',T.ce));
    },{h:w=>clamp(w*.52,260,340)});
  $('#at-lab').addEventListener('labreset',()=>sc.go(0));
  /* passive vs active */
  let mode='fd',atp=true,L=40,R=10;
  const rnd=Array.from({length:120},(_,i)=>[(Math.sin(i*12.9898)*43758.5453)%1,(Math.sin(i*78.233)*43758.5453)%1].map(v=>Math.abs(v)));
  function init(){if(mode==='fd'){L=40;R=10;}else{L=30;R=30;}}
  const sim=sim2d($('#at-canvas2'),{h:w=>clamp(w*.4,210,280),
    step(dt){if(mode==='fd'){const f=(L-R)*.5*dt;L-=f;R+=f;}else if(atp&&L>.6&&R<5*L){const f=Math.min(L,4*dt);L-=f;R+=f;}update(true);},
    draw(ctx,w,h){const mid=w/2,pad=14,top=24,bot=h-14;ctx.strokeStyle=T.ink;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(mid,top);ctx.lineTo(mid,(top+bot)/2-16);ctx.moveTo(mid,(top+bot)/2+16);ctx.lineTo(mid,bot);ctx.stroke();
      ctx.fillStyle=mode==='fd'?alpha(T.ca,.7):alpha(T.cv,.7);ctx.fillRect(mid-10,(top+bot)/2-16,20,32);ctx.strokeStyle=mode==='fd'?T.ca:T.cv;ctx.strokeRect(mid-10,(top+bot)/2-16,20,32);
      [[Math.round(L),pad,mid-pad],[Math.round(R),mid+pad,w-pad]].forEach(([n,a,b])=>{for(let i=0;i<Math.min(n,115);i++){dot2(ctx,a+rnd[i][0]*(b-a),top+8+rnd[i][1]*(bot-top-16),T.ce,4);}});
      label(ctx,'left',mid/2,10,T.muted,'center','middle',MONO);label(ctx,'right',mid+mid/2,10,T.muted,'center','middle',MONO);label(ctx,mode==='fd'?'channel: no energy':(atp?'pump, ATP available':'pump, no ATP'),mid,h-3,T.muted,'center','middle',MONO);}});
  function update(skip){setText('at-l',fmt(L,0)+' particles');setText('at-r',fmt(R,0)+' particles');let s;if(mode==='fd')s=Math.abs(L-R)<1?'equal on both sides: no net movement (ATP is not needed)':'particles diffuse from left to right, down the gradient';else s=!atp?'pump is off: nothing moves':(R>=5*L||L<=.6?'gradient is steep: the pump has built a concentration difference':'pump is moving particles from left to right, even when right has more');setText('at-st',s);if(!skip)sim.render();}
  segBind('at-mode','k',v=>{mode=v;init();update();});$('#at-atp').addEventListener('click',()=>{atp=!atp;$('#at-atp').textContent='ATP: '+(atp?'on':'off');update();});$('#at-reset').addEventListener('click',()=>{init();update();});
  $('#at-lab2').addEventListener('labreset',()=>{mode='fd';atp=true;$('#at-atp').textContent='ATP: on';segSet('at-mode',0);init();update();});
  init();update();drawers.activetr=()=>{sc.render();sim.render();};
  KEYS['at-canvas']=['Step through one cycle. Blue Na⁺ goes out, gold K⁺ comes in.',[['cx','sodium ion'],['ce','potassium ion'],['ca','pump protein'],['hot','ATP / phosphate']]];
  KEYS['at-canvas2']=['Dots are solute particles. Compare channel and pump with and without ATP.',[['ce','solute'],['ca','channel'],['cv','pump']]];
  TIPS['np-st']=()=>'Each cycle uses one ATP: 3 Na⁺ out, 2 K⁺ in.';
  GLOSS['active transport']='Movement of a substance against its concentration gradient using energy (usually ATP).';GLOSS['facilitated diffusion']='Passive movement down a gradient through a channel or carrier protein.';GLOSS['cotransport']='Using the gradient of one substance (made by a pump) to move another.';GLOSS['endocytosis']='Taking material into the cell by pinching off a vesicle from the plasma membrane.';
  TT.activetr='Ask students to predict what happens to the gradient with ATP off for each kind of carrier.';
})();
(function(){
  const kinds=[['Oxygen moves from the blood into a cell down its gradient with no protein.','simple diffusion'],['Glucose enters a red blood cell down its gradient through a carrier protein.','facilitated diffusion'],['A cell pumps calcium ions out against a steep gradient using ATP.','active transport'],['A white blood cell engulfs a bacterium in a vesicle.','endocytosis (phagocytosis)'],['A pancreas cell releases insulin from a vesicle fused with the plasma membrane.','exocytosis']];
  PROBS.push({id:'at-type',topic:'activetr',title:'Type of transport',gen(){const p=pick(kinds),m=mcq(p[1],kinds.map(x=>x[1]).filter(x=>x!==p[1]));return {q:p[0]+' This is',choices:m.choices,ans:m.ans,hint:'Down or up the gradient? Protein? ATP? Vesicle?',sol:`<b>${p[1]}</b>.`};}});
  PROBS.push({id:'at-pump',topic:'activetr',title:'Sodium-potassium pump arithmetic',gen(){const n=randInt(2,50),w=pick(['Na⁺ ions are moved out of the cell','K⁺ ions are moved into the cell']),a=w[0]==='N'?3*n:2*n;return {q:`The sodium-potassium pump runs ${n} cycles. How many ${w}?`,ans:a,unit:'ions',tol:0,chk:(w[0]==='N'?3:2)*n,hint:'Each cycle moves 3 Na⁺ out and 2 K⁺ in using one ATP.',sol:`${w[0]==='N'?3:2} × ${n} = <b>${a}</b>.`};}});
  PROBS.push({id:'at-atp',topic:'activetr',title:'ATP used',gen(){const n=randInt(5,60),ans=n;return {q:`How many ATP molecules does the sodium-potassium pump use for ${n} complete cycles?`,ans,unit:'ATP',tol:0,chk:n,hint:'One ATP per cycle.',sol:`<b>${n}</b>.`};}});
})();
