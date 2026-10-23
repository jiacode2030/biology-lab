/* ---------------- Linked genes & recombination ---------------- */
(function linkage(){
  const cv=$('#lk-canvas');if(!cv)return;
  let d=12,n=1000;
  const sim=sim2d(cv,{h:w=>clamp(w*.5,250,330),draw(ctx,w,h){const r=d/100,par=n*(1-r)/2,rec=n*r/2,L=30,R=w-30,cy=34;
    ctx.strokeStyle=T.ink;ctx.lineWidth=8;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(L,cy);ctx.lineTo(R,cy);ctx.stroke();ctx.lineCap='butt';const xa=L+(R-L)*.15,xb=xa+(R-L)*.7*d/50;ctx.strokeStyle=T.ca;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(xa,cy-14);ctx.lineTo(xa,cy+14);ctx.moveTo(xb,cy-14);ctx.lineTo(xb,cy+14);ctx.stroke();label(ctx,'A',xa,cy-24,T.ca,'center','middle',MONO);label(ctx,'B',xb,cy-24,T.ca,'center','middle',MONO);label(ctx,d+' map units',(xa+xb)/2,cy+24,T.muted,'center','middle',MONO);
    const top=cy+40,B=h-30,bw=(R-L)/6.5,mx=n/2;
    ctx.strokeStyle=T.ink;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(L,top);ctx.lineTo(L,B);ctx.lineTo(R,B);ctx.stroke();
    [['AB',par,T.cx,'parental'],['ab',par,T.cx,'parental'],['Ab',rec,T.accent,'recombinant'],['aB',rec,T.accent,'recombinant']].forEach(([nm,v,c,k],i)=>{const x=L+bw*(.4+i*1.55),bh=(B-top-14)*v/mx;ctx.fillStyle=alpha(c,.7);ctx.fillRect(x,B-bh,bw,bh);ctx.strokeStyle=c;ctx.lineWidth=2;ctx.strokeRect(x,B-bh,bw,bh);label(ctx,fmt(v,0),x+bw/2,B-bh-9,T.ink,'center','middle',MONO);label(ctx,nm,x+bw/2,B+13,T.ink,'center','middle',MONO);});}});
  function upd(){const r=d/100;setText('lk-par',fmt(n*(1-r),0));setText('lk-rec',fmt(n*r,0));setText('lk-f',d+'% = '+d+' map units');sim.render();}
  bindRange('lk-d',v=>String(v),v=>{d=v;upd();});bindRange('lk-n',v=>String(v),v=>{n=v;upd();});
  $('#lk-lab').addEventListener('labreset',()=>{d=12;n=1000;setCtl('lk-d',12);setCtl('lk-n',1000);upd();});upd();
  let pa=5,pb=15,pc=21;
  const sim2=sim2d($('#lk-canvas2'),{h:w=>clamp(w*.3,160,210),draw(ctx,w,h){const L=30,R=w-30,cy=h*.42,X=p=>L+(R-L)*p/60;ctx.strokeStyle=T.ink;ctx.lineWidth=8;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(L,cy);ctx.lineTo(R,cy);ctx.stroke();ctx.lineCap='butt';
    [['A',pa],['B',pb],['C',pc]].forEach(([nm,p],i)=>{ctx.strokeStyle=[T.cx,T.ca,T.cv][i];ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(X(p),cy-14);ctx.lineTo(X(p),cy+14);ctx.stroke();label(ctx,nm,X(p),cy-26+(i%2)*0,T.ink,'center','middle',MONO);});
    label(ctx,'positions in map units (0–60)',w/2,h-10,T.muted,'center','middle',MONO);}});
  const rf=(a,b)=>Math.min(Math.abs(a-b),50);
  function upd2(){setText('lk-ab',fmt(rf(pa,pb),0)+'%'+(Math.abs(pa-pb)>50?' (max)':''));setText('lk-bc',fmt(rf(pb,pc),0)+'%'+(Math.abs(pb-pc)>50?' (max)':''));setText('lk-ac',fmt(rf(pa,pc),0)+'%'+(Math.abs(pa-pc)>50?' (max)':''));setText('lk-ord',[['A',pa],['B',pb],['C',pc]].sort((x,y)=>x[1]-y[1]).map(x=>x[0]).join(' – '));sim2.render();}
  bindRange('lk-pa',v=>String(v),v=>{pa=v;upd2();});bindRange('lk-pb',v=>String(v),v=>{pb=v;upd2();});bindRange('lk-pc',v=>String(v),v=>{pc=v;upd2();});
  $('#lk-lab2').addEventListener('labreset',()=>{pa=5;pb=15;pc=21;setCtl('lk-pa',5);setCtl('lk-pb',15);setCtl('lk-pc',21);upd2();});upd2();
  drawers.linkage=()=>{sim.render();sim2.render();};
  KEYS['lk-canvas']=['Blue: parental types (most common if the genes are linked). Orange: recombinants.',[['cx','parental'],['accent','recombinant']]];
  KEYS['lk-canvas2']=['Move the genes. The largest recombination frequency is between the two outer genes.',[['cx','gene A'],['ca','gene B'],['cv','gene C']]];
  TIPS['lk-d']=()=>'The farther apart, the more often a crossover separates the genes. 50% looks unlinked.';
  GLOSS['linked genes']='Genes close together on the same chromosome that tend to be inherited together.';GLOSS['recombinant']='An offspring with a combination of alleles different from either parent\'s chromosomes.';GLOSS['map unit']='A distance corresponding to 1% recombination frequency (a centimorgan).';
  TT.linkage='Ask students which classes are parental and which are recombinant before counting.';
})();
(function(){
  PROBS.push({id:'lk-rf',topic:'linkage',title:'Recombination frequency',gen(){const n=pick([500,800,1000,2000]),r=pick([.04,.06,.08,.1,.12,.15,.2,.25]),rec=Math.round(n*r),ans=rec/n*100;return {q:`In a test cross, ${n} offspring were counted and ${rec} of them were recombinants. What is the distance between the genes in map units?`,ans,unit:'map units',abs:.06,chk:rec*100/n,hint:'Recombinants divided by total, times 100.',sol:`${rec}/${n} × 100 = <b>${fmt(ans,1)} map units</b>.`};}});
  PROBS.push({id:'lk-exp',topic:'linkage',title:'Expected recombinants',gen(){const n=pick([500,1000,2000]),dd=pick([5,10,12,20,30]),ans=n*dd/100;return {q:`Two genes are ${dd} map units apart. In a test cross with ${n} offspring, how many recombinants do you expect?`,ans,unit:'',abs:.5,chk:n*dd/100,hint:'Map units equal percent recombinants.',sol:`${n} × ${dd}% = <b>${fmt(ans,0)}</b>.`};}});
  PROBS.push({id:'lk-ord',topic:'linkage',title:'Gene order',gen(){const x=pick([[8,5],[10,6],[12,7],[15,9]]),a=x[0],b=x[1],ac=a+b,mid=pick(['A','B','C']),orders={B:[['A','B'],['B','C'],['A','C']],A:[['B','A'],['A','C'],['B','C']],C:[['A','C'],['C','B'],['A','B']]};const [p1,p2,p3]=orders[mid];const ord=mid==='B'?'A – B – C':mid==='A'?'B – A – C':'A – C – B';const m=mcq(ord,['A – B – C','B – A – C','A – C – B'].filter(o=>o!==ord).concat(['C – A – B']));return {q:`Recombination frequencies: ${p1.join('–')} = ${a}%, ${p2.join('–')} = ${b}%, ${p3.join('–')} = ${ac}%. What is the order of the three genes on the chromosome?`,choices:m.choices,ans:m.ans,hint:'The two genes that are farthest apart have the largest value, and the third gene lies between them.',sol:`The largest value (${ac}%) is between ${p3.join(' and ')}, so those are the ends. Order: <b>${ord}</b>.`};}});
})();
