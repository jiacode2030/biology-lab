/* ---------------- Surface area to volume ---------------- */
(function sav(){
  const cv=$('#sv-canvas');if(!cv)return;
  let sh='cube',s=3;
  const SA=()=>sh==='cube'?6*s*s:4*Math.PI*s*s,V=()=>sh==='cube'?s*s*s:4/3*Math.PI*s*s*s,K=()=>sh==='cube'?6:3;
  const sim=sim2d(cv,{h:w=>clamp(w*.46,230,310),draw(ctx,w,h){const gw=w*.42,cx=gw/2+8,cy=h/2,m=Math.min(gw,h)*.8,sz=m*(s/10)*.95+4;
    if(sh==='cube'){const o=sz*.3;ctx.fillStyle=alpha(T.cx,.15);ctx.strokeStyle=T.cx;ctx.lineWidth=2.4;ctx.strokeRect(cx-sz/2+o,cy-sz/2-o,sz,sz);ctx.fillRect(cx-sz/2+o,cy-sz/2-o,sz,sz);ctx.fillStyle=alpha(T.cx,.3);ctx.fillRect(cx-sz/2,cy-sz/2,sz,sz);ctx.strokeRect(cx-sz/2,cy-sz/2,sz,sz);[[-1,-1],[1,-1],[1,1]].forEach(([a,b])=>{ctx.beginPath();ctx.moveTo(cx+a*sz/2,cy+b*sz/2);ctx.lineTo(cx+a*sz/2+o,cy+b*sz/2-o);ctx.stroke();});}
    else{ctx.beginPath();ctx.arc(cx,cy,sz/2,0,6.283);ctx.fillStyle=alpha(T.cx,.25);ctx.fill();ctx.strokeStyle=T.cx;ctx.lineWidth=2.4;ctx.stroke();}
    label(ctx,(sh==='cube'?'side ':'radius ')+fmt(s,1)+' µm',cx,h-10,T.muted,'center','middle',MONO);
    const A=axes2(ctx,w,h,{x0:0,x1:10,y0:0,y1:6,xt:2,yt:2,xl:'size (µm)',yl:'SA : V (µm⁻¹)',L:gw+46});A.R=w-12;
    curve2(ctx,A,x=>Math.min(6,K()/Math.max(x,.01)),.5,10,T.ca);dot2(ctx,A.X(s),A.Y(K()/s),T.accent,6);}});
  function upd(){setText('sv-sa',fmt(SA(),1)+' µm²');setText('sv-v',fmt(V(),1)+' µm³');setText('sv-r',fmt(SA()/V(),2)+' µm⁻¹');const r=SA()/V();setText('sv-n',r>1.5?'yes: lots of surface for its volume':r>.6?'getting difficult':'no: too little surface for its volume');sim.render();}
  segBind('sv-sh','k',v=>{sh=v;upd();});bindRange('sv-s',v=>fmt(v,1)+' µm',v=>{s=v;upd();});
  $('#sv-lab').addEventListener('labreset',()=>{sh='cube';s=3;segSet('sv-sh',0);setCtl('sv-s',3,v=>fmt(v,1)+' µm');upd();});
  upd();drawers.sav=()=>sim.render();
  KEYS['sv-canvas']=['The pink curve is SA:V against size. The dot marks the current cell.',[['cx','the cell'],['ca','SA : V curve']]];
  TIPS['sv-s']=()=>'Surface grows with the square of size, volume with the cube, so SA:V falls as the cell grows.';
  GLOSS['sa:v']='Surface area divided by volume. Higher means faster exchange per unit of cell contents.';
  TT.sav='Ask students to predict SA:V before doubling the size, then compare with the result.';
})();
(function(){
  PROBS.push({id:'sv-cube',topic:'sav',title:'SA:V of a cube',gen(){const s=pick([1,2,3,4,5,6,8,10]),ans=6/s;return {q:`A cubic cell has sides of ${s} µm. What is its surface area to volume ratio?`,ans,unit:'µm⁻¹',abs:.011,chk:6*s*s/(s*s*s),hint:'SA = 6s², V = s³.',sol:`SA = 6·${s}² = ${6*s*s} µm²; V = ${s}³ = ${s**3} µm³; SA:V = <b>${fmt(ans,2)} µm⁻¹</b>.`};}});
  PROBS.push({id:'sv-sph',topic:'sav',title:'SA:V of a sphere',gen(){const r=pick([1,2,3,4,5,6]),ans=3/r;return {q:`A spherical cell has radius ${r} µm. What is its SA:V? (SA = 4πr², V = (4/3)πr³)`,ans,unit:'µm⁻¹',abs:.011,chk:4*Math.PI*r*r/(4/3*Math.PI*r**3),hint:'The π and a factor of 4 cancel, leaving 3/r.',sol:`SA:V = 4πr² / ((4/3)πr³) = 3/r = 3/${r} = <b>${fmt(ans,2)} µm⁻¹</b>.`};}});
  PROBS.push({id:'sv-scale',topic:'sav',title:'Growing a cell',gen(){const k=pick([2,3,4,5]),m=mcq(`SA:V falls to 1/${k} of its original value`,[`SA:V rises by a factor of ${k}`,`SA:V is unchanged`,`SA:V falls to 1/${k*k} of its original value`]);return {q:`All the dimensions of a cell are multiplied by ${k}. What happens to its surface area to volume ratio?`,choices:m.choices,ans:m.ans,hint:'SA scales as k², V as k³.',sol:`SA × ${k*k}, V × ${k**3}, so the ratio is multiplied by ${k*k}/${k**3} = 1/${k}. <b>${m.choices[m.ans]}</b>.`};}});
  PROBS.push({id:'sv-vol',topic:'sav',title:'Volume change',gen(){const k=pick([2,3,4]),ans=k**3;return {q:`The side of a cubic cell is multiplied by ${k}. By what factor does its volume change?`,ans,unit:'×',tol:0,chk:Math.pow(k,3),hint:'V = s³.',sol:`${k}³ = <b>${ans}</b>.`};}});
})();
