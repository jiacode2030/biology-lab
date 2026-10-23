/* ---------------- Biogeochemical cycles ---------------- */
(function cycles(){
  const cv=$('#cy-canvas');if(!cv)return;
  const CY={
    c:{nodes:{atm:['atmosphere CO₂',.5,.12,T=>T.cx],prod:['producers',.14,.5,T=>T.cv],cons:['consumers',.42,.6,T=>T.ce],soil:['soil, dead matter, decomposers',.38,.9,T=>T.hot],fos:['fossil fuels',.86,.62,T=>T.muted],oce:['ocean',.88,.14,T=>T.cx]},
      arr:[['atm','prod','photosynthesis'],['prod','atm','respiration'],['prod','cons','feeding'],['cons','atm','respiration'],['prod','soil','death'],['cons','soil','waste, death'],['soil','atm','decomposition'],['fos','atm','combustion'],['atm','oce','dissolving']],
      key:'photosynthesis (producers), respiration (all organisms), decomposers',human:'burning fossil fuels and clearing forests raise atmospheric CO₂; the ocean absorbs some and becomes more acidic'},
    n:{nodes:{n2:['N₂ in the air',.5,.12,T=>T.cx],nh4:['ammonium NH₄⁺',.18,.55,T=>T.ca],no3:['nitrate NO₃⁻',.52,.62,T=>T.ce],org:['plants and animals (organic N)',.84,.38,T=>T.cv],dec:['decomposers',.52,.92,T=>T.hot]},
      arr:[['n2','nh4','fixation'],['nh4','no3','nitrification'],['no3','org','assimilation'],['org','dec','death, waste'],['dec','nh4','ammonification'],['no3','n2','denitrification']],
      key:'nitrogen-fixing bacteria, nitrifying bacteria, denitrifying bacteria, decomposers',human:'fertilizer and fossil fuel burning add reactive nitrogen; runoff causes eutrophication'},
    p:{nodes:{rock:['rock',.12,.5,T=>T.muted],soil:['soil and water (phosphate)',.42,.18,T=>T.ce],org:['organisms',.82,.22,T=>T.cv],sed:['sediments',.5,.88,T=>T.hot]},
      arr:[['rock','soil','weathering'],['soil','org','uptake, feeding'],['org','soil','decomposition, waste'],['soil','sed','runoff, settling'],['sed','rock','geologic uplift']],
      key:'plants take up phosphate; decomposers return it; there is no gas phase',human:'mining phosphate for fertilizer and runoff cause algal blooms'},
    w:{nodes:{atm:['atmosphere (vapor, clouds)',.5,.12,T=>T.cx],oce:['ocean',.2,.85,T=>T.cx],land:['land and plants',.78,.85,T=>T.cv],gw:['groundwater',.8,.55,T=>T.ca]},
      arr:[['oce','atm','evaporation'],['land','atm','evaporation, transpiration'],['atm','land','precipitation'],['atm','oce','precipitation'],['land','oce','runoff'],['land','gw','infiltration']],
      key:'the sun drives evaporation; plants return water by transpiration',human:'deforestation, dams and groundwater pumping change flows and storage'}};
  let sel='c';
  const sim=sim2d(cv,{h:w=>clamp(w*.58,290,380),draw(ctx,w,h){const C=CY[sel],P=k=>[C.nodes[k][1]*w,C.nodes[k][2]*h];
    ctx.font=MONO;C.arr.forEach(([a,b,nm],i)=>{const p=P(a),q=P(b),dx=q[0]-p[0],dy=q[1]-p[1],len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len,off=(C.arr.some(([x,y])=>x===b&&y===a))?9:0,nx=-uy*off,ny=ux*off,x1=p[0]+ux*34+nx,y1=p[1]+uy*20+ny,x2=q[0]-ux*34+nx,y2=q[1]-uy*20+ny;
      ctx.strokeStyle=T.muted;ctx.fillStyle=T.muted;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-9*ux+5*uy,y2-9*uy-5*ux);ctx.lineTo(x2-9*ux-5*uy,y2-9*uy+5*ux);ctx.closePath();ctx.fill();label(ctx,nm,(x1+x2)/2+nx*1.2,(y1+y2)/2+ny*1.2-6,T.ink,'center','middle','10px '+MONO.split(' ').slice(1).join(' '));});
    Object.values(C.nodes).forEach(([nm,x,y,col])=>{const c=col(T),tw=Math.max(70,nm.length*6.4+14);ctx.fillStyle=alpha(c,.3);ctx.strokeStyle=c;ctx.lineWidth=2;ctx.fillRect(x*w-tw/2,y*h-15,tw,30);ctx.strokeRect(x*w-tw/2,y*h-15,tw,30);label(ctx,nm,x*w,y*h,T.ink,'center','middle','10px '+MONO.split(' ').slice(1).join(' '));});}});
  function upd(){setText('cy-key',CY[sel].key);setText('cy-human',CY[sel].human);sim.render();}
  segBind('cy-sel','k',v=>{sel=v;upd();});$('#cy-lab').addEventListener('labreset',()=>{sel='c';segSet('cy-sel',0);upd();});upd();
  let em=10,yr=30;const base=420,AF=.45,GT=2.13;
  const sim2=sim2d($('#cy-canvas2'),{h:w=>clamp(w*.42,210,270),draw(ctx,w,h){const A=axes2(ctx,w,h,{x0:0,x1:100,y0:400,y1:900,xt:20,yt:100,xl:'years from now',yl:'CO₂ (ppm)',L:50});ctx.setLineDash([4,4]);ctx.strokeStyle=T.muted;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(A.L,A.Y(280));ctx.lineTo(A.R,A.Y(280));ctx.stroke();ctx.setLineDash([]);curve2(ctx,A,t=>Math.min(900,base+em*AF/GT*t),0,100,T.ca);dot2(ctx,A.X(yr),A.Y(Math.min(900,base+em*AF/GT*yr)),T.accent,6);label(ctx,'start: about 420 ppm',A.L+6,A.Y(base)-10,T.muted,'left','middle',MONO);}});
  function upd2(){const inc=em*AF/GT*yr;setText('cy-co2',fmt(base+inc,0)+' ppm');setText('cy-inc',(inc>=0?'+':'')+fmt(inc,0)+' ppm');sim2.render();}
  bindRange('cy-em',v=>fmt(v,1),v=>{em=v;upd2();});bindRange('cy-yr',v=>String(v),v=>{yr=v;upd2();});
  $('#cy-lab2').addEventListener('labreset',()=>{em=10;yr=30;setCtl('cy-em',10,v=>fmt(v,1));setCtl('cy-yr',30);upd2();});upd2();
  drawers.cycles=()=>{sim.render();sim2.render();};
  KEYS['cy-canvas']=['Boxes are reservoirs. Arrows are the processes that move atoms between them.',[['cx','air or water'],['cv','producers'],['ce','consumers or nitrate'],['hot','decomposers or sediments'],['ca','ammonium or groundwater']]];
  KEYS['cy-canvas2']=['Pink line: simple model of CO₂ with constant emissions. Dashed line: about 280 ppm before the industrial era.',[['ca','CO₂ concentration']]];
  TIPS['cy-em']=()=>'This model assumes about 45% of emitted carbon stays in the air and 1 ppm is about 2.13 billion tonnes of carbon.';
  GLOSS['nitrogen fixation']='Conversion of N₂ gas into ammonia by bacteria.';GLOSS['nitrification']='Conversion of ammonium to nitrite and then nitrate by soil bacteria.';GLOSS['denitrification']='Conversion of nitrate to N₂ gas by bacteria in low-oxygen conditions.';GLOSS['reservoir']='A place where an element is stored in a cycle.';GLOSS['greenhouse effect']='Warming of Earth because gases such as CO₂ trap heat.';
  TT.cycles='Ask students to follow one atom from the air into an organism and back.';
})();
(function(){
  const q=[['Which process converts N₂ gas into a form that plants can use after further steps?','nitrogen fixation by bacteria',['denitrification','combustion','photosynthesis']],['Which process moves carbon from the atmosphere into organic molecules?','photosynthesis',['respiration','combustion','decomposition']],['Which process returns nitrogen to the atmosphere as N₂?','denitrification',['nitrification','ammonification','assimilation']],['Which cycle has no significant atmospheric phase?','phosphorus',['carbon','nitrogen','water']],['The main reason atmospheric CO₂ has risen over the past 200 years is','burning fossil fuels',['more volcanoes','less respiration by animals','increased photosynthesis']],['Soil bacteria that convert ammonium to nitrate perform','nitrification',['nitrogen fixation','denitrification','ammonification']]];
  PROBS.push({id:'cy-proc',topic:'cycles',title:'Which process?',gen(){const p=pick(q),m=mcq(p[1],p[2]);return {q:p[0],choices:m.choices,ans:m.ans,hint:'Name the starting and ending forms of the element.',sol:`<b>${p[1]}</b>.`};}});
  PROBS.push({id:'cy-co2',topic:'cycles',title:'CO₂ increase',gen(){const em=pick([5,8,10,12]),yr=pick([10,20,30,50]),ans=em*.45/2.13*yr;return {q:`Emissions of ${em} billion tonnes of carbon per year continue for ${yr} years. Assume 45% of emitted carbon stays in the atmosphere and that 1 ppm of CO₂ corresponds to 2.13 billion tonnes of carbon. By how many ppm does atmospheric CO₂ rise?`,ans,unit:'ppm',abs:ans*.01+.15,chk:em*yr*.45/2.13,hint:'Carbon staying in the air = emissions × years × 0.45. Convert to ppm by dividing by 2.13.',sol:`${em} × ${yr} × 0.45 = ${fmt(em*yr*.45,1)} Gt; ÷ 2.13 = <b>${fmt(ans,1)} ppm</b>.`};}});
})();
