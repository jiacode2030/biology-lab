
/* ---------------- Reference drawer: equations, genetic code and tables ---------------- */
(function reference(){const fs=$('#fs'),btn=$('#fs-btn'),scrim=$('#fs-scrim'),tabs=$$('#fs-tabs button');
  $$('.body > div > *',fs).forEach((el,i)=>el.style.setProperty('--i',Math.min(i,16)));
  function tab(k){tabs.forEach(b=>b.setAttribute('aria-pressed',b.dataset.tab===k));$$('[data-pane]',fs).forEach(p=>p.hidden=p.dataset.pane!==k);store('bio-fs-tab',k);const b=$('.body',fs);if(b)b.scrollTop=0;}
  function set(o,k){if(k)tab(k);fs.classList.toggle('open',o);fs.setAttribute('aria-hidden',!o);btn.setAttribute('aria-expanded',o);$('.fs-lbl',btn).textContent=o?'Hide reference':'Reference';scrim.classList.toggle('on',o);setTimeout(()=>redraw(),280);}
  tabs.forEach(b=>b.addEventListener('click',()=>tab(b.dataset.tab)));
  btn.addEventListener('click',()=>set(!fs.classList.contains('open')));$('#fs-close').addEventListener('click',()=>set(false));scrim.addEventListener('click',()=>set(false));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&fs.classList.contains('open'))set(false);});
  /* modules can open a sheet: <button data-ref="eq"> */
  document.addEventListener('click',e=>{const b=e.target.closest('[data-ref]');if(b){e.preventDefault();set(true,b.dataset.ref);}});
  const saved=store('bio-fs-tab');tab(saved&&['eq','gc','tb'].includes(saved)?saved:'eq');
})();
