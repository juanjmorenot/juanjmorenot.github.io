/* ═══════════════════════════════════════════════════════════════
   COLD CASE DATABASE · Motor de terminal
   ═══════════════════════════════════════════════════════════════ */
(function(){
"use strict";
var CC=window.CC;

/* ─────────── Estado ─────────── */
var S={
  fs:CC.buildFS(),
  procs:CC.buildProcs(),
  cwd:["C:","COLD_CASE"],
  mode:"menu",      /* menu | retos | libre | glosario */
  idx:0,
  solved:{},
  misses:0,
  history:[],
  hpos:-1,
  list:null,
  vol:"COLD_CASE"
};
var EX=CC.EX,FASES=CC.FASES;

/* ─────────── Primitivas del nucleo ───────────
   La pantalla, los glifos, el sonido y las listas viven en shell.js.
   Aqui solo se envuelve la salida para poder capturarla cuando una
   tuberia encadena dos comandos.                                   */
var UI=window.UI,G=UI.G,SFX=UI.SFX;
var wlen=UI.W,padw=UI.pad,cutw=UI.cut,boxLines=UI.box;
var renderList=UI.renderList,clearList=UI.clearList,submit=UI.submit;

var CAP=null;
function out(text,cls,pre){
  if(CAP){CAP.push.apply(CAP,String(text==null?"":text).split("\n"));return;}
  UI.out(text,cls,pre);
}
function outPre(t,c){out(t,c,true);}
function outBox(title,lines,cls,min,heavy){boxLines(title,lines,min,heavy).forEach(function(l){outPre(l,cls);});}
function blank(){out("");}
function scrollDown(){UI.down();}
function sep(title,lines,min){return boxLines(title,lines,min,false);}
function wrapOut(text,cls,ind){
  var words=String(text).split(/\s+/),line="",lines=[];
  words.forEach(function(w){
    if((line+" "+w).trim().length>64){lines.push(line.trim());line=w;}else line+=" "+w;
  });
  if(line.trim())lines.push(line.trim());
  lines.forEach(function(l){out((ind===undefined?"  ":ind)+l,cls);});
}

/* ─────────── Rutas ─────────── */
function pathStr(a){return a.join("\\");}
function resolve(input,base){
  if(input==null||input==="")return null;
  var s=String(input).trim().replace(/^"|"$/g,"").replace(/\//g,"\\");
  var start,parts;
  if(/^[a-zA-Z]:/.test(s)){start=["C:"];parts=s.slice(2).split("\\");}
  else if(s.charAt(0)==="\\"){start=["C:"];parts=s.split("\\");}
  else{start=(base||S.cwd).slice();parts=s.split("\\");}
  var cur=start.slice();
  for(var i=0;i<parts.length;i++){
    var p=parts[i];
    if(p===""||p===".")continue;
    if(p===".."){if(cur.length>1)cur.pop();continue;}
    cur.push(p);
  }
  return cur;
}
function findKey(dir,name){
  var l=String(name).toLowerCase();
  for(var k in dir.children)if(k.toLowerCase()===l)return k;
  return null;
}
function getNode(arr){
  if(!arr||arr[0]!=="C:")return null;
  var n=S.fs;
  for(var i=1;i<arr.length;i++){
    if(!n||n.type!=="dir")return null;
    var k=findKey(n,arr[i]);if(!k)return null;
    n=n.children[k];
  }
  return n;
}
function parentOf(a){return getNode(a.slice(0,-1));}
function realPath(arr){
  var n=S.fs,o=["C:"];
  for(var i=1;i<arr.length;i++){
    if(!n||n.type!=="dir")return arr.join("\\");
    var k=findKey(n,arr[i]);if(!k)return o.concat(arr.slice(i)).join("\\");
    o.push(k);n=n.children[k];
  }
  return o.join("\\");
}
function samePath(a,s){return !!a&&a.join("\\").toLowerCase()===String(s).toLowerCase();}
function nodeAt(s){return getNode(resolve(s,["C:"]));}
function sizeOf(n){return n.type==="dir"?0:n.content.length;}
function fmtNum(x){return String(x).replace(/\B(?=(\d{3})+(?!\d))/g,".");}
function isWild(s){return /[*?]/.test(s);}
function matchWild(name,pat){
  var re="^"+String(pat).replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*/g,".*").replace(/\?/g,".")+"$";
  return new RegExp(re,"i").test(name);
}
function expand(arg,dirNode){
  var keys=Object.keys(dirNode.children);
  if(!isWild(arg))return keys.filter(function(k){return k.toLowerCase()===arg.toLowerCase();});
  return keys.filter(function(k){return matchWild(k,arg);});
}

/* ─────────── Comandos ─────────── */
var C={};
function flags(args){return args.filter(function(a){return a.charAt(0)==="/"||/^-[a-z]+$/i.test(a);}).join(" ").toLowerCase();}
function plain(args){return args.filter(function(a){return a.charAt(0)!=="/"&&!/^-[a-z]+$/i.test(a);});}
function errNoFile(){out("El sistema no puede encontrar el archivo especificado.","err");}
function errNoPath(){out("El sistema no puede encontrar la ruta especificada.","err");}
function errSyntax(){out("La sintaxis del comando no es correcta.","err");}

C.help=function(){
  outBox("COMANDOS HABILITADOS EN LA SIMULACION",[
"NAVEGACION   dir [/b /a /s]  cd  tree [/f]  cls  echo",
"             ver  vol  title  help",
"LECTURA      type  more  sort [/r]  find [/c /i /v]  fc",
"CUSTODIA     mkdir  rmdir [/s]  copy  xcopy [/s]  move",
"             ren  del  attrib [+h -h]  where",
"PERITAJE     findstr [/i /n /v /s] \"texto\" archivo",
"RASTREO      ping  ipconfig [/all]  tracert  nslookup",
"             netstat [-an]  arp -a  hostname",
"AUDITORIA    systeminfo  tasklist  taskkill /pid  whoami",
"             date  time  set  path  chkdsk",
"ENCADENADO   comando > archivo    comando >> archivo",
"             comando | findstr \"texto\"",
"",
"PARTIDA      menu  glosario  mision  pista  solucion",
"             progreso  fase <n>  saltar  modo libre",
"             modo retos  teclas  casos  marco  reiniciar"]);
  out("Escribe glosario <comando> para la ficha detallada de cualquiera.","dim");
};

C.cls=function(){UI.limpiar();};

C.dir=function(args){
  var f=flags(args),rest=plain(args);
  var recur=f.indexOf("/s")>-1,bare=f.indexOf("/b")>-1,all=f.indexOf("/a")>-1;
  var patt=null,target=S.cwd.slice();
  if(rest.length){
    var cand=resolve(rest[0]);
    if(isWild(rest[0])){patt=rest[0].split("\\").pop();target=cand.slice(0,-1);}
    else if(getNode(cand)&&getNode(cand).type==="file"){patt=cand[cand.length-1];target=cand.slice(0,-1);}
    else target=cand;
  }
  var n=getNode(target);
  if(!n||n.type!=="dir"){errNoPath();return;}
  if(!bare){
    out(" El volumen de la unidad C es "+S.vol);
    out(" El numero de serie del volumen es 1987-4F2A");
  }
  listDir(target,n);
  function listDir(tp,nd){
    var names=Object.keys(nd.children).filter(function(k){
      if(!all&&nd.children[k].hidden)return false;
      if(patt&&!matchWild(k,patt))return false;
      return true;
    }).sort(function(a,b){
      var da=nd.children[a].type==="dir",db=nd.children[b].type==="dir";
      if(da!==db)return da?-1:1;
      return a.toLowerCase()<b.toLowerCase()?-1:1;
    });
    if(bare){
      names.forEach(function(k){out(recur?realPath(tp)+"\\"+k:k);});
    }else{
      blank();out(" Directorio de "+realPath(tp));blank();
      var files=0,dirs=0,bytes=0;
      if(tp.length>1){out("06/10/2026  22:54    <DIR>          .");out("06/10/2026  22:54    <DIR>          ..");dirs+=2;}
      names.forEach(function(k){
        var c=nd.children[k];
        if(c.type==="dir"){dirs++;out(c.date+"    <DIR>          "+k);}
        else{files++;bytes+=sizeOf(c);out(c.date+"   "+("              "+fmtNum(sizeOf(c))).slice(-14)+" "+k+(c.hidden?"   [OCULTO]":""));}
      });
      blank();
      out("              "+files+" archivos    "+fmtNum(bytes)+" bytes");
      out("              "+dirs+" dirs");
    }
    if(recur){
      Object.keys(nd.children).forEach(function(k){
        if(nd.children[k].type==="dir")listDir(tp.concat([k]),nd.children[k]);
      });
    }
  }
};

C.cd=function(args){
  if(!args.length){out(pathStr(S.cwd));return;}
  var t=resolve(args.join(" ")),n=getNode(t);
  if(!n){errNoPath();return;}
  if(n.type!=="dir"){out("El directorio no es valido.","err");return;}
  S.cwd=realPath(t).split("\\");
  chrome();
};
C.chdir=C.cd;

C.tree=function(args){
  var rest=plain(args);
  var t=rest.length?resolve(rest[0]):S.cwd.slice();
  var n=getNode(t);
  if(!n||n.type!=="dir"){errNoPath();return;}
  var withFiles=flags(args).indexOf("/f")>-1;
  out("Listado de rutas de carpetas");
  out("Numero de serie del volumen: 1987-4F2A");
  outPre(realPath(t));
  walk(n,"");
  function walk(dir,pre){
    var keys=Object.keys(dir.children).filter(function(k){
      return !dir.children[k].hidden&&(withFiles||dir.children[k].type==="dir");
    }).sort(function(a,b){
      var da=dir.children[a].type==="dir",db=dir.children[b].type==="dir";
      if(da!==db)return da?-1:1;
      return a.toLowerCase()<b.toLowerCase()?-1:1;
    });
    keys.forEach(function(k,i){
      var last=i===keys.length-1;
      outPre(pre+(last?G.ultima:G.rama)+k);
      if(dir.children[k].type==="dir")walk(dir.children[k],pre+(last?G.hueco:G.tubo));
    });
  }
};

C.echo=function(args,raw){
  var t=raw.replace(/^\s*echo\s?/i,"");
  if(!t.trim()){out("ECO esta activado.");return;}
  out(t);
};

C.type=function(args,raw,stdin){
  var rest=plain(args);
  if(!rest.length){
    if(stdin){stdin.forEach(function(l){outPre(l);});return;}
    errSyntax();return;
  }
  var t=resolve(rest.join(" ")),n=getNode(t);
  if(!n){errNoFile();return;}
  if(n.type==="dir"){out("Acceso denegado.","err");return;}
  var body=n.content.replace(/\n+$/,"").split("\n");
  blank();
  outBox(realPath(t),body,null,0,false);
  blank();
};

C.more=function(args,raw,stdin){
  var rest=plain(args);
  if(!rest.length&&stdin){stdin.forEach(function(l){outPre(l);});out("-- Fin --","dim");return;}
  if(!rest.length){errSyntax();return;}
  var t=resolve(rest.join(" ")),n=getNode(t);
  if(!n||n.type!=="file"){errNoFile();return;}
  var body=n.content.replace(/\n+$/,"").split("\n");
  body.slice(0,12).forEach(function(l){outPre(l);});
  if(body.length>12){out("-- Mas ("+Math.round(12/body.length*100)+"%) --","dim");body.slice(12).forEach(function(l){outPre(l);});}
  out("-- Fin --","dim");
};

C.sort=function(args,raw,stdin){
  var rest=plain(args),rev=flags(args).indexOf("/r")>-1,lines;
  if(rest.length){
    var n=getNode(resolve(rest[0]));
    if(!n||n.type!=="file"){errNoFile();return;}
    lines=n.content.replace(/\n+$/,"").split("\n");
  }else if(stdin)lines=stdin.slice();
  else{errSyntax();return;}
  lines.sort();if(rev)lines.reverse();
  lines.forEach(function(l){outPre(l);});
};

function parsePatternAndFile(rest){
  var pat,file;
  var q=rest.match(/^\/c:"([^"]*)"\s*(.*)$/i);
  if(q)return{pat:q[1],file:q[2].trim()};
  q=rest.match(/^"([^"]*)"\s*(.*)$/);
  if(q)return{pat:q[1],file:q[2].trim()};
  var sp=rest.split(/\s+/);
  return{pat:sp.shift(),file:sp.join(" ").trim()};
}

