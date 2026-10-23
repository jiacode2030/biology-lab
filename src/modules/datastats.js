/* ---------------- Data, graphs & statistics ---------------- */
(function datastats(){
  const cv=$('#ds-canvas');if(!cv)return;
  let kind='sd',ma=20,mb=26,sd=6,n=10;
  const sem=()=>sd/Math.sqrt(n),bar=()=>kind==='sd'?sd:kind==='sem'?sem():2*sem();
  const sim=sim2d(cv,{h:w=>clamp(w*.55,260,360),draw(ctx,w,h){const L=50,R=w-16,T0=18,B=h-34,y=v=>B-(v/50)*(B-T0);
    ctx.strokeStyle=T.muted;ctx.lineWidth=1;ctx.fillStyle=T.muted;ctx.font=MONO;
    for(let v=0;v<=50;v+=10){ctx.globalAlpha=.25;ctx.beginPath();ctx.moveTo(L,y(v));ctx.lineTo(R,y(v));ctx.stroke();ctx.globalAlpha=1;label(ctx,String(v),L-6,y(v),T.muted,'right','middle',MONO);}
    ctx.strokeStyle=T.ink;ctx.beginPath();ctx.moveTo(L,T0);ctx.lineTo(L,B);ctx.lineTo(R,B);ctx.stroke();
    const bw=(R-L)/5;[[ma,'A',T.cx,L+bw*1],[mb,'B',T.ca,L+bw*3]].forEach(([m,nm,col,x0])=>{ctx.fillStyle=alpha(col,.55);ctx.fillRect(x0,y(m),bw,B-y(m));ctx.strokeStyle=col;ctx.lineWidth=2;ctx.strokeRect(x0,y(m),bw,B-y(m));
      const e=bar(),cx=x0+bw/2;ctx.strokeStyle=T.ink;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,y(m+e));ctx.lineTo(cx,y(Math.max(0,m-e)));ctx.moveTo(cx-9,y(m+e));ctx.lineTo(cx+9,y(m+e));ctx.moveTo(cx-9,y(Math.max(0,m-e)));ctx.lineTo(cx+9,y(Math.max(0,m-e)));ctx.stroke();
      label(ctx,'group '+nm,cx,B+16,T.ink,'center','middle',MONO);});
    label(ctx,'bars: mean · error bar: '+(kind==='sd'?'± 1 SD':kind==='sem'?'± 1 SEM':'± 2 SEM'),w/2,10,T.muted,'center','middle',MONO);}});
  function upd(){const e2=2*sem(),gap=Math.abs(mb-ma)-2*e2;setText('ds-sem',fmt(sem(),2));setText('ds-diff',fmt(mb-ma,0));setText('ds-ov',gap>0?'do not overlap: difference likely real':'overlap: no clear difference');sim.render();}
  segBind('ds-kind','k',v=>{kind=v;upd();});
  bindRange('ds-ma',v=>String(v),v=>{ma=v;upd();});bindRange('ds-mb',v=>String(v),v=>{mb=v;upd();});bindRange('ds-sd',v=>fmt(v,1),v=>{sd=v;upd();});bindRange('ds-n',v=>String(v),v=>{n=v;upd();});
  $('#ds-lab').addEventListener('labreset',()=>{[['ds-ma',20],['ds-mb',26],['ds-sd',6],['ds-n',10]].forEach(([id,v])=>{$('#'+id).value=v;});ma=20;mb=26;sd=6;n=10;setText('ds-ma-out','20');setText('ds-mb-out','26');setText('ds-sd-out','6.0');setText('ds-n-out','10');kind='sd';$$('#ds-kind button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===0)));upd();});
  upd();drawers.datastats=()=>sim.render();
  KEYS['ds-canvas']=['Switch the error bar type and watch how the bars change. Only 2 × SEM bars are used to judge overlap.',[['cx','group A'],['ca','group B']]];
  TIPS['ds-n']=()=>'SEM = SD/√n: more measurements, smaller SEM, tighter error bars.';
  GLOSS['standard deviation']='A measure of how spread out individual measurements are around the mean.';GLOSS['sem']='Standard error of the mean, SD/√n: how precisely the sample mean estimates the true mean.';
  TT.datastats='Ask students to predict overlap before moving each slider, then explain which of SD or n is responsible.';
})();
(function(){
  const sdOf=a=>{const m=a.reduce((s,x)=>s+x,0)/a.length;return Math.sqrt(a.reduce((s,x)=>s+(x-m)*(x-m),0)/(a.length-1));};
  PROBS.push({id:'ds-mean',topic:'datastats',title:'Mean and sample SD',gen(){const m=randInt(8,20),d=[randInt(-3,3),randInt(-3,3),randInt(-3,3),randInt(-3,3)];d.push(-d.reduce((s,x)=>s+x,0));if(d.every(x=>x===0))d[0]=2,d[4]=-2;const x=d.map(v=>m+v),sd=sdOf(x);
    return {q:`Five measurements (mm): ${x.join(', ')}. Find the sample standard deviation (divide by n − 1).`,ans:sd,unit:'mm',abs:.02,chk:sdOf(x),hint:'Find the mean, square the deviations, add, divide by 4, take the square root.',sol:`Mean = ${m}. Σ(x − mean)² = ${fmt(d.reduce((s,v)=>s+v*v,0),0)}. SD = √(${fmt(d.reduce((s,v)=>s+v*v,0),0)}/4) = <b>${fmt(sd,2)} mm</b>.`};}});
  PROBS.push({id:'ds-sem',topic:'datastats',title:'Standard error of the mean',gen(){const sd=pick([2,3,4,5,6,8]),n=pick([4,9,16,25,36,64]),ans=sd/Math.sqrt(n);
    return {q:`A sample of n = ${n} has SD = ${sd}. What is the standard error of the mean?`,ans,unit:'',abs:.011,chk:sd/Math.sqrt(n),hint:'SEM = SD/√n.',sol:`SEM = ${sd}/√${n} = ${sd}/${Math.sqrt(n)} = <b>${fmt(ans,2)}</b>.`};}});
  PROBS.push({id:'ds-overlap',topic:'datastats',title:'Do the error bars overlap?',gen(){const sem=pick([1,1.5,2,2.5]),gap=pick([-3,-1,1,3])*sem/1.5,ma=randInt(10,20),mb=ma+4*sem+gap;const sep=Math.abs(mb-ma)>4*sem,ans=sep?'No: the means likely differ':'Yes: no clear difference',m=mcq(ans,['No: the means likely differ','Yes: no clear difference','Cannot tell without the SD','Only if n is the same']);
    return {q:`Group A has mean ${ma} and group B has mean ${fmt(mb,1)}. Each has SEM = ${sem}. Do the 2 × SEM error bars overlap?`,choices:m.choices,ans:m.ans,hint:'Each bar extends 2 × SEM from its mean. They overlap if the means are closer than 4 × SEM.',sol:`The means differ by ${fmt(Math.abs(mb-ma),1)}; 4 × SEM = ${4*sem}. ${sep?'The difference is larger, so the bars do not overlap.':'The difference is not larger, so the bars overlap.'}`};}});
})();
