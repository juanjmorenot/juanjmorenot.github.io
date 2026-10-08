/* ═══════════════════════════════════════════════════════════════
   COLDCASE · Nucleo comun
   South Angeles Police Department · Cold Case Bureau
   Pantalla, glifos, sonido de teclado, listas navegables,
   persistencia y conmutador entre las dos divisiones.
   ═══════════════════════════════════════════════════════════════ */
var UI = window.UI || {};
window.UI = UI;

(function(){
"use strict";

var DET={nombre:"Juan Moreno",trato:"Detective Moreno",placa:1142,
         jefe:"Cap. R. Ibarra",buro:"Cold Case Bureau · S.A.P.D."};
UI.DET=DET;

/* ─────────── Glifos ───────────
   Los caracteres de marco Unicode no existen en todas las fuentes
   monoespaciadas: si el navegador los toma de una fuente de respaldo
   su ancho deja de coincidir con el del texto y las cajas se tuercen.
   Al arrancar se mide cada glifo y, si alguno no mide lo mismo que
   una letra, se dibuja todo en ASCII. G es siempre el mismo objeto:
   cambiar de juego solo reescribe sus propiedades.                 */
var GU={tl:"╔",tr:"╗",bl:"╚",br:"╝",h:"═",v:"║",ml:"╠",mr:"╣",
        tl2:"┌",tr2:"┐",bl2:"└",br2:"┘",h2:"─",v2:"│",
        tee:"┼",sel:"►",full:"█",empty:"░",
        rama:"├───",ultima:"└───",tubo:"│   ",hueco:"    "};
var GA={tl:"+",tr:"+",bl:"+",br:"+",h:"=",v:"|",ml:"+",mr:"+",
        tl2:"+",tr2:"+",bl2:"+",br2:"+",h2:"-",v2:"|",
        tee:"+",sel:">",full:"#",empty:".",rama:"+---",ultima:"+---",tubo:"|   ",hueco:"    "};
var G={};UI.G=G;
function aplicaG(src){for(var k in src)G[k]=src[k];}
aplicaG(GU);

function medir(){
  if(ST.marco)return ST.marco==="ascii"?GA:GU;
  try{
    var sp=document.createElement("span");
    sp.style.cssText="position:absolute;left:-9999px;top:0;visibility:hidden;white-space:pre";
    (document.body||document.documentElement).appendChild(sp);
    sp.textContent="MMMMMMMMMM";
    var ref=sp.getBoundingClientRect().width/10,ok=ref>0;
    var prueba=[GU.tl,GU.h,GU.v,GU.ml,GU.tl2,GU.h2,GU.v2,GU.tee,GU.sel,GU.full,GU.empty];
    for(var i=0;ok&&i<prueba.length;i++){
      sp.textContent=new Array(11).join(prueba[i]);
      if(Math.abs(sp.getBoundingClientRect().width/10-ref)>0.15)ok=false;
    }
    sp.parentNode.removeChild(sp);
    return ok?GU:GA;
  }catch(e){return GA;}
}

/* ─────────── Medida ─────────── */
function W(s){return Array.from(String(s)).length;}
function pad(s,n){var k=n-W(s);return s+(k>0?" ".repeat(k):"");}
function cut(s,n){var a=Array.from(String(s));return a.length<=n?String(s):a.slice(0,n-1).join("")+"·";}
UI.W=W;UI.pad=pad;UI.cut=cut;

function box(title,lines,min,heavy){
  var tl=title?W(title):0;
  var w=Math.max.apply(null,lines.map(W).concat([tl+2,min||0,10]));
  var h=heavy!==false;
  var TL=h?G.tl:G.tl2,TR=h?G.tr:G.tr2,BL=h?G.bl:G.bl2,BR=h?G.br:G.br2,HZ=h?G.h:G.h2,VT=h?G.v:G.v2;
  var r=[];
  r.push(title?TL+HZ+" "+title+" "+HZ.repeat(w-tl-1)+TR:TL+HZ.repeat(w+2)+TR);
  lines.forEach(function(l){r.push(VT+" "+pad(l,w)+" "+VT);});
  r.push(BL+HZ.repeat(w+2)+BR);
  r.w=w;
  return r;
}
UI.box=box;

/* ─────────── Pantalla ─────────── */
var screenEl,entryEl,formEl,pwdEl,statusEl,missionEl,missionTxt;
function out(t,cls,pre){
  String(t==null?"":t).split("\n").forEach(function(l){
    var d=document.createElement("div");
    d.className="ln"+(pre?" pre":"")+(cls?" "+cls:"");
    d.textContent=l;
    screenEl.appendChild(d);
  });
  down();
}
function outPre(t,c){out(t,c,true);}
function outBox(title,lines,cls,min,heavy){box(title,lines,min,heavy).forEach(function(l){outPre(l,cls);});}
function blank(){out("");}
function down(){requestAnimationFrame(function(){screenEl.scrollTop=screenEl.scrollHeight;});}
function wrap(t,cls,ind){
  var words=String(t).split(/\s+/),line="",lines=[];
  words.forEach(function(w){
    if((line+" "+w).trim().length>66){lines.push(line.trim());line=w;}else line+=" "+w;
  });
  if(line.trim())lines.push(line.trim());
  lines.forEach(function(l){out((ind===undefined?"  ":ind)+l,cls);});
}
function limpiar(){screenEl.innerHTML="";clearList();}
UI.out=out;UI.outPre=outPre;UI.outBox=outBox;UI.blank=blank;UI.down=down;UI.wrap=wrap;UI.limpiar=limpiar;

function echo(raw){
  String(raw).split("\n").forEach(function(l,i){
    var d=document.createElement("div");d.className="ln cmd pre";
    var s=document.createElement("span");s.className="p";
    s.textContent=(i===0?ST.prompt:ST.prompt.replace(/[=>]#?$/,function(m){return m.length>1?"-#":"-";}))+" ";
    d.appendChild(s);d.appendChild(document.createTextNode(l));
    screenEl.appendChild(d);
  });
  down();
}

/* ─────────── Listas navegables ─────────── */
var LIST=null;
function renderList(title,items,footer){
  var w=Math.max.apply(null,items.map(function(i){return W(i.label)+2;}).concat([W(title)+2,46]));
  var nodes=[];
  outPre(G.tl+G.h.repeat(w+2)+G.tr);
  outPre(G.v+" "+pad(title,w)+" "+G.v);
  outPre(G.ml+G.h.repeat(w+2)+G.mr);
  items.forEach(function(it,i){
    var d=document.createElement("div");
    d.className="ln pre optrow";d.setAttribute("role","option");
    d.addEventListener("click",function(){LIST.sel=i;paint();activate();});
    screenEl.appendChild(d);nodes.push(d);
  });
  outPre(G.bl+G.h.repeat(w+2)+G.br);
  if(footer)out(footer,"dim");
  LIST={items:items,nodes:nodes,sel:0,w:w};
  paint();down();
}
function paint(){
  if(!LIST)return;
  LIST.nodes.forEach(function(n,i){
    var sel=i===LIST.sel;
    n.textContent=G.v+" "+(sel?G.sel:" ")+" "+pad(LIST.items[i].label,LIST.w-2)+" "+G.v;
    n.classList.toggle("sel",sel);
  });
}
function clearList(){LIST=null;}
function activate(){
  if(!LIST)return;
  var it=LIST.items[LIST.sel];clearList();submit(it.cmd);
}
function moveList(d){
  if(!LIST)return false;
  LIST.sel=(LIST.sel+d+LIST.items.length)%LIST.items.length;
  paint();
  var n=LIST.nodes[LIST.sel];
  if(n&&n.scrollIntoView)n.scrollIntoView({block:"nearest"});
  return true;
}
UI.renderList=renderList;UI.clearList=clearList;

/* ─────────── Sonido retro ─────────── */
var AC=null,noiseBuf=null;
function ac(){
  if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){AC=null;}}
  if(AC&&AC.state==="suspended"&&AC.resume)AC.resume();
  return AC;
}
function noise(ctx){
  if(!noiseBuf){
    noiseBuf=ctx.createBuffer(1,Math.floor(ctx.sampleRate*0.05),ctx.sampleRate);
    var d=noiseBuf.getChannelData(0);
    for(var i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3);
  }
  return noiseBuf;
}
function tono(freq,dur,type,vol,delay){
  var ctx=ac();if(!ctx||!ST.sonido)return;
  var t0=ctx.currentTime+(delay||0);
  var o=ctx.createOscillator(),g=ctx.createGain();
  o.type=type||"square";o.frequency.setValueAtTime(freq,t0);
  g.gain.setValueAtTime(0.0001,t0);
  g.gain.exponentialRampToValueAtTime(vol||0.05,t0+0.004);
  g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
  o.connect(g);g.connect(ctx.destination);
  o.start(t0);o.stop(t0+dur+0.02);
}
function clack(vol,hz){
  var ctx=ac();if(!ctx||!ST.sonido)return;
  var src=ctx.createBufferSource();src.buffer=noise(ctx);
  var f=ctx.createBiquadFilter();f.type="bandpass";f.frequency.value=hz||2200;f.Q.value=1.2;
  var g=ctx.createGain(),t0=ctx.currentTime;
  g.gain.setValueAtTime(vol||0.09,t0);
  g.gain.exponentialRampToValueAtTime(0.0001,t0+0.045);
  src.connect(f);f.connect(g);g.connect(ctx.destination);
  src.start(t0);src.stop(t0+0.06);
}
var SFX={
  key:function(){clack(0.07,2400);tono(1500+Math.random()*300,0.012,"square",0.02);},
  space:function(){clack(0.09,1500);},
  back:function(){clack(0.06,3000);},
  enter:function(){clack(0.12,900);tono(220,0.05,"square",0.05);},
  ok:function(){tono(660,0.09,"square",0.05);tono(880,0.12,"square",0.05,0.09);tono(1320,0.16,"triangle",0.04,0.2);},
  caso:function(){tono(523,0.12,"square",0.05);tono(659,0.12,"square",0.05,0.12);
                  tono(784,0.14,"square",0.05,0.24);tono(1047,0.3,"triangle",0.05,0.38);},
  err:function(){tono(150,0.16,"sawtooth",0.05);tono(110,0.2,"sawtooth",0.04,0.08);},
  open:function(){tono(440,0.05,"square",0.04);tono(620,0.06,"square",0.04,0.05);}
};
UI.SFX=SFX;

/* ─────────── Cabecera ─────────── */
function setChips(pairs,pct){
  statusEl.innerHTML="";
  pairs=pairs.concat([["NUBE",etiquetaNube()]]);
  pairs.forEach(function(p){
    var s=document.createElement("span");s.className="chip";
    s.appendChild(document.createTextNode("[ "+p[0]+" "));
    var b=document.createElement("b");b.textContent=p[1];s.appendChild(b);
    s.appendChild(document.createTextNode(" ]"));
    statusEl.appendChild(s);
  });
  if(pct!==undefined&&pct!==null){
    var fil=Math.round(pct/10);
    var m=document.createElement("span");m.className="chip";
    m.appendChild(document.createTextNode("[ ARCHIVO "));
    var mm=document.createElement("span");mm.className="meter";
    mm.textContent=G.full.repeat(fil)+G.empty.repeat(10-fil);
    m.appendChild(mm);
    var b2=document.createElement("b");b2.textContent=" "+pct+"%";
    m.appendChild(b2);m.appendChild(document.createTextNode(" ]"));
    statusEl.appendChild(m);
  }
}
function setMission(t){
  if(t){missionEl.hidden=false;missionTxt.textContent=t;}
  else missionEl.hidden=true;
}
function setPrompt(p){ST.prompt=p;pwdEl.textContent=p;}
UI.setChips=setChips;UI.setMission=setMission;UI.setPrompt=setPrompt;

/* ─────────── Mensaje de cierre de caso ─────────── */
function cierreDeCaso(titulo,lineas,firma){
  SFX.caso();
  blank();
  outBox(titulo,lineas,"good");
  out("   — "+(firma||DET.jefe)+" · "+DET.buro,"good");
  blank();
}
UI.cierreDeCaso=cierreDeCaso;

/* Antepone el tratamiento del detective al enunciado de cada reto. */
function dirigido(texto){
  var t=String(texto).trim();
  if(/^[A-ZÁÉÍÓÚÑ0-9][A-ZÁÉÍÓÚÑ0-9_.\-]{1,}\b/.test(t))return DET.trato+": "+t;
  return DET.trato+", "+t.charAt(0).toLowerCase()+t.slice(1);
}
UI.dirigido=dirigido;

/* ─────────── Persistencia local ─────────── */
var CLAVE="coldcase_unificado_v1";
var ST={div:null,marco:null,sonido:true,prompt:"coldcase>",datos:{}};
UI.ST=ST;
function guardarLocal(){
  try{localStorage.setItem(CLAVE,JSON.stringify({marco:ST.marco,sonido:ST.sonido,div:ST.div,datos:ST.datos}));}catch(e){}
}
function load(){
  try{
    var r=localStorage.getItem(CLAVE);if(!r)return;
    var d=JSON.parse(r);
    if(d.marco)ST.marco=d.marco;
    if(typeof d.sonido==="boolean")ST.sonido=d.sonido;
    if(d.datos&&typeof d.datos==="object")ST.datos=d.datos;
  }catch(e){}
}
function slot(id){
  if(!ST.datos[id])ST.datos[id]={};
  return ST.datos[id];
}
function save(){guardarLocal();NUBE.marcar();}
UI.save=save;UI.slot=slot;

/* ─────────── Sincronizacion entre dispositivos ───────────
   El progreso vive en el almacen del propio expediente, de modo que
   la hoja de servicio del Det. Moreno es la misma en cualquier
   terminal donde abra ColdCase. El navegador conserva una copia
   local para que la pantalla este completa antes de que responda la
   red; cuando la nube contesta, las dos se fusionan sin perder nada:
   una tarea firmada en un dispositivo no la borra el otro.        */
var NUBE={
  estado:"local",   /* local · leyendo · listo · guardando · error */
  db:null,ref:null,id:null,
  timer:null,sucio:false,aplicando:false,aviso:false
};
UI.NUBE=NUBE;

function etiquetaNube(){
  switch(NUBE.estado){
    case "listo":     return "SINCRONIZADO";
    case "guardando": return "GUARDANDO";
    case "leyendo":   return "CONECTANDO";
    case "error":     return "SOLO LOCAL";
    default:          return "LOCAL";
  }
}

/* Union de progreso: lo firmado en cualquier dispositivo se conserva. */
function fusionar(a,b){
  a=a||{};b=b||{};
  var out={},ids={};
  Object.keys(a).forEach(function(k){ids[k]=1;});
  Object.keys(b).forEach(function(k){ids[k]=1;});
  Object.keys(ids).forEach(function(k){
    var x=a[k]||{},y=b[k]||{},s={};
    Object.keys(x.solved||{}).forEach(function(i){if(x.solved[i])s[i]=true;});
    Object.keys(y.solved||{}).forEach(function(i){if(y.solved[i])s[i]=true;});
    var r={solved:s,idx:Math.max(x.idx||0,y.idx||0)};
    if(typeof x.caso==="number"||typeof y.caso==="number")
      r.caso=typeof x.caso==="number"?x.caso:y.caso;
    if(typeof x.inv==="boolean"||typeof y.inv==="boolean")
      r.inv=typeof x.inv==="boolean"?x.inv:y.inv;
    out[k]=r;
  });
  return out;
}
function cuentaFirmadas(datos){
  var n=0;
  Object.keys(datos||{}).forEach(function(k){
    var s=(datos[k]||{}).solved||{};
    Object.keys(s).forEach(function(i){if(s[i])n++;});
  });
  return n;
}

NUBE.marcar=function(){
  if(!NUBE.ref||NUBE.aplicando)return;
  NUBE.sucio=true;
  if(NUBE.timer)clearTimeout(NUBE.timer);
  NUBE.timer=setTimeout(empujar,900);
};

function empujar(){
  NUBE.timer=null;
  if(!NUBE.ref||!NUBE.sucio)return;
  NUBE.sucio=false;
  NUBE.estado="guardando";refrescaChips();
  NUBE.ref.set({
    agente:DET.nombre,placa:DET.placa,
    datos:ST.datos,
    preferencias:{marco:ST.marco,sonido:ST.sonido},
    firmadas:cuentaFirmadas(ST.datos),
    actualizado:new Date().toISOString()
  }).then(function(){
    NUBE.estado="listo";refrescaChips();
    if(NUBE.sucio)NUBE.marcar();
  })["catch"](function(){
    NUBE.estado="error";refrescaChips();
  });
}

/* Trae lo que haya en la nube y lo fusiona con lo local. */
function absorber(doc,primera){
  if(!doc)return false;
  var remoto=doc.datos||doc.data||null;
  if(!remoto||typeof remoto!=="object")return false;
  var antes=cuentaFirmadas(ST.datos);
  var unido=fusionar(ST.datos,remoto);
  var despues=cuentaFirmadas(unido);
  NUBE.aplicando=true;
  ST.datos=unido;
  if(primera&&doc.preferencias){
    if(doc.preferencias.marco&&!ST.marco)ST.marco=doc.preferencias.marco;
    if(typeof doc.preferencias.sonido==="boolean"&&ST.sonido)ST.sonido=doc.preferencias.sonido;
  }
  guardarLocal();
  ORDEN.forEach(function(id){if(MOD[id].cargar)MOD[id].cargar();});
  NUBE.aplicando=false;
  /* Si lo local tenia algo que la nube no, hay que devolverselo. */
  if(despues>cuentaFirmadas(remoto))NUBE.marcar();
  return despues>antes;
}

function conectarNube(){
  var claude=window.claude;
  if(!claude||typeof claude.use!=="function"){NUBE.estado="local";refrescaChips();return;}
  NUBE.estado="leyendo";refrescaChips();
  Promise.all([claude.use("db"),claude.use("user")]).then(function(r){
    var db=r[0],user=r[1];
    if(!db){NUBE.estado="local";refrescaChips();return null;}
    NUBE.db=db;
    return (user&&user.id?user.id():Promise.resolve("moreno")).then(function(id){
      NUBE.id=id||"moreno";
      NUBE.ref=db.collection("progreso").doc(String(NUBE.id));
      return NUBE.ref.get();
    }).then(function(snap){
      var data=snap&&(snap.data?(typeof snap.data==="function"?snap.data():snap.data):snap);
      var crecio=absorber(data,true);
      NUBE.estado="listo";
      aplicaG(medir());
      refrescaChips();
      if(data)avisoNube(crecio);
      else{NUBE.sucio=true;empujar();avisoNube(false,true);}
      suscribir();
    });
  })["catch"](function(){
    NUBE.estado="error";refrescaChips();
    if(!NUBE.aviso){
      NUBE.aviso=true;
      out("No se pudo abrir el expediente en la nube. El progreso se guarda solo en este terminal.","dim");
    }
  });
}

function avisoNube(crecio,nuevo){
  if(NUBE.aviso)return;
  NUBE.aviso=true;
  var n=cuentaFirmadas(ST.datos);
  if(nuevo){
    out("Expediente de servicio creado en la nube. Su progreso le seguira a cualquier terminal.","good");
  }else if(crecio){
    out("Hoja de servicio sincronizada desde la nube: "+n+" diligencias firmadas en total.","good");
    if(!ST.div)hub();
  }else{
    out("Hoja de servicio sincronizada: "+n+" diligencias firmadas.","dim");
  }
}

/* Un segundo terminal que firme algo aparece aqui sin recargar. */
function suscribir(){
  if(!NUBE.ref||!NUBE.ref.onSnapshot)return;
  try{
    NUBE.ref.onSnapshot(function(snap){
      if(NUBE.estado==="guardando")return;
      var data=snap&&(snap.data?(typeof snap.data==="function"?snap.data():snap.data):snap);
      if(!data)return;
      if(absorber(data,false)){
        out("Llega progreso de otro terminal: "+cuentaFirmadas(ST.datos)+" diligencias firmadas.","good");
        refrescaChips();
        if(!ST.div)hub();
      }
    });
  }catch(e){}
}

function estadoNube(){
  var lineas=[
    pad("Agente",16)+DET.nombre+"  ·  placa "+DET.placa,
    pad("Estado",16)+etiquetaNube(),
    pad("Identificador",16)+(NUBE.id||"(sin sesion en la nube)"),
    pad("Firmadas",16)+cuentaFirmadas(ST.datos)+" diligencias en total",
    "",
    "El progreso se guarda en el expediente de servicio del Buro, no",
    "en este navegador: abra ColdCase en otro ordenador o en el movil",
    "y la hoja aparece igual. El navegador solo conserva una copia",
    "local para que la pantalla este lista antes que la red."
  ];
  if(NUBE.estado==="local"||NUBE.estado==="error")
    lineas.push("","Ahora mismo no hay nube disponible: se guarda solo aqui.");
  blank();outBox("SINCRONIZACION DEL EXPEDIENTE",lineas);blank();
}

/* ─────────── Divisiones ─────────── */
var MOD={},ORDEN=[];
UI.register=function(mod){MOD[mod.id]=mod;ORDEN.push(mod.id);};

function entrar(id){
  var m=MOD[id];if(!m)return;
  ST.div=id;clearList();save();
  setPrompt(m.prompt());
  limpiar();
  blank();
  outPre(m.arte||"","dim");
  blank();
  outBox(m.nombre,m.cabecera,"hi");
  blank();
  m.enter();
}
UI.entrar=entrar;

function hub(){
  ST.div=null;clearList();setPrompt("coldcase>");setMission(null);save();
  var items=ORDEN.map(function(id,i){
    var m=MOD[id];
    return {label:pad(String(i+1)+" · "+m.corto,28)+pad(m.lema,38)+m.progreso(),cmd:"division "+(i+1)};
  });
  items.push({label:pad("3 · EXPEDIENTE PERSONAL",28)+"hoja de servicio del Det. Moreno",cmd:"expediente"});
  items.push({label:pad("4 · SINCRONIZACION",28)+"estado del expediente en la nube",cmd:"nube"});
  items.push({label:pad("5 · CONTROL POR TECLADO",28)+"teclas, sonido y marcos",cmd:"teclas"});
  blank();
  outPre(ARTE.placa,"dim");
  blank();
  renderList("COLDCASE · BURO DE CASOS NO RESUELTOS · S.A.P.D.",items,
    "Flechas para moverte · ENTER para entrar en la division marcada.");
  setChips([["AGENTE","Det. Moreno"],["PLACA",String(DET.placa)],["DIVISION","NINGUNA"]],totalPct());
}
UI.hub=hub;

function totalPct(){
  var hecho=0,total=0;
  ORDEN.forEach(function(id){
    var p=MOD[id].cuenta();
    hecho+=p[0];total+=p[1];
  });
  return total?Math.round(hecho/total*100):0;
}

function expedientePersonal(){
  var lines=[
    pad("Agente",16)+DET.nombre,
    pad("Tratamiento",16)+DET.trato,
    pad("Placa",16)+DET.placa,
    pad("Destino",16)+DET.buro,
    pad("Supervisor",16)+DET.jefe,
    ""
  ];
  ORDEN.forEach(function(id){
    var m=MOD[id],p=m.cuenta();
    var seg=Math.round(p[0]/p[1]*20);
    lines.push(pad(m.corto,22)+G.full.repeat(seg)+G.empty.repeat(20-seg)+" "+pad(p[0]+"/"+p[1],10));
  });
  lines.push("");
  lines.push(pad("ARCHIVO COMPLETO",22)+totalPct()+"%");
  lines.push("");
  lines.push(pad("Sincronizacion",22)+etiquetaNube());
  blank();
  outBox("HOJA DE SERVICIO",lines);
  blank();
}

function teclas(){
  outBox("CONTROL POR TECLADO",[
"ENTER          ejecuta la linea o abre la opcion marcada",
"ALT+ENTER      salto de linea (consultas SQL en varias lineas)",
"FLECHA ARR/ABA historial · en una lista, moverse",
"TAB            autocompleta",
"ESC            cierra la lista o vuelve al menu de la division",
"CTRL+L         limpia la pantalla",
"F1 ayuda · F2 glosario · F3 reto · F4 pista",
"F5 modo investigacion (division de datos) · F6 sonido",
"RE PAG / AV PAG  desplaza la consola",
"CTRL+INICIO principio · CTRL+FIN final",
"",
"divisiones     vuelve al menu de divisiones",
"sonido         teclado sonoro on/off",
"marco [modo]   marcos en ascii, doble o auto",
"nube           estado del expediente en la nube",
"sincronizar    fuerza el guardado en la nube ahora"]);
}

/* ─────────── Interprete comun ─────────── */
function ejecutar(raw){
  var line=String(raw).trim();
  if(!line)return;
  echo(raw);
  HIST.push(raw);HPOS=HIST.length;
  clearList();
  var l=line.toLowerCase().replace(/^\\+/,"");

  if(l==="divisiones"||l==="division"||l==="divisions"||l==="hub"){SFX.open();hub();return;}
  if(l==="expediente"||l==="hoja"){SFX.open();expedientePersonal();return;}
  if(l==="teclas"||l==="keys"){SFX.open();teclas();return;}
  if(l==="nube"||l==="sync"||l==="sincronizar"){
    SFX.open();
    if(l==="sincronizar"&&NUBE.ref){NUBE.sucio=true;empujar();}
    estadoNube();return;
  }
  if(l==="sonido"||l==="sound"){
    ST.sonido=!ST.sonido;save();
    if(ST.sonido)SFX.enter();
    out("Teclado sonoro "+(ST.sonido?"activado":"desactivado")+".","dim");
    refrescaChips();return;
  }
  if(/^marco\b/.test(l)){
    var m=l.split(/\s+/)[1]||"";
    ST.marco=(m==="ascii")?"ascii":(m==="doble"||m==="unicode")?"unicode":null;
    aplicaG(medir());save();refrescaChips();
    out("Marcos en modo "+(G.tl==="+"?"ASCII":"doble linea")+".  Uso: marco ascii | marco doble | marco auto","dim");
    return;
  }

  if(!ST.div){
    var n=parseInt(l.replace(/^division\s*/,""),10);
    if(n>=1&&n<=ORDEN.length){SFX.open();entrar(ORDEN[n-1]);return;}
    if(l==="3"){SFX.open();expedientePersonal();return;}
    if(l==="4"){SFX.open();estadoNube();return;}
    if(l==="5"){SFX.open();teclas();return;}
    out("Escribe 1 o 2 para entrar en una division, o usa las flechas sobre el menu.","dim");
    SFX.err();
    return;
  }
  MOD[ST.div].execute(line);
}
function refrescaChips(){
  if(ST.div)MOD[ST.div].chrome();
  else hubChips();
}
function hubChips(){
  setChips([["AGENTE","Det. Moreno"],["PLACA",String(DET.placa)],["DIVISION","NINGUNA"]],totalPct());
}
function submit(v){entryEl.value="";autoalto();ejecutar(v);entryEl.focus();}
UI.submit=submit;
UI.ejecutar=ejecutar;

/* ─────────── Entrada ─────────── */
var HIST=[],HPOS=-1;
function autoalto(){
  if(!entryEl)return;
  entryEl.style.height="auto";
  entryEl.style.height=Math.max(entryEl.scrollHeight,20)+"px";
}
function salto(){
  var a=entryEl.selectionStart,b=entryEl.selectionEnd,v=entryEl.value;
  entryEl.value=v.slice(0,a)+"\n"+v.slice(b);
  entryEl.selectionStart=entryEl.selectionEnd=a+1;
  autoalto();down();SFX.space();
}
function primeraLinea(){return entryEl.value.slice(0,entryEl.selectionStart).indexOf("\n")<0;}
function ultimaLinea(){return entryEl.value.slice(entryEl.selectionEnd).indexOf("\n")<0;}
function multilinea(){return !!(ST.div&&MOD[ST.div].multilinea);}

function teclado(e){
  if(e.key==="Escape"){
    e.preventDefault();
    if(LIST){clearList();out("(lista cerrada)","faint");}
    else if(ST.div)MOD[ST.div].menu();
    else hub();
    return;
  }
  if(e.key==="Enter"){
    if((e.altKey||e.shiftKey||e.ctrlKey||e.metaKey)&&multilinea()){e.preventDefault();salto();return;}
    if(LIST&&!entryEl.value.trim()){e.preventDefault();SFX.enter();activate();return;}
    e.preventDefault();SFX.enter();
    var v=entryEl.value;entryEl.value="";autoalto();ejecutar(v);
    return;
  }
  if(e.key==="ArrowUp"){
    if(LIST){e.preventDefault();SFX.key();moveList(-1);return;}
    if(!primeraLinea())return;
    e.preventDefault();SFX.key();
    if(HPOS>0){HPOS--;entryEl.value=HIST[HPOS]||"";autoalto();}
    return;
  }
  if(e.key==="ArrowDown"){
    if(LIST){e.preventDefault();SFX.key();moveList(1);return;}
    if(!ultimaLinea())return;
    e.preventDefault();SFX.key();
    if(HPOS<HIST.length-1){HPOS++;entryEl.value=HIST[HPOS]||"";}
    else{HPOS=HIST.length;entryEl.value="";}
    autoalto();
    return;
  }
  if(e.key==="Tab"){
    e.preventDefault();
    if(ST.div&&MOD[ST.div].completar)MOD[ST.div].completar(entryEl);
    return;
  }
  if(e.key==="PageUp"){e.preventDefault();screenEl.scrollTop-=screenEl.clientHeight*0.8;return;}
  if(e.key==="PageDown"){e.preventDefault();screenEl.scrollTop+=screenEl.clientHeight*0.8;return;}
  if(e.ctrlKey&&e.key==="Home"){e.preventDefault();screenEl.scrollTop=0;return;}
  if(e.ctrlKey&&e.key==="End"){e.preventDefault();screenEl.scrollTop=screenEl.scrollHeight;return;}
  if(e.ctrlKey&&(e.key==="l"||e.key==="L")){e.preventDefault();limpiar();return;}
  if(/^F[1-6]$/.test(e.key)){
    e.preventDefault();
    if(e.key==="F6"){submit("sonido");return;}
    var fk=ST.div?MOD[ST.div].fkeys:null;
    if(fk&&fk[e.key])submit(fk[e.key]);
    else if(e.key==="F1")submit("teclas");
    return;
  }
  if(e.key==="Backspace"||e.key==="Delete"){SFX.back();return;}
  if(e.key===" "){SFX.space();return;}
  if(e.key&&e.key.length===1&&!e.ctrlKey&&!e.metaKey)SFX.key();
}

/* ─────────── Arte ─────────── */
var ARTE={
placa:[
"        .-\"\"\"\"\"\"-.",
"       / .------. \\",
"      | |  SAPD  | |",
"      | | 1 1 4 2| |",
"       \\ '------' /",
"        '-......-'"
].join("\n")
};
UI.ARTE=ARTE;

/* ─────────── Arranque ─────────── */
UI.start=function(){
  screenEl=document.getElementById("screen");
  entryEl=document.getElementById("entry");
  formEl=document.getElementById("bar");
  pwdEl=document.getElementById("pwd");
  statusEl=document.getElementById("status");
  missionEl=document.getElementById("mission");
  missionTxt=document.getElementById("missiontext");
  UI.screen=screenEl;UI.entry=entryEl;

  formEl.addEventListener("submit",function(e){
    e.preventDefault();
    var v=entryEl.value;entryEl.value="";autoalto();ejecutar(v);
  });
  entryEl.addEventListener("keydown",teclado);
  entryEl.addEventListener("input",autoalto);
  document.addEventListener("keydown",function(e){
    if(e.target===entryEl)return;
    if(["ArrowUp","ArrowDown","Enter","Escape","F1","F2","F3","F4","F5","F6"].indexOf(e.key)>-1||e.ctrlKey){
      entryEl.focus();teclado(e);
    }
  });
  document.addEventListener("click",function(e){
    if(e.target.closest&&e.target.closest(".optrow"))return;
    if(window.getSelection&&String(window.getSelection()).length)return;
    entryEl.focus();
  });

  load();
  ORDEN.forEach(function(id){if(MOD[id].cargar)MOD[id].cargar();});
  function arrancar(){
    aplicaG(medir());
    setPrompt("coldcase>");
    out("COLDCASE v1.0 · South Angeles Police Department · Cold Case Bureau","dim");
    out("Terminal autorizado · sesion 07/10/2026 · 10.14.0.44","dim");
    blank();
    wrap("Bienvenido, Detective "+DET.nombre+", placa "+DET.placa+". El Buro conserva siete expedientes que nadie ha cerrado en cincuenta anos. Dos divisiones custodian lo que queda de ellos: una guarda el papel y otra guarda los datos. Elige por donde empiezas.","hi");
    var pct=totalPct();
    if(pct>0)out("Hoja de servicio recuperada: "+pct+"% del archivo trabajado.","dim");
    hub();
    entryEl.focus();
    conectarNube();
  }
  if(document.fonts&&document.fonts.ready&&document.fonts.ready.then)
    document.fonts.ready.then(arrancar)["catch"](arrancar);
  else arrancar();
};

})();
