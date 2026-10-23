/* ---------------- Rates, Q10 & dilutions ---------------- */
(function ratesq10(){
  const cv=$('#rq-canvas');if(!cv)return;
  let T1=25,Q=2;const R=(t,q)=>10*Math.pow(q,(t-20)/10);
  const sim=sim2d(cv,{h:w=>clamp(w*.5,240,320),draw(ctx,w,h){const A=axes2(ctx,w,h,{x0:5,x1:40,y0:0,y1:40,xt:5,yt:10,xl:'temperature (°C)',yl:'relative rate'});
    curve2(ctx,A,t=>Math.min(R(t,Q),40),5,40,T.cx);const t0=Math.max(5,T1-10);ctx.setLineDash([4,4]);ctx.strokeStyle=T.muted;ctx.beginPath();ctx.moveTo(A.X(T1),A.B);ctx.lineTo(A.X(T1),A.Y(Math.min(R(T1,Q),40)));ctx.stroke();ctx.setLineDash([]);dot2(ctx,A.X(t0),A.Y(Math.min(R(t0,Q),40)),T.cv);dot2(ctx,A.X(T1),A.Y(Math.min(R(T1,Q),40)),T.ca);
    label(ctx,'rate = 10 × Q10^((T − 20)/10)  (valid below denaturation)',w-16,18,T.muted,'right','middle',MONO);}});
  function upd(){const r=R(T1,Q),r0=R(T1-10,Q);setText('rq-r',fmt(r,1));setText('rq-r10',fmt(r0,1));setText('rq-rat',fmt(r/r0,2));sim.render();}
  bindRange('rq-t',v=>v+' °C',v=>{T1=v;upd();});bindRange('rq-q',v=>fmt(v,1),v=>{Q=v;upd();});
  $('#rq-lab').addEventListener('labreset',()=>{T1=25;Q=2;setCtl('rq-t',25,v=>v+' °C');setCtl('rq-q',2,v=>fmt(v,1));upd();});
  upd();
  let f=2,c0=80;const cv2=$('#rq-canvas2');
  const sim2=sim2d(cv2,{h:w=>clamp(w*.34,150,210),draw(ctx,w,h){const n=6,gw=(w-20)/n;for(let i=0;i<n;i++){const c=c0/Math.pow(f,i),x=10+i*gw+gw/2,tw=Math.min(36,gw*.6),th=h-62,y0=16;
      const inten=clamp(Math.log10(c+1)/Math.log10(101),0,1);ctx.fillStyle=alpha(T.ca,.08+.8*inten);ctx.fillRect(x-tw/2,y0+th*.2,tw,th*.8);ctx.strokeStyle=T.ink;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-tw/2,y0);ctx.lineTo(x-tw/2,y0+th);ctx.lineTo(x+tw/2,y0+th);ctx.lineTo(x+tw/2,y0);ctx.stroke();
      label(ctx,'tube '+(i+1),x,y0+th+14,T.muted,'center','middle',MONO);label(ctx,fmt(c,c<1?3:c<10?2:1),x,y0+th+30,T.ink,'center','middle',MONO);}
    label(ctx,'mg/mL, each tube is 1/'+f+' of the one before',w/2,10,T.muted,'center','middle',MONO);}});
  const conc=i=>c0/Math.pow(f,i);
  function upd2(){setText('rq-c3',fmt(conc(2),3)+' mg/mL');setText('rq-c5',fmt(conc(4),4)+' mg/mL');setText('rq-tot','1 : '+Math.pow(f,4));sim2.render();}
  segBind('rq-f','k',v=>{f=+v;upd2();});bindRange('rq-c0',v=>String(v),v=>{c0=v;upd2();});
  $('#rq-lab2').addEventListener('labreset',()=>{f=2;c0=80;segSet('rq-f',0);setCtl('rq-c0',80);upd2();});
  upd2();drawers.ratesq10=()=>{sim.render();sim2.render();};
  KEYS['rq-canvas']=['The pink dot is the chosen temperature; the green dot is 10 °C colder. Their ratio is Q10.',[['ca','chosen temperature'],['cv','10 °C colder']]];
  KEYS['rq-canvas2']=['Tube 1 is the first dilution of the stock. Colour fades by the same factor each tube.',[['ca','solution']]];
  TIPS['rq-q']=()=>'Q10 is the factor the rate changes by for every 10 °C rise.';
  GLOSS['q10']='The factor by which a rate increases when temperature rises by 10 °C.';GLOSS['serial dilution']='A series of equal dilution steps, each tube made from the one before.';
  TT.ratesq10='Ask for the answer to a Q10 question as a ratio before looking at the graph.';
})();
(function(){
  PROBS.push({id:'rq-q10',topic:'ratesq10',title:'Calculate Q10',gen(){const q=pick([1.5,2,2.5,3]),dt=pick([10,10,10,5,20]),t1=pick([15,20,25]),r1=pick([4,6,8,10]),r2=+(r1*Math.pow(q,dt/10)).toFixed(2),ans=Math.pow(r2/r1,10/dt);
    return {q:`A reaction rate is ${r1} units/min at ${t1} °C and ${r2} units/min at ${t1+dt} °C. Calculate Q10 (two decimals).`,ans,unit:'',abs:.02,chk:ans,hint:'Q10 = (R2/R1)^(10/(T2 − T1)).',sol:`Q10 = (${r2}/${r1})^(10/${dt}) = <b>${fmt(ans,2)}</b>.`};}});
  PROBS.push({id:'rq-rate',topic:'ratesq10',title:'Rate from a time course',gen(){const t=pick([2,4,5,10]),a=pick([2,4,6]),b=a+pick([12,18,24,30]),ans=(b-a)/t;
    return {q:`A student measures oxygen collected: ${a} mL at 0 min and ${b} mL after ${t} min. What is the average rate?`,ans,unit:'mL/min',abs:.01,chk:(b-a)/t,hint:'Change in volume divided by time.',sol:`(${b} − ${a}) mL / ${t} min = <b>${fmt(ans,2)} mL/min</b>.`};}});
  PROBS.push({id:'rq-dil',topic:'ratesq10',title:'Serial dilution',gen(){const c0=pick([50,80,100,200]),f=pick([2,5,10]),k=randInt(2,4),ans=c0/Math.pow(f,k);
    return {q:`A ${c0} mg/mL stock is serially diluted 1 : ${f} for ${k} steps (each tube made from the previous). What is the concentration in the last tube?`,ans,unit:'mg/mL',abs:ans*.01+.0005,chk:c0/Math.pow(f,k),hint:'Divide by the factor once for every step.',sol:`${c0} / ${f}<sup>${k}</sup> = ${c0} / ${Math.pow(f,k)} = <b>${fmt(ans,4)} mg/mL</b>.`};}});
  PROBS.push({id:'rq-c1v1',topic:'ratesq10',title:'Making a dilution (C₁V₁ = C₂V₂)',gen(){const c1=pick([10,20,50]),c2=pick([1,2,5]),v2=pick([50,100,200]),ans=c2*v2/c1;
    return {q:`You have a ${c1} M stock. How many mL of stock are needed to prepare ${v2} mL of ${c2} M solution?`,ans,unit:'mL',abs:.02,chk:c2*v2/c1,hint:'C1V1 = C2V2, solve for V1.',sol:`V1 = (${c2} × ${v2})/${c1} = <b>${fmt(ans,2)} mL</b> of stock plus water to ${v2} mL.`};}});
})();