C.findstr=function(args,raw,stdin){
  var m=raw.match(/^\s*findstr\s+(.*)$/i);
  if(!m){out("FINDSTR: sintaxis incorrecta.","err");return;}
  var rest=m[1];
  var ci=/(^|\s)\/i(\s|$)/i.test(rest),nn=/(^|\s)\/n(\s|$)/i.test(rest),
      inv=/(^|\s)\/v(\s|$)/i.test(rest),sub=/(^|\s)\/s(\s|$)/i.test(rest);
  rest=rest.replace(/(^|\s)\/[insv](?=\s|$)/gi," ").trim();
  var pf=parsePatternAndFile(rest),pat=pf.pat,file=pf.file;
  if(!pat){out("FINDSTR: falta el patron de busqueda.","err");return;}
  var needle=ci?pat.toLowerCase():pat,hits=0;
  function scan(lines,label){
    lines.forEach(function(line,i){
      if(!line.length)return;
      var hay=ci?line.toLowerCase():line;
      var has=hay.indexOf(needle)>-1;
      if(inv?!has:has){hits++;outPre((label?label+":":"")+(nn?(i+1)+":":"")+line);}
    });
  }
  if(!file){
    if(!stdin){out("FINDSTR: falta el archivo de busqueda.","err");return;}
    scan(stdin,"");
  }else if(sub){
    var base=S.cwd.slice(),pat2=file.split("\\").pop();
    (function rec(tp){
      var nd=getNode(tp);if(!nd||nd.type!=="dir")return;
      Object.keys(nd.children).forEach(function(k){
        var c=nd.children[k];
        if(c.type==="dir")rec(tp.concat([k]));
        else if(matchWild(k,pat2))scan(c.content.split("\n"),realPath(tp.concat([k])));
      });
    })(base);
  }else{
    var tgt=resolve(file),n=getNode(tgt);
    if(!n||n.type!=="file"){out("FINDSTR: no se puede abrir "+file,"err");return;}
    scan(n.content.split("\n"),"");
  }
  if(!hits)out("(sin coincidencias para \""+pat+"\")","dim");
  else out("--- "+hits+" linea(s) coincidente(s) ---","dim");
};

