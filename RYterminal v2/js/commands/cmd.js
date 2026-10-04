(function(){
const E=RY.CmdErr,C=(n,f)=>RY.def('cmd',n,f),U=RY.util;
const sw=a=>{const f=new Set(),r=[];a.forEach(x=>/^\/[a-zA-Z]$/.test(x)?f.add(x[1].toLowerCase()):r.push(x));return{f,r};};
const NP='The system cannot find the path specified.',NF='The system cannot find the file specified.';
const ci=(x,y)=>x.toLowerCase()<y.toLowerCase()?-1:1;
C('cls',(sh,a,i,t)=>t.clear());C('whoami',()=>'user-pc\\user');C('hostname',()=>'USER-PC');
C('ver',()=>'\nMicrosoft Windows [Version 10.0.19045.3693]');
C('echo',(sh,a)=>a.length?a.join(' '):'ECHO is on.');
C('ipconfig',()=>'\nWindows IP Configuration\n\nEthernet adapter Ethernet:\n\n   Connection-specific DNS Suffix  . : lan\n   IPv4 Address. . . . . . . . . . . : 192.168.1.42\n   Subnet Mask . . . . . . . . . . . : 255.255.255.0\n   Default Gateway . . . . . . . . . : 192.168.1.1');
C('dir',(sh,a)=>{const{f,r}=sw(a),p=sh.res(r[0]||'.'),n=sh.fs.get(p);if(!n)throw new E('File Not Found');
 const dir=n.t==='d',items=dir?Object.keys(n.c).sort(ci).map(k=>[k,n.c[k]]):[[p.split('/').pop(),n]];
 if(f.has('b'))return items.map(i=>i[0]).join('\n');
 const nf=items.filter(i=>i[1].t==='f'),nd=items.length-nf.length;
 const rows=(dir?[['.',n],['..',n]]:[]).concat(items).map(([k,v])=>`${U.stamp()}    ${v.t==='d'?'<DIR>         ':String(v.x.length).padStart(14)} ${k}`);
 return [' Volume in drive C has no label.',' Volume Serial Number is 4A2F-9C1D','',` Directory of ${sh.show(dir?p:p.split('/').slice(0,-1).join('/'))}`,'',...rows,
  `${String(nf.length).padStart(16)} File(s) ${String(nf.reduce((s,i)=>s+i[1].x.length,0)).padStart(14)} bytes`,`${String(nd+(dir?2:0)).padStart(16)} Dir(s)  ${'104,857,600,000'.padStart(18)} bytes free`].join('\n');});
C(['cd','chdir'],(sh,a)=>{const t=sw(a).r.join(' ');if(!t)return sh.show(sh.cwd);const n=sh.fs.get(sh.res(t));if(!n||n.t!=='d')throw new E(NP);sh.cwd=sh.res(t);});
C(['mkdir','md'],(sh,a)=>{const fs=sh.fs;if(!a.length)throw new E('The syntax of the command is incorrect.');
 a.forEach(x=>{const p=sh.res(x);if(fs.get(p))throw new E(`A subdirectory or file ${x} already exists.`);let c='';fs.parts(p).forEach(s=>{c+='/'+s;if(!fs.get(c)){if(!fs.split(c).dir)throw new E(NP);fs.mkdir(c);}});});});
C(['rmdir','rd'],(sh,a)=>{const{f,r}=sw(a);if(!r.length)throw new E('The syntax of the command is incorrect.');r.forEach(x=>{const p=sh.res(x),n=sh.fs.get(p);if(!n)throw new E(NF);if(n.t!=='d')throw new E('The directory name is invalid.');
 if(Object.keys(n.c).length&&!f.has('s'))throw new E('The directory is not empty.');sh.fs.remove(p);});});
const xfer=(mv)=>(sh,a)=>{const{r}=sw(a);if(!r.length)throw new E('The syntax of the command is incorrect.');const s=sh.res(r[0]),n=sh.fs.get(s);
 if(!n||(!mv&&n.t!=='f'))throw new E(NF);const e=sh.fs[mv?'move':'copy'](s,sh.res(r[1]||'.'));
 if(e==='dst')throw new E(NP);if(e==='same')throw new E('The file cannot be copied onto itself.\n        0 file(s) copied.');return `        1 ${mv?'file(s) moved':'file(s) copied'}.`;};
C('copy',xfer(false));C('move',xfer(true));
C(['del','erase'],(sh,a)=>{sw(a).r.forEach(x=>{const p=sh.res(x),n=sh.fs.get(p);if(!n)throw new E('Could Not Find '+sh.show(p));
 if(n.t==='f')sh.fs.remove(p);else Object.keys(n.c).forEach(k=>{if(n.c[k].t==='f')delete n.c[k];});});});
C(['ren','rename'],(sh,a)=>{if(a.length<2)throw new E('The syntax of the command is incorrect.');const s=sh.res(a[0]),n=sh.fs.get(s);if(!n)throw new E(NF);
 const e=sh.fs.move(s,s.split('/').slice(0,-1).join('/')+'/'+a[1]);if(e)throw new E('A duplicate file name exists, or the file cannot be found.');});
C('type',(sh,a)=>a.map(x=>{if(x.toLowerCase()==='nul')return '';const n=sh.fs.get(sh.res(x));if(!n)throw new E(NF);if(n.t==='d')throw new E('Access is denied.');return n.x;}).join(''));
C('findstr',(sh,a,inp)=>{const{f,r}=sw(a),pat=r.shift();if(!pat)throw new E('FINDSTR: Bad command line');let re;try{re=new RegExp(pat,f.has('i')?'i':'');}catch(e){re=/$^/;}
 const t=r.length?r.map(x=>{const n=sh.fs.get(sh.res(x));if(!n||n.t!=='f')throw new E(`FINDSTR: Cannot open ${x}`);return n.x;}).join(''):inp;return U.lines(t).filter(l=>re.test(l)).join('\n');});
C('tasklist',()=>['','Image Name                     PID Session Name','========================= ======== ================',...RY.win.procs.map(p=>`${p.n.padEnd(25)} ${String(p.p).padStart(8)} Console`)].join('\n'));
C('taskkill',(sh,a)=>{let pid,im;for(let i=0;i<a.length;i++){const k=a[i].toLowerCase();if(k==='/pid')pid=+a[++i];else if(k==='/im')im=a[++i];}
 const hasPid=a.some(x=>x.toLowerCase()==='/pid'),hasIm=a.some(x=>x.toLowerCase()==='/im');if(!hasPid&&!hasIm)throw new E('ERROR: Invalid syntax. Neither /PID nor /IM specified.');if((hasIm&&!im)||(hasPid&&!Number.isFinite(pid)))throw new E('ERROR: Invalid syntax. Check the /PID or /IM value.');
 const P=RY.win.procs,i=P.findIndex(p=>pid!==undefined?p.p===pid:p.n.toLowerCase()===im.toLowerCase());
 if(i<0)throw new E(`ERROR: The process "${pid!==undefined?pid:im}" not found.`);const p=P.splice(i,1)[0];
 return `SUCCESS: The process "${p.n}" with PID ${p.p} has been terminated.`;});
})();
