/* ═══════════════════════════════════════════════════════════════
   200 RETOS · siete fases de la investigacion
   k: tipo de comprobacion · c: comando exigido · at: carpeta exigida
   p/q: rutas · re: patron sobre la linea escrita · fre: patron sobre
   el contenido del archivo · b: reto · h: pista · o: hallazgo · s: sintaxis
   ═══════════════════════════════════════════════════════════════ */
var CC = window.CC || {};
window.CC = CC;

(function(){
"use strict";
var R="C:\\COLD_CASE\\",
    E=R+"EVIDENCE\\",
    A=R+"ARCHIVE\\",
    L=R+"LAB\\",
    T=R+"WITNESS\\",
    Y=R+"SYSTEM\\",
    W=R+"WORKSPACE\\",
    c74=E+"C74_GRIFFITH\\",c81=E+"C81_BUNKER\\",c87=E+"C87_ECHO\\",
    c94=E+"C94_MULHOLLAND\\",c99=E+"C99_SILVERLAKE\\",c03=E+"C03_MUELLE9\\",c11=E+"C11_VERDUGO\\";

/* ══════════ FASE I · ACCESO AL ARCHIVO MUERTO ══════════ */
var F1=[
{k:"cmd",c:"dir",at:R.slice(0,-1),b:"Primera noche de turno. Nadie te ha ensenado el archivo: averigua tu mismo que cuatro unidades de trabajo cuelgan de la raiz.",h:"El comando que lista un directorio son tres letras.",o:"EVIDENCE, ARCHIVE, LAB, SYSTEM y tu area de trabajo. Ese es todo el mundo que tienes.",s:"dir"},
{k:"cd",p:E.slice(0,-1),b:"Los expedientes viven en EVIDENCE. Entra.",h:"cd seguido del nombre de la carpeta.",o:"Dentro. Huele a papel de los setenta.",s:"cd EVIDENCE"},
{k:"cmd",c:"dir",at:E.slice(0,-1),b:"Lista los expedientes que siguen abiertos en esta unidad.",h:"Vuelve a usar dir, ahora aqui.",o:"Siete carpetas, siete personas que nadie reclamo a tiempo.",s:"dir"},
{k:"cd",p:c87.slice(0,-1),b:"Empieza por el caso de la operadora de Echo Park: carpeta C87_ECHO.",h:"cd C87_ECHO",o:"Expediente 87-4412 abierto por primera vez desde 1991.",s:"cd C87_ECHO"},
{k:"cmd",c:"dir",at:c87.slice(0,-1),b:"Comprueba que papeles sobrevivieron dentro del expediente del 87.",h:"dir sin argumentos lista la carpeta actual.",o:"Perfil, cronologia, sospechosos, llamadas. El esqueleto de un caso.",s:"dir"},
{k:"cd",p:c87+"FOTOS",b:"Las fotos de escena estan en su propia carpeta. Entra en FOTOS.",h:"cd FOTOS",o:"Dos negativos. Uno de ellos ya no se puede recuperar.",s:"cd FOTOS"},
{k:"cd",c:"cd",p:c87.slice(0,-1),b:"Vuelve al expediente sin escribir la ruta completa: sube un nivel.",h:"Dos puntos seguidos significan directorio padre.",o:"De vuelta en el 87.",s:"cd .."},
{k:"cd",p:A.slice(0,-1),b:"Salta al archivo central con una ruta absoluta, la que empieza desde la raiz.",h:"Una ruta absoluta empieza por barra invertida: cd \\COLD_CASE\\ARCHIVE",o:"Archivo central. Aqui esta el indice de todo lo que no se resolvio.",s:"cd \\COLD_CASE\\ARCHIVE"},
{k:"cmd",c:"dir",at:A.slice(0,-1),b:"Lista el contenido del archivo central.",h:"dir",o:"Indice maestro, cerrados y un registro de purga de 1996.",s:"dir"},
{k:"cmd",c:"cls",b:"La pantalla esta saturada. Limpiala antes de seguir leyendo.",h:"Tres letras que borran la consola.",o:"Pantalla en negro. Asi se piensa mejor a las tres de la manana.",s:"cls"},
{k:"cmd",c:"echo",re:"caso\\s+reabierto",b:"Deja constancia de tu decision en el acta del turno: imprime el texto CASO REABIERTO.",h:"echo seguido del texto exacto.",o:"Registrado. Lo que escribas a partir de ahora tiene consecuencias.",s:"echo CASO REABIERTO"},
{k:"cmd",c:"help",b:"Nadie te dio manual. Pidelo al sistema.",h:"Una palabra de cuatro letras.",o:"Esa lista es todo tu instrumental forense.",s:"help"},
{k:"cmd",c:"ver",b:"La defensa preguntara con que version del archivo trabajaste. Averiguala.",h:"Tres letras: ver.",o:"MS-DOS 6.22 sobre una capa de 1987. El tiempo aqui no pasa.",s:"ver"},
{k:"cmd",c:"vol",b:"Identifica la etiqueta y el numero de serie del volumen para el acta.",h:"vol muestra la etiqueta del disco.",o:"Volumen COLD_CASE, serie 1987-4F2A. Anotado.",s:"vol"},
{k:"cmd",c:"title",re:"turno",b:"Marca la ventana de la sesion con tu turno: pon el titulo TURNO NOCHE 1142.",h:"title seguido del texto.",o:"La sesion lleva tu placa.",s:"title TURNO NOCHE 1142"},
{k:"cd",p:L.slice(0,-1),b:"Ve al laboratorio con ruta absoluta.",h:"cd \\COLD_CASE\\LAB",o:"Laboratorio. Cinco informes y una cola que no avanza desde 1974.",s:"cd \\COLD_CASE\\LAB"},
{k:"cmd",c:"dir",re:"/b",at:L.slice(0,-1),b:"Lista el laboratorio en formato breve: solo nombres, sin fechas ni tamanos.",h:"El modificador de formato breve es /b",o:"Cinco nombres limpios. Para pegar en un informe, perfecto.",s:"dir /b"},
{k:"cd",p:T.slice(0,-1),b:"Pasa a la unidad de testigos subiendo un nivel y bajando a WITNESS, en un solo comando.",h:"Puedes combinar: cd ..\\WITNESS",o:"Testigos. Algunos siguen vivos y nadie les ha llamado en treinta anos.",s:"cd ..\\WITNESS"},
{k:"cmd",c:"dir",at:T.slice(0,-1),b:"Mira que hay en la unidad de testigos.",h:"dir",o:"Un maestro de testigos, un log de anonimos y recompensas sin reclamar.",s:"dir"},
{k:"cd",p:Y.slice(0,-1),b:"Ve a la unidad SYSTEM, donde vive la configuracion del terminal.",h:"cd \\COLD_CASE\\SYSTEM",o:"Aqui esta la memoria de la maquina, que a veces recuerda mejor que la gente.",s:"cd \\COLD_CASE\\SYSTEM"},
{k:"cmd",c:"dir",at:Y.slice(0,-1),b:"Lista la unidad SYSTEM.",h:"dir",o:"Red, accesos, usuarios y una carpeta de copias de seguridad.",s:"dir"},
{k:"cd",p:Y+"BACKUP",b:"Entra en la carpeta de copias de seguridad.",h:"cd BACKUP",o:"Dos cintas: una de 1996 y otra de 2009. Las dos fechas apareceran otra vez.",s:"cd BACKUP"},
{k:"cd",p:c74.slice(0,-1),b:"Vuelve a la evidencia y abre el caso mas antiguo del archivo: C74_GRIFFITH.",h:"Usa la ruta absoluta completa.",o:"1974. El silbido de Griffith Park.",s:"cd \\COLD_CASE\\EVIDENCE\\C74_GRIFFITH"},
{k:"cmd",c:"dir",re:"/b",at:c74.slice(0,-1),b:"Lista el expediente del 74 en formato breve.",h:"dir /b",o:"Nueve piezas. Para un caso de cincuenta anos, no esta mal.",s:"dir /b"},
{k:"cmd",c:"tree",re:"evidence",b:"Dibuja el arbol completo de la unidad de evidencia para ver como esta organizada.",h:"tree admite una ruta: tree \\COLD_CASE\\EVIDENCE",o:"Siete expedientes, cada uno con su carpeta de fotos. Orden de archivo, no de investigacion.",s:"tree \\COLD_CASE\\EVIDENCE"},
{k:"cd",p:W.slice(0,-1),b:"Ve a tu area de trabajo, WORKSPACE: el unico sitio donde puedes crear y borrar.",h:"cd \\COLD_CASE\\WORKSPACE",o:"Tu mesa. Vacia, salvo restos de un analista anterior.",s:"cd \\COLD_CASE\\WORKSPACE"},
{k:"cmd",c:"dir",at:W.slice(0,-1),b:"Mira que dejo quien ocupo esta mesa antes que tu.",h:"dir",o:"Un leeme y una carpeta temporal de 2024. Alguien lo intento y lo dejo.",s:"dir"},
{k:"cd",p:W+"TEMP",b:"Entra en la carpeta TEMP.",h:"cd TEMP",o:"Dos archivos temporales. Basura, pero basura que ocupa sitio.",s:"cd TEMP"},
{k:"cd",p:"C:",b:"Sube hasta la raiz del disco de un solo salto.",h:"Una barra invertida sola lleva a la raiz: cd \\",o:"Raiz del volumen. Desde aqui cuelga todo el archivo.",s:"cd \\"},
{k:"cd",p:R.slice(0,-1),b:"Vuelve a la carpeta COLD_CASE para cerrar la fase de reconocimiento.",h:"cd COLD_CASE",o:"FASE I CERRADA. Ya sabes moverte a oscuras por este archivo.",s:"cd COLD_CASE"}
];

/* ══════════ FASE II · APERTURA DE EXPEDIENTES ══════════ */
var F2=[
{k:"cd",p:c87.slice(0,-1),b:"Para leer con comodidad, situate dentro del expediente del 87 antes de abrir nada.",h:"cd \\COLD_CASE\\EVIDENCE\\C87_ECHO",o:"Dentro del 87. A partir de aqui basta con el nombre del archivo.",s:"cd \\COLD_CASE\\EVIDENCE\\C87_ECHO"},
{k:"read",p:c87+"perfil.txt",b:"Abre el perfil de la victima del caso 87-4412 y ponle cara al expediente.",h:"type seguido del nombre del archivo.",o:"Marguerite Vance, 29 anos, operadora de centralita. Ahogada junto al estanque.",s:"type perfil.txt"},
{k:"read",p:c87+"cronologia.txt",b:"Lee la cronologia reconstruida del 87 para situar las horas.",h:"type cronologia.txt",o:"El reloj se paro a las 03:55 y el forense fija la muerte despues.",s:"type cronologia.txt"},
{k:"read",p:c87+"sospechosos.log",b:"Abre el log de sospechosos del 87.",h:"type funciona con cualquier extension, tambien .log",o:"Cuatro nombres. Uno de ellos ni siquiera esta identificado.",s:"type sospechosos.log"},
{k:"read",p:c87+"declaraciones.txt",b:"Lee las declaraciones firmadas del 87.",h:"type declaraciones.txt",o:"Las coartadas estan escritas como si nadie fuera a releerlas. Tu lo haces.",s:"type declaraciones.txt"},
{k:"read",p:c87+"llamadas.txt",b:"Consulta el registro de llamadas de la noche del 12 de marzo de 1987.",h:"type llamadas.txt",o:"Una llamada a las 23:40 desde una cabina de Sunset. Y otra entrante a las 02:10.",s:"type llamadas.txt"},
{k:"read",p:c87+"evidencias.csv",b:"Abre el inventario de evidencias del 87. Es un csv, pero se lee igual.",h:"type evidencias.csv",o:"Reloj, ficha de centralita y un zapato. Todo sellado desde 1987.",s:"type evidencias.csv"},
{k:"read",p:c87+"notas.txt",b:"Lee las notas sueltas del detective Halloran sobre el 87.",h:"type notas.txt",o:"Alguien movio la hora del reloj. Halloran lo escribio y nadie le hizo caso.",s:"type notas.txt"},
{k:"read",p:c94+"perfil.txt",b:"Pasa al caso 94-0770 y lee el perfil de la victima.",h:"Puedes leerlo sin moverte usando la ruta completa.",o:"Thomas Reyes, 41 anos, asfixia mecanica en el mirador de Mulholland.",s:"type \\COLD_CASE\\EVIDENCE\\C94_MULHOLLAND\\perfil.txt"},
{k:"read",p:c94+"sospechosos.log",b:"Abre el log de sospechosos del 94.",h:"type con la ruta del archivo.",o:"Un guardia de seguridad con turno de noche y sin coartada verificable.",s:"type \\COLD_CASE\\EVIDENCE\\C94_MULHOLLAND\\sospechosos.log"},
{k:"read",p:c94+"notas.txt",b:"Lee las notas del detective sobre el 94.",h:"type notas.txt con su ruta.",o:"La fibra azul coincide con un uniforme de seguridad. Nadie pidio la comparacion.",s:"type \\COLD_CASE\\EVIDENCE\\C94_MULHOLLAND\\notas.txt"},
{k:"read",p:c74+"perfil.txt",b:"Retrocede al caso mas antiguo: lee el perfil del 74-0098.",h:"La carpeta es C74_GRIFFITH.",o:"Dorothy Ulmer, 22 anos. Estrangulada en el sendero del observatorio.",s:"type \\COLD_CASE\\EVIDENCE\\C74_GRIFFITH\\perfil.txt"},
{k:"read",p:c74+"microfilm_ref.txt",b:"El expediente del 74 tiene una referencia a otro soporte. Leela.",h:"El archivo se llama microfilm_ref.txt",o:"El expediente completo solo existe en un rollo de microfilm del archivo central.",s:"type \\COLD_CASE\\EVIDENCE\\C74_GRIFFITH\\microfilm_ref.txt"},
{k:"read",p:A+"MICROFILM\\rollo_1974.txt",b:"Sigue la pista: abre el rollo de microfilm de 1974 en el archivo central.",h:"Esta en ARCHIVE\\MICROFILM\\rollo_1974.txt",o:"Al rollo le falta el fotograma 14. La tercera pagina de la declaracion no esta.",s:"type \\COLD_CASE\\ARCHIVE\\MICROFILM\\rollo_1974.txt"},
{k:"read",p:c81+"perfil.txt",b:"Abre el perfil del caso 81-0455, la caida de Bunker Hill.",h:"La carpeta es C81_BUNKER.",o:"Samuel Pike, 53 anos. Le empujaron por unas escaleras a la una de la madrugada.",s:"type \\COLD_CASE\\EVIDENCE\\C81_BUNKER\\perfil.txt"},
{k:"read",p:A+"MICROFILM\\rollo_1981.txt",b:"Consulta tambien el rollo de microfilm de 1981.",h:"Mismo sitio que el del 74, cambiando el ano.",o:"Un pagare manuscrito con una firma que nunca se cotejo.",s:"type \\COLD_CASE\\ARCHIVE\\MICROFILM\\rollo_1981.txt"},
{k:"read",p:c99+"perfil.txt",b:"Abre el perfil del caso 99-2310, el estudio de Silver Lake.",h:"La carpeta es C99_SILVERLAKE.",o:"Nadia Brun, 26 anos. Sedante en dosis incompatible con tomarselo sola.",s:"type \\COLD_CASE\\EVIDENCE\\C99_SILVERLAKE\\perfil.txt"},
{k:"read",p:c99+"cinta_dat.log",b:"En el 99 hay una transcripcion de la cinta DAT. Leela entera.",h:"El archivo es cinta_dat.log",o:"Catorce segundos de una voz que nadie identifico. Sigue sin identificar.",s:"type \\COLD_CASE\\EVIDENCE\\C99_SILVERLAKE\\cinta_dat.log"},
{k:"read",p:c03+"perfil.txt",b:"Abre el perfil del caso 03-1188, el del muelle 9.",h:"La carpeta es C03_MUELLE9.",o:"Victor Alcaraz, 38 anos. Golpe en la nuca a medianoche en el puerto.",s:"type \\COLD_CASE\\EVIDENCE\\C03_MUELLE9\\perfil.txt"},
{k:"read",p:c11+"perfil.txt",b:"Y el ultimo del archivo: el incendio de Verdugo, caso 11-0642.",h:"La carpeta es C11_VERDUGO.",o:"Helena Ruiz, 34 anos. El fuego fue provocado y la alarma estaba desactivada.",s:"type \\COLD_CASE\\EVIDENCE\\C11_VERDUGO\\perfil.txt"},
{k:"read",p:c11+"alarma.log",b:"Lee el registro de la alarma de la nave de Verdugo.",h:"El archivo es alarma.log",o:"Desarmada con llave maestra cuatro minutos antes del humo. Eso no es un accidente.",s:"type \\COLD_CASE\\EVIDENCE\\C11_VERDUGO\\alarma.log"},
{k:"read",p:A+"indice_maestro.txt",b:"Vuelve al indice maestro del archivo central y leelo con los siete casos ya en la cabeza.",h:"Esta en ARCHIVE\\indice_maestro.txt",o:"Siete lineas. Siete personas. Un solo analista de guardia.",s:"type \\COLD_CASE\\ARCHIVE\\indice_maestro.txt"},
{k:"cmd",c:"more",re:"cola_laboratorio",b:"La cola del laboratorio es larga. Leela por partes con el visor paginado.",h:"more hace lo mismo que type pero por pantallas.",o:"Cinco peticiones vivas, la mas antigua de 1974.",s:"more \\COLD_CASE\\LAB\\cola_laboratorio.txt"},
{k:"cmd",c:"sort",re:"testigos_maestro",b:"Ordena alfabeticamente el maestro de testigos: los nombres repetidos saltaran a la vista.",h:"sort ordena las lineas de un archivo.",o:"Kessler aparece dos veces. Thorne dos veces. Mansur dos veces. Tres casualidades son un patron.",s:"sort \\COLD_CASE\\WITNESS\\testigos_maestro.csv"},
{k:"cmd",c:"sort",re:"/r",b:"Ordena al reves la lista de casos cerrados, para ver primero los mas recientes.",h:"El modificador de orden inverso es /r",o:"Tres cerrados frente a siete abiertos. La unidad pierde por goleada.",s:"sort /r \\COLD_CASE\\ARCHIVE\\casos_cerrados.txt"},
{k:"cmd",c:"find",re:"/c",b:"Cuenta cuantas lineas mencionan ALIBI en el log de sospechosos del 94, sin leerlas una a una.",h:"find /c \"ALIBI\" cuenta en vez de mostrar.",o:"Cuatro coartadas registradas. Dos de ellas no valen nada.",s:"find /c \"ALIBI\" \\COLD_CASE\\EVIDENCE\\C94_MULHOLLAND\\sospechosos.log"},
{k:"cmd",c:"find",re:"pendiente",b:"Saca del laboratorio solo las lineas que siguen PENDIENTE.",h:"find \"PENDIENTE\" seguido del archivo.",o:"Cinco pruebas esperan turno. Dos de ellas desde el siglo pasado.",s:"find \"PENDIENTE\" \\COLD_CASE\\LAB\\cola_laboratorio.txt"},
{k:"cmd",c:"tree",re:"/f",b:"Dibuja el arbol del expediente del 87 incluyendo los archivos, no solo las carpetas.",h:"tree con el modificador /f muestra tambien archivos.",o:"Todo el expediente en una pantalla. Util para la portada del informe.",s:"tree \\COLD_CASE\\EVIDENCE\\C87_ECHO /f"},
{k:"cmd",c:"dir",re:"\\*\\.csv",b:"Localiza los inventarios de evidencia: lista solo los archivos .csv del expediente del 87.",h:"dir admite comodines: dir *.csv",o:"Un unico csv por expediente. Esa es la unica tabla que existe.",s:"dir \\COLD_CASE\\EVIDENCE\\C87_ECHO\\*.csv"},
{k:"cmd",c:"fc",b:"Compara los dos rollos de microfilm, el de 1974 y el de 1981, para ver en que se diferencian.",h:"fc <archivo1> <archivo2> compara linea a linea.",o:"FASE II CERRADA. Dos rollos, dos decadas, el mismo archivo incompleto.",s:"fc \\COLD_CASE\\ARCHIVE\\MICROFILM\\rollo_1974.txt \\COLD_CASE\\ARCHIVE\\MICROFILM\\rollo_1981.txt"}
];

/* ══════════ FASE III · CADENA DE CUSTODIA ══════════ */
var F3=[
{k:"cd",p:W.slice(0,-1),b:"Para no tocar la evidencia original, todo el trabajo se hace en tu area. Ve a WORKSPACE.",h:"cd \\COLD_CASE\\WORKSPACE",o:"Mesa limpia. Regla numero uno: se trabaja sobre copias.",s:"cd \\COLD_CASE\\WORKSPACE"},
{k:"exists",c:"mkdir",p:W+"CASO_87",b:"Crea una carpeta de trabajo para el caso del 87, llamada CASO_87.",h:"mkdir CASO_87 (tambien vale md)",o:"Carpeta abierta. El expediente del 87 ya tiene sitio propio.",s:"mkdir CASO_87"},
{k:"exists",c:"mkdir",p:W+"CASO_94",b:"Haz lo mismo con el del 94: carpeta CASO_94.",h:"mkdir CASO_94",o:"Dos frentes abiertos a la vez.",s:"mkdir CASO_94"},
{k:"exists",c:"mkdir",p:W+"CASO_03",b:"Y una tercera para el del 2003: CASO_03.",h:"mkdir CASO_03",o:"Tres carpetas, tres hilos que acabaran cruzandose.",s:"mkdir CASO_03"},
{k:"exists",c:"copy",p:W+"CASO_87\\perfil.txt",b:"Copia el perfil de la victima del 87 dentro de CASO_87, sin mover el original.",h:"copy <origen> <destino>. El destino puede ser una carpeta.",o:"Copia hecha. El original sigue sellado donde estaba.",s:"copy \\COLD_CASE\\EVIDENCE\\C87_ECHO\\perfil.txt CASO_87"},
{k:"exists",c:"copy",p:W+"CASO_87\\sospechosos.log",b:"Copia tambien el log de sospechosos del 87 a CASO_87.",h:"Mismo comando, cambiando el archivo de origen.",o:"Ya puedes rayar el log sin estropear la prueba.",s:"copy \\COLD_CASE\\EVIDENCE\\C87_ECHO\\sospechosos.log CASO_87"},
{k:"exists",c:"copy",p:W+"CASO_87\\declaraciones.txt",b:"Completa la copia con las declaraciones firmadas del 87.",h:"copy ...\\declaraciones.txt CASO_87",o:"Tres piezas en tu mesa. Suficiente para empezar a cruzar datos.",s:"copy \\COLD_CASE\\EVIDENCE\\C87_ECHO\\declaraciones.txt CASO_87"},
{k:"cd",p:W+"CASO_87",b:"Entra en tu carpeta CASO_87.",h:"cd CASO_87",o:"Dentro de tu propia version del expediente.",s:"cd CASO_87"},
{k:"exists",c:"ren",p:W+"CASO_87\\perfil_1987.txt",b:"El archivo central exige nomenclatura por ano. Renombra perfil.txt como perfil_1987.txt.",h:"ren <nombre actual> <nombre nuevo>",o:"Nomenclatura correcta. Asi no se confunde con los otros seis perfiles.",s:"ren perfil.txt perfil_1987.txt"},
{k:"exists",c:"ren",p:W+"CASO_87\\sospechosos_1987.log",b:"Renombra tambien sospechosos.log como sospechosos_1987.log.",h:"ren sospechosos.log sospechosos_1987.log",o:"Expediente etiquetado como manda el protocolo.",s:"ren sospechosos.log sospechosos_1987.log"},
{k:"exists",c:"mkdir",p:W+"CASO_87\\COPIAS",b:"Crea dentro una subcarpeta COPIAS para los duplicados de seguridad.",h:"mkdir COPIAS",o:"Una copia de la copia. En este archivo nunca sobra.",s:"mkdir COPIAS"},
{k:"exists",c:"copy",p:W+"CASO_87\\COPIAS\\declaraciones.txt",b:"Duplica de una sola vez todos los archivos .txt de la carpeta dentro de COPIAS.",h:"copy admite comodines: copy *.txt COPIAS",o:"Duplicado en bloque. Un comando en vez de cuatro.",s:"copy *.txt COPIAS"},
{k:"exists",c:"xcopy",p:W+"CASO_87\\FOTOS\\foto_01.asc",b:"Trae la carpeta de fotos del expediente original entera, con su contenido, como FOTOS.",h:"xcopy copia carpetas completas: xcopy <origen> FOTOS /s",o:"Fotos duplicadas. La escena del 87 ya esta en tu mesa.",s:"xcopy \\COLD_CASE\\EVIDENCE\\C87_ECHO\\FOTOS FOTOS /s"},
{k:"cd",p:W+"TEMP",b:"Queda limpiar lo que dejo el analista anterior. Ve a la carpeta TEMP de tu area.",h:"cd \\COLD_CASE\\WORKSPACE\\TEMP",o:"Dos temporales de 2024 que no significan nada.",s:"cd \\COLD_CASE\\WORKSPACE\\TEMP"},
{k:"gone",c:"del",p:W+"TEMP\\borrador.tmp",b:"Borra de un solo golpe todos los archivos .tmp de esta carpeta.",h:"del acepta comodines: del *.tmp",o:"Carpeta vacia. Nada de esto era evidencia.",s:"del *.tmp"},
{k:"cd",c:"cd",p:W.slice(0,-1),b:"Sube de nuevo a WORKSPACE.",h:"cd ..",o:"Arriba otra vez.",s:"cd .."},
{k:"gone",c:"rmdir",p:W+"TEMP",b:"Ahora que esta vacia, elimina la carpeta TEMP.",h:"Las carpetas no se borran con del, sino con rmdir (o rd).",o:"Fuera. Tu area de trabajo ya es solo tuya.",s:"rmdir TEMP"},
{k:"exists",c:"mkdir",p:W+"INFORMES",b:"Crea la carpeta INFORMES, donde iran tus conclusiones finales.",h:"mkdir INFORMES",o:"El sitio donde acabara todo esto.",s:"mkdir INFORMES"},
{k:"cd",p:c03.slice(0,-1),b:"Hay un expediente que no cuadra. Ve al caso del muelle: C03_MUELLE9.",h:"cd \\COLD_CASE\\EVIDENCE\\C03_MUELLE9",o:"Caso 03-1188. El listado parece mas corto de lo que deberia.",s:"cd \\COLD_CASE\\EVIDENCE\\C03_MUELLE9"},
{k:"cmd",c:"dir",re:"/a",at:c03.slice(0,-1),b:"El inventario dice nueve piezas y tu ves ocho. Lista el directorio mostrando tambien los archivos ocultos.",h:"dir con el modificador /a muestra todos los atributos.",o:"Ahi esta: informante.txt, oculto desde el 2 de junio de 2009 a las 04:44.",s:"dir /a"},
{k:"attr",c:"attrib",p:c03+"informante.txt",v:false,b:"Retira el atributo de oculto de informante.txt.",h:"attrib -h <archivo> retira el atributo oculto.",o:"Documento visible. Alguien se tomo muchas molestias para que no lo vieras.",s:"attrib -h informante.txt"},
{k:"read",p:c03+"informante.txt",b:"Lee el documento reservado que acabas de destapar.",h:"type informante.txt",o:"El fichaje del puerto fue alterado a mano. El caso 03-1188 esta listo para reabrirse.",s:"type informante.txt"},
{k:"cd",p:c87.slice(0,-1),b:"Si escondieron uno, pueden haber escondido mas. Vuelve al expediente del 87.",h:"cd \\COLD_CASE\\EVIDENCE\\C87_ECHO",o:"Mismo archivo, misma sospecha.",s:"cd \\COLD_CASE\\EVIDENCE\\C87_ECHO"},
{k:"cmd",c:"dir",re:"/a",at:c87.slice(0,-1),b:"Repite el listado con atributos ocultos en el expediente del 87.",h:"dir /a",o:"fuente_anonima.txt. Oculto el mismo dia de 2009, dos minutos despues.",s:"dir /a"},
{k:"attr",c:"attrib",p:c87+"fuente_anonima.txt",v:false,b:"Destapa fuente_anonima.txt.",h:"attrib -h fuente_anonima.txt",o:"Visible. Dos documentos ocultos la misma madrugada por la misma mano.",s:"attrib -h fuente_anonima.txt"},
{k:"read",p:c87+"fuente_anonima.txt",b:"Lee la fuente anonima del 87.",h:"type fuente_anonima.txt",o:"La cabina de Sunset del 87 aparece tambien en el expediente del 81. El archivo estaba conectado y nadie lo vio.",s:"type fuente_anonima.txt"},
{k:"cd",p:Y.slice(0,-1),b:"Quien oculto esos archivos dejo huella en el sistema. Ve a la unidad SYSTEM.",h:"cd \\COLD_CASE\\SYSTEM",o:"La maquina tambien guarda secretos.",s:"cd \\COLD_CASE\\SYSTEM"},
{k:"cmd",c:"dir",re:"/a",at:Y.slice(0,-1),b:"Lista SYSTEM con los atributos ocultos a la vista.",h:"dir /a",o:"nightscan.cfg. Un archivo de configuracion que nadie declaro.",s:"dir /a"},
{k:"attr",c:"attrib",p:Y+"nightscan.cfg",v:false,b:"Retira el atributo oculto de nightscan.cfg.",h:"attrib -h nightscan.cfg",o:"Destapado. Esto ya no es un caso frio: es alguien trabajando para que lo siga siendo.",s:"attrib -h nightscan.cfg"},
{k:"read",p:Y+"nightscan.cfg",b:"Lee la configuracion de NIGHTSCAN.",h:"type nightscan.cfg",o:"FASE III CERRADA. Una tarea programada a las 04:44 para ocultar el expediente del muelle.",s:"type nightscan.cfg"}
];

/* ══════════ FASE IV · PERITAJE DE DATOS ══════════ */
var F4=[
{k:"cd",p:c94.slice(0,-1),b:"Empieza el peritaje por el caso del guardia de seguridad: ve a C94_MULHOLLAND.",h:"cd \\COLD_CASE\\EVIDENCE\\C94_MULHOLLAND",o:"Caso 94-0770 sobre la mesa.",s:"cd \\COLD_CASE\\EVIDENCE\\C94_MULHOLLAND"},
{k:"cmd",c:"findstr",re:"alibi",b:"Filtra en el log de sospechosos solo las lineas que contienen la palabra ALIBI.",h:"findstr \"ALIBI\" sospechosos.log",o:"Cuatro coartadas en cuatro lineas. El resto del archivo sobra.",s:"findstr \"ALIBI\" sospechosos.log"},
{k:"cmd",c:"findstr",re:"/i.*coartada|coartada.*/i",b:"En las declaraciones la palabra coartada aparece en mayusculas y minusculas. Filtralas todas ignorando mayusculas.",h:"El modificador que ignora mayusculas es /i",o:"Cinco menciones. Una de ellas nunca se contrasto.",s:"findstr /i \"coartada\" declaraciones.txt"},
{k:"cmd",c:"findstr",re:"/n",b:"Localiza en el registro de llamadas las que ocurrieron pasadas las dos de la madrugada, mostrando el numero de linea.",h:"findstr /n \"02:\" llamadas.txt numera las coincidencias.",o:"Linea 5: una llamada de seis segundos a las 02:02. Justo en la horquilla forense.",s:"findstr /n \"02:\" llamadas.txt"},
{k:"cmd",c:"findstr",re:"/v",b:"Dale la vuelta al filtro: muestra las lineas del log de sospechosos que NO dicen CONFIRMADO.",h:"El modificador /v invierte la busqueda.",o:"Lo que queda son los dos nombres que nadie pudo descartar.",s:"findstr /v \"CONFIRMADO\" sospechosos.log"},
{k:"cmd",c:"findstr",re:"fibra",b:"Busca la palabra fibra en las notas del detective del 94.",h:"findstr \"fibra\" notas.txt",o:"La fibra azul lleva treinta anos esperando una comparacion que cuesta una tarde.",s:"findstr \"fibra\" notas.txt"},
{k:"cmd",c:"findstr",re:"pendiente",b:"Comprueba que peticiones del 94 siguen pendientes en el laboratorio.",h:"findstr /i \"pendiente\" laboratorio.txt",o:"La fibra azul, otra vez. Siempre la misma prueba sin procesar.",s:"findstr /i \"pendiente\" laboratorio.txt"},
{k:"cd",p:L.slice(0,-1),b:"Ve al laboratorio para cruzar las peticiones de todos los casos.",h:"cd \\COLD_CASE\\LAB",o:"La cola completa, no solo la del 94.",s:"cd \\COLD_CASE\\LAB"},
{k:"cmd",c:"findstr",re:"pendiente",b:"Filtra en la cola del laboratorio todas las peticiones PENDIENTE.",h:"findstr \"PENDIENTE\" cola_laboratorio.txt",o:"Cuatro pruebas de cuatro casos distintos esperando desde hace decadas.",s:"findstr \"PENDIENTE\" cola_laboratorio.txt"},
{k:"cmd",c:"findstr",re:"codis",b:"Busca en el fichero de cotejos de ADN las consultas a la base nacional CODIS.",h:"findstr /i \"codis\" adn_cotejos.csv",o:"Cuatro consultas. Cuatro veces el mismo silencio.",s:"findstr /i \"codis\" adn_cotejos.csv"},
{k:"cmd",c:"findstr",re:"coincidencia",b:"Filtra las muestras que quedaron SIN COINCIDENCIA.",h:"Entrecomilla el texto porque lleva un espacio.",o:"Tres perfiles sin dueno. Uno de ellos completo, de trece marcadores.",s:"findstr \"SIN COINCIDENCIA\" adn_cotejos.csv"},
{k:"cmd",c:"findstr",re:"uniforme",b:"Busca la palabra uniforme en el analisis de fibras.",h:"findstr /i \"uniforme\" fibras.txt",o:"Compatible con uniforme de seguridad. El guardia del 94 vuelve a aparecer.",s:"findstr /i \"uniforme\" fibras.txt"},
{k:"cmd",c:"findstr",re:"sedante",b:"Busca el sedante en el informe de toxicologia.",h:"findstr /i \"sedante\" toxicologia.txt",o:"En el 99 la dosis era incompatible con autoadministracion. Eso es un homicidio, no un accidente.",s:"findstr /i \"sedante\" toxicologia.txt"},
{k:"cd",p:T.slice(0,-1),b:"Pasa a la unidad de testigos para cruzar nombres entre expedientes.",h:"cd \\COLD_CASE\\WITNESS",o:"Aqui se ve lo que los expedientes por separado esconden.",s:"cd \\COLD_CASE\\WITNESS"},
{k:"cmd",c:"findstr",re:"kessler",b:"Busca a Kessler en el maestro de testigos.",h:"findstr \"Kessler\" testigos_maestro.csv",o:"Dos casos, 81 y 87. Ilocalizable desde 1983 en los dos.",s:"findstr \"Kessler\" testigos_maestro.csv"},
{k:"cmd",c:"findstr",re:"thorne",b:"Busca ahora a Thorne.",h:"findstr \"Thorne\" testigos_maestro.csv",o:"94 y 2011. El guardia de Mulholland era el vigilante de la nave de Verdugo.",s:"findstr \"Thorne\" testigos_maestro.csv"},
{k:"cmd",c:"findstr",re:"mansur",b:"Y busca a Mansur.",h:"findstr \"Mansur\" testigos_maestro.csv",o:"74 y 99. Veinticinco anos entre un nombre y el otro.",s:"findstr \"Mansur\" testigos_maestro.csv"},
{k:"cmd",c:"findstr",re:"ilocalizable",b:"Filtra todos los testigos marcados como ilocalizables, sin importar mayusculas.",h:"findstr /i \"ilocalizable\" testigos_maestro.csv",o:"Dos fichas, el mismo hombre. Nadie volvio a buscarle despues del 83.",s:"findstr /i \"ilocalizable\" testigos_maestro.csv"},
{k:"cmd",c:"findstr",re:"identificar",b:"Filtra en el log de anonimos las llamadas que quedaron SIN IDENTIFICAR.",h:"findstr \"SIN IDENTIFICAR\" anonimos.log",o:"Cuatro llamadas anonimas en cuarenta anos. Una de ellas salio de dentro del archivo.",s:"findstr \"SIN IDENTIFICAR\" anonimos.log"},
{k:"cmd",c:"sort",re:"\\|",b:"Encadena dos comandos: vuelca el maestro de testigos y pasalo por el ordenador alfabetico en una sola linea.",h:"La barra vertical pasa la salida de un comando al siguiente: type archivo | sort",o:"Lectura y orden en un solo movimiento. Asi trabaja un perito.",s:"type testigos_maestro.csv | sort"},
{k:"cmd",c:"findstr",re:"\\|",b:"Encadena otra vez: vuelca el maestro de testigos y filtra solo las lineas de Kessler.",h:"type testigos_maestro.csv | findstr \"Kessler\"",o:"Dos lineas de un archivo de nueve. El resto es ruido.",s:"type testigos_maestro.csv | findstr \"Kessler\""},
{k:"cd",p:E.slice(0,-1),b:"Sube a la unidad de evidencia: vas a buscar en todos los expedientes a la vez.",h:"cd \\COLD_CASE\\EVIDENCE",o:"Desde aqui se puede peinar el archivo entero.",s:"cd \\COLD_CASE\\EVIDENCE"},
{k:"cmd",c:"findstr",re:"/s",b:"Busca el numero 0392 en todos los registros de llamadas del archivo, entrando en cada subcarpeta.",h:"El modificador /s busca de forma recursiva: findstr /s \"0392\" llamadas.txt",o:"El mismo numero en el 87 y en el 2003. Dieciseis anos de diferencia y nadie los cruzo.",s:"findstr /s \"0392\" llamadas.txt"},
{k:"cmd",c:"findstr",re:"thorne",b:"Repite la busqueda recursiva, ahora con el apellido Thorne en todos los logs de sospechosos.",h:"findstr /s /i \"thorne\" sospechosos.log",o:"Sospechoso en el 94 y vigilante en el 2011. Dos expedientes, un solo hombre.",s:"findstr /s /i \"thorne\" sospechosos.log"},
{k:"cmd",c:"findstr",re:"/s.*alibi",b:"Saca de una sola pasada todas las lineas con ALIBI de los siete expedientes.",h:"findstr /s \"ALIBI\" sospechosos.log",o:"Veintitantas coartadas en cincuenta anos. Casi ninguna se volvio a comprobar.",s:"findstr /s \"ALIBI\" sospechosos.log"},
{k:"cd",p:c03.slice(0,-1),b:"Baja al caso del muelle para rematar el cruce telefonico.",h:"cd C03_MUELLE9",o:"Caso 03-1188, el del numero repetido.",s:"cd C03_MUELLE9"},
{k:"cmd",c:"findstr",re:"0392",b:"Filtra en el registro de llamadas del 2003 todas las que vienen del 0392.",h:"findstr \"0392\" llamadas.txt",o:"Tres llamadas esa noche. La ultima, de nueve segundos, a la una y media.",s:"findstr \"0392\" llamadas.txt"},
{k:"cmd",c:"findstr",re:"/n.*23:",b:"Numera las llamadas de la franja de las once de la noche en el 2003.",h:"findstr /n \"23:\" llamadas.txt",o:"Dos llamadas entre las 23:00 y las 00:00. La horquilla forense empieza a las 23:30.",s:"findstr /n \"23:\" llamadas.txt"},
{k:"cmd",c:"find",re:"/c",b:"Cuenta cuantas lineas del log de sospechosos del muelle mencionan ALIBI.",h:"find /c \"ALIBI\" sospechosos.log",o:"Tres coartadas. Una desmentida por el capataz del puerto.",s:"find /c \"ALIBI\" sospechosos.log"},
{k:"cmd",c:"find",re:"\\|.*\\/c|\\/c.*\\|",b:"Encadena tres pasos: vuelca las llamadas, filtra el 0392 y cuenta cuantas quedan.",h:"type llamadas.txt | findstr \"0392\" | find /c \"0392\"",o:"FASE IV CERRADA. Tres llamadas del mismo numero la noche del crimen, contadas por la maquina.",s:"type llamadas.txt | findstr \"0392\" | find /c \"0392\""}
];

/* ══════════ FASE V · RASTREO DE SENALES ══════════ */
var F5=[
{k:"cd",p:Y.slice(0,-1),b:"La pista digital empieza en la unidad SYSTEM. Ve alli.",h:"cd \\COLD_CASE\\SYSTEM",o:"Si alguien entro en el archivo, esta maquina lo sabe.",s:"cd \\COLD_CASE\\SYSTEM"},
{k:"read",p:Y+"red.cfg",b:"Lee la configuracion de red del archivo para saber que maquinas existen.",h:"type red.cfg",o:"Tres servidores: expedientes, laboratorio y el lector de microfilm.",s:"type red.cfg"},
{k:"cmd",c:"ipconfig",b:"Averigua la direccion de este terminal para dejarla escrita en el acta.",h:"ipconfig muestra la configuracion de red del equipo.",o:"10.14.0.44. Desde aqui se consulto cada expediente de esta noche.",s:"ipconfig"},
{k:"cmd",c:"ipconfig",re:"/all",b:"Pide la version completa, con direccion fisica y servidor DNS.",h:"ipconfig /all",o:"Direccion fisica 00-1A-4C-88-10-2B. Un terminal identificable sin discusion.",s:"ipconfig /all"},
{k:"cmd",c:"ping",re:"10\\.14\\.0\\.7",b:"Comprueba que el servidor de expedientes, 10.14.0.7, sigue respondiendo.",h:"ping 10.14.0.7",o:"Vivo. Es la misma maquina desde la que se oculto el informante en 2009.",s:"ping 10.14.0.7"},
{k:"cmd",c:"ping",re:"10\\.14\\.0\\.21",b:"Comprueba tambien el servidor del laboratorio.",h:"ping 10.14.0.21",o:"El laboratorio responde. Las pruebas pendientes se pueden pedir hoy mismo.",s:"ping 10.14.0.21"},
{k:"cmd",c:"ping",re:"10\\.14\\.0\\.33",b:"Y el lector de microfilm, donde esta el rollo del 74.",h:"ping 10.14.0.33",o:"Tambien en pie. El fotograma perdido sigue perdido, pero el lector funciona.",s:"ping 10.14.0.33"},
{k:"cmd",c:"ping",re:"10\\.14\\.0\\.99",b:"Prueba una direccion que no figura en la configuracion: 10.14.0.99.",h:"ping 10.14.0.99",o:"Cien por cien de paquetes perdidos. Ahi no hay nadie, o ya no.",s:"ping 10.14.0.99"},
{k:"cmd",c:"nslookup",re:"archivo",b:"Pon nombre a las direcciones: consulta a que IP corresponde archivo.sapd.local.",h:"nslookup archivo.sapd.local",o:"10.14.0.7. El nombre y el numero son la misma maquina.",s:"nslookup archivo.sapd.local"},
{k:"cmd",c:"nslookup",re:"10\\.14\\.0\\.33",b:"Haz la consulta al reves: averigua que nombre tiene 10.14.0.33.",h:"nslookup 10.14.0.33",o:"microfilm.sapd.local. Ya puedes citarlo por su nombre en el informe.",s:"nslookup 10.14.0.33"},
{k:"cmd",c:"tracert",re:"10\\.14\\.0\\.33",b:"Sigue el camino que recorren los datos hasta el lector de microfilm.",h:"tracert 10.14.0.33",o:"Tres saltos. Todo pasa por el conmutador del archivo.",s:"tracert 10.14.0.33"},
{k:"cmd",c:"tracert",re:"10\\.14\\.0\\.7",b:"Traza tambien la ruta hasta el servidor de expedientes.",h:"tracert 10.14.0.7",o:"Mismo camino. Quien oculto los archivos estaba dentro de esta red.",s:"tracert 10.14.0.7"},
{k:"cmd",c:"netstat",b:"Lista las conexiones de red abiertas ahora mismo en el terminal.",h:"netstat -an muestra conexiones y puertos.",o:"Un puerto 4444 a la escucha sin servicio declarado. Eso no deberia estar ahi.",s:"netstat -an"},
{k:"cmd",c:"arp",b:"Saca la tabla de direcciones fisicas de la red local.",h:"arp -a",o:"Cuatro equipos censados. Ninguno explica el puerto 4444.",s:"arp -a"},
{k:"cmd",c:"hostname",b:"Anota el nombre de este terminal para el pie del informe.",h:"hostname",o:"ARCHIVO-COLDCASE-01. Tu puesto tiene nombre propio.",s:"hostname"},
{k:"read",p:Y+"accesos.log",b:"Abre el registro de accesos al servidor de expedientes.",h:"type accesos.log",o:"Cinco entradas en treinta anos. Dos de ellas no deberian existir.",s:"type accesos.log"},
{k:"cmd",c:"findstr",re:"anonima",b:"Filtra en el registro las sesiones anonimas.",h:"findstr \"ANONIMA\" accesos.log",o:"Dos sesiones anonimas la misma madrugada de 2009, con dos minutos de diferencia.",s:"findstr \"ANONIMA\" accesos.log"},
{k:"cmd",c:"findstr",re:"10\\.14\\.0\\.7",b:"Busca en el registro todas las lineas que mencionan el servidor 10.14.0.7.",h:"findstr \"10.14.0.7\" accesos.log",o:"Toda la actividad sospechosa pasa por la misma maquina.",s:"findstr \"10.14.0.7\" accesos.log"},
{k:"cmd",c:"findstr",re:"1996",b:"Busca ahora las entradas de 1996, el ano de la purga.",h:"findstr \"1996\" accesos.log",o:"Una sesion de administrador a las 02:11 con la autorizacion ilegible.",s:"findstr \"1996\" accesos.log"},
{k:"read",p:Y+"usuarios.txt",b:"Consulta la lista de usuarios del terminal.",h:"type usuarios.txt",o:"Cuatro cuentas. Una suspendida y otra que no esta registrada en ninguna parte.",s:"type usuarios.txt"},
{k:"cmd",c:"findstr",re:"suspendido",b:"Filtra la cuenta suspendida.",h:"findstr /i \"suspendido\" usuarios.txt",o:"admin_archivo, alta en 1987 y ultimo acceso en 1996. Justo el ano de la purga.",s:"findstr /i \"suspendido\" usuarios.txt"},
{k:"cmd",c:"findstr",re:"registrado",b:"Filtra la cuenta que aparece como NO REGISTRADO.",h:"findstr \"NO REGISTRADO\" usuarios.txt",o:"La cuenta anonima de 2009 nunca existio oficialmente. Alguien la creo y la borro.",s:"findstr \"NO REGISTRADO\" usuarios.txt"},
{k:"cd",p:T.slice(0,-1),b:"Cruza la pista con la unidad de testigos: ve a WITNESS.",h:"cd \\COLD_CASE\\WITNESS",o:"Las llamadas anonimas tambien dejan direccion.",s:"cd \\COLD_CASE\\WITNESS"},
{k:"cmd",c:"findstr",re:"10\\.14\\.0\\.7",b:"Busca la direccion 10.14.0.7 en el log de llamadas anonimas.",h:"findstr \"10.14.0.7\" anonimos.log",o:"La llamada anonima de 2009 sobre el caso del muelle salio de dentro del propio archivo.",s:"findstr \"10.14.0.7\" anonimos.log"},
{k:"cmd",c:"ping",re:"10\\.14\\.0\\.1",b:"Cierra el rastreo comprobando la puerta de enlace, 10.14.0.1.",h:"ping 10.14.0.1",o:"FASE V CERRADA. La red esta entera y la llamada anonima venia de casa.",s:"ping 10.14.0.1"}
];

/* ══════════ FASE VI · AUDITORIA DEL TERMINAL ══════════ */
var F6=[
{k:"cmd",c:"systeminfo",b:"Acredita el estado del terminal en el momento de reabrir los casos.",h:"systeminfo",o:"Instalado en febrero de 1987. Esta maquina es mas vieja que algunos expedientes.",s:"systeminfo"},
{k:"cmd",c:"whoami",b:"Firma la sesion: comprueba con que usuario estas trabajando.",h:"whoami",o:"sapd\\analista_datos. Cada movimiento de esta noche lleva tu nombre.",s:"whoami"},
{k:"cmd",c:"ver",b:"Deja constancia de la version exacta del sistema.",h:"ver",o:"Version anotada. La cadena de custodia digital tambien se documenta.",s:"ver"},
{k:"cmd",c:"date",b:"Fecha la reapertura de los expedientes con la fecha de la maquina.",h:"date",o:"06/10/2026. La fecha oficial de reapertura.",s:"date"},
{k:"cmd",c:"time",b:"Anota tambien la hora exacta.",h:"time",o:"22:54. Queda escrito a que hora empezo todo esto.",s:"time"},
{k:"cmd",c:"vol",b:"Identifica el volumen del que salen las copias que vas a entregar.",h:"vol",o:"COLD_CASE, serie 1987-4F2A. Trazabilidad completa.",s:"vol"},
{k:"cmd",c:"set",b:"Muestra las variables de entorno: diran donde estaba configurado cada deposito.",h:"set",o:"Una variable llamada PURGA_1996 con el valor AUTORIZACION_ILEGIBLE. La maquina lo lleva escrito en la frente.",s:"set"},
{k:"cmd",c:"path",b:"Comprueba desde que rutas ejecuta programas este terminal.",h:"path",o:"Hay una carpeta C:\\NIGHTSCAN que no figura en el inventario de software.",s:"path"},
{k:"cmd",c:"chkdsk",b:"Comprueba el estado fisico del volumen: explicara por que falta material de 1974.",h:"chkdsk",o:"Sectores defectuosos que afectan a tres fotogramas del rollo del 74. Perdidos para siempre.",s:"chkdsk"},
{k:"cmd",c:"tasklist",b:"Lista los procesos en ejecucion y busca algo que no deberia estar corriendo.",h:"tasklist",o:"NIGHTSCAN.EXE, PID 402, sin firma, activo desde 2009.",s:"tasklist"},
{k:"kill",c:"taskkill",pid:402,b:"Detén el proceso sin firma usando su identificador, el PID 402.",h:"taskkill /pid 402",o:"Proceso finalizado. Ya no volvera a ocultar nada a las 04:44.",s:"taskkill /pid 402"},
{k:"kill",c:"tasklist",pid:402,b:"Vuelve a listar los procesos para confirmar que NIGHTSCAN ya no esta.",h:"tasklist",o:"Seis procesos limpios. El archivo respira por primera vez desde 2009.",s:"tasklist"},
{k:"cd",p:Y+"BACKUP",b:"Audita las copias de seguridad: ve a la carpeta BACKUP de SYSTEM.",h:"cd \\COLD_CASE\\SYSTEM\\BACKUP",o:"Dos cintas con las dos fechas sospechosas del archivo.",s:"cd \\COLD_CASE\\SYSTEM\\BACKUP"},
{k:"cmd",c:"dir",at:Y+"BACKUP",b:"Lista el contenido de la carpeta de copias.",h:"dir",o:"cinta_1996, cinta_2009 y un indice. Las dos manipulaciones tienen respaldo.",s:"dir"},
{k:"read",p:Y+"BACKUP\\indice_backup.txt",b:"Lee el indice que describe que contiene cada cinta.",h:"type indice_backup.txt",o:"La cinta del 96 guarda las evidencias retiradas en la purga. Existen todavia.",s:"type indice_backup.txt"},
{k:"cmd",c:"where",re:"bak",b:"Busca en todo el archivo cualquier copia de seguridad, esten donde esten.",h:"where localiza archivos por patron: where *.bak",o:"Solo dos cintas en todo el sistema. Ambas en la misma carpeta.",s:"where *.bak"},
{k:"cd",p:A.slice(0,-1),b:"Ve al archivo central para auditar la purga de 1996.",h:"cd \\COLD_CASE\\ARCHIVE",o:"El documento que la unidad nunca quiso releer.",s:"cd \\COLD_CASE\\ARCHIVE"},
{k:"read",p:A+"purga_1996.log",b:"Lee el registro completo de la purga de 1996.",h:"type purga_1996.log",o:"Retiraron la cinta de audio del 94 y el boton del 81. Dos pruebas de dos casos abiertos.",s:"type purga_1996.log"},
{k:"cmd",c:"findstr",re:"ilegible",b:"Filtra la linea que habla de la firma de autorizacion.",h:"findstr \"ILEGIBLE\" purga_1996.log",o:"Autorizacion ilegible. Nadie firmo la retirada de dos pruebas.",s:"findstr \"ILEGIBLE\" purga_1996.log"},
{k:"cmd",c:"findstr",re:"retirada",b:"Filtra todas las lineas de retirada de evidencias.",h:"findstr /i \"retirada\" purga_1996.log",o:"Dos retiradas el mismo dia, con cuarenta minutos de diferencia.",s:"findstr /i \"retirada\" purga_1996.log"},
{k:"read",p:A+"casos_cerrados.txt",b:"Consulta los casos que si se cerraron, para comparar.",h:"type casos_cerrados.txt",o:"Tres cerrados: confesion, sentencia y un acusado muerto. Ninguno por trabajo de archivo.",s:"type casos_cerrados.txt"},
{k:"cmd",c:"attrib",re:"^\\s*attrib\\s*$",b:"Audita los atributos de todos los archivos de esta carpeta de una sola pasada.",h:"attrib sin argumentos lista los atributos de la carpeta actual.",o:"Nada oculto aqui. El archivo central esta limpio.",s:"attrib"},
{k:"cmd",c:"where",re:"log",b:"Localiza todos los registros .log que existen en el archivo.",h:"where *.log",o:"Logs de sospechosos, de accesos, de anonimos y de alarma. El rastro completo.",s:"where *.log"},
{k:"cmd",c:"where",re:"rollo",b:"Busca todos los rollos de microfilm por patron de nombre.",h:"where rollo_*.txt",o:"Dos rollos. Solo dos de los siete casos se microfilmaron.",s:"where rollo_*.txt"},
{k:"cd",p:A+"MICROFILM",b:"Entra en la carpeta de microfilm para cerrar la auditoria.",h:"cd MICROFILM",o:"FASE VI CERRADA. El terminal esta auditado y la tarea oculta, detenida.",s:"cd MICROFILM"}
];

/* ══════════ FASE VII · RECONSTRUCCION DEL CASO ══════════ */
var F7=[
{k:"cd",p:W.slice(0,-1),b:"Hora de montar el informe. Vuelve a tu area de trabajo.",h:"cd \\COLD_CASE\\WORKSPACE",o:"Mesa despejada y tres carpetas de caso esperando.",s:"cd \\COLD_CASE\\WORKSPACE"},
{k:"file",p:W+"listado.txt",b:"Convierte el listado de tu area en un documento: manda la salida de dir en formato breve al archivo listado.txt.",h:"El simbolo > redirige la salida a un archivo: dir /b > listado.txt",o:"Una consulta convertida en documento. Asi nace un anexo.",s:"dir /b > listado.txt"},
{k:"read",p:W+"listado.txt",b:"Comprueba que el documento se escribio bien.",h:"type listado.txt",o:"Ahi esta, con el contenido exacto que salio por pantalla.",s:"type listado.txt"},
{k:"file",p:W+"informe.txt",fre:"INFORME FINAL",b:"Abre el informe final escribiendo su encabezado: INFORME FINAL 1142 en el archivo informe.txt.",h:"echo <texto> > informe.txt escribe esa linea en el archivo.",o:"Informe abierto. Lleva tu numero de placa.",s:"echo INFORME FINAL 1142 > informe.txt"},
{k:"file",p:W+"informe.txt",fre:"87-4412",b:"Anade al informe, sin borrar lo anterior, la linea CASO 87-4412 REABIERTO.",h:"El doble simbolo >> anade al final en vez de sustituir.",o:"Primer caso en el informe. El de la operadora de Echo Park.",s:"echo CASO 87-4412 REABIERTO >> informe.txt"},
{k:"file",p:W+"informe.txt",fre:"94-0770",b:"Anade ahora la linea CASO 94-0770 REABIERTO.",h:"Usa de nuevo >> para no perder la linea anterior.",o:"Segundo caso. El de la fibra azul que nadie comparo.",s:"echo CASO 94-0770 REABIERTO >> informe.txt"},
{k:"file",p:W+"informe.txt",fre:"03-1188",b:"Y la linea CASO 03-1188 REABIERTO.",h:"echo CASO 03-1188 REABIERTO >> informe.txt",o:"Tercer caso. El del fichaje alterado a mano.",s:"echo CASO 03-1188 REABIERTO >> informe.txt"},
{k:"read",p:W+"informe.txt",b:"Lee el informe para comprobar que las cuatro lineas estan en orden.",h:"type informe.txt",o:"Cuatro lineas que valen cincuenta anos de espera.",s:"type informe.txt"},
{k:"file",p:W+"alibis_87.txt",fre:"ALIBI",b:"Genera un anexo de coartadas del 87: vuelca su log de sospechosos, filtra ALIBI y guarda el resultado en alibis_87.txt.",h:"Puedes encadenar y redirigir a la vez: type <archivo> | findstr \"ALIBI\" > alibis_87.txt",o:"Anexo generado sin escribir una sola linea a mano.",s:"type \\COLD_CASE\\EVIDENCE\\C87_ECHO\\sospechosos.log | findstr \"ALIBI\" > alibis_87.txt"},
{k:"read",p:W+"alibis_87.txt",b:"Revisa el anexo que acabas de generar.",h:"type alibis_87.txt",o:"Cuatro coartadas del 87, aisladas del resto del expediente.",s:"type alibis_87.txt"},
{k:"file",p:W+"alibis_94.txt",fre:"ALIBI",b:"Repite la operacion con el caso del 94 y guardalo como alibis_94.txt.",h:"Mismo encadenado, cambiando el expediente de origen.",o:"Segundo anexo. El guardia de seguridad vuelve a quedar sin coartada.",s:"type \\COLD_CASE\\EVIDENCE\\C94_MULHOLLAND\\sospechosos.log | findstr \"ALIBI\" > alibis_94.txt"},
{k:"file",p:W+"alibis_03.txt",fre:"ALIBI",b:"Y con el caso del muelle: genera alibis_03.txt.",h:"type ...\\C03_MUELLE9\\sospechosos.log | findstr \"ALIBI\" > alibis_03.txt",o:"Tres anexos, tres casos, una sola linea de comando cada uno.",s:"type \\COLD_CASE\\EVIDENCE\\C03_MUELLE9\\sospechosos.log | findstr \"ALIBI\" > alibis_03.txt"},
{k:"exists",c:"copy",p:W+"INFORMES\\alibis_87.txt",b:"Archiva una copia del anexo del 87 en tu carpeta INFORMES.",h:"copy alibis_87.txt INFORMES",o:"Copia archivada. El original se queda en la mesa para seguir trabajando.",s:"copy alibis_87.txt INFORMES"},
{k:"file",p:W+"testigos_ordenados.txt",fre:"Kessler",b:"Genera el anexo de testigos: vuelca el maestro de testigos, ordenalo y guardalo como testigos_ordenados.txt.",h:"type <archivo> | sort > testigos_ordenados.txt",o:"Los nombres repetidos quedan uno al lado del otro. El cruce salta a la vista.",s:"type \\COLD_CASE\\WITNESS\\testigos_maestro.csv | sort > testigos_ordenados.txt"},
{k:"read",p:W+"testigos_ordenados.txt",b:"Lee el anexo de testigos ordenado.",h:"type testigos_ordenados.txt",o:"Kessler, Mansur y Thorne, cada uno con sus dos casos pegados.",s:"type testigos_ordenados.txt"},
{k:"file",p:W+"pendientes_lab.txt",fre:"PENDIENTE",b:"Genera el anexo del laboratorio: filtra las peticiones PENDIENTE de la cola y guardalas en pendientes_lab.txt.",h:"type \\COLD_CASE\\LAB\\cola_laboratorio.txt | findstr \"PENDIENTE\" > pendientes_lab.txt",o:"La lista de lo que se puede resolver manana si alguien firma la orden.",s:"type \\COLD_CASE\\LAB\\cola_laboratorio.txt | findstr \"PENDIENTE\" > pendientes_lab.txt"},
{k:"read",p:W+"pendientes_lab.txt",b:"Revisa el anexo del laboratorio.",h:"type pendientes_lab.txt",o:"Cuatro pruebas. Cuatro oportunidades que llevan decadas en una estanteria.",s:"type pendientes_lab.txt"},
{k:"cmd",c:"findstr",re:"/c:",b:"Busca a Kessler en el anexo de testigos usando la forma explicita del patron de busqueda.",h:"findstr /c:\"Kessler\" testigos_ordenados.txt busca el texto literal.",o:"Dos lineas. El taxista que desaparecio en 1983 esta en dos expedientes.",s:"findstr /c:\"Kessler\" testigos_ordenados.txt"},
{k:"exists",c:"mkdir",p:W+"CIERRE",b:"Crea la carpeta CIERRE, donde iran los documentos definitivos.",h:"mkdir CIERRE",o:"La ultima carpeta de esta noche.",s:"mkdir CIERRE"},
{k:"moved",c:"move",p:W+"CIERRE\\informe.txt",q:W+"informe.txt",b:"Mueve el informe final a la carpeta CIERRE.",h:"move informe.txt CIERRE",o:"El informe ya esta donde tiene que estar.",s:"move informe.txt CIERRE"},
{k:"moved",c:"move",p:W+"CIERRE\\alibis_87.txt",q:W+"alibis_87.txt",b:"Mueve tambien el anexo de coartadas del 87. Recuerda que guardaste una copia en INFORMES.",h:"move alibis_87.txt CIERRE",o:"Original en CIERRE y copia en INFORMES. Asi se protege un documento.",s:"move alibis_87.txt CIERRE"},
{k:"exists",c:"copy",p:W+"CIERRE\\listado.txt",b:"Copia el listado del area de trabajo dentro de CIERRE, conservando el de la mesa.",h:"copy listado.txt CIERRE",o:"Anexo de inventario copiado.",s:"copy listado.txt CIERRE"},
{k:"cd",p:W+"CIERRE",b:"Entra en la carpeta CIERRE.",h:"cd CIERRE",o:"Tres documentos definitivos sobre la mesa.",s:"cd CIERRE"},
{k:"cmd",c:"dir",at:W+"CIERRE",b:"Lista lo que contiene la carpeta de cierre.",h:"dir",o:"Informe, coartadas y listado. El expediente de entrega.",s:"dir"},
{k:"cmd",c:"fc",b:"Demuestra que el informe y el listado no son el mismo documento: comparalos.",h:"fc informe.txt listado.txt",o:"Diferencias en todas las lineas. Son dos documentos distintos y queda acreditado.",s:"fc informe.txt listado.txt"},
{k:"file",p:W+"CIERRE\\informe.txt",fre:"REVISADO",b:"Anade al informe la linea REVISADO POR analista_datos.",h:"echo REVISADO POR analista_datos >> informe.txt",o:"Tu firma en el documento.",s:"echo REVISADO POR analista_datos >> informe.txt"},
{k:"file",p:W+"CIERRE\\informe.txt",fre:"NIGHTSCAN",b:"Anade tambien la linea PROCESO NIGHTSCAN DETENIDO, que es el hallazgo del turno.",h:"echo PROCESO NIGHTSCAN DETENIDO >> informe.txt",o:"El hallazgo que nadie esperaba en un archivo de casos frios.",s:"echo PROCESO NIGHTSCAN DETENIDO >> informe.txt"},
{k:"read",p:W+"CIERRE\\informe.txt",b:"Lee el informe completo antes de cerrar.",h:"type informe.txt",o:"Seis lineas. Tres casos reabiertos y una tarea oculta detenida.",s:"type informe.txt"},
{k:"cmd",c:"tree",re:"/f",b:"Dibuja el arbol completo de tu area de trabajo con archivos, como portada de la entrega.",h:"tree \\COLD_CASE\\WORKSPACE /f",o:"Toda tu noche de trabajo en una sola pantalla.",s:"tree \\COLD_CASE\\WORKSPACE /f"},
{k:"file",p:W+"CIERRE\\acta_final.txt",fre:"ARCHIVO",b:"Cierra el turno creando el acta: escribe ARCHIVO REVISADO 06-10-2026 en el archivo acta_final.txt.",h:"echo ARCHIVO REVISADO 06-10-2026 > acta_final.txt",o:"ACTA FIRMADA. Siete expedientes revisados, tres reabiertos y un archivo que vuelve a estar vivo.",s:"echo ARCHIVO REVISADO 06-10-2026 > acta_final.txt"}
];

CC.FASES=[
{n:"I · ACCESO AL ARCHIVO MUERTO",corto:"I ACCESO",art:"expediente",ex:F1,
 d:"Nadie entra en el archivo con un mapa. Antes de leer una sola autopsia tienes que aprender a moverte a oscuras entre siete expedientes, el laboratorio, los testigos y las tripas del sistema."},
{n:"II · APERTURA DE EXPEDIENTES",corto:"II LECTURA",art:"cinta",ex:F2,
 d:"Cada carpeta guarda perfiles, cronologias, llamadas y notas que llevan decadas sin abrirse. Leer es la parte lenta del oficio: aqui descubres quien era cada victima y que se dejo a medias."},
{n:"III · CADENA DE CUSTODIA",corto:"III CUSTODIA",art:"evidencia",ex:F3,
 d:"Un perito nunca trabaja sobre el original. Vas a montar tu propio expediente a base de copias, nombres correctos y carpetas limpias, y de paso destaparas lo que alguien oculto en 2009."},
{n:"IV · PERITAJE DE DATOS",corto:"IV PERITAJE",art:"huella",ex:F4,
 d:"Cincuenta anos de papeles caben en unos pocos filtros bien escritos. Aqui separas las cuatro lineas que importan de las cuatrocientas que no, y los nombres empiezan a repetirse entre expedientes."},
{n:"V · RASTREO DE SENALES",corto:"V RASTREO",art:"antena",ex:F5,
 d:"El archivo esta conectado a una red pequena y vieja. Siguiendo direcciones, trazas y registros de acceso averiguaras desde que maquina se manipulo la evidencia, y la respuesta esta mas cerca de lo que te gustaria."},
{n:"VI · AUDITORIA DEL TERMINAL",corto:"VI AUDITORIA",art:"placa",ex:F6,
 d:"La maquina tambien declara. Procesos, variables, rutas, sectores danados y copias de seguridad cuentan la historia de la purga de 1996 y de la tarea que lleva desde 2009 escondiendo documentos."},
{n:"VII · RECONSTRUCCION DEL CASO",corto:"VII CIERRE",art:"cerrado",ex:F7,
 d:"Un hallazgo que no se escribe no existe. Encadenando comandos y redirigiendo su salida vas a fabricar los anexos, montar el informe final y firmar el acta que devuelve tres expedientes a la vida."}
];

CC.EX=[];
CC.FASES.forEach(function(f,i){
  f.ex.forEach(function(e){e.f=i;CC.EX.push(e);});
});

})();
