/* ---------------- Feedback & homeostasis ---------------- */
(function feedback(){
  const cv=$('#fb-canvas');if(!cv)return;
  let kind='none',amb=15,Tv=36.5;const hist=[];const SET=37;
  function restart(){Tv=36.5;hist.length=0;}
  const sim=sim2d(cv,{h:w=>clamp(w*.46,230,300),
    step(dt){const sub=8;for(let k=0;k<4;k++){const d=dt/4*sub;let u=0;if(kind==='neg')u=clamp(.5*(SET-Tv),-4,4);else if(kind==='pos')u=.1*(Tv-SET);Tv=clamp(Tv+(-.04*(Tv-amb)+u)*d,-5,70);}
      hist.push(Tv);if(hist.length>240)hist.shift();upd(true);},
    draw(ctx,w,h){const A=axes2(ctx,w,h,{x0:0,x1:240,y0:0,y1:60,yt:10,yl:'value',xl:'time →'});ctx.setLineDash([6,4]);ctx.strokeStyle=T.good;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(A.L,A.Y(SET));ctx.lineTo(A.R,A.Y(SET));ctx.stroke();ctx.setLineDash([]);label(ctx,'set point 37',A.R-4,A.Y(SET)-9,T.good,'right','middle',MONO);
      ctx.strokeStyle=T.ca;ctx.lineWidth=2.6;ctx.beginPath();hist.forEach((v,i)=>{const x=A.X(240-hist.length+i),y=A.Y(clamp(v,0,60));i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();dot2(ctx,A.X(240),A.Y(clamp(Tv,0,60)),T.ca,5);}});
  function upd(skip){setText('fb-now',fmt(Tv,1));setText('fb-dev',(Tv-SET>0?'+':'')+fmt(Tv-SET,1));const d=Math.abs(Tv-SET);setText('fb-msg',kind==='neg'?(d<2.5?'held close to the set point by a correcting response':'correcting: the response opposes the change'):kind==='pos'?(d>4?'running away from the set point: each change amplifies the next':'starting to move away'):(d>3?'drifting toward the surroundings: nothing corrects it':'holding for now'));if(!skip)sim.render();}
  segBind('fb-kind','k',v=>{kind=v;restart();upd();});bindRange('fb-amb',v=>v+' °C',v=>{amb=v;upd();});$('#fb-reset').addEventListener('click',()=>{restart();upd();});
  $('#fb-lab').addEventListener('labreset',()=>{kind='none';amb=15;segSet('fb-kind',0);setCtl('fb-amb',15,v=>v+' °C');restart();upd();});upd();
  /* glucose */
  const ST=[{n:'1 · glucose rises',t:'After a meal, glucose enters the blood and blood glucose rises above the set point.'},{n:'2 · insulin released',t:'Pancreatic beta cells detect the rise and release insulin.'},{n:'3 · glucose taken up',t:'Body cells take up glucose and the liver stores it as glycogen, so blood glucose falls.'},{n:'4 · back to normal',t:'As glucose returns to normal, insulin release drops (negative feedback). If glucose falls too low, glucagon raises it again.'}];
  const g=x=>90+60*Math.exp(-Math.pow((x-.22)/(x<.22?.08:.2),2))-9*Math.exp(-Math.pow((x-.78)/.1,2));
  const pos=[.1,.22,.45,.85];
  const sc=stageLab('bg','fb-canvas2',ST,(ctx,w,h,i)=>{const A=axes2(ctx,w,h,{x0:0,x1:1,y0:60,y1:170,yt:20,yl:'blood glucose (mg/dL)',xl:'time after meal →',L:56});curve2(ctx,A,g,0,1,T.ca);
    ctx.setLineDash([5,4]);ctx.strokeStyle=T.good;ctx.beginPath();ctx.moveTo(A.L,A.Y(90));ctx.lineTo(A.R,A.Y(90));ctx.stroke();ctx.setLineDash([]);label(ctx,'set point ≈ 90',A.R-4,A.Y(90)+12,T.good,'right','middle',MONO);
    dot2(ctx,A.X(pos[i]),A.Y(g(pos[i])),T.accent,8);const lbl=['glucose ↑','insulin released','cells take up glucose','back to set point'][i];label(ctx,lbl,clamp(A.X(pos[i])+14,A.L+10,A.R-110),A.Y(g(pos[i]))-18,T.ink,'left','middle',MONO);},{h:w=>clamp(w*.4,210,270)});
  $('#fb-lab2').addEventListener('labreset',()=>sc.go(0));
  drawers.feedback=()=>{sim.render();sc.render();};
  KEYS['fb-canvas']=['Pink line: the variable over time. Green dashed line: the set point (37). Compare the three feedback types.',[['ca','the variable'],['good','set point']]];
  KEYS['fb-canvas2']=['The dot marks the stage. Pink is blood glucose; green dashed is the set point.',[['ca','blood glucose'],['good','set point']]];
  TIPS['fb-kind']=()=>'Negative: response opposes the change. Positive: response increases the change.';
  GLOSS['negative feedback']='A response that reduces the original change, returning a variable toward its set point.';GLOSS['positive feedback']='A response that amplifies the original change.';GLOSS['homeostasis']='Maintaining a relatively stable internal environment.';GLOSS['set point']='The target value a feedback system tries to maintain.';GLOSS['insulin']='A hormone from the pancreas that lowers blood glucose.';GLOSS['glucagon']='A hormone from the pancreas that raises blood glucose.';
  TT.feedback='Ask students to name sensor, control center and effector for each example.';
})();
(function(){
  const ex=[['Blood glucose rises and the pancreas releases insulin, which lowers glucose.','negative feedback'],['During childbirth, stretching of the cervix stimulates oxytocin release, which increases contractions, which stretch the cervix more.','positive feedback'],['Body temperature rises and sweating cools the body.','negative feedback'],['Ripening fruit releases ethylene, which speeds the ripening of nearby fruit.','positive feedback'],['Blood glucose falls and glucagon is released, raising glucose.','negative feedback'],['A damaged blood vessel releases clotting factors, which activate more clotting factors.','positive feedback']];
  PROBS.push({id:'fb-type',topic:'feedback',title:'Type of feedback',gen(){const p=pick(ex),m=mcq(p[1],['negative feedback','positive feedback','no feedback','an open-loop system'].filter(x=>x!==p[1]));return {q:p[0]+' This is an example of',choices:m.choices,ans:m.ans,hint:'Does the response reduce or increase the original change?',sol:`<b>${p[1]}</b>.`};}});
  const h=[['Which hormone lowers blood glucose?','insulin',['glucagon','oxytocin','ethylene']],['Which hormone raises blood glucose?','glucagon',['insulin','oxytocin','thyroxine']],['In a feedback loop, the part that carries out the corrective response is the','effector',['sensor','set point','signal only']]];
  PROBS.push({id:'fb-fact',topic:'feedback',title:'Feedback facts',gen(){const p=pick(h),m=mcq(p[1],p[2]);return {q:p[0],choices:m.choices,ans:m.ans,hint:'Recall the pancreas hormones and the loop parts.',sol:`<b>${p[1]}</b>.`};}});
})();
