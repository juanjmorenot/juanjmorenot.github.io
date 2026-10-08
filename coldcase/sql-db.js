/* ═══════════════════════════════════════════════════════════════
   COLDBASE · Esquema y datos
   Division de Analisis Criminal · South Angeles Police Department
   ═══════════════════════════════════════════════════════════════ */
var CDB = window.CDB || {};
window.CDB = CDB;

(function(){
"use strict";

function T(name,desc,cols,types,notas,rows){
  return {name:name,desc:desc,cols:cols,types:types,notas:notas,rows:rows};
}

var TABLES={};
function add(t){TABLES[t.name]=t;}

/* ─────────── detectives ─────────── */
add(T("detectives","Agentes que instruyeron o heredaron cada expediente.",
["detective_id","nombre","placa","division","fecha_alta","fecha_baja"],
["integer","text","integer","text","date","date"],
["clave primaria","apellido del agente","numero de placa","unidad a la que pertenece","alta en el cuerpo","baja; NULL si sigue en activo"],
[
[1,"R. Halloran",1142,"Homicidios","1968-03-01","1993-06-30"],
[2,"C. Vasquez",2207,"Homicidios","1977-09-15","2001-12-31"],
[3,"S. Oduya",3391,"Casos Frios","1998-04-20",null],
[4,"M. Ferreira",4120,"Casos Frios","2015-01-12",null],
[5,"T. Okonjo",5008,"Analisis Criminal","2024-02-01",null]
]));

/* ─────────── casos ─────────── */
add(T("casos","Los siete expedientes no resueltos que custodia la division.",
["caso_id","codigo","titulo","anio","fecha_hecho","distrito","estado","detective_id","prioridad"],
["integer","text","text","integer","date","text","text","integer","text"],
["clave primaria","codigo oficial del expediente","nombre interno del caso","ano del hecho","fecha del hecho","distrito policial","ABIERTO / CERRADO","detective responsable (FK)","ALTA / MEDIA / BAJA"],
[
[1,"74-0098","El silbido de Griffith Park",1974,"1974-05-09","Griffith Park","ABIERTO",1,"ALTA"],
[2,"81-0455","La escalera de Bunker Hill",1981,"1981-11-22","Bunker Hill","ABIERTO",2,"MEDIA"],
[3,"87-4412","La operadora de Echo Park",1987,"1987-03-12","Echo Park","ABIERTO",1,"ALTA"],
[4,"94-0770","El turno de Mulholland",1994,"1994-08-08","Mulholland","ABIERTO",2,"ALTA"],
[5,"99-2310","La cinta de Silver Lake",1999,"1999-02-03","Silver Lake","ABIERTO",3,"MEDIA"],
[6,"03-1188","Muelle 9",2003,"2003-11-17","Puerto","ABIERTO",3,"ALTA"],
[7,"11-0642","El incendio de Verdugo",2011,"2011-06-28","Verdugo Hills","ABIERTO",4,"MEDIA"]
]));

/* ─────────── personas ─────────── */
add(T("personas","Censo unico de personas citadas en el archivo. La misma persona puede aparecer en varios expedientes.",
["persona_id","nombre","alias","ocupacion","nacimiento","estado_localizacion","ultimo_contacto"],
["integer","text","text","text","date","text","date"],
["clave primaria","nombre registrado","apodo; NULL si no consta","profesion declarada","fecha de nacimiento","LOCALIZABLE / ILOCALIZABLE / FALLECIDO","ultima vez que la unidad hablo con ella; NULL si nunca"],
[
[1,"L. Mansur",null,"Tecnico de sonido","1948-07-14","FALLECIDO","2004-03-02"],
[2,"G. Petrakis","El silbador","Jardinero municipal","1941-02-09","FALLECIDO","1981-05-30"],
[3,"T. Abernathy",null,"Conductor de autobus","1939-11-30","FALLECIDO",null],
[4,"B. Ulmer",null,"Maestra","1950-04-18","LOCALIZABLE","2019-06-11"],
[5,"D. Hollis",null,"Guarda forestal","1944-01-25","FALLECIDO","1996-09-09"],
[6,"H. Brummel",null,"Cobrador de deudas","1946-08-03","ILOCALIZABLE","1986-02-14"],
[7,"P. Sandoval",null,"Operario de funicular","1952-05-21","LOCALIZABLE","2015-10-05"],
[8,"R. Kessler",null,"Taxista","1949-12-02","ILOCALIZABLE","1983-07-19"],
[9,"M. Quigley",null,"Taquillera","1955-03-08","LOCALIZABLE","2012-01-30"],
[10,"J. Pike",null,"Contable","1958-09-27","LOCALIZABLE","2021-04-02"],
[11,"H. Delgado",null,"Portero nocturno","1951-06-16","LOCALIZABLE","2019-11-23"],
[12,"A. Mori",null,"Enfermera","1956-10-01","LOCALIZABLE","2021-08-14"],
[13,"V. Oyelaran",null,"Camarero","1962-02-11","LOCALIZABLE","2017-05-06"],
[14,"D. Kaminski","Kam","Estibador","1959-07-23","ILOCALIZABLE","1998-03-17"],
[15,"E. Thorne",null,"Vigilante de seguridad","1960-04-05","LOCALIZABLE","2016-01-18"],
[16,"M. Okafor",null,"Piloto comercial","1961-12-19","LOCALIZABLE","2014-07-29"],
[17,"F. Lindqvist",null,"Barman","1965-08-30","LOCALIZABLE","2016-02-02"],
[18,"J. Farrow",null,"Tecnico de estudio","1968-03-12","LOCALIZABLE","2018-09-20"],
[19,"K. Ibarra",null,"Musica","1970-11-04","LOCALIZABLE","2018-09-21"],
[20,"S. Vidal",null,"Productora","1966-05-09","LOCALIZABLE","2018-10-01"],
[21,"T. Okonkwo",null,"Recepcionista","1972-01-17","LOCALIZABLE","2018-09-25"],
[22,"A. Rivas",null,"Estibador","1971-06-08","LOCALIZABLE","2009-12-11"],
[23,"B. Serrano","Serra","Administrativo portuario","1969-09-14","LOCALIZABLE","2010-02-28"],
[24,"C. Mellado",null,"Capataz de turno","1967-04-22","ILOCALIZABLE","2005-06-30"],
[25,"G. Varela",null,"Jefe de muelle","1964-10-10","LOCALIZABLE","2013-03-15"],
[26,"W. Castellanos",null,"Vigilante de seguridad","1975-02-26","LOCALIZABLE","2016-04-19"],
[27,"Y. Nakamura",null,"Administrador de naves","1973-07-07","LOCALIZABLE","2015-12-03"],
[28,"P. Ferreiro",null,"Jefe de bomberos","1970-02-02","LOCALIZABLE","2011-07-05"],
[29,"N. Esparza",null,"Auxiliar de archivo","1966-12-29","LOCALIZABLE","1996-04-03"],
[30,"O. Lindgren",null,"Operadora de centralita","1958-08-08","FALLECIDO","1990-01-12"],
[31,"Desconocido",null,null,null,"ILOCALIZABLE",null],
[32,"I. Bannon",null,"Forense","1954-03-03","LOCALIZABLE","2020-02-02"],
[33,"A. Petrosian",null,"Forense","1932-05-05","FALLECIDO","1999-11-11"],
[34,"N. Achebe",null,"Forense","1968-06-06","LOCALIZABLE","2021-01-20"],
[35,"M. Oyelowo",null,"Forense","1945-09-09","FALLECIDO","2002-08-08"]
]));

/* ─────────── victimas ─────────── */
add(T("victimas","Una victima por expediente, con la horquilla horaria que fijo el forense.",
["victima_id","caso_id","nombre","edad","ocupacion","fecha_hallazgo","hora_inicio","hora_fin","causa_muerte","forense_id"],
["integer","integer","text","integer","text","date","time","time","text","integer"],
["clave primaria","expediente al que pertenece (FK)","nombre de la victima","edad al morir","profesion","fecha del hallazgo","inicio de la horquilla forense","fin de la horquilla forense","causa oficial","forense que firmo (FK a personas)"],
[
[1,1,"Dorothy Ulmer",22,"Estudiante","1974-05-09","21:40","22:15","Estrangulamiento",33],
[2,2,"Samuel Pike",53,"Prestamista","1981-11-22","01:20","01:50","Traumatismo craneal",35],
[3,3,"Marguerite Vance",29,"Operadora de centralita","1987-03-12","03:40","04:12","Ahogamiento",33],
[4,4,"Thomas Reyes",41,"Promotor inmobiliario","1994-08-08","02:10","02:40","Asfixia mecanica",32],
[5,5,"Nadia Brun",26,"Cantante","1999-02-03","23:00","01:00","Intoxicacion por sedante",32],
[6,6,"Victor Alcaraz",38,"Transportista","2003-11-17","23:30","00:30","Herida contusa",34],
[7,7,"Helena Ruiz",34,"Encargada de almacen","2011-06-28","04:00","04:45","Inhalacion de humo",34]
]));

/* ─────────── sospechosos ─────────── */
add(T("sospechosos","Personas investigadas en cada expediente y el estado de su coartada.",
["sospechoso_id","caso_id","persona_id","estado_coartada","detalle","fecha_registro","descartado"],
["integer","integer","integer","text","text","date","boolean"],
["clave primaria","expediente (FK)","persona investigada (FK)","CONFIRMADA / NO VERIFICABLE / DESMENTIDA / CONTRADICTORIA / SIN DECLARAR","nota del instructor","fecha de registro","true si la unidad lo descarto"],
[
[1,1,1,"CONFIRMADA","Cena familiar con cuatro testigos","1974-05-12",true],
[2,1,2,"NO VERIFICABLE","Dice que silbaba solo en el sendero","1974-05-13",false],
[3,1,3,"CONFIRMADA","Hospitalizado esa semana","1974-05-20",true],
[4,2,6,"NO VERIFICABLE","Cobraba una deuda a la victima","1981-11-25",false],
[5,2,7,"CONFIRMADA","Turno completo en el funicular","1981-11-26",true],
[6,2,8,"SIN DECLARAR","Taxista, nunca comparecio","1981-12-02",false],
[7,3,11,"CONFIRMADA","Libro de firmas del edificio","1987-03-14",true],
[8,3,8,"SIN DECLARAR","Mismo taxista del expediente 81-0455","1987-03-15",false],
[9,3,12,"CONFIRMADA","Llamo a emergencias a las 03:58","1987-03-14",true],
[10,3,31,"SIN DECLARAR","Llamada anonima desde cabina de Sunset","1987-03-18",false],
[11,4,13,"CONFIRMADA","Dos testigos en el bar","1994-08-10",true],
[12,4,14,"SIN DECLARAR","Sin declaracion registrada","1994-08-11",false],
[13,4,15,"NO VERIFICABLE","Turno de noche sin supervisor","1994-08-12",false],
[14,4,16,"CONFIRMADA","Tarjeta de embarque a Portland","1994-08-15",true],
[15,5,18,"NO VERIFICABLE","Ultimo en salir del estudio","1999-02-05",false],
[16,5,19,"CONFIRMADA","Tocando en directo en otra sala","1999-02-06",true],
[17,5,1,"SIN DECLARAR","Tecnico de sonido, se nego a declarar","1999-02-09",false],
[18,6,22,"NO VERIFICABLE","Dice que estaba en el cine, sin entrada","2003-11-18",false],
[19,6,23,"CONTRADICTORIA","Niega y despues admite una llamada","2003-11-19",false],
[20,6,24,"DESMENTIDA","Fichaje del puerto alterado a mano","2003-11-19",false],
[21,6,14,"SIN DECLARAR","Estibador, ilocalizable desde 1998","2003-11-25",false],
[22,7,15,"NO VERIFICABLE","Vigilante de la nave esa noche","2011-06-29",false],
[23,7,26,"CONFIRMADA","De guardia en otro recinto","2011-06-30",true],
[24,7,27,"SIN DECLARAR","Administrador, remitio a su abogado","2011-07-04",false]
]));

/* ─────────── testigos ─────────── */
add(T("testigos","Quien vio o dijo haber visto algo, con la fiabilidad que le asigno el instructor.",
["testigo_id","caso_id","persona_id","tipo","fiabilidad","fecha_declaracion"],
["integer","integer","integer","text","integer","date"],
["clave primaria","expediente (FK)","persona (FK)","PRESENCIAL / REFERENCIA / ANONIMO","de 1 a 5, 5 es maxima","fecha en que declaro"],
[
[1,1,4,"REFERENCIA",4,"1974-05-10"],
[2,1,5,"PRESENCIAL",5,"1974-05-09"],
[3,1,3,"REFERENCIA",2,"1974-05-21"],
[4,2,9,"PRESENCIAL",4,"1981-11-23"],
[5,2,10,"REFERENCIA",3,"1981-11-28"],
[6,2,7,"PRESENCIAL",5,"1981-11-26"],
[7,3,12,"PRESENCIAL",5,"1987-03-12"],
[8,3,11,"PRESENCIAL",4,"1987-03-13"],
[9,3,31,"ANONIMO",1,"1987-03-12"],
[10,3,30,"REFERENCIA",3,"1987-03-20"],
[11,4,17,"PRESENCIAL",4,"1994-08-09"],
[12,4,15,"REFERENCIA",2,"1994-08-12"],
[13,5,20,"REFERENCIA",4,"1999-02-04"],
[14,5,21,"PRESENCIAL",3,"1999-02-04"],
[15,5,19,"PRESENCIAL",5,"1999-02-06"],
[16,6,25,"PRESENCIAL",5,"2003-11-19"],
[17,6,23,"REFERENCIA",2,"2003-11-19"],
[18,6,31,"ANONIMO",1,"2009-06-02"],
[19,7,28,"PRESENCIAL",5,"2011-06-28"],
[20,7,26,"REFERENCIA",3,"2011-06-30"],
[21,7,27,"REFERENCIA",2,"2011-07-04"]
]));

/* ─────────── declaraciones ─────────── */
add(T("declaraciones","Texto de cada declaracion tomada, firmada o no.",
["declaracion_id","caso_id","persona_id","fecha","firmada","contenido"],
["integer","integer","integer","date","boolean","text"],
["clave primaria","expediente (FK)","quien declara (FK)","fecha de la toma","true si llego a firmarse","resumen literal"],
[
[1,1,4,"1974-05-10",true,"Mi hermana salio a correr al atardecer y no volvio"],
[2,1,5,"1974-05-09",true,"Oi un silbido repetido antes del grito"],
[3,1,2,"1974-05-13",false,"Silbo cuando trabajo, lo hace todo el mundo"],
[4,2,9,"1981-11-23",true,"Vi a dos hombres discutiendo en la escalera"],
[5,2,10,"1981-11-28",true,"Mi padre prestaba dinero y le debian mucho"],
[6,2,6,"1981-11-25",false,"Esa noche yo estaba cerrando cuentas en casa"],
[7,3,12,"1987-03-12",true,"Llame a emergencias al oir el forcejeo en el estanque"],
[8,3,11,"1987-03-13",true,"Nadie entro en el edificio despues de medianoche"],
[9,3,30,"1987-03-20",true,"Marguerite cambio su turno esa semana sin explicarlo"],
[10,3,8,"1987-03-15",false,"Declaracion no tomada: el testigo no comparecio"],
[11,4,17,"1994-08-09",true,"Oyelaran estuvo en la barra hasta el cierre"],
[12,4,15,"1994-08-12",false,"Hice la ronda a las dos y no vi nada raro"],
[13,4,14,"1994-08-11",false,"Declaracion no tomada: ilocalizable"],
[14,5,20,"1999-02-04",true,"La sesion acabo tarde y Nadia se quedo sola"],
[15,5,21,"1999-02-04",true,"Firmaron la salida cinco personas, no seis"],
[16,5,18,"1999-02-05",false,"Yo cerre el estudio y me fui andando"],
[17,6,25,"2003-11-19",true,"El fichaje de esa noche estaba corregido a boligrafo"],
[18,6,23,"2003-11-19",true,"Admito que hubo una llamada, pero fue corta"],
[19,6,22,"2003-11-18",false,"Estaba en el cine, perdi la entrada"],
[20,7,28,"2011-06-28",true,"El foco del incendio estaba junto a la puerta de carga"],
[21,7,15,"2011-06-29",false,"La alarma ya estaba desarmada cuando llegue"],
[22,7,27,"2011-07-04",false,"Prefiero responder por escrito con mi abogado"]
]));

/* ─────────── evidencias ─────────── */
add(T("evidencias","Piezas recogidas en cada escena y su estado actual en deposito.",
["evidencia_id","caso_id","codigo","descripcion","fecha_recogida","deposito","estado"],
["integer","integer","text","text","date","text","text"],
["clave primaria","expediente (FK)","codigo de bolsa","que es la pieza","fecha de recogida","deposito donde esta","SELLADA / DEGRADADA / EXTRAVIADA / ALTERADA"],
[
[1,1,"EV-01","Silbato de metal","1974-05-09","DEP-CENTRAL","SELLADA"],
[2,1,"EV-02","Bufanda de lana","1974-05-09","DEP-CENTRAL","SELLADA"],
[3,1,"EV-03","Molde de huella de bota","1974-05-10","DEP-CENTRAL","DEGRADADA"],
[4,2,"EV-01","Maletin forzado","1981-11-22","DEP-CENTRAL","SELLADA"],
[5,2,"EV-02","Pagare manuscrito","1981-11-22","DEP-CENTRAL","SELLADA"],
[6,2,"EV-03","Boton de abrigo","1981-11-23","DEP-CENTRAL","EXTRAVIADA"],
[7,3,"EV-01","Reloj parado a las 03:55","1987-03-12","DEP-CENTRAL","SELLADA"],
[8,3,"EV-02","Ficha de centralita","1987-03-12","DEP-NORTE","SELLADA"],
[9,3,"EV-03","Zapato izquierdo","1987-03-12","DEP-CENTRAL","DEGRADADA"],
[10,4,"EV-01","Fibra textil azul","1994-08-08","DEP-NORTE","SELLADA"],
[11,4,"EV-02","Reloj de pulsera","1994-08-08","DEP-NORTE","SELLADA"],
[12,4,"EV-03","Cinta de audio","1994-08-09","DEP-CENTRAL","EXTRAVIADA"],
[13,5,"EV-01","Cinta DAT sin etiquetar","1999-02-03","DEP-SUR","SELLADA"],
[14,5,"EV-02","Vaso con residuo","1999-02-03","DEP-SUR","SELLADA"],
[15,5,"EV-03","Libro de firmas del estudio","1999-02-04","DEP-SUR","SELLADA"],
[16,6,"EV-01","Gancho de estiba","2003-11-17","DEP-PUERTO","SELLADA"],
[17,6,"EV-02","Muestra de ADN parcial","2003-11-18","DEP-SUR","SELLADA"],
[18,6,"EV-03","Hoja de fichaje","2003-11-18","DEP-PUERTO","ALTERADA"],
[19,7,"EV-01","Residuo de acelerante","2011-06-28","DEP-NORTE","SELLADA"],
[20,7,"EV-02","Llave maestra fundida","2011-06-28","DEP-NORTE","SELLADA"],
[21,7,"EV-03","Registro de alarma","2011-06-29","DEP-NORTE","SELLADA"]
]));

/* ─────────── laboratorios ─────────── */
add(T("laboratorios","Laboratorios que procesan las peticiones de la division.",
["laboratorio_id","nombre","especialidad","ubicacion"],
["integer","text","text","text"],
["clave primaria","nombre del laboratorio","area principal","sede"],
[
[1,"LAB-1 Criminalistica","Huellas y marcas","South Angeles"],
[2,"LAB-2 Biologia Forense","ADN y fibras","Harbor"],
[3,"LAB-3 Toxicologia","Sustancias","Silver Lake"],
[4,"LAB-4 Incendios","Acelerantes","Verdugo"]
]));

/* ─────────── analisis ─────────── */
add(T("analisis","Peticiones al laboratorio. Las pendientes no tienen resultado ni fecha de salida.",
["analisis_id","evidencia_id","laboratorio_id","tipo","estado","resultado","fecha_solicitud","fecha_resultado"],
["integer","integer","integer","text","text","text","date","date"],
["clave primaria","evidencia analizada (FK)","laboratorio (FK)","tipo de analisis","PENDIENTE / PROCESADO / NO APTO","conclusion; NULL si sigue pendiente","fecha de la peticion","fecha del resultado; NULL si no hay"],
[
[1,1,1,"Huellas latentes","PENDIENTE",null,"1974-05-15",null],
[2,2,2,"Fibras","PROCESADO","Lana de la propia victima","1974-05-15","1974-07-02"],
[3,3,1,"Marcas de calzado","NO APTO","Molde degradado por la lluvia","1974-05-16","1974-06-01"],
[4,4,1,"Huellas latentes","PROCESADO","Dos juegos sin identificar","1981-11-30","1982-01-15"],
[5,5,1,"Grafologia","PENDIENTE",null,"1981-11-30",null],
[6,7,1,"Mecanismo de reloj","PROCESADO","Manipulado: la hora se forzo a mano","1987-03-20","1987-05-11"],
[7,8,1,"Documentoscopia","PENDIENTE",null,"1987-03-20",null],
[8,9,2,"Restos biologicos","NO APTO","Muestra degradada por el agua","1987-03-21","1987-06-30"],
[9,10,2,"Fibras","PENDIENTE",null,"1994-08-20",null],
[10,11,1,"Huellas latentes","PROCESADO","Solo huellas de la victima","1994-08-20","1994-11-04"],
[11,13,3,"Soporte magnetico","PENDIENTE",null,"1999-02-10",null],
[12,14,3,"Toxicologia","PROCESADO","Sedante en dosis no autoadministrable","1999-02-10","1999-04-22"],
[13,15,1,"Documentoscopia","PROCESADO","Falta una firma de salida","1999-02-12","1999-03-30"],
[14,16,2,"Restos biologicos","PROCESADO","Sin perfil utilizable","2003-11-25","2004-02-10"],
[15,17,2,"ADN","PENDIENTE",null,"2003-11-25",null],
[16,18,1,"Documentoscopia","PROCESADO","Correccion manuscrita sobre el fichaje","2003-11-26","2004-01-08"],
[17,19,4,"Acelerantes","PROCESADO","Hidrocarburo ligero junto a la puerta","2011-07-01","2011-08-12"],
[18,20,4,"Metalurgia","PROCESADO","La llave se uso antes del fuego","2011-07-01","2011-09-02"],
[19,21,1,"Registro electronico","PENDIENTE",null,"2011-07-02",null],
[20,12,2,"Soporte magnetico","NO APTO","Evidencia extraviada en 1996","1994-08-21","1996-04-02"],
[21,6,2,"Fibras","NO APTO","Evidencia extraviada en 1996","1981-11-24","1996-04-02"]
]));

/* ─────────── llamadas ─────────── */
add(T("llamadas","Registro telefonico de la noche de cada hecho.",
["llamada_id","caso_id","numero","sentido","hora","duracion_seg","origen"],
["integer","integer","text","text","time","integer","text"],
["clave primaria","expediente (FK)","numero o descripcion de la linea","ENTRANTE / SALIENTE","hora de la llamada","duracion en segundos","desde donde se hizo"],
[
[1,1,"213-555-0144","ENTRANTE","20:12",150,"Domicilio de la victima"],
[2,1,"213-555-0144","ENTRANTE","21:05",48,"Domicilio de la victima"],
[3,1,"213-555-0144","SALIENTE","21:52",72,"Cabina de Vermont Ave"],
[4,2,"213-555-7710","SALIENTE","00:41",362,"Oficina de la victima"],
[5,2,"213-555-7710","SALIENTE","01:02",21,"Oficina de la victima"],
[6,2,"Desconocido","ENTRANTE","01:55",4,"Sin identificar"],
[7,3,"Cabina Sunset Blvd","SALIENTE","23:40",199,"Cabina de Sunset Blvd"],
[8,3,"213-555-0392","ENTRANTE","02:10",700,"Sin identificar"],
[9,3,"Emergencias","SALIENTE","03:58",122,"Domicilio de A. Mori"],
[10,4,"818-555-4001","ENTRANTE","01:34",52,"Movil de la victima"],
[11,4,"Desconocido","ENTRANTE","02:02",6,"Sin identificar"],
[12,4,"818-555-4001","SALIENTE","02:48",131,"Movil de la victima"],
[13,5,"323-555-8812","ENTRANTE","22:50",63,"Estudio de grabacion"],
[14,5,"323-555-8812","ENTRANTE","00:14",595,"Estudio de grabacion"],
[15,5,"Desconocido","ENTRANTE","01:30",9,"Sin identificar"],
[16,6,"213-555-0392","ENTRANTE","22:41",251,"Caseta del muelle"],
[17,6,"213-555-7710","SALIENTE","23:02",38,"Caseta del muelle"],
[18,6,"213-555-0392","ENTRANTE","23:55",726,"Caseta del muelle"],
[19,6,"213-555-0392","ENTRANTE","01:30",9,"Sin identificar"],
[20,7,"818-555-4001","ENTRANTE","03:41",33,"Nave de Verdugo"],
[21,7,"Alarma automatica","SALIENTE","04:02",11,"Central de alarmas"],
[22,7,"818-555-4001","SALIENTE","04:50",104,"Nave de Verdugo"]
]));

/* ─────────── custodia ─────────── */
add(T("custodia","Movimientos de cada pieza entre depositos y laboratorios.",
["movimiento_id","evidencia_id","fecha","desde","hasta","responsable","motivo"],
["integer","integer","date","text","text","text","text"],
["clave primaria","evidencia movida (FK)","fecha del movimiento","deposito de origen","deposito de destino","quien firmo","por que se movio"],
[
[1,1,"1974-05-15","DEP-CENTRAL","LAB-1","R. Halloran","Peticion de huellas"],
[2,1,"1974-07-10","LAB-1","DEP-CENTRAL","R. Halloran","Devolucion sin procesar"],
[3,3,"1974-05-16","DEP-CENTRAL","LAB-1","R. Halloran","Molde de calzado"],
[4,5,"1981-11-30","DEP-CENTRAL","LAB-1","C. Vasquez","Grafologia del pagare"],
[5,6,"1996-04-02","DEP-CENTRAL","PURGA","N. Esparza","Purga de 1996"],
[6,7,"1987-03-20","DEP-CENTRAL","LAB-1","R. Halloran","Peritaje del mecanismo"],
[7,7,"1987-05-20","LAB-1","DEP-CENTRAL","R. Halloran","Devolucion con informe"],
[8,8,"1987-03-20","DEP-NORTE","LAB-1","R. Halloran","Documentoscopia"],
[9,10,"1994-08-20","DEP-NORTE","LAB-2","C. Vasquez","Cotejo de fibras"],
[10,12,"1996-04-02","DEP-CENTRAL","PURGA","N. Esparza","Purga de 1996"],
[11,13,"1999-02-10","DEP-SUR","LAB-3","S. Oduya","Lectura del soporte"],
[12,14,"1999-02-10","DEP-SUR","LAB-3","S. Oduya","Analisis del residuo"],
[13,17,"2003-11-25","DEP-SUR","LAB-2","S. Oduya","Extraccion de ADN"],
[14,18,"2003-11-26","DEP-PUERTO","LAB-1","S. Oduya","Cotejo del fichaje"],
[15,19,"2011-07-01","DEP-NORTE","LAB-4","M. Ferreira","Analisis de acelerante"],
[16,20,"2011-07-01","DEP-NORTE","LAB-4","M. Ferreira","Estudio metalurgico"],
[17,21,"2011-07-02","DEP-NORTE","LAB-1","M. Ferreira","Volcado del registro"],
[18,4,"1981-11-30","DEP-CENTRAL","LAB-1","C. Vasquez","Huellas del maletin"],
[19,16,"2003-11-25","DEP-PUERTO","LAB-2","S. Oduya","Restos biologicos"],
[20,2,"1974-05-15","DEP-CENTRAL","LAB-2","R. Halloran","Cotejo de fibras"]
]));

/* ─────────── accesos ─────────── */
add(T("accesos","Quien consulto o modifico cada expediente en el sistema COLDBASE.",
["acceso_id","usuario","fecha","hora","accion","caso_id","ip"],
["integer","text","date","time","text","integer","text"],
["clave primaria","cuenta que accedio","fecha del acceso","hora del acceso","CONSULTA / ESCRITURA / PURGA / EXPORTACION","expediente afectado (FK); NULL si fue general","direccion desde la que se conecto"],
[
[1,"admin_archivo","1996-04-03","02:11","PURGA",2,"10.14.0.7"],
[2,"admin_archivo","1996-04-03","02:49","PURGA",4,"10.14.0.7"],
[3,"anonimo","2009-06-02","04:44","ESCRITURA",6,"10.14.0.7"],
[4,"anonimo","2009-06-02","04:46","ESCRITURA",3,"10.14.0.7"],
[5,"s_oduya","2003-11-20","09:12","CONSULTA",6,"10.14.0.44"],
[6,"s_oduya","2011-07-05","10:30","CONSULTA",7,"10.14.0.44"],
[7,"m_ferreira","2016-01-18","22:40","CONSULTA",4,"10.14.0.51"],
[8,"m_ferreira","2016-01-18","22:52","CONSULTA",7,"10.14.0.51"],
[9,"t_okonjo","2026-10-06","22:54","CONSULTA",null,"10.14.0.44"],
[10,"t_okonjo","2026-10-06","23:02","CONSULTA",1,"10.14.0.44"],
[11,"c_vasquez","1994-08-20","11:00","ESCRITURA",4,"10.14.0.12"],
[12,"r_halloran","1987-03-20","08:40","ESCRITURA",3,"10.14.0.9"],
[13,"anonimo","2009-06-02","04:51","EXPORTACION",null,"10.14.0.7"],
[14,"n_esparza","1996-04-03","02:05","CONSULTA",2,"10.14.0.7"],
[15,"s_oduya","1999-02-12","15:20","ESCRITURA",5,"10.14.0.44"],
[16,"t_okonjo","2026-10-06","23:15","CONSULTA",5,"10.14.0.44"]
]));

/* ─────────── informes ─────────── */
add(T("informes","Informes firmados por los instructores a lo largo de los anos.",
["informe_id","caso_id","detective_id","fecha","tipo","conclusion"],
["integer","integer","integer","date","text","text"],
["clave primaria","expediente (FK)","quien lo firma (FK)","fecha del informe","INICIAL / SEGUIMIENTO / CIERRE PROVISIONAL / REVISION","conclusion resumida"],
[
[1,1,1,"1974-06-01","INICIAL","Sin sospechoso con coartada desmentida"],
[2,1,1,"1979-03-14","SEGUIMIENTO","Aparece la mencion del silbido en el microfilm"],
[3,2,2,"1981-12-20","INICIAL","El pagare no pudo cotejarse"],
[4,2,2,"1986-05-02","CIERRE PROVISIONAL","Sin lineas de investigacion vivas"],
[5,3,1,"1987-06-10","INICIAL","El reloj fue manipulado"],
[6,3,1,"1991-02-28","CIERRE PROVISIONAL","Caso archivado como frio"],
[7,4,2,"1994-12-01","INICIAL","Fibra azul sin cotejar"],
[8,4,3,"2016-02-03","REVISION","Se recupera la peticion de fibras"],
[9,5,3,"1999-05-10","INICIAL","Dosis incompatible con autoadministracion"],
[10,6,3,"2004-03-01","INICIAL","Fichaje del puerto alterado"],
[11,6,4,"2016-06-15","REVISION","El ADN parcial admite recotejo actual"],
[12,7,4,"2011-09-20","INICIAL","Incendio provocado con llave maestra"],
[13,7,4,"2018-01-10","SEGUIMIENTO","El vigilante repite en otro expediente"],
[14,5,4,"2018-10-02","REVISION","La cinta DAT sigue sin leerse"]
]));

/* ─────────── reaperturas ─────────── */
add(T("reaperturas","Solicitudes de reapertura presentadas por la division.",
["reapertura_id","caso_id","fecha","motivo","analista","aprobada"],
["integer","integer","date","text","text","boolean"],
["clave primaria","expediente (FK)","fecha de la solicitud","motivo alegado","quien la firma","true si la fiscalia la aprobo"],
[
[1,1,"2019-07-01","Testigo presencial aun localizable","M. Ferreira",false],
[2,2,"2015-11-10","Pagare apto para grafologia moderna","M. Ferreira",false],
[3,3,"2021-09-14","Peritaje del reloj nunca explotado","S. Oduya",true],
[4,4,"2016-02-10","Fibra azul comparable con uniforme","S. Oduya",true],
[5,5,"2018-10-05","Soporte DAT legible con equipo actual","M. Ferreira",false],
[6,6,"2016-06-20","ADN parcial apto para recotejo","S. Oduya",true],
[7,7,"2018-01-15","Coincidencia de vigilante entre expedientes","M. Ferreira",false]
]));

CDB.TABLES=TABLES;
CDB.buildDB=function(){
  var t={};
  Object.keys(TABLES).forEach(function(k){
    t[k]={cols:TABLES[k].cols.slice(),rows:TABLES[k].rows.map(function(r){return r.slice();})};
  });
  return {tables:t};
};

/* ─────────── Diagrama entidad-relacion ───────────
   Dibujado solo con caracteres ASCII: asi se alinea en cualquier
   fuente, aunque el navegador no tenga glifos de marco Unicode. */
CDB.ER=[
"  COLDBASE · MODELO RELACIONAL · 14 TABLAS",
"  ========================================",
"",
"  (1) TODO CUELGA DEL EXPEDIENTE",
"  ------------------------------",
"",
"                              +----------------+",
"                              |   detectives   |",
"                              +--------+-------+",
"                                       ^",
"                                       | detective_id",
"                                       |",
"      +---------------+  caso_id  +----+-----+  caso_id  +---------------+",
"      |   victimas    |---------->|          |<----------|   llamadas    |",
"      +---------------+           |          |           +---------------+",
"      +---------------+  caso_id  |          |  caso_id  +---------------+",
"      |  reaperturas  |---------->|  casos   |<----------|    accesos    |",
"      +---------------+           |          |           +---------------+",
"      +---------------+  caso_id  | 7 filas  |  caso_id  +---------------+",
"      |   informes    |---------->|          |<----------|  sospechosos  |",
"      +---------------+           |          |           +---------------+",
"      +---------------+  caso_id  |          |  caso_id  +---------------+",
"      | declaraciones |---------->|          |<----------|   testigos    |",
"      +---------------+           +----+-----+           +---------------+",
"                                       ^",
"                                       | caso_id",
"                                 +-----+------+",
"                                 | evidencias |",
"                                 +------------+",
"",
"  (2) LA PIEZA, EL LABORATORIO Y LA CADENA DE CUSTODIA",
"  ----------------------------------------------------",
"",
"      +---------------+ evidencia_id +-----------+ laboratorio_id +----------------+",
"      |  evidencias   |------------->| analisis  |--------------->| laboratorios   |",
"      +-------+-------+              +-----------+                +----------------+",
"              |",
"              | evidencia_id",
"              v",
"      +---------------+",
"      |   custodia    |",
"      +---------------+",
"",
"  (3) EL CENSO UNICO DE PERSONAS",
"  ------------------------------",
"",
"      +---------------+  +---------------+  +---------------+  +---------------+",
"      |  sospechosos  |  |   testigos    |  | declaraciones |  |   victimas    |",
"      +-------+-------+  +-------+-------+  +-------+-------+  +-------+-------+",
"              |                  |                  |                  |",
"              | persona_id       | persona_id       | persona_id       | forense_id",
"              +------------------+------------------+------------------+",
"                                          |",
"                                          v",
"                               +----------------------+",
"                               |       personas       |",
"                               |   35 filas · censo   |",
"                               +----------------------+",
"",
"  Cada flecha va de la clave ajena a la tabla donde esa clave es primaria.",
"  La misma persona puede figurar en varios expedientes: ahi esta la grieta."
].join("\n");

/* ─────────── Arte ASCII ─────────── */
CDB.ART={
placa:[
"        .-\"\"\"\"\"\"-.",
"       / .------. \\",
"      | |  SAPD  | |",
"      | | 1 1 4 2| |",
"       \\ '------' /",
"        '-......-'"
].join("\n"),
expediente:[
"      ______________",
"     /             /|",
"    /____________ / |",
"   |  EXPEDIENTE |  |",
"   |   COLDBASE  |  /",
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
cerrado:[
"    ____________________",
"   |  EXPEDIENTE RECON- |",
"   |    S T R U I D O   |",
"   |   sello  1142      |",
"   |____________________|"
].join("\n")
};

})();