C.find=function(args,raw,stdin){
  var m=raw.match(/^\s*find\s+(.*)$/i);
  if(!m){errSyntax();return;}
  var rest=m[1];
  var cnt=/(^|\s)\/c(\s|$)/i.test(rest),ci=/(^|\s)\/i(\s|$)/i.test(rest),inv=/(^|\s)\/v(\s|$)/i.test(rest);
  rest=rest.replace(/(^|\s)\/[civ](?=\s|$)/gi," ").trim();
  var pf=parsePatternAndFile(rest),pat=pf.pat,file=pf.file,lines;
  if(file){
    var n=getNode(resolve(file));
    if(!n||n.type!=="file"){errNoFile();return;}
    lines=n.content.split("\n");
    out("---------- "+realPath(resolve(file)).toUpperCase());
  }else if(stdin)lines=stdin;
  else{errSyntax();return;}
  var needle=ci?pat.toLowerCase():pat,hit=[];
  lines.forEach(function(l){
    if(!l.length)return;
    var has=(ci?l.toLowerCase():l).indexOf(needle)>-1;
    if(inv?!has:has)hit.push(l);
  });
  if(cnt)out(String(hit.length));
  else hit.forEach(function(l){outPre(l);});
};

C.fc=function(args){
  var r=plain(args);
  if(r.length<2){errSyntax();return;}
  var a=getNode(resolve(r[0])),b=getNode(resolve(r[1]));
  if(!a||!b||a.type!=="file"||b.type!=="file"){errNoFile();return;}
  out("Comparando archivos "+r[0]+" y "+r[1]);
  var la=a.content.split("\n"),lb=b.content.split("\n"),diff=0;
  var max=Math.max(la.length,lb.length);
  for(var i=0;i<max;i++){
    if((la[i]||"")!==(lb[i]||"")){
      diff++;
      out("***** linea "+(i+1));
      outPre(la[i]===undefined?"(no existe)":la[i]);
      outPre(lb[i]===undefined?"(no existe)":lb[i]);
    }
  }
  if(!diff)out("FC: no se encontraron diferencias");
  else out("FC: "+diff+" diferencia(s)","dim");
};

C.mkdir=function(args){
  var r=plain(args);
  if(!r.length){errSyntax();return;}
  var t=resolve(r.join(" "));
  if(getNode(t)){out("Ya existe un subdirectorio o archivo "+r[0]+".","err");return;}
  var p=parentOf(t);
  if(!p||p.type!=="dir"){errNoPath();return;}
  p.children[t[t.length-1]]=CC.D({},{date:"06/10/2026  22:54"});
  out("Directorio creado: "+realPath(t),"dim");
};
C.md=C.mkdir;

C.rmdir=function(args){
  var r=plain(args);
  if(!r.length){errSyntax();return;}
  var t=resolve(r.join(" ")),n=getNode(t);
  if(!n){errNoFile();return;}
  if(n.type!=="dir"){out("Nombre de directorio no valido.","err");return;}
  if(Object.keys(n.children).length&&flags(args).indexOf("/s")<0){
    out("El directorio no esta vacio. Usa rmdir /s para forzarlo.","err");return;
  }
  var p=parentOf(t);
  delete p.children[findKey(p,t[t.length-1])];
  out("Directorio eliminado: "+t.join("\\"),"dim");
};
C.rd=C.rmdir;

function copyNode(n){
  if(n.type==="file")return CC.F(n.content,{date:"06/10/2026  22:54",hidden:n.hidden});
  var kids={};
  Object.keys(n.children).forEach(function(k){kids[k]=copyNode(n.children[k]);});
  return CC.D(kids,{date:"06/10/2026  22:54"});
}

C.copy=function(args){
  var r=plain(args);
  if(r.length<2){errSyntax();return;}
  var srcP=resolve(r[0]),srcDir=getNode(srcP.slice(0,-1));
  var dst=resolve(r[1]),dn=getNode(dst);
  if(!srcDir||srcDir.type!=="dir"){errNoPath();return;}
  var names=expand(srcP[srcP.length-1],srcDir);
  if(!names.length){errNoFile();return;}
  var count=0;
  names.forEach(function(name){
    var s=srcDir.children[name];
    if(s.type==="dir")return;
    var p,target;
    if(dn&&dn.type==="dir"){p=dn;target=name;}
    else{p=parentOf(dst);target=dst[dst.length-1];}
    if(!p||p.type!=="dir")return;
    p.children[target]=CC.F(s.content,{date:"06/10/2026  22:54"});
    count++;
  });
  if(!count){out("La ruta de destino no existe.","err");return;}
  out("        "+count+" archivo(s) copiado(s).");
};

