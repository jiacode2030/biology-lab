/* ---------------- Energy flow & trophic levels ---------------- */
(function energyflow(){
  const cv=$('#ef-canvas');if(!cv)return;
  let P=50000,e=.1;
  const lv=()=>[P,P*e,P*e*e,P*e*e*e,P*e*e*e*e];
  const NM=['producers','primary consumers','secondary consumers','tertiary consumers','quaternary consumers'];
  const fm=v=>v>=100?Math.round(v).toLocaleString('en-US'):fmt(v,v<1?3:1);
  const sim=sim2d(cv,{h:w=>clamp(w*.5,250,320),draw(ctx,w,h){const L=lv(),n=5,bh=(h-30)/n,cx=w/2,mxw=w*.84,mn=Math.log10(.01),mx=Math.log10(1e5);L.forEach((v,i)=>{const frac=clamp((Math.log10(Math.max(v,.01))-mn)/(mx-mn),.04,1),wd=mxw*frac,y=h-14-(i+1)*bh,col=[T.cv,T.cx,T.accent,T.ca,T.bad][i];ctx.fillStyle=alpha(col,.6);ctx.fillRect(cx-wd/2,y+3,wd,bh-6);ctx.strokeStyle=col;ctx.lineWidth=2;ctx.strokeRect(cx-wd/2,y+3,wd,bh-6);label(ctx,NM[i]+': '+fm(v)+' kJ',cx,y+bh/2,T.ink,'center','middle',MONO);});label(ctx,'bar widths on a log scale',w/2,h-4,T.muted,'center','middle',MONO);}});
  function upd(){const L=lv();setText('ef-1',fm(L[1])+' kJ');setText('ef-2',fm(L[2])+' kJ');setText('ef-3',fm(L[3])+' kJ');setText('ef-4',fm(L[4])+' kJ');sim.render();}
  bindRange('ef-p',v=>v.toLocaleString('en-US'),v=>{P=v;upd();});bindRange('ef-e',v=>Math.round(v*100)+'%',v=>{e=v;upd();});
  $('#ef-lab').addEventListener('labreset',()=>{P=50000;e=.1;setCtl('ef-p',50000,v=>v.toLocaleString('en-US'));setCtl('ef-e',.1,v=>Math.round(v*100)+'%');upd();});upd();
  let G=12000,R=.4;
  const sim2=sim2d($('#ef-canvas2'),{h:w=>clamp(w*.26,130,170),draw(ctx,w,h){const L=14,Rr=w-14,y=h*.35,bh=34,rw=(Rr-L)*R;ctx.fillStyle=alpha(T.hot,.65);ctx.fillRect(L,y,rw,bh);ctx.strokeStyle=T.hot;ctx.lineWidth=2;ctx.strokeRect(L,y,rw,bh);ctx.fillStyle=alpha(T.cv,.65);ctx.fillRect(L+rw,y,(Rr-L)-rw,bh);ctx.strokeStyle=T.cv;ctx.strokeRect(L+rw,y,(Rr-L)-rw,bh);label(ctx,'respiration R',L+rw/2,y+bh/2,T.ink,'center','middle',MONO);label(ctx,'NPP',L+rw+((Rr-L)-rw)/2,y+bh/2,T.ink,'center','middle',MONO);label(ctx,'GPP = '+G.toLocaleString('en-US')+' kJ/m²/yr (full bar)',w/2,y-14,T.muted,'center','middle',MONO);}});
  function upd2(){setText('ef-npp',Math.round(G*(1-R)).toLocaleString('en-US')+' kJ/m²/yr');setText('ef-pct',Math.round((1-R)*100)+'%');sim2.render();}
  bindRange('ef-g',v=>v.toLocaleString('en-US'),v=>{G=v;upd2();});bindRange('ef-r',v=>Math.round(v*100)+'%',v=>{R=v;upd2();});
  $('#ef-lab2').addEventListener('labreset',()=>{G=12000;R=.4;setCtl('ef-g',12000,v=>v.toLocaleString('en-US'));setCtl('ef-r',.4,v=>Math.round(v*100)+'%');upd2();});upd2();
  drawers.energyflow=()=>{sim.render();sim2.render();};
  KEYS['ef-canvas']=['Each bar is a trophic level. Energy drops sharply at each step.',[['cv','producers'],['cx','primary consumers'],['accent','secondary consumers'],['ca','tertiary consumers'],['bad','quaternary consumers']]];
  KEYS['ef-canvas2']=['Orange: energy producers use in their own respiration. Green: net primary productivity.',[['hot','respiration'],['cv','NPP']]];
  TIPS['ef-e']=()=>'Typical transfer efficiency is around 10%. The rest is lost as heat or not consumed.';
  GLOSS['trophic level']='A position in a food chain: producers, primary consumers, and so on.';GLOSS['gpp']='Gross primary productivity: the total energy captured by producers.';GLOSS['npp']='Net primary productivity: GPP minus the producers\' own respiration.';GLOSS['decomposer']='An organism (bacterium or fungus) that breaks down dead material and recycles nutrients.';GLOSS['food web']='A network of interconnected food chains.';
  TT.energyflow='Ask students to explain where the lost energy goes at each step.';
})();
(function(){
  PROBS.push({id:'ef-pyr',topic:'energyflow',title:'Energy at a trophic level',gen(){const P=pick([10000,20000,50000,100000]),k=randInt(1,3),nm=['primary','secondary','tertiary'][k-1],ans=P*Math.pow(.1,k);return {q:`Producers in an ecosystem contain ${P.toLocaleString('en-US')} kJ of energy. Assuming 10% transfer between levels, how much energy is available to ${nm} consumers? (kJ)`,ans,unit:'kJ',abs:ans*.005+.01,chk:P/Math.pow(10,k),hint:'Multiply by 0.10 for each step up.',sol:`${P.toLocaleString('en-US')} × 0.1<sup>${k}</sup> = <b>${fmt(ans,2)} kJ</b>.`};}});
  PROBS.push({id:'ef-npp',topic:'energyflow',title:'Net primary productivity',gen(){const G=pick([8000,12000,15000,20000]),R=pick([2000,3000,4500,6000]),ans=G-R;return {q:`A forest has a gross primary productivity of ${G.toLocaleString('en-US')} kJ per m² per year, and its producers use ${R.toLocaleString('en-US')} kJ in respiration. What is the net primary productivity?`,ans,unit:'kJ/m²/yr',tol:0,chk:G-R,hint:'NPP = GPP − R.',sol:`${G} − ${R} = <b>${ans.toLocaleString('en-US')}</b>.`};}});
  const q=[['Why are food chains usually limited to four or five trophic levels?','energy is lost as heat at each transfer',['nutrients run out','predators are too large','producers cannot support herbivores']],['Energy in an ecosystem','flows in one direction and is lost as heat',['cycles back to producers','is recycled by decomposers','increases at higher trophic levels']],['Which organisms release nutrients from dead matter back to the ecosystem?','decomposers',['producers','primary consumers','tertiary consumers']],['The energy available to consumers is best represented by','net primary productivity',['gross primary productivity','respiration','sunlight reaching the ground']]];
  PROBS.push({id:'ef-fact',topic:'energyflow',title:'Energy flow facts',gen(){const p=pick(q),m=mcq(p[1],p[2]);return {q:p[0],choices:m.choices,ans:m.ans,hint:'Energy is lost, matter cycles.',sol:`<b>${p[1]}</b>.`};}});
})();
