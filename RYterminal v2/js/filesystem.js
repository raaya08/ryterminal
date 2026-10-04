/* Filesystem virtual en memoria. Nodos: {t:'d',c:{hijos}} | {t:'f',x:'contenido',m:'rwx...'} */
window.RY=window.RY||{};
RY.d=c=>({t:'d',c:c||{}});RY.f=x=>({t:'f',x});
RY.VFS=class{
 constructor(seed,ci){this.seed=seed;this.ci=ci;this.reset();}
 reset(){this.root=this.seed();}
 parts(p){const o=[];p.split('/').forEach(s=>{if(!s||s==='.')return;s==='..'?o.pop():o.push(s);});return o;}
 norm(p,cwd){return '/'+this.parts(p[0]==='/'?p:cwd+'/'+p).join('/');}
 key(n,s){if(n.c[s])return s;return this.ci?Object.keys(n.c).find(k=>k.toLowerCase()===s.toLowerCase()):undefined;}
 get(p){let n=this.root;for(const s of this.parts(p)){if(n.t!=='d')return null;const k=this.key(n,s);if(k===undefined)return null;n=n.c[k];}return n;}
 split(p){const a=this.parts(p),name=a.pop(),d=this.get('/'+a.join('/'));return{dir:d&&d.t==='d'?d:null,name};}
 put(p,node){const{dir,name}=this.split(p);const k=this.key(dir,name);dir.c[k===undefined?name:k]=node;}
 mkdir(p){this.put(p,RY.d());}
 write(p,x,app){const n=this.get(p);if(n&&n.t==='f')n.x=app?n.x+x:x;else this.put(p,RY.f(x));}
 remove(p){const{dir,name}=this.split(p);if(!dir)return;const k=this.key(dir,name);if(k!==undefined)delete dir.c[k];}
 clone(n){return JSON.parse(JSON.stringify(n));}
 /* Devuelve null si ok, o 'dst' | 'same' */
 copy(sp,dp){const s=this.get(sp),t=this.get(dp);if(t&&t.t==='d')dp=dp.replace(/\/$/,'')+'/'+sp.split('/').pop();else if(!this.split(dp).dir)return 'dst';
  if(dp===sp||(this.ci&&dp.toLowerCase()===sp.toLowerCase()))return 'same';this.put(dp,this.clone(s));return null;}
 move(sp,dp){const e=this.copy(sp,dp);if(!e)this.remove(sp);return e;}
};
RY.seeds={
 linux:()=>RY.d({home:RY.d({user:RY.d({documentos:RY.d(),descargas:RY.d(),'notas.txt':RY.f('Mis notas de RYterminal\nlinea con hola\notra linea\n')})}),etc:RY.d({hostname:RY.f('ryterminal\n')}),tmp:RY.d()}),
 windows:()=>RY.d({'C:':RY.d({Users:RY.d({User:RY.d({Documents:RY.d(),Downloads:RY.d(),'notas.txt':RY.f('Mis notas de RYterminal\nlinea con hola\notra linea\n')})}),Windows:RY.d({'system.ini':RY.f('[drivers]\nwave=mmdrv.dll\n')})})})
};
