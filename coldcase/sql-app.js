/* ═══════════════════════════════════════════════════════════════
   COLDBASE · Consola
   ═══════════════════════════════════════════════════════════════ */
(function(){
"use strict";
var CDB=window.CDB;

var S={
  db:CDB.buildDB(),
  retos:CDB.buildRetos(),
  solved:{},
  caso:0,
  idx:0,              /* indice global dentro de S.retos */
  modo:"menu",        /* menu | diligencias | libre */
  inv:false,          /* modo investigacion */
  sonido:true,
  misses:0,
  history:[],hpos:-1,
  list:null
};
var NT=CDB.NUM_TPL,CTX=CDB.CTX,BL=CDB.BLOQUES;
/* ─────────── Primitivas del nucleo ───────────
   Pantalla, glifos, sonido, listas y teclado viven en shell.js.   */
var UI=window.UI,G=UI.G,SFX=UI.SFX;
var W=UI.W,pad=UI.pad,cut=UI.cut,boxLines=UI.box;
var out=UI.out,outPre=UI.outPre,outBox=UI.outBox,blank=UI.blank,down=UI.down,wrap=UI.wrap;
var renderList=UI.renderList,clearList=UI.clearList,submit=UI.submit;
function prompt_(){return S.inv?"coldbase(inv)=#":"coldbase=#";}

/* ─────────── Tabla de resultados ─────────── */
function renderResult(res,ms){
  var cols=res.cols.map(function(c,i){return c===undefined?"?column?":String(c);});
  var shown=res.rows.slice(0,40);
  var widths=cols.map(function(c,i){
    var w=W(c);
    shown.forEach(function(r){var v=fmt(r[i]);if(W(v)>w)w=W(v);});
    return Math.min(w,38);
  });
  var head=" "+cols.map(function(c,i){return pad(cut(c,widths[i]),widths[i]);}).join(" "+G.v2+" ")+" ";
  var rule=widths.map(function(w){return G.h2.repeat(w+2);}).join(G.tee);
  outPre(head,"th");
  outPre(rule,"faint");
  shown.forEach(function(r){
    outPre(" "+r.map(function(v,i){return pad(cut(fmt(v),widths[i]),widths[i]);}).join(" "+G.v2+" ")+" ");
  });
  var n=res.rows.length;
  out("("+n+(n===1?" fila":" filas")+(n>shown.length?", se muestran "+shown.length:"")+(ms!==undefined?" · "+ms+" ms":"")+")","dim");
}
function fmt(v){
  if(v===null||v===undefined)return "";
  if(v===true)return "t";
  if(v===false)return "f";
  return String(v);
}

/* ─────────── Comparacion de resultados ─────────── */
function norm(res){
  var rows=res.rows.map(function(r){return r.map(function(v){
    if(v===null||v===undefined)return "\u0000";
    if(typeof v==="number")return String(Math.round(v*1e6)/1e6);
    if(typeof v==="boolean")return v?"t":"f";
    return String(v);
  });});
  return rows;
}
function iguales(a,b,ordered){
  var ra=norm(a),rb=norm(b);
  if(ra.length!==rb.length)return false;
  if(!ra.length)return true;
  if(ra[0].length!==rb[0].length)return false;
  var sa=ra.map(function(r){return JSON.stringify(r);});
  var sb=rb.map(function(r){return JSON.stringify(r);});
  if(!ordered){sa.sort();sb.sort();}
  for(var i=0;i<sa.length;i++)if(sa[i]!==sb[i])return false;
  return true;
}

/* ─────────── Metacomandos ─────────── */
var META={};

META["\\?"]=function(){
  outBox("METACOMANDOS DE COLDBASE",[
"\\?            esta ayuda",
"\\dt           lista las tablas del esquema",
"\\d <tabla>    describe una tabla columna a columna",
"\\er           diagrama entidad-relacion completo",
"\\muestra <t>  primeras filas de una tabla",
"\\casos        los siete expedientes montados",
"\\exp <n>      abre el expediente n (1 a 7)",
"\\dil          diligencias del expediente abierto",
"\\reto         repite la diligencia actual",
"\\pista        pista de la diligencia",
"\\solucion     consulta de referencia",
"\\saltar       pasa a la diligencia siguiente",
"\\sql [clave]  glosario SQL o ficha de una clausula",
"\\progreso     estado de resolucion",
"\\inv          activa o desactiva el modo investigacion",
"\\divisiones   vuelve al menu de divisiones del Buro",
"\\sonido       activa o desactiva el teclado sonoro",
"\\teclas       control por teclado",
"\\menu         menu principal",
"\\marco [modo]  marcos en ascii, doble linea o automatico",
"\\limpiar      borra la pantalla",
"\\reiniciar    reinicia la base y el progreso",
"",
"Cualquier otra linea se interpreta como una consulta SQL."]);
};

META["\\dt"]=function(){
  var ts=Object.keys(CDB.TABLES);
  var lines=ts.map(function(k){
    var t=CDB.TABLES[k];
    return pad(k,16)+pad(String(t.rows.length)+" filas",11)+pad(String(t.cols.length)+" col.",9)+cut(t.desc,44);
  });
  outBox("ESQUEMA coldbase · "+ts.length+" TABLAS",lines);
  out("Escribe \\d <tabla> para ver sus columnas, o \\er para el diagrama.","dim");
};

META["\\d"]=function(arg){
  if(!arg){META["\\dt"]();return;}
  var t=CDB.TABLES[String(arg).toLowerCase()];
  if(!t){out('ERROR:  la relacion "'+arg+'" no existe',"err");out("Usa \\dt para ver las tablas.","dim");SFX.err();return;}
  var lines=t.cols.map(function(c,i){
    return pad(c,18)+pad(t.types[i],10)+cut(t.notas[i],44);
  });
  blank();
  outBox("Tabla coldbase."+t.name,lines);
  wrap(t.desc,"dim");
  out("   "+t.rows.length+" filas · prueba:  SELECT * FROM "+t.name+" LIMIT 5","faint");
  blank();
};

META["\\er"]=function(){
  blank();
  out("DIAGRAMA ENTIDAD-RELACION · coldbase","hi");
  blank();
  outPre(CDB.ER);
  blank();
  out("Las flechas apuntan de la clave ajena a la tabla donde vive la clave primaria.","dim");
  blank();
};

META["\\muestra"]=function(arg){
  if(!arg){out("Uso: \\muestra <tabla>","err");return;}
  runSQL("SELECT * FROM "+arg+" LIMIT 8",true);
};

META["\\casos"]=function(){
  var items=CTX.map(function(c,i){
    var don=countCaso(i);
    return {label:pad(c.cod,10)+pad(cut(c.titulo,30),31)+pad(String(c.anio),6)+pad(don+"/"+NT,8),cmd:"\\exp "+(i+1)};
  });
  renderList("EXPEDIENTES MONTADOS EN COLDBASE",items,"ENTER abre el expediente marcado.");
};

META["\\exp"]=function(arg){
  var n=parseInt(arg,10);
  if(!n||n<1||n>CTX.length){META["\\casos"]();return;}
  S.caso=n-1;S.modo="diligencias";
  var base=S.caso*NT,j=base;
  while(j<base+NT&&S.solved[j])j++;
  S.idx=(j<base+NT)?j:base;
  S.misses=0;
  chrome();expIntro();showReto();
};

META["\\dil"]=function(){
  var items=BL.map(function(b,i){
    var tot=0,don=0;
    for(var k=0;k<NT;k++){
      var r=S.retos[S.caso*NT+k];
      if(r.g===i){tot++;if(S.solved[S.caso*NT+k])don++;}
    }
    return {label:pad(String(i+1)+" · "+b.n,34)+pad(don+"/"+tot,8)+(don===tot?"CERRADA":""),cmd:"\\blq "+(i+1)};
  });
  renderList("DILIGENCIAS DE "+CTX[S.caso].cod,items,"ENTER salta a la primera diligencia pendiente del bloque.");
};

META["\\blq"]=function(arg){
  var n=parseInt(arg,10);
  if(!n||n<1||n>BL.length){META["\\dil"]();return;}
  var base=S.caso*NT,first=-1,pend=-1;
  for(var k=0;k<NT;k++){
    if(S.retos[base+k].g===n-1){
      if(first<0)first=base+k;
      if(pend<0&&!S.solved[base+k])pend=base+k;
    }
  }
  S.idx=pend>=0?pend:first;S.modo="diligencias";S.misses=0;
  chrome();blqIntro(n-1);showReto();
};

META["\\reto"]=function(){
  if(S.modo!=="diligencias"){out("No hay diligencia abierta. Usa \\casos para elegir expediente.","dim");return;}
  showReto();
};
META["\\pista"]=function(){
  if(S.modo!=="diligencias"){out("No hay diligencia abierta.","dim");return;}
  outBox("PISTA",[cut(S.retos[S.idx].h,74)],"hi");
};
META["\\solucion"]=function(){
  if(S.modo!=="diligencias"){out("No hay diligencia abierta.","dim");return;}
  outBox("CONSULTA DE REFERENCIA",partir(S.retos[S.idx].sql,72),"dim");
  out("Escribela tu (o una equivalente) para que cuente como resuelta.","dim");
};
META["\\saltar"]=function(){
  if(S.modo!=="diligencias"){out("No hay diligencia abierta.","dim");return;}
  var base=S.caso*NT;
  if(S.idx<base+NT-1){S.idx++;S.misses=0;chrome();showReto();}
  else out("Ya estas en la ultima diligencia del expediente.","dim");
};
META["\\inv"]=function(){
  S.inv=!S.inv;chrome();save();SFX.open();
  if(S.inv){
    outBox("MODO INVESTIGACION ACTIVADO",[
      "Consulta lo que quieras: nada de lo que escribas se",
      "comprobara contra la diligencia abierta.",
      "Vuelve a \\inv para responder de nuevo."],"hi");
  }else{
    outBox("MODO RESPUESTA ACTIVADO",[
      "Tus consultas vuelven a compararse con la diligencia."],"hi");
  }
};
META["\\progreso"]=function(){
  var lines=CTX.map(function(c,i){
    var don=countCaso(i),seg=Math.round(don/NT*20);
    return pad(c.cod,9)+pad(cut(c.titulo,26),27)+G.full.repeat(seg)+G.empty.repeat(20-seg)+" "+pad(don+"/"+NT,8);
  });
  lines.push("");
  var tot=0;for(var k in S.solved)if(S.solved[k])tot++;
  lines.push(pad("TOTAL DEL ARCHIVO",36)+pad(tot+" de "+S.retos.length+" diligencias",26)+Math.round(tot/S.retos.length*100)+"%");
  blank();outBox("ESTADO DE RESOLUCION",lines);blank();
};
META["\\sql"]=function(arg){
  if(arg){
    var g=null,q=String(arg).toLowerCase();
    CDB.GLOSARIO.forEach(function(x){if(!g&&x.c.toLowerCase()===q)g=x;});
    CDB.GLOSARIO.forEach(function(x){if(!g&&x.c.toLowerCase().indexOf(q)===0)g=x;});
    if(!g){out('No hay ficha para "'+arg+'". Escribe \\sql para la lista.',"err");return;}
    var lines=["GRUPO      "+g.g,"SINTAXIS   "+g.s,""];
    wrapTo(lines,"QUE HACE   ",g.q);
    lines.push("");
    lines.push("EJEMPLO    "+cut(g.e,62));
    lines.push("");
    wrapTo(lines,"EN EL CASO ",g.u);
    blank();outBox("FICHA SQL · "+g.c.toUpperCase(),lines);blank();
    return;
  }
  renderList("GLOSARIO SQL · "+CDB.GLOSARIO.length+" fichas",CDB.GLOSARIO.map(function(g){
    return {label:pad(g.c,14)+pad(g.g,16)+cut(g.q,40),cmd:"\\sql "+g.c};
  }),"Flechas + ENTER para abrir una ficha · o escribe \\sql join");
};
META["\\menu"]=function(){showMenu();};
META["\\limpiar"]=function(){UI.limpiar();};
META["\\divisiones"]=function(){UI.hub();};
META["\\salir"]=META["\\divisiones"];
META["\\reiniciar"]=function(){
  S.db=CDB.buildDB();S.solved={};S.idx=0;S.caso=0;S.misses=0;
  save();UI.limpiar();chrome();
  out("Base restaurada y progreso borrado.","hi");
  showMenu();
};
function wrapTo(arr,label,text){
  var words=String(text).split(/\s+/),line="",first=true;
  words.forEach(function(x){
    if((line+" "+x).trim().length>58){arr.push((first?label:"           ")+line.trim());line=x;first=false;}
    else line+=" "+x;
  });
  if(line.trim())arr.push((first?label:"           ")+line.trim());
}
function partir(sql,n){
  var words=sql.split(" "),line="",outl=[];
  words.forEach(function(w){
    if((line+" "+w).trim().length>n){outl.push(line.trim());line="  "+w;}
    else line+=" "+w;
  });
  if(line.trim())outl.push(line.trim());
  return outl;
}

/* ─────────── Pantallas ─────────── */
function showMenu(){
  S.modo="menu";clearList();chrome();
  blank();outPre(CDB.ART.placa,"dim");blank();
  renderList("DATA FORENSICS DESK · COLDBASE v3.1 · S.A.P.D.",[
    {label:"1 · EXPEDIENTES          elegir caso y empezar",cmd:"\\casos"},
    {label:"2 · ESQUEMA DE LA BASE   tablas y columnas",cmd:"\\dt"},
    {label:"3 · DIAGRAMA E-R         como se relacionan",cmd:"\\er"},
    {label:"4 · GLOSARIO SQL         fichas de clausulas",cmd:"\\sql"},
    {label:"5 · MODO INVESTIGACION   consultar sin responder",cmd:"\\inv"},
    {label:"6 · PROGRESO             estado de resolucion",cmd:"\\progreso"},
    {label:"7 · METACOMANDOS         ayuda de la consola",cmd:"\\?"},
    {label:"8 · CONTROL POR TECLADO",cmd:"\\teclas"},
    {label:"9 · REINICIAR BASE Y PROGRESO",cmd:"\\reiniciar"},
    {label:"0 · VOLVER A LAS DIVISIONES",cmd:"\\divisiones"}
  ],"Flechas para moverte · ENTER para abrir · o escribe el metacomando.");
}

function expIntro(){
  var c=CTX[S.caso];
  blank();outPre(CDB.ART.expediente,"dim");blank();
  outBox("EXPEDIENTE "+c.cod+" · "+c.titulo.toUpperCase(),[
    pad("Ano",12)+c.anio+"   ("+c.fecha+")",
    pad("Distrito",12)+c.distrito,
    pad("Victima",12)+c.vict+", "+c.vedad+" anos",
    pad("Causa",12)+c.causa,
    pad("Horquilla",12)+c.hini+" - "+c.hfin,
    pad("Diligencias",12)+NT+" repartidas en "+BL.length+" bloques"],"hi");
  blank();
}
function blqIntro(i){
  blank();
  outBox(BL[i].n,[],"hi",48);
  wrap(BL[i].d,"dim");
  blank();
}
function showReto(){
  var r=S.retos[S.idx],c=CTX[S.caso];
  var k=(S.idx%NT)+1;
  blank();
  outBox("DILIGENCIA "+("00"+k).slice(-3)+"/"+NT+"  ·  "+BL[r.g].corto+"  ·  "+c.cod,[],null,48,false);
  wrap(UI.dirigido(r.b),"hi");
  blank();
}
function countCaso(i){
  var n=0;
  for(var k=0;k<NT;k++)if(S.solved[i*NT+k])n++;
  return n;
}
function blqDone(g){
  SFX.ok();
  blank();outPre(CDB.ART.evidencia,"good");blank();
  outBox("BLOQUE CERRADO · "+BL[g].n,[
    "Bien, Detective Moreno. Siga tirando del hilo."],"good",48);
  blank();
}
function expDone(){
  var c=CTX[S.caso],r=CDB.RESUELTO[c.cod]||[];
  blank();outPre(CDB.ART.cerrado,"good");blank();
  UI.cierreDeCaso("CASO "+c.cod+" RESUELTO  ·  "+c.titulo.toUpperCase(),
    ["Felicidades, Detective Moreno.",
     "",
     "Acaba de cerrar un expediente que llevaba "+(2026-c.anio)+" anos abierto.",
     "Esto es lo que ha sacado de la base, y esto es lo que lleva",
     "el caso a la fiscalia:",
     ""].concat(r).concat([
     "",
     "Las "+NT+" diligencias quedan firmadas a su nombre y el",
     "expediente pasa de CASO FRIO a CAUSA VIVA.",
     "",
     "Siguiente expediente cuando quiera: \\casos."]),"Cap. R. Ibarra");
  var faltan=0;
  for(var i=0;i<CTX.length;i++){var n=0;for(var k=0;k<NT;k++)if(S.solved[i*NT+k])n++;if(n<NT)faltan++;}
  if(!faltan){
    blank();
    UI.cierreDeCaso("LOS SIETE EXPEDIENTES ESTAN CERRADOS",[
      "Detective Moreno: ha resuelto el archivo entero.",
      "Siete victimas que llevaban decadas sin nombre en un",
      "titular vuelven a tener una causa abierta con responsable.",
      "",
      "El Buro se funda en 1991 y nunca habia cerrado siete",
      "expedientes en una misma guardia. Vayase a dormir.",
      "Manana le presento al fiscal."],"Cap. R. Ibarra");
  }
}

/* ─────────── Ejecucion ─────────── */
function runSQL(sql,soloMostrar){
  var t0=(window.performance&&performance.now)?performance.now():Date.now();
  var res;
  try{
    res=CDB.query(sql,S.db);
  }catch(e){
    SFX.err();
    out("ERROR:  "+e.message,"err");
    if(e.hint)out("SUGERENCIA:  "+e.hint,"dim");
    if(S.modo==="diligencias"&&!S.inv&&!soloMostrar){
      S.misses++;
      if(S.misses>=3){outBox("PISTA",[cut(S.retos[S.idx].h,74)],"hi");S.misses=0;}
    }
    return null;
  }
  var ms=Math.max(1,Math.round(((window.performance&&performance.now)?performance.now():Date.now())-t0));
  blank();renderResult(res,ms);blank();
  return res;
}

var PEDIDO={"select[\\s\\S]*select":"una subconsulta","from\\s*\\(":"una subconsulta en el FROM",
"\\|\\|":"el operador de concatenacion ||","\\bas\\b":"AS","\\bin\\b":"IN"};
function pedido(re){
  if(PEDIDO[re])return PEDIDO[re];
  return re.replace(/[\\^$.*+?()[\]{}|]/g,"").replace(/bsSb/g," ").trim().toUpperCase();
}

function validar(sql,res){
  var r=S.retos[S.idx];
  if(r.re&&!new RegExp(r.re,"i").test(sql)){
    out("La consulta funciona, pero esta diligencia pide usar explicitamente "+pedido(r.re)+".","dim");
    S.misses++;
    if(S.misses>=3){outBox("PISTA",[cut(r.h,74)],"hi");S.misses=0;}
    return;
  }
  var ref;
  try{ref=CDB.query(r.sql,S.db);}catch(e){return;}
  if(!iguales(res,ref,ref.ordered)){
    S.misses++;
    out("El resultado no coincide con lo que pide la diligencia ("+ref.rows.length+
        (ref.rows.length===1?" fila":" filas")+" y "+ref.cols.length+
        (ref.cols.length===1?" columna":" columnas")+" esperadas).","dim");
    if(S.misses===3)outBox("PISTA",[cut(r.h,74)],"hi");
    if(S.misses>=6){outBox("CONSULTA DE REFERENCIA",partir(r.sql,72),"dim");S.misses=0;}
    return;
  }
  S.solved[S.idx]=true;S.misses=0;save();SFX.ok();
  blank();
  outBox("",["[ DILIGENCIA VALIDADA ]"],"ok",28);
  wrap(r.o,"hi");
  var base=S.caso*NT,next=S.idx+1;
  if(next>=base+NT){expDone();chrome();return;}
  if(S.retos[next].g!==r.g){blqDone(r.g);S.idx=next;chrome();blqIntro(S.retos[next].g);showReto();return;}
  S.idx=next;chrome();showReto();
}

var ALIAS={ayuda:"\\?",menu:"\\menu",casos:"\\casos",salir:"\\menu",help:"\\?",limpiar:"\\limpiar",tablas:"\\dt",esquema:"\\dt",diagrama:"\\er"};

function execute(raw){
  var line=String(raw).trim();
  if(!line)return;

  if(S.modo==="menu"&&/^[0-9]$/.test(line)){
    var m={0:"\\divisiones",1:"\\casos",2:"\\dt",3:"\\er",4:"\\sql",5:"\\inv",6:"\\progreso",7:"\\?",8:"teclas",9:"\\reiniciar"};
    line=m[line];
  }
  if(ALIAS[line.toLowerCase()])line=ALIAS[line.toLowerCase()];

  if(line.charAt(0)==="\\"){
    var sp=line.indexOf(" ");
    var cmd=(sp<0?line:line.slice(0,sp)).toLowerCase();
    var arg=sp<0?null:line.slice(sp+1).trim();
    if(cmd==="\\q"){out("La sesion no se cierra: siete expedientes siguen abiertos.","dim");return;}
    var fn=META[cmd];
    if(!fn){out('ERROR:  metacomando "'+cmd+'" no reconocido',"err");out("Escribe \\? para la lista.","dim");SFX.err();return;}
    SFX.open();fn(arg);chrome();return;
  }

  var res=runSQL(line,false);
  if(res&&S.modo==="diligencias"&&!S.inv)validar(line,res);
  else if(res&&S.modo==="diligencias"&&S.inv)out("(modo investigacion: esta consulta no se comprueba)","faint");
  chrome();
}


/* ─────────── Barra de estado ─────────── */
function chrome(){
  UI.setPrompt(prompt_());
  var tot=0;for(var k in S.solved)if(S.solved[k])tot++;
  var pct=Math.round(tot/S.retos.length*100);
  var exp=S.modo==="diligencias"?CTX[S.caso].cod:"----";
  var dil=S.modo==="diligencias"?BL[S.retos[S.idx].g].corto:"----";
  var num=S.modo==="diligencias"?("00"+((S.idx%NT)+1)).slice(-3)+"/"+NT:"---";
  UI.setChips([["DIVISION","DATA DESK"],["EXP",exp],["BLOQUE",dil],["DILIG",num],
               ["MODO",S.inv?"INVESTIGACION":"RESPUESTA"]],pct);
  UI.setMission(S.modo==="diligencias"?UI.dirigido(S.retos[S.idx].b):null);
}

/* ─────────── Persistencia ─────────── */
function save(){
  var d=UI.slot("datadesk");
  d.solved=S.solved;d.idx=S.idx;d.caso=S.caso;d.inv=S.inv;
  UI.save();
}
function load(){
  var d=UI.slot("datadesk");
  if(d.solved)S.solved=d.solved;
  if(typeof d.idx==="number")S.idx=Math.min(Math.max(0,d.idx),S.retos.length-1);
  if(typeof d.caso==="number")S.caso=Math.min(Math.max(0,d.caso),CTX.length-1);
  if(typeof d.inv==="boolean")S.inv=d.inv;
}

/* ─────────── Autocompletado ─────────── */
var PALABRAS=["SELECT","FROM","WHERE","GROUP BY","ORDER BY","HAVING","LIMIT","OFFSET","JOIN","LEFT JOIN",
"ON","AND","OR","NOT","IN","BETWEEN","LIKE","ILIKE","IS NULL","IS NOT NULL","DISTINCT","COUNT","SUM","AVG",
"MIN","MAX","CASE","WHEN","THEN","ELSE","END","COALESCE","UNION","WITH","EXISTS","CAST","EXTRACT","SUBSTRING","ROUND"];
function completar(entryEl){
  var v=entryEl.value,m=v.match(/[A-Za-z_][A-Za-z0-9_]*$/);
  if(!m)return;
  var frag=m[0].toLowerCase(),cands=[];
  Object.keys(CDB.TABLES).forEach(function(t){
    if(t.indexOf(frag)===0)cands.push(t);
    CDB.TABLES[t].cols.forEach(function(c){if(c.indexOf(frag)===0&&cands.indexOf(c)<0)cands.push(c);});
  });
  PALABRAS.forEach(function(p){if(p.toLowerCase().indexOf(frag)===0)cands.push(p);});
  if(!cands.length)return;
  if(cands.length===1){
    entryEl.value=v.slice(0,v.length-m[0].length)+cands[0];
    SFX.open();
  }else{
    out(cands.slice(0,24).join("   "),"dim");
  }
}

/* ─────────── Modulo de la division ─────────── */
function cuenta(){
  var n=0;for(var k in S.solved)if(S.solved[k])n++;
  return [n,S.retos.length];
}

CDB.MODULO={
  id:"datadesk",
  corto:"DATA FORENSICS DESK",
  nombre:"DATA FORENSICS DESK  ·  MESA DE ANALISIS DE DATOS",
  lema:"la base relacional y lo que esconde",
  multilinea:true,
  arte:(window.CC&&CC.ART&&CC.ART.huella)||CDB.ART.placa,
  cabecera:[
    "El papel que ordeno la Records & Evidence Room esta aqui",
    "volcado en catorce tablas. Esta division si cierra casos:",
    "cada expediente se resuelve interrogando la base con SQL.",
    "",
    "ENTER ejecuta la consulta, ALT+ENTER salta de linea.",
    "Con \\inv (F5) consulta libremente sin que se compruebe nada."],
  fkeys:{F1:"\\?",F2:"\\sql",F3:"\\reto",F4:"\\pista",F5:"\\inv"},
  prompt:prompt_,
  cuenta:cuenta,
  progreso:function(){var c=cuenta();return c[0]+"/"+c[1]+" diligencias";},
  chrome:chrome,
  completar:completar,
  menu:function(){showMenu();},
  execute:execute,
  cargar:load,
  enter:function(){chrome();showMenu();}
};
UI.register(CDB.MODULO);

CDB.__test={S:S,execute:execute,runSQL:runSQL,boxLines:boxLines,W:W,chrome:chrome};

})();
