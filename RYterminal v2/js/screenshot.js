/* Genera una captura PNG de la terminal con <canvas> (sin servidor). */
RY.screenshot=(lines,title)=>{
 const COLS=84,LH=22,PAD=26,TOP=58,rows=[];
 lines.forEach(l=>(l.k==='p'?l.pr+l.t:l.t).split('\n').forEach((seg,si)=>{let first=true;do{rows.push({k:l.k,t:seg.slice(0,COLS),pr:l.k==='p'&&si===0&&first?Math.min(l.pr.length,COLS):0});seg=seg.slice(COLS);first=false;}while(seg.length);}));
 const shown=rows.slice(-28),W=960,H=TOP+Math.max(shown.length,3)*LH+PAD+10,S=2,cv=document.createElement('canvas');cv.width=(W+60)*S;cv.height=(H+60)*S;
 const x=cv.getContext('2d');x.scale(S,S);
 const bg=x.createLinearGradient(0,0,W+60,H+60);bg.addColorStop(0,'#10183a');bg.addColorStop(1,'#2a1a55');x.fillStyle=bg;x.fillRect(0,0,W+60,H+60);
 const rr=(a,b,w,h,r)=>{x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath();};
 x.save();x.shadowColor='#000a';x.shadowBlur=40;x.shadowOffsetY=16;rr(30,30,W,H,16);x.fillStyle='#070d1a';x.fill();x.restore();
 rr(30,30,W,H,16);x.strokeStyle='#2a3a66';x.stroke();
 ['#ff5f57','#febc2e','#28c840'].forEach((c,i)=>{x.beginPath();x.arc(56+i*20,56,6,0,7);x.fillStyle=c;x.fill();});
 x.font='13px system-ui,sans-serif';x.fillStyle='#8591ad';x.textAlign='right';x.fillText(title+' · RYterminal',W+10,60);x.textAlign='left';
 x.font='15px ui-monospace,Consolas,monospace';const cw=x.measureText('M').width;
 shown.forEach((r,i)=>{const y=30+TOP+i*LH+14,p=r.t.slice(0,r.pr),t=r.t.slice(r.pr);
  x.fillStyle='#7aa2ff';x.fillText(p,56,y);x.fillStyle=r.k==='e'?'#ff8a98':'#e8edf7';x.fillText(t,56+p.length*cw,y);});
 cv.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='ryterminal-captura.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);});
};
