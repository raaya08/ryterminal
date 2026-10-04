/* Retos declarativos. Cada reto = {id,sys,lvl,title,obj,hint,setup,check}. Rutas relativas al HOME.
   setup: dirs/files a preparar. check: dirs/files({ruta:true|'texto exacto'})/gone deben cumplirse en el filesystem final.
   Para añadir retos: añade plantillas a T o nombres a N. */
(function(){
const N=['proyecto','backup','fotos','trabajo','musica','curso','web','pruebas','informes','scripts'];
const T=[
['basic',n=>({title:`Nueva carpeta: ${n}`,obj:`Crea una carpeta llamada "${n}".`,hint:'Necesitas un comando pensado para crear directorios.',check:{dirs:[n]}})],
['basic',n=>({title:`Archivo vacío: ${n}.txt`,obj:`Crea un archivo vacío llamado "${n}.txt".`,hint:'Hay un comando para crear archivos vacíos; también sirve redirigir una salida con >.',check:{files:{[n+'.txt']:true}}})],
['mid',n=>({title:`Carpeta con notas (${n})`,obj:`Crea una carpeta llamada "${n}".\nDentro de ella crea un archivo llamado "notas.txt".`,hint:'Necesitas un comando para crear directorios y otro para crear archivos.',check:{dirs:[n],files:{[n+'/notas.txt']:true}}})],
['mid',n=>({title:`Escribe en ${n}.txt`,obj:`Crea el archivo "${n}.txt" con el texto exacto: hola`,hint:'Imprimir texto y redirigirlo con > a un archivo (o Set-Content en PowerShell).',check:{files:{[n+'.txt']:'hola'}}})],
['adv',n=>({title:`Copiar notas a ${n}`,obj:`Existe la carpeta "${n}".\nCopia "notas.txt" dentro de ella sin perder el original.`,hint:'Copiar no elimina el origen: busca el comando de copia.',setup:{dirs:[n],files:{'notas.txt':'Notas\n'}},check:{files:{[n+'/notas.txt']:true,'notas.txt':true}}})],
['adv',n=>({title:`Mover notas a ${n}`,obj:`Existe la carpeta "${n}".\nMueve "notas.txt" dentro de ella (no debe quedar en la carpeta de origen).`,hint:'Mover cambia la ubicación del archivo en lugar de duplicarlo.',setup:{dirs:[n],files:{'notas.txt':'Notas\n'}},check:{files:{[n+'/notas.txt']:true},gone:['notas.txt']}})],
['exp',n=>({title:`Limpieza de ${n}`,obj:`Elimina la carpeta "${n}" y todo su contenido.`,hint:'Una carpeta con contenido necesita una opción recursiva (-r, /s o -Recurse).',setup:{dirs:[n],files:{[n+'/a.txt']:'a',[n+'/b.txt']:'b'}},check:{gone:[n]}})],
['exp',n=>({title:`Estructura ${n}/sub`,obj:`Crea la estructura:\n${n}/sub/doc.txt`,hint:'Crea las carpetas de fuera hacia dentro, o usa una opción que cree las rutas intermedias.',check:{dirs:[n,n+'/sub'],files:{[n+'/sub/doc.txt']:true}}})]
];
RY.challenges=[];
['linux','cmd','ps'].forEach(sys=>N.forEach(n=>T.forEach(([lvl,f],i)=>RY.challenges.push({id:`${sys}-${i}-${n}`,sys,lvl,setup:{},...f(n)}))));
RY.levels={basic:'🟢 Básico',mid:'🟡 Intermedio',adv:'🟠 Avanzado',exp:'🔴 Experto'};
})();
