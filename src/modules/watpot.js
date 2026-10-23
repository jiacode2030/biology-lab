/* ---------------- Water potential ---------------- */
(function watpot(){
  const cv=$('#wp-canvas');if(!cv)return;
  const RT=.0831*298;let ii=1,cc=.4,pp=0,cs=.1;
  const psC=()=>-cc*RT,psoC=()=>pp+psC(),psS=()=>-ii*cs*RT;
  const sim=sim2d(cv,{h:w=>clamp(w*.5,250,330),draw(ctx,w,h,t){const A=axes2(ctx,w,h,{x0:0,x1:2,y0:-30,y1:5,yt:5,yl:'water potential (bar)',L:62});const y0=A.Y(0);ctx.strokeStyle=T.ink;ctx.lineWidth=1;ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(A.L,y0);ctx.lineTo(A.R,y0);ctx.stroke();ctx.setLineDash([]);
    const bw=(A.R-A.L)*.28;[[psoC(),'cell Ψ',T.cx,.18,psC(),pp],[psS(),'beaker Ψ',T.ca,.62,psS(),0]].forEach(([v,nm,col,p,s,pr])=>{const x=A.L+(A.R-A.L)*p;ctx.fillStyle=alpha(col,.6);ctx.fillRect(x,Math.min(y0,A.Y(v)),bw,Math.abs(A.Y(v)-y0));ctx.strokeStyle=col;ctx.lineWidth=2;ctx.strokeRect(x,Math.min(y0,A.Y(v)),bw,Math.abs(A.Y(v)-y0));
      label(ctx,nm+' = '+fmt(v,1),x+bw/2,Math.max(A.Y(v),y0)+14,T.ink,'center','middle',MONO);
      if(nm==='cell Ψ'){label(ctx,'Ψs '+fmt(s,1)+' + Ψp '+fmt(pr,1),x+bw/2,A.B-6,T.muted,'center','middle',MONO);}});
    const d=psoC()-psS();const cx=w*.5;label(ctx,Math.abs(d)<.15?'no net water movement':d>0?'← water leaves the cell (cell Ψ higher)':'water enters the cell →  (cell Ψ lower)',w*.5,A.T0+8,T.accent,'center','middle',MONO);}});
  function upd(){setText('wp-cpsi',fmt(psoC(),1)+' bar');setText('wp-spsi',fmt(psS(),1)+' bar');const d=psoC()-psS();setText('wp-dir',Math.abs(d)<.15?'none (equilibrium)':d>0?'out of the cell':'into the cell');sim.render();}
  segBind('wp-i','k',v=>{ii=+v;upd();});bindRange('wp-cc',v=>fmt(v,2)+' M',v=>{cc=v;upd();});bindRange('wp-p',v=>fmt(v,1),v=>{pp=v;upd();});bindRange('wp-cs',v=>fmt(v,2)+' M',v=>{cs=v;upd();});
  $('#wp-lab').addEventListener('labreset',()=>{ii=1;cc=.4;pp=0;cs=.1;segSet('wp-i',0);setCtl('wp-cc',.4,v=>fmt(v,2)+' M');setCtl('wp-p',0,v=>fmt(v,1));setCtl('wp-cs',.1,v=>fmt(v,2)+' M');upd();});
  upd();drawers.watpot=()=>sim.render();
  KEYS['wp-canvas']=['Bars hang below zero (pure water). Water moves toward the lower bar.',[['cx','cell Ψ'],['ca','beaker Ψ']]];
  TIPS['wp-p']=()=>'Pressure potential raises the cell Ψ. A turgid cell can reach equilibrium with a solution that is still more dilute.';
  GLOSS['water potential']='The tendency of water to move: Ψ = Ψp + Ψs. Water moves from higher to lower Ψ.';GLOSS['solute potential']='Ψs = −iCRT. More solute means more negative Ψs.';GLOSS['pressure potential']='The physical pressure on water; positive in a turgid cell, zero in an open container.';
  TT.watpot='Ask students to state direction in terms of Ψ before they read the arrow.';
})();
(function(){
  const RT=.0831*298;
  PROBS.push({id:'wp-s',topic:'watpot',title:'Solute potential',gen(){const i=pick([1,1,2]),c=pick([.1,.2,.3,.4,.5,.6]),ans=-i*c*RT;return {q:`Calculate the solute potential of a ${c} M ${i===1?'sucrose':'NaCl'} solution at 25 °C. (i = ${i}; R = 0.0831 L·bar/mol·K; T = 298 K.)`,ans,unit:'bar',abs:.06,chk:-i*c*.0831*298,hint:'Ψs = −iCRT. Convert to kelvin.',sol:`Ψs = −(${i})(${c})(0.0831)(298) = <b>${fmt(ans,2)} bar</b>.`};}});
  PROBS.push({id:'wp-tot',topic:'watpot',title:'Total water potential',gen(){const c=pick([.2,.3,.4,.5]),pp=pick([2,3,4,5]),ans=pp-c*RT;return {q:`A plant cell has a solute concentration of ${c} M sucrose (i = 1) at 25 °C and a pressure potential of +${pp} bar. What is its water potential?`,ans,unit:'bar',abs:.06,chk:pp-c*.0831*298,hint:'Ψ = Ψp + Ψs.',sol:`Ψs = −${c}(0.0831)(298) = ${fmt(-c*RT,2)}; Ψ = ${pp} + (${fmt(-c*RT,2)}) = <b>${fmt(ans,2)} bar</b>.`};}});
  PROBS.push({id:'wp-dir',topic:'watpot',title:'Direction of water movement',gen(){const a=pick([-4.2,-6.5,-8.1,-10.3]),b=pick([-1.5,-2.8,-12.6,-14.0]),into=b>a?false:true,mAns=into?'into region B':'into region A',m=mcq(mAns,['into region B','into region A','no net movement','it depends on pressure only']);
    return {q:`Region A has Ψ = ${a} bar and region B has Ψ = ${b} bar, separated by a membrane permeable to water. Water moves:`,choices:m.choices,ans:m.ans,hint:'Water moves toward the lower (more negative) water potential.',sol:`${a>b?'B':'A'} has the lower Ψ, so water moves <b>${mAns}</b>.`};}});
  PROBS.push({id:'wp-turg',topic:'watpot',title:'Pressure needed for equilibrium',gen(){const cin=pick([.4,.5,.6]),cout=pick([.1,.15,.2]),ans=(cin-cout)*RT;return {q:`A plant cell contains ${cin} M sucrose and sits in an open beaker of ${cout} M sucrose at 25 °C. What pressure potential (in bar) must the cell reach for water to stop entering? (i = 1, R = 0.0831 L·bar/mol·K, T = 298 K)`,ans,unit:'bar',abs:.08,chk:(cin-cout)*.0831*298,hint:'At equilibrium cell Ψ equals beaker Ψ: Ψp + Ψs(cell) = Ψs(beaker).',sol:`Ψp = Ψs(beaker) − Ψs(cell) = ${fmt(-cout*RT,2)} − (${fmt(-cin*RT,2)}) = <b>${fmt(ans,2)} bar</b>.`};}});
})();