C.xcopy=function(args){
  var r=plain(args);
  if(r.length<2){errSyntax();return;}
  var s=getNode(resolve(r[0]));
  if(!s){errNoFile();return;}
  var dst=resolve(r[1]),p=parentOf(dst);
  if(!p||p.type!=="dir"){errNoPath();return;}
  var name=dst[dst.length-1];
  var dn=getNode(dst);
  if(dn&&dn.type==="dir"&&s.type==="dir"){
    Object.keys(s.children).forEach(function(k){dn.children[k]=copyNode(s.children[k]);});
    out(Object.keys(s.children).length+" archivos copiados");
    return;
  }
  p.children[name]=copyNode(s);
  var n=0;(function cnt(x){if(x.type==="file"){n++;return;}Object.keys(x.children).forEach(function(k){cnt(x.children[k]);});})(s);
  out(n+" archivos copiados");
};

C.move=function(args){
  var r=plain(args);
  if(r.length<2){errSyntax();return;}
  var srcP=resolve(r[0]),srcDir=getNode(srcP.slice(0,-1));
  if(!srcDir){errNoPath();return;}
  var names=expand(srcP[srcP.length-1],srcDir);
  if(!names.length){errNoFile();return;}
  var dst=resolve(r[1]),dn=getNode(dst),count=0;
  names.forEach(function(name){
    var s=srcDir.children[name],p,target;
    if(dn&&dn.type==="dir"){p=dn;target=name;}
    else{p=parentOf(dst);target=dst[dst.length-1];}
    if(!p||p.type!=="dir")return;
    p.children[target]=s;delete srcDir.children[name];count++;
  });
  if(!count){out("La ruta de destino no existe.","err");return;}
  out("        "+count+" archivo(s) movido(s).");
};

C.ren=function(args){
  var r=plain(args);
  if(r.length<2){errSyntax();return;}
  var src=resolve(r[0]),s=getNode(src);
  if(!s){errNoFile();return;}
  var nn=r[1].replace(/^"|"$/g,"").split("\\").pop();
  var p=parentOf(src);
  if(findKey(p,nn)){out("Ya existe un archivo con el mismo nombre.","err");return;}
  delete p.children[findKey(p,src[src.length-1])];
  p.children[nn]=s;
  out("Renombrado: "+src[src.length-1]+" -> "+nn,"dim");
};
C.rename=C.ren;

C.del=function(args){
  var r=plain(args);
  if(!r.length){errSyntax();return;}
  var t=resolve(r.join(" ")),dir=getNode(t.slice(0,-1));
  if(!dir||dir.type!=="dir"){errNoPath();return;}
  var names=expand(t[t.length-1],dir);
  if(!names.length){out("No se encuentra el archivo.","err");return;}
  var n=0;
  names.forEach(function(k){
    var c=dir.children[k];
    if(c.type==="dir")return;
    if(c.hidden){out("Acceso denegado: "+k+" tiene atributo oculto.","err");return;}
    delete dir.children[k];n++;
  });
  if(n)out(n+" archivo(s) eliminado(s).","dim");
};
C.erase=C.del;

C.attrib=function(args){
  var flag=null,file=[];
  args.forEach(function(a){if(/^[-+][hrsa]$/i.test(a))flag=a.toLowerCase();else file.push(a);});
  if(!file.length){
    var dir=getNode(S.cwd);
    Object.keys(dir.children).forEach(function(k){
      out((dir.children[k].hidden?"    H":"A    ")+"        "+pathStr(S.cwd)+"\\"+k);
    });
    return;
  }
  var t=resolve(file.join(" ")),n=getNode(t);
  if(!n){out("No se encuentra el archivo - "+file.join(" "),"err");return;}
  if(!flag){out((n.hidden?"    H":"A    ")+"        "+realPath(t));return;}
  if(flag==="-h"){n.hidden=false;out("Atributo OCULTO retirado de "+t[t.length-1],"dim");}
  else if(flag==="+h"){n.hidden=true;out("Atributo OCULTO aplicado a "+t[t.length-1],"dim");}
  else out("Atributo no soportado en esta simulacion.","dim");
};

C.where=function(args){
  var r=plain(args);
  if(!r.length){errSyntax();return;}
  var pat=r[0].split("\\").pop(),hits=0;
  (function rec(tp){
    var nd=getNode(tp);if(!nd||nd.type!=="dir")return;
    Object.keys(nd.children).forEach(function(k){
      var c=nd.children[k];
      if(c.type==="dir")rec(tp.concat([k]));
      else if(matchWild(k,pat)){hits++;out(realPath(tp)+"\\"+k);}
    });
  })(["C:","COLD_CASE"]);
  if(!hits)out("INFO: no se encontro ningun archivo para el patron dado.","dim");
};

C.ver=function(){out("FILE ROOM TERMINAL v2.0 · S.A.P.D. Cold Case Bureau [MS-DOS 6.22]");};
C.vol=function(){out(" El volumen de la unidad C es "+S.vol);out(" El numero de serie del volumen es 1987-4F2A");};
C.title=function(args,raw){
  var t=raw.replace(/^\s*title\s?/i,"").trim();
  if(!t){errSyntax();return;}
  document.title=t;out("Titulo de la ventana: "+t,"dim");
};
C.hostname=function(){out("SAPD-FILEROOM-01");};
C.whoami=function(){out("sapd\\j_moreno  (Detective Juan Moreno · placa 1142)");};
C.date=function(){out("La fecha actual es: 06/10/2026");};
C.time=function(){out("La hora actual es: 22:54:12,33");};
C.exit=function(){out("No puedes salir. Siete expedientes siguen abiertos.","dim");};

C.systeminfo=function(){
  outPre([
"Nombre de host............: SAPD-FILEROOM-01",
"Sistema operativo.........: MS-DOS 6.22 / Records & Evidence Room",
"Fabricante del sistema....: City of South Angeles · Cold Case Bureau",
"Tipo de sistema...........: Terminal de consulta forense",
"Fecha de instalacion......: 14/02/1987, 09:00:00",
"Ultimo arranque...........: 06/10/2026, 22:54:12",
"Memoria fisica total......: 640 KB",
"Memoria fisica disponible.: 112 KB",
"Dominio...................: archivo.sapd.local",
"Expedientes montados......: 7 abiertos · 3 cerrados",
"Nivel de acceso...........: DET. J. MORENO · placa 1142 (lectura/escritura)"].join("\n"));
};

