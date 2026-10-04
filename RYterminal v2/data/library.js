/* Biblioteca de comandos. Formato por línea: sistema|categoría|nombre|descripción|sintaxis|ejemplo|opciones(flag:desc;...)
   Para añadir un comando basta con añadir una línea. Si no existe en el motor se marca como "solo referencia". */
RY.library=`
linux|Directorios|ls|Lista el contenido de un directorio|ls [-la] [ruta]|ls -la|-l:formato largo;-a:incluye ocultos
linux|Directorios|cd|Cambia de directorio|cd [ruta]|cd documentos|..:subir un nivel;~:carpeta personal
linux|Directorios|pwd|Muestra el directorio actual|pwd|pwd|
linux|Directorios|mkdir|Crea directorios|mkdir [-p] nombre|mkdir proyecto|-p:crea rutas completas
linux|Directorios|rmdir|Elimina directorios vacíos|rmdir nombre|rmdir proyecto|
linux|Archivos|touch|Crea archivos vacíos|touch archivo|touch hola.txt|
linux|Archivos|rm|Elimina archivos o directorios|rm [-rf] ruta|rm hola.txt|-r:recursivo;-f:ignora errores
linux|Archivos|cp|Copia archivos o directorios|cp [-r] origen destino|cp notas.txt copia.txt|-r:directorios
linux|Archivos|mv|Mueve o renombra|mv origen destino|mv notas.txt documentos|
linux|Archivos|find|Busca archivos|find ruta -name patrón|find . -name "*.txt"|-name:patrón;-type:f o d
linux|Texto|cat|Muestra el contenido de archivos|cat archivo|cat notas.txt|
linux|Texto|head|Muestra las primeras líneas|head -n N archivo|head -n 1 notas.txt|-n:número de líneas
linux|Texto|tail|Muestra las últimas líneas|tail -n N archivo|tail -n 1 notas.txt|-n:número de líneas
linux|Texto|grep|Busca texto dentro de archivos|grep [-inv] patrón archivo|grep hola notas.txt|-i:ignora mayúsculas;-n:nº de línea;-v:invierte;-c:cuenta
linux|Texto|wc|Cuenta líneas, palabras y caracteres|wc [-l] archivo|wc -l notas.txt|-l:solo líneas
linux|Permisos|chmod|Cambia permisos|chmod modo archivo|chmod 755 notas.txt|755:rwxr-xr-x;+x:añadir ejecución
linux|Sistema|uname|Información del sistema|uname [-a]|uname -a|-a:todo
linux|Sistema|date|Fecha y hora|date|date|
linux|Usuarios|whoami|Usuario actual|whoami|whoami|
linux|Shell|echo|Imprime texto (admite > y >>)|echo texto|echo hola > a.txt|-n:sin salto de línea
linux|Shell|history|Historial de comandos|history|history|
linux|Procesos|ps|Lista procesos|ps aux|ps aux|
linux|Red|ping|Prueba conectividad|ping host|ping 8.8.8.8|
linux|Discos|df|Espacio en disco|df -h|df -h|-h:legible
linux|Compresión|tar|Empaqueta archivos|tar -czf out.tgz dir|tar -czf a.tgz docs|
cmd|Directorios|dir|Lista archivos y carpetas|dir [/b] [ruta]|dir|/b:solo nombres
cmd|Directorios|cd|Cambia de directorio|cd [ruta]|cd Documents|..:subir
cmd|Directorios|mkdir|Crea carpetas (alias md)|mkdir nombre|mkdir proyecto|
cmd|Directorios|rmdir|Elimina carpetas (alias rd)|rmdir [/s] nombre|rmdir /s proyecto|/s:con contenido
cmd|Archivos|copy|Copia archivos|copy origen destino|copy notas.txt copia.txt|
cmd|Archivos|move|Mueve archivos|move origen destino|move notas.txt Documents|
cmd|Archivos|del|Elimina archivos|del archivo|del notas.txt|
cmd|Archivos|ren|Renombra|ren origen nuevo|ren notas.txt viejo.txt|
cmd|Archivos|type|Muestra un archivo|type archivo|type notas.txt|
cmd|Sistema|echo|Imprime texto (admite > y >>)|echo texto|echo hola > a.txt|
cmd|Usuarios|whoami|Usuario actual|whoami|whoami|
cmd|Red|ipconfig|Configuración IP|ipconfig|ipconfig|
cmd|Procesos|tasklist|Lista procesos|tasklist|tasklist|
cmd|Procesos|taskkill|Termina procesos|taskkill /PID n|taskkill /IM notepad.exe|/PID:por id;/IM:por nombre
cmd|Discos|chkdsk|Comprueba disco|chkdsk|chkdsk|
ps|Archivos|Get-ChildItem|Lista elementos (alias ls, dir)|Get-ChildItem [-Path ruta]|Get-ChildItem|
ps|Archivos|Set-Location|Cambia de ubicación (alias cd)|Set-Location ruta|Set-Location Documents|
ps|Archivos|New-Item|Crea archivos o carpetas|New-Item -ItemType Directory -Name x|New-Item -ItemType Directory -Name proyecto|-ItemType:File o Directory;-Name;-Value
ps|Archivos|Remove-Item|Elimina elementos|Remove-Item ruta [-Recurse]|Remove-Item notas.txt|-Recurse:con contenido
ps|Archivos|Copy-Item|Copia elementos|Copy-Item origen destino|Copy-Item notas.txt copia.txt|
ps|Archivos|Move-Item|Mueve elementos|Move-Item origen destino|Move-Item notas.txt Documents|
ps|Archivos|Get-Content|Lee un archivo|Get-Content archivo|Get-Content notas.txt|
ps|Archivos|Set-Content|Escribe (sobrescribe)|Set-Content archivo -Value texto|Set-Content a.txt -Value hola|-Value:contenido
ps|Archivos|Add-Content|Añade al final|Add-Content archivo -Value texto|Add-Content notas.txt -Value extra|
ps|Procesos|Get-Process|Lista procesos|Get-Process [-Name n]|Get-Process|-Name:filtra
ps|Procesos|Stop-Process|Termina procesos|Stop-Process -Name n|Stop-Process -Name notepad|-Name;-Id
ps|Sistema|Get-ComputerInfo|Información del equipo|Get-ComputerInfo|Get-ComputerInfo|
ps|Sistema|Get-Date|Fecha y hora|Get-Date|Get-Date|
ps|Pipeline|Select-String|Filtra texto (pipeline)|... | Select-String patrón|Get-Content notas.txt | Select-String hola|
ps|Variables|Write-Output|Escribe en la salida|Write-Output texto|Write-Output hola|
ps|Objetos|Get-Service|Lista servicios|Get-Service|Get-Service|
`.trim().split('\n').map(l=>{const[sys,cat,name,desc,syn,ex,o]=l.split('|');
 return{sys,cat,name,desc,syn,ex,opts:(o||'').split(';').filter(Boolean).map(x=>x.split(/:(.*)/s).slice(0,2))};});
