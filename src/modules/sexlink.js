/* ---------------- Sex linkage & pedigrees ---------------- */
(function sexlink(){
  const cv=$('#sx-canvas');if(!cv)return;
  let mo='XHXh',fa='XHY';
  const gm=g=>g==='XHXH'?['XH','XH']:g==='XHXh'?['XH','Xh']:['Xh','Xh'],gf=g=>g==='XHY'?['XH','Y']:['Xh','Y'];
  const kid=(m,f)=>f==='Y'?{sex:'M',g:m+'Y',st:m==='Xh'?'affected':'normal'}:{sex:'F',g:m+f,st:m==='Xh'&&f==='Xh'?'affected':(m==='Xh'||f==='Xh')?'carrier':'normal'};
  function kids(){const r=[];gm(mo).forEach(m=>gf(fa).forEach(f=>r.push(kid(m,f))));return r;}
  const sim=sim2d(cv,{h:w=>clamp(w*.46,240,300),draw(ctx,w,h){const ks=kids(),s=Math.min((h-70)/2,(w-110)/2,120),x0=w/2-s,y0=46,F='700 15px '+MONO.split(' ').slice(1).join(' ');
    gm(mo).forEach((a,k)=>label(ctx,a,x0+s*(k+.5),y0-16,T.ca,'center','middle',F));gf(fa).forEach((a,k)=>label(ctx,a,x0-26,y0+s*(k+.5),T.cx,'center','middle',F));label(ctx,'mother\'s eggs →',x0+s,y0-34,T.muted,'center','middle',MONO);
    ks.forEach((k,i)=>{const c=i%2,r=Math.floor(i/2),col=k.st==='affected'?T.bad:k.st==='carrier'?T.ca:T.cx;ctx.fillStyle=alpha(col,k.st==='affected'?.55:.25);ctx.fillRect(x0+c*s,y0+r*s,s,s);ctx.strokeStyle=col;ctx.lineWidth=2;ctx.strokeRect(x0+c*s,y0+r*s,s,s);label(ctx,k.g,x0+c*s+s/2,y0+r*s+s/2-16,T.ink,'center','middle',F);label(ctx,k.sex==='M'?'son':'daughter',x0+c*s+s/2,y0+r*s+s/2+4,T.muted,'center','middle',MONO);label(ctx,k.st,x0+c*s+s/2,y0+r*s+s/2+20,T.muted,'center','middle',MONO);});}});
  function upd(){const ks=kids(),sons=ks.filter(k=>k.sex==='M'),dau=ks.filter(k=>k.sex==='F');const fr=(a,b)=>a===0?'none':a===b?'all':a+' of '+b;setText('sx-sons',fr(sons.filter(k=>k.st==='affected').length,sons.length));setText('sx-dau',fr(dau.filter(k=>k.st==='affected').length,dau.length)+' affected, '+fr(dau.filter(k=>k.st==='carrier').length,dau.length)+' carriers');sim.render();}
  segBind('sx-m','k',v=>{mo=v;upd();});segBind('sx-f','k',v=>{fa=v;upd();});$('#sx-lab').addEventListener('labreset',()=>{mo='XHXh';fa='XHY';segSet('sx-m',1);segSet('sx-f',0);upd();});segSet('sx-m',1);upd();
  /* pedigree */
  const PED={ar:{sex:'MFMFFMMF',aff:[0,0,1,0,1,0,1,0],gt:['Aa','Aa','aa','A_','aa','Aa','aa','Aa'],clue:'two unaffected parents have an affected child (autosomal recessive)',note:'both sexes are affected; the trait can skip generations; affected child, unaffected parents'},
    ad:{sex:'MFMFFMMF',aff:[1,0,1,0,1,0,1,0],gt:['Aa','aa','Aa','aa','Aa','aa','Aa','aa'],clue:'every affected person has an affected parent (autosomal dominant)',note:'does not skip generations; both sexes affected; about half of the children of an affected parent are affected'},
    xr:{sex:'MFMMFMMF',aff:[0,0,1,0,0,0,1,0],gt:['XHY','XHXh','XhY','XHY','XHXh','XHY','XhY','XHX_'],clue:'mostly males affected, passing through unaffected carrier females (X-linked recessive)',note:'affected males have unaffected fathers; carrier mothers pass it to sons; no father-to-son transmission'}};
  const POS=[[.3,0],[.7,0],[.12,1],[.36,1],[.6,1],[.86,1],[.64,2],[.84,2]];
  let pt='ar',showG=false;
  const sim2=sim2d($('#sx-canvas2'),{h:w=>clamp(w*.56,280,360),draw(ctx,w,h){const D=PED[pt],gy=i=>38+i*(h-70)/2,sz=Math.min(24,w*.04),px=i=>w*POS[i][0],py=i=>gy(POS[i][1]);ctx.strokeStyle=T.ink;ctx.lineWidth=2;
    const couple=(a,b,ks)=>{ctx.beginPath();ctx.moveTo(px(a),py(a));ctx.lineTo(px(b),py(b));ctx.stroke();const mx=(px(a)+px(b))/2,my=py(a),by=my+(gy(1)-gy(0))*.45;ctx.beginPath();ctx.moveTo(mx,my);ctx.lineTo(mx,by);const xs=ks.map(k=>px(k));ctx.moveTo(Math.min(...xs,mx),by);ctx.lineTo(Math.max(...xs,mx),by);ks.forEach(k=>{ctx.moveTo(px(k),by);ctx.lineTo(px(k),py(k)-sz);});ctx.stroke();};
    couple(0,1,[2,3,4]);couple(4,5,[6,7]);
    for(let i=0;i<8;i++){const x=px(i),y=py(i),f=D.aff[i],male=D.sex[i]==='M';ctx.fillStyle=f?T.ink:T.surface;ctx.strokeStyle=T.ink;ctx.lineWidth=2.4;ctx.beginPath();if(male)ctx.rect(x-sz,y-sz,2*sz,2*sz);else ctx.arc(x,y,sz,0,6.283);ctx.fill();ctx.stroke();
      if(showG)label(ctx,D.gt[i],x,y+sz+14,T.accent,'center','middle',MONO);}
    label(ctx,'square = male · circle = female · filled = affected',w/2,h-8,T.muted,'center','middle',MONO);}});
  function upd2(){setText('sx-clue',PED[pt].clue);setText('sx-note',PED[pt].note);sim2.render();}
  segBind('sx-pat','k',v=>{pt=v;upd2();});$('#sx-gt').addEventListener('click',()=>{showG=!showG;$('#sx-gt').setAttribute('aria-pressed',String(showG));$('#sx-gt').textContent=showG?'Hide genotypes':'Show genotypes';upd2();});
  $('#sx-lab2').addEventListener('labreset',()=>{pt='ar';showG=false;segSet('sx-pat',0);$('#sx-gt').textContent='Show genotypes';$('#sx-gt').setAttribute('aria-pressed','false');upd2();});upd2();
  drawers.sexlink=()=>{sim.render();sim2.render();};
  KEYS['sx-canvas']=['Each square is a possible child. Pink = affected, light pink = carrier, blue = unaffected.',[['bad','affected'],['ca','carrier daughter'],['cx','unaffected']]];
  KEYS['sx-canvas2']=['Filled symbols are affected. Switch patterns and compare how the trait passes between generations.',[['ink','affected']]];
  TIPS['sx-m']=()=>'Sons get their X only from the mother. Daughters get one X from each parent.';
  GLOSS['x-linked']='A gene located on the X chromosome.';GLOSS['carrier']='A heterozygous individual who does not show a recessive trait but can pass the allele on.';GLOSS['pedigree']='A family tree that shows how a trait is inherited.';GLOSS['autosomal']='Located on a non-sex chromosome.';
  TT.sexlink='Ask students to assign genotypes to each person in the pedigree and check every mating.';
})();
(function(){
  const m=[['XHXh','XHY',[1/2,'sons',1/4,'any child']],['XHXH','XhY',[0,'sons',0,'any child']],['XHXh','XhY',[1/2,'sons',1/2,'any child']],['XhXh','XHY',[1,'sons',1/2,'any child']]];
  PROBS.push({id:'sx-son',topic:'sexlink',title:'Chance for a son',gen(){const mo=pick([['carrier mother (XᴴXʰ)',1/2],['mother with the trait (XʰXʰ)',1],['non-carrier mother (XᴴXᴴ)',0]]);return {q:`A recessive X-linked trait is carried on the X chromosome. Using Xᴴ for the normal allele and Xʰ for the trait, what is the probability that a son of a ${mo[0]} and an unaffected father shows the trait? (Give a decimal.)`,ans:mo[1],unit:'',abs:.011,chk:mo[1],hint:'A son gets his X from his mother only.',sol:`<b>${fmt(mo[1],2)}</b>.`};}});
  PROBS.push({id:'sx-any',topic:'sexlink',title:'Chance for any child',gen(){const c=pick([['carrier mother and unaffected father',.25],['carrier mother and affected father',.5],['non-carrier mother (XᴴXᴴ) and an affected father',0]]);return {q:`Hemophilia is X-linked recessive. A ${c[0]} have a child (sex unknown). What is the probability the child has hemophilia?`,ans:c[1],unit:'',abs:.011,chk:c[1],hint:'Draw the Punnett square for all four children.',sol:`<b>${fmt(c[1],2)}</b>.`};}});
  const q=[['Two unaffected parents have an affected daughter. The trait is most likely','autosomal recessive',['X-linked recessive','autosomal dominant','Y-linked']],['A trait never passes from father to son. The best explanation is that it is','X-linked',['autosomal dominant','autosomal recessive','mitochondrial only']],['Every affected person has an affected parent and the trait appears in every generation. This suggests','autosomal dominant',['autosomal recessive','X-linked recessive','polygenic']],['Why are X-linked recessive traits seen more often in males?','males have only one X so one recessive allele is enough',['males have two X chromosomes','the Y chromosome carries the allele','males are heterozygous']]];
  PROBS.push({id:'sx-ped',topic:'sexlink',title:'Reading a pedigree',gen(){const p=pick(q),m2=mcq(p[1],p[2]);return {q:p[0],choices:m2.choices,ans:m2.ans,hint:'Look for skipped generations and the sexes affected.',sol:`<b>${p[1]}</b>.`};}});
})();