C.ipconfig=function(args){
  var all=flags(args).indexOf("/all")>-1;
  outPre([
"Configuracion IP de Windows",
"",
"Adaptador de red de area local: ARCHIVO",
"",
"   Sufijo DNS especifico....: archivo.sapd.local",
"   Direccion IPv4...........: 10.14.0.44",
"   Mascara de subred........: 255.255.255.0",
"   Puerta de enlace.........: 10.14.0.1"].join("\n"));
  if(all)outPre([
"   Direccion fisica.........: 00-1A-4C-88-10-2B",
"   DHCP habilitado..........: No",
"   Servidor DNS.............: 10.14.0.1",
"   Concesion obtenida.......: 06/10/2026 22:54:01"].join("\n"));
  outPre("\nAdaptador de red: LABORATORIO (medio desconectado)");
};

var HOSTS={"10.14.0.7":"archivo.sapd.local","10.14.0.21":"lab.sapd.local","10.14.0.33":"microfilm.sapd.local","10.14.0.1":"gateway.sapd.local"};
C.ping=function(args){
  var h=plain(args)[0];
  if(!h){out("Uso: ping <host>","err");return;}
  var ip=h;
  for(var k in HOSTS)if(HOSTS[k].toLowerCase()===h.toLowerCase())ip=k;
  var ok=!!HOSTS[ip];
  blank();out("Haciendo ping a "+h+" ["+ip+"] con 32 bytes de datos:");
  if(ok){
    for(var i=0;i<4;i++)out("Respuesta desde "+ip+": bytes=32 tiempo="+(1+i%3)+"ms TTL=128");
    blank();out("Estadisticas de ping para "+ip+":");
    out("    Paquetes: enviados = 4, recibidos = 4, perdidos = 0 (0% perdidos)");
  }else{
    out("Tiempo de espera agotado para esta solicitud.");
    out("Tiempo de espera agotado para esta solicitud.");
    blank();out("Estadisticas de ping para "+h+":");
    out("    Paquetes: enviados = 4, recibidos = 0, perdidos = 4 (100% perdidos)");
  }
  blank();
};

C.tracert=function(args){
  var h=plain(args)[0];
  if(!h){out("Uso: tracert <host>","err");return;}
  blank();
  out("Traza a "+h+" sobre un maximo de 30 saltos:");
  out("  1     1 ms     1 ms     1 ms  10.14.0.1   gateway");
  out("  2     2 ms     2 ms     2 ms  10.14.0.4   conmutador de archivo");
  out("  3     3 ms     2 ms     3 ms  "+h+"   destino");
  out("Traza completa.");
  blank();
};

C.nslookup=function(args){
  var h=plain(args)[0];
  if(!h){out("Uso: nslookup <nombre>","err");return;}
  var ip=null;
  for(var k in HOSTS)if(HOSTS[k].toLowerCase()===h.toLowerCase())ip=k;
  if(!ip&&HOSTS[h])ip=h;
  out("Servidor:  gateway.sapd.local");
  out("Address:   10.14.0.1");
  blank();
  if(ip){out("Nombre:    "+(HOSTS[ip]||h));out("Address:   "+ip);}
  else out("*** gateway.sapd.local no encuentra "+h+": Non-existent domain");
};

C.netstat=function(){
  outPre([
"Conexiones activas",
"",
"  Proto  Direccion local        Direccion remota       Estado",
"  TCP    10.14.0.44:1121        10.14.0.7:139          ESTABLISHED",
"  TCP    10.14.0.44:1133        10.14.0.21:445         ESTABLISHED",
"  TCP    10.14.0.44:4455        10.14.0.33:23          TIME_WAIT",
"  TCP    0.0.0.0:4444           0.0.0.0:0              LISTENING   <- sin servicio declarado"].join("\n"));
};

C.arp=function(){
  outPre([
"Interfaz: 10.14.0.44 --- 0x2",
"  Direccion de Internet     Direccion fisica      Tipo",
"  10.14.0.1                 00-1a-4c-00-00-01     dinamico",
"  10.14.0.7                 00-1a-4c-00-00-07     dinamico",
"  10.14.0.21                00-1a-4c-00-00-15     dinamico",
"  10.14.0.33                00-1a-4c-00-00-21     dinamico"].join("\n"));
};

C.tasklist=function(){
  out("Nombre de imagen            PID   Memoria");
  out("=========================  =====  ========");
  S.procs.forEach(function(p){
    out(padw(p.img,27)+("    "+p.pid).slice(-5)+"  "+padw(p.mem,9)+(p.nota?" <-- "+p.nota:""));
  });
};

C.taskkill=function(args,raw){
  var m=raw.match(/\/pid\s+(\d+)/i)||raw.match(/\b(\d{2,5})\b/);
  if(!m){out("Uso: taskkill /pid <numero>","err");return;}
  var pid=parseInt(m[1],10),i=-1;
  S.procs.forEach(function(p,j){if(p.pid===pid)i=j;});
  if(i<0){out("ERROR: el proceso \""+pid+"\" no se encuentra.","err");return;}
  var img=S.procs[i].img;
  if(img==="SYSTEM"||img==="TERMINAL.COM"){out("ERROR: proceso critico, no se puede finalizar.","err");return;}
  S.procs.splice(i,1);
  out("CORRECTO: se finalizo el proceso \""+img+"\" con PID "+pid+".");
};

C.set=function(){
  outPre([
"ARCHIVO=C:\\COLD_CASE\\EVIDENCE",
"BACKUP=C:\\COLD_CASE\\SYSTEM\\BACKUP",
"LAB=C:\\COLD_CASE\\LAB",
"TEMP=C:\\COLD_CASE\\WORKSPACE\\TEMP",
"USUARIO=analista_datos",
"TURNO=NOCHE",
"PURGA_1996=AUTORIZACION_ILEGIBLE"].join("\n"));
};
C.path=function(){
  outPre("PATH=C:\\DOS;C:\\COLD_CASE\\SYSTEM;C:\\COLD_CASE\\SYSTEM\\BACKUP;C:\\NIGHTSCAN");
  out("La ultima ruta no figura en el inventario de software del archivo.","dim");
};
C.chkdsk=function(){
  outPre([
"El tipo del sistema de archivos es FAT16.",
"El volumen COLD_CASE fue comprobado por ultima vez en 1996.",
"",
"  41.943.040 bytes de espacio total en disco",
"  38.100.992 bytes en 612 archivos de usuario",
"       3.072 bytes en sectores defectuosos",
"",
"SECTORES DEFECTUOSOS: afectan a 3 fotogramas del rollo de 1974."].join("\n"));
};

