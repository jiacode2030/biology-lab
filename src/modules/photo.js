/* ---------------- Photosynthesis ---------------- */
(function photo(){
  const cv=$('#ph-canvas');if(!cv)return;
  const ST=[{n:'1 · light excites photosystem II',t:'Light energy excites electrons in photosystem II. Water is split to replace them, releasing O₂ and H⁺ inside the thylakoid.'},{n:'2 · electron transport chain',t:'Electrons pass down the chain. Their energy pumps H⁺ from the stroma into the thylakoid space, building a gradient.'},{n:'3 · photosystem I makes NADPH',t:'Photosystem I re-energizes the electrons, which are passed to NADP⁺ to make NADPH in the stroma.'},{n:'4 · ATP synthase makes ATP',t:'H⁺ flows down its gradient through ATP synthase into the stroma, driving ADP + Pi → ATP (chemiosmosis).'},{n:'5 · Calvin cycle: carbon fixation',t:'In the stroma, rubisco attaches CO₂ to RuBP (5C), making two 3-carbon molecules (3-PGA).'},{n:'6 · Calvin cycle: reduce and regenerate',t:'ATP and NADPH reduce 3-PGA to G3P. Some G3P becomes sugar; the rest regenerates RuBP.'}];
  function box(ctx,x,y,w,h,col,nm,on){ctx.save();ctx.globalAlpha=on?1:.32;ctx.fillStyle=alpha(col,.55);ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect?ctx.roundRect(x-w/2,y-h/2,w,h,6):ctx.rect(x-w/2,y-h/2,w,h);ctx.fill();ctx.stroke();label(ctx,nm,x,y,T.ink,'center','middle',MONO);ctx.restore();}
  function arrow(ctx,x1,y1,x2,y2,col,on=true){ctx.save();ctx.globalAlpha=on?1:.3;ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();const a=Math.atan2(y2-y1,x2-x1);ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-9*Math.cos(a-.4),y2-9*Math.sin(a-.4));ctx.lineTo(x2-9*Math.cos(a+.4),y2-9*Math.sin(a+.4));ctx.closePath();ctx.fill();ctx.restore();}
  const sc=stageLab('ph','ph-canvas',ST,(ctx,w,h,i,t)=>{const my=h*.34,th=h*.26;
    ctx.beginPath();ctx.rect(6,6,w-12,h-12);ctx.fillStyle=alpha(T.cv,.08);ctx.fill();ctx.strokeStyle=T.cv;ctx.lineWidth=2;ctx.stroke();
    ctx.beginPath();ctx.roundRect?ctx.roundRect(24,my-th/2,w-48,th,20):ctx.rect(24,my-th/2,w-48,th);ctx.fillStyle=alpha(T.ce,.15);ctx.fill();ctx.strokeStyle=T.ce;ctx.lineWidth=3;ctx.stroke();
    label(ctx,'thylakoid space',w/2,my-th/2+14,T.muted,'center','middle',MONO);label(ctx,'stroma',w/2,h-18,T.muted,'center','middle',MONO);
    const xs=[w*.16,w*.4,w*.62,w*.84],yb=my+th/2;
    box(ctx,xs[0],yb,64,28,T.cv,'PSII',i===0);box(ctx,xs[1],yb,64,28,T.ca,'chain',i===1);box(ctx,xs[2],yb,64,28,T.cv,'PSI',i===2);box(ctx,xs[3],yb,70,28,T.hot,'ATP syn.',i===3);
    if(i===0){arrow(ctx,xs[0]-30,8,xs[0]-4,yb-18,T.ce);label(ctx,'light',xs[0]-34,14,T.ce,'right','middle',MONO);label(ctx,'2H₂O → O₂ + 4H⁺',xs[0],my-th/2+34,T.cx,'center','middle',MONO);arrow(ctx,xs[0]+36,yb,xs[1]-36,yb,T.ink);}
    if(i===1){arrow(ctx,xs[0]+36,yb,xs[1]-36,yb,T.ink,true);arrow(ctx,xs[1]-14,yb+40,xs[1]-14,yb+12,T.cx);arrow(ctx,xs[1]+14,yb-10,xs[1]+14,my-6,T.cx);label(ctx,'H⁺ pumped in',xs[1]+22,my-6,T.cx,'left','middle',MONO);for(let k=0;k<8;k++)dot2(ctx,xs[1]+50+k*14,my-8+Math.sin(k+t)*4,T.cx,3);}
    if(i===2){arrow(ctx,xs[1]+36,yb,xs[2]-36,yb,T.ink);label(ctx,'light',xs[2]-30,yb-34,T.ce,'right','middle',MONO);arrow(ctx,xs[2]-24,yb-48,xs[2]-6,yb-18,T.ce);arrow(ctx,xs[2],yb+16,xs[2],yb+52,T.ink);label(ctx,'NADP⁺ → NADPH',xs[2]+12,yb+66,T.ca,'left','middle',MONO);}
    if(i===3){for(let k=0;k<10;k++)dot2(ctx,xs[3]-60+k*10,my-4+Math.sin(k*2+t)*4,T.cx,3);arrow(ctx,xs[3],my+2,xs[3],yb+46,T.cx);label(ctx,'H⁺ flows out',xs[3]+10,yb+30,T.cx,'left','middle',MONO);label(ctx,'ADP + Pi → ATP',xs[3],yb+64,T.hot,'center','middle',MONO);}
    if(i>=4){const cx=w*.5,cy=h*.74,r=Math.min(40,h*.12);ctx.beginPath();ctx.arc(cx,cy,r,0,6.283);ctx.strokeStyle=T.cv;ctx.lineWidth=3;ctx.stroke();label(ctx,'Calvin cycle',cx,cy,T.ink,'center','middle',MONO);
      if(i===4){arrow(ctx,cx-r-60,cy-14,cx-r-4,cy-6,T.ink);label(ctx,'CO₂',cx-r-64,cy-22,T.ink,'right','middle',MONO);label(ctx,'rubisco: CO₂ + RuBP → 2 × 3-PGA',cx+r+10,cy,T.cv,'left','middle',MONO);}
      if(i===5){arrow(ctx,cx-r-60,cy+16,cx-r-4,cy+6,T.hot);label(ctx,'ATP, NADPH',cx-r-64,cy+24,T.hot,'right','middle',MONO);arrow(ctx,cx+r+4,cy,cx+r+54,cy,T.ce);label(ctx,'G3P → glucose',cx+r+58,cy,T.ce,'left','middle',MONO);}}
    },{h:w=>clamp(w*.58,280,380)});
  $('#ph-lab').addEventListener('labreset',()=>sc.go(0));
  /* limiting factors */
  let L=30,C=60,Tc=25;
  const fL=l=>Math.min(1,1.25*l/(l+25)),fC=c=>Math.min(1,1.2*c/(c+20)),fT=t=>t<=30?Math.pow(2,(t-30)/10):Math.max(0,1-Math.pow((t-30)/17,2));
  const R=(l,c,t)=>100*Math.min(fL(l),fC(c))*fT(t);
  const sim=sim2d($('#ph-canvas2'),{h:w=>clamp(w*.46,230,300),draw(ctx,w,h){const A=axes2(ctx,w,h,{x0:0,x1:100,y0:0,y1:105,xt:20,yt:25,xl:'light intensity',yl:'rate (relative)'});curve2(ctx,A,l=>R(l,C,Tc),0,100,T.cv);dot2(ctx,A.X(L),A.Y(R(L,C,Tc)),T.accent,6);}});
  function upd(){const a=fL(L),b=fC(C),c=fT(Tc),m=Math.min(a,b,c);setText('ph-r',fmt(R(L,C,Tc),0));setText('ph-lim',m>.9?'none: near the maximum':m===c?(Tc>30?'temperature too high (enzymes denature)':'temperature too low (enzymes slow)'):m===a?'light intensity':'CO₂ availability');sim.render();}
  bindRange('ph-l',v=>String(v),v=>{L=v;upd();});bindRange('ph-c',v=>String(v),v=>{C=v;upd();});bindRange('ph-t',v=>v+' °C',v=>{Tc=v;upd();});
  $('#ph-lab2').addEventListener('labreset',()=>{L=30;C=60;Tc=25;setCtl('ph-l',30);setCtl('ph-c',60);setCtl('ph-t',25,v=>v+' °C');upd();});upd();
  drawers.photo=()=>{sc.render();sim.render();};
  KEYS['ph-canvas']=['Step through the stages. The active structure is highlighted; the rest are faded.',[['cv','photosystems and chloroplast'],['ca','electron transport chain'],['hot','ATP synthase'],['cx','H⁺ and water']]];
  KEYS['ph-canvas2']=['The curve is the rate at your CO₂ and temperature. The dot is your light intensity. This is a simplified model.',[['cv','rate'] ]];
  TIPS['ph-st']=()=>'Light reactions: stages 1–4. Calvin cycle: stages 5–6.';
  GLOSS['rubisco']='The enzyme that attaches CO₂ to RuBP in the Calvin cycle.';GLOSS['chemiosmosis']='Making ATP using the energy of an H⁺ gradient across a membrane.';GLOSS['g3p']='Glyceraldehyde-3-phosphate: the three-carbon sugar made by the Calvin cycle.';GLOSS['photosystem']='A cluster of pigments and proteins in the thylakoid that captures light energy.';GLOSS['stroma']='The fluid inside the chloroplast around the thylakoids, where the Calvin cycle happens.';
  TT.photo='Ask students which stages stop first in the dark and which keep going for a while.';
})();
(function(){
  PROBS.push({id:'ph-atp',topic:'photo',title:'ATP and NADPH for G3P',gen(){const n=randInt(1,6),a=pick([['ATP',9],['NADPH',6]]),ans=a[1]*n;return {q:`The Calvin cycle uses 9 ATP and 6 NADPH to make one G3P (from 3 CO₂). How many ${a[0]} are needed to make ${n} G3P?`,ans,unit:a[0],tol:0,chk:a[1]*n,hint:'Multiply by the number of G3P.',sol:`${a[1]} × ${n} = <b>${ans}</b>.`};}});
  PROBS.push({id:'ph-co2',topic:'photo',title:'CO₂ for glucose',gen(){const n=randInt(1,8),ans=6*n;return {q:`How many CO₂ molecules must be fixed in the Calvin cycle to make ${n} glucose molecule${n>1?'s':''}?`,ans,unit:'CO₂',tol:0,chk:6*n,hint:'Glucose has 6 carbons.',sol:`6 × ${n} = <b>${ans}</b>.`};}});
  const q=[['Where does the oxygen released in photosynthesis come from?','the splitting of water',['carbon dioxide','glucose','ATP']],['Where in the chloroplast does the Calvin cycle occur?','the stroma',['the thylakoid membrane','the thylakoid space','the outer membrane']],['What drives ATP synthase in the thylakoid membrane?','an H⁺ gradient across the membrane',['direct absorption of light','NADPH','CO₂']],['Which enzyme fixes CO₂ in the Calvin cycle?','rubisco',['ATP synthase','catalase','DNA polymerase']],['What are the products of the light reactions that the Calvin cycle uses?','ATP and NADPH',['glucose and O₂','CO₂ and water','NAD⁺ and FAD']]];
  PROBS.push({id:'ph-fact',topic:'photo',title:'Photosynthesis facts',gen(){const p=pick(q),m=mcq(p[1],p[2]);return {q:p[0],choices:m.choices,ans:m.ans,hint:'Recall which stage and which structure.',sol:`<b>${p[1]}</b>.`};}});
  const lim=[['A greenhouse plant is in bright light and warm temperature, but the CO₂ level is very low. What is limiting the rate?','CO₂',['light','temperature','water in the soil only']],['At 5 °C, with plenty of light and CO₂, a plant\'s rate is low because','enzyme-catalysed reactions are slow',['rubisco is denatured','light is limiting','CO₂ is limiting']]];
  PROBS.push({id:'ph-lim',topic:'photo',title:'Limiting factor',gen(){const p=pick(lim),m=mcq(p[1],p[2]);return {q:p[0],choices:m.choices,ans:m.ans,hint:'Find the factor that is in short supply.',sol:`<b>${p[1]}</b>.`};}});
})();
