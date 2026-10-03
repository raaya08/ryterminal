/* UI: navegación, terminal, biblioteca y retos. Toda la lógica de terminal está en terminal.js + commands/. */
(function(){
const $=s=>document.querySelector(s);
const S={sys:'linux',ch:null,diff:'',cat:'',ses:{}};
const cur=()=>RY.shells[S.sys];
const ses=id=>S.ses[id]||(S.ses[id]={hist:[],hi:0,lines:[{k:'o',t:`RYterminal · ${RY.shells[id].label} simulado. Nada se ejecuta en tu equipo.`},{k:'o',t:'Escribe help para ver los comandos disponibles.\n'}]});
const scr=id=>document.querySelectorAll('.scr').forEach(e=>e.classList.toggle('on',e.id===id));
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function chips(){$('#chips').innerHTML=Object.values(RY.shells).map(s=>`<button class="${s.id===S.sys?'on':''}" data-s="${s.id}">${s.label}</button>`).join('');}
function view(v){$('#app').dataset.view=v;document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.v===v));
 if(v==='library'){$('#lsys').value=S.sys;lib();}if(v==='challenges')chal();draw();if(v==='tools')tool(RYTools.toolState.active);else if(v==='terminal')$('#inp').focus();}
function tool(name){if(!RYTools.views[name])return;RYTools.toolState.active=name;document.querySelectorAll('#toolnav button').forEach(b=>b.classList.toggle('on',b.dataset.tool===name));RYTools.views[name]($('#toolhost'));}
const viewNow=()=>$('#app').dataset.view;
function enter(id){S.sys=id;S.ch=null;scr('app');chips();view('terminal');}
function openCatalog(id){const item=RYTools.catalog.find(x=>x.id===id);if(item)RYTools.recordActivity?.(id,item.name+' abierta');if(id==='terminal'){scr('choose');return;}if(id==='library'||id==='challenges'){enter('linux');view(id);return;}if(RYTools.views[id]){RYTools.toolState.active=id;enter('linux');view('tools');}}
RYTools.openCatalog=openCatalog;RYTools.openToolbox=()=>scr('landing');
function draw(){const s=ses(S.sys),out=$('#out');out.textContent='';
 s.lines.forEach(l=>{const d=document.createElement('div');d.className='ln '+l.k;if(l.k==='p'){const p=document.createElement('span');p.className='pr';p.textContent=l.pr;d.append(p,l.t);}else d.textContent=l.t;out.append(d);});
 $('#pr').textContent=cur().prompt();$('#wtitle').textContent=cur().label+' · RYterminal';const sc=$('#sc');sc.scrollTop=sc.scrollHeight;}
function submit(line){const h=cur(),s=ses(h.id);s.lines.push({k:'p',pr:h.prompt(),t:line});
 if(line.trim()){s.hist.push(line);const r=RY.run(h,line,{hist:s.hist,clear(){s.lines=[];}});
  if(r.err)s.lines.push({k:'e',t:r.err});else if(r.out)s.lines.push({k:'o',t:r.out.replace(/\n+$/,'')});}
 s.hi=s.hist.length;draw();const c=S.ch;
 if(c&&!c.done&&RY.checkChallenge(h,c.c)){c.done=true;chal();}}
function complete(inp){const h=cur(),v=inp.value,m=/(\S*)$/.exec(v)[1],i=Math.max(m.lastIndexOf('/'),m.lastIndexOf('\\')),dir=m.slice(0,i+1),part=m.slice(i+1);
 const n=h.fs.get(h.res(dir||'.'));if(!n||n.t!=='d')return;const ms=Object.keys(n.c).filter(k=>k.toLowerCase().startsWith(part.toLowerCase()));
 if(ms.length===1)inp.value=v.slice(0,v.length-m.length)+dir+ms[0]+(n.c[ms[0]].t==='d'?(h.os==='win'?'\\':'/'):'');}
/* ---------- Retos ---------- */
function startChal(diff){const pool=RY.challenges.filter(c=>c.sys===S.sys&&(!diff||c.lvl===diff)&&!(S.ch&&c.id===S.ch.c.id));
 const c=pool[Math.floor(Math.random()*pool.length)],h=cur();RY.resetOS(h.os);Object.keys(S.ses).forEach(k=>{if(RY.shells[k].os===h.os)delete S.ses[k];});
 RY.applySetup(h,c);S.ch={c,hint:false,done:false};chal();draw();$('#inp').focus();}
function chal(){const c=S.ch,box=$('#chal');
 const sel=`<select id="cdiff"><option value="">Cualquier dificultad</option>${Object.entries(RY.levels).map(([k,v])=>`<option value="${k}" ${k===S.diff?'selected':''}>${v}</option>`).join('')}</select>`;
 box.innerHTML=`<div class="crow">${sel}<button id="cnew" class="pri">🎲 Reto aleatorio</button></div>`+(!c?`<p class="mut">Elige dificultad y pulsa «Reto aleatorio». Practicarás en ${cur().label}; se valida el estado final del filesystem.</p>`
  :c.done?`<div class="ok"><h3>✓ RETO COMPLETADO</h3><p>Has conseguido el objetivo.</p><div class="crow"><button id="cnext" class="pri">Siguiente reto</button><button id="cany">Otro reto aleatorio</button></div></div>`
  :`<div class="card"><small>${RY.levels[c.c.lvl]} · ${cur().label}</small><h3>${esc(c.c.title)}</h3><p><b>OBJETIVO</b><br>${esc(c.c.obj).replace(/\n/g,'<br>')}</p><button id="chint">💡 Mostrar pista</button><p class="hint" ${c.hint?'':'hidden'}>💡 Pista: ${esc(c.c.hint)}</p></div>`);}
