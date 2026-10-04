(function(){
window.RYNetwork=window.RYNetwork||{};const N=RYNetwork;
N.ipv4={
 parse(value){const p=String(value||'').split('.');if(p.length!==4||p.some(x=>!/^(0|[1-9]\d{0,2})$/.test(x)||+x>255))return null;return p.reduce((n,x)=>((n<<8)|+x)>>>0,0)>>>0;},
 format(n){return[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255].join('.');},
 mask(value){const n=this.parse(value);if(n===null)return null;let zero=false,prefix=0;for(let b=31;b>=0;b--){const bit=(n>>>b)&1;if(bit&&zero)return null;if(bit)prefix++;else zero=true;}if(prefix<1||prefix>30)return null;return{int:n,prefix};},
 network(ip,mask){const a=this.parse(ip),m=this.mask(mask);return a===null||!m?null:(a&m.int)>>>0;},
 sameSubnet(a,b,mask){const m=this.mask(mask),x=this.parse(a),y=this.parse(b);return !!m&&x!==null&&y!==null&&(x&m.int)===(y&m.int);},
 cidr(ip,mask){const n=this.network(ip,mask),m=this.mask(mask);return n===null||!m?null:`${this.format(n)}/${m.prefix}`;},
 inCidr(ip,cidr){const match=/^(.+)\/(\d|[12]\d|3[0-2])$/.exec(String(cidr||''));if(!match)return false;const addr=this.parse(ip),base=this.parse(match[1]),prefix=+match[2];if(addr===null||base===null)return false;const mask=prefix===0?0:(0xffffffff<<(32-prefix))>>>0;return(addr&mask)===(base&mask);},
 validHost(ip,mask){const n=this.parse(ip),m=this.mask(mask);if(n===null||!m)return false;const host=n&(~m.int>>>0);return host!==0&&host!==(~m.int>>>0);}
};
})();
