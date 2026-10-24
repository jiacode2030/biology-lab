/* ---------------- Temperature, pH & enzyme activity ---------------- */
(function enzyenv(){
  const cv=$('#ee-canvas');if(!cv)return;
  const EN={pep:{t:37,ph:2,wT:12,name:'pepsin'},try:{t:37,ph:8,wT:12,name:'trypsin'},taq:{t:72,ph:8.3,wT:25,name:'Taq polymerase'}};
  let en='pep',Tc=37,pH=7;
  const fT=(t,e)=>t<=e.t?Math.pow(2,(t-e.t)/10):Math.max(0,1-Math.pow((t-e.t)/e.wT,2)),fP=(p,e)=>Math.exp(-Math.pow((p-e.ph)/1.3,2));
  const sim=sim2d(cv,{h:w=>clamp(w*.4,230,300),draw(ctx,w,h){const e=EN[en];
    [[0,100,'temperature (°C)',20,x=>fT(x,e),Tc,T.ca],[1,13,'pH',2,x=>fP(x,e),pH,T.cx]].forEach(([a,b,xl,xt,f,cur,col],i)=>{ctx.save();ctx.translate(i*w/2,0);const A=axes2(ctx,w/2,h,{x0:a,x1:b,y0:0,y1:1.05,xt,yt:.25,xl,yl:i?'':'relative activity',L:i?14:40});curve2(ctx,A,f,a,b,col);dot2(ctx,A.X(cur),A.Y(f(cur)),T.accent,6);ctx.restore();});}});
  function upd(){const e=EN[en],a=fT(Tc,e),b=fP(pH,e);setText('ee-ft',fmt(a*100,0)+'%');setText('ee-fp',fmt(b*100,0)+'%');setText('ee-all',fmt(a*b*100,0)+'%');
    setText('ee-st',a*b>.7?'near the optimum':Tc>e.t&&a<.2?'heat has denatured the enzyme':a*b<.1?(b<.2?'wrong pH: charges on R groups change and the shape is lost':'too cold: molecules move slowly'):'below the best conditions');sim.render();}
  segBind('ee-en','k',v=>{en=v;upd();});bindRange('ee-t',v=>v+' °C',v=>{Tc=v;upd();});bindRange('ee-ph',v=>fmt(v,1),v=>{pH=v;upd();});
  $('#ee-lab').addEventListener('labreset',()=>{en='pep';Tc=37;pH=7;segSet('ee-en',0);setCtl('ee-t',37,v=>v+' °C');setCtl('ee-ph',7,v=>fmt(v,1));upd();});
  upd();drawers.enzyenv=()=>sim.render();
  KEYS['ee-canvas']=['Left: activity against temperature. Right: against pH. The dots mark your settings. This is a simplified model.',[['ca','temperature'],['cx','pH']]];
  TIPS['ee-t']=()=>'Rate rises with temperature up to the optimum, then drops fast as the enzyme denatures.';
  GLOSS['optimum']='The condition (temperature or pH) at which an enzyme is most active.';GLOSS['denature']='To lose normal 3-D shape, usually losing function.';
  TT.enzyenv='Ask which enzyme is damaged first when the temperature rises, and why.';
})();
(function(){
  PROBS.push({id:'ee-opt',topic:'enzyenv',title:'Find the optimum',gen(){const opt=pick([30,35,40,45,50]),ts=[opt-20,opt-10,opt,opt+10,opt+20],vs=[25,55,100,40,5],i=randInt(0,4);const tbl=`<table class="lmtbl"><thead><tr><th>temperature (°C)</th>${ts.map(t=>`<th>${t}</th>`).join('')}</tr></thead><tbody><tr><th>relative rate</th>${vs.map(v=>`<td>${v}</td>`).join('')}</tbody></table>`;
    return {q:`An enzyme's rate was measured at several temperatures. Which temperature is closest to the optimum?${tbl}`,ans:opt,unit:'°C',tol:0,chk:ts[vs.indexOf(Math.max(...vs))],hint:'Look for the highest rate.',sol:`The highest rate (100) is at <b>${opt} °C</b>.`};}});
  const why=[['Above its optimum temperature an enzyme\'s rate falls because','the enzyme denatures and the active site no longer fits the substrate',['peptide bonds are formed','the substrate disappears','the reaction becomes endergonic'],'Heat breaks the weak bonds that hold the enzyme\'s shape, so the active site changes and the substrate no longer binds.'],['Pepsin works best at pH 2 because','it evolved to function in the acidic stomach',['it needs a base to work','its substrate is acid','it has no R groups'],'Pepsin works in the stomach, where the pH is about 2, so its shape and charges work best there.'],['Below its optimum temperature an enzyme is slow mainly because','molecules collide less often and with less energy',['the enzyme is denatured','the active site is destroyed','ATP is used up'],'Cold molecules move slowly, so enzyme and substrate meet less often and fewer collisions have enough energy to react.']];
  PROBS.push({id:'ee-why',topic:'enzyenv',title:'Why activity changes',gen(){const p=pick(why),m=mcq(p[1],p[2]);return {q:p[0],choices:m.choices,ans:m.ans,hint:'Link shape and collisions to the observation.',sol:`<b>${p[1]}</b>. ${p[3]}`};}});
  PROBS.push({id:'ee-q10',topic:'enzyenv',title:'Rate with Q10',gen(){const r=pick([4,6,8,10]),dt=pick([10,20]),ans=r*Math.pow(2,dt/10);return {q:`An enzyme-catalysed reaction runs at ${r} µmol/min at 20 °C. Assuming Q10 = 2 and no denaturation, what is the rate at ${20+dt} °C?`,ans,unit:'µmol/min',abs:.05,chk:r*Math.pow(2,dt/10),hint:'Multiply by 2 for every 10 °C.',sol:`${r} × 2<sup>${dt/10}</sup> = <b>${ans} µmol/min</b>.`};}});
})();
