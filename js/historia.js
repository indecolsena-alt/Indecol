// ===== Historia delictiva: de los 18 delitos de 2010 a las 34 categorías =====
// app.js llama a esta función; aquí usa sus datos y utilidades (DELITOS_DATA, fmtData, posicion…).
function historiaDelictiva(){
 const datos=window.INDECOL_HISTORIA,pagina=document.getElementById("historia-delictiva");
 if(!datos||!pagina)return;
 const porId=id=>document.getElementById(id);
 const mapa=porId("hdMapa"),mosaico=porId("hdMosaico");

 // ---- datos ----
 const delitos=new Map(DELITOS_DATA.map(delito=>[delito.name,delito]));
 const categorias=new Map(datos.categorias.map(([numero,nombre,tipo,familia,norma,anio])=>[numero,{numero,nombre,tipo,familia,norma,anio}]));
 datos.origenes.forEach(([origen,numeros])=>numeros.forEach(numero=>categorias.get(numero).origen=origen));
 const lista=[...categorias.values()].sort((a,b)=>a.numero-b.numero);
 const tipos=Object.keys(datos.tipos),etiqueta=tipo=>datos.tipos[tipo].etiqueta;
 const delTipo=tipo=>lista.filter(item=>item.tipo===tipo);
 const origenes2010=datos.origenes.filter(([,,fuera])=>!fuera).map(([origen])=>origen);
 const periodoCasos=`${CATALOGO.years[0]}–${CATALOGO.years.at(-1)}`;
 const ficha=nombre=>{const delito=delitos.get(nombre);return delito?`#delitos/${encodeURIComponent(delito.category.id)}/${encodeURIComponent(delito.id)}`:""};
 const enlace=(nombre,clase="")=>ficha(nombre)?`<a class="${clase}" href="${ficha(nombre)}">${htmlSeguro(nombre)}</a>`:`<span class="${clase}">${htmlSeguro(nombre)}</span>`;
 // la incautación de estupefacientes se mide en toneladas, no en casos
 const cantidad=nombre=>{
  const delito=delitos.get(nombre);
  if(!delito)return null;
  if(usaIncautaciones(delito)){
   const peso=fmtData(toneladas(INCAUTACIONES.grams));
   return{titulo:"Incautado",valor:`${peso} toneladas`,corto:`${peso} t incautadas`,texto:`${peso} toneladas incautadas`};
  }
  const valor=fmtData(casos(delito));
  return{titulo:"Casos",valor,corto:valor,texto:`${valor} casos`};
 };
 const sinMovimiento=()=>movimientoReducido.matches;

 // ---- desplazamiento hasta una parte, dejando libre el menú y el índice ----
 const indice=porId("hdIndice");
 const irA=elemento=>{
  const estilo=getComputedStyle(indice);
  const margen=estilo.position==="sticky"?parseFloat(estilo.top)+indice.offsetHeight+12:90;
  scrollTo({top:posicion(elemento).documento-margen,behavior:sinMovimiento()?"instant":"smooth"});
 };
 const partes=[...indice.querySelectorAll("button[data-ir]")].map(boton=>({boton,parte:porId(boton.dataset.ir)}));
 let parteActual=null;
 const marcarParte=()=>{
  if(!pagina.classList.contains("active"))return;
  const limite=indice.getBoundingClientRect().bottom+60;
  let actual=partes[0];
  partes.forEach(item=>{if(posicion(item.parte).pantalla<=limite)actual=item});
  if(scrollY+innerHeight>=document.documentElement.scrollHeight-2)actual=partes.at(-1);
  if(actual===parteActual)return;
  parteActual=actual;
  partes.forEach(item=>item.boton.setAttribute("aria-current",String(item===actual)));
  indice.scrollLeft=actual.boton.offsetLeft-(indice.clientWidth-actual.boton.offsetWidth)/2;
 };
 partes.forEach(({boton,parte})=>boton.addEventListener("click",()=>irA(parte)));
 addEventListener("scroll",marcarParte,{passive:true});
 addEventListener("hashchange",marcarParte);

 // ---- cascada: cada barra abre un cuadro con sus delitos, que se cierra con la X ----
 const divididas=delTipo("divide"),nuevas=delTipo("nuevo"),operativas=delTipo("operativo");
 const origenDe=item=>`Surge de ${item.origen}`;
 const pasos=[
  {clase:"hd-antes",nombre:"Lista de 2010",desde:0,suma:origenes2010.length,titulo:`Los ${origenes2010.length} delitos de impacto de 2010`,elementos:origenes2010.map(nombre=>({nombre}))},
  {clase:"hd-divide",nombre:"Dividir el secuestro",suma:divididas.length-1,titulo:"El secuestro se separa en dos",nota:"Un delito pasa a contarse como dos, por eso la lista crece en uno.",elementos:divididas.map(item=>({nombre:item.nombre,detalle:origenDe(item)}))},
  {clase:"hd-nuevo",nombre:"Delitos nuevos",suma:nuevas.length,titulo:`Delitos nuevos (${nuevas.length})`,nota:"No tenían equivalente en la lista de 2010.",elementos:nuevas.map(item=>({nombre:item.nombre,detalle:origenDe(item)}))},
  {clase:"hd-operativo",nombre:"Resultados operativos",suma:operativas.length,titulo:`Resultados operativos (${operativas.length})`,nota:"Son actuaciones de la Policía que aquí se cuentan como delitos.",elementos:operativas.map(item=>({nombre:item.nombre,detalle:origenDe(item)}))},
  {clase:"hd-ahora",nombre:"Portal SIEDCO 2026",desde:0,suma:lista.length,titulo:`Los ${lista.length} delitos del portal`,elementos:lista.map(item=>({nombre:item.nombre,detalle:etiqueta(item.tipo)}))}
 ];
 let acumulado=0;
 pasos.forEach((paso,orden)=>{
  const total=paso.desde===0;
  if(!total)paso.desde=acumulado;
  acumulado=paso.desde+paso.suma;
  paso.valor=total?String(paso.suma):`+${paso.suma}`;
  paso.orden=orden;
 });
 const cascada=porId("hdCascada");
 cascada.innerHTML=pasos.map(paso=>`<li class="${paso.clase}">
   <button type="button" data-paso="${paso.orden}" aria-expanded="false" aria-label="${htmlSeguro(`${paso.nombre}: ${paso.valor}. Ver delitos`)}">
    <span class="hd-paso">${paso.nombre}</span>
    <span class="hd-via"><i style="--x:${paso.desde/lista.length*100}%;--w:${paso.suma/lista.length*100}%"></i></span>
    <strong>${paso.valor}</strong>
   </button></li>`).join("");
 const caja=document.createElement("div");
 caja.className="hd-caja";caja.id="hdCaja";caja.setAttribute("role","region");caja.setAttribute("aria-labelledby","hdCajaTitulo");
 let pasoAbierto=null;
 const cerrarCaja=()=>{
  if(!pasoAbierto)return;
  pasoAbierto.setAttribute("aria-expanded","false");
  pasoAbierto=null;caja.remove();
  revelarAnalisisVisibles();
 };
 cascada.addEventListener("click",evento=>{
  if(evento.target.closest(".hd-cerrar")){const boton=pasoAbierto;cerrarCaja();boton?.focus({preventScroll:true});return}
  const boton=evento.target.closest("button[data-paso]");
  if(!boton)return;
  if(boton===pasoAbierto){cerrarCaja();return}
  cerrarCaja();
  const paso=pasos[Number(boton.dataset.paso)];
  caja.innerHTML=`<button type="button" class="hd-cerrar" aria-label="Cerrar el cuadro">×</button>
   <h4 id="hdCajaTitulo">${htmlSeguro(paso.titulo)}</h4>
   ${paso.nota?`<p>${paso.nota}</p>`:""}
   <ul>${paso.elementos.map(({nombre,detalle})=>{
    const dato=cantidad(nombre),pie=[detalle,dato&&`${dato.texto} (${periodoCasos})`].filter(Boolean).join(" · ");
    return `<li>${enlace(nombre)}${pie?`<small>${htmlSeguro(pie)}</small>`:""}</li>`;
   }).join("")}</ul>`;
  pasoAbierto=boton;
  boton.setAttribute("aria-expanded","true");
  boton.after(caja);
  caja.scrollIntoView({block:"nearest",behavior:sinMovimiento()?"instant":"smooth"});
  revelarAnalisisVisibles();
 });
 document.addEventListener("keydown",evento=>{
  if(evento.key!=="Escape"||!pasoAbierto||!pagina.classList.contains("active"))return;
  const boton=pasoAbierto,dentro=caja.contains(document.activeElement);
  cerrarCaja();
  if(dentro)boton.focus({preventScroll:true});
 });

 // ---- diagrama: abanicos por origen y un bloque para los que siguen igual sin ramas ----
 const botonCategoria=(item,clase="")=>`<button type="button" class="${clase} hd-${item.tipo}" data-numero="${item.numero}" aria-expanded="false" aria-controls="hdDetalle" aria-label="${htmlSeguro(`${item.nombre}: ${etiqueta(item.tipo)}, surge de ${item.origen}`)}">${htmlSeguro(item.nombre)}</button>`;
 const sinRamas=([,numeros,fuera])=>!fuera&&numeros.length===1&&categorias.get(numeros[0]).tipo==="mantiene";
 // las categorías de una fila tienen igual alto, así cada curva termina en el centro de la suya
 const fila=([origen,numeros,fuera])=>{
  const alto=numeros.length*100;
  const curvas=numeros.map((numero,orden)=>{
   const y=orden*100+50,inicio=alto/2;
   return `<path class="hd-${categorias.get(numero).tipo}" data-numero="${numero}" d="M0,${inicio} C50,${inicio} 50,${y} 100,${y}"/>`;
  }).join("");
  return `<li class="hd-origen${fuera?" es-fuera":""}">
   <b>${htmlSeguro(origen)}</b>
   <i><svg viewBox="0 0 100 ${alto}" preserveAspectRatio="none" aria-hidden="true">${curvas}</svg></i>
   <ul>${numeros.map(numero=>`<li>${botonCategoria(categorias.get(numero))}</li>`).join("")}</ul>
  </li>`;
 };
 const iguales=datos.origenes.filter(sinRamas);
 mapa.innerHTML=datos.origenes.filter(item=>!item[2]&&!sinRamas(item)).map(fila).join("")
  +`<li class="hd-iguales"><b>${iguales.length} delitos siguen igual, sin ramas</b><ul>${iguales.map(([,numeros])=>`<li>${botonCategoria(categorias.get(numeros[0]))}</li>`).join("")}</ul></li>`
  +datos.origenes.filter(item=>item[2]).map(fila).join("");
 // filtro por tipo de cambio
 const filtro=porId("hdFiltro");
 filtro.innerHTML=`<button type="button" data-tipo="" aria-pressed="true">Todos</button>`
  +tipos.map(tipo=>`<button type="button" class="hd-${tipo}" data-tipo="${tipo}" aria-pressed="false">${etiqueta(tipo)}</button>`).join("");
 filtro.addEventListener("click",evento=>{
  const boton=evento.target.closest("button[data-tipo]");
  if(!boton)return;
  // tocar de nuevo el filtro activo vuelve a mostrar todo
  const tipo=boton.getAttribute("aria-pressed")==="true"?"":boton.dataset.tipo;
  filtro.querySelectorAll("button").forEach(item=>item.setAttribute("aria-pressed",String(item.dataset.tipo===tipo)));
  mapa.querySelectorAll("[data-numero]").forEach(nodo=>nodo.classList.toggle("apagada",Boolean(tipo)&&categorias.get(Number(nodo.dataset.numero)).tipo!==tipo));
  [...mapa.children].forEach(item=>item.hidden=Boolean(tipo)&&!item.querySelector(`button.hd-${tipo}`));
  revelarAnalisisVisibles();
 });

 // ---- mosaico: un cuadro por categoría, reordenable ----
 const cuadros=new Map(lista.map(item=>{
  const cuadro=document.createElement("li");
  cuadro.innerHTML=botonCategoria(item,"hd-cuadro");
  return[item.numero,cuadro];
 }));
 const ordenes={
  tipo:()=>tipos.map(tipo=>[etiqueta(tipo),delTipo(tipo)]),
  familia:()=>datos.familias.map(familia=>[familia,lista.filter(item=>item.familia===familia)]),
  anio:()=>[...new Set(lista.map(item=>item.anio))].sort().map(anio=>[`Norma o registro de ${anio}`,lista.filter(item=>item.anio===anio)])
 };
 const ordenar=(modo,animar)=>{
  const antes=new Map([...cuadros].map(([numero,cuadro])=>[numero,cuadro.getBoundingClientRect()]));
  mosaico.replaceChildren(...ordenes[modo]().map(([titulo,items])=>{
   const grupo=document.createElement("div");
   grupo.className="hd-grupo";
   grupo.innerHTML=`<h4>${htmlSeguro(titulo)} <span>${items.length}</span></h4><ul></ul>`;
   grupo.lastElementChild.append(...items.map(item=>cuadros.get(item.numero)));
   return grupo;
  }));
  if(!animar||sinMovimiento())return;
  // cada cuadro viaja desde donde estaba hasta su nuevo lugar
  cuadros.forEach((cuadro,numero)=>{
   const previo=antes.get(numero),ahora=cuadro.getBoundingClientRect();
   cuadro.animate([{transform:`translate(${previo.left-ahora.left}px,${previo.top-ahora.top}px)`},{transform:"none"}],{duration:550,easing:"cubic-bezier(.2,.8,.2,1)"});
  });
 };
 ordenar("tipo",false);
 const botonesOrden=[...porId("hdOrden").querySelectorAll("button")];
 botonesOrden.forEach(boton=>boton.addEventListener("click",()=>{
  botonesOrden.forEach(item=>item.setAttribute("aria-pressed",String(item===boton)));
  ordenar(boton.dataset.orden,true);
  revelarAnalisisVisibles();
 }));

 // ---- recuadro de cada categoría (diagrama y mosaico) ----
 // solo se ve mientras la categoría está señalada: se cierra al retirar el cursor, al tocar fuera o al desplazarse
 const detalle=porId("hdDetalle");
 let abierto=null,espera=0,yAbierto=0,porTeclado=0,tipoPuntero="",posicionPuntero="";
 const botonDe=nodo=>nodo?.closest?.("#hdMapa button[data-numero],#hdMosaico button[data-numero]");
 const programar=(accion,demora)=>{clearTimeout(espera);espera=setTimeout(accion,demora)};
 const cerrar=()=>{
  clearTimeout(espera);
  if(!abierto)return;
  abierto.setAttribute("aria-expanded","false");
  mapa.querySelectorAll("path.activa").forEach(curva=>curva.classList.remove("activa"));
  abierto=null;detalle.hidden=true;
 };
 // en el diagrama ancho va a la izquierda de la categoría; en los demás casos, debajo (o encima si no cabe)
 const ubicar=()=>{
  const zona=abierto.closest("#hdMapa,#hdMosaico"),panel=detalle.parentElement;
  const boton=abierto.getBoundingClientRect(),base=panel.getBoundingClientRect(),area=zona.getBoundingClientRect(),amplia=innerWidth>700;
  detalle.style.width=`${amplia?290:area.width}px`;
  const alto=detalle.offsetHeight;
  const techo=Math.max(document.querySelector("nav").getBoundingClientRect().bottom,indice.getBoundingClientRect().bottom)+8;
  let izquierda=amplia?Math.max(area.left,Math.min(boton.left+boton.width/2-145,area.right-290)):area.left,arriba=boton.bottom+8;
  if(amplia&&zona===mapa&&!abierto.closest(".hd-iguales")){
   izquierda=boton.left-302;
   arriba=Math.max(techo,Math.min(boton.top+(boton.height-alto)/2,innerHeight-alto-8));
  }else if(arriba+alto>innerHeight-8)arriba=boton.top-alto-8;
  detalle.style.left=`${izquierda-base.left-panel.clientLeft}px`;
  detalle.style.top=`${arriba-base.top-panel.clientTop}px`;
 };
 const abrir=boton=>{
  clearTimeout(espera);
  if(boton===abierto)return;
  cerrar();
  const item=categorias.get(Number(boton.dataset.numero)),dato=cantidad(item.nombre);
  detalle.innerHTML=`<p><strong>${htmlSeguro(item.nombre)}</strong> <span class="hd-tipo hd-${item.tipo}">${etiqueta(item.tipo)}</span></p>
   <p>${htmlSeguro(item.norma)} · ${item.anio}</p>
   <p>Surge de: ${htmlSeguro(item.origen)} · ${htmlSeguro(item.familia)}</p>
   ${dato?`<p class="hd-dato">${dato.titulo} ${periodoCasos}: <b>${dato.valor}</b></p>`:""}
   ${ficha(item.nombre)?`<a href="${ficha(item.nombre)}">Ver la ficha del delito →</a>`:""}`;
  abierto=boton;yAbierto=scrollY;
  boton.setAttribute("aria-expanded","true");
  if(mapa.contains(boton))mapa.querySelector(`path[data-numero="${item.numero}"]`)?.classList.add("activa");
  boton.closest(".data-panel").append(detalle);
  detalle.hidden=false;ubicar();
 };
 // se exige movimiento real del cursor: al desplazar la página no se abre sola la categoría que queda debajo
 pagina.addEventListener("pointermove",evento=>{
  const donde=`${evento.clientX},${evento.clientY}`;
  if(evento.pointerType!=="mouse"||donde===posicionPuntero)return;
  posicionPuntero=donde;
  const boton=botonDe(evento.target);
  if(!boton)return;
  if(boton===abierto)clearTimeout(espera);
  else programar(()=>abrir(boton),90);
 });
 pagina.addEventListener("pointerout",evento=>{
  const boton=botonDe(evento.target);
  if(evento.pointerType==="mouse"&&boton&&!boton.contains(evento.relatedTarget))programar(cerrar,250);
 });
 // deja pasar el cursor al recuadro para usar su enlace
 detalle.addEventListener("pointerenter",()=>clearTimeout(espera));
 detalle.addEventListener("pointerleave",evento=>{if(evento.pointerType==="mouse")programar(cerrar,250)});
 detalle.addEventListener("click",evento=>{if(evento.target.closest("a"))cerrar()});
 pagina.addEventListener("click",evento=>{
  const boton=botonDe(evento.target);
  if(!boton)return;
  // con teclado se pasa el foco al enlace; tocando por segunda vez la misma categoría se cierra
  if(evento.detail===0){abrir(boton);detalle.querySelector("a")?.focus({preventScroll:true})}
  else if(tipoPuntero!=="mouse"&&boton===abierto)cerrar();
  else abrir(boton);
 });
 pagina.addEventListener("focusin",evento=>{
  const boton=botonDe(evento.target);
  if(boton?.matches(":focus-visible")){porTeclado=performance.now();abrir(boton)}
 });
 pagina.addEventListener("focusout",evento=>{
  const siguiente=evento.relatedTarget;
  if(siguiente&&!detalle.contains(siguiente)&&!botonDe(siguiente))cerrar();
 });
 document.addEventListener("pointerdown",evento=>{
  tipoPuntero=evento.pointerType;porTeclado=0;
  if(!detalle.contains(evento.target)&&!botonDe(evento.target))cerrar();
 });
 document.addEventListener("keydown",evento=>{
  if(evento.key!=="Escape"||!abierto)return;
  if(detalle.contains(document.activeElement))abierto.focus({preventScroll:true});
  cerrar();
 });
 addEventListener("scroll",()=>{
  if(!abierto){clearTimeout(espera);return}
  // al recorrer con el teclado, la página se acomoda sola para mostrar la categoría
  if(performance.now()-porTeclado<700){yAbierto=scrollY;ubicar()}
  else if(Math.abs(scrollY-yAbierto)>4)cerrar();
 },{passive:true});
 addEventListener("resize",cerrar);

 // ---- leyenda y barras apiladas por familia, todas sobre la misma escala ----
 pagina.querySelectorAll("[data-hd-leyenda]").forEach(leyenda=>{
  leyenda.innerHTML=tipos.map(tipo=>`<li class="hd-${tipo}">${etiqueta(tipo)}</li>`).join("");
 });
 const familias=datos.familias.map(nombre=>{
  const miembros=lista.filter(item=>item.familia===nombre);
  return{nombre,total:miembros.length,partes:tipos.map(tipo=>({tipo,valor:miembros.filter(item=>item.tipo===tipo).length})).filter(parte=>parte.valor)};
 });
 const mayor=Math.max(...familias.map(familia=>familia.total));
 porId("hdFamilias").innerHTML=familias.map(familia=>{
  const resumen=familia.partes.map(parte=>`${etiqueta(parte.tipo)}: ${parte.valor}`).join(", ");
  return `<li><span>${htmlSeguro(familia.nombre)}</span>
   <div><i role="img" aria-label="${htmlSeguro(`${familia.total} en total. ${resumen}`)}" style="width:${familia.total/mayor*100}%">${familia.partes.map(parte=>`<em class="hd-${parte.tipo}" style="flex:${parte.valor}" title="${etiqueta(parte.tipo)}: ${parte.valor}">${parte.valor}</em>`).join("")}</i></div>
   <strong>${familia.total}</strong></li>`;
 }).join("");

 // ---- casos de la base por tipo de cambio ----
 const colores={mantiene:"#203D56",divide:"#B2604C",nuevo:"#4F7A68",operativo:"#C88E3A"};
 const porTipo=Object.fromEntries(tipos.map(tipo=>[tipo,delTipo(tipo).reduce((suma,item)=>suma+casos(delitos.get(item.nombre)),0)]));
 const totalCasos=Object.values(porTipo).reduce((suma,valor)=>suma+valor,0);
 const reparto=tipos.map(tipo=>({tipo,nombre:tipo==="divide"?"Se divide (secuestro)":etiqueta(tipo),valor:porTipo[tipo]})).sort((a,b)=>b.valor-a.valor);
 porId("hdCasosTexto").textContent=`Reparte los casos ${periodoCasos} de la base de Indecol según el tipo de cambio de cada delito.`;
 porId("hdAnillo").innerHTML=graficaAnillo(reparto,item=>item.valor,item=>item.nombre,`Casos ${periodoCasos} por tipo de cambio`,reparto.map(item=>colores[item.tipo]));
 escribirLectura("hdAnilloLectura",`De los ${fmtData(totalCasos)} casos del periodo, el ${porcentaje(porTipo.mantiene,totalCasos)} corresponde a delitos que se mantienen desde 2010. Los resultados operativos suman ${fmtData(porTipo.operativo)} casos (${porcentaje(porTipo.operativo,totalCasos)}): son actuaciones de la Policía, no delitos. Los delitos nuevos aportan ${fmtData(porTipo.nuevo)} casos (${porcentaje(porTipo.nuevo,totalCasos)}) y los dos delitos de secuestro, ${fmtData(porTipo.divide)}. La incautación de estupefacientes no suma casos porque se mide en toneladas.`);
 // la misma aclaración junto al total del inicio
 const nota=porId("statRecordsNote");
 if(nota)nota.textContent=`incluye ${fmtData(porTipo.operativo)} resultados operativos de la Policía`;

 // ---- línea de tiempo: escala con un círculo por año y detalle debajo ----
 // entre 1955 y 2000 el eje se acorta; desde 2000 los años van a escala
 const finEje=datos.hitos.at(-1).anio;
 const lugarAnio=anio=>anio<2000?0:.12+(anio-2000)/(finEje-2000)*.88;
 const cuantas=numero=>`${numero} ${numero===1?"delito":"delitos"}`;
 const escala=porId("hdEscala");
 escala.innerHTML=`<b class="hd-quiebre" aria-hidden="true">//</b>`+datos.hitos.map((hito,orden)=>{
  const total=hito.categorias.length,diametro=total?Math.round(14+Math.sqrt(total)*6.4):12;
  return `<button type="button" class="hd-punto${total?"":" vacio"}${orden%2?" arriba":""}" data-anio="${hito.anio}" style="--p:${lugarAnio(hito.anio)};--d:${diametro}px" title="${htmlSeguro(hito.titulo)}" aria-label="${htmlSeguro(`${hito.anio}: ${hito.titulo}${total?`, ${cuantas(total)}`:""}. Ir al detalle`)}"><i>${total||""}</i><span class="hd-anio">${hito.anio}</span><small>${total?cuantas(total):"hito del sistema"}</small></button>`;
 }).join("");
 const tiempo=porId("hdTiempo");
 tiempo.innerHTML=datos.hitos.map(hito=>{
  const total=hito.categorias.length;
  const fichas=total?`<ul>${hito.categorias.map(numero=>{const item=categorias.get(numero);return `<li>${enlace(item.nombre,`hd-chip hd-${item.tipo}`)}</li>`}).join("")}</ul>`:"";
  return `<li data-anio="${hito.anio}"><b>${hito.anio}</b>
   <div><h4>${htmlSeguro(hito.titulo)}</h4><p>${htmlSeguro(hito.texto)}</p>
   ${total>8?`<details class="hd-plegar"><summary>Ver los ${cuantas(total)}</summary>${fichas}</details>`:fichas}</div></li>`;
 }).join("");
 let destello=0;
 escala.addEventListener("click",evento=>{
  const boton=evento.target.closest("button[data-anio]");
  if(!boton)return;
  const hito=tiempo.querySelector(`li[data-anio="${boton.dataset.anio}"]`);
  tiempo.querySelectorAll(".destacado").forEach(item=>item.classList.remove("destacado"));
  hito.querySelector("details")?.setAttribute("open","");
  hito.classList.add("destacado");
  clearTimeout(destello);
  destello=setTimeout(()=>hito.classList.remove("destacado"),3500);
  irA(hito);
 });

 // ---- tabla: diez filas, buscador y filtro ----
 const cuerpo=porId("hdTabla"),buscar=porId("hdBuscar"),porCambio=porId("hdTipo"),verTodas=porId("hdVerTodas");
 porId("hdColCasos").textContent=`Casos ${periodoCasos}`;
 porCambio.innerHTML=`<option value="">Todos</option>`+tipos.map(tipo=>`<option value="${tipo}">${etiqueta(tipo)}</option>`).join("");
 cuerpo.innerHTML=lista.map(item=>`<tr>
   <td>${item.numero}</td><th scope="row">${enlace(item.nombre)}</th>
   <td data-campo="Tipo de cambio"><span class="hd-tipo hd-${item.tipo}">${etiqueta(item.tipo)}</span></td>
   <td data-campo="Familia">${htmlSeguro(item.familia)}</td><td data-campo="Surge de">${htmlSeguro(item.origen)}</td>
   <td data-campo="Norma">${htmlSeguro(item.norma)}</td><td data-campo="Año">${item.anio}</td>
   <td data-campo="Casos ${periodoCasos}">${htmlSeguro(cantidad(item.nombre)?.corto??"—")}</td></tr>`).join("");
 const textos=lista.map(item=>sinTildes([item.nombre,item.familia,item.origen,item.norma,item.anio,etiqueta(item.tipo)].join(" ")));
 const primeras=10;
 let completa=false;
 const filtrarTabla=()=>{
  const consulta=sinTildes(buscar.value.trim()),tipo=porCambio.value,filtrando=Boolean(consulta||tipo);
  let coinciden=0,visibles=0;
  [...cuerpo.rows].forEach((registro,orden)=>{
   const coincide=textos[orden].includes(consulta)&&(!tipo||lista[orden].tipo===tipo);
   if(coincide)coinciden++;
   registro.hidden=!coincide||(!filtrando&&!completa&&coinciden>primeras);
   if(!registro.hidden)visibles++;
  });
  porId("hdConteo").textContent=`Mostrando ${visibles} de ${lista.length} delitos.`;
  porId("hdVacio").hidden=visibles>0;
  verTodas.hidden=filtrando;
  verTodas.textContent=completa?`Ver solo ${primeras}`:`Ver los ${lista.length} delitos`;
  verTodas.setAttribute("aria-expanded",String(completa));
  revelarAnalisisVisibles();
 };
 buscar.addEventListener("input",filtrarTabla);
 porCambio.addEventListener("change",filtrarTabla);
 verTodas.addEventListener("click",()=>{
  completa=!completa;
  filtrarTabla();
  if(!completa)irA(porId("hdSecTabla"));
 });
 filtrarTabla();
}
