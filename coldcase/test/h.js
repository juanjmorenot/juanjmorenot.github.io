const fs=require("fs"),path=require("path"),vm=require("vm");
const base=path.join(__dirname,"..");
function El(tag){this.tag=tag;this.children=[];this.className="";this._t="";this.innerHTML="";this.value="";
  this.hidden=false;this.scrollTop=0;this.scrollHeight=0;this.clientHeight=400;this.selectionStart=0;this.selectionEnd=0;
  const self=this;this.classList={_s:new Set(),add(c){this._s.add(c)},remove(c){this._s.delete(c)},
    contains(c){return this._s.has(c)},toggle(c,v){v?this._s.add(c):this._s.delete(c)}};
  Object.defineProperty(this,"textContent",{get(){return self._t},
    set(v){self._t=String(v);if(global.__LOG)global.__BUF.push({t:String(v),c:self.className});}});}
El.prototype.appendChild=function(c){this.children.push(c);c.parentNode=this;return c;};
El.prototype.addEventListener=function(){};El.prototype.setAttribute=function(){};
El.prototype.focus=function(){};El.prototype.scrollIntoView=function(){};El.prototype.closest=function(){return null;};
El.prototype.removeChild=function(c){const i=this.children.indexOf(c);if(i>=0)this.children.splice(i,1);return c;};
El.prototype.getBoundingClientRect=function(){return {width:(this._t||"").length*8,height:16};};
Object.defineProperty(El.prototype,"style",{get(){return this._style||(this._style={cssText:"",height:""});}});
Object.defineProperty(El.prototype,"parentNode",{get(){return this._parent||null;},set(v){this._parent=v;}});
global.__BUF=[];global.__LOG=true;
const els={};const bodyEl=new El("body");
const doc={readyState:"complete",title:"",
  getElementById(id){return els[id]||(els[id]=new El("div"));},
  createElement(t){return new El(t);},
  createTextNode(t){const e=new El("#text");e.textContent=t;return e;},
  addEventListener(){},get body(){return bodyEl;},documentElement:bodyEl};
global.document=doc;
global.window={getSelection:()=>"",document:doc};
global.localStorage={_d:{},getItem(k){return this._d[k]||null},setItem(k,v){this._d[k]=v}};
global.window.localStorage=global.localStorage;
global.requestAnimationFrame=function(){};
global.performance={now:()=>Date.now()};

// almacen de nube simulado
function nubeFalsa(inicial){
  const store={doc:inicial?JSON.parse(JSON.stringify(inicial)):null};
  let subs=[];
  const ref={
    get(){return Promise.resolve(store.doc?{data:()=>JSON.parse(JSON.stringify(store.doc))}:null);},
    set(d){store.doc=JSON.parse(JSON.stringify(d));store.escrituras=(store.escrituras||0)+1;
           return Promise.resolve();},
    onSnapshot(fn){subs.push(fn);return function(){};}
  };
  store.ref=ref;
  store.empujarDesdeOtro=function(d){store.doc=JSON.parse(JSON.stringify(d));
    subs.forEach(f=>f({data:()=>JSON.parse(JSON.stringify(store.doc))}));};
  global.window.claude={use(n){
    if(n==="db")return Promise.resolve({collection:()=>({doc:()=>ref})});
    if(n==="user")return Promise.resolve({id:()=>Promise.resolve("det-moreno-1142")});
    return Promise.resolve(null);
  }};
  return store;
}
module.exports={cargar(){
  ["shell.js","cmd-fs.js","cmd-glossary.js","cmd-exercises.js","cmd-engine.js",
   "sql-db.js","sql-engine.js","sql-glossary.js","sql-retos.js","sql-app.js"]
   .forEach(f=>vm.runInThisContext(fs.readFileSync(path.join(base,f),"utf8"),{filename:f}));
  global.window.UI.start();
  return {UI:global.window.UI,CC:global.window.CC,CDB:global.window.CDB};
},nubeFalsa,
texto:()=>global.__BUF.map(x=>x.t),
verdes:()=>global.__BUF.filter(x=>/good/.test(x.c)).map(x=>x.t),
reset(){global.__BUF=[];}};
