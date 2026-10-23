/* ---------------- Fermentation ---------------- */
(function ferment(){
  const cv=$('#fe-canvas');if(!cv)return;
  let org='yeast',o2=0,need=60;
  const aer=()=>o2>10,per=()=>aer()?30:2;
  function box(ctx,x,y,w,h,col,txt,on=true){ctx.save();ctx.globalAlpha=on?1:.3;ctx.fillStyle=alpha(col,.35);ctx.strokeStyle=col;ctx.lineWidth=2;ctx.fillRect(x-w/2,y-h/2,w,h);ctx.strokeRect(x-w/2,y-h/2,w,h);txt.split('\n').forEach((s,k,a)=>label(ctx,s,x,y+(k-(a.length-1)/2)*14,T.ink,'center','middle',MONO));ctx.restore();}
  function arrow(ctx,x1,y1,x2,y2,col,on=true){ctx.save();ctx.globalAlpha=on?1:.3;ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();const a=Math.atan2(y2-y1,x2-x1);ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-9*Math.cos(a-.4),y2-9*Math.sin(a-.4));ctx.lineTo(x2-9*Math.cos(a+.4),y2-9*Math.sin(a+.4));ctx.closePath();ctx.fill();ctx.restore();}
  const sim=sim2d(cv,{h:w=>clamp(w*.5,250,330),draw(ctx,w,h){const a=aer(),y1=h*.3,y2=h*.55,bw=Math.min(110,w*.2);
    box(ctx,w*.1,h*.42,bw,40,T.ce,'glucose');arrow(ctx,w*.1+bw/2,h*.42,w*.3-bw/2,h*.42,T.ink);box(ctx,w*.3,h*.42,bw+10,52,T.ce,'glycolysis\n+2 ATP');arrow(ctx,w*.3+bw/2+5,h*.42,w*.5-bw/2,h*.42,T.ink);box(ctx,w*.5,h*.42,bw,40,T.ca,'pyruvate');
    arrow(ctx,w*.5+bw/2,h*.36,w*.74-bw/2,y1,T.hot,a);box(ctx,w*.76,y1,bw*1.5,50,T.hot,'respiration\n(mitochondria)',a);label(ctx,'+ ~28 ATP, CO₂, H₂O',w*.76,y1+40,T.hot,'center','middle',MONO);
    arrow(ctx,w*.5+bw/2,h*.48,w*.74-bw/2,y2+34,T.cv,!a);box(ctx,w*.76,y2+34,bw*1.5,50,T.cv,org==='yeast'?'ethanol\n+ CO₂':'lactate',!a);label(ctx,'NADH → NAD⁺ recycled',w*.76,y2+74,T.cv,'center','middle',MONO);
    const mx=Math.max(need/per(),1),bx=w*.08,bw2=w*.84,by=h-34;ctx.fillStyle=alpha(a?T.hot:T.cv,.65);ctx.fillRect(bx,by,bw2*Math.min(1,(need/per())/30),14);ctx.strokeStyle=T.ink;ctx.lineWidth=1.2;ctx.strokeRect(bx,by,bw2,14);label(ctx,'glucose needed (full bar = 30)',bx,by-10,T.muted,'left','middle',MONO);}});
  function upd(){const p=per(),gl=need/p;setText('fe-path',aer()?'aerobic respiration (oxygen is available)':org==='yeast'?'alcoholic fermentation':'lactic acid fermentation');setText('fe-prod',aer()?'CO₂ and H₂O':org==='yeast'?'ethanol and CO₂':'lactate');setText('fe-atp',aer()?'about 30':'2');setText('fe-glu',fmt(gl,gl<10?1:0)+' glucose');sim.render();}
  segBind('fe-org','k',v=>{org=v;upd();});bindRange('fe-o2',v=>v+'%',v=>{o2=v;upd();});bindRange('fe-need',v=>String(v),v=>{need=v;upd();});
  $('#fe-lab').addEventListener('labreset',()=>{org='yeast';o2=0;need=60;segSet('fe-org',0);setCtl('fe-o2',0,v=>v+'%');setCtl('fe-need',60);upd();});
  upd();drawers.ferment=()=>sim.render();
  KEYS['fe-canvas']=['Faded paths are not used. The bar compares glucose needed for your ATP target.',[['hot','respiration'],['cv','fermentation'],['ce','glycolysis']]];
  TIPS['fe-o2']=()=>'Above a small oxygen level the cell switches to respiration (a simplified threshold).';
  GLOSS['fermentation']='Breaking down glucose without oxygen, using an organic molecule as the final electron acceptor to recycle NAD⁺.';GLOSS['alcoholic fermentation']='Fermentation in which pyruvate becomes ethanol and CO₂.';GLOSS['lactic acid fermentation']='Fermentation in which pyruvate becomes lactate.';GLOSS['nad+']='The oxidised electron carrier that glycolysis needs to keep running.';
  TT.ferment='Ask why a cell with no oxygen still needs the fermentation step even though it makes no extra ATP.';
})();
(function(){
  PROBS.push({id:'fe-glu',topic:'ferment',title:'Glucose needed',gen(){const need=pick([30,60,90,120]),mode=pick(['fermentation (2 ATP per glucose)','aerobic respiration (30 ATP per glucose)']),per=mode[0]==='f'?2:30,ans=need/per;return {q:`A cell needs ${need} ATP. How many glucose molecules must it break down by ${mode}?`,ans,unit:'glucose',abs:.01,chk:need/per,hint:'ATP needed divided by ATP per glucose.',sol:`${need} / ${per} = <b>${fmt(ans,2)}</b>.`};}});
  const q=[['The main purpose of fermentation is to','regenerate NAD⁺ so glycolysis can continue',['make a large amount of ATP','produce oxygen','break down ATP']],['Yeast fermentation produces','ethanol and CO₂',['lactate','CO₂ and water','pyruvate only']],['Human muscle cells in hard exercise with too little oxygen produce','lactate',['ethanol','CO₂ and water','glucose']],['Compared with aerobic respiration, fermentation yields','much less ATP per glucose',['more ATP per glucose','the same ATP per glucose','no ATP']]];
  PROBS.push({id:'fe-fact',topic:'ferment',title:'Fermentation facts',gen(){const p=pick(q),m=mcq(p[1],p[2]);return {q:p[0],choices:m.choices,ans:m.ans,hint:'Recall that glycolysis is the only ATP source.',sol:`<b>${p[1]}</b>.`};}});
  PROBS.push({id:'fe-ratio',topic:'ferment',title:'How much less efficient?',gen(){const ans=15;return {q:'About how many times more glucose must a cell use to make the same ATP by fermentation (2 ATP per glucose) than by aerobic respiration (about 30 ATP per glucose)?',ans,unit:'times',tol:0,chk:30/2,hint:'Divide the two yields.',sol:`30 / 2 = <b>15</b>.`};}});
})();
