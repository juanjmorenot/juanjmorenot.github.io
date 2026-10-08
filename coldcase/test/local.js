const H=require("./h.js");
const {UI,CC,CDB}=H.cargar();   // sin nubeFalsa: no hay window.claude
const cmd=CC.__test;
console.log("estado sin nube:",UI.NUBE.estado);
UI.ejecutar("1");UI.ejecutar("modo retos");
for(let i=0;i<4;i++)UI.ejecutar(cmd.EX[i].s);
const n=Object.keys(cmd.S.solved).filter(k=>cmd.S.solved[k]).length;
console.log("tareas firmadas solo en local:",n);
const g=JSON.parse(global.localStorage.getItem("coldcase_unificado_v1"));
console.log("guardado en localStorage:",Object.keys(g.datos.fileroom.solved).length,"tareas");
H.reset();UI.ejecutar("nube");
console.log("panel de nube dice SOLO LOCAL/LOCAL:",H.texto().some(l=>/LOCAL/.test(l))?"si":"NO");
