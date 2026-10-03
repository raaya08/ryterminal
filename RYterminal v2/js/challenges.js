/* Validador de retos: comprueba el ESTADO FINAL del filesystem virtual, no los comandos escritos. */
RY.checkChallenge=(sh,c)=>{const j=r=>sh.home+'/'+r,k=c.check,fs=sh.fs;
 return (k.dirs||[]).every(r=>{const n=fs.get(j(r));return n&&n.t==='d';})
  &&Object.entries(k.files||{}).every(([r,v])=>{const n=fs.get(j(r));return n&&n.t==='f'&&(v===true||n.x.trim()===v);})
  &&(k.gone||[]).every(r=>!fs.get(j(r)));};
RY.applySetup=(sh,c)=>{const j=r=>sh.home+'/'+r;(c.setup.dirs||[]).forEach(r=>sh.fs.mkdir(j(r)));Object.entries(c.setup.files||{}).forEach(([r,v])=>sh.fs.write(j(r),v));};
