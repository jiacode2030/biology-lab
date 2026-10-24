/* ---------------- Water & hydrogen bonds ---------------- */
(function water(){
  const cv=$('#wa-canvas');if(!cv)return;
  let Tc=20;const N=28,P=[];
  const bondsAt=t=>t<0?4:t<=100?3.6-.015*t:0;
  const DEN=[[0,.9999],[4,1],[20,.9982],[40,.9922],[60,.9832],[80,.9718],[100,.9584]];
  const dens=t=>{if(t<0)return .917;if(t>100)return null;for(let i=1;i<DEN.length;i++)if(t<=DEN[i][0]){const a=DEN[i-1],b=DEN[i];return a[1]+(b[1]-a[1])*(t-a[0])/(b[0]-a[0]);}return .9584;};
  for(let i=0;i<N;i++)P.push({x:Math.random(),y:Math.random(),vx:Math.random()-.5,vy:Math.random()-.5,lx:((i%7)+.5+(Math.floor(i/7)%2?.5:0))/7.6+.03,ly:(Math.floor(i/7)+.5)/4.2+.02,a:Math.random()*6.28});
  const hash=(i,j,k)=>{const s=Math.sin(i*127.1+j*311.7+k*74.7)*43758.5453;return s-Math.floor(s);};
  const sim=sim2d(cv,{h:w=>clamp(w*.5,250,340),
    step(dt){const sp=Tc<0?0:Tc>100?.55:.12+Math.max(0,Tc)*.0018;P.forEach(p=>{if(Tc<0){p.x+=(p.lx-p.x)*Math.min(1,dt*4)+(Math.random()-.5)*.002;p.y+=(p.ly-p.y)*Math.min(1,dt*4)+(Math.random()-.5)*.002;}
        else{p.vx+=(Math.random()-.5)*dt*3;p.vy+=(Math.random()-.5)*dt*3;const m=Math.hypot(p.vx,p.vy)||1;p.vx=p.vx/m*sp;p.vy=p.vy/m*sp;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.x<.03||p.x>.97){p.vx=-p.vx;p.x=clamp(p.x,.03,.97);}if(p.y<.04||p.y>.96){p.vy=-p.vy;p.y=clamp(p.y,.04,.96);}}
        p.a+=dt*(Tc<0?0:.5+sp*3);});},
    draw(ctx,w,h,t){const pw=w-20,ph=h-20,ox=10,oy=10;ctx.strokeStyle=T.line;ctx.lineWidth=2;ctx.strokeRect(ox,oy,pw,ph);
      const pr=bondsAt(Tc)/4,bucket=Math.floor(t*3),cut=Tc<0?Math.min(pw,ph*1.7)/7.2:pw*.17;
      ctx.setLineDash([4,3]);ctx.strokeStyle=T.cx;ctx.lineWidth=1.6;
      for(let i=0;i<N;i++)for(let j=i+1;j<N;j++){const a=P[i],b=P[j],d=Math.hypot((a.x-b.x)*pw,(a.y-b.y)*ph);if(d<cut*1.15&&(Tc<0||hash(i,j,bucket)<pr)){ctx.beginPath();ctx.moveTo(ox+a.x*pw,oy+a.y*ph);ctx.lineTo(ox+b.x*pw,oy+b.y*ph);ctx.stroke();}}
      ctx.setLineDash([]);P.forEach(p=>{const x=ox+p.x*pw,y=oy+p.y*ph;dot2(ctx,x,y,T.cx,8);[.9,2.3].forEach(o=>{dot2(ctx,x+Math.cos(p.a+o)*13,y+Math.sin(p.a+o)*13,T.surface,4);});});}});
  function upd(){const d=dens(Tc);setText('wa-ph',Tc<0?'ice (solid)':Tc<=100?'liquid water':'steam (gas)');setText('wa-b',fmt(bondsAt(Tc),1));setText('wa-d',d==null?'≈ 0.0006 (gas)':fmt(d,3)+(Tc<0?' (ice floats)':Tc===4?' (maximum)':''));sim.render();}
  bindRange('wa-t',v=>v+' °C',v=>{Tc=v;upd();});
  $('#wa-lab').addEventListener('labreset',()=>{Tc=20;setCtl('wa-t',20,v=>v+' °C');upd();});upd();
  /* specific heat */
  let q=1000,m=100;const cv2=$('#wa-canvas2');
  const sim2=sim2d(cv2,{h:w=>clamp(w*.3,140,190),draw(ctx,w,h){const dw=q/(m*4.18),dO=q/(m*2.0),mx=Math.max(10,dO*1.1),L=96,R=w-18,y1=h*.3,y2=h*.68,bh=24;
      [[dw,'water',T.cx,y1],[dO,'oil',T.ce,y2]].forEach(([v,nm,col,y])=>{ctx.fillStyle=alpha(col,.7);ctx.fillRect(L,y-bh/2,(R-L)*v/mx,bh);ctx.strokeStyle=col;ctx.lineWidth=2;ctx.strokeRect(L,y-bh/2,(R-L)*v/mx,bh);label(ctx,nm,L-8,y,T.ink,'right','middle',MONO);label(ctx,'+'+fmt(v,1)+' °C',L+(R-L)*v/mx+6,y,T.ink,'left','middle',MONO);});
      label(ctx,'same heat, same mass',w/2,10,T.muted,'center','middle',MONO);}});
  function upd2(){setText('wa-dw','+'+fmt(q/(m*4.18),2)+' °C');setText('wa-do','+'+fmt(q/(m*2.0),2)+' °C');sim2.render();}
  bindRange('wa-q',v=>v+' J',v=>{q=v;upd2();});bindRange('wa-m',v=>v+' g',v=>{m=v;upd2();});
  $('#wa-lab2').addEventListener('labreset',()=>{q=1000;m=100;setCtl('wa-q',1000,v=>v+' J');setCtl('wa-m',100,v=>v+' g');upd2();});upd2();
  drawers.water=()=>{sim.render();sim2.render();};
  KEYS['wa-canvas']=['Blue circles are oxygen, small white dots are hydrogens, dashed lines are hydrogen bonds. This is a simplified 2-D picture.',[['cx','water molecule and hydrogen bonds']]];
  KEYS['wa-canvas2']=['Water warms about half as much as oil for the same heat.',[['cx','water'],['ce','cooking oil (c ≈ 2.0 J/g°C)']]];
  TIPS['wa-t']=()=>'Colder: bonds persist longer. Hotter: molecules move too fast for bonds to hold.';
  GLOSS['hydrogen bond']='A weak attraction between a hydrogen with a partial positive charge and a nearby electronegative atom (O, N) of another molecule.';
  GLOSS['cohesion']='Attraction between molecules of the same substance, such as water to water.';GLOSS['adhesion']='Attraction between water and a different surface.';GLOSS['specific heat']='Heat needed to raise 1 g of a substance by 1 °C. Water: 4.18 J/g°C.';
  TT.water='Ask which property each lab demonstrates before showing the explanation: bonds vs. density vs. specific heat.';
})();
(function(){
  PROBS.push({id:'wa-q',topic:'water',title:'Heat to warm water',gen(){const m=pick([50,100,200,250,500]),t1=pick([10,15,20,25]),dT=pick([5,10,15,20]),ans=m*4.18*dT;
    return {q:`How much heat energy is needed to warm ${m} g of water from ${t1} °C to ${t1+dT} °C? (c = 4.18 J/g°C)`,ans,unit:'J',abs:ans*.005,chk:m*4.18*dT,hint:'q = m · c · ΔT.',sol:`q = ${m} × 4.18 × ${dT} = <b>${fmt(ans,0)} J</b>.`};}});
  PROBS.push({id:'wa-dt',topic:'water',title:'Temperature change from heat',gen(){const m=pick([50,100,200]),q=pick([836,2090,4180,8360]),ans=q/(m*4.18);
    return {q:`${q} J of heat is absorbed by ${m} g of water (c = 4.18 J/g°C). By how many °C does the temperature rise?`,ans,unit:'°C',abs:.02,chk:q/(m*4.18),hint:'Rearrange q = mcΔT to find ΔT.',sol:`ΔT = ${q}/(${m} × 4.18) = <b>${fmt(ans,2)} °C</b>.`};}});
  const props=[['A water strider walks on a pond because','cohesion of water molecules (surface tension)',['adhesion of water to its legs','low specific heat','ice is less dense than water'],'Hydrogen bonds hold the surface molecules together, forming a film strong enough to support the strider.'],['Water rises up a thin glass tube partly because','adhesion between water and the glass',['water is nonpolar','hydrogen bonds do not form','low heat of vaporization'],'Water molecules stick to the polar glass and pull others up behind them through cohesion.'],['A large lake warms slowly in summer because of water\'s','high specific heat',['low density','nonpolar nature','low cohesion'],'Much of the heat goes into breaking hydrogen bonds before the temperature rises, so water warms slowly.'],['Ice floats on liquid water because','hydrogen bonds hold ice in an open lattice that is less dense',['ice has fewer molecules per bond','ice molecules are lighter','ice is nonpolar'],'In ice each molecule holds four hydrogen bonds that space the molecules farther apart than in the liquid.'],['Table salt dissolves in water because','water is polar and surrounds the ions',['water is nonpolar','salt forms hydrogen bonds with itself','salt is hydrophobic'],'The partial charges of water attract Na⁺ and Cl⁻ and surround them, pulling the crystal apart.']];
  PROBS.push({id:'wa-prop',topic:'water',title:'Property of water',gen(){const p=pick(props),m=mcq(p[1],p[2]);return {q:p[0],choices:m.choices,ans:m.ans,hint:'Match the observation to hydrogen bonding, polarity or specific heat.',sol:`<b>${p[1]}</b>. ${p[3]}`};}});
})();
