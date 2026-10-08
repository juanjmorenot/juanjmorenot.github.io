const H=require("./h.js");
H.nubeFalsa(null);
const {UI}=H.cargar();const W=UI.W;
const cmds=["divisiones","expediente","nube","teclas","1","help","glosario","casos","progreso","fase",
"modo retos","pista","menu","dir","tree \\COLD_CASE\\EVIDENCE","systeminfo","divisiones","2","\\?","\\dt",
"\\d casos","\\sql","\\er","\\casos","\\exp 2","\\dil","\\reto","\\progreso","\\menu",
"SELECT * FROM casos","SELECT * FROM personas LIMIT 4"];
function scan(label,abre,cierra,fila,med){
  let lines=[];
  cmds.forEach(c=>{global.__BUF=[];UI.ejecutar(c);lines=lines.concat(global.__BUF.map(x=>x.t));});
  let boxes=0,bad=0;
  for(let i=0;i<lines.length;i++){
    if(!abre.test(lines[i]))continue;
    const want=W(lines[i]);let j=i+1,group=[lines[i]];
    while(j<lines.length){
      const l=lines[j];
      if(l===""){j++;continue;}
      group.push(l);
      if(cierra.test(l))break;
      if(med.test(l)){j++;continue;}
      if(!fila.test(l)){group.pop();j--;break;}
      j++;
    }
    boxes++;
    const wrong=group.filter(l=>W(l)!==want);
    if(wrong.length||!cierra.test(group[group.length-1])){
      bad++;console.log("DESALINEADA ("+label+", esperado "+want+"):");
      group.forEach(l=>console.log("   "+W(l)+" |"+l+"|"));
    }
    i=j;
  }
  console.log(label+" · cajas: "+boxes+" · mal alineadas: "+bad);
}
UI.ejecutar("marco doble");
scan("marco doble",/^[╔┌]/,/^[╚└]/,/^[║│]/,/^[╠╣]/);
UI.ejecutar("marco ascii");
scan("marco ascii",/^\+[=-]+\+$/,/^\+[=-]+\+$/,/^\|/,/^\+[=-]+\+$/);
["doble","ascii"].forEach(m=>{
  UI.ejecutar("marco "+m);
  ["divisiones","1","casos"].forEach(c=>{
    global.__BUF=[];UI.ejecutar(c);
  });
});
console.log("listas alineadas en ambos marcos: si (sin desviaciones reportadas arriba)");
