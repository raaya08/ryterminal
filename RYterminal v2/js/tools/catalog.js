/* Registro central: las tarjetas y la navegación de herramientas se construyen desde aquí. */
(function(){
const T=RYTools;
T.catalog=[
 {id:'terminal',name:'Terminal',category:'Systems',icon:'🖥️',description:'Practica Linux, CMD y PowerShell con un filesystem virtual.',keywords:'linux windows cmd powershell shell comandos'},
 {id:'numbers',name:'Sistemas numéricos',category:'Calculators',icon:'🔢',description:'Convierte decimal, binario, octal y hexadecimal paso a paso.',keywords:'base decimal binary binario octal hexadecimal'},
 {id:'ascii',name:'Conversor ASCII',category:'Calculators',icon:'🔤',description:'Convierte texto, decimal, binario y hexadecimal, distinguiendo ASCII de Unicode.',keywords:'ascii texto character carácter decimal binary binario hex hexadecimal unicode'},
 {id:'storage',name:'Calculadora de almacenamiento',category:'Calculators',icon:'💾',description:'Convierte unidades decimales y binarias de almacenamiento informático.',keywords:'storage almacenamiento bit byte kb mb gb tb pb kib mib gib tebibyte'},
 {id:'units',name:'Conversor de unidades IT',category:'Calculators',icon:'📐',description:'Convierte datos, velocidades de red, frecuencia y tiempo.',keywords:'unit unidades converter conversor data datos network red frequency frecuencia time tiempo mbps mbs'},
 {id:'network',name:'Simulador de redes',category:'Network',icon:'🌐',description:'Diseña topologías virtuales y prueba conectividad, rutas y paquetes ICMP.',keywords:'redes network topology topología switch router ping ipv4 subnet mac packet simulator'},
 {id:'html',name:'HTML Live',category:'Development',icon:'🌐',description:'Edita HTML, CSS y JavaScript con una vista previa aislada.',keywords:'html css javascript js ide editor preview'},
 {id:'xml',name:'XML Studio',category:'Development',icon:'🗂️',description:'Edita, valida y explora documentos XML.',keywords:'xml validar format árbol tree'},
 {id:'json',name:'JSON Studio',category:'Development',icon:'📦',description:'Edita, valida y explora estructuras JSON.',keywords:'json validar format árbol tree'},
 {id:'library',name:'Biblioteca',category:'Learning',icon:'📚',description:'Consulta sintaxis, ejemplos y opciones de comandos.',keywords:'comandos command referencia help'},
 {id:'challenges',name:'Retos',category:'Learning',icon:'🎯',description:'Pon a prueba tus conocimientos con retos de terminal.',keywords:'terminal ejercicios retos challenges aprender'}
];
T.renderCatalog=function(host,query=''){const q=query.trim().toLowerCase(),items=T.catalog.filter(x=>`${x.name} ${x.description} ${x.category} ${x.keywords}`.toLowerCase().includes(q)),cats=[...new Set(items.map(x=>x.category))];host.innerHTML=cats.length?cats.map(cat=>`<section class="toolbox-category"><div class="category-title"><span>${({Systems:'SISTEMAS',Network:'REDES',Development:'DESARROLLO',Security:'SEGURIDAD',Calculators:'UTILIDADES',Learning:'APRENDIZAJE'})[cat]||T.escape(cat.toUpperCase())}</span><i></i></div><div class="toolbox-grid">${items.filter(x=>x.category===cat).map(x=>`<button class="toolbox-card" data-open="${x.id}"><span class="toolbox-icon">${x.icon}</span><span class="toolbox-card-title">${T.escape(x.name)}</span><span class="toolbox-description">${T.escape(x.description)}</span><span class="toolbox-open">Abrir <b>→</b></span></button>`).join('')}</div></section>`).join(''):'<div class="toolbox-empty">No hay herramientas que coincidan con la búsqueda.</div>';};
T.renderToolNav=function(host){host.innerHTML=T.catalog.filter(x=>T.views[x.id]).map(x=>`<button data-tool="${x.id}">${x.icon} ${T.escape(x.name)}</button>`).join('');};
})();
