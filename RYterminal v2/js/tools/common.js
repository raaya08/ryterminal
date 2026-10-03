/* Helpers compartidos para las herramientas locales de RYterminal. */
window.RYTools=window.RYTools||{};
RYTools.escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
RYTools.download=(name,text,type='text/plain')=>{const a=document.createElement('a'),u=URL.createObjectURL(new Blob([text],{type}));a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);};
RYTools.copy=async(text,btn)=>{try{await navigator.clipboard.writeText(text);}catch{const t=document.createElement('textarea');t.value=text;document.body.append(t);t.select();document.execCommand('copy');t.remove();}if(btn){const old=btn.textContent;btn.textContent='✓ Copiado';setTimeout(()=>btn.textContent=old,1200);}};
RYTools.readFile=(accept,cb)=>{const i=document.createElement('input');i.type='file';i.accept=accept;i.onchange=()=>{const f=i.files[0];if(f){const r=new FileReader();r.onload=()=>cb(String(r.result),f.name);r.readAsText(f);}};i.click();};
RYTools.toolState={active:'numbers',html:{tab:'html',html:'<h1>Hello World</h1>\n<p>Edita el HTML, CSS y JavaScript.</p>',css:'h1 { color: #4f8cff; }',js:'console.log("Hola desde RYterminal");'},xml:'<?xml version="1.0" encoding="UTF-8"?>\n<usuarios>\n  <usuario id="1">\n    <nombre>Ana</nombre>\n  </usuario>\n</usuarios>',json:'{\n  "usuario": {\n    "nombre": "Alejandro",\n    "edad": 17,\n    "activo": true\n  }\n}'};
RYTools.setStatus=(el,text,kind='info')=>{el.className='tool-status '+kind;el.textContent=text;};
RYTools.activityKey='ryterminal.activity.v1';
RYTools.getActivity=()=>{try{const rows=JSON.parse(localStorage.getItem(RYTools.activityKey)||'[]');return Array.isArray(rows)?rows.filter(x=>x&&typeof x.text==='string').slice(0,8):[];}catch{return[];}};
RYTools.recordActivity=(toolId,text)=>{const row={toolId:String(toolId||''),text:String(text||'Actividad registrada').slice(0,100),at:Date.now()};try{localStorage.setItem(RYTools.activityKey,JSON.stringify([row,...RYTools.getActivity()].slice(0,8)));}catch{}window.dispatchEvent(new CustomEvent('ryterminal:activity',{detail:row}));};
