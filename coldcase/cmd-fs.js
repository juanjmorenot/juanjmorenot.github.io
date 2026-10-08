/* ═══════════════════════════════════════════════════════════════
   COLD CASE DATABASE · Archivo virtual
   Genera el sistema de archivos completo de la unidad de casos
   no resueltos a partir de las fichas de los siete expedientes.
   ═══════════════════════════════════════════════════════════════ */
var CC = window.CC || {};
window.CC = CC;

(function(){
"use strict";

function D(children,opts){var n={type:"dir",children:children||{},date:"01/01/1990  00:00"};if(opts)for(var k in opts)n[k]=opts[k];return n;}
function F(content,opts){var n={type:"file",content:content,date:"01/01/1990  00:00"};if(opts)for(var k in opts)n[k]=opts[k];return n;}
CC.D=D;CC.F=F;

/* ─────────── Fichas de los expedientes ─────────── */
var CASOS=[
{id:"74-0098",dir:"C74_GRIFFITH",nom:"El silbido de Griffith Park",ano:1974,fecha:"09/05/1974",
 lugar:"Griffith Park, sendero del observatorio",vic:"Dorothy Ulmer",edad:22,
 causa:"estrangulamiento",hora:"21:40-22:15",forense:"Dr. A. Petrosian",estado:"ABIERTO",
 detective:"det. R. Halloran",
 sos:[["L. Mansur","CONFIRMADO","cena familiar, cuatro testigos"],
      ["G. Petrakis","NO VERIFICABLE","dice que silbaba solo en el sendero"],
      ["T. Abernathy","DESCARTADO","hospitalizado esa semana"]],
 ev:[["EV-01","silbato de metal","09/05/1974","LAB-1","SELLADA"],
     ["EV-02","bufanda de lana","09/05/1974","LAB-1","SELLADA"],
     ["EV-03","molde de huella de bota","10/05/1974","ARCHIVO","DEGRADADA"]],
 tel:[["20:12","213-555-0144","entrante","00:02:30"],
      ["21:05","213-555-0144","entrante","00:00:48"],
      ["21:52","cabina Vermont Ave","saliente","00:01:12"]],
 nota:"Un testigo oyo un silbido repetido antes del grito. Nadie lo anoto hasta 1979."},

{id:"81-0455",dir:"C81_BUNKER",nom:"La escalera de Bunker Hill",ano:1981,fecha:"22/11/1981",
 lugar:"Escaleras de Angels Flight, Bunker Hill",vic:"Samuel Pike",edad:53,
 causa:"traumatismo craneal por caida provocada",hora:"01:20-01:50",forense:"Dra. M. Oyelowo",estado:"ABIERTO",
 detective:"det. C. Vasquez",
 sos:[["H. Brummel","NO VERIFICABLE","cobrador de deudas de la victima"],
      ["P. Sandoval","CONFIRMADO","turno completo en el funicular"],
      ["R. Kessler","SIN DECLARAR","taxista, ilocalizable desde 1983"]],
 ev:[["EV-01","maletin forzado","22/11/1981","LAB-2","SELLADA"],
     ["EV-02","pagare manuscrito","22/11/1981","LAB-2","SELLADA"],
     ["EV-03","boton de abrigo","23/11/1981","LAB-2","EXTRAVIADA 1990"]],
 tel:[["00:41","213-555-7710","saliente","00:06:02"],
      ["01:02","213-555-7710","saliente","00:00:21"],
      ["01:55","desconocido","entrante","00:00:04"]],
 nota:"El pagare lleva una firma que el grafologo nunca pudo cotejar."},

{id:"87-4412",dir:"C87_ECHO",nom:"La operadora de Echo Park",ano:1987,fecha:"12/03/1987",
 lugar:"Echo Park, junto al estanque",vic:"Marguerite Vance",edad:29,
 causa:"ahogamiento con signos de forcejeo",hora:"03:40-04:12",forense:"Dr. A. Petrosian",estado:"ABIERTO",
 detective:"det. R. Halloran",
 sos:[["H. Delgado","CONFIRMADO","portero nocturno, libro de firmas"],
      ["R. Kessler","SIN DECLARAR","taxista, mismo nombre que en 81-0455"],
      ["A. Mori","CONFIRMADO","vecina del 3B, llamo a emergencias"],
      ["DESCONOCIDO","SIN IDENTIFICAR","llamada anonima desde cabina de Sunset"]],
 ev:[["EV-01","reloj parado a las 03:55","12/03/1987","LAB-1","SELLADA"],
     ["EV-02","ficha de centralita","12/03/1987","LAB-1","SELLADA"],
     ["EV-03","zapato izquierdo","12/03/1987","LAB-1","SELLADA"]],
 tel:[["23:40","cabina Sunset Blvd","saliente","00:03:19"],
      ["02:10","213-555-0392","entrante","00:11:40"],
      ["03:58","emergencias","saliente","00:02:02"]],
 nota:"El reloj se paro a las 03:55 y el forense fija la muerte despues. Alguien movio la hora."},

{id:"94-0770",dir:"C94_MULHOLLAND",nom:"El turno de Mulholland",ano:1994,fecha:"08/08/1994",
 lugar:"Mirador de Mulholland Drive",vic:"Thomas Reyes",edad:41,
 causa:"asfixia mecanica",hora:"02:10-02:40",forense:"Dra. I. Bannon",estado:"ABIERTO",
 detective:"det. C. Vasquez",
 sos:[["V. Oyelaran","CONFIRMADO","dos testigos en el bar"],
      ["D. Kaminski","SIN DECLARAR","sin declaracion registrada"],
      ["E. Thorne","NO VERIFICABLE","guardia de seguridad, turno de noche"],
      ["M. Okafor","CONFIRMADO","vuelo a Portland, tarjeta de embarque"]],
 ev:[["EV-01","fibra textil azul","08/08/1994","LAB-2","SELLADA"],
     ["EV-02","reloj de pulsera","08/08/1994","LAB-2","SELLADA"],
     ["EV-03","cinta de audio","09/08/1994","ARCHIVO","EXTRAVIADA 1996"]],
 tel:[["01:34","818-555-4001","entrante","00:00:52"],
      ["02:02","desconocido","entrante","00:00:06"],
      ["02:48","818-555-4001","saliente","00:02:11"]],
 nota:"La fibra azul coincide con el uniforme de seguridad. Nadie pidio la comparacion."},

{id:"99-2310",dir:"C99_SILVERLAKE",nom:"La cinta de Silver Lake",ano:1999,fecha:"03/02/1999",
 lugar:"Estudio de grabacion, Silver Lake",vic:"Nadia Brun",edad:26,
 causa:"intoxicacion por sedante, administracion forzada",hora:"23:00-01:00",forense:"Dra. I. Bannon",estado:"ABIERTO",
 detective:"det. S. Oduya",
 sos:[["J. Farrow","NO VERIFICABLE","tecnico de sonido, ultimo en salir"],
      ["K. Ibarra","CONFIRMADO","en directo en otra sala"],
      ["L. Mansur","SIN DECLARAR","mismo apellido que en 74-0098"]],
 ev:[["EV-01","cinta DAT sin etiquetar","03/02/1999","LAB-3","SELLADA"],
     ["EV-02","vaso con residuo","03/02/1999","LAB-3","SELLADA"],
     ["EV-03","libro de firmas del estudio","04/02/1999","ARCHIVO","SELLADA"]],
 tel:[["22:50","323-555-8812","entrante","00:01:03"],
      ["00:14","323-555-8812","entrante","00:09:55"],
      ["01:30","desconocido","entrante","00:00:09"]],
 nota:"En la cinta DAT hay 14 segundos de una voz que nadie identifico."},

{id:"03-1188",dir:"C03_MUELLE9",nom:"Muelle 9",ano:2003,fecha:"17/11/2003",
 lugar:"Puerto de Los Angeles, muelle 9",vic:"Victor Alcaraz",edad:38,
 causa:"herida contusa en region occipital",hora:"23:30-00:30",forense:"Dr. N. Achebe",estado:"ABIERTO",
 detective:"det. S. Oduya",
 sos:[["Sujeto A","NO VERIFICABLE","dice que estaba en el cine, sin entrada"],
      ["Sujeto B","CAMBIA VERSION","niega y luego admite una llamada"],
      ["Sujeto C","DESMENTIDO","fichaje del puerto alterado a mano"]],
 ev:[["EV-01","gancho de estiba","17/11/2003","LAB-2","SELLADA"],
     ["EV-02","muestra ADN parcial","18/11/2003","LAB-3","SELLADA"],
     ["EV-03","hoja de fichaje","18/11/2003","LAB-1","ALTERADA"]],
 tel:[["22:41","213-555-0392","entrante","00:04:11"],
      ["23:02","213-555-7710","saliente","00:00:38"],
      ["23:55","213-555-0392","entrante","00:12:06"],
      ["01:30","213-555-0392","entrante","00:00:09"]],
 nota:"El numero 0392 aparece tambien en el expediente del 87. Nadie cruzo los registros."},

{id:"11-0642",dir:"C11_VERDUGO",nom:"El incendio de Verdugo",ano:2011,fecha:"28/06/2011",
 lugar:"Nave industrial, Verdugo Hills",vic:"Helena Ruiz",edad:34,
 causa:"inhalacion de humo, incendio provocado",hora:"04:00-04:45",forense:"Dr. N. Achebe",estado:"ABIERTO",
 detective:"det. S. Oduya",
 sos:[["E. Thorne","NO VERIFICABLE","vigilante de la nave, mismo nombre que en 94-0770"],
      ["W. Castellanos","CONFIRMADO","de guardia en otro recinto"],
      ["Y. Nakamura","SIN DECLARAR","administrador de la nave"]],
 ev:[["EV-01","acelerante en el suelo","28/06/2011","LAB-4","SELLADA"],
     ["EV-02","llave maestra fundida","28/06/2011","LAB-4","SELLADA"],
     ["EV-03","registro de alarma","29/06/2011","SISTEMAS","SELLADA"]],
 tel:[["03:41","818-555-4001","entrante","00:00:33"],
      ["04:02","alarma automatica","saliente","00:00:11"],
      ["04:50","818-555-4001","saliente","00:01:44"]],
 nota:"La alarma se desactivo con una llave maestra dos minutos antes del fuego."}
];
CC.CASOS=CASOS;

/* ─────────── Generador de carpetas de caso ─────────── */
function pad(s,n){s=String(s);return s.length>=n?s:s+" ".repeat(n-s.length);}

function carpetaCaso(c){
  var d=c.fecha.replace(/\//g,"/")+"  06:00";

  var perfil=
"=== PERFIL DE LA VICTIMA · EXPEDIENTE "+c.id+" ===\n"+
"Caso.........: "+c.nom+"\n"+
"Nombre.......: "+c.vic+", "+c.edad+" anos\n"+
"Hallada......: "+c.lugar+", "+c.fecha+"\n"+
"Horquilla....: "+c.hora+"\n"+
"Causa........: "+c.causa+"\n"+
"Forense......: "+c.forense+"\n"+
"Detective....: "+c.detective+"\n"+
"Estado.......: "+c.estado+" · CASO FRIO\n";

  var crono=
"CRONOLOGIA RECONSTRUIDA · "+c.id+"\n"+
"--------------------------------------------------\n"+
c.tel.map(function(t){return t[0]+"  llamada "+t[2]+"  "+t[1];}).join("\n")+"\n"+
"HORQUILLA FORENSE: "+c.hora+"\n"+
"NOTA: "+c.nota+"\n";

  var sosp="LOG DE SOSPECHOSOS · "+c.id+"\n"+
c.sos.map(function(s,i){
  return "["+c.fecha+" "+pad(String(9+i)+":1"+i,5)+"] SOSPECHOSO "+(i+1)+"  "+pad(s[0],16)+" ALIBI "+pad(s[1],14)+" "+s[2];
}).join("\n")+"\n";

  var evid="CODIGO;DESCRIPCION;RECOGIDA;DEPOSITO;ESTADO\n"+
c.ev.map(function(e){return e.join(";");}).join("\n")+"\n";

  var decl="DECLARACIONES FIRMADAS · "+c.id+"\n"+
"--------------------------------------------------\n"+
c.sos.map(function(s,i){
  return "Testigo "+(i+1)+": la COARTADA de "+s[0]+" quedo como "+s[1]+".";
}).join("\n")+"\n"+
"Testigo extra: coartada sin contrastar, nadie volvio a llamarle.\n";

  var llam="REGISTRO DE LLAMADAS · "+c.id+"\n"+
"--------------------------------------------------\n"+
c.tel.map(function(t){return pad(t[0],7)+pad(t[1],22)+pad(t[2],10)+t[3];}).join("\n")+"\n";

  var notas="NOTAS DEL DETECTIVE · "+c.detective+"\n"+
"- "+c.nota+"\n"+
"- Pendiente: recotejo con tecnologia actual.\n"+
"- Pendiente: cruzar testigos con otros expedientes del archivo.\n";

  var lab="PETICIONES AL LABORATORIO · "+c.id+"\n"+
c.ev.map(function(e,i){
  return e[0]+"  "+pad(e[1],26)+(i===0?"PENDIENTE desde "+c.ano:"PROCESADA");
}).join("\n")+"\n";

  var foto1=
"  +--------------------------+\n"+
"  |  "+pad(c.lugar.slice(0,22),22)+"  |\n"+
"  |                          |\n"+
"  |      [X] posicion        |\n"+
"  |        o objeto          |\n"+
"  |   ====== acceso          |\n"+
"  +--------------------------+\n"+
"  [X] cuerpo   o evidencia recuperada\n";

  var kids={
    "perfil.txt":F(perfil,{date:d}),
    "cronologia.txt":F(crono,{date:d}),
    "sospechosos.log":F(sosp,{date:d}),
    "evidencias.csv":F(evid,{date:d}),
    "declaraciones.txt":F(decl,{date:d}),
    "llamadas.txt":F(llam,{date:d}),
    "notas.txt":F(notas,{date:d}),
    "laboratorio.txt":F(lab,{date:d}),
    "FOTOS":D({
      "foto_01.asc":F(foto1,{date:d}),
      "foto_02.asc":F("  (negativo deteriorado, sin recuperar)\n",{date:d})
    },{date:d})
  };
  if(c.extra)for(var k in c.extra)kids[k]=c.extra[k];
  return D(kids,{date:d});
}

/* ─────────── Archivo completo ─────────── */
CC.buildFS=function(){
  var ev={};
  CASOS.forEach(function(c){ev[c.dir]=carpetaCaso(c);});

  /* piezas reservadas que algunos ejercicios destapan */
  ev.C87_ECHO.children["fuente_anonima.txt"]=F(
"*** DOCUMENTO RESERVADO · FUENTE PROTEGIDA ***\n"+
"La llamada anonima de 1987 salio de la cabina de Sunset Blvd.\n"+
"La misma cabina aparece en el expediente 81-0455.\n"+
"Identidad retenida por orden judicial 11-442.\n",{hidden:true,date:"02/06/2009  04:44"});

  ev.C03_MUELLE9.children["informante.txt"]=F(
"*** DOCUMENTO RESERVADO · FUENTE PROTEGIDA ***\n"+
"El informante situa al Sujeto C en el muelle a las 23:50.\n"+
"Confirma que el fichaje del puerto fue alterado a mano.\n"+
"=> CASO 03-1188 LISTO PARA REAPERTURA.\n",{hidden:true,date:"02/06/2009  04:44"});

  ev.C99_SILVERLAKE.children["cinta_dat.log"]=F(
"TRANSCRIPCION PARCIAL · CINTA DAT SIN ETIQUETAR\n"+
"00:00:00  ruido de sala\n"+
"00:00:41  voz 1: apaga eso\n"+
"00:00:55  voz 2 NO IDENTIFICADA: ya esta hecho\n"+
"00:01:09  fin de la grabacion\n",{date:"05/02/1999  10:00"});

  ev.C11_VERDUGO.children["alarma.log"]=F(
"REGISTRO DE ALARMA · NAVE VERDUGO\n"+
"[2011-06-28 03:58] sistema ARMADO\n"+
"[2011-06-28 04:03] DESARMADO con llave maestra 07\n"+
"[2011-06-28 04:07] sensor de humo ACTIVADO\n"+
"[2011-06-28 04:09] linea telefonica CORTADA\n",{date:"29/06/2011  09:00"});

  ev.C74_GRIFFITH.children["microfilm_ref.txt"]=F(
"El expediente 74-0098 solo existe completo en microfilm.\n"+
"Rollo: ARCHIVE\\MICROFILM\\rollo_1974.txt\n",{date:"01/01/1998  00:00"});

  return D({
    "COLD_CASE": D({
      "EVIDENCE": D(ev,{date:"01/01/1990  00:00"}),

      "ARCHIVE": D({
        "indice_maestro.txt":F(
"INDICE MAESTRO DE CASOS FRIOS · ARCHIVO CENTRAL\n"+
"===============================================\n"+
CASOS.map(function(c){return pad(c.id,10)+pad(c.nom,32)+c.ano+"   "+c.estado;}).join("\n")+"\n"+
"77-0021   Griffith Park (otro)            1977   CERRADO 1983\n"+
"-----------------------------------------------\n"+
"Siete expedientes abiertos esperan a un analista.\n",{date:"06/10/2026  08:00"}),
        "casos_cerrados.txt":F(
"CASOS CERRADOS · CONSULTA HISTORICA\n"+
"77-0021  CERRADO 1983  confesion\n"+
"69-0012  CERRADO 1971  sentencia firme\n"+
"88-3301  CERRADO 1992  acusado fallecido\n",{date:"01/01/1995  00:00"}),
        "purga_1996.log":F(
"REGISTRO DE PURGA DE 1996\n"+
"[1996-04-02] retirada cinta de audio EV-03 del caso 94-0770\n"+
"[1996-04-02] retirado boton de abrigo EV-03 del caso 81-0455\n"+
"[1996-04-03] firma de autorizacion ILEGIBLE\n"+
"[1996-04-03] copia de seguridad en BACKUP\\cinta_1996.bak\n",{date:"03/04/1996  18:00"}),
        "MICROFILM":D({
          "rollo_1974.txt":F(
"ROLLO DE MICROFILM 1974 · caso 74-0098\n"+
"Fotograma 12: declaracion de G. Petrakis, pagina 1 de 3\n"+
"Fotograma 13: pagina 2, menciona un silbido repetido\n"+
"Fotograma 14: pagina 3 AUSENTE del rollo\n",{date:"01/01/1980  00:00"}),
          "rollo_1981.txt":F(
"ROLLO DE MICROFILM 1981 · caso 81-0455\n"+
"Fotograma 04: pagare manuscrito, firma sin cotejar\n"+
"Fotograma 05: inventario del maletin forzado\n",{date:"01/01/1985  00:00"})
        },{date:"01/01/1980  00:00"})
      },{date:"01/01/1990  00:00"}),

      "LAB": D({
        "cola_laboratorio.txt":F(
"COLA DEL LABORATORIO · PETICIONES VIVAS\n"+
"EV-01 silbato de metal      74-0098  PENDIENTE desde 1974\n"+
"EV-01 maletin forzado       81-0455  PROCESADA\n"+
"EV-02 ficha de centralita   87-4412  PENDIENTE desde 1987\n"+
"EV-01 fibra textil azul     94-0770  PENDIENTE desde 1994\n"+
"EV-01 cinta DAT             99-2310  PENDIENTE desde 1999\n"+
"EV-02 muestra ADN parcial   03-1188  RECOTEJO SOLICITADO\n"+
"EV-01 acelerante            11-0642  PROCESADA\n",{date:"06/10/2026  08:00"}),
        "adn_cotejos.csv":F(
"MUESTRA;CASO;MARCADORES;CODIS;OBSERVACION\n"+
"A;03-1188;9 de 13;SIN COINCIDENCIA;repetir con tecnologia actual\n"+
"B;03-1188;contaminada;NO APTA;descartada en 2004\n"+
"C;99-2310;13 de 13;SIN COINCIDENCIA;perfil completo sin dueno\n"+
"D;11-0642;6 de 13;SIN COINCIDENCIA;degradada por el fuego\n",{date:"06/10/2026  08:00"}),
        "balistica.txt":F(
"BALISTICA\n"+
"Ningun expediente activo presenta herida por arma de fuego.\n"+
"Archivo de comparacion disponible para consultas externas.\n",{date:"01/01/2005  12:00"}),
        "fibras.txt":F(
"ANALISIS DE FIBRAS\n"+
"94-0770  fibra azul  poliester industrial  COMPATIBLE con uniforme de seguridad\n"+
"74-0098  lana        bufanda de la victima  sin tercera fuente\n"+
"11-0642  sintetica   fundida, no comparable\n",{date:"06/10/2026  08:00"}),
        "toxicologia.txt":F(
"TOXICOLOGIA\n"+
"99-2310  sedante de accion rapida  dosis incompatible con autoadministracion\n"+
"94-0770  sedante leve              compatible con medicacion prescrita\n",{date:"06/10/2026  08:00"})
      },{date:"01/01/2000  00:00"}),

      "WITNESS": D({
        "testigos_maestro.csv":F(
"NOMBRE;CASO;ESTADO;ULTIMO CONTACTO\n"+
"H. Delgado;87-4412;LOCALIZABLE;2019\n"+
"R. Kessler;81-0455;ILOCALIZABLE;1983\n"+
"R. Kessler;87-4412;ILOCALIZABLE;1983\n"+
"A. Mori;87-4412;LOCALIZABLE;2021\n"+
"E. Thorne;94-0770;LOCALIZABLE;2016\n"+
"E. Thorne;11-0642;LOCALIZABLE;2016\n"+
"L. Mansur;74-0098;FALLECIDO;2004\n"+
"L. Mansur;99-2310;LOCALIZABLE;2018\n",{date:"06/10/2026  08:00"}),
        "anonimos.log":F(
"LLAMADAS ANONIMAS RECIBIDAS POR LA UNIDAD\n"+
"[1987-03-12 03:12] cabina Sunset Blvd    caso 87-4412  SIN IDENTIFICAR\n"+
"[1999-02-04 11:40] locutorio Silver Lake caso 99-2310  SIN IDENTIFICAR\n"+
"[2009-06-02 04:44] interna 10.14.0.7     caso 03-1188  SIN IDENTIFICAR\n"+
"[2016-01-18 22:05] movil prepago         caso 94-0770  SIN IDENTIFICAR\n",{date:"06/10/2026  08:00"}),
        "recompensas.txt":F(
"RECOMPENSAS VIGENTES\n"+
"87-4412  50.000 USD  sin reclamar\n"+
"03-1188  25.000 USD  sin reclamar\n",{date:"01/01/2020  00:00"})
      },{date:"01/01/1995  00:00"}),

      "SYSTEM": D({
        "red.cfg":F(
"# Configuracion de red · terminal de archivo\n"+
"HOST_ARCHIVO   = 10.14.0.7     # servidor de expedientes\n"+
"HOST_LAB       = 10.14.0.21    # laboratorio\n"+
"HOST_MICROFILM = 10.14.0.33    # lector de microfilm\n"+
"PUERTA_ENLACE  = 10.14.0.1\n"+
"DNS            = archivo.sapd.local\n",{date:"06/10/2026  08:00"}),
        "accesos.log":F(
"ACCESOS AL SERVIDOR 10.14.0.7\n"+
"[1996-04-03 02:11] sesion ADMIN     purga de evidencias     AUTORIZACION ILEGIBLE\n"+
"[2009-06-02 04:44] sesion ANONIMA   escritura en C03_MUELLE9  ATRIBUTO OCULTO APLICADO\n"+
"[2009-06-02 04:46] sesion ANONIMA   escritura en C87_ECHO     ATRIBUTO OCULTO APLICADO\n"+
"[2016-01-18 22:40] sesion LECTURA   consulta 94-0770\n"+
"[2026-10-06 22:54] sesion ANALISTA  inicio de sesion\n",{date:"06/10/2026  22:54"}),
        "usuarios.txt":F(
"USUARIOS DEL TERMINAL\n"+
"analista_datos   ACTIVO    alta 2026\n"+
"det_oduya        ACTIVO    alta 1998\n"+
"admin_archivo    SUSPENDIDO alta 1987  ultimo acceso 1996\n"+
"anonimo          NO REGISTRADO  aparece en accesos.log de 2009\n",{date:"06/10/2026  08:00"}),
        "nightscan.cfg":F(
"# NIGHTSCAN · tarea sin firma, instalada en 2009\n"+
"OBJETIVO = EVIDENCE\\C03_MUELLE9\n"+
"ACCION   = aplicar atributo oculto\n"+
"HORA     = 04:44\n",{hidden:true,date:"02/06/2009  04:44"}),
        "BACKUP":D({
          "cinta_1996.bak":F("[copia de seguridad de la purga de 1996, formato cinta]\n",{date:"03/04/1996  18:00"}),
          "cinta_2009.bak":F("[copia de seguridad posterior al acceso anonimo]\n",{date:"02/06/2009  05:00"}),
          "indice_backup.txt":F(
"CONTENIDO DE LAS CINTAS\n"+
"cinta_1996.bak  evidencias retiradas en la purga\n"+
"cinta_2009.bak  estado del archivo tras el acceso anonimo\n",{date:"02/06/2009  05:00"})
        },{date:"03/04/1996  18:00"})
      },{date:"01/01/2026  08:00"}),

      "WORKSPACE": D({
        "leeme.txt":F(
"AREA DE TRABAJO DEL ANALISTA\n"+
"Aqui puedes crear, copiar y borrar sin tocar la evidencia original.\n"+
"Todo lo que montes aqui forma parte de tu informe final.\n",{date:"06/10/2026  22:54"}),
        "TEMP":D({
          "borrador.tmp":F("[borrador vacio de una sesion anterior]\n",{date:"01/01/2024  00:00"}),
          "cache.tmp":F("[cache del visor de microfilm]\n",{date:"01/01/2024  00:00"})
        },{date:"01/01/2024  00:00"})
      },{date:"06/10/2026  22:54"})
    },{date:"01/01/1990  00:00"})
  },{date:"01/01/1990  00:00"});
};

/* ─────────── Procesos del terminal (tasklist / taskkill) ─────────── */
CC.buildProcs=function(){
  return [
    {img:"SYSTEM",pid:4,mem:"40 KB",nota:""},
    {img:"ARCHIVE.EXE",pid:128,mem:"912 KB",nota:""},
    {img:"CODIS_QUERY.EXE",pid:204,mem:"1.204 KB",nota:""},
    {img:"EVIDENCE_IDX.EXE",pid:311,mem:"688 KB",nota:""},
    {img:"MICROFILM.EXE",pid:356,mem:"420 KB",nota:""},
    {img:"NIGHTSCAN.EXE",pid:402,mem:"96 KB",nota:"sin firma, activo desde 2009"},
    {img:"TERMINAL.COM",pid:551,mem:"204 KB",nota:""}
  ];
};

/* ─────────── Arte ASCII ─────────── */
CC.ART={
expediente:[
"      ______________",
"     /             /|",
"    /____________ / |",
"   |  EXPEDIENTE |  |",
"   |   ARCHIVADO |  /",
"   |_____________| /",
"   |_____________|/"
].join("\n"),
evidencia:[
"    .-------------------.",
"    |  BOLSA SELLADA    |",
"    |   [ EV-01 ]       |",
"    |   ~~~~~~~~~~      |",
"    '-------------------'"
].join("\n"),
placa:[
"        .-\"\"\"\"\"\"-.",
"       / .------. \\",
"      | |  SAPD  | |",
"      | | 1 1 4 2| |",
"       \\ '------' /",
"        '-......-'"
].join("\n"),
huella:[
"      .-~~~~~~~-.",
"     / .-~~~~~-. \\",
"    | / .-~~~-. \\ |",
"    | | ( (o) ) | |",
"    | \\ '-~~~-' / |",
"     \\ '-~~~~~-' /",
"      '-~~~~~~~-'"
].join("\n"),
cinta:[
"    .---------------------.",
"    | (O)           (O)   |",
"    |   ===============   |",
"    '---------------------'"
].join("\n"),
antena:[
"         |",
"      \\  |  /",
"       \\ | /",
"   -----[o]-----",
"         |",
"        / \\"
].join("\n"),
cerrado:[
"    ____________________",
"   |  CASO DESCLASIFI-  |",
"   |      C A D O       |",
"   |   sello  1142      |",
"   |____________________|"
].join("\n")
};

})();
