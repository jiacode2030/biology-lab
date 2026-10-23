/* ---------------- Enzymes & activation energy ---------------- */
(function enzymes(){
  const cv=$('#en-canvas');if(!cv)return;
  let inh='none',S=20,E=5;const Km=20;
  const vmax=(i)=>10*E*(i==='nonc'?.5:1),kmap=(i)=>Km*(i==='comp'?3:1),rate=(s,i)=>vmax(i)*s/(kmap(i)+s);
  const sim=sim2d(cv,{h:w=>clamp(w*.52,250,340),draw(ctx,w,h){const A=axes2(ctx,w,h,{x0:0,x1:100,y0:0,y1:100,xt:20,yt:20,xl:'substrate concentration',yl:'rate'});
    if(inh!=='none'){ctx.setLineDash([5,4]);curve2(ctx,A,s=>rate(s,'none'),0,100,T.muted,2);ctx.setLineDash([]);}
    curve2(ctx,A,s=>rate(s,inh),0,100,inh==='none'?T.cx:T.ca);ctx.setLineDash([3,4]);ctx.strokeStyle=T.muted;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(A.L,A.Y(vmax(inh)));ctx.lineTo(A.R,A.Y(vmax(inh)));ctx.stroke();ctx.setLineDash([]);
    label(ctx,'Vmax',A.R-4,A.Y(vmax(inh))-8,T.muted,'right','middle',MONO);dot2(ctx,A.X(S),A.Y(rate(S,inh)),T.accent,6);
    if(inh!=='none')label(ctx,'dashed: no inhibitor',A.R-4,A.T0+6,T.muted,'right','middle',MONO);}});
  function upd(){const v=rate(S,inh),r=v/vmax(inh);setText('en-v',fmt(v,1));setText('en-pct',fmt(100*v/(10*E),0)+'% of the uninhibited maximum');setText('en-lim',r<.5?'substrate concentration (rate still rising)':r<.9?'substrate and enzyme':inh==='nonc'?'enzyme (a lower ceiling because of the inhibitor)':'enzyme amount (saturated)');sim.render();}
  segBind('en-inh','k',v=>{inh=v;upd();});bindRange('en-s',v=>String(v),v=>{S=v;upd();});bindRange('en-e',v=>String(v),v=>{E=v;upd();});
  $('#en-lab').addEventListener('labreset',()=>{inh='none';S=20;E=5;segSet('en-inh',0);setCtl('en-s',20);setCtl('en-e',5);upd();});upd();
  /* energy profile */
  let rx='exo',cat=false;
  const P=()=>rx==='exo'?{r:50,p:20,ea:cat?30:60}:{r:20,p:50,ea:cat?50:80};
  const sim2=sim2d($('#en-canvas2'),{h:w=>clamp(w*.4,210,280),draw(ctx,w,h){const q=P(),A=axes2(ctx,w,h,{x0:0,x1:1,y0:0,y1:130,xl:'reaction progress',yl:'energy',L:34}),peak=q.r+q.ea,mid=(q.r+q.p)/2,E0=x=>{const s=Math.max(0,Math.min(1,(x-.3)/.4)),sm=s*s*(3-2*s);return q.r+(q.p-q.r)*sm+(peak-mid)*Math.exp(-Math.pow((x-.5)/.13,2));};
    ctx.setLineDash([4,4]);ctx.strokeStyle=T.muted;ctx.lineWidth=1.2;[[q.r,.02,.4,'reactants'],[q.p,.6,.98,'products']].forEach(([v,a,b,nm])=>{ctx.beginPath();ctx.moveTo(A.X(a),A.Y(v));ctx.lineTo(A.X(b),A.Y(v));ctx.stroke();});ctx.setLineDash([]);
    if(cat){ctx.setLineDash([5,4]);const pk=q.r+(rx==='exo'?60:80);const E1=x=>{const s=Math.max(0,Math.min(1,(x-.3)/.4)),sm=s*s*(3-2*s);return q.r+(q.p-q.r)*sm+(pk-mid)*Math.exp(-Math.pow((x-.5)/.13,2));};curve2(ctx,A,E1,.02,.98,T.muted,2);ctx.setLineDash([]);}
    curve2(ctx,A,E0,.02,.98,cat?T.cv:T.ca);
    ctx.strokeStyle=T.ink;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(A.X(.14),A.Y(q.r));ctx.lineTo(A.X(.14),A.Y(peak));ctx.stroke();label(ctx,'Ea',A.X(.14)-6,A.Y((q.r+peak)/2),T.ink,'right','middle',MONO);
    ctx.beginPath();ctx.moveTo(A.X(.9),A.Y(q.r));ctx.lineTo(A.X(.9),A.Y(q.p));ctx.stroke();label(ctx,'ΔG',A.X(.9)+6,A.Y((q.r+q.p)/2),T.ink,'left','middle',MONO);
    label(ctx,'reactants',A.X(.2),A.Y(q.r)+(q.r<q.p?14:-10),T.muted,'center','middle',MONO);label(ctx,'products',A.X(.8),A.Y(q.p)+(q.p<q.r?14:-10),T.muted,'center','middle',MONO);if(cat)label(ctx,'dashed: without enzyme',A.R-4,A.T0+6,T.muted,'right','middle',MONO);}});
  function upd2(){const q=P();setText('en-ea',q.ea+' kJ/mol'+(cat?' (lowered)':''));setText('en-dg',(q.p-q.r>0?'+':'')+(q.p-q.r)+' kJ/mol');setText('en-cm',cat?'faster; same ΔG':rx==='exo'?'spontaneous but slow without help':'needs energy input; enzyme does not change that');sim2.render();}
  segBind('en-rx','k',v=>{rx=v;upd2();});$('#en-cat').addEventListener('click',()=>{cat=!cat;$('#en-cat').textContent=cat?'Remove enzyme':'Add enzyme';upd2();});
  $('#en-lab2').addEventListener('labreset',()=>{rx='exo';cat=false;segSet('en-rx',0);$('#en-cat').textContent='Add enzyme';upd2();});upd2();
  drawers.enzymes=()=>{sim.render();sim2.render();};
  KEYS['en-canvas']=['The dashed curve has no inhibitor. The dot is the current substrate concentration.',[['cx','no inhibitor'],['ca','with inhibitor']]];
  KEYS['en-canvas2']=['Ea is the height of the hill. ΔG is the difference between the start and end levels.',[['ca','uncatalyzed'],['cv','with enzyme']]];
  TIPS['en-s']=()=>'Low substrate: rate is limited by substrate. High substrate: every enzyme is busy and the curve levels off.';
  GLOSS['active site']='The region of an enzyme where the substrate binds and the reaction occurs.';GLOSS['activation energy']='The energy needed to start a reaction. Enzymes lower it.';GLOSS['competitive inhibitor']='A molecule that competes with the substrate for the active site.';GLOSS['noncompetitive inhibitor']='A molecule that binds elsewhere and changes the enzyme\'s shape, lowering its activity.';GLOSS['induced fit']='Slight change of the active site\'s shape when the substrate binds.';
  TT.enzymes='Have students predict whether each inhibitor can be overcome by adding substrate, then check with the lab.';
})();
(function(){
  PROBS.push({id:'en-ea',topic:'enzymes',title:'New activation energy',gen(){const ea=pick([60,70,80,90,100]),d=pick([20,25,30,35]),ans=ea-d;return {q:`A reaction has an activation energy of ${ea} kJ/mol. An enzyme lowers it by ${d} kJ/mol. What is the new activation energy?`,ans,unit:'kJ/mol',tol:0,chk:ea-d,hint:'Subtract the decrease.',sol:`${ea} − ${d} = <b>${ans} kJ/mol</b>. ΔG is unchanged.`};}});
  const inh=[['The reaction is slowed by a molecule that resembles the substrate. Adding much more substrate restores nearly the full rate. This inhibitor is','competitive'],['An inhibitor binds to a site other than the active site and the maximum rate falls. Adding more substrate does not restore it. This inhibitor is','noncompetitive (allosteric)']];
  PROBS.push({id:'en-inh',topic:'enzymes',title:'Type of inhibitor',gen(){const p=pick(inh),m=mcq(p[1],['competitive','noncompetitive (allosteric)','a cofactor','a substrate'].filter(x=>x!==p[1]));return {q:p[0],choices:m.choices,ans:m.ans,hint:'Can more substrate overcome it?',sol:`<b>${p[1]}</b>.`};}});
  const fx=[['Which quantity is NOT changed by an enzyme?','the ΔG of the reaction',['the activation energy','the rate','the time to reach equilibrium']],['An enzyme speeds a reaction by','lowering the activation energy',['raising the temperature of the cell','adding energy to the substrate','changing the products']],['After a reaction, the enzyme is','unchanged and able to catalyze again',['used up','converted to the product','broken into amino acids']]];
  PROBS.push({id:'en-fx',topic:'enzymes',title:'What enzymes do',gen(){const p=pick(fx),m=mcq(p[1],p[2]);return {q:p[0],choices:m.choices,ans:m.ans,hint:'Enzymes are catalysts.',sol:`<b>${p[1]}</b>.`};}});
})();
