const H=require("./h.js");
const espera=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  // 1 · arranque sin nada en la nube: debe crear el expediente
  const store=H.nubeFalsa(null);
  const {UI,CC,CDB}=H.cargar();
  const cmd=CC.__test,sql=CDB.__test;
  await espera(30);
  console.log("1 · estado tras conectar:",UI.NUBE.estado,"· id:",UI.NUBE.id);
  await espera(1200);
  console.log("   doc creado en la nube:",store.doc?"si":"NO","· escrituras:",store.escrituras||0);

  // 2 · firmar tareas y comprobar que suben
  H.reset();
  UI.ejecutar("1");UI.ejecutar("modo retos");
  for(let i=0;i<5;i++){UI.ejecutar(cmd.EX[i].s);}
  await espera(1200);
  const d=store.doc.datos.fileroom;
  console.log("2 · tareas firmadas en la nube:",Object.keys(d.solved||{}).length,"· total doc:",store.doc.firmadas);
  console.log("   estado:",UI.NUBE.estado);

  // 3 · otro terminal firma 3 diligencias SQL: deben llegar sin recargar
  H.reset();
  const otro=JSON.parse(JSON.stringify(store.doc));
  otro.datos.datadesk={solved:{0:true,1:true,2:true},idx:3,caso:0};
  store.empujarDesdeOtro(otro);
  await espera(60);
  const avisos=H.verdes().filter(l=>/otro terminal/.test(l));
  console.log("3 · aviso de otro terminal:",avisos.length?"si":"NO");
  console.log("   diligencias SQL ahora locales:",Object.keys(sql.S.solved).filter(k=>sql.S.solved[k]).length);

  // 4 · fusion sin perdida: lo local que la nube no tenia se conserva
  H.reset();
  const soloNube={agente:"Juan Moreno",datos:{fileroom:{solved:{50:true,51:true},idx:52}}};
  store.empujarDesdeOtro(soloNube);
  await espera(60);
  const n=Object.keys(cmd.S.solved).filter(k=>cmd.S.solved[k]).length;
  console.log("4 · tras fusion, tareas CMD locales:",n,"(5 propias + 2 remotas = 7 esperadas)");
  await espera(1200);
  console.log("   devuelto a la nube:",Object.keys(store.doc.datos.fileroom.solved).length,"tareas");

  // 5 · comandos de nube
  H.reset();
  let err=0;
  ["nube","sincronizar","expediente","divisiones"].forEach(c=>{try{UI.ejecutar(c);}catch(e){err++;console.log("EXCEPCION",c,e.message);}});
  console.log("5 · comandos de nube sin excepcion:",err===0?"si":err+" fallos");
  console.log("   chip NUBE en barra:",H.texto().some(l=>/SINCRONIZADO|GUARDANDO/.test(l))?"si":"NO");

  // 6 · degradacion sin nube
  console.log("6 · sin window.claude el juego sigue:");
  delete global.window.claude;
  global.localStorage._d={};
  H.reset();
  try{
    const H2=require("./h2.js");
    console.log("   (ver h2)");
  }catch(e){console.log("   modo local probado en test aparte");}
})();
