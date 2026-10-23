/* ---------------- Mendelian inheritance ---------------- */
(function mendel(){
  const cv=$('#md-canvas');if(!cv)return;
  let p1='Aa',p2='Aa',obs='';
  const gam=g=>[g[0],g[1]],gcd=(a,b)=>b?gcd(b,a%b):a;
  function cells(){const r=[];gam(p1).forEach(a=>gam(p2).forEach(b=>r.push(a<b?a+b:b+a)));return r.map(x=>x==='aA'?'Aa':x);}
  const dom=x=>x.indexOf('A')>=0;
  const sim=sim2d(cv,{h:w=>clamp(w*.46,230,300),draw(ctx,w,h){const cs=cells(),s=Math.min(h-70,(w-110)*.7,130)/2,x0=w/2-s,y0=46,g1=gam(p1),g2=gam(p2);
    g1.forEach((a,k)=>label(ctx,a,x0+s*(k+.5),y0-16,T.cx,'center','middle','700 16px '+MONO.split(' ').slice(1).join(' ')));g2.forEach((a,k)=>label(ctx,a,x0-20,y0+s*(k+.5),T.cx,'center','middle','700 16px '+MONO.split(' ').slice(1).join(' ')));
    label(ctx,'parent 1 gametes →',x0+s,y0-34,T.muted,'center','middle',MONO);
    cs.forEach((g,k)=>{const c=k%2,r=Math.floor(k/2),d=dom(g);ctx.fillStyle=alpha(d?T.cx:T.ca,.3);ctx.fillRect(x0+c*s,y0+r*s,s,s);ctx.strokeStyle=d?T.cx:T.ca;ctx.lineWidth=2;ctx.strokeRect(x0+c*s,y0+r*s,s,s);label(ctx,g,x0+c*s+s/2,y0+r*s+s/2,T.ink,'center','middle','700 18px '+MONO.split(' ').slice(1).join(' '));});
    label(ctx,'blue: dominant phenotype · pink: recessive phenotype',w/2,h-10,T.muted,'center','middle',MONO);}});
  function upd(){const cs=cells(),n={AA:0,Aa:0,aa:0};cs.forEach(g=>n[g]++);const gr=['AA','Aa','aa'].filter(k=>n[k]).map(k=>n[k]+' '+k).join(' : ');const d=cs.filter(dom).length,rc=4-d,gg=gcd(d,rc)||1;setText('md-gt',gr);setText('md-pt',(d/gg)+' : '+(rc/gg));setText('md-obs',obs||'press the button to sample');sim.render();}
  segBind('md-p1','k',v=>{p1=v;obs='';upd();});segBind('md-p2','k',v=>{p2=v;obs='';upd();});
  $('#md-go').addEventListener('click',()=>{const cs=cells();let d=0;for(let i=0;i<100;i++)if(dom(pick(cs)))d++;const ed=cs.filter(dom).length*25;obs=d+' dominant : '+(100-d)+' recessive (expected '+ed+' : '+(100-ed)+')';upd();});
  $('#md-lab').addEventListener('labreset',()=>{p1='Aa';p2='Aa';obs='';segSet('md-p1',1);segSet('md-p2',1);upd();});
  segSet('md-p1',1);segSet('md-p2',1);upd();
  /* dihybrid */
  let hl='all';const G=['AB','Ab','aB','ab'];
  const phen=(g1,g2)=>{const A=g1[0]==='A'||g2[0]==='A',B=g1[1]==='B'||g2[1]==='B';return (A?'A':'a')+(B?'B':'b');};
  const sim2=sim2d($('#md-canvas2'),{h:w=>clamp(w*.52,250,330),draw(ctx,w,h){const s=Math.min((h-50)/4,(w-80)/4,64),x0=w/2-2*s,y0=34;const colr={AB:T.cx,Ab:T.cv,aB:T.ce,ab:T.ca};
    G.forEach((g,k)=>{label(ctx,g,x0+s*(k+.5),y0-14,T.muted,'center','middle',MONO);label(ctx,g,x0-16,y0+s*(k+.5),T.muted,'center','middle',MONO);});
    G.forEach((a,r)=>G.forEach((b,c)=>{const p=phen(a,b),on=hl==='all'||hl===p;ctx.globalAlpha=on?1:.22;ctx.fillStyle=alpha(colr[p],.55);ctx.fillRect(x0+c*s,y0+r*s,s,s);ctx.strokeStyle=colr[p];ctx.lineWidth=2;ctx.strokeRect(x0+c*s,y0+r*s,s,s);ctx.globalAlpha=1;}));
    label(ctx,'gametes of each parent along the top and left',w/2,h-10,T.muted,'center','middle',MONO);}});
  function upd2(){let n=0;G.forEach(a=>G.forEach(b=>{if(hl==='all'||hl===phen(a,b))n++;}));setText('md-n',String(n));setText('md-r',n+'/16'+(hl==='all'?'':' = '+fmt(n/16*100,1)+'%'));sim2.render();}
  segBind('md-hl','k',v=>{hl=v;upd2();});$('#md-lab2').addEventListener('labreset',()=>{hl='all';segSet('md-hl',0);upd2();});upd2();
  drawers.mendel=()=>{sim.render();sim2.render();};
  KEYS['md-canvas']=['Each square is a possible offspring. The gametes of each parent are along the edges.',[['cx','dominant phenotype'],['ca','recessive phenotype']]];
  KEYS['md-canvas2']=['Sixteen squares: the four phenotype classes appear 9 : 3 : 3 : 1.',[['cx','dominant both'],['cv','dominant A only'],['ce','dominant B only'],['ca','recessive both']]];
  TIPS['md-go']=()=>'Real samples scatter around the expected ratio. A chi-square test judges whether the scatter is just chance.';
  GLOSS['genotype']='The combination of alleles an individual has (such as Aa).';GLOSS['phenotype']='The observable trait that results from the genotype.';GLOSS['heterozygous']='Having two different alleles of a gene.';GLOSS['homozygous']='Having two identical alleles of a gene.';GLOSS['test cross']='Crossing an individual of unknown genotype with a homozygous recessive to reveal its genotype.';GLOSS['law of segregation']='The two alleles of a gene separate into different gametes.';
  TT.mendel='Have students predict the ratio before choosing parents, then compare with a random sample.';
})();
(function(){
  PROBS.push({id:'md-prob',topic:'mendel',title:'Probability of a phenotype',gen(){const c=pick([['Aa','Aa',1/4,'the recessive phenotype'],['Aa','Aa',3/4,'the dominant phenotype'],['Aa','aa',1/2,'the recessive phenotype'],['AA','Aa',1,'the dominant phenotype'],['aa','aa',1,'the recessive phenotype']]);return {q:`In a cross ${c[0]} × ${c[1]}, what is the probability that an offspring shows ${c[3]}? (Give a decimal.)`,ans:c[2],unit:'',abs:.011,chk:c[2],hint:'Fill in a Punnett square and count.',sol:`<b>${fmt(c[2],2)}</b>.`};}});
  PROBS.push({id:'md-two',topic:'mendel',title:'Two independent events',gen(){const a=pick([[1/4,'1/4','recessive'],[3/4,'3/4','dominant'],[1/2,'1/2','heterozygous']]),n=pick([2,3]),ans=Math.pow(a[0],n);return {q:`Each offspring of a cross has probability ${a[1]} of being ${a[2]}. What is the probability that ${n} offspring in a row are all ${a[2]}?`,ans,unit:'',abs:.0011,chk:Math.pow(a[0],n),hint:'Product rule: multiply the probabilities.',sol:`(${a[1]})<sup>${n}</sup> = <b>${fmt(ans,4)}</b>.`};}});
  PROBS.push({id:'md-dihy',topic:'mendel',title:'Dihybrid class sizes',gen(){const k=pick([['both dominant',9],['dominant for A, recessive for b',3],['recessive for A, dominant for B',3],['recessive for both',1]]),n=pick([160,320,480,800]),ans=n*k[1]/16;return {q:`AaBb × AaBb produces ${n} offspring and the genes assort independently. How many do you expect to be ${k[0]}?`,ans,unit:'',abs:.01,chk:n*k[1]/16,hint:'The classes are in the ratio 9 : 3 : 3 : 1 (of 16).',sol:`${n} × ${k[1]}/16 = <b>${fmt(ans,1)}</b>.`};}});
  const q=[['The genotype of an individual with the recessive phenotype is','homozygous recessive',['heterozygous','homozygous dominant','either homozygous or heterozygous']],['A test cross uses a partner that is','homozygous recessive',['homozygous dominant','heterozygous','the same genotype']],['Two heterozygotes (Aa × Aa) have an offspring. The chance it is heterozygous is','1/2',['1/4','3/4','1']]];
  PROBS.push({id:'md-fact',topic:'mendel',title:'Genetics facts',gen(){const p=pick(q),m=mcq(p[1],p[2]);return {q:p[0],choices:m.choices,ans:m.ans,hint:'Draw the Punnett square.',sol:`<b>${p[1]}</b>.`};}});
})();