/* ─────────── Comandos de partida ─────────── */
C.menu=function(){showMenu();};
C.divisiones=function(){UI.hub();};
C.salir=C.divisiones;
C.casos=function(){
  var lines=CC.CASOS.map(function(c){
    return padw(c.id,9)+padw(c.dir,17)+padw(cutw(c.nom,28),29)+c.ano;
  });
  outBox("EXPEDIENTES MONTADOS EN EL ARCHIVO",lines);
};
C.mision=function(){
  if(S.mode==="retos")showChallenge();
  else out("Estas en MODO LIBRE. Escribe: modo retos","dim");
};
C.pista=function(){
  if(S.mode!=="retos"){out("Las pistas solo existen en el modo de retos.","dim");return;}
  outBox("PISTA",[cutw(EX[S.idx].h,70)],"hi");
};
C.solucion=function(){
  if(S.mode!=="retos"){out("No hay reto activo.","dim");return;}
  outBox("SOLUCION SUGERIDA",[EX[S.idx].s],"dim");
  out("Escribela tu para que cuente como resuelta.","dim");
};
C.progreso=function(){showProgress();};
C.saltar=function(){
  if(S.mode!=="retos"){out("No hay reto activo.","dim");return;}
  if(S.idx<EX.length-1){S.idx++;S.misses=0;chrome();showChallenge();}
  else out("Ya estas en el ultimo reto.","dim");
};
C.fase=function(args){
  var n=parseInt(plain(args)[0],10);
  if(!n||n<1||n>FASES.length){showFases();return;}
  S.mode="retos";
  var first=0;
  for(var i=0;i<EX.length;i++){if(EX[i].f===n-1){first=i;break;}}
  var j=first;while(j<EX.length&&EX[j].f===n-1&&S.solved[j])j++;
  S.idx=(j<EX.length&&EX[j].f===n-1)?j:first;
  S.misses=0;chrome();
  faseIntro(n-1);showChallenge();
};
C.modo=function(args){
  var m=(plain(args)[0]||"").toLowerCase();
  if(m==="libre")enterLibre();
  else if(m==="retos"||m==="reto"||m==="niveles")enterRetos();
  else out("Uso: modo libre | modo retos","dim");
};
C.reiniciar=function(){
  S.fs=CC.buildFS();S.procs=CC.buildProcs();S.cwd=["C:","COLD_CASE"];
  S.solved={};S.idx=0;S.misses=0;save();chrome();
  UI.limpiar();
  out("Archivo restaurado al estado original. Progreso borrado.","hi");
  showMenu();
};
C.glosario=function(args){
  var q=plain(args).join(" ").toLowerCase();
  if(q){showGlosarioFicha(q);return;}
  showGlosario();
};

/* ─────────── Pantallas ─────────── */
function showMenu(){
  S.mode="menu";chrome();
  blank();outPre(CC.ART.placa,"dim");blank();
  renderList("RECORDS & EVIDENCE ROOM · SALA DE ARCHIVO",[
    {label:"1 · ORDEN DE TAREAS     "+solvedCount()+"/"+EX.length+" completadas",cmd:"modo retos"},
    {label:"2 · MODO LIBRE          archivo completo",cmd:"modo libre"},
    {label:"3 · GLOSARIO            fichas de comandos",cmd:"glosario"},
    {label:"4 · FASES DE LA INVESTIGACION",cmd:"fase"},
    {label:"5 · ESTADO DE RESOLUCION",cmd:"progreso"},
    {label:"6 · EXPEDIENTES DEL ARCHIVO",cmd:"casos"},
    {label:"7 · MANUAL DE COMANDOS",cmd:"help"},
    {label:"8 · CONTROL POR TECLADO",cmd:"teclas"},
    {label:"9 · REINICIAR ARCHIVO Y PROGRESO",cmd:"reiniciar"},
    {label:"0 · VOLVER A LAS DIVISIONES",cmd:"divisiones"}
  ],"Flechas para moverte · ENTER para abrir · o escribe el comando.");
}

function showFases(){
  var items=FASES.map(function(f,i){
    var tot=0,don=0;
    EX.forEach(function(e,j){if(e.f===i){tot++;if(S.solved[j])don++;}});
    return {label:padw(f.n,34)+padw(don+"/"+tot,7)+(don===tot?"CERRADA":""),cmd:"fase "+(i+1)};
  });
  renderList("FASES DE LA INVESTIGACION",items,"ENTER abre la fase marcada.");
}

function faseIntro(i){
  var f=FASES[i];
  blank();
  if(CC.ART[f.art])outPre(CC.ART[f.art],"dim");
  blank();
  outBox(f.n,[],"hi",46);
  wrapOut(f.d,"dim");
  blank();
}

function showGlosario(){
  var groups={},order=[];
  CC.GLOSARIO.forEach(function(g){if(!groups[g.g]){groups[g.g]=[];order.push(g.g);}groups[g.g].push(g);});
  var items=[];
  order.forEach(function(gr){
    groups[gr].forEach(function(g){
      items.push({label:padw(g.c,12)+padw(gr,12)+cutw(g.q,40),cmd:"glosario "+g.c});
    });
  });
  renderList("GLOSARIO DE COMANDOS · "+CC.GLOSARIO.length+" fichas",items,
    "Flechas + ENTER para abrir una ficha · o escribe: glosario dir");
}

function showGlosarioFicha(q){
  var g=null;
  CC.GLOSARIO.forEach(function(x){if(x.c.toLowerCase()===q)g=x;});
  if(!g){
    CC.GLOSARIO.forEach(function(x){if(!g&&x.c.toLowerCase().indexOf(q)===0)g=x;});
  }
  if(!g){out("No hay ficha para \""+q+"\". Escribe glosario para ver la lista.","err");return;}
  var lines=[];
  lines.push("GRUPO      "+g.g);
  lines.push("SINTAXIS   "+g.s);
  lines.push("");
  wrapTo(lines,"QUE HACE   ",g.q);
  lines.push("");
  lines.push("EJEMPLO    "+g.e);
  lines.push("");
  wrapTo(lines,"EN EL CASO ",g.u);
  blank();
  outBox("FICHA · "+g.c.toUpperCase(),lines);
  blank();
}
function wrapTo(arr,label,text){
  var words=String(text).split(/\s+/),line="",first=true;
  var w=60;
  words.forEach(function(x){
    if((line+" "+x).trim().length>w){arr.push((first?label:"           ")+line.trim());line=x;first=false;}
    else line+=" "+x;
  });
  if(line.trim())arr.push((first?label:"           ")+line.trim());
}

