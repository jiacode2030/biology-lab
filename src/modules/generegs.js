/* ---------------- Regulation of gene expression ---------------- */
(function generegs(){
  const cv=$('#gr-canvas');if(!cv)return;
  let lac='no',glu=true;
  function operon(ctx,w,h,t,o){const y=h*.42,x0=24,seg=[['promoter',.12,T.muted],['operator',.12,T.ce],['lacZ',.2,T.cv],['lacY',.2,T.cv],['lacA',.2,T.cv]],tot=w-48,xs=[],F='10px '+MONO.split(' ').slice(1).join(' ');let x=x0;
    ctx.fillStyle=alpha(T.ink,.35);ctx.fillRect(x0,y-3,tot,6);seg.forEach(([nm,f,c])=>{const wd=tot*f;xs.push([x,wd]);ctx.fillStyle=alpha(c,.55);ctx.fillRect(x,y-12,wd-2,24);ctx.strokeStyle=c;ctx.lineWidth=2;ctx.strokeRect(x,y-12,wd-2,24);label(ctx,nm,x+wd/2-1,y-22,T.muted,'center','middle',F);x+=wd;});
    const pm=xs[0],op=xs[1],ox=op[0]+op[1]/2;
    const blob=(cx,cy,txt,col,dash)=>{const rx=txt.length*3.3+8;ctx.fillStyle=alpha(col,dash?.3:.65);ctx.strokeStyle=col;ctx.lineWidth=2;if(dash)ctx.setLineDash([3,3]);ctx.beginPath();ctx.ellipse(cx,cy,rx,13,0,0,6.283);ctx.fill();ctx.stroke();ctx.setLineDash([]);label(ctx,txt,cx,cy,T.ink,'center','middle',F);};
    if(o.bound)blob(ox,y-48,'repressor',T.ca,false);else if(o.repLabel)blob(ox,y-62+Math.sin(t*2)*3,o.repLabel,T.ca,true);
    const run=o.level>0,px=run?pm[0]+pm[1]/2+((t*(25+o.level*35))%(tot*.62)):pm[0]+pm[1]/2;
    blob(px,y+30,'RNA pol',T.accent,false);if(!run){ctx.strokeStyle=T.bad;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(px+30,y+22);ctx.lineTo(px+44,y+38);ctx.moveTo(px+44,y+22);ctx.lineTo(px+30,y+38);ctx.stroke();}
    if(o.cap)blob(pm[0]+38,y+68,'CAP–cAMP',T.accent,false);
    if(run){for(let k=0;k<o.level*2;k++){const sx=xs[2][0]+4,ey=y+62+k*12;ctx.strokeStyle=T.cv;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(sx,y+14);ctx.bezierCurveTo(sx+10,ey,sx+30,ey,xs[2][0]+tot*(.2+.1*k+.1),ey);ctx.stroke();}label(ctx,'mRNA made: '+(o.level>1?'lots':'a little'),w-26,h-14,T.cv,'right','middle',MONO);}
    else label(ctx,'no transcription',w-26,h-14,T.bad,'right','middle',MONO);}
  const sim=sim2d(cv,{h:w=>clamp(w*.46,240,300),draw(ctx,w,h,t){const lev=lac==='no'?0:glu?1:2;operon(ctx,w,h,t,{bound:lac==='no',repLabel:lac==='yes'?'repressor + lactose':'',cap:!glu&&lac==='yes',level:lev});}});
  function upd(){setText('gr-rep',lac==='no'?'bound to the operator: blocks RNA polymerase':'released (lactose derivative bound to it)');setText('gr-cap',glu?'inactive: glucose present, cAMP low':'active: glucose absent, cAMP high');setText('gr-out',lac==='no'?'none':glu?'low':'high');sim.render();}
  segBind('gr-lac','k',v=>{lac=v;upd();});$('#gr-glu').addEventListener('click',()=>{glu=!glu;$('#gr-glu').setAttribute('aria-pressed',String(glu));$('#gr-glu').textContent='Glucose: '+(glu?'present':'absent');upd();});
  $('#gr-lab').addEventListener('labreset',()=>{lac='no';glu=true;segSet('gr-lac',0);$('#gr-glu').textContent='Glucose: present';$('#gr-glu').setAttribute('aria-pressed','true');upd();});upd();
  let trp='lo';
  const sim2=sim2d($('#gr-canvas2'),{h:w=>clamp(w*.4,220,280),draw(ctx,w,h,t){const hi=trp==='hi';
    operon(ctx,w,h,t,{bound:hi,repLabel:hi?'':'inactive repressor',level:hi?0:2});
    if(hi){ctx.fillStyle=T.ce;dot2(ctx,w*.1,h*.2,T.ce,7);label(ctx,'tryptophan binds the repressor and activates it',w*.14,h*.2,T.muted,'left','middle',MONO);}}});
  function upd2(){setText('gr-trep',trp==='hi'?'active (tryptophan bound): blocks the operator':'inactive: cannot bind the operator');setText('gr-tout',trp==='hi'?'off: enough tryptophan already':'on: the cell makes tryptophan');sim2.render();}
  segBind('gr-trp','k',v=>{trp=v;upd2();});$('#gr-lab2').addEventListener('labreset',()=>{trp='lo';segSet('gr-trp',0);upd2();});upd2();
  drawers.generegs=()=>{sim.render();sim2.render();};
  KEYS['gr-canvas']=['Pink: repressor. Orange: RNA polymerase and CAP–cAMP. Green: mRNA. The lac genes (lacZ, lacY, lacA) are the structural genes.',[['ca','repressor'],['accent','RNA polymerase / CAP'],['cv','lac genes and mRNA']]];
  KEYS['gr-canvas2']=['The same operon layout. Tryptophan activates the repressor.',[['ca','repressor'],['cv','trp genes']]];
  TIPS['gr-lac']=()=>'Lactose acts as an inducer: it releases the repressor so transcription can happen.';
  GLOSS['operon']='A group of genes under the control of one promoter and operator (bacteria).';GLOSS['operator']='The DNA segment where a repressor binds to block transcription.';GLOSS['repressor']='A protein that binds the operator and blocks transcription.';GLOSS['inducer']='A molecule (such as a lactose derivative) that inactivates a repressor so genes turn on.';GLOSS['transcription factor']='A protein that helps or blocks RNA polymerase at a gene.';GLOSS['epigenetics']='Heritable changes in gene expression that do not change the DNA sequence, such as DNA methylation.';GLOSS['enhancer']='A DNA sequence bound by activators that increases transcription of a gene.';
  TT.generegs='Ask students to predict expression for each combination of lactose and glucose before using the controls.';
})();
(function(){
  const sc=[['Lactose is absent and glucose is present. Transcription of the lac genes is','off (the repressor blocks the operator)',['high','low but not zero','high because glucose activates CAP']],['Lactose is present and glucose is present. Transcription of the lac genes is','low (repressor released but CAP not active)',['off','high','blocked by the repressor']],['Lactose is present and glucose is absent. Transcription of the lac genes is','high',['off','low','low because cAMP is high']],['A mutation prevents the lac repressor from binding the operator. Lac genes would be','expressed all the time',['never expressed','expressed only with lactose','expressed only with glucose']],['In the trp operon, high tryptophan causes','the repressor to become active and block transcription',['the repressor to leave the operator','more trp mRNA','RNA polymerase to speed up']]];
  PROBS.push({id:'gr-lac',topic:'generegs',title:'Predict expression',gen(){const p=pick(sc),m=mcq(p[1],p[2]);return {q:p[0]+'.',choices:m.choices,ans:m.ans,hint:'Consider the repressor first, then the activator.',sol:`<b>${p[1]}</b>.`};}});
  const q=[['Histone acetylation generally','loosens chromatin and increases gene expression',['tightens chromatin and silences genes','removes introns','adds a poly-A tail']],['DNA methylation typically','silences gene expression',['activates all nearby genes','copies the gene','removes the operator']],['Different cell types in one organism have the same DNA but different proteins because of','differential gene expression',['different genes in each cell','mutations in each cell','different numbers of chromosomes']],['MicroRNAs regulate genes by','binding mRNA and blocking translation or causing its breakdown',['adding methyl groups to DNA','making new ribosomes','copying DNA']]];
  PROBS.push({id:'gr-fact',topic:'generegs',title:'Gene regulation facts',gen(){const p=pick(q),m=mcq(p[1],p[2]);return {q:p[0]+'?',choices:m.choices,ans:m.ans,hint:'Think about how the signal changes the regulator.',sol:`<b>${p[1]}</b>.`};}});
})();
