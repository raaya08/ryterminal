/* Motor: shells, tokenizador, pipes/redirecciones y ejecución. Los comandos viven en js/commands/*. */
RY.CmdErr=class extends Error{};
RY.cmds={linux:{},cmd:{},ps:{}};
/* RY.def(sistema, nombre|[nombre,aliases...], fn(sh,args,stdin,term)) -> string. Lanza RY.CmdErr para errores. */
RY.def=(sys,names,fn)=>[].concat(names).forEach(n=>{RY.cmds[sys][sys==='linux'?n:n.toLowerCase()]=fn;});
(function(){
const p2=n=>String(n).padStart(2,'0');
RY.util={p2,lines:s=>s.split('\n').filter((x,i,a)=>!(i===a.length-1&&x==='')),
 stamp(){const d=new Date();let h=d.getHours();const ap=h>=12?'PM':'AM';h=h%12||12;return `${p2(d.getMonth()+1)}/${p2(d.getDate())}/${d.getFullYear()}  ${p2(h)}:${p2(d.getMinutes())} ${ap}`;}};
const lfs=new RY.VFS(RY.seeds.linux,false),wfs=new RY.VFS(RY.seeds.windows,true);
RY.win={procs:[],reset(){wfs.reset();this.procs=[['System',4],['explorer.exe',1204],['svchost.exe',880],['chrome.exe',3320],['notepad.exe',5120]].map(([n,p])=>({n,p}));}};RY.win.reset();
const winShow=p=>{const s=p.slice(1).replace(/\//g,'\\');return /^[A-Za-z]:$/.test(s)?s+'\\':s;};
function winRes(a){a=a.replace(/\\/g,'/');if(a==='~')return this.home;if(/^[A-Za-z]:/.test(a))a='/'+a[0].toUpperCase()+a.slice(1);return this.fs.norm(a,this.cwd);}
const win={os:'win',fs:wfs,home:'/C:/Users/User',show:winShow,res:winRes};
RY.shells={
 linux:{id:'linux',os:'linux',label:'Linux',fs:lfs,home:'/home/user',show:p=>p,
  res(a){return this.fs.norm(a.replace(/^~/,this.home),this.cwd);},
  prompt(){const h=this.home,c=this.cwd;return `user@ryterminal:${c===h?'~':c.startsWith(h+'/')?'~'+c.slice(h.length):c}$ `;},
  notFound:n=>`bash: ${n}: command not found`},
 cmd:{...win,id:'cmd',label:'CMD',prompt(){return this.show(this.cwd)+'> ';},
  notFound:n=>`'${n}' is not recognized as an internal or external command,\noperable program or batch file.`},
 ps:{...win,id:'ps',label:'PowerShell',prompt(){return 'PS '+this.show(this.cwd)+'> ';},
  notFound:n=>`${n} : The term '${n}' is not recognized as the name of a cmdlet, function, script file, or operable program.`}
};
Object.values(RY.shells).forEach(s=>s.cwd=s.home);
RY.resetOS=os=>{(os==='linux'?lfs:RY.win).reset();Object.values(RY.shells).forEach(s=>{if(s.os===os)s.cwd=s.home;});};
/* Tokenizador: comillas, | > >> (CMD no trata la comilla simple como comilla) */
RY.tokenize=(line,sq)=>{const t=[];let cur='',q=null,has=false;const push=()=>{if(has)t.push({v:cur});cur='';has=false;};
 for(let i=0;i<line.length;i++){const c=line[i];
  if(q){if(c===q)q=null;else cur+=c;continue;}
  if(c==='"'||(c==="'"&&sq)){q=c;has=true;continue;}
  if(/\s/.test(c)){push();continue;}
  if(c==='|'){push();t.push({op:'|'});continue;}
  if(c==='>'){push();if(line[i+1]==='>'){t.push({op:'>>'});i++;}else t.push({op:'>'});continue;}
  cur+=c;has=true;}
 push();return t;};
RY.exec=(sh,args,stdin,term)=>{const n=args[0],fn=RY.cmds[sh.id][sh.id==='linux'?n:n.toLowerCase()];
 if(!fn)throw new RY.CmdErr(sh.notFound(n));const r=fn(sh,args.slice(1),stdin,term);return r==null?'':String(r);};
/* Ejecuta una línea completa. Devuelve {out,err} */
RY.run=(sh,line,term)=>{
 const toks=RY.tokenize(line,sh.id!=='cmd'),st=[[]];let rd=null;
 for(let i=0;i<toks.length;i++){const t=toks[i];if(t.op==='|')st.push([]);else if(t.op){rd={app:t.op==='>>',to:toks[i+1]&&toks[i+1].v};i++;}else st[st.length-1].push(t.v);}
 let data='';const lx=sh.id==='linux';
 try{
  st.forEach((a,i)=>{sh.piping=i<st.length-1||!!rd;data=a.length?RY.exec(sh,a,data,term):'';});
  if(rd){if(!rd.to)throw new RY.CmdErr(lx?'bash: syntax error near unexpected token `newline\'':'The syntax of the command is incorrect.');
   const p=sh.res(rd.to),n=sh.fs.get(p);
   if(n&&n.t==='d')throw new RY.CmdErr(lx?`bash: ${rd.to}: Is a directory`:'Access is denied.');
   if(!n&&!sh.fs.split(p).dir)throw new RY.CmdErr(lx?`bash: ${rd.to}: No such file or directory`:'The system cannot find the path specified.');
   sh.fs.write(p,data+(data&&!data.endsWith('\n')?'\n':''),rd.app);data='';}
 }catch(e){if(e instanceof RY.CmdErr)return{out:'',err:e.message};throw e;}
 finally{sh.piping=false;if(!sh.fs.get(sh.cwd))sh.cwd=sh.home;}
 return{out:data};};
['linux','cmd','ps'].forEach(s=>RY.def(s,'help',()=>'Comandos disponibles:\n  '+Object.keys(RY.cmds[s]).sort().join('  ')));
})();
