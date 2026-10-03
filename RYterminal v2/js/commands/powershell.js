(function(){
const E=RY.CmdErr,P=(n,f)=>RY.def('ps',n,f),U=RY.util,SW=new Set(['recurse','force']);
const parse=a=>{const named={},pos=[];for(let i=0;i<a.length;i++){const m=/^-([A-Za-z]+)$/.exec(a[i]);if(m){const k=m[1].toLowerCase();named[k]=SW.has(k)?true:a[++i];}else pos.push(a[i]);}return{named,pos};};
const miss=(c,sh,p)=>new E(`${c} : Cannot find path '${sh.show(p)}' because it does not exist.`);
const get=(sh,c,x)=>{const p=sh.res(x),n=sh.fs.get(p);if(!n)throw miss(c,sh,p);return[p,n];};
const ci=(x,y)=>x.toLowerCase()<y.toLowerCase()?-1:1,par=p=>p.split('/').slice(0,-1).join('/')||'/';
const table=(shown,items)=>{const t=new Date(),dt=`${U.p2(t.getMonth()+1)}/${U.p2(t.getDate())}/${t.getFullYear()}   ${U.p2(t.getHours())}:${U.p2(t.getMinutes())}`;
 return ['','    Directory: '+shown,'','Mode                 LastWriteTime         Length Name','----                 -------------         ------ ----',
  ...items.map(([k,v])=>`${v.t==='d'?'d-----':'-a----'}        ${dt} ${(v.t==='d'?'':String(v.x.length)).padStart(10)} ${k}`),''].join('\n');};
P(['get-childitem','ls','dir','gci'],(sh,a)=>{const{named,pos}=parse(a),[p,n]=get(sh,'Get-ChildItem',named.path||pos[0]||'.');
 const it=n.t==='f'?[[p.split('/').pop(),n]]:Object.keys(n.c).sort(ci).map(k=>[k,n.c[k]]);return it.length?table(sh.show(n.t==='d'?p:par(p)),it):'';});
P(['set-location','cd','sl','chdir'],(sh,a)=>{const{named,pos}=parse(a),[p,n]=get(sh,'Set-Location',named.path||pos[0]||'~');if(n.t!=='d')throw miss('Set-Location',sh,p);sh.cwd=p;});
P(['get-location','pwd','gl'],sh=>`\nPath\n----\n${sh.show(sh.cwd)}\n`);
P(['clear-host','cls','clear'],(sh,a,i,t)=>t.clear());
P(['write-output','echo','write-host','write'],(sh,a)=>a.join(' '));
P('get-date',()=>new Date().toString());
P('get-computerinfo',()=>'WindowsProductName : Windows 10 Pro\nWindowsVersion     : 22H2\nOsArchitecture     : 64-bit\nCsName             : USER-PC\nCsUserName         : User\nCsProcessors       : {Intel(R) Core(TM) i7}');
const newItem=(cmd,force)=>(sh,a)=>{const{named,pos}=parse(a),base=named.path||pos[0];if(!base&&!named.name)throw new E(`${cmd} : Missing an argument for parameter 'Path'.`);
 const full=named.name?(base||'.')+'/'+named.name:base,p=sh.res(full),type=(force||named.itemtype||'file').toLowerCase(),fs=sh.fs;
 if(fs.get(p))throw new E(`${cmd} : An item with the specified name ${sh.show(p)} already exists.`);
 if(type.startsWith('d')){let c='';fs.parts(p).forEach(s=>{c+='/'+s;if(!fs.get(c)){if(!fs.split(c).dir)throw new E(`${cmd} : Could not find a part of the path '${sh.show(c)}'.`);fs.mkdir(c);}});}
 else{if(!fs.split(p).dir)throw new E(`${cmd} : Could not find a part of the path '${sh.show(p)}'.`);fs.write(p,named.value?named.value+'\n':'');}
 return table(sh.show(par(p)),[[p.split('/').pop(),fs.get(p)]]);};
P(['new-item','ni'],newItem('New-Item'));P(['mkdir','md'],newItem('mkdir','directory'));
P(['remove-item','rm','del','ri','rmdir','rd','erase'],(sh,a)=>{const{named,pos}=parse(a);if(!pos.length&&!named.path)throw new E("Remove-Item : Cannot bind argument to parameter 'Path' because it is null.");
 [named.path||pos[0],...pos.slice(1)].forEach(x=>{const[p,n]=get(sh,'Remove-Item',x);
  if(n.t==='d'&&Object.keys(n.c).length&&!named.recurse)throw new E(`Remove-Item : The item at ${sh.show(p)} has children and the Recurse parameter was not specified.`);sh.fs.remove(p);});});
const xfer=(cmd,mv)=>(sh,a)=>{const{named,pos}=parse(a),[s]=get(sh,cmd,named.path||pos[0]||''),dst=named.destination||pos[named.path?0:1];
 if(!dst)throw new E(`${cmd} : Missing an argument for parameter 'Destination'.`);const e=sh.fs[mv?'move':'copy'](s,sh.res(dst));
 if(e==='dst')throw new E(`${cmd} : Could not find a part of the path '${sh.show(sh.res(dst))}'.`);if(e==='same')throw new E(`${cmd} : Cannot overwrite the item with itself.`);};
P(['copy-item','cp','copy','cpi'],xfer('Copy-Item',false));P(['move-item','mv','move','mi'],xfer('Move-Item',true));
P(['get-content','cat','type','gc'],(sh,a)=>{const{named,pos}=parse(a),[p,n]=get(sh,'Get-Content',named.path||pos[0]||'');
 if(n.t==='d')throw new E(`Get-Content : Access to the path '${sh.show(p)}' is denied.`);return n.x;});
const writer=(cmd,app)=>(sh,a)=>{const{named,pos}=parse(a),x=named.path||pos[0];if(!x)throw new E(`${cmd} : Missing an argument for parameter 'Path'.`);
 const p=sh.res(x),v=named.value!==undefined?named.value:pos[named.path?0:1];if(v===undefined)throw new E(`${cmd} : Missing an argument for parameter 'Value'.`);
 const n=sh.fs.get(p);if(n&&n.t==='d')throw new E(`${cmd} : Access to the path '${sh.show(p)}' is denied.`);
 if(!n&&!sh.fs.split(p).dir)throw new E(`${cmd} : Could not find a part of the path '${sh.show(p)}'.`);sh.fs.write(p,v+'\n',app);};
P(['set-content','sc'],writer('Set-Content',false));P(['add-content','ac'],writer('Add-Content',true));
P(['get-process','ps','gps'],(sh,a)=>{const{named,pos}=parse(a),q=(named.name||pos[0]||'').toLowerCase().replace('.exe','');
 const l=RY.win.procs.filter(p=>!q||p.n.toLowerCase().replace('.exe','')===q);if(q&&!l.length)throw new E(`Get-Process : Cannot find a process with the name "${q}". Verify the process name and call the cmdlet again.`);
 return ['','Handles     CPU(s)      Id ProcessName','-------     ------      -- -----------',...l.map(p=>`${String(200+p.p%300).padStart(7)} ${(p.p%97/3).toFixed(2).padStart(10)} ${String(p.p).padStart(7)} ${p.n.replace('.exe','')}`),''].join('\n');});
P(['stop-process','kill','spps'],(sh,a)=>{const{named,pos}=parse(a),t=named.name||named.id||pos[0],P2=RY.win.procs;if(!t)throw new E('Stop-Process : Cannot bind argument: provide -Name or -Id.');
 const byId=/^\d+$/.test(t),i=P2.findIndex(p=>byId?p.p===+t:p.n.toLowerCase().replace('.exe','')===t.toLowerCase().replace('.exe',''));
 if(i<0)throw new E(byId?`Stop-Process : Cannot find a process with the process identifier ${t}.`:`Stop-Process : Cannot find a process with the name "${t}". Verify the process name and call the cmdlet again.`);P2.splice(i,1);});
P(['select-string','sls'],(sh,a,inp)=>{const{named,pos}=parse(a),pat=named.pattern||pos[0],path=named.path||pos[1];if(!pat)throw new E("Select-String : Cannot bind argument to parameter 'Pattern'.");
 let re;try{re=new RegExp(pat,'i');}catch(e){re=/$^/;}const n=path?get(sh,'Select-String',path)[1]:{x:inp};
 return U.lines(n.x||'').map((l,i)=>[l,i+1]).filter(([l])=>re.test(l)).map(([l,i])=>path?`${path}:${i}:${l}`:l).join('\n');});
})();
