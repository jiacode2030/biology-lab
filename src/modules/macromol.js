/* ---------------- Macromolecules & monomers ---------------- */
(function macromol(){
  const cv=$('#mm-canvas');if(!cv)return;
  let kind='sug',n=6;
  const INFO={sug:{poly:['disaccharide','polysaccharide'],bond:'glycosidic bond',els:'C, H, O (about 1 : 2 : 1)',col:()=>T.ce},aa:{poly:['dipeptide','polypeptide'],bond:'peptide bond',els:'C, H, O, N (and sometimes S)',col:()=>T.ca},nuc:{poly:['dinucleotide','nucleic acid strand'],bond:'phosphodiester bond',els:'C, H, O, N, P',col:()=>T.cv}};
  function shape(ctx,x,y,s,col){ctx.fillStyle=alpha(col,.7);ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();
    if(kind==='sug'){for(let i=0;i<6;i++){const a=i/6*6.283+.52;ctx.lineTo(x+Math.cos(a)*s,y+Math.sin(a)*s);}ctx.closePath();ctx.fill();ctx.stroke();}
    else if(kind==='aa'){ctx.arc(x,y,s,0,6.283);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(x,y-s*1.25,s*.45,0,6.283);ctx.fillStyle=alpha(T.ink,.35);ctx.fill();}
    else{ctx.rect(x-s*.8,y-s*.8,s*1.6,s*1.6);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(x,y+s*1.35,s*.45,0,6.283);ctx.fillStyle=alpha(T.ce,.8);ctx.fill();}}
  const sim=sim2d(cv,{h:w=>clamp(w*.3,150,200),draw(ctx,w,h){const s=Math.min(18,(w-30)/n/2.3),gap=(w-30)/n,y=h*.5;const col=INFO[kind].col();
      for(let i=0;i<n;i++){const x=15+gap*(i+.5);if(i<n-1){ctx.strokeStyle=T.ink;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+s,y);ctx.lineTo(x+gap-s,y);ctx.stroke();dot2(ctx,x+gap/2,y+s*1.6+6,T.cx,Math.max(4,s*.35));}shape(ctx,x,y,s,col);}
      label(ctx,'blue drops = water released at each bond',w/2,h-10,T.muted,'center','middle',MONO);}});
  function upd(){const I=INFO[kind];setText('mm-poly',n===2?I.poly[0]:I.poly[1]);setText('mm-bond',I.bond+' × '+(n-1));setText('mm-h2o',String(n-1));setText('mm-els',I.els);sim.render();}
  segBind('mm-kind','k',v=>{kind=v;upd();});bindRange('mm-n',v=>String(v),v=>{n=v;upd();});
  $('#mm-lab').addEventListener('labreset',()=>{kind='sug';n=6;segSet('mm-kind',0);setCtl('mm-n',6);upd();});
  upd();drawers.macromol=()=>sim.render();
  KEYS['mm-canvas']=['Each shape is one monomer. Every bond releases one water molecule.',[['ce','sugar units'],['ca','amino acids'],['cv','nucleotides'],['cx','water']]];
  TIPS['mm-n']=()=>'A linear chain of n monomers has n − 1 bonds and releases n − 1 water molecules.';
  GLOSS['dehydration synthesis']='A reaction that joins monomers by removing a water molecule at each bond.';GLOSS['hydrolysis']='A reaction that breaks a bond by adding a water molecule.';GLOSS['monomer']='A small molecule that can join with others to make a polymer.';
  TT.macromol='Ask which of the four classes is not made of identical repeating units.';
})();
(function(){
  PROBS.push({id:'mm-bonds',topic:'macromol',title:'Water released in synthesis',gen(){const kind=pick([['amino acids','polypeptide'],['glucose molecules','polysaccharide'],['nucleotides','nucleic acid strand']]),n=randInt(4,60);
    return {q:`A ${kind[1]} is made from ${n} ${kind[0]} in a single unbranched chain. How many water molecules are released during its synthesis?`,ans:n-1,unit:'',tol:0,chk:n-1,hint:'A linear chain has n − 1 bonds.',sol:`${n} − 1 = <b>${n-1}</b>.`};}});
  PROBS.push({id:'mm-hyd',topic:'macromol',title:'Hydrolysis uses water',gen(){const n=randInt(5,40);
    return {q:`Complete hydrolysis of an unbranched polymer made of ${n} monomers back into single monomers uses how many water molecules?`,ans:n-1,unit:'',tol:0,chk:n-1,hint:'One water per bond broken.',sol:`There are ${n-1} bonds, so <b>${n-1}</b> waters are used.`};}});
  const pairs=[['amino acids','protein (polypeptide)','peptide bond'],['monosaccharides','polysaccharide','glycosidic bond'],['nucleotides','nucleic acid','phosphodiester bond']];
  PROBS.push({id:'mm-class',topic:'macromol',title:'Monomer, polymer, bond',gen(){const p=pick(pairs),w=pick([1,2]),qs=[`Which type of bond joins ${p[0]}?`,`${p[0][0].toUpperCase()+p[0].slice(1)} are the monomers of which macromolecule?`];const ans=w===1?p[2]:p[1];const pool=w===1?pairs.map(x=>x[2]).concat(['ionic bond']):pairs.map(x=>x[1]).concat(['lipid (fat)']);const m=mcq(ans,pool.filter(x=>x!==ans));
    return {q:qs[w-1],choices:m.choices,ans:m.ans,hint:'Amino acids: peptide. Sugars: glycosidic. Nucleotides: phosphodiester.',sol:w===1?`${p[0][0].toUpperCase()+p[0].slice(1)} are joined by condensation reactions (one water released per link), which form a <b>${p[2]}</b>.`:`${p[0][0].toUpperCase()+p[0].slice(1)} are linked into chains by ${p[2]}s, forming a <b>${p[1]}</b>.`};}});
})();
