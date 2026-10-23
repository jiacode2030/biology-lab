/* ---------------- Cell organelles & compartments ---------------- */
(function organelles(){
  const cv=$('#og-canvas');if(!cv)return;
  let sel='nuc';
  const INFO={nuc:['stores DNA, makes mRNA, assembles ribosome parts (nucleolus)','double membrane (nuclear envelope) with pores','all eukaryotes'],
    rer:['makes proteins for membranes, lysosomes and export','single membrane, continuous with the nuclear envelope','all eukaryotes'],
    gol:['modifies, sorts and packages proteins into vesicles','single-membrane stacks','all eukaryotes'],
    mit:['most of cellular respiration: makes ATP','double membrane; inner membrane folded into cristae','nearly all eukaryotes'],
    lys:['digests macromolecules and old organelles with hydrolytic enzymes at acidic pH','single membrane','animal cells (plant vacuoles do similar work)'],
    chl:['photosynthesis: light reactions in thylakoids, Calvin cycle in the stroma','double membrane plus internal thylakoid membranes','plants and algae']};
  function draw1(ctx,k,x,y,s,on,t){ctx.save();ctx.globalAlpha=on?1:.28;ctx.lineWidth=2;
    if(k==='nuc'){ctx.beginPath();ctx.arc(x,y,s*1.15,0,6.283);ctx.fillStyle=alpha(T.cx,.2);ctx.fill();ctx.strokeStyle=T.cx;ctx.stroke();ctx.beginPath();ctx.arc(x,y,s*1.15+4,0,6.283);ctx.stroke();ctx.beginPath();ctx.arc(x-s*.2,y,s*.4,0,6.283);ctx.fillStyle=alpha(T.cx,.6);ctx.fill();}
    if(k==='rer'){ctx.strokeStyle=T.ca;for(let i=0;i<4;i++){ctx.beginPath();for(let j=0;j<=20;j++){const px=x-s*1.1+j*s*.11,py=y+i*s*.3+Math.sin(j*.9+i)*s*.07;j?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();for(let j=1;j<20;j+=3){dot2(ctx,x-s*1.1+j*s*.11,y+i*s*.3-s*.09,T.ink,1.6);}}}
    if(k==='gol'){ctx.strokeStyle=T.accent;ctx.lineWidth=3.5;for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(x,y+(i-1.5)*s*.28+s*.9,s*.9,Math.PI*1.2,Math.PI*1.8);ctx.stroke();}ctx.lineWidth=2;dot2(ctx,x+s*1.1,y+s*.2,T.accent,3);dot2(ctx,x-s*1.0,y+s*.5,T.accent,3);}
    if(k==='mit'){ctx.beginPath();ctx.ellipse(x,y,s*1.2,s*.65,.3,0,6.283);ctx.fillStyle=alpha(T.hot,.22);ctx.fill();ctx.strokeStyle=T.hot;ctx.stroke();ctx.beginPath();ctx.moveTo(x-s*.9,y-s*.1);for(let i=0;i<5;i++)ctx.lineTo(x-s*.9+i*s*.4,y+(i%2?s*.3:-s*.3));ctx.stroke();}
    if(k==='lys'){dot2(ctx,x,y,T.bad,s*.55);dot2(ctx,x-s*.15,y-s*.1,T.surface,s*.12);}
    if(k==='chl'){ctx.beginPath();ctx.ellipse(x,y,s*1.3,s*.75,-.3,0,6.283);ctx.fillStyle=alpha(T.cv,.25);ctx.fill();ctx.strokeStyle=T.cv;ctx.stroke();for(let i=0;i<3;i++){ctx.fillStyle=alpha(T.cv,.8);ctx.fillRect(x-s*.7+i*s*.5,y-s*.2+i*s*.05,s*.32,s*.22);}}
    ctx.restore();}
  const POS={nuc:[.3,.42],rer:[.52,.4],gol:[.68,.5],mit:[.74,.27],lys:[.44,.78],chl:[.17,.72]};
  const sim=sim2d(cv,{h:w=>clamp(w*.52,250,340),draw(ctx,w,h,t){const cx=w/2,cy=h/2;ctx.beginPath();ctx.ellipse(cx,cy,w*.46,h*.46,0,0,6.283);ctx.fillStyle=alpha(T.sunk,.6);ctx.fill();ctx.strokeStyle=T.ink;ctx.lineWidth=3;ctx.stroke();
    const s=Math.min(w,h*1.8)*.075;Object.keys(POS).forEach(k=>{const p=POS[k];draw1(ctx,k,w*(.04+.92*p[0]),h*(.06+.88*p[1]),s,k===sel,t);});
    const p=POS[sel];ctx.strokeStyle=T.accent;ctx.lineWidth=2;ctx.setLineDash([4,4]);ctx.beginPath();ctx.arc(w*(.04+.92*p[0]),h*(.06+.88*p[1]),s*1.9,0,6.283);ctx.stroke();ctx.setLineDash([]);
    label(ctx,'a plant cell with all organelles shown',w/2,h-8,T.muted,'center','middle',MONO);}});
  function upd(){const I=INFO[sel];setText('og-fn',I[0]);setText('og-mem',I[1]);setText('og-where',I[2]);sim.render();}
  segBind('og-sel','k',v=>{sel=v;upd();});
  $('#og-lab').addEventListener('labreset',()=>{sel='nuc';segSet('og-sel',0);upd();});upd();
  /* secretion pathway */
  const ST=[{n:'ribosome on rough ER',t:'A ribosome on the rough ER makes the protein and threads it into the ER interior.'},{n:'transport vesicle',t:'A vesicle buds off the ER carrying the protein.'},{n:'vesicle fuses with Golgi',t:'The vesicle fuses with the Golgi, delivering the protein to its receiving side.'},{n:'Golgi processing',t:'The Golgi modifies the protein and packages it into a secretory vesicle.'},{n:'exocytosis',t:'The vesicle fuses with the plasma membrane and releases the protein outside.'}];
  const sc=stageLab('ps','og-canvas2',ST,(ctx,w,h,i,t)=>{const y=h*.5,er=w*.16,gx=w*.52,pm=w*.9;
    ctx.strokeStyle=T.ca;ctx.lineWidth=2.5;for(let k=0;k<3;k++){ctx.beginPath();for(let j=0;j<=24;j++){const px=er-w*.1+j*w*.0083*3,py=y-30+k*28+Math.sin(j*.9+k)*5;j?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();}
    for(let j=1;j<24;j+=3)dot2(ctx,er-w*.1+j*w*.025,y-36,T.ink,2);
    ctx.strokeStyle=T.accent;ctx.lineWidth=4;for(let k=0;k<4;k++){ctx.beginPath();ctx.arc(gx,y+k*13+36,w*.1,Math.PI*1.2,Math.PI*1.8);ctx.stroke();}
    ctx.strokeStyle=T.ink;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(pm,10);ctx.lineTo(pm,h-10);ctx.stroke();
    label(ctx,'rough ER',er,h-12,T.ca,'center','middle',MONO);label(ctx,'Golgi',gx,h-12,T.accent,'center','middle',MONO);label(ctx,'plasma membrane',pm-4,12,T.muted,'right','middle',MONO);label(ctx,'outside',pm+6,h/2,T.muted,'left','middle',MONO);
    const X=[er,(er+gx)/2,gx-w*.07,gx+w*.07,pm+24][i],Y=[y-10,y,y+6,y+10,y][i],ves=i===1||i===3||i===4&&false;
    if(ves||i===2){ctx.beginPath();ctx.arc(X,Y,13,0,6.283);ctx.fillStyle=alpha(T.cx,.2);ctx.fill();ctx.strokeStyle=T.cx;ctx.lineWidth=2;ctx.stroke();}
    dot2(ctx,X,Y,T.ca,i===4?5:6);if(i===3){ctx.beginPath();ctx.arc(gx+w*.2,y,13,0,6.283);ctx.strokeStyle=T.cx;ctx.stroke();}},{h:w=>clamp(w*.4,200,270)});
  $('#og-lab2').addEventListener('labreset',()=>sc.go(0));
  drawers.organelles=()=>{sim.render();sc.render();};
  KEYS['og-canvas']=['The dashed circle marks the organelle you chose. Others are faded.',[['cx','nucleus'],['ca','rough ER'],['hot','mitochondrion'],['cv','chloroplast']]];
  KEYS['og-canvas2']=['Pink dot = the protein. Blue circles are vesicles.',[['ca','protein and rough ER'],['accent','Golgi']]];
  TIPS['ps-st']=()=>'Rough ER → vesicle → Golgi → vesicle → cell surface.';
  GLOSS['endomembrane system']='The linked membranes (ER, Golgi, vesicles, lysosomes, plasma membrane) that make, modify and ship proteins and lipids.';GLOSS['vesicle']='A small membrane-bound sac that carries materials between compartments.';GLOSS['cristae']='Folds of the inner mitochondrial membrane that increase surface for ATP production.';
  TT.organelles='Have students predict which organelle a given cell type has many of (muscle: mitochondria; pancreas: rough ER and Golgi).';
})();
(function(){
  const F=[['the nucleus','stores DNA and makes mRNA'],['the Golgi apparatus','modifies, sorts and packages proteins'],['the mitochondrion','makes most of the ATP in respiration'],['the lysosome','digests macromolecules with hydrolytic enzymes'],['the rough ER','makes proteins destined for membranes or secretion'],['the chloroplast','carries out photosynthesis'],['the smooth ER','makes lipids and detoxifies chemicals']];
  PROBS.push({id:'og-fn',topic:'organelles',title:'Organelle and function',gen(){const p=pick(F),m=mcq(p[1],F.filter(x=>x!==p).map(x=>x[1]));return {q:`What is the main job of ${p[0]}?`,choices:m.choices,ans:m.ans,hint:'Think about what the cell needs that compartment for.',sol:`${p[0][0].toUpperCase()+p[0].slice(1)} <b>${p[1]}</b>.`};}});
  PROBS.push({id:'og-path',topic:'organelles',title:'Secretion pathway order',gen(){const right='ribosome on rough ER → Golgi → vesicle → plasma membrane',m=mcq(right,['Golgi → ribosome on rough ER → vesicle → plasma membrane','ribosome on rough ER → lysosome → Golgi → plasma membrane','nucleus → Golgi → mitochondrion → plasma membrane','vesicle → rough ER → plasma membrane → Golgi']);return {q:'Which path does a secreted protein follow?',choices:m.choices,ans:m.ans,hint:'Made on rough ER, processed in Golgi, shipped in vesicles.',sol:`<b>${right}</b>.`};}});
})();