function showProgress(){
  var lines=[];
  FASES.forEach(function(f,i){
    var tot=0,don=0;
    EX.forEach(function(e,j){if(e.f===i){tot++;if(S.solved[j])don++;}});
    var seg=Math.round(don/tot*20);
    lines.push(padw(f.n,34)+G.full.repeat(seg)+G.empty.repeat(20-seg)+"  "+padw(don+"/"+tot,6));
  });
  lines.push("");
  var pct=Math.round(solvedCount()/EX.length*100);
  lines.push(padw("TOTAL",34)+padw(solvedCount()+" de "+EX.length+" retos",22)+pct+"%");
  blank();outBox("ESTADO DE RESOLUCION DEL ARCHIVO",lines);blank();
}

function enterRetos(){
  S.mode="retos";clearList();
  var i=0;while(i<EX.length&&S.solved[i])i++;
  S.idx=Math.min(i,EX.length-1);S.misses=0;
  chrome();blank();
  outBox("ORDEN DE TAREAS DEL ARCHIVO",[
    "Despache cada tarea ejecutando el comando correcto.",
    "F4 o 'pista' da una pista · 'solucion' muestra la sintaxis.",
    "'saltar' pasa al siguiente · 'fase <n>' cambia de fase."],"hi");
  faseIntro(EX[S.idx].f);
  showChallenge();
}

function enterLibre(){
  S.mode="libre";clearList();chrome();
  blank();outPre(CC.ART.expediente,"dim");blank();
  outBox("MODO LIBRE · ARCHIVO COMPLETO MONTADO",[
    "Siete expedientes, laboratorio, testigos y sistema.",
    "Todos los comandos activos. Nada de lo que hagas aqui",
    "afecta a tu progreso en los retos.",
    "Escribe 'casos' para la lista de expedientes."],"hi");
  blank();
}

function showChallenge(){
  var e=EX[S.idx],f=FASES[e.f];
  var head="TAREA "+("00"+(S.idx+1)).slice(-3)+"/"+EX.length+"  ·  "+f.n;
  blank();
  outBox(head,[],null,46,false);
  wrapOut(UI.dirigido(e.b),"hi");
  blank();
}

function levelDone(i){
  SFX.ok();
  blank();
  outPre(CC.ART.cerrado,"good");
  blank();
  outBox("FASE DESPACHADA · "+FASES[i].n,[
    "Buen trabajo, Detective Moreno. Esta parte del archivo",
    "queda ordenada y lista para consulta."],"good",46);
  blank();
}

function solvedCount(){var n=0;for(var k in S.solved)if(S.solved[k])n++;return n;}

/* ─────────── Validacion de retos ─────────── */
function testEx(e,ctx){
  var re=e.re?new RegExp(e.re,"i"):null;
  if(e.c&&ctx.cmd!==e.c)return false;
  if(e.at&&!samePath(S.cwd,e.at))return false;
  if(re&&!re.test(ctx.raw))return false;
  switch(e.k){
    case "cmd": return true;
    case "cd": return samePath(S.cwd,e.p);
    case "read": return (ctx.cmd==="type"||ctx.cmd==="more")&&samePath(ctx.target,e.p);
    case "exists": return !!nodeAt(e.p);
    case "gone": return !nodeAt(e.p);
    case "moved": return !!nodeAt(e.p)&&!nodeAt(e.q);
    case "attr": var n=nodeAt(e.p);return !!n&&!!n.hidden===!!e.v;
    case "file": var g=nodeAt(e.p);return !!g&&g.type==="file"&&(!e.fre||new RegExp(e.fre,"i").test(g.content));
    case "kill": return !S.procs.some(function(p){return p.pid===e.pid;});
    default: return false;
  }
}

function afterCommand(ctx){
  if(S.mode!=="retos")return;
  var e=EX[S.idx],ok=false;
  try{ok=testEx(e,ctx);}catch(err){ok=false;}
  if(!ok){
    S.misses++;
    if(S.misses===3)outBox("PISTA",[cutw(e.h,70)],"hi");
    if(S.misses>=6){outBox("SINTAXIS",[e.s],"dim");S.misses=0;}
    return;
  }
  S.solved[S.idx]=true;S.misses=0;save();
  blank();
  outBox("",["[ EVIDENCIA DESCLASIFICADA ]"],"ok",30);
  wrapOut(e.o,"hi");
  var fase=e.f,next=S.idx+1;
  if(next>=EX.length){finish();chrome();return;}
  if(EX[next].f!==fase){levelDone(fase);S.idx=next;chrome();faseIntro(EX[next].f);showChallenge();return;}
  S.idx=next;chrome();showChallenge();
}

function finish(){
  S.mode="libre";save();
  blank();outPre(CC.ART.expediente,"good");blank();
  UI.cierreDeCaso("GESTION ADMINISTRATIVA COMPLETADA",[
    "Detective Moreno: ha completado las "+EX.length+" tareas de archivo",
    "de los siete expedientes del Buro.",
    "",
    "Que conste lo que esto significa y lo que no. Usted no ha",
    "resuelto ningun crimen esta noche: ha ordenado el papel.",
    "Carpetas con nombre, copias en su sitio, atributos retirados,",
    "cadenas de custodia legibles y tres documentos reservados",
    "que llevaban desde 2009 ocultos y ahora estan a la vista.",
    "",
    "Sin este trabajo no hay investigacion posible. Con el, si.",
    "Lleve el archivo a la Data Forensics Desk: alli los siete",
    "expedientes ya se pueden interrogar como lo que son, datos.",
    "",
    "Queda abierto el modo libre de esta sala para lo que necesite."],"Cap. R. Ibarra");
}

/* ─────────── Persistencia ─────────── */
function save(){
  var d=UI.slot("fileroom");
  d.solved=S.solved;d.idx=S.idx;
  UI.save();
}
function load(){
  var d=UI.slot("fileroom");
  if(d.solved)S.solved=d.solved;
  if(typeof d.idx==="number")S.idx=Math.min(Math.max(0,d.idx),EX.length-1);
}

/* ─────────── Barra de estado ─────────── */
function chrome(){
  UI.setPrompt(pathStr(S.cwd)+">");
  var done=solvedCount(),pct=Math.round(done/EX.length*100);
  var modo=S.mode==="retos"?"TAREAS":S.mode==="libre"?"LIBRE":"MENU";
  var fase=S.mode==="retos"?FASES[EX[S.idx].f].corto:"----";
  var reto=S.mode==="retos"?("00"+(S.idx+1)).slice(-3)+"/"+EX.length:"---";
  UI.setChips([["DIVISION","FILE ROOM"],["MODO",modo],["FASE",fase],["TAREA",reto]],pct);
  UI.setMission(S.mode==="retos"?UI.dirigido(EX[S.idx].b):null);
}

