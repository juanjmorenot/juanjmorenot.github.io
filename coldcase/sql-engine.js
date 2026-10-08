/* ═══════════════════════════════════════════════════════════════
   COLDBASE · Motor SQL
   Subconjunto de PostgreSQL: WITH, SELECT DISTINCT, JOIN (INNER /
   LEFT / RIGHT / CROSS), WHERE, GROUP BY, HAVING, ORDER BY, LIMIT,
   OFFSET, UNION / EXCEPT / INTERSECT, subconsultas escalares,
   IN / EXISTS correlacionadas, CASE, CAST, ::, ||, LIKE / ILIKE,
   BETWEEN, IS NULL, agregados y funciones de texto y fecha.
   ═══════════════════════════════════════════════════════════════ */
var CDB = window.CDB || {};
window.CDB = CDB;

(function(){
"use strict";

function SqlError(msg,pos,hint){
  var e=new Error(msg);e.sql=true;e.pos=pos;e.hint=hint;return e;
}
CDB.SqlError=SqlError;

/* ─────────── Lexico ─────────── */
var KW={};
("SELECT FROM WHERE GROUP BY HAVING ORDER LIMIT OFFSET JOIN INNER LEFT RIGHT FULL CROSS OUTER ON AS AND OR NOT "+
 "NULL IS IN LIKE ILIKE BETWEEN CASE WHEN THEN ELSE END DISTINCT UNION ALL EXCEPT INTERSECT EXISTS WITH "+
 "ASC DESC CAST TRUE FALSE EXTRACT FOR USING").split(" ").forEach(function(k){KW[k]=true;});

function lex(s){
  var t=[],i=0,two=["<>","!=","<=",">=","||","::"];
  while(i<s.length){
    var ch=s[i];
    if(/\s/.test(ch)){i++;continue;}
    if(ch==="-"&&s[i+1]==="-"){while(i<s.length&&s[i]!=="\n")i++;continue;}
    if(/[0-9]/.test(ch)||(ch==="."&&/[0-9]/.test(s[i+1]||""))){
      var j=i;while(j<s.length&&/[0-9.]/.test(s[j]))j++;
      t.push({t:"num",v:parseFloat(s.slice(i,j)),p:i});i=j;continue;
    }
    if(ch==="'"){
      var j=i+1,o="";
      while(j<s.length){
        if(s[j]==="'"&&s[j+1]==="'"){o+="'";j+=2;continue;}
        if(s[j]==="'"){j++;break;}
        o+=s[j++];
      }
      t.push({t:"str",v:o,p:i});i=j;continue;
    }
    if(ch==='"'){
      var j=i+1,o="";while(j<s.length&&s[j]!=='"')o+=s[j++];j++;
      t.push({t:"id",v:o,up:o.toUpperCase(),quoted:true,p:i});i=j;continue;
    }
    if(/[A-Za-z_]/.test(ch)){
      var j=i;while(j<s.length&&/[A-Za-z0-9_$]/.test(s[j]))j++;
      var w=s.slice(i,j);
      t.push({t:"id",v:w,up:w.toUpperCase(),p:i});i=j;continue;
    }
    var tw=s.substr(i,2);
    if(two.indexOf(tw)>-1){t.push({t:"op",v:tw,p:i});i+=2;continue;}
    if("()+-*/%,.;=<>".indexOf(ch)>-1){t.push({t:"op",v:ch,p:i});i++;continue;}
    throw SqlError('caracter no valido "'+ch+'"',i);
  }
  t.push({t:"eof",v:"",p:s.length});
  return t;
}

/* ─────────── Analizador sintactico ─────────── */
function Parser(sql){this.sql=sql;this.k=lex(sql);this.i=0;}
Parser.prototype.pk=function(n){return this.k[this.i+(n||0)];};
Parser.prototype.isKw=function(w,n){var x=this.pk(n);return x.t==="id"&&!x.quoted&&x.up===w;};
Parser.prototype.isOp=function(v,n){var x=this.pk(n);return x.t==="op"&&x.v===v;};
Parser.prototype.eatKw=function(w){if(this.isKw(w)){this.i++;return true;}return false;};
Parser.prototype.eatOp=function(v){if(this.isOp(v)){this.i++;return true;}return false;};
Parser.prototype.need=function(cond,what){
  if(!cond){var x=this.pk();throw SqlError('error de sintaxis cerca de "'+(x.v===""?"fin de la consulta":x.v)+'", se esperaba '+what,x.p);}
};
Parser.prototype.expectKw=function(w){this.need(this.eatKw(w),w);};
Parser.prototype.expectOp=function(v){this.need(this.eatOp(v),'"'+v+'"');};
Parser.prototype.ident=function(){
  var x=this.pk();
  this.need(x.t==="id","un nombre");
  this.i++;
  return x.quoted?x.v:x.v.toLowerCase();
};

Parser.prototype.parse=function(){
  var q=this.parseQuery();
  this.eatOp(";");
  this.need(this.pk().t==="eof",'el final de la consulta');
  return q;
};

Parser.prototype.parseQuery=function(){
  var ctes=null;
  if(this.eatKw("WITH")){
    ctes=[];
    do{
      var name=this.ident();
      this.expectKw("AS");
      this.expectOp("(");
      var q=this.parseQuery();
      this.expectOp(")");
      ctes.push({name:name,query:q});
    }while(this.eatOp(","));
  }
  var left=this.parseSelect();
  while(this.isKw("UNION")||this.isKw("EXCEPT")||this.isKw("INTERSECT")){
    var op=this.pk().up;this.i++;
    var all=this.eatKw("ALL");
    var right=this.parseSelect();
    left={type:"setop",op:op,all:all,left:left,right:right};
  }
  if(ctes)left={type:"with",ctes:ctes,body:left};
  return left;
};

Parser.prototype.parseSelect=function(){
  if(this.eatOp("(")){
    var inner=this.parseQuery();
    this.expectOp(")");
    return inner;
  }
  this.expectKw("SELECT");
  var n={type:"select",distinct:false,columns:[],from:[],where:null,groupBy:null,having:null,orderBy:null,limit:null,offset:null};
  if(this.eatKw("DISTINCT"))n.distinct=true;
  else this.eatKw("ALL");
  do{
    if(this.isOp("*")&&!this.isOp("(",1)){this.i++;n.columns.push({star:true});continue;}
    if(this.pk().t==="id"&&this.isOp(".",1)&&this.isOp("*",2)){
      var tb=this.ident();this.i+=2;
      n.columns.push({star:true,table:tb});continue;
    }
    var e=this.parseExpr(),alias=null;
    if(this.eatKw("AS"))alias=this.ident();
    else if(this.pk().t==="id"&&!KW[this.pk().up])alias=this.ident();
    n.columns.push({expr:e,alias:alias});
  }while(this.eatOp(","));

  if(this.eatKw("FROM")){
    do{ n.from.push(this.parseFromItem()); }while(this.eatOp(","));
  }
  if(this.eatKw("WHERE"))n.where=this.parseExpr();
  if(this.eatKw("GROUP")){this.expectKw("BY");n.groupBy=[];do{n.groupBy.push(this.parseExpr());}while(this.eatOp(","));}
  if(this.eatKw("HAVING"))n.having=this.parseExpr();
  if(this.eatKw("ORDER")){
    this.expectKw("BY");n.orderBy=[];
    do{
      var ex=this.parseExpr(),dir="ASC";
      if(this.eatKw("DESC"))dir="DESC";else this.eatKw("ASC");
      n.orderBy.push({expr:ex,dir:dir});
    }while(this.eatOp(","));
  }
  if(this.eatKw("LIMIT")){
    if(this.eatKw("ALL"))n.limit=null;
    else n.limit=this.parseExpr();
  }
  if(this.eatKw("OFFSET"))n.offset=this.parseExpr();
  if(this.eatKw("LIMIT"))n.limit=this.parseExpr();
  return n;
};

Parser.prototype.parseFromItem=function(){
  var it=this.parseFromAtom();
  for(;;){
    var type=null;
    if(this.isKw("JOIN")){this.i++;type="INNER";}
    else if(this.isKw("INNER")&&this.isKw("JOIN",1)){this.i+=2;type="INNER";}
    else if(this.isKw("CROSS")&&this.isKw("JOIN",1)){this.i+=2;type="CROSS";}
    else if((this.isKw("LEFT")||this.isKw("RIGHT")||this.isKw("FULL"))){
      var k=this.pk().up;var j=1;
      if(this.isKw("OUTER",j))j++;
      if(this.isKw("JOIN",j)){this.i+=j+1;type=k;}
    }
    if(!type)break;
    var right=this.parseFromAtom(),on=null,using=null;
    if(this.eatKw("ON"))on=this.parseExpr();
    else if(this.eatKw("USING")){this.expectOp("(");using=[];do{using.push(this.ident());}while(this.eatOp(","));this.expectOp(")");}
    else if(type!=="CROSS")this.need(false,"ON");
    it.joins=it.joins||[];
    it.joins.push({type:type,src:right,on:on,using:using});
  }
  return it;
};

Parser.prototype.parseFromAtom=function(){
  var src,alias=null;
  if(this.eatOp("(")){
    var q=this.parseQuery();
    this.expectOp(")");
    src={sub:q};
  }else{
    var name=this.ident();
    if(this.eatOp(".")){name=this.ident();}  /* esquema.tabla */
    src={table:name};
  }
  if(this.eatKw("AS"))alias=this.ident();
  else if(this.pk().t==="id"&&!KW[this.pk().up])alias=this.ident();
  return {src:src,alias:alias,joins:null};
};

/* ── expresiones ── */
Parser.prototype.parseExpr=function(){return this.parseOr();};
Parser.prototype.parseOr=function(){
  var l=this.parseAnd();
  while(this.eatKw("OR"))l={type:"bin",op:"OR",l:l,r:this.parseAnd()};
  return l;
};
Parser.prototype.parseAnd=function(){
  var l=this.parseNot();
  while(this.eatKw("AND"))l={type:"bin",op:"AND",l:l,r:this.parseNot()};
  return l;
};
Parser.prototype.parseNot=function(){
  if(this.eatKw("NOT"))return {type:"un",op:"NOT",e:this.parseNot()};
  return this.parseCmp();
};
Parser.prototype.parseCmp=function(){
  var l=this.parseConcat();
  for(;;){
    if(this.isKw("IS")){
      this.i++;
      var neg=this.eatKw("NOT");
      this.expectKw("NULL");
      l={type:"isnull",e:l,neg:neg};continue;
    }
    var neg2=false,save=this.i;
    if(this.isKw("NOT")&&(this.isKw("IN",1)||this.isKw("LIKE",1)||this.isKw("ILIKE",1)||this.isKw("BETWEEN",1))){this.i++;neg2=true;}
    if(this.eatKw("IN")){
      this.expectOp("(");
      var sub=null,list=null;
      if(this.isKw("SELECT")||this.isKw("WITH")){sub=this.parseQuery();}
      else{list=[];do{list.push(this.parseExpr());}while(this.eatOp(","));}
      this.expectOp(")");
      l={type:"in",e:l,sub:sub,list:list,neg:neg2};continue;
    }
    if(this.isKw("LIKE")||this.isKw("ILIKE")){
      var ci=this.pk().up==="ILIKE";this.i++;
      l={type:"like",e:l,pat:this.parseConcat(),ci:ci,neg:neg2};continue;
    }
    if(this.eatKw("BETWEEN")){
      var a=this.parseConcat();this.expectKw("AND");var b=this.parseConcat();
      l={type:"between",e:l,a:a,b:b,neg:neg2};continue;
    }
    if(neg2){this.i=save;}
    var x=this.pk();
    if(x.t==="op"&&["=","<>","!=","<",">","<=",">="].indexOf(x.v)>-1){
      this.i++;
      l={type:"bin",op:x.v==="!="?"<>":x.v,l:l,r:this.parseConcat()};continue;
    }
    break;
  }
  return l;
};
Parser.prototype.parseConcat=function(){
  var l=this.parseAdd();
  while(this.isOp("||")){this.i++;l={type:"bin",op:"||",l:l,r:this.parseAdd()};}
  return l;
};
Parser.prototype.parseAdd=function(){
  var l=this.parseMul();
  for(;;){
    if(this.isOp("+")){this.i++;l={type:"bin",op:"+",l:l,r:this.parseMul()};}
    else if(this.isOp("-")){this.i++;l={type:"bin",op:"-",l:l,r:this.parseMul()};}
    else break;
  }
  return l;
};
Parser.prototype.parseMul=function(){
  var l=this.parseUnary();
  for(;;){
    if(this.isOp("*")){this.i++;l={type:"bin",op:"*",l:l,r:this.parseUnary()};}
    else if(this.isOp("/")){this.i++;l={type:"bin",op:"/",l:l,r:this.parseUnary()};}
    else if(this.isOp("%")){this.i++;l={type:"bin",op:"%",l:l,r:this.parseUnary()};}
    else break;
  }
  return l;
};
Parser.prototype.parseUnary=function(){
  if(this.isOp("-")){this.i++;return {type:"un",op:"-",e:this.parseUnary()};}
  if(this.isOp("+")){this.i++;return this.parseUnary();}
  return this.parsePostfix();
};
Parser.prototype.parsePostfix=function(){
  var e=this.parsePrimary();
  while(this.isOp("::")){this.i++;var ty=this.ident();e={type:"cast",e:e,to:ty};}
  return e;
};
Parser.prototype.parsePrimary=function(){
  var x=this.pk();
  if(x.t==="num"){this.i++;return {type:"lit",v:x.v};}
  if(x.t==="str"){this.i++;return {type:"lit",v:x.v};}
  if(this.isKw("NULL")){this.i++;return {type:"lit",v:null};}
  if(this.isKw("TRUE")){this.i++;return {type:"lit",v:true};}
  if(this.isKw("FALSE")){this.i++;return {type:"lit",v:false};}
  if(this.isKw("CASE")){
    this.i++;
    var operand=null;
    if(!this.isKw("WHEN"))operand=this.parseExpr();
    var whens=[],els=null;
    while(this.eatKw("WHEN")){
      var c=this.parseExpr();this.expectKw("THEN");
      whens.push({when:c,then:this.parseExpr()});
    }
    if(this.eatKw("ELSE"))els=this.parseExpr();
    this.expectKw("END");
    return {type:"case",operand:operand,whens:whens,els:els};
  }
  if(this.isKw("EXISTS")&&this.isOp("(",1)){
    this.i+=2;var q=this.parseQuery();this.expectOp(")");
    return {type:"exists",sub:q};
  }
  if(this.isKw("CAST")&&this.isOp("(",1)){
    this.i+=2;var e=this.parseExpr();this.expectKw("AS");var ty=this.ident();this.expectOp(")");
    return {type:"cast",e:e,to:ty};
  }
  if(this.isKw("EXTRACT")&&this.isOp("(",1)){
    this.i+=2;var part=this.ident();this.expectKw("FROM");var ex=this.parseExpr();this.expectOp(")");
    return {type:"extract",part:part.toLowerCase(),e:ex};
  }
  if(this.eatOp("(")){
    if(this.isKw("SELECT")||this.isKw("WITH")){
      var q2=this.parseQuery();this.expectOp(")");
      return {type:"scalar",sub:q2};
    }
    var inner=this.parseExpr();this.expectOp(")");
    return inner;
  }
  if(x.t==="id"){
    /* funcion */
    if(this.isOp("(",1)){
      var fname=x.up;this.i+=2;
      var args=[],distinct=false,star=false;
      if(this.isOp("*")&&this.isOp(")",1)){this.i++;star=true;}
      else if(!this.isOp(")")){
        if(this.eatKw("DISTINCT"))distinct=true;
        do{
          args.push(this.parseExpr());
          if(this.eatKw("FROM")){args.push(this.parseExpr());}
          if(this.eatKw("FOR")){args.push(this.parseExpr());}
        }while(this.eatOp(","));
      }
      this.expectOp(")");
      return {type:"func",name:fname,args:args,distinct:distinct,star:star};
    }
    var name=this.ident(),table=null;
    if(this.isOp(".")&&this.pk(1).t==="id"){
      this.i++;table=name;name=this.ident();
      if(this.isOp(".")&&this.pk(1).t==="id"){this.i++;table=name;name=this.ident();}
    }
    return {type:"col",table:table,name:name};
  }
  this.need(false,"una expresion");
};

/* ─────────── Utilidades de valores ─────────── */
function isNum(v){return typeof v==="number";}
function num(v){
  if(v===null||v===undefined)return null;
  if(typeof v==="number")return v;
  if(typeof v==="boolean")return v?1:0;
  var n=parseFloat(v);
  return isNaN(n)?null:n;
}
function looksNum(v){return typeof v==="number"||(typeof v==="string"&&v!==""&&!isNaN(Number(v)));}
function cmp(a,b){
  if(a===null||b===null)return null;
  if(typeof a==="boolean")a=a?1:0;
  if(typeof b==="boolean")b=b?1:0;
  if(typeof a==="number"&&typeof b==="number")return a<b?-1:a>b?1:0;
  if(typeof a==="number"&&looksNum(b))return cmp(a,Number(b));
  if(typeof b==="number"&&looksNum(a))return cmp(Number(a),b);
  a=String(a);b=String(b);
  return a<b?-1:a>b?1:0;
}
function truthy(v){return v===true||v===1||(typeof v==="string"&&v.toLowerCase()==="true");}
function likeRe(pat,ci){
  var re="^";
  for(var i=0;i<pat.length;i++){
    var c=pat[i];
    if(c==="%")re+="[\\s\\S]*";
    else if(c==="_")re+="[\\s\\S]";
    else re+=c.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  }
  return new RegExp(re+"$",ci?"i":"");
}

var AGG={COUNT:1,SUM:1,AVG:1,MIN:1,MAX:1,STRING_AGG:1};

/* ─────────── Ejecucion ─────────── */
function Engine(db){this.db=db;this.ctes={};}
CDB.Engine=Engine;

Engine.prototype.table=function(name,pos){
  var n=String(name).toLowerCase();
  if(this.ctes[n])return this.ctes[n];
  var t=this.db.tables[n];
  if(!t)throw SqlError('la relacion "'+name+'" no existe',pos,"Usa \\dt para ver las tablas disponibles.");
  return {cols:t.cols.slice(),rows:t.rows.map(function(r){return r.slice();})};
};

Engine.prototype.run=function(node,outer){
  if(node.type==="with"){
    var saved={},self=this;
    node.ctes.forEach(function(c){
      var r=self.run(c.query,outer);
      saved[c.name.toLowerCase()]=self.ctes[c.name.toLowerCase()];
      self.ctes[c.name.toLowerCase()]={cols:r.names.slice(),rows:r.rows.map(function(x){return x.slice();})};
    });
    var out=this.run(node.body,outer);
    Object.keys(saved).forEach(function(k){
      if(saved[k]===undefined)delete self.ctes[k];else self.ctes[k]=saved[k];
    });
    return out;
  }
  if(node.type==="setop"){
    var a=this.run(node.left,outer),b=this.run(node.right,outer);
    if(a.names.length!==b.names.length)
      throw SqlError("cada consulta de "+node.op+" debe tener el mismo numero de columnas");
    var key=function(r){return JSON.stringify(r.map(function(v){return v===null?null:String(v);}));};
    var rows;
    if(node.op==="UNION"){
      rows=a.rows.concat(b.rows);
      if(!node.all)rows=dedupe(rows,key);
    }else if(node.op==="EXCEPT"){
      var bs={};b.rows.forEach(function(r){bs[key(r)]=1;});
      rows=dedupe(a.rows.filter(function(r){return !bs[key(r)];}),key);
    }else{
      var bs2={};b.rows.forEach(function(r){bs2[key(r)]=1;});
      rows=dedupe(a.rows.filter(function(r){return bs2[key(r)];}),key);
    }
    return {names:a.names,rows:rows};
  }
  return this.select(node,outer);
};
function dedupe(rows,key){
  var seen={},out=[];
  rows.forEach(function(r){var k=key(r);if(!seen[k]){seen[k]=1;out.push(r);}});
  return out;
}

Engine.prototype.source=function(item,outer){
  var self=this,base;
  if(item.src.sub){
    var r=this.run(item.src.sub,outer);
    base={cols:r.names.slice(),rows:r.rows.map(function(x){return x.slice();})};
    if(!item.alias)item.alias="subconsulta";
  }else{
    base=this.table(item.src.table);
    if(!item.alias)item.alias=item.src.table;
  }
  var alias=item.alias.toLowerCase();
  var cols=base.cols.map(function(c){return {t:alias,n:String(c).toLowerCase()};});
  var rows=base.rows.map(function(r){
    var o={};
    cols.forEach(function(c,i){o[c.t+"."+c.n]=r[i];if(!(c.n in o))o[c.n]=r[i];});
    return o;
  });
  var cur={cols:cols,rows:rows};
  (item.joins||[]).forEach(function(j){
    var right=self.source(j.src,outer);
    cur=self.join(cur,right,j,outer);
  });
  return cur;
};

Engine.prototype.join=function(a,b,j,outer){
  var self=this,cols=a.cols.concat(b.cols),rows=[];
  var nullRight={},nullLeft={};
  b.cols.forEach(function(c){nullRight[c.t+"."+c.n]=null;nullRight[c.n]=null;});
  a.cols.forEach(function(c){nullLeft[c.t+"."+c.n]=null;nullLeft[c.n]=null;});
  function merge(x,y){var o={};for(var k in x)o[k]=x[k];for(var k2 in y)if(!(k2 in o)||y[k2]!==undefined)o[k2]=y[k2];return o;}
  function test(r){
    if(j.type==="CROSS")return true;
    if(j.using){
      return j.using.every(function(c){
        var l=r[a.cols.filter(function(x){return x.n===c;})[0].t+"."+c];
        var rr=r[b.cols.filter(function(x){return x.n===c;})[0].t+"."+c];
        return cmp(l,rr)===0;
      });
    }
    return truthy(self.eval(j.on,r,null,outer));
  }
  var matchedRight={};
  a.rows.forEach(function(ra){
    var hit=false;
    b.rows.forEach(function(rb,bi){
      var r=merge(ra,rb);
      if(test(r)){hit=true;matchedRight[bi]=1;rows.push(r);}
    });
    if(!hit&&(j.type==="LEFT"||j.type==="FULL"))rows.push(merge(ra,nullRight));
  });
  if(j.type==="RIGHT"||j.type==="FULL"){
    b.rows.forEach(function(rb,bi){
      if(!matchedRight[bi])rows.push(merge(nullLeft,rb));
    });
  }
  return {cols:cols,rows:rows};
};

function hasAgg(e){
  if(!e||typeof e!=="object")return false;
  if(e.type==="func"&&AGG[e.name])return true;
  if(e.type==="scalar"||e.type==="exists")return false;
  for(var k in e){
    var v=e[k];
    if(Array.isArray(v)){for(var i=0;i<v.length;i++)if(hasAgg(v[i])||hasAgg(v[i]&&v[i].expr))return true;}
    else if(v&&typeof v==="object"&&hasAgg(v))return true;
  }
  return false;
}

Engine.prototype.select=function(n,outer){
  var self=this,src={cols:[],rows:[{}]};
  if(n.from.length){
    src=this.source(n.from[0],outer);
    for(var i=1;i<n.from.length;i++){
      var other=this.source(n.from[i],outer);
      src=this.join(src,other,{type:"CROSS"},outer);
    }
  }
  var rows=src.rows;
  if(n.where)rows=rows.filter(function(r){return truthy(self.eval(n.where,r,null,outer));});

  /* columnas de salida */
  var out=[];
  n.columns.forEach(function(c){
    if(c.star){
      src.cols.forEach(function(col){
        if(c.table&&col.t!==c.table.toLowerCase())return;
        out.push({expr:{type:"col",table:col.t,name:col.n},name:col.n});
      });
    }else{
      out.push({expr:c.expr,name:c.alias||exprName(c.expr)});
    }
  });
  if(!out.length)throw SqlError("la consulta no selecciona ninguna columna");

  var agg=n.groupBy||out.some(function(o){return hasAgg(o.expr);})||hasAgg(n.having);
  var groups;
  if(agg){
    if(n.groupBy){
      var map={},order=[];
      rows.forEach(function(r){
        var key=JSON.stringify(n.groupBy.map(function(g){var v=self.eval(g,r,null,outer);return v===null?null:String(v);}));
        if(!map[key]){map[key]={rep:r,rows:[]};order.push(key);}
        map[key].rows.push(r);
      });
      groups=order.map(function(k){return map[k];});
    }else{
      groups=[{rep:rows[0]||{},rows:rows}];
    }
    if(n.having)groups=groups.filter(function(g){return truthy(self.eval(n.having,g.rep,g.rows,outer));});
    var res=groups.map(function(g){
      return out.map(function(o){return self.eval(o.expr,g.rep,g.rows,outer);});
    });
    var ctxs=groups.map(function(g){return g;});
    return this.finish(n,out,res,ctxs,outer);
  }
  var res2=rows.map(function(r){
    return out.map(function(o){return self.eval(o.expr,r,null,outer);});
  });
  return this.finish(n,out,res2,rows.map(function(r){return {rep:r,rows:null};}),outer);
};

Engine.prototype.finish=function(n,out,res,ctxs,outer){
  var self=this,names=out.map(function(o){return o.name;});
  if(n.orderBy){
    var idx=res.map(function(r,i){return i;});
    idx.sort(function(x,y){
      for(var k=0;k<n.orderBy.length;k++){
        var ob=n.orderBy[k],va,vb;
        if(ob.expr.type==="lit"&&typeof ob.expr.v==="number"){
          va=res[x][ob.expr.v-1];vb=res[y][ob.expr.v-1];
        }else if(ob.expr.type==="col"&&!ob.expr.table&&names.indexOf(ob.expr.name)>-1&&!(ctxs[x].rep&&(ob.expr.name in ctxs[x].rep))){
          var p=names.indexOf(ob.expr.name);va=res[x][p];vb=res[y][p];
        }else{
          va=self.eval(ob.expr,ctxs[x].rep,ctxs[x].rows,outer);
          vb=self.eval(ob.expr,ctxs[y].rep,ctxs[y].rows,outer);
        }
        var c=va===null&&vb===null?0:va===null?1:vb===null?-1:cmp(va,vb);
        if(c)return ob.dir==="DESC"?-c:c;
      }
      return x-y;
    });
    res=idx.map(function(i){return res[i];});
  }
  if(n.distinct)res=dedupe(res,function(r){return JSON.stringify(r.map(function(v){return v===null?null:String(v);}));});
  var off=n.offset?num(this.eval(n.offset,{},null,outer))||0:0;
  var lim=n.limit?num(this.eval(n.limit,{},null,outer)):null;
  if(off)res=res.slice(off);
  if(lim!==null&&lim!==undefined)res=res.slice(0,lim);
  return {names:names,rows:res};
};

function exprName(e){
  if(!e)return "?column?";
  if(e.type==="col")return e.name;
  if(e.type==="func")return e.name.toLowerCase();
  if(e.type==="case")return "case";
  if(e.type==="cast")return e.to.toLowerCase();
  if(e.type==="extract")return "extract";
  return "?column?";
}

/* ─────────── Evaluacion de expresiones ─────────── */
Engine.prototype.eval=function(e,row,group,outer){
  var self=this;
  if(e===null||e===undefined)return null;
  switch(e.type){
    case "lit": return e.v;
    case "col": {
      var k=e.table?e.table.toLowerCase()+"."+e.name:e.name;
      if(row&&Object.prototype.hasOwnProperty.call(row,k))return row[k];
      if(outer&&Object.prototype.hasOwnProperty.call(outer,k))return outer[k];
      throw SqlError('la columna "'+(e.table?e.table+".":"")+e.name+'" no existe',null,
        "Comprueba el nombre con \\d <tabla>.");
    }
    case "un":
      if(e.op==="NOT"){var v=this.eval(e.e,row,group,outer);return v===null?null:!truthy(v);}
      return -num(this.eval(e.e,row,group,outer));
    case "bin": {
      if(e.op==="AND"){
        var a=this.eval(e.l,row,group,outer);
        if(a!==null&&!truthy(a))return false;
        var b=this.eval(e.r,row,group,outer);
        if(a===null||b===null)return (b!==null&&!truthy(b))?false:null;
        return truthy(a)&&truthy(b);
      }
      if(e.op==="OR"){
        var a2=this.eval(e.l,row,group,outer);
        if(a2!==null&&truthy(a2))return true;
        var b2=this.eval(e.r,row,group,outer);
        if(a2===null||b2===null)return (b2!==null&&truthy(b2))?true:null;
        return truthy(a2)||truthy(b2);
      }
      var l=this.eval(e.l,row,group,outer),r=this.eval(e.r,row,group,outer);
      if(e.op==="||")return (l===null&&r===null)?null:String(l===null?"":l)+String(r===null?"":r);
      if(["=","<>","<",">","<=",">="].indexOf(e.op)>-1){
        var c=cmp(l,r);
        if(c===null)return null;
        switch(e.op){
          case "=":return c===0;case "<>":return c!==0;case "<":return c<0;
          case ">":return c>0;case "<=":return c<=0;default:return c>=0;
        }
      }
      var ln=num(l),rn=num(r);
      if(ln===null||rn===null)return null;
      switch(e.op){
        case "+":return ln+rn;case "-":return ln-rn;case "*":return ln*rn;
        case "/":return rn===0?null:(Number.isInteger(ln)&&Number.isInteger(rn)?Math.trunc(ln/rn):ln/rn);
        case "%":return rn===0?null:ln%rn;
      }
      return null;
    }
    case "isnull": {
      var v2=this.eval(e.e,row,group,outer);
      return e.neg?v2!==null:v2===null;
    }
    case "in": {
      var v3=this.eval(e.e,row,group,outer);
      if(v3===null)return null;
      var vals;
      if(e.sub){
        var rr=this.run(e.sub,mergeOuter(row,outer));
        vals=rr.rows.map(function(x){return x[0];});
      }else vals=e.list.map(function(x){return self.eval(x,row,group,outer);});
      var hit=vals.some(function(x){return cmp(v3,x)===0;});
      return e.neg?!hit:hit;
    }
    case "like": {
      var s=this.eval(e.e,row,group,outer),p=this.eval(e.pat,row,group,outer);
      if(s===null||p===null)return null;
      var m=likeRe(String(p),e.ci).test(String(s));
      return e.neg?!m:m;
    }
    case "between": {
      var x1=this.eval(e.e,row,group,outer),a3=this.eval(e.a,row,group,outer),b3=this.eval(e.b,row,group,outer);
      if(x1===null||a3===null||b3===null)return null;
      var inr=cmp(x1,a3)>=0&&cmp(x1,b3)<=0;
      return e.neg?!inr:inr;
    }
    case "case": {
      var opv=e.operand?this.eval(e.operand,row,group,outer):null;
      for(var i=0;i<e.whens.length;i++){
        var w=e.whens[i];
        var ok=e.operand?cmp(opv,this.eval(w.when,row,group,outer))===0:truthy(this.eval(w.when,row,group,outer));
        if(ok)return this.eval(w.then,row,group,outer);
      }
      return e.els?this.eval(e.els,row,group,outer):null;
    }
    case "exists": {
      var r4=this.run(e.sub,mergeOuter(row,outer));
      return r4.rows.length>0;
    }
    case "scalar": {
      var r5=this.run(e.sub,mergeOuter(row,outer));
      if(!r5.rows.length)return null;
      return r5.rows[0][0];
    }
    case "cast": return castTo(this.eval(e.e,row,group,outer),e.to);
    case "extract": {
      var d=this.eval(e.e,row,group,outer);
      if(d===null)return null;
      var s2=String(d),m2=s2.match(/(\d{4})-(\d{2})-(\d{2})/);
      if(e.part==="year")return m2?+m2[1]:null;
      if(e.part==="month")return m2?+m2[2]:null;
      if(e.part==="day")return m2?+m2[3]:null;
      var h=s2.match(/(\d{2}):(\d{2})/);
      if(e.part==="hour")return h?+h[1]:null;
      if(e.part==="minute")return h?+h[2]:null;
      return null;
    }
    case "func": return this.fn(e,row,group,outer);
  }
  throw SqlError("expresion no soportada");
};
function mergeOuter(row,outer){
  var o={};
  if(outer)for(var k in outer)o[k]=outer[k];
  if(row)for(var k2 in row)o[k2]=row[k2];
  return o;
}
function castTo(v,ty){
  if(v===null)return null;
  ty=String(ty).toLowerCase();
  if(/int/.test(ty))return Math.trunc(num(v));
  if(/numeric|decimal|real|double|float/.test(ty))return num(v);
  if(/text|varchar|char/.test(ty))return String(v);
  if(/bool/.test(ty))return truthy(v);
  if(/date/.test(ty))return String(v).slice(0,10);
  return v;
}

Engine.prototype.fn=function(e,row,group,outer){
  var self=this,name=e.name;
  if(AGG[name]){
    var src=group||(row?[row]:[]);
    if(!group&&!row)src=[];
    var vals;
    if(e.star)vals=src.map(function(){return 1;});
    else{
      vals=src.map(function(r){return self.eval(e.args[0],r,null,outer);})
              .filter(function(v){return v!==null;});
      if(e.distinct){
        var seen={},o=[];
        vals.forEach(function(v){var k=String(v);if(!seen[k]){seen[k]=1;o.push(v);}});
        vals=o;
      }
    }
    switch(name){
      case "COUNT": return vals.length;
      case "SUM": return vals.length?vals.reduce(function(a,b){return a+num(b);},0):null;
      case "AVG": return vals.length?vals.reduce(function(a,b){return a+num(b);},0)/vals.length:null;
      case "MIN": return vals.length?vals.reduce(function(a,b){return cmp(b,a)<0?b:a;}):null;
      case "MAX": return vals.length?vals.reduce(function(a,b){return cmp(b,a)>0?b:a;}):null;
      case "STRING_AGG": {
        var sep=e.args[1]?String(self.eval(e.args[1],src[0]||{},null,outer)):",";
        return vals.length?vals.map(String).join(sep):null;
      }
    }
  }
  var a=e.args.map(function(x){return self.eval(x,row,group,outer);});
  switch(name){
    case "UPPER": return a[0]===null?null:String(a[0]).toUpperCase();
    case "LOWER": return a[0]===null?null:String(a[0]).toLowerCase();
    case "LENGTH": case "CHAR_LENGTH": return a[0]===null?null:String(a[0]).length;
    case "TRIM": case "BTRIM": return a[0]===null?null:String(a[0]).trim();
    case "SUBSTRING": case "SUBSTR": {
      if(a[0]===null)return null;
      var s=String(a[0]),st=num(a[1])||1,len=a[2]===undefined?undefined:num(a[2]);
      return len===undefined?s.slice(st-1):s.substr(st-1,len);
    }
    case "LEFT": return a[0]===null?null:String(a[0]).slice(0,num(a[1]));
    case "RIGHT": return a[0]===null?null:String(a[0]).slice(-num(a[1]));
    case "POSITION": case "STRPOS": return a[0]===null?null:String(a[0]).indexOf(String(a[1]))+1;
    case "REPLACE": return a[0]===null?null:String(a[0]).split(String(a[1])).join(String(a[2]));
    case "CONCAT": return a.map(function(v){return v===null?"":String(v);}).join("");
    case "COALESCE": {
      for(var i=0;i<a.length;i++)if(a[i]!==null)return a[i];
      return null;
    }
    case "NULLIF": return cmp(a[0],a[1])===0?null:a[0];
    case "GREATEST": return a.reduce(function(x,y){return cmp(y,x)>0?y:x;});
    case "LEAST": return a.reduce(function(x,y){return cmp(y,x)<0?y:x;});
    case "ABS": return a[0]===null?null:Math.abs(num(a[0]));
    case "ROUND": {
      if(a[0]===null)return null;
      var d=a[1]===undefined?0:num(a[1]),f=Math.pow(10,d);
      return Math.round(num(a[0])*f)/f;
    }
    case "CEIL": case "CEILING": return a[0]===null?null:Math.ceil(num(a[0]));
    case "FLOOR": return a[0]===null?null:Math.floor(num(a[0]));
    case "DATE_PART": {
      return this.eval({type:"extract",part:String(a[0]).toLowerCase(),e:{type:"lit",v:a[1]}},row,group,outer);
    }
    case "INITCAP": return a[0]===null?null:String(a[0]).replace(/\w\S*/g,function(w){return w[0].toUpperCase()+w.slice(1).toLowerCase();});
  }
  throw SqlError('la funcion "'+name.toLowerCase()+'" no existe en esta simulacion',null,
    "Funciones disponibles: COUNT, SUM, AVG, MIN, MAX, STRING_AGG, UPPER, LOWER, LENGTH, SUBSTRING, COALESCE, ROUND, CONCAT, REPLACE, NULLIF, CAST.");
};

/* ─────────── API ─────────── */
CDB.query=function(sql,db){
  var ast=new Parser(sql).parse();
  var eng=new Engine(db);
  var r=eng.run(ast,null);
  return {cols:r.names,rows:r.rows,ordered:hasOrder(ast)};
};
function hasOrder(ast){
  if(ast.type==="with")return hasOrder(ast.body);
  if(ast.type==="setop")return hasOrder(ast.left)||hasOrder(ast.right);
  return !!ast.orderBy;
}

})();
