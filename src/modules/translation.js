/* ---------------- Translation & the genetic code ---------------- */
(function translation(){
  const cv=$('#tl-canvas');if(!cv)return;
  const ST=[{n:'1 · initiation',t:'The ribosome assembles on the mRNA at the start codon AUG. A tRNA carrying methionine pairs with it in the P site.'},{n:'2 · codon recognition',t:'A tRNA whose anticodon matches the next codon enters the A site.'},{n:'3 · peptide bond forms',t:'The ribosome joins the growing chain to the amino acid in the A site with a peptide bond.'},{n:'4 · translocation',t:'The ribosome moves one codon along the mRNA. The empty tRNA leaves from the E site and the A site is open.'},{n:'5 · termination',t:'A stop codon in the A site is recognized by a release factor. The polypeptide is released.'}];
  const COD=['AUG','GCU','GAA','AAG','UAA'],AAs=['Met','Ala','Glu','Lys','Stop'];
  const sc=stageLab('tl','tl-canvas',ST,(ctx,w,h,i)=>{const cw=Math.min(66,(w-30)/5.2),x0=(w-cw*5)/2,my=h*.66;
    ctx.strokeStyle=T.cv;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(8,my+14);ctx.lineTo(w-8,my+14);ctx.stroke();
    COD.forEach((c,k)=>{const x=x0+k*cw;ctx.fillStyle=alpha(k===4?T.bad:T.cv,.18);ctx.fillRect(x+1,my,cw-2,28);ctx.strokeStyle=k===4?T.bad:T.cv;ctx.lineWidth=1.6;ctx.strokeRect(x+1,my,cw-2,28);label(ctx,c,x+cw/2,my+14,T.ink,'center','middle',MONO);});
    const r=[0,0,0,1,3][i];const sx=x0+(r-1)*cw+2,sw=cw*3-4;
    ctx.beginPath();ctx.ellipse(sx+sw/2,my-34,sw/2+6,50,0,0,6.283);ctx.fillStyle=alpha(T.accent,.14);ctx.fill();ctx.strokeStyle=T.accent;ctx.lineWidth=2.4;ctx.stroke();
    ['E','P','A'].forEach((s,k)=>label(ctx,s,sx+cw*k+cw/2,my-80,T.accent,'center','middle',MONO));
    function trna(codIdx,aa,chain,filled=true){const x=x0+codIdx*cw+cw/2;ctx.strokeStyle=T.ca;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,my-4);ctx.lineTo(x,my-44);ctx.stroke();if(filled){dot2(ctx,x,my-54,T.ce,11);label(ctx,aa,x,my-54,T.ink,'center','middle','9px '+MONO.split(' ').slice(1).join(' '));}
      label(ctx,compRNA(COD[codIdx]).split('').join(''),x,my-18,T.ca,'center','middle','9px '+MONO.split(' ').slice(1).join(' '));
      if(chain>1){for(let q=1;q<chain;q++)dot2(ctx,x-4*q-8+q*0,my-54-q*18,T.ce,7);ctx.strokeStyle=T.ce;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,my-54);ctx.lineTo(x,my-54-(chain-1)*18);ctx.stroke();}}
    if(i===0)trna(0,'Met',1);
    if(i===1){trna(0,'Met',1);trna(1,'Ala',1);}
    if(i===2){trna(0,'',1,false);trna(1,'Ala',2);label(ctx,'peptide bond',x0+cw*1.5,my-122,T.hot,'center','middle',MONO);}
    if(i===3){trna(0,'',1,false);ctx.strokeStyle=T.muted;ctx.lineWidth=1.5;ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(x0+cw*.5,my-70);ctx.lineTo(x0+cw*.5,my-100);ctx.stroke();ctx.setLineDash([]);trna(1,'Ala',2);label(ctx,'empty tRNA leaves',x0+cw*.5,my-108,T.muted,'center','middle',MONO);label(ctx,'→ ribosome moves',w*.78,my-110,T.accent,'center','middle',MONO);}
    if(i===4){trna(2,'Glu',3);trna(3,'Lys',4);ctx.fillStyle=alpha(T.bad,.3);ctx.fillRect(x0+4*cw+6,my-44,cw-12,38);ctx.strokeStyle=T.bad;ctx.lineWidth=2;ctx.strokeRect(x0+4*cw+6,my-44,cw-12,38);label(ctx,'release',x0+4.5*cw,my-32,T.ink,'center','middle','9px '+MONO.split(' ').slice(1).join(' '));label(ctx,'factor',x0+4.5*cw,my-20,T.ink,'center','middle','9px '+MONO.split(' ').slice(1).join(' '));label(ctx,'Met–Ala–Glu–Lys released',w/2,14,T.good,'center','middle',MONO);}
    label(ctx,"mRNA 5′ → 3′",8,my+44,T.cv,'left','middle',MONO);},{h:w=>clamp(w*.5,270,340)});
  $('#tl-lab').addEventListener('labreset',()=>sc.go(0));
  const inp=$('#tl-in'),clean=()=>inp.value.toUpperCase().replace(/[^AUGCT]/g,'').replace(/T/g,'U');
  const CL={np:()=>T.ce,po:()=>T.cx,ch:()=>T.ca,stop:()=>T.bad};
  const sim=sim2d($('#tl-canvas2'),{h:w=>{const r=translateFrom(clean()),n=Math.max(r.codons.length,1),per=Math.max(1,Math.floor((w-20)/56));return clamp(80+Math.ceil(n/per)*56,130,420);},draw(ctx,w,h){const s=clean(),r=translateFrom(s);
    if(r.start<0){label(ctx,'no AUG start codon: translation does not begin',w/2,h/2,T.bad,'center','middle',MONO);return;}
    label(ctx,'5′ …'+s.slice(0,r.start)+' (not translated)',10,14,T.muted,'left','middle',MONO);const per=Math.max(1,Math.floor((w-20)/56));
    r.codons.forEach((c,k)=>{const a=r.aas[k],cl=aaClass(a),col=k===0?T.good:CL[cl](),x=10+(k%per)*56,y=34+Math.floor(k/per)*56;ctx.fillStyle=alpha(col,.3);ctx.fillRect(x,y,52,46);ctx.strokeStyle=col;ctx.lineWidth=2;ctx.strokeRect(x,y,52,46);label(ctx,c,x+26,y+14,T.ink,'center','middle',MONO);label(ctx,AA3[a],x+26,y+32,T.ink,'center','middle','700 12px '+MONO.split(' ').slice(1).join(' '));});
    const used=r.codons.length*3,leftover=s.length-r.start-used;if(!r.stopped&&leftover>0)label(ctx,'leftover '+s.slice(s.length-leftover)+' (incomplete codon)',10,h-10,T.muted,'left','middle',MONO);}});
  function upd(){const s=clean(),r=translateFrom(s);setText('tl-pep',r.start<0?'none':pepText(r.aas)||'—');setText('tl-n',r.start<0?'0':String(r.aas.filter(x=>x!=='*').length));setText('tl-note',r.start<0?'no AUG start codon':r.stopped?'stop codon reached: translation ends':'no stop codon before the end of the sequence');sim.render();}
  inp.addEventListener('input',upd);upd();
  drawers.translation=()=>{sc.render();sim.render();};
  KEYS['tl-canvas']=['Gold circles: amino acids. Pink: tRNA with its anticodon. Orange outline: ribosome (E, P and A sites).',[['ce','amino acid'],['ca','tRNA'],['accent','ribosome'],['cv','mRNA']]];
  KEYS['tl-canvas2']=['Green: start codon. Gold: nonpolar. Blue: polar. Pink: charged. Red: stop.',[['good','start'],['ce','nonpolar'],['cx','polar'],['ca','charged'],['bad','stop']]];
  TIPS['tl-in']=()=>'Translation starts at the first AUG and stops at UAA, UAG or UGA.';
  GLOSS['codon']='A group of three mRNA bases that codes for one amino acid or a stop signal.';GLOSS['anticodon']='The three bases on a tRNA complementary to a codon.';GLOSS['trna']='Transfer RNA: carries an amino acid and has an anticodon.';GLOSS['ribosome']='The structure of rRNA and protein that carries out translation.';GLOSS['start codon']='AUG, which also codes for methionine.';GLOSS['stop codon']='UAA, UAG or UGA: signals the end of translation.';
  TT.translation='Ask students to explain what would happen to the protein if the first base of the mRNA were deleted.';
})();
(function(){
  const rc=()=>pick(['A','U','G','C']);
  function mk(n){let s='AUG',used=['AUG'];while(used.length<n){const c=rc()+rc()+rc();if(codonAA(c)==='*')continue;s+=c;used.push(c);}return s;}
  PROBS.push({id:'tl-pep',topic:'translation',title:'Translate an mRNA',gen(){const n=randInt(3,5),s=mk(n),stop=pick(['UAA','UAG','UGA']),full=s+stop,aas=translateFrom(full).aas.filter(x=>x!=='*'),ans=aas.map(x=>AA3[x]).join('–');const wrong=[0,1,2].map(()=>{const a=aas.slice();const i=randInt(0,a.length-1);a[i]=pick('FLSYCWPHQRITNKVADEG'.split('').filter(x=>x!==a[i]));return a.map(x=>AA3[x]).join('–');}).filter((x,i,arr)=>x!==ans&&arr.indexOf(x)===i);while(wrong.length<3)wrong.push(aas.slice().reverse().map(x=>AA3[x]).join('–')+'–Ser'.repeat(wrong.length+1));const m=mcq(ans,wrong);return {q:`The mRNA reads 5′-${full}-3′. Which polypeptide does it code for? (Use the genetic code table.)`,choices:m.choices,ans:m.ans,hint:'Split into codons from AUG and look each one up. The stop codon codes for no amino acid.',sol:`${translateFrom(full).codons.join(' ')} → <b>${ans}</b> then stop.`};}});
  PROBS.push({id:'tl-len',topic:'translation',title:'Amino acids from mRNA length',gen(){const n=randInt(30,300),L=n*3+3,ans=n;return {q:`The coding region of an mRNA, from the start codon through the stop codon, is ${L} nucleotides long. How many amino acids are in the polypeptide?`,ans,unit:'',tol:0,chk:(L-3)/3,hint:'Three nucleotides per codon, and the stop codon does not code for an amino acid.',sol:`${L}/3 = ${L/3} codons, minus the stop codon = <b>${ans}</b>.`};}});
  PROBS.push({id:'tl-anti',topic:'translation',title:'Anticodon',gen(){let c;do{c=rc()+rc()+rc();}while(codonAA(c)==='*');const a=compRNA(c),m=mcq(a,[c,compRNA(c.split('').reverse().join('')),compDNAs(c).replace(/T/g,'A')]);return {q:`A codon in mRNA is 5′-${c}-3′. What is the matching tRNA anticodon, written 3′ → 5′?`,choices:m.choices.map(x=>'3′-'+x+'-5′'),ans:m.ans,hint:'The anticodon is complementary and antiparallel to the codon. Pair A–U and G–C.',sol:`<b>3′-${a}-5′</b>.`};}});
  const q=[['Which codon is the usual start codon?','AUG',['UAA','UGA','GGG']],['How many different codons are there?','64',['20','61','3']],['Which is NOT a stop codon?','UGG',['UAA','UAG','UGA']],['The genetic code is described as redundant because','several codons can code for the same amino acid',['one codon can code for several amino acids','all codons are stop codons','DNA is copied twice']]];
  PROBS.push({id:'tl-fact',topic:'translation',title:'Genetic code facts',gen(){const p=pick(q),m=mcq(p[1],p[2]);return {q:p[0],choices:m.choices,ans:m.ans,hint:'Use the genetic code table.',sol:`<b>${p[1]}</b>.`};}});
})();
