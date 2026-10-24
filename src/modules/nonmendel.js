/* ---------------- Beyond simple dominance ---------------- */
(function nonmendel(){
  const cv=$('#nm-canvas');if(!cv)return;
  const PAT={cd:{gt:'1 AA : 2 Aa : 1 aa',pt:'3 dominant : 1 recessive',ex:'pea flowers: purple is dominant to white',bars:[[3,'dominant',()=>T.cx],[1,'recessive',()=>T.ca]]},
    id:{gt:'1 RR : 2 Rr : 1 rr',pt:'1 red : 2 pink : 1 white',ex:'snapdragons: red × white gives pink',bars:[[1,'red',()=>T.bad],[2,'pink',()=>T.ca],[1,'white',()=>T.surface]]},
    co:{gt:'1 RR : 2 RW : 1 WW',pt:'1 red : 2 roan (red and white together) : 1 white',ex:'roan cattle; AB blood type',bars:[[1,'red',()=>T.bad],[2,'roan (both)',()=>T.accent],[1,'white',()=>T.surface]]},
    ep:{gt:'9 B_E_ : 3 bbE_ : 3 B_ee : 1 bbee',pt:'9 black : 3 chocolate : 4 yellow',ex:'labrador coat colour: ee hides the B gene',bars:[[9,'black',()=>T.ink],[3,'chocolate',()=>'#7B4A2A'],[4,'yellow',()=>T.ce]]}};
  let pat='cd';
  const sim=sim2d(cv,{h:w=>clamp(w*.44,230,290),draw(ctx,w,h){const P=PAT[pat],tot=P.bars.reduce((s,b)=>s+b[0],0),L=40,R=w-20,B=h-44,top=26,bw=(R-L)/(P.bars.length*1.5+.5),mx=Math.max(...P.bars.map(b=>b[0]));
    ctx.strokeStyle=T.ink;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(L,top);ctx.lineTo(L,B);ctx.lineTo(R,B);ctx.stroke();label(ctx,'parts of '+tot,L+4,top-6,T.muted,'left','middle',MONO);
    P.bars.forEach(([n,nm,c],k)=>{const x=L+bw*(.5+k*1.5),bh=(B-top-6)*n/mx;ctx.fillStyle=c();ctx.globalAlpha=.85;ctx.fillRect(x,B-bh,bw,bh);ctx.globalAlpha=1;ctx.strokeStyle=T.ink;ctx.lineWidth=1.6;ctx.strokeRect(x,B-bh,bw,bh);label(ctx,String(n),x+bw/2,B-bh-9,T.ink,'center','middle',MONO);label(ctx,nm,x+bw/2,B+16,T.ink,'center','middle',MONO);});}});
  function upd(){const P=PAT[pat];setText('nm-gt',P.gt);setText('nm-pt',P.pt);setText('nm-ex',P.ex);sim.render();}
  segBind('nm-pat','k',v=>{pat=v;upd();});$('#nm-lab').addEventListener('labreset',()=>{pat='cd';segSet('nm-pat',0);upd();});upd();
  /* ABO */
  let b1='IAIA',b2='IAIA';
  const typ=g=>g==='IAIB'?'AB':g==='ii'?'O':g.indexOf('A')>=0?'A':'B';
  const al=g=>g==='ii'?['i','i']:g==='IAIB'?['IA','IB']:g==='IAIA'?['IA','IA']:g==='IBIB'?['IB','IB']:g==='IAi'?['IA','i']:['IB','i'];
  function probs(){const r={A:0,B:0,AB:0,O:0};al(b1).forEach(a=>al(b2).forEach(b=>{const g=(a==='i'&&b==='i')?'ii':(a==='i'||b==='i')?(a==='i'?b:a)+'i':[a,b].sort().join('');r[typ(g==='IAIB'||g==='IBIA'?'IAIB':g)]+=.25;}));return r;}
  const sim2=sim2d($('#nm-canvas2'),{h:w=>clamp(w*.36,190,250),draw(ctx,w,h){const r=probs(),L=40,R=w-20,B=h-34,top=20,bw=(R-L)/6.5;ctx.strokeStyle=T.ink;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(L,top);ctx.lineTo(L,B);ctx.lineTo(R,B);ctx.stroke();
    [['A',T.cx],['B',T.ca],['AB',T.accent],['O',T.ce]].forEach(([k,c],i)=>{const x=L+bw*(.5+i*1.5),bh=(B-top-8)*r[k];ctx.fillStyle=alpha(c,.7);ctx.fillRect(x,B-bh,bw,bh);ctx.strokeStyle=c;ctx.lineWidth=2;ctx.strokeRect(x,B-bh,bw,bh);label(ctx,Math.round(r[k]*100)+'%',x+bw/2,B-bh-9,T.ink,'center','middle',MONO);label(ctx,'type '+k,x+bw/2,B+14,T.ink,'center','middle',MONO);});}});
  function upd2(){const r=probs();const ks=['A','B','AB','O'].filter(k=>r[k]>0);setText('nm-bt',ks.join(', '));setText('nm-bp',ks.map(k=>k+' '+Math.round(r[k]*100)+'%').join(' · '));sim2.render();}
  segBind('nm-b1','k',v=>{b1=v;upd2();});segBind('nm-b2','k',v=>{b2=v;upd2();});$('#nm-lab2').addEventListener('labreset',()=>{b1='IAIA';b2='IAIA';segSet('nm-b1',0);segSet('nm-b2',0);upd2();});upd2();
  drawers.nonmendel=()=>{sim.render();sim2.render();};
  KEYS['nm-canvas']=['Bars show the expected phenotype ratio from a cross of two heterozygotes (or double heterozygotes for epistasis).',[['cx','dominant'],['ca','recessive / pink'],['bad','red'],['accent','both alleles shown']]];
  KEYS['nm-canvas2']=['Probability of each ABO blood type among children.',[['cx','type A'],['ca','type B'],['accent','type AB'],['ce','type O']]];
  TIPS['nm-pat']=()=>'3 : 1 means simple dominance. 1 : 2 : 1 means the heterozygote looks different. 9 : 3 : 4 means one gene hides another.';
  GLOSS['incomplete dominance']='The heterozygote\'s phenotype is intermediate between the two homozygotes.';GLOSS['codominance']='Both alleles are fully expressed in the heterozygote.';GLOSS['epistasis']='One gene affects the expression of a different gene.';GLOSS['polygenic']='A trait influenced by many genes, usually giving a continuous range of phenotypes.';GLOSS['multiple alleles']='More than two alleles of a gene present in a population.';
  TT.nonmendel='Have students match each ratio with the pattern before checking the labels.';
})();
(function(){
  const pairs=[['IAi','IBi',['A','B','AB','O']],['IAIB','ii',['A','B']],['IAIA','IBIB',['AB']],['IAi','IAi',['A','O']],['IBi','ii',['B','O']],['IAIB','IAIB',['A','B','AB']],['ii','ii',['O']],['IAi','IAIB',['A','B','AB']]];
  const nm={IAi:'Iᴬi',IBi:'Iᴮi',IAIB:'IᴬIᴮ',ii:'ii',IAIA:'IᴬIᴬ',IBIB:'IᴮIᴮ'};
  PROBS.push({id:'nm-abo',topic:'nonmendel',title:'Possible blood types',gen(){const p=pick(pairs),want=pick(['A','B','AB','O']),yes=p[2].includes(want),ans=yes?'yes':'no',m=mcq(ans,['yes','no']);return {q:`One parent has genotype ${nm[p[0]]} and the other ${nm[p[1]]}. Could they have a child with blood type ${want}?`,choices:m.choices,ans:m.ans,hint:'List the gametes of each parent and combine.',sol:`Possible types: ${p[2].join(', ')}. Type ${want}: <b>${ans}</b>.`};}});
  PROBS.push({id:'nm-ratio',topic:'nonmendel',title:'Match the ratio',gen(){const t=pick([['1 : 2 : 1 with three different phenotypes (red, pink, white)','incomplete dominance','The heterozygote has its own intermediate phenotype (pink), so the 1 : 2 : 1 genotype ratio shows up directly as phenotypes.'],['3 : 1','complete dominance','The heterozygote looks like the dominant homozygote, so Aa × Aa gives 3 dominant : 1 recessive.'],['9 : 3 : 4','epistasis','9 : 3 : 4 is a 9 : 3 : 3 : 1 with two classes merged, which happens when one gene masks the effect of the other.'],['a continuous bell-shaped range of phenotypes','polygenic inheritance','Many genes each add a small effect, so phenotypes form a continuous range instead of a few classes.'],['the heterozygote shows both parental phenotypes at once','codominance','Both alleles are fully expressed in the heterozygote, as in type AB blood.']]),m=mcq(t[1],['incomplete dominance','complete dominance','epistasis','polygenic inheritance','codominance'].filter(x=>x!==t[1]));return {q:`Which pattern of inheritance best fits: ${t[0]}?`,choices:m.choices,ans:m.ans,hint:'Compare the ratio and the heterozygote\'s phenotype.',sol:`<b>${t[1]}</b>. ${t[2]}`};}});
  PROBS.push({id:'nm-pink',topic:'nonmendel',title:'Pink snapdragons',gen(){const n=pick([80,100,200,400]),ph=pick([['red',1],['pink',2],['white',1]]),ans=n*ph[1]/4;return {q:`Two pink snapdragons (incomplete dominance) produce ${n} seedlings. How many are expected to be ${ph[0]}?`,ans,unit:'',abs:.01,chk:n*ph[1]/4,hint:'The ratio is 1 red : 2 pink : 1 white.',sol:`${n} × ${ph[1]}/4 = <b>${fmt(ans,0)}</b>.`};}});
})();
