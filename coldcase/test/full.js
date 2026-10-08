const H=require("./h.js");
H.nubeFalsa(null);
const {UI,CC,CDB}=H.cargar();
const cmd=CC.__test,sql=CDB.__test,NT=CDB.NUM_TPL;
let f=0;
UI.ejecutar("1");UI.ejecutar("modo retos");
for(let i=0;i<cmd.EX.length;i++){
  if(cmd.S.idx!==i){f++;cmd.S.idx=i;}
  UI.ejecutar(cmd.EX[i].s);
  if(!cmd.S.solved[i]){f++;cmd.S.solved[i]=true;cmd.S.idx=i+1;}
}
console.log("tareas CMD:",Object.keys(cmd.S.solved).filter(k=>cmd.S.solved[k]).length,"/",cmd.EX.length,"· fallos:",f);
UI.ejecutar("divisiones");UI.ejecutar("2");
let f2=0;
for(let c=1;c<=7;c++){
  UI.ejecutar("\\exp "+c);
  for(let k=0;k<NT;k++){
    const i=(c-1)*NT+k;
    if(sql.S.idx!==i){f2++;sql.S.idx=i;}
    UI.ejecutar(sql.S.retos[i].sql);
    if(!sql.S.solved[i]){f2++;sql.S.solved[i]=true;sql.S.idx=i+1;}
  }
}
console.log("diligencias SQL:",Object.keys(sql.S.solved).filter(k=>sql.S.solved[k]).length,"/",sql.S.retos.length,"· fallos:",f2);
console.log("cierre de los siete expedientes:",H.verdes().some(l=>/SIETE EXPEDIENTES ESTAN CERRADOS/.test(l))?"si":"NO");
