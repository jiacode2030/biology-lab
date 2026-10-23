/* ---------------- Diffusion & osmosis ---------------- */
(function transport(){
  const cv=$('#tr-canvas');if(!cv)return;
  let mode='diff',running=true,W=[100,100],S=[40,10];
  const dots={w:[[],[]],s:[[],[]]};
  const conc=i=>S[i]/(W[i]/100);
  function sync(){for(let i=0;i<2;i++){const nw=Math.round(W[i]/2.2),ns=Math.round(S[i]*.8);
    [[dots.w[i],nw],[dots.s[i],ns]].forEach(([arr,n])=>{while(arr.length<n)arr.push({x:Math.random(),y:Math.random(),vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3});while(arr.length>n)arr.pop();});}}
  function reset(){W=[100,100];S=[+$('#tr-sl').value,+$('#tr-sr').value];dots.w=[[],[]];dots.s=[[],[]];sync();}
  const sim=sim2d(cv,{h:w=>clamp(w*.55,280,380),paused:()=>!running,
    step(dt){const [L,R]=[0,1];
      if(mode==='diff'){const f=.9*(conc(L)-conc(R))/100*dt*60;const m=clamp(f*1.0,-S[L]*.5,S[R]*.5);S[L]-=m;S[R]+=m;W=[100,100];}
      else{const g=(conc(L)-conc(R))-(W[L]-W[R])*.9;const dW=clamp(g*.18*dt,-8*dt,8*dt)*3;W[L]=clamp(W[L]+dW,35,165);W[R]=200-W[L];}
      sync();const wob=(arr)=>arr.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx+=(Math.random()-.5)*dt*2;p.vy+=(Math.random()-.5)*dt*2;p.vx=clamp(p.vx,-.35,.35);p.vy=clamp(p.vy,-.35,.35);if(p.x<0||p.x>1){p.vx=-p.vx;p.x=clamp(p.x,0,1);}if(p.y<0||p.y>1){p.vy=-p.vy;p.y=clamp(p.y,0,1);}});
      [0,1].forEach(i=>{wob(dots.w[i]);wob(dots.s[i]);});update(true);},
    draw(ctx,w,h){const pad=16,base=h-30,top=pad+6,H=base-top,cw=(w-2*pad)/2,mid=pad+cw;
      [0,1].forEach(i=>{const x0=pad+i*cw,lvl=H*(W[i]/180),y=base-lvl;ctx.fillStyle=alpha(T.cx,.14);ctx.fillRect(x0,y,cw,lvl);ctx.strokeStyle=T.muted;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0+(i?0:1),top);ctx.lineTo(x0+(i?0:1),base);ctx.lineTo(x0+cw-(i?1:0),base);if(i)ctx.lineTo(x0+cw-1,top);ctx.stroke();
        ctx.save();ctx.beginPath();ctx.rect(x0+2,y,cw-4,lvl);ctx.clip();dots.w[i].forEach(p=>{ctx.beginPath();ctx.arc(x0+6+p.x*(cw-12),y+4+p.y*(lvl-8),2.4,0,6.283);ctx.fillStyle=alpha(T.cx,.8);ctx.fill();});
        dots.s[i].forEach(p=>{ctx.beginPath();ctx.arc(x0+8+p.x*(cw-16),y+6+p.y*(lvl-12),4.6,0,6.283);ctx.fillStyle=T.ca;ctx.fill();});ctx.restore();
        label(ctx,i?'right':'left',x0+cw/2,base+16,T.muted,'center','middle',MONO);});
      ctx.save();ctx.setLineDash([6,5]);ctx.strokeStyle=T.ink;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(mid,top);ctx.lineTo(mid,base);ctx.stroke();ctx.restore();
      label(ctx,mode==='diff'?'membrane: water and solute pass':'membrane: only water passes',mid,top-8,T.muted,'center','middle',MONO);}});
  function update(skip){const dh=(W[0]-W[1])/2;setText('tr-cl',fmt(conc(0),1)+' per 100 water');setText('tr-cr',fmt(conc(1),1)+' per 100 water');setText('tr-dh',(dh>0?'+':'')+fmt(dh,1)+' units');
    const dc=conc(0)-conc(1);let st;
    if(mode==='diff')st=Math.abs(dc)<.6?'solute evened out: no net movement':`solute is moving ${dc>0?'left → right':'right → left'}`;
    else{const g=dc-(W[0]-W[1])*.9;st=Math.abs(g)<1.2?(Math.abs(dc)<.6?'balanced: equal concentrations':'balanced: osmotic pull equals the extra water height'):`water is moving ${g>0?'toward the left (more solute)':'toward the right (more solute)'}`;}
    setText('tr-state',st);if(!skip)sim.render();}
  segBind('tr-mode','k',v=>{mode=v;reset();update();});
  ['tr-sl','tr-sr'].forEach((id,i)=>bindRange(id,v=>String(v),v=>{S[i]=v;sync();update();}));
  $('#tr-run').addEventListener('click',()=>{running=!running;$('#tr-run').textContent=running?'Pause':'Resume';});
  $('#tr-reset').addEventListener('click',()=>{reset();update();});
  $('#tr-lab').addEventListener('labreset',()=>{$('#tr-sl').value=40;$('#tr-sr').value=10;setText('tr-sl-out','40');setText('tr-sr-out','10');mode='diff';$$('#tr-mode button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===0)));reset();update();});
  reset();update();
  /* cells */
  let ct='an',cc=.15;const cin=.30;
  const rel=()=>ct==='an'?cin/Math.max(cc,1e-6):(cc<cin?1.0:Math.max(.4,cin/cc));
  const sim2=sim2d(cv.parentElement&&$('#tr-canvas2'),{h:w=>clamp(w*.42,240,320),draw(ctx,w,h){const cx=w/2,cy=h/2,R0=Math.min(h/2-26,w/4);
      if(ct==='an'){const v=rel();const burst=v>1.55;const r=R0*Math.sqrt(Math.min(v,1.55))*.82;
        if(burst){for(let i=0;i<14;i++){const a=i/14*6.283,rr=R0*1.08,r2=R0*1.3;ctx.strokeStyle=T.ca;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx+rr*Math.cos(a),cy+rr*Math.sin(a));ctx.lineTo(cx+r2*Math.cos(a),cy+r2*Math.sin(a));ctx.stroke();}label(ctx,'lysed',cx,cy,T.ca,'center','middle','700 18px "IBM Plex Sans",sans-serif');}
        else{ctx.beginPath();for(let i=0;i<=60;i++){const a=i/60*6.283,wob=v<.8?1+.09*Math.sin(a*9):1;const rr=r*wob;i?ctx.lineTo(cx+rr*Math.cos(a),cy+rr*Math.sin(a)):ctx.moveTo(cx+rr*Math.cos(a),cy+rr*Math.sin(a));}ctx.closePath();ctx.fillStyle=alpha(T.ca,.2);ctx.fill();ctx.strokeStyle=T.ca;ctx.lineWidth=3;ctx.stroke();ctx.beginPath();ctx.arc(cx,cy,r*.28,0,6.283);ctx.fillStyle=alpha(T.ca,.5);ctx.fill();}
        ctx.setLineDash([4,5]);ctx.strokeStyle=T.muted;ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(cx,cy,R0*.82,0,6.283);ctx.stroke();ctx.setLineDash([]);label(ctx,'dashed ring = original size',cx,h-8,T.muted,'center','middle',MONO);}
      else{const v=rel(),wallR=R0*.95;ctx.lineWidth=7;ctx.strokeStyle=T.cv;ctx.strokeRect(cx-wallR,cy-wallR*.8,2*wallR,1.6*wallR);
        const sx=wallR*(cc<cin?.93:cc===cin?.88:.86*Math.sqrt(v)),sy=wallR*.8*(cc<cin?.93:cc===cin?.88:.86*Math.sqrt(v));ctx.fillStyle=alpha(T.cx,.22);ctx.fillRect(cx-sx,cy-sy,2*sx,2*sy);ctx.strokeStyle=T.cx;ctx.lineWidth=2.5;ctx.strokeRect(cx-sx,cy-sy,2*sx,2*sy);
        ctx.beginPath();ctx.arc(cx,cy,Math.min(sx,sy)*.28,0,6.283);ctx.fillStyle=alpha(T.ca,.5);ctx.fill();label(ctx,'green = cell wall',cx,h-8,T.muted,'center','middle',MONO);}
      label(ctx,`outside ${fmt(cc,2)} M · inside ${fmt(cin,2)} M`,cx,14,T.muted,'center','middle',MONO);}});
  function upd2(){const d=cc-cin,ton=Math.abs(d)<.015?'isotonic':d>0?'hypertonic':'hypotonic';setText('tr-ton',ton);setText('tr-mv',ton==='isotonic'?'no net movement':d>0?'water leaves the cell':'water enters the cell');
    let look;if(ct==='an'){const v=rel();look=ton==='isotonic'?'normal size':d>0?'shrinks (crenates)':(v>1.55?'bursts (lysis)':'swells');}else look=ton==='isotonic'?'flaccid: wall just touched, no pressure':d>0?'plasmolyzed: membrane pulls away from the wall':'turgid: firm, wall resists swelling';
    setText('tr-look',look);sim2.render();}
  bindRange('tr-c',v=>fmt(v,2)+' M',v=>{cc=v;upd2();});segBind('tr-cell','k',v=>{ct=v;upd2();});upd2();
  drawers.transport=()=>{sim.render();sim2.render();};
  KEYS['tr-canvas']=['Pause and change the solute amounts. Pink dots are solute; blue dots and the blue fill are water.',[['ca','solute particles'],['cx','water']]];
  KEYS['tr-canvas2']=['Slide the outside concentration. Compare the cell with its original size.',[['ca','animal cell'],['cv','plant cell wall'],['cx','plant cell membrane and contents']]];
  TIPS['tr-sl']=()=>'More solute on a side means less free water there, so water moves toward it (osmosis), or solute spreads out (diffusion).';
  TIPS['tr-c']=el=>{const d=+el.value-cin;return Math.abs(d)<.015?'Isotonic: the same solute inside and out.':d>0?'More solute outside (hypertonic): water leaves the cell.':'Less solute outside (hypotonic): water enters the cell.';};
  GLOSS['diffusion']='Net movement of particles from high to low concentration because of random thermal motion. Passive.';
  GLOSS['osmosis']='Diffusion of water across a selectively permeable membrane, toward the side with more solute.';
  GLOSS['hypertonic']='A solution with more solute than the cell. Water leaves the cell.';GLOSS['hypotonic']='A solution with less solute than the cell. Water enters the cell.';GLOSS['isotonic']='Equal solute concentration on both sides. No net water movement.';
  GLOSS['turgid']='A plant cell firm with water pressing the membrane against the cell wall.';GLOSS['plasmolysis']='The membrane of a plant cell pulling away from the wall in a hypertonic solution.';
  TT.transport='Ask students to predict the direction of water movement before pressing play, and to say what happens to the final concentrations in each mode.';
})();
(function(){
  PROBS.push({id:'tr-tonic',topic:'transport',title:'Tonicity and water movement',gen(){const cell=pick([.2,.3,.4,.5]),out=pick([.1,.2,.3,.4,.5,.6]),kind=pick(['cell','sol']);const ton=out===cell?'isotonic':out>cell?'hypertonic':'hypotonic',eff=out===cell?'no net movement of water':out>cell?'water leaves the cell':'water enters the cell';
    const ans=kind==='sol'?ton:eff,opts=kind==='sol'?['hypertonic','hypotonic','isotonic']:['water leaves the cell','water enters the cell','no net movement of water'];const m=mcq(ans,opts);
    return {q:`An animal cell contains ${cell} M solute and is placed in a ${out} M solution. Solute cannot cross the membrane, water can. ${kind==='sol'?'The solution is':'What happens?'}`,choices:m.choices,ans:m.ans,hint:'Compare the solute concentrations. More solute outside: hypertonic, water leaves. Less solute outside: hypotonic, water enters.',sol:`Outside ${out} M vs inside ${cell} M: the solution is ${ton}, so ${eff}. Answer: <b>${ans}</b>.`};}});
  PROBS.push({id:'tr-dir',topic:'transport',title:'Which way does water move?',gen(){const a=pick([.1,.2,.3,.4]),b=pick([.5,.6,.7,.8]),leftHigh=Math.random()<.5,L=leftHigh?b:a,R=leftHigh?a:b,ans=leftHigh?'toward the left chamber':'toward the right chamber',m=mcq(ans,['toward the left chamber','toward the right chamber','neither: it stays equal','it depends on the solute type']);
    return {q:`A membrane is permeable to water but not to sucrose. The left chamber has ${L} M sucrose and the right chamber has ${R} M. Net water movement is:`,choices:m.choices,ans:m.ans,hint:'Water moves toward the side with the higher solute concentration.',sol:`The ${leftHigh?'left':'right'} chamber has more solute, so water moves <b>${ans}</b>.`};}});
  PROBS.push({id:'tr-potato',topic:'transport',title:'Isotonic concentration from potato data',gen(){const c0=pick([.2,.25,.3,.35,.4]),a=pick([40,50,60,70]),cs=[0,.2,.4,.6,.8],ys=cs.map(c=>+(a*(c0-c)).toFixed(1));
    let i=0;while(i<4&&!(ys[i]>=0&&ys[i+1]<=0))i++;const x1=cs[i],x2=cs[i+1],y1=ys[i],y2=ys[i+1],ans=y1===y2?x1:x1+(0-y1)*(x2-x1)/(y2-y1);
    const tbl=`<table class="lmtbl"><thead><tr><th>sucrose (M)</th>${cs.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody><tr><th>mass change (%)</th>${ys.map(y=>`<td>${y>0?'+':''}${fmt(y,1)}</td>`).join('')}</tbody></table>`;
    return {q:`Potato cores were weighed, placed in sucrose solutions, and weighed again. Use linear interpolation to estimate the sucrose molarity that is isotonic to the potato cells (where the mass change is 0). Give a decimal to two places.${tbl}`,ans,unit:'M',abs:.015,chk:c0,hint:'Find the two concentrations where the change goes from positive to negative, then interpolate to zero.',sol:`The change is ${fmt(y1,1)}% at ${x1} M and ${fmt(y2,1)}% at ${x2} M. The zero is at ${x1} + (0 − (${fmt(y1,1)}))·(${x2} − ${x1})/(${fmt(y2,1)} − (${fmt(y1,1)})) ≈ <b>${fmt(ans,2)} M</b>.`};}});
  PROBS.push({id:'tr-pct',topic:'transport',title:'Percent change in mass',gen(){const i=pick([2.0,2.5,3.0,4.0,5.0]),pc=ri(-18,24),f=+(i*(1+pc/100)).toFixed(2),ans=(f-i)/i*100;
    return {q:`A dialysis bag starts at ${i.toFixed(2)} g and has a mass of ${f.toFixed(2)} g after sitting in a solution. What is the percent change in mass? Give a decimal to one place (negative if it lost mass).`,ans,unit:'%',abs:.25,hint:'% change = (final − initial)/initial × 100.',sol:`(${f.toFixed(2)} − ${i.toFixed(2)})/${i.toFixed(2)} × 100 = <b>${fmt(ans,1)}%</b>.`};}});
  PROBS.push({id:'tr-rate',topic:'transport',title:'What controls the rate of diffusion?',gen(){const a=pick([2,3,4]),b=pick([2,3,.5]),c=pick([2,4,.5]),ans=a*b/c;
    return {q:`The rate of diffusion across a membrane is proportional to (surface area × concentration difference) / thickness. If the surface area is multiplied by ${a}, the concentration difference by ${b}, and the thickness by ${c}, by what factor does the rate change? Give a decimal.`,ans,unit:'×',tol:.01,chk:a*b/c,hint:'Area and concentration difference multiply the rate; thickness divides it.',sol:`Factor = ${a} × ${b} ÷ ${c} = <b>${fmt(ans,2)}</b>.`};}});
  PROBS.push({id:'tr-cross',topic:'transport',title:'What can cross a lipid bilayer?',gen(){const R=[['oxygen (O₂)','crosses directly: small and nonpolar'],['carbon dioxide (CO₂)','crosses directly: small and nonpolar'],['sodium ions (Na⁺)','needs a channel or pump: charged'],['glucose','needs a transport protein: large and polar'],['amino acids','need transport proteins: polar'],['steroid hormones','cross directly: nonpolar and lipid-soluble']],[s,ans]=pick(R),m=mcq(ans,R.map(r=>r[1]));
    return {q:`How does ${s} get across a plasma membrane?`,choices:m.choices,ans:m.ans,hint:'Small nonpolar molecules slip through the hydrophobic core; ions and large polar molecules need proteins.',sol:`<b>${ans}</b>.`};}});
})();
