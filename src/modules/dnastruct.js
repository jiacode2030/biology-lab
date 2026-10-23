/* ---------------- DNA & RNA structure ---------------- */
(function dnastruct(){
  const cv=$('#dn-canvas');if(!cv)return;
  let n=100,gc=40;
  const sim=sim2d(cv,{h:w=>clamp(w*.4,200,260),draw(ctx,w,h,t){const pairs=32,L=24,R=w-24,cy=h/2,amp=h*.3,g=(R-L)/(pairs-1),gcN=Math.round(pairs*gc/100);let acc=0;
      const isGC=[];for(let i=0;i<pairs;i++){acc+=gcN/pairs;if(acc>=1){isGC.push(true);acc-=1;}else isGC.push(false);}
      for(let i=0;i<pairs;i++){const x=L+g*i,ph=i*.42+t*.4,y1=cy+Math.sin(ph)*amp,y2=cy-Math.sin(ph)*amp,col=isGC[i]?T.ca:T.cx;
        ctx.strokeStyle=alpha(col,.9);ctx.lineWidth=isGC[i]?4:2.4;ctx.beginPath();ctx.moveTo(x,y1);ctx.lineTo(x,y2);ctx.stroke();}
      [1,-1].forEach((s,k)=>{ctx.strokeStyle=k?T.ink:T.muted;ctx.lineWidth=3;ctx.beginPath();for(let i=0;i<pairs*4;i++){const q=i/4,x=L+g*q,y=cy+s*Math.sin(q*.42+t*.4)*amp;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();});
      label(ctx,'pink rungs: G–C (3 bonds)   blue rungs: A–T (2 bonds)',w/2,12,T.muted,'center','middle',MONO);label(ctx,"5′",L-8,cy-amp-2,T.muted,'center','middle',MONO);label(ctx,"3′",R+8,cy-amp-2,T.muted,'center','middle',MONO);}});
  function upd(){const at=(100-gc)/2,GCn=Math.round(n*gc/100);setText('dn-a',fmt(at,1)+'%');setText('dn-t',fmt(at,1)+'%');setText('dn-g',fmt(gc/2,1)+'%');setText('dn-c',fmt(gc/2,1)+'%');setText('dn-hb',String(3*GCn+2*(n-GCn))+' in '+n+' bp');setText('dn-tm',gc<35?'melts easily (AT-rich)':gc<55?'moderate':'melts only at high temperature (GC-rich)');sim.render();}
  bindRange('dn-n',v=>v+' bp',v=>{n=v;upd();});bindRange('dn-gc',v=>v+'%',v=>{gc=v;upd();});
  $('#dn-lab').addEventListener('labreset',()=>{n=100;gc=40;setCtl('dn-n',100,v=>v+' bp');setCtl('dn-gc',40,v=>v+'%');upd();});
  upd();drawers.dnastruct=()=>sim.render();
  KEYS['dn-canvas']=['Each rung is a base pair. Pink pairs (G–C) are held by three hydrogen bonds, blue pairs (A–T) by two.',[['ca','G–C pair'],['cx','A–T pair']]];
  TIPS['dn-gc']=()=>'G pairs with C and A with T, so G = C and A = T. More GC means more hydrogen bonds.';
  GLOSS['antiparallel']='The two strands of DNA run in opposite directions, one 5′→3′ and the other 3′→5′.';GLOSS['nucleotide']='A sugar, a phosphate and a nitrogenous base: the monomer of nucleic acids.';GLOSS['chargaff']='In double-stranded DNA, the amount of A equals T and G equals C.';
  TT.dnastruct='Ask students to predict A, T, G, C from one base percentage before using the slider.';
})();
(function(){
  PROBS.push({id:'dn-chargaff',topic:'dnastruct',title:'Chargaff\'s rules',gen(){const b=pick(['cytosine','guanine','adenine','thymine']),p=pick([18,20,22,24,26,28,30,32,34]),gcp=(b==='cytosine'||b==='guanine')?2*p:100-2*p,want=pick(['adenine','thymine','guanine','cytosine']);
    const ans=(want==='cytosine'||want==='guanine')?gcp/2:(100-gcp)/2;
    return {q:`A sample of double-stranded DNA is ${p}% ${b}. What percent is ${want}?`,ans,unit:'%',abs:.01,chk:ans,hint:'A = T and G = C. The four add to 100%.',sol:`${b[0]==='c'||b[0]==='g'?'C = G, so G + C = ':'A = T, so A + T = '}${2*p}%. That makes G + C = ${gcp}% and A + T = ${100-gcp}%, split evenly between the two bases of each pair: ${want} = <b>${ans}%</b>.`};}});
  PROBS.push({id:'dn-hb',topic:'dnastruct',title:'Hydrogen bonds in a segment',gen(){const gcn=randInt(5,60),atn=randInt(5,60),ans=3*gcn+2*atn;
    return {q:`A DNA segment has ${gcn} G–C base pairs and ${atn} A–T base pairs. How many hydrogen bonds hold the two strands together?`,ans,unit:'',tol:0,chk:3*gcn+2*atn,hint:'G–C: 3 bonds. A–T: 2 bonds.',sol:`3 × ${gcn} + 2 × ${atn} = <b>${ans}</b>.`};}});
  const comp={A:'T',T:'A',G:'C',C:'G'};
  PROBS.push({id:'dn-comp',topic:'dnastruct',title:'Complementary strand',gen(){let s;do{s=Array.from({length:6},()=>pick(['A','T','G','C'])).join('');}while(s.split('').reverse().map(c=>comp[c]).join('')===s||s.split('').map(c=>comp[c]).join('')===s.split('').reverse().map(c=>comp[c]).join(''));
    const rc=s.split('').reverse().map(c=>comp[c]).join(''),straight=s.split('').map(c=>comp[c]).join(''),rev=s.split('').reverse().join(''),rna=straight.replace(/T/g,'U'),m=mcq(rc,[straight,rev,rna]);
    return {q:`One DNA strand reads 5′-${s}-3′. Which is the complementary strand, written 5′ → 3′?`,choices:m.choices.map(x=>"5′-"+x+"-3′"),ans:m.ans,hint:'Pair A–T and G–C, then remember the strands are antiparallel: reverse the result to read 5′ → 3′.',sol:`Complement of ${s} is ${straight} (3′→5′ under it). Read 5′→3′: <b>5′-${rc}-3′</b>.`};}});
})();