/* ─────────── Interprete ─────────── */
function tokenize(raw){
  return (raw.match(/"[^"]*"|\S+/g)||[]).map(function(t){return t.replace(/^"|"$/g,"");});
}
function splitPipes(s){
  var parts=[],cur="",q=false;
  for(var i=0;i<s.length;i++){
    var ch=s[i];
    if(ch==='"')q=!q;
    if(ch==="|"&&!q){parts.push(cur);cur="";}
    else cur+=ch;
  }
  parts.push(cur);
  return parts.map(function(p){return p.trim();}).filter(function(p){return p.length;});
}

var ESP={listar:"dir",borrar:"del",leer:"type",ayuda:"help",limpiar:"cls",mover:"move",copiar:"copy",buscar:"findstr",renombrar:"ren",crear:"mkdir"};

function runStage(stage,stdin){
  var toks=tokenize(stage);
  if(!toks.length)return;
  var cmd=toks[0].toLowerCase(),args=toks.slice(1);
  if(ESP[cmd]){
    out("'"+cmd+"' no se reconoce como un comando interno o externo,","err");
    out("programa o archivo por lotes ejecutable.","err");
    out("Equivalente real en CMD: "+ESP[cmd],"dim");
    return {cmd:cmd,args:args,raw:stage,bad:true};
  }
  var fn=C[cmd];
  if(!fn){
    out("'"+toks[0]+"' no se reconoce como un comando interno o externo,","err");
    out("programa o archivo por lotes ejecutable.","err");
    out(S.mode==="retos"?"Escribe pista (F4) o glosario (F2).":"Escribe help para ver los comandos disponibles.","dim");
    return {cmd:cmd,args:args,raw:stage,bad:true};
  }
  var ctx={cmd:cmd,args:args,raw:stage};
  var firstPlain=plain(args)[0];
  if(firstPlain)ctx.target=resolve(firstPlain);
  try{fn(args,stage,stdin);}catch(err){out("Error interno de la simulacion: "+err.message,"err");}
  return ctx;
}

function execute(raw){
  var line=raw.trim();
  if(!line)return;

  /* opciones numericas del menu */
  if(S.mode==="menu"&&/^[0-9]$/.test(line)){
    var map={0:"divisiones",1:"modo retos",2:"modo libre",3:"glosario",4:"fase",5:"progreso",6:"casos",7:"help",8:"teclas",9:"reiniciar"};
    line=map[line];
  }

  var redir=null,body=line;
  var m=body.match(/^(.*?)\s*(>>|>)\s*("[^"]+"|\S+)\s*$/);
  if(m&&m[1].trim()){body=m[1].trim();redir={mode:m[2],file:m[3].replace(/^"|"$/g,"")};}

  var stages=splitPipes(body);
  var ctx=null;

  if(stages.length===1&&!redir){
    ctx=runStage(stages[0],null);
  }else{
    var stdin=null,capLines=null;
    for(var i=0;i<stages.length;i++){
      CAP=[];
      var c=runStage(stages[i],stdin);
      capLines=CAP;CAP=null;
      if(c&&!c.bad)ctx=c;
      stdin=capLines;
    }
    if(redir){
      var t=resolve(redir.file),p=parentOf(t);
      if(!p||p.type!=="dir")out("No se puede abrir el archivo de salida.","err");
      else{
        var name=t[t.length-1],prev=p.children[findKey(p,name)||name];
        var text=(capLines||[]).join("\n")+"\n";
        if(redir.mode===">>"&&prev&&prev.type==="file")prev.content+=text;
        else p.children[name]=CC.F(text,{date:"06/10/2026  22:54"});
        out("        1 archivo(s) escrito(s) en "+realPath(t),"dim");
      }
      if(ctx)ctx.redir=redir;
    }else{
      (capLines||[]).forEach(function(l){outPre(l);});
    }
  }
  chrome();
  if(ctx&&!ctx.bad)afterCommand({cmd:ctx.cmd,args:ctx.args,raw:line,target:ctx.target});
  else if(ctx&&ctx.bad&&S.mode==="retos"){
    S.misses++;
    if(S.misses>=3){outBox("PISTA",[cutw(EX[S.idx].h,70)],"hi");S.misses=0;}
  }
}

/* ─────────── Autocompletado ─────────── */
function completar(entryEl){
  var parts=entryEl.value.split(" ");
  var frag=parts[parts.length-1];
  if(!frag)return;
  var base=frag.split("\\");
  var leaf=base.pop();
  var dirArr=base.length?resolve(base.join("\\")):S.cwd.slice();
  var dir=getNode(dirArr);
  if(!dir||dir.type!=="dir")return;
  var cands=Object.keys(dir.children).filter(function(k){
    return !dir.children[k].hidden&&k.toLowerCase().indexOf(leaf.toLowerCase())===0;
  });
  if(cands.length===1){
    parts[parts.length-1]=(base.length?base.join("\\")+"\\":"")+cands[0];
    entryEl.value=parts.join(" ");
  }else if(cands.length>1){out(cands.join("   "),"dim");}
}

/* ─────────── Modulo de la division ─────────── */
function cuenta(){return [solvedCount(),EX.length];}

CC.MODULO={
  id:"fileroom",
  corto:"RECORDS & EVIDENCE ROOM",
  nombre:"RECORDS & EVIDENCE ROOM  ·  SALA DE ARCHIVO Y CUSTODIA",
  lema:"el papel, las carpetas, la custodia",
  multilinea:false,
  arte:CC.ART.expediente,
  cabecera:[
    "Aqui no se resuelve ningun crimen: aqui se ordena lo que",
    "quedo de el. Carpetas, copias, atributos y cadenas de",
    "custodia, con los comandos reales de una consola MS-DOS.",
    "",
    "Todo lo que deje listo, Detective Moreno, es lo que la",
    "Data Forensics Desk podra consultar despues."],
  fkeys:{F1:"help",F2:"glosario",F3:"mision",F4:"pista"},
  prompt:function(){return pathStr(S.cwd)+">";},
  cuenta:cuenta,
  progreso:function(){var c=cuenta();return c[0]+"/"+c[1]+" tareas";},
  chrome:chrome,
  completar:completar,
  menu:function(){showMenu();},
  execute:execute,
  cargar:load,
  enter:function(){chrome();showMenu();}
};
UI.register(CC.MODULO);

CC.__test={S:S,execute:execute,EX:EX,boxLines:boxLines,wlen:wlen,chrome:chrome};

})();
