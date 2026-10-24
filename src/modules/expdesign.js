/* ---------------- Experimental design ---------------- */
(function expdesign(){
  const cv=$('#ed-canvas');if(!cv)return;
  const SC={
    pl:{iv:'amount of fertilizer',dv:'plant height after 3 weeks (cm)',ct:'no fertilizer (water only)',co:'species, light, soil, watering, pot size',groups:['0 g (control)','2 g','4 g','8 g']},
    en:{iv:'temperature of the reaction',dv:'volume of O₂ gas in 2 minutes (mL)',ct:'catalase at room temperature (22 °C)',co:'volume of H₂O₂, catalase amount, pH, time',groups:['22 °C (control)','4 °C','37 °C','60 °C']},
    ye:{iv:'type of sugar added',dv:'CO₂ produced in 10 minutes (mL)',ct:'yeast in water with no sugar',co:'yeast mass, water volume, temperature, time',groups:['no sugar (control)','glucose','sucrose','lactose']}};
  let sc='pl',rep=3;
  const sim=sim2d(cv,{h:w=>clamp(w*.5,230,310),draw(ctx,w,h){const g=SC[sc].groups,gw=(w-30)/4;ctx.font=MONO;
    g.forEach((nm,i)=>{const x=15+i*gw+4,col=i?T.ca:T.cx,bw=gw-8,by=44,bh=h-96;ctx.fillStyle=alpha(col,.14);ctx.fillRect(x,by,bw,bh);ctx.strokeStyle=col;ctx.lineWidth=2;ctx.strokeRect(x,by,bw,bh);
      const cols=Math.min(rep,5);for(let k=0;k<rep;k++){const cx=x+bw/2+((k%cols)-(cols-1)/2)*Math.min(20,bw/6),cy=by+bh/2+(Math.floor(k/cols)-.5)*24;dot2(ctx,cx,cy,col,7);}
      label(ctx,nm,x+bw/2,by-10,T.ink,'center','middle',MONO);label(ctx,i?'treatment':'control',x+bw/2,by+bh+16,col,'center','middle',MONO);});
    label(ctx,'independent variable: '+SC[sc].iv,w/2,12,T.muted,'center','middle',MONO);label(ctx,'each dot = one replicate',w/2,h-8,T.muted,'center','middle',MONO);}});
  function upd(){const s=SC[sc];setText('ed-iv',s.iv);setText('ed-dv',s.dv);setText('ed-ct',s.ct);setText('ed-co',s.co);setText('ed-rep',String(rep*4));sim.render();}
  segBind('ed-sc','k',v=>{sc=v;upd();});bindRange('ed-n',v=>String(v),v=>{rep=v;upd();});
  $('#ed-lab').addEventListener('labreset',()=>{sc='pl';rep=3;setCtl('ed-n',3);segSet('ed-sc',0);upd();});
  upd();drawers.expdesign=()=>sim.render();
  KEYS['ed-canvas']=['The blue box is the control; pink boxes get the treatment. Dots are replicates.',[['cx','control group'],['ca','treatment group']]];
  TIPS['ed-n']=()=>'Replicates show how much results vary naturally, so you can tell a real difference from noise.';
  GLOSS['independent variable']='The factor the experimenter changes on purpose.';GLOSS['dependent variable']='The factor measured in response to the change.';GLOSS['control group']='The group that does not receive the treatment, used as a baseline.';
  TT.expdesign='Have students name the variables for a scenario of their own before checking the labels.';
})();
(function(){
  const vars=[
   {q:'A student grows bean plants under different amounts of fertilizer and measures height after three weeks. Which is the independent variable?',a:'amount of fertilizer',d:['plant height','number of plants','light level'],r:'The student changes the fertilizer on purpose; plant height is what gets measured.'},
   {q:'Catalase activity is measured at 4, 22, 37 and 60 °C by collecting the oxygen released in 2 minutes. Which is the dependent variable?',a:'volume of oxygen released',d:['temperature','time (2 minutes)','amount of catalase'],r:'The oxygen volume is what is measured in response to the temperature, which is the variable being changed.'},
   {q:'Yeast is given glucose, sucrose or lactose and the CO₂ made in 10 minutes is measured. Which is held constant?',a:'temperature and yeast mass',d:['type of sugar','CO₂ produced','nothing; all variables change'],r:'Only the sugar should change, so other factors such as temperature and yeast mass stay the same and any difference comes from the sugar.'},
   {q:'A drug is tested on mice. Which is the best control group?',a:'mice given an inactive substance in the same way',d:['mice given twice the dose','mice that are older','no mice measured'],r:'A placebo given the same way controls for handling and injection, so the drug is the only difference between the groups.'}];
  PROBS.push({id:'ed-var',topic:'expdesign',title:'Name the variable',gen(){const v=pick(vars),m=mcq(v.a,v.d);return {q:v.q,choices:m.choices,ans:m.ans,hint:'Independent: changed by the experimenter. Dependent: measured. Control: baseline with no treatment.',sol:`<b>${v.a}</b>. ${v.r}`};}});
  PROBS.push({id:'ed-samples',topic:'expdesign',title:'Counting samples',gen(){const g=randInt(3,6),r=randInt(3,8),ans=g*r;return {q:`A test uses ${g} groups (including the control) with ${r} replicate samples in each group. How many samples are needed in total?`,ans,unit:'samples',tol:0,chk:g*r,hint:'Groups × replicates.',sol:`${g} × ${r} = <b>${ans}</b> samples.`};}});
})();