/* ---------- Biblioteca ---------- */
function lib(){const q=$('#q').value.toLowerCase(),sy=$('#lsys').value,all=RY.library.filter(e=>!sy||e.sys===sy);
 const cats=[...new Set(all.map(e=>e.cat))];if(!cats.includes(S.cat))S.cat='';
 $('#lcats').innerHTML=['',...cats].map(c=>`<button class="${c===S.cat?'on':''}" data-c="${c}">${c||'Todas'}</button>`).join('');
 const rows=all.filter(e=>(!S.cat||e.cat===S.cat)&&(e.name+' '+e.desc).toLowerCase().includes(q));
 $('#llist').innerHTML=rows.map(e=>{const ok=!!RY.cmds[e.sys][e.sys==='linux'?e.name:e.name.toLowerCase()],i=RY.library.indexOf(e);
  return `<details><summary><b>${esc(e.name)}</b> — ${esc(e.desc)}<span class="badge">${RY.shells[e.sys].label}</span><span class="badge">${e.cat}</span></summary>
  <p>Sintaxis: <code>${esc(e.syn)}</code></p><p>Ejemplo: <code>${esc(e.ex)}</code></p>${e.opts.length?'<p>Opciones: '+e.opts.map(([a,b])=>`<code>${esc(a)}</code> ${esc(b||'')}`).join(' · ')+'</p>':''}
  <p>Compatible: ${RY.shells[e.sys].label}</p>${ok?`<button class="pri" data-try="${i}">▶ Probar comando</button>`:'<span class="badge">Solo referencia (aún no simulado)</span>'}</details>`;}).join('')||'<p class="mut">Sin resultados.</p>';}
/* ---------- Eventos ---------- */
RYTools.renderCommandCenter($('#command-center'));RYTools.renderToolNav($('#toolnav'));
$('#home').onclick=()=>scr('landing');$('#toolbox-back').onclick=()=>scr('landing');
document.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{if(b.dataset.pick==='win')$('#wsub').hidden=false;else{enter(b.dataset.pick);RYTools.recordActivity?.('terminal','Terminal iniciada');}});
$('#chips').onclick=e=>{const s=e.target.dataset.s;if(s){S.sys=s;S.ch=null;chips();view(viewNow());}};
$('#tabs').onclick=e=>{if(e.target.dataset.v)view(e.target.dataset.v);};
$('#toolnav').onclick=e=>{const name=e.target.closest('[data-tool]')?.dataset.tool;if(name)tool(name);};
$('#reset').onclick=()=>{const h=cur(),c=S.ch;RY.resetOS(h.os);Object.keys(S.ses).forEach(k=>{if(RY.shells[k].os===h.os)delete S.ses[k];});if(c&&!c.done)RY.applySetup(h,c.c);else if(c)S.ch=null;if(viewNow()==='challenges')chal();draw();$('#inp').focus();};
$('#shot').onclick=()=>RY.screenshot(ses(S.sys).lines.concat([{k:'p',pr:cur().prompt(),t:''}]),cur().label);
$('#win').onclick=()=>{if(!getSelection().toString())$('#inp').focus();};
$('#inp').onkeydown=e=>{const i=e.target,s=ses(S.sys);
 if(e.key==='Enter'){const v=i.value;i.value='';submit(v);}
 else if(e.key==='ArrowUp'){e.preventDefault();if(s.hi>0)i.value=s.hist[--s.hi];}
 else if(e.key==='ArrowDown'){e.preventDefault();s.hi=Math.min(s.hi+1,s.hist.length);i.value=s.hist[s.hi]||'';}
 else if(e.key==='Tab'){e.preventDefault();complete(i);}
 else if(e.key==='l'&&e.ctrlKey){e.preventDefault();s.lines=[];draw();}};
$('#chal').onclick=e=>{const id=e.target.id;
 if(id==='cnew')startChal(S.diff);else if(id==='cany'){S.diff='';startChal('');}else if(id==='cnext')startChal(S.diff);
 else if(id==='chint'){S.ch.hint=true;chal();}};
$('#chal').onchange=e=>{if(e.target.id==='cdiff')S.diff=e.target.value;};
$('#q').oninput=lib;$('#lsys').onchange=lib;
$('#lcats').onclick=e=>{if(e.target.dataset.c!==undefined){S.cat=e.target.dataset.c;lib();}};
$('#llist').onclick=e=>{const i=e.target.dataset.try;if(i===undefined)return;const en=RY.library[i];S.sys=en.sys;S.ch=null;chips();view('terminal');$('#inp').value=en.ex;$('#inp').focus();};
})();
