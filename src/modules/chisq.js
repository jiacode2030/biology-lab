/* ---------------- Chi-square test ---------------- */
(function chisq(){
  const cv=$('#cs-canvas');if(!cv)return;
  let n=200,o=162;
  const calc=()=>{const e1=n*.75,e2=n*.25,o2=n-o;return {e1,e2,o2,chi:(o-e1)*(o-e1)/e1+(o2-e2)*(o2-e2)/e2};};
  const sim=sim2d(cv,{h:w=>clamp(w*.5,240,330),draw(ctx,w,h){const c=calc(),L=44,R=w-16,T0=20,B=h-36,mx=Math.max(n,10),y=v=>B-v/mx*(B-T0),bw=(R-L)/6;
    ctx.strokeStyle=T.ink;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(L,T0);ctx.lineTo(L,B);ctx.lineTo(R,B);ctx.stroke();
    [[c.e1,c.e2,'expected'],[o,c.o2,'observed']].forEach(([a,b,nm],i)=>{const x0=L+bw*(1+i*2.2);[[a,T.cx],[b,T.ca]].forEach(([v,col],j)=>{ctx.fillStyle=alpha(col,i?.85:.35);ctx.fillRect(x0+j*bw*.95,y(v),bw*.9,B-y(v));ctx.strokeStyle=col;ctx.lineWidth=2;ctx.strokeRect(x0+j*bw*.95,y(v),bw*.9,B-y(v));label(ctx,fmt(v,v%1?1:0),x0+j*bw*.95+bw*.45,y(v)-8,T.ink,'center','middle',MONO);});label(ctx,nm,x0+bw*.93,B+16,T.ink,'center','middle',MONO);});
    label(ctx,'blue: dominant · pink: recessive',w/2,10,T.muted,'center','middle',MONO);}});
  function upd(){const sl=$('#cs-o');sl.max=n;if(o>n){o=n;sl.value=n;setText('cs-o-out',String(o));}const c=calc();setText('cs-chi',fmt(c.chi,2));setText('cs-df','1');setText('cs-crit','3.84');setText('cs-dec',c.chi<3.84?'fail to reject: fits 3 : 1':'reject: not just chance');sim.render();}
  bindRange('cs-n',v=>String(v),v=>{n=v;upd();});bindRange('cs-o',v=>String(v),v=>{o=v;upd();});
  $('#cs-lab').addEventListener('labreset',()=>{n=200;o=162;$('#cs-n').value=200;$('#cs-o').max=400;$('#cs-o').value=162;setText('cs-n-out','200');setText('cs-o-out','162');upd();});
  upd();drawers.chisq=()=>sim.render();
  KEYS['cs-canvas']=['Move the observed count and watch χ². Compare it with 3.84 for 1 degree of freedom.',[['cx','dominant'],['ca','recessive']]];
  TIPS['cs-o']=()=>'Expected is 75% of the total. The farther observed is from that, the bigger χ².';
  GLOSS['chi-square']='A statistic, Σ(o − e)²/e, that measures how far observed counts are from expected counts.';GLOSS['null hypothesis']='The statement that any difference between observed and expected is due only to chance.';
  TT.chisq='Have students predict whether a given deviation passes before sliding, then explain why a larger total changes the verdict.';
})();
(function(){
  const chi=(o,e)=>o.reduce((s,x,i)=>s+(x-e[i])*(x-e[i])/e[i],0);
  PROBS.push({id:'cs-two',topic:'chisq',title:'Chi-square for a 3 : 1 cross',gen(){const n=pick([80,120,160,200,240]),e1=n*.75,o1=Math.round(e1+pick([-1,1])*randInt(2,Math.round(n*.07))),o2=n-o1,ans=chi([o1,o2],[e1,n*.25]);
    return {q:`A cross is expected to give a 3 : 1 ratio. Of ${n} offspring, ${o1} show the dominant phenotype and ${o2} the recessive. Calculate χ².`,ans,unit:'',abs:.02,chk:(o1-e1)**2/e1+(o2-n*.25)**2/(n*.25),hint:'Expected = 3/4 and 1/4 of the total. Then Σ(o − e)²/e.',sol:`Expected ${fmt(e1,1)} and ${fmt(n*.25,1)}. χ² = (${o1}−${fmt(e1,1)})²/${fmt(e1,1)} + (${o2}−${fmt(n*.25,1)})²/${fmt(n*.25,1)} = <b>${fmt(ans,2)}</b>.`};}});
  PROBS.push({id:'cs-df',topic:'chisq',title:'Degrees of freedom',gen(){const k=pick([2,3,4,6]),m=mcq(String(k-1),[String(k-1),String(k),String(k+1),String(k-2<1?k+2:k-2)]);
    return {q:`A chi-square test compares observed counts to an expected ratio with ${k} phenotype classes. How many degrees of freedom?`,choices:m.choices,ans:m.ans,hint:'Categories minus one.',sol:`df = ${k} − 1 = <b>${k-1}</b>.`};}});
  PROBS.push({id:'cs-decide',topic:'chisq',title:'Reject or fail to reject?',gen(){const df=pick([1,2,3]),crit={1:3.84,2:5.99,3:7.81}[df],x=+(crit+pick([-1,1])*(.4+Math.random()*2)).toFixed(2),rej=x>crit,ans=rej?'reject the null hypothesis':'fail to reject the null hypothesis',m=mcq(ans,['reject the null hypothesis','fail to reject the null hypothesis','accept the null hypothesis','prove the alternative hypothesis']);
    return {q:`A test gives χ² = ${x} with ${df} degree${df>1?'s':''} of freedom. The critical value at p = 0.05 is ${crit}. The correct conclusion is to`,choices:m.choices,ans:m.ans,hint:'Compare χ² with the critical value. Bigger means reject.',sol:`${x} is ${rej?'greater':'less'} than ${crit}, so you <b>${ans}</b>.`};}});
})();
