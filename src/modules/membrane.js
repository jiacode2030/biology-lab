/* ---------------- Membrane structure & permeability ---------------- */
(function membrane(){
  const cv=$('#me-canvas');if(!cv)return;
  let chol='no',Tc=25;const N=18,ph=Array.from({length:N*2},()=>Math.random()*6.28);
  const flu=()=>{const b=Tc/50;return chol==='yes'?.5+(b-.5)*.4:b;};
  const sim=sim2d(cv,{h:w=>clamp(w*.46,230,300),draw(ctx,w,h,t){const f=flu(),cy=h/2,sp=(w-30)/N,tl=h*.17,hr=Math.min(8,sp*.38);
    for(let r=0;r<2;r++)for(let i=0;i<N;i++){const k=r*N+i,x=15+sp*(i+.5)+Math.sin(t*(1+3*f)+ph[k])*sp*.45*f*(1.1-.4*(r)) ,wob=Math.sin(t*(2+6*f)+ph[k]*2)*(1+tl*.25)*f,dir=r?1:-1,yh=cy+dir*(tl+hr+4);
      ctx.strokeStyle=T.ce;ctx.lineWidth=2;[-.28,.28].forEach(o=>{ctx.beginPath();ctx.moveTo(x+o*hr*2,yh-dir*hr);ctx.lineTo(x+o*hr*2+wob*o*6,cy+dir*3);ctx.stroke();});dot2(ctx,x,yh,T.cx,hr);}
    if(chol==='yes')for(let i=0;i<N;i+=3){const x=15+sp*(i+1.5)+Math.sin(t*2+i)*2;ctx.fillStyle=T.ce;[1,-1].forEach(d=>{ctx.fillRect(x-3,cy+d*(tl*.5)-tl*.33,6,tl*.66);});}
    [[.28,T.ca],[.72,T.cv]].forEach(([p,c])=>{const x=w*p;ctx.fillStyle=alpha(c,.65);ctx.fillRect(x-12,cy-tl-hr*2-2,24,2*(tl+hr*2+2));ctx.strokeStyle=c;ctx.lineWidth=2;ctx.strokeRect(x-12,cy-tl-hr*2-2,24,2*(tl+hr*2+2));});
    label(ctx,'outside the cell',12,12,T.muted,'left','middle',MONO);label(ctx,'inside the cell',12,h-10,T.muted,'left','middle',MONO);label(ctx,'gold tails: fatty acids · pink/green: membrane proteins'+(chol==='yes'?' · gold bars: cholesterol':''),w-12,h-10,T.muted,'right','middle',MONO);}});
  function upd(){const f=flu();setText('me-f',f<.2?'very low':f<.4?'low':f<.65?'moderate':f<.85?'high':'very high');setText('me-s',f<.2?'tails pack tightly and the membrane can stiffen (gel)':f<.4?'less movement; transport proteins work poorly':f<.65?'a working fluid mosaic':f<.85?'membrane loosens and gets leaky':'membrane becomes too fluid and unstable');sim.render();}
  segBind('me-chol','k',v=>{chol=v;upd();});bindRange('me-t',v=>v+' °C',v=>{Tc=v;upd();});
  $('#me-lab').addEventListener('labreset',()=>{chol='no';Tc=25;segSet('me-chol',0);setCtl('me-t',25,v=>v+' °C');upd();});upd();
  /* what can cross */
  const MOL={o2:['O₂','crosses directly through the bilayer','small and nonpolar: dissolves in the hydrophobic core',0],h2o:['water','mostly slowly through the bilayer; faster through aquaporins','small but polar: slow directly, aquaporin channels help',1],glu:['glucose','through a carrier protein (facilitated diffusion)','large and polar: cannot dissolve in the core',2],na:['Na⁺','through a channel (down gradient) or a pump (against it)','charged: repelled by the hydrophobic core',3],pro:['protein','cannot cross; moves in a vesicle (endo- or exocytosis)','far too large and polar to pass through the membrane',4]};
  let mol='o2';
  const sim2=sim2d($('#me-canvas2'),{h:w=>clamp(w*.38,200,260),draw(ctx,w,h,t){const my=h/2,tl=22,u=(t*.5)%1,x=w/2;
    ctx.fillStyle=alpha(T.ce,.35);ctx.fillRect(10,my-tl,w-20,tl*2);ctx.strokeStyle=T.ce;ctx.lineWidth=2;ctx.strokeRect(10,my-tl,w-20,tl*2);
    const k=MOL[mol][3];
    if(k===1||k===2||k===3){ctx.fillStyle=alpha(k===3?T.cv:T.ca,.7);ctx.fillRect(x-20,my-tl-6,40,tl*2+12);ctx.strokeStyle=k===3?T.cv:T.ca;ctx.strokeRect(x-20,my-tl-6,40,tl*2+12);ctx.fillStyle=T.surface;ctx.fillRect(x-4,my-tl-6,8,tl*2+12);}
    if(k===4){ctx.beginPath();ctx.arc(x,my+(1-u)*(-tl-26)+u*(tl+26),0,0,0);ctx.stroke();}
    let y=h*.15+u*(h*.7);
    if(k===0)dot2(ctx,x-60,y,T.cx,7);
    if(k===1){dot2(ctx,x-60,y,T.cx,6);dot2(ctx,x,y,T.cx,6);}
    if(k===2||k===3)dot2(ctx,x,y,k===2?T.ce:T.ca,7);
    if(k===4){const vy=h*.15+u*(h*.1);ctx.beginPath();ctx.arc(x,vy+10,17,0,6.283);ctx.fillStyle=alpha(T.cx,.2);ctx.fill();ctx.strokeStyle=T.cx;ctx.lineWidth=2;ctx.stroke();dot2(ctx,x,vy+10,T.ca,9);if(u>.7){ctx.fillStyle=T.bad;label(ctx,'✕ cannot pass through',x+40,my,T.bad,'left','middle',MONO);}}
    label(ctx,'outside',14,12,T.muted,'left','middle',MONO);label(ctx,'inside',14,h-10,T.muted,'left','middle',MONO);label(ctx,MOL[mol][0],w-14,12,T.ink,'right','middle',MONO);}});
  function upd2(){const m=MOL[mol];setText('me-how',m[1]);setText('me-why',m[2]);sim2.render();}
  segBind('me-m','k',v=>{mol=v;upd2();});
  $('#me-lab2').addEventListener('labreset',()=>{mol='o2';segSet('me-m',0);upd2();});upd2();
  drawers.membrane=()=>{sim.render();sim2.render();};
  KEYS['me-canvas']=['Blue circles are hydrophilic heads, gold lines are hydrophobic tails. Watch how much they move.',[['cx','phospholipid head'],['ce','fatty acid tails'],['ca','membrane proteins']]];
  KEYS['me-canvas2']=['The particle approaches from outside. Its route depends on size and polarity.',[['ce','bilayer'],['ca','carrier or aquaporin'],['cv','ion channel']]];
  TIPS['me-t']=()=>'Warmer: lipids move more. Cholesterol dampens both extremes.';
  GLOSS['fluid mosaic']='The model of the membrane as a fluid phospholipid bilayer with proteins moving within it.';GLOSS['amphipathic']='Having both a hydrophilic and a hydrophobic region, like a phospholipid.';GLOSS['aquaporin']='A channel protein that lets water cross the membrane quickly.';
  TT.membrane='Have students explain selectivity in terms of polarity, then name the protein needed for each exception.';
})();
(function(){
  const items=[['oxygen','crosses directly through the lipid bilayer'],['carbon dioxide','crosses directly through the lipid bilayer'],['a sodium ion','needs a channel or pump protein'],['glucose','needs a carrier protein'],['a large protein','must be moved in a vesicle (endocytosis or exocytosis)'],['a potassium ion','needs a channel or pump protein']];
  PROBS.push({id:'me-cross',topic:'membrane',title:'How does it cross?',gen(){const p=pick(items),m=mcq(p[1],[...new Set(items.map(x=>x[1]))].filter(x=>x!==p[1]));return {q:`How does ${p[0]} cross a cell membrane?`,choices:m.choices,ans:m.ans,hint:'Small and nonpolar: directly. Charged or polar: protein. Very large: vesicle.',sol:`${p[0][0].toUpperCase()+p[0].slice(1)} <b>${p[1]}</b>.`};}});
  PROBS.push({id:'me-chol',topic:'membrane',title:'Role of cholesterol',gen(){const m=mcq('buffers fluidity: it keeps the membrane from freezing when cold and from becoming too loose when warm',['makes the membrane rigid at every temperature','makes the membrane permeable to ions','forms the channels for water']);return {q:'In animal cell membranes, cholesterol',choices:m.choices,ans:m.ans,hint:'It is a fluidity buffer.',sol:`Cholesterol <b>${m.choices[m.ans]}</b>.`};}});
  PROBS.push({id:'me-orient',topic:'membrane',title:'Phospholipid orientation',gen(){const m=mcq('the hydrophilic heads face the watery surroundings and the hydrophobic tails face each other',['the heads face each other in the middle','all tails face the cytoplasm','the heads and tails are mixed randomly']);return {q:'In a phospholipid bilayer in water,',choices:m.choices,ans:m.ans,hint:'Tails avoid water.',sol:`<b>${m.choices[m.ans]}</b>.`};}});
})();
