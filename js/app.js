const DELITOS=[];
const norm=value=>String(value??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
const dvMain=document.getElementById("dvMain"),dvNav=document.getElementById("dvNav"),dvQ=document.getElementById("dvQ"),dvSide=document.getElementById("dvSide"),dvTg=document.getElementById("dvTg");
dvNav.innerHTML='<p class="dv-vacio" id="dvNo" hidden>No hay resultados para esa búsqueda.</p>';
dvNav.addEventListener("click",event=>{
 const button=event.target.closest(".dgh");
 if(button){const group=button.parentNode,open=!group.classList.contains("open");group.classList.toggle("open",open);button.setAttribute("aria-expanded",String(open))}
 else if(event.target.closest("a")){dvSide.classList.remove("open");dvTg.setAttribute("aria-expanded","false")}
});
dvQ.addEventListener("input",()=>{
 const query=norm(dvQ.value.trim());let hasResults=false;
 dvNav.classList.toggle("q",Boolean(query));
 dvNav.querySelectorAll(".dg").forEach(group=>{let count=0;group.querySelectorAll(".di").forEach(item=>{const matches=!query||item.dataset.q.includes(query);item.hidden=!matches;if(matches)count++});group.hidden=!count;if(count)hasResults=true});
 document.getElementById("dvNo").hidden=hasResults;
});
dvTg.addEventListener("click",()=>{const open=dvSide.classList.toggle("open");dvTg.setAttribute("aria-expanded",String(open))});
const CATALOGO=window.INDECOL_CATALOGO;
if(!CATALOGO)throw new Error("No se pudo cargar assets/data/catalogo.js. Genera el catálogo desde DataBase/Delitos_final.csv.");
const CATEGORIAS=CATALOGO.categories;
// ===== nombres para mostrar: la base viene en mayúsculas y sin tildes =====
const NOMBRES_CATALOGO={
 "CONTROL DE ARMAS, SUSTANCIAS Y CAPTURAS":"Control de armas, sustancias y capturas",
 "DELITOS CONTRA BIENES Y RECURSOS":"Delitos contra bienes y recursos",
 "DELITOS CONTRA LA VIDA E INTEGRIDAD":"Delitos contra la vida e integridad",
 "DELITOS INFORMATICOS Y PROPIEDAD INTELECTUAL":"Delitos informáticos y propiedad intelectual",
 "GESTION Y FUNCION PUBLICA":"Gestión y función pública",
 "LIBERTAD, MOVILIDAD HUMANA Y SECUESTROS":"Libertad, movilidad humana y secuestros",
 "MODALIDADES DE HURTOS":"Modalidades de hurtos",
 "PROTECCION AMBIENTAL Y ANIMAL":"Protección ambiental y animal",
 "VEHICULOS Y TRANSITO":"Vehículos y tránsito",
 "Incautacion Armas de Fuego":"Incautación de armas de fuego","Incautacion de Estupefacientes":"Incautación de estupefacientes",
 "Extorsion":"Extorsión","Delitos Sexuales":"Delitos sexuales","Injuria y Calumnia":"Injuria y calumnia","Lesiones Personales":"Lesiones personales",
 "Violencia Intrafamiliar":"Violencia intrafamiliar","Delitos Informaticos":"Delitos informáticos","Derechos de Autor":"Derechos de autor",
 "Contra Administracion Publica":"Contra la administración pública","Violencia a Servidor Publico":"Violencia a servidor público",
 "Secuestro Extorsivo":"Secuestro extorsivo","Secuestro Simple":"Secuestro simple","Trafico Migrantes":"Tráfico de migrantes","Trata Personas":"Trata de personas",
 "Hurto a Automotores":"Hurto a automotores","Hurto a Comercio":"Hurto a comercio","Hurto a Entidades Financieras":"Hurto a entidades financieras",
 "Hurto a Motocicletas":"Hurto a motocicletas","Hurto a Personas":"Hurto a personas","Hurto a Residencias":"Hurto a residencias",
 "Pirateria Terrestre":"Piratería terrestre","Delitos Contra El Medio Ambiente":"Delitos contra el medio ambiente","Maltrato Animal":"Maltrato animal",
 "Automotores Recuperados":"Automotores recuperados","Homicidios en Accidentes de Transito":"Homicidios en accidentes de tránsito",
 "Lesiones en Accidentes de Transito":"Lesiones en accidentes de tránsito","Motocicletas Recuperadas":"Motocicletas recuperadas"
};
const sinTildes=texto=>texto.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase();
const PALABRAS_CON_TILDE=new Map("Acacías Acandí Achí Águila Agustín Albán Alcalá Alejandría Amagá Andalucía Andaquíes Andrés Ángel Angelópolis Anorí Anzá Anzoátegui Apartadó Apía Apicalá Ariguaní Arbeláez Atlántico Bagadó Bahía Bajirá Baudó Belalcázar Belén Beltrán Berrío Betéitiva Bogotá Bojacá Bojayá Bolívar Boyacá Briceño Buriticá Busbanzá Cáceres Cáchira Cácota Caguán Cajibío Cajicá Calarcá Cañasgordas Cantón Caparrapí Cáqueza Caquetá Caracolí Carcasí Carreño Carurú Cereté Cértegui Chachagüí Chaguaní Chairá Chalán Chámeza Charalá Chía Chigorodó Chinácota Chinchiná Chinú Chipatá Chiquinquirá Chíquiza Chiriguaná Chitagá Chivatá Choachí Chocó Chocontá Chucurí Ciénaga Ciénega Cocorná Colón Colosó Cómbita Concepción Consacá Contratación Convención Córdoba Córdobas Covarachía Coveñas Cristóbal Cubará Cucunubá Cúcuta Cuítiva Curití Curumaní Darién Distracción Ebéjico Elías Entrerríos Facatativá Florián Fómeque Fundación Fúquene Fusagasugá Gachalá Gachancipá Gachantivá Gachetá Gaitán Galán Gámbita Gámeza Garzón Génova Girón Gómez González Guacarí Guachené Guachetá Gualmatán Guapí Guapotá Guatapé Guataquí Guática Guavatá Guayatá Güepsa Güicán Gutiérrez Guzmán Hacarí Herrán Ibagué Imués Inírida Inzá Íquira Iró Itagüí Jambaló Jamundí Jardín Jericó Jerónimo Jerusalén Jesús Joaquín Jordán José Junín Juradó Landázuri Leguízamo Lejanías Lérida Líbano Lloró López Lucía Magangué Magüí Málaga Manatí Maní Mapiripán María Maripí Martín Matías Medellín Milán Mistrató Mitú Mompós Monguí Moniquirá Moñitos Montañita Montelíbano Montería Murindó Mutatá Nariño Nátaga Nechí Necoclí Nemocón Norosí Nóvita Nunchía Nuquí Ocaña Oicatá Opón Orocué Pácora Páez Páramo Patía Payán Peña Peñol Peñón Piendamó Pijiño Piñón Piojó Playón Popayán Potosí Pulí Puracé Purificación Purísima Quibdó Quinchía Quindío Quípama Ramiriquí Ráquira Repelón Retén Río Riofrío Rondón Rosalía Saboyá Sácama Sáchica Sahagún Saldaña Samacá Samaná Sampués Sandoná Santafé Sebastián Sesquilé Sibaté Simití Sincé Sipí Síquima Soatá Socotá Sofía Sonsón Sopetrán Sopó Soracá Sotaquirá Sotará Suárez Supatá Supía Suratá Susacón Sutamarchán Tablón Tadó Támesis Tarazá Tibaná Tibú Timaná Timbío Timbiquí Tinjacá Tocancipá Togüí Tolú Tomás Tópaga Topaipí Toribío Totoró Tubará Tuchín Tuluá Túquerres Turmequé Ubalá Ubaté Úmbita Umbría Unguía Unión Upía Urabá Uré Usiacurí Útica Valparaíso Vegachí Vélez Vianí Vigía Villagarzón Villagómez Villamaría Villapinzón Viotá Viracachá Yacopí Yalí Yolombó Yondó Zapayán Zenón Zetaquirá Zipacón Zipaquirá Guainía Vaupés Machetá Támara Asís".split(" ").map(palabra=>[sinTildes(palabra),palabra]));
const PALABRAS_MENORES=new Set(["de","del","la","las","los","y","el","en","reportado"]);
function nombreLugar(texto){
 if(!texto)return texto;
 return String(texto).replace(/\s*\(CT\)/i,"").trim().split(/\s+/).map((parte,indice)=>
  /^D\.C\.?$/i.test(parte)?"D.C.":parte.replace(/[\p{L}]+/gu,palabra=>{
   const minuscula=palabra.toLowerCase();
   if(indice&&PALABRAS_MENORES.has(minuscula))return minuscula;
   return PALABRAS_CON_TILDE.get(palabra.toUpperCase())||palabra[0].toUpperCase()+minuscula.slice(1);
  })
 ).join(" ").replace(/^Guajira$/,"La Guajira");
}
// si el municipio y el departamento se llaman igual (Bogotá), se escribe una sola vez
const etiquetaLugar=(municipio,departamento)=>{
 const clave=texto=>sinTildes(String(texto)).replace(/\./g,"");
 return !departamento||clave(municipio)===clave(departamento)?municipio:`${municipio} · ${departamento}`;
};
CATEGORIAS.forEach(categoria=>{
 categoria.rawName=categoria.name;categoria.name=NOMBRES_CATALOGO[categoria.name]||categoria.name;
 categoria.crimes.forEach(delito=>{
  delito.rawName=delito.name;delito.name=NOMBRES_CATALOGO[delito.name]||delito.name;
  [...(delito.municipalityData||[]),...(delito.municipalities||[])].forEach(lugar=>{
   lugar.rawName=lugar.name;lugar.rawDepartment=lugar.department;
   lugar.name=nombreLugar(lugar.name);lugar.department=nombreLugar(lugar.department);
  });
 });
});
// iconos de línea, iguales en estilo, para cada categoría
const ICONOS_CATEGORIA={
 "control-de-armas-sustancias-y-capturas":"M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5",
 "delitos-contra-bienes-y-recursos":"M4 7h15a1 1 0 011 1v11H5a2 2 0 01-2-2V6a2 2 0 012-2h12v3M16 13h1",
 "delitos-contra-la-vida-e-integridad":"M12 20s-8-4.8-8-10.5A4.5 4.5 0 0112 7a4.5 4.5 0 018 2.500C20 15.200 12 20 12 20z",
 "delitos-informaticos-y-propiedad-intelectual":"M3 5h18v11H3zM8 20h8M12 16v4",
 "gestion-y-funcion-publica":"M3 9l9-5 9 5zM5 9v8M10 9v8M14 9v8M19 9v8M3 20h18",
 "libertad-movilidad-humana-y-secuestros":"M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.700l-1.500 1.500M14 10a4 4 0 00-5.700 0l-3 3a4 4 0 005.700 5.700l1.500-1.500",
 "modalidades-de-hurtos":"M6 11h12v9H6zM8.500 11V8a3.500 3.500 0 017 0v3M12 14.500v2",
 "proteccion-ambiental-y-animal":"M5 19C4 10 10 4 20 4c0 10-6 16-15 15zM5 19l8-8",
 "vehiculos-y-transito":"M4 16v-4l2-5h12l2 5v4zM4 12h16M7 16v3M17 16v3"
};
const iconoCategoria=id=>`<svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONOS_CATEGORIA[id]||"M5 19V10M12 19V5M19 19v-6"}"/></svg>`;
const DELITOS_DATA=CATEGORIAS.flatMap(c=>c.crimes.map(d=>({...d,category:c})));
const CATEGORIA_POR_ID=new Map(CATEGORIAS.map(c=>[c.id,c]));
const DELITO_POR_ID=new Map(DELITOS_DATA.map(d=>[d.id,d]));
const htmlSeguro=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const fmtData=value=>Number(value||0).toLocaleString("es-CO",{maximumFractionDigits:2});
const casos=item=>Number(item?.cases ?? 0);
const periodo=items=>items.length?`${items[0].year}–${items[items.length-1].year}`:"Sin fechas válidas";
const monthsData=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const coberturaAnual=new Map((CATALOGO.yearCoverage||[]).map(item=>[item.year,item]));
const anioParcial=year=>coberturaAnual.has(year)&&!coberturaAnual.get(year).complete;
const etiquetaAnual=year=>{
 const coverage=coberturaAnual.get(year);
 if(!coverage||coverage.complete)return String(year);
 const months=coverage.monthsAvailable.map(month=>monthsData[month-1]).filter(Boolean);
 return `${year} · parcial${months.length?` (${months.at(-1)} último mes)`:""}`;
};
const periodosCompletos=new Set(
 [...coberturaAnual.values()].filter(item=>item.complete).map(item=>item.year)
);

function graficaDatos(items,valueOf,labelOf,horizontal=false){
 if(!items.length)return '<p class="data-empty">No hay datos válidos para este gráfico.</p>';
 const max=Math.max(1,...items.map(valueOf));
 const topItems=new Set();
 const groups=new Map();
 items.forEach((item,index)=>{
  const group=item.group||"";
  if(!groups.has(group))groups.set(group,[]);
  groups.get(group).push(index);
 });
 groups.forEach(indices=>indices.sort((a,b)=>valueOf(items[b])-valueOf(items[a])).slice(0,3).forEach(index=>topItems.add(index)));
 if(horizontal)return `<div class="data-bars horizontal">${items.map((item,index)=>{
  const value=valueOf(item);
  return `<div class="data-row${topItems.has(index)?" is-top":""}" title="${htmlSeguro(labelOf(item))}: ${fmtData(value)}">
   <span>${htmlSeguro(labelOf(item))}</span><i><b data-bar-target style="--bar:${Math.max(value>0?1:0,value/max*100)}%"></b></i><strong data-count-value="${value}">0</strong>
  </div>`;
 }).join("")}</div>`;
 return `<div class="data-bars">${items.map((item,index)=>{
  const value=valueOf(item),height=Math.max(value>0?3:0,value/max*100);
  return `<div class="data-bar${topItems.has(index)?" is-top":""}" title="${htmlSeguro(labelOf(item))}: ${fmtData(value)}">
   <b data-count-value="${value}">0</b><i data-bar-target style="--bar:${height}%;--i:${index}"></i><span>${htmlSeguro(labelOf(item))}</span>
  </div>`;
 }).join("")}</div>`;
}
function graficaAnillo(items,valueOf,labelOf,title){
 const entries=items.map(item=>({item,value:Number(valueOf(item))}))
  .filter(entry=>Number.isFinite(entry.value)&&entry.value>0);
 const total=entries.reduce((sum,entry)=>sum+entry.value,0);
 if(!total)return '<p class="data-empty">No hay datos válidos para este gráfico.</p>';
 const colors=["#203D56","#9C7230","#57758C","#C88E3A","#6E597B","#4F7A68","#B2604C","#817A4B","#45677D"];
 const circumference=2*Math.PI*68;
 let offset=0;
 const segments=entries.map((entry,index)=>{
  const length=circumference*entry.value/total;
  const color=colors[index%colors.length];
  const segment=`<circle class="data-donut-segment" cx="110" cy="110" r="68" stroke="${color}" stroke-dasharray="0 ${circumference.toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}" style="--donut-length:${length.toFixed(2)}px;--donut-circumference:${circumference.toFixed(2)}px;--donut-index:${index}" transform="rotate(-90 110 110)"><title>${htmlSeguro(labelOf(entry.item))}: ${fmtData(entry.value)} (${(entry.value/total*100).toFixed(1).replace(".",",")}%)</title></circle>`;
  offset+=length;
  return segment;
 }).join("");
 const legend=entries.map((entry,index)=>{
  const color=colors[index%colors.length];
  const share=`${(entry.value/total*100).toFixed(1).replace(".",",")}%`;
  return `<li style="--donut-index:${index}"><i aria-hidden="true" style="--donut-color:${color}"></i><span class="data-donut-label">${htmlSeguro(labelOf(entry.item))}</span><strong>${share}<small>${fmtData(entry.value)} casos</small></strong></li>`;
 }).join("");
 return `<div class="data-donut-layout" data-graph-donut>
  <svg class="data-donut" viewBox="0 0 220 220" role="img" aria-label="${htmlSeguro(title)}">
   <circle class="data-donut-track" cx="110" cy="110" r="68"/>
   ${segments}
   <text class="data-donut-total" x="110" y="106" text-anchor="middle">${fmtData(total)}</text>
   <text class="data-donut-caption" x="110" y="127" text-anchor="middle">casos</text>
  </svg>
  <ul class="data-donut-legend">${legend}</ul>
 </div>`;
}
function graficaLineas(series,labels,title){
 const visibles=series.filter(item=>item.values.some(value=>value>0));
 if(!labels.length||!visibles.length)return '<p class="data-empty">No hay datos válidos para este gráfico.</p>';
 const top=46,bottom=222;
 // En contenedores angostos se dibuja una segunda versión: solo rotula el máximo y el mínimo, y lista todas las cifras debajo.
 const dibujar=({clase,width,height,left,right,resumen,paso})=>{
 const max=Math.max(1,...visibles.flatMap(item=>item.values));
 const xAt=index=>labels.length===1?(left+right)/2:left+(right-left)*index/(labels.length-1);
 const yAt=value=>bottom-(bottom-top)*value/max;
 const yTicks=[max,max/2,0];
 const grids=yTicks.map(value=>{
  const y=yAt(value);
  return `<line class="data-line-grid" x1="${left}" y1="${y}" x2="${right}" y2="${y}"/><text class="data-line-y" x="${left-8}" y="${y+4}" text-anchor="end">${htmlSeguro(fmtData(value))}</text>`;
 }).join("");
 const xLabels=labels.map((label,index)=>`<text class="data-line-x" x="${xAt(index)}" y="${bottom+23}" text-anchor="middle">${htmlSeguro(label)}</text>`).join("");
 const groups=visibles.map((item,seriesIndex)=>{
  const topPoints=new Set(item.values.map((value,index)=>({value,index})).sort((a,b)=>b.value-a.value).slice(0,3).map(point=>point.index));
  const points=item.values.map((value,index)=>`${index?"L":"M"}${xAt(index).toFixed(2)},${yAt(value).toFixed(2)}`).join(" ");
  const color=seriesIndex%2?"var(--oro-d)":"var(--azul)";
  const circles=item.values.map((value,index)=>`<circle class="data-line-point${topPoints.has(index)?" is-top":""}" cx="${xAt(index)}" cy="${yAt(value)}" r="${topPoints.has(index)?5:4}" style="--line-color:${color}"><title>${htmlSeguro(item.name)} · ${htmlSeguro(labels[index])}: ${htmlSeguro(fmtData(value))}</title></circle>`).join("");
  const maximo=item.values.indexOf(Math.max(...item.values)),minimo=item.values.indexOf(Math.min(...item.values));
  const dataLabels=item.values.map((value,index)=>{
   if(resumen&&index!==maximo&&index!==minimo)return "";
   // la primera y la última cifra se alinean hacia dentro para no chocar con el eje ni salirse del gráfico
   const ancla=index===0&&labels.length>1?"start":index===labels.length-1&&labels.length>1?"end":"middle";
   const x=xAt(index)+(ancla==="start"?-5:ancla==="end"?5:0);
   const debajo=resumen&&index===minimo&&index!==maximo&&yAt(value)+20<bottom-4;
   const y=debajo?yAt(value)+20+seriesIndex*12:Math.max(14,yAt(value)-11-seriesIndex*12);
   return `<text class="data-line-value-label" x="${x}" y="${y}" text-anchor="${ancla}">${htmlSeguro(fmtData(value))}</text>`;
  }).join("");
  return `<g class="data-line-series" data-graph-line style="--line-color:${color}"><path class="data-line-path" pathLength="1" d="${points}"/>${circles}${dataLabels}</g>`;
 }).join("");
 const legend=visibles.length>1?`<g class="data-line-legend">${visibles.map((item,index)=>`<g transform="translate(${left+index*paso},${height-16})"><circle r="4" cy="-4" style="fill:${index%2?"var(--oro-d)":"var(--azul)"}"/><text x="10">${htmlSeguro(item.name)}</text></g>`).join("")}</g>`:"";
 return `<svg class="data-line-chart ${clase}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${htmlSeguro(title)}">${grids}<line class="data-line-axis" x1="${left}" y1="${bottom}" x2="${right}" y2="${bottom}"/>${groups}${xLabels}${legend}</svg>`;
 };
 const cifras=labels.map((label,index)=>`<div><span>${htmlSeguro(label)}</span>${visibles.map(item=>`<b>${htmlSeguro(fmtData(item.values[index]))}</b>`).join("")}</div>`).join("");
 return `<div class="data-line-wrap">${dibujar({clase:"data-line-wide",width:760,height:300,left:64,right:728,resumen:false,paso:220})}${dibujar({clase:"data-line-narrow",width:320,height:visibles.length>1?276:256,left:60,right:304,resumen:true,paso:130})}<div class="data-line-values">${cifras}</div></div>`;
}
const movimientoReducido=matchMedia("(prefers-reduced-motion: reduce)");
const animacionesNumero=new WeakMap();
// Cada barra, línea, anillo o cifra se anima al entrar en pantalla y se reinicia al salir por abajo.
const enSiguienteCuadro=fn=>requestAnimationFrame(()=>requestAnimationFrame(fn));
function animarNumero(elemento){
 const objetivo=Number(elemento.dataset.countValue);
 const token={};animacionesNumero.set(elemento,token);
 if(!Number.isFinite(objetivo)){elemento.textContent="N/D";return}
 if(movimientoReducido.matches){elemento.textContent=fmtData(objetivo);return}
 const inicio=performance.now(),duracion=1050;
 elemento.textContent="0";
 function actualizar(ahora){
  if(animacionesNumero.get(elemento)!==token)return;
  const progreso=Math.min((ahora-inicio)/duracion,1),suave=1-Math.pow(1-progreso,3);
  const valor=progreso===1?objetivo:Number.isInteger(objetivo)?Math.round(objetivo*suave):objetivo*suave;
  elemento.textContent=fmtData(valor);
  if(progreso<1)requestAnimationFrame(actualizar);
 }
 requestAnimationFrame(actualizar);
}
// querySelectorAll incluyendo el propio elemento
const consigo=(raiz,selector)=>[...(raiz.matches?.(selector)?[raiz]:[]),...raiz.querySelectorAll(selector)];
function revelarAnalisis(bloque){
 bloque.classList.add("data-revealed");
 consigo(bloque,"[data-count-value]").forEach(numero=>{if(!animacionesNumero.has(numero))animarNumero(numero)});
 // si el bloque ya salió de pantalla antes del siguiente cuadro, no se anima
 const activar=(selector,clase)=>consigo(bloque,selector).forEach(item=>{
  enSiguienteCuadro(()=>{if(bloque.classList.contains("data-revealed"))item.classList.add(clase)});
 });
 activar("[data-bar-target]","data-bar-revealed");
 activar("[data-graph-line]","data-line-revealed");
 activar("[data-graph-donut]","data-donut-revealed");
}
// Devuelve un bloque a su estado inicial para que la animación se repita al volver a la página.
function reiniciarGrafico(bloque){
 consigo(bloque,".data-revealed").forEach(item=>item.classList.remove("data-revealed"));
 consigo(bloque,".data-bar-revealed").forEach(item=>item.classList.remove("data-bar-revealed"));
 consigo(bloque,".data-line-revealed").forEach(item=>item.classList.remove("data-line-revealed"));
 consigo(bloque,".data-donut-revealed").forEach(item=>item.classList.remove("data-donut-revealed"));
 consigo(bloque,"[data-count-value]").forEach(item=>{animacionesNumero.delete(item);item.textContent="0"});
}
// Las piezas de un bloque que se animan por separado.
function unidadesGraficas(bloque){
 return new Set(consigo(bloque,"[data-count-value],[data-bar-target],[data-graph-line],[data-graph-donut]")
  .map(item=>item.closest(".data-line-wrap,[data-graph-donut],.data-row,.data-bar,li")||item.parentElement));
}
function animarAnalisis(raiz,reiniciar=false){
 consigo(raiz,".data-animate").forEach(bloque=>{
  if(reiniciar)reiniciarGrafico(bloque);
  unidadesGraficas(bloque).forEach(unidad=>{
   unidad.dataset.unidad="";
   if(movimientoReducido.matches&&!unidad.classList.contains("data-revealed"))revelarAnalisis(unidad);
  });
 });
 enSiguienteCuadro(revelarAnalisisVisibles);
}
// ===== el contenido aparece al bajar y vuelve a ocultarse al subir =====
const APARECE=[
 ".hero>.hc>*",".hero-visual",".today>*",".sum>div",".blk>.data-eyebrow",".blk>h2",".blk>p",".mas-proyecto",
 "#info>.info-card",".info-videos>:not(.info-videos-grid)",".info-video-slot",
 ".analysis-controls",".analysis-findings>*",".analysis-howto",".analysis-narrative",".analysis-page>.data-note",
 ".analysis-page>.data-panel:not(.zone-panel)",".data-panel>h3",".data-panel>p",".data-panel>div:not(.department-map-layout)",
 ".data-panel-heading",".data-panel .chart-reading",".department-compare",".department-compare>h4",".department-compare>div",
 ".department-map-layout",".map-credit",".map-top-list>li",".department-compare tbody tr",".data-row",
 ".zone-panel>:not(#zoneResult)","#zoneResult>:not(.zone-charts)",".zone-charts>*",".zone-subpanel>*",
 ".data-back",".data-hero","#delitos .data-panel",".data-crime","#delitos .data-note",
 ".team-group>h3",".team-cards>*",".rpubs-card",".hallazgos-titulo",".hallazgos>*",".accesos>a",".dbt",".dbf"
].join(",");
// forma de entrada: por defecto suben; algunas piezas crecen o entran desde un lado
const ENTRADAS=[
 ["ap-zoom",".accesos>a,.hallazgos>*,.sum>div,#info>.info-card,.analysis-findings>*,.team-cards>*,.info-video-slot,.hero-visual,.department-map-layout,.data-hero,.dbf"],
 ["ap-izq",".today-copy,.hero>.hc>*,.data-crime"],
 ["ap-der",".today-stat"],
 ["ap-fila",".data-row,.map-top-list>li,.department-compare tbody tr"]
];
const esperasAparicion=new WeakMap();
const introAbierta=()=>{const intro=document.getElementById("ix");return Boolean(intro)&&!intro.hidden&&!intro.classList.contains("out")};
// posición según la maquetación, sin contar los desplazamientos de las propias animaciones
function posicion(elemento){
 let nodo=elemento;
 while(nodo&&!(nodo instanceof HTMLElement))nodo=nodo.parentElement;
 const alto=nodo?.offsetHeight||0,izquierda=nodo?.offsetLeft||0;
 let documento=0;
 for(;nodo;nodo=nodo.offsetParent)documento+=nodo.offsetTop;
 return{alto,izquierda,documento,pantalla:documento-scrollY};
}
// se ve lo que está por encima de la franja inferior; la primera pantalla de cada sección se ve siempre
function debeVerse({documento,pantalla}){
 const alFinal=scrollY+innerHeight>=document.documentElement.scrollHeight-2;
 return documento<innerHeight||pantalla<innerHeight-(alFinal?0:Math.min(90,innerHeight*.1));
}
const estaOculto=elemento=>elemento.classList.contains("ap")&&!elemento.classList.contains("ap-ver");
function ocultar(elemento,animado){
 clearTimeout(esperasAparicion.get(elemento));
 elemento.style.removeProperty("--espera");
 elemento.classList.remove("ap-ver");
 elemento.classList.toggle("ap-sale",animado);
 elemento.classList.add("ap",...ENTRADAS.filter(([,selector])=>elemento.matches(selector)).map(([clase])=>clase));
}
function aparecer(elemento,espera){
 elemento.style.setProperty("--espera",`${espera}ms`);
 elemento.classList.remove("ap-sale");
 elemento.classList.add("ap-ver");
 // al terminar se quitan las clases para que cada elemento recupere sus propios efectos
 esperasAparicion.set(elemento,setTimeout(()=>{
  elemento.classList.remove("ap","ap-ver",...ENTRADAS.map(([clase])=>clase));
  elemento.style.removeProperty("--espera");
 },espera+950));
}
function revisarPagina(){
 const pagina=document.querySelector(".pg.active");
 if(!pagina||introAbierta())return;
 // primero se mide todo y después se cambian las clases
 const entran=[],salen=[],graficos=[];
 pagina.querySelectorAll("[data-aparece]").forEach(elemento=>{
  const lugar=posicion(elemento);
  if(!lugar.alto)return;
  if(!debeVerse(lugar)){if(!estaOculto(elemento))salen.push(elemento)}
  else if(estaOculto(elemento))entran.push({elemento,...lugar});
 });
 pagina.querySelectorAll("[data-unidad]").forEach(unidad=>{
  const lugar=posicion(unidad);
  if(lugar.alto)graficos.push([unidad,debeVerse(lugar)]);
 });
 salen.forEach(elemento=>ocultar(elemento,true));
 // las piezas que entran a la vez aparecen en cascada, de arriba abajo y de izquierda a derecha
 entran.sort((a,b)=>a.documento-b.documento||a.izquierda-b.izquierda)
  .forEach(({elemento},orden)=>aparecer(elemento,Math.min(orden,7)*90));
 graficos.forEach(([unidad,visible])=>{
  const revelada=unidad.classList.contains("data-revealed");
  if(visible&&!revelada)revelarAnalisis(unidad);
  else if(!visible&&revelada&&!movimientoReducido.matches)reiniciarGrafico(unidad);
 });
}
let revisionPendiente=0;
function revelarAnalisisVisibles(){
 if(!revisionPendiente)revisionPendiente=requestAnimationFrame(()=>{revisionPendiente=0;revisarPagina()});
}
addEventListener("scroll",revelarAnalisisVisibles,{passive:true});
addEventListener("resize",revelarAnalisisVisibles);
document.addEventListener("toggle",revelarAnalisisVisibles,true);
if("ResizeObserver"in window)new ResizeObserver(revelarAnalisisVisibles).observe(document.body);
function mostrarAlBajar(raiz,reiniciar=false){
 // mientras la introducción tapa la página no se prepara nada: se hace al cerrarla
 if(introAbierta())return;
 raiz.querySelectorAll(APARECE).forEach(elemento=>{
  if(elemento.hasAttribute("data-aparece")&&!reiniciar)return;
  elemento.dataset.aparece="";
  ocultar(elemento,false);
 });
 enSiguienteCuadro(revelarAnalisisVisibles);
}
// para contenido que se redibuja a la vista (detalle del mapa): participa sin ocultarse primero
function seguirAlBajar(raiz){
 raiz.querySelectorAll(APARECE).forEach(elemento=>elemento.dataset.aparece="");
 revelarAnalisisVisibles();
}
function activarCategoria(id,crimeId){
 dvNav.querySelectorAll(".dg").forEach(group=>{
  const selected=group.dataset.cat===id;
  group.classList.toggle("open",selected||group.classList.contains("open"));
  const button=group.querySelector(".dgh");
  if(button)button.setAttribute("aria-expanded",String(group.classList.contains("open")));
 });
 dvNav.querySelectorAll(".di").forEach(item=>item.classList.remove("cur"));
 dvNav.querySelectorAll("[aria-current='page']").forEach(item=>item.removeAttribute("aria-current"));
 const group=dvNav.querySelector(`[data-cat="${CSS.escape(id)}"]`);
 const active=group?.querySelector(crimeId
  ?`[data-crime="${CSS.escape(crimeId)}"]`
  :".category-link");
 if(active){
  active.classList.add("cur");
  active.querySelector("a")?.setAttribute("aria-current","page");
 }
}
function paginaCategoria(id){
 const category=CATEGORIA_POR_ID.get(id);
 if(!category){
  dvMain.innerHTML='<p class="data-empty">No se encontró esa categoría en el catálogo. <a href="#delitos">Ver las categorías disponibles</a>.</p>';
  return;
 }
 activarCategoria(category.id);
 const period=periodo(category.years);
 const annualBars=category.years.map(item=>({
  label:etiquetaAnual(item.year),
  value:casos(item)
 }));
 const categoryCases=casos(category);
 const leadingCrime=[...category.crimes].sort((a,b)=>casos(b)-casos(a))[0];
 const leadingShare=categoryCases?casos(leadingCrime)/categoryCases*100:0;
 dvMain.innerHTML=`<article class="data-page">
  <header class="data-hero data-animate">
  <div class="data-hero-copy">
   <span class="data-eyebrow">${iconoCategoria(category.id)} Categoría</span>
   <h2>${htmlSeguro(category.name)}</h2>
   <p>En ${period}, esta categoría reúne ${fmtData(categoryCases)} casos según la columna casos de SIEDCO. ${leadingCrime?`${htmlSeguro(leadingCrime.name)} aporta ${leadingShare.toFixed(1).replace(".",",")}% de ellos;`:""} el gráfico resume los casos por año y el listado permite abrir el detalle de cada delito.</p>
  </div>
  ${visualCategoria(category)}
   <div class="data-stats">
    <div><b data-count-value="${categoryCases}">0</b><span>Casos reportados</span></div>
    <div><b data-count-value="${category.crimeCount}">0</b><span>Delitos incluidos</span></div>
    <div><b data-count-value="${category.municipalityCount}">0</b><span>Municipios distintos</span></div>
   </div>
  </header>
   <section class="data-panel data-animate">
   <h3>Casos por año</h3>
     <p>Este gráfico compara la suma de casos registrada en cada año de la categoría. La altura de cada barra muestra el volumen relativo frente al año más alto del periodo y el valor superior permite revisar el total exacto. Los años parciales se identifican en la etiqueta y no deben compararse como si tuvieran doce meses.</p>
   ${graficaDatos(annualBars,item=>item.value,item=>item.label)}
   ${parrafoLectura(lecturaAnual(category.years.map(item=>({year:item.year,value:casos(item)})),`En ${category.name.toLowerCase()}, `))}
  </section>
  <section class="data-panel data-animate">
   <h3>Delitos de esta categoría</h3>
   <p>Selecciona un delito para consultar su evolución anual y mensual, además de los municipios con más casos. Cada tarjeta indica el total del delito en el periodo (la incautación de estupefacientes se mide en toneladas), de modo que puedes comparar de un vistazo cuáles aportan más casos a la categoría.</p>
   ${parrafoLectura(lecturaRanking(category.crimes.filter(casos),{valor:casos,etiqueta:item=>item.name,total:categoryCases,plural:"delitos"}))}
   <div class="data-crimes">${category.crimes.map(crime=>`<a class="data-crime" href="#delitos/${encodeURIComponent(category.id)}/${encodeURIComponent(crime.id)}">
    <span class="data-crime-image" aria-hidden="true" style="--crime-image:url('${htmlSeguro(rutaImagenDelito(crime))}')"></span><span class="data-crime-info"><b>${htmlSeguro(crime.name)}</b><small>${casos(crime)?`<span data-count-value="${casos(crime)}">0</span> casos · ${htmlSeguro(periodo(crime.years))}`:usaIncautaciones(crime)?`<span data-count-value="${toneladas(INCAUTACIONES.grams)}">0</span> toneladas incautadas`:"No se mide en casos"}</small></span><span class="data-arrow" aria-hidden="true">→</span>
   </a>`).join("")}</div>
  </section>
  <p class="data-note">Los indicadores suman la columna casos de SIEDCO. Los años parciales se identifican en las etiquetas.</p>
 </article>`;
 animarAnalisis(dvMain);
}
// ===== incautación de estupefacientes: la base la mide en gramos, aparte de los casos =====
const INCAUTACIONES=window.INDECOL_INCAUTACIONES;
const SUSTANCIAS={"COCAINA":"Cocaína","MARIHUANA":"Marihuana","BASE DE COCA":"Base de coca","BASUCO":"Basuco","HEROINA":"Heroína","SIN CLASIFICAR":"Sin clasificar"};
const toneladas=gramos=>Math.round(gramos/1e5)/10;
const usaIncautaciones=crime=>Boolean(INCAUTACIONES)&&crime.id.endsWith("incautacion-de-estupefacientes");
// el último año puede traer menos meses que la base de casos
function etiquetaIncautacion(item){
 if(item.months.length===12)return String(item.year);
 return `${item.year} · parcial (hasta ${monthsData[item.months.at(-1).month-1]})`;
}
function graficaIncautacionMensual(item){
 return graficaLineas([{name:"Toneladas",values:item.months.map(mes=>toneladas(mes.grams))}],
  item.months.map(mes=>monthsData[mes.month-1]),`Toneladas incautadas por mes en ${item.year}`);
}
function lecturaIncautacionMensual(item){
 const orden=[...item.months].sort((a,b)=>b.grams-a.grams),mayor=orden[0],menor=orden.at(-1);
 const total=item.months.reduce((sum,mes)=>sum+mes.grams,0);
 return `En ${item.year} se incautaron ${fmtData(toneladas(total))} toneladas en ${item.months.length} meses, un promedio de ${fmtData(toneladas(total/item.months.length))} por mes. El mes con más cantidad fue ${MESES_COMPLETOS[mayor.month-1]} (${fmtData(toneladas(mayor.grams))} toneladas) y el de menos, ${MESES_COMPLETOS[menor.month-1]} (${fmtData(toneladas(menor.grams))}).${item.months.length<12?" Este año está incompleto, por lo que su total no es comparable con el de un año entero.":""}`;
}
function paginaIncautaciones(category,crime){
 const datos=INCAUTACIONES,anios=datos.years,ultimo=anios.at(-1);
 const periodoDatos=`${anios[0].year}–${ultimo.year}`;
 const completos=anios.filter(item=>item.months.length===12);
 const sustancias=datos.substances.map(item=>({label:SUSTANCIAS[item.name]||item.name,value:toneladas(item.grams),grams:item.grams}));
 const departamentos=datos.departments.map(item=>({label:nombreLugar(item.name),value:toneladas(item.grams),grams:item.grams}));
 const municipios=datos.municipalities.map(item=>({label:etiquetaLugar(nombreLugar(item.name),nombreLugar(item.department)),value:toneladas(item.grams),grams:item.grams}));
 const parte=item=>porcentaje(item.grams,datos.grams);
 const mayorAnio=[...completos].sort((a,b)=>b.grams-a.grams)[0],menorAnio=[...completos].sort((a,b)=>a.grams-b.grams)[0];
 const inicial=completos[0],final=completos.at(-1),cambio=(final.grams/inicial.grams-1)*100;
 const lecturaAnios=`Entre los años completos, la mayor cantidad se incautó en ${mayorAnio.year} con ${fmtData(toneladas(mayorAnio.grams))} toneladas y la menor en ${menorAnio.year} con ${fmtData(toneladas(menorAnio.grams))}. De ${inicial.year} a ${final.year} la cantidad ${cambio>=0?"aumentó":"disminuyó"} ${fmtDecimal(Math.abs(cambio))}%. ${ultimo.months.length<12?`${ultimo.year} solo incluye ${ultimo.months.length} meses y suma ${fmtData(toneladas(ultimo.grams))} toneladas.`:""}`;
 const lecturaSustancias=`${sustancias[0].label} es la sustancia con mayor cantidad incautada: ${fmtData(sustancias[0].value)} toneladas, el ${parte(sustancias[0])} del total. Le sigue la ${sustancias[1].label.toLowerCase()} con ${fmtData(sustancias[1].value)} toneladas (${parte(sustancias[1])}). ${sustancias.slice(2).map(item=>`${item.label} suma ${fmtData(item.value)} toneladas (${parte(item)}).`).join(" ")}`;
 const sumaTres=departamentos.slice(0,3).reduce((sum,item)=>sum+item.grams,0);
 const lecturaDepartamentos=`${departamentos[0].label} encabeza la lista con ${fmtData(departamentos[0].value)} toneladas, el ${parte(departamentos[0])} del total. Junto con ${departamentos[1].label} y ${departamentos[2].label} reúne el ${porcentaje(sumaTres,datos.grams)} de lo incautado.`;
 const record=datos.largest;
 dvMain.innerHTML=`<article class="data-page">
  <a class="data-back" href="#delitos/${encodeURIComponent(category.id)}">← Análisis de ${htmlSeguro(category.name)}</a>
  <header class="data-hero data-animate">
   <div class="data-hero-copy">
    <span class="data-eyebrow">${iconoCategoria(category.id)} ${htmlSeguro(category.name)}</span>
    <h2>${htmlSeguro(crime.name)}</h2>
    <p>Esta actuación se mide por la cantidad incautada, no por número de casos. Entre ${periodoDatos} la base suma ${fmtData(toneladas(datos.grams))} toneladas.</p>
   </div>
   ${visualDelito(category,crime)}
   <div class="data-stats">
    <div><b data-count-value="${toneladas(datos.grams)}">0</b><span>Toneladas incautadas</span></div>
    <div><b data-count-value="${datos.records}">0</b><span>Registros en la base</span></div>
    <div><b data-count-value="${crime.municipalityCount}">0</b><span>Municipios distintos</span></div>
   </div>
  </header>
  <section class="data-panel data-animate">
   <h3>Toneladas por año</h3>
   <p>Cada punto es la suma de la cantidad incautada en el año, convertida de gramos a toneladas. Refleja lo que se logró incautar, no cuánto delito hubo.</p>
   ${graficaLineas([{name:"Toneladas",values:anios.map(item=>toneladas(item.grams))}],anios.map(item=>String(item.year)),"Toneladas incautadas por año")}
   ${parrafoLectura(lecturaAnios)}
  </section>
  <section class="data-panel data-animate">
   <h3>Toneladas por sustancia</h3>
   <p>Compara el peso total incautado de cada sustancia en ${periodoDatos}. Un mismo peso de sustancias distintas no tiene el mismo significado.</p>
   ${graficaDatos(sustancias,item=>item.value,item=>`${item.label} · ${parte(item)}`,true)}
   ${parrafoLectura(lecturaSustancias)}
  </section>
  <section class="data-panel data-animate">
   <div class="data-panel-heading"><div><h3>Toneladas por mes</h3><p>Muestra cómo se repartió la cantidad incautada dentro del año elegido. Un solo operativo grande puede producir un salto.</p></div>
    <label>Año <select id="dataYear">${anios.map(item=>`<option value="${item.year}"${item===ultimo?" selected":""}>${etiquetaIncautacion(item)}</option>`).join("")}</select></label>
   </div>
   <div id="dataMonths">${graficaIncautacionMensual(ultimo)}</div>
   ${parrafoLectura(lecturaIncautacionMensual(ultimo),"dataMonthsReading")}
  </section>
  <section class="data-panel data-animate">
   <h3>Departamentos con más toneladas</h3>
   <p>Los diez departamentos con mayor peso incautado en ${periodoDatos}.</p>
   ${graficaDatos(departamentos,item=>item.value,item=>item.label,true)}
   ${parrafoLectura(lecturaDepartamentos)}
  </section>
  <section class="data-panel data-animate">
   <h3>Municipios con más toneladas</h3>
   <p>Los diez municipios con mayor peso incautado, junto a su departamento.</p>
   ${graficaDatos(municipios,item=>item.value,item=>item.label,true)}
   ${parrafoLectura(`${municipios[0].label} es el municipio con más cantidad incautada: ${fmtData(municipios[0].value)} toneladas, el ${parte(municipios[0])} del total.`)}
  </section>
  <p class="data-note">Cantidades de la columna cantidad_incautada, en toneladas. No se suman a los casos de Indecol. El mayor registro individual es de ${fmtData(toneladas(record.grams))} toneladas de ${(SUSTANCIAS[record.substance]||record.substance).toLowerCase()} (${htmlSeguro(nombreLugar(record.department))}, ${MESES_COMPLETOS[record.month-1]} de ${record.year}).</p>
 </article>`;
 animarAnalisis(dvMain);
 const selector=document.getElementById("dataYear");
 selector.addEventListener("change",()=>{
  const elegido=anios.find(item=>item.year===Number(selector.value));
  const meses=document.getElementById("dataMonths");
  meses.innerHTML=graficaIncautacionMensual(elegido);
  escribirLectura("dataMonthsReading",lecturaIncautacionMensual(elegido));
  animarAnalisis(meses.closest(".data-animate"),true);
 });
}
function paginaDelito(categoryId,crimeId,selectedYear){
 const crime=DELITO_POR_ID.get(crimeId);
 if(!crime){
  dvMain.innerHTML=`<p class="data-empty">No se encontró ese delito en el catálogo. <a href="#delitos/${encodeURIComponent(categoryId)}">Volver a la categoría</a>.</p>`;
  return;
 }
 const category=crime.category;
 activarCategoria(category.id,crime.id);
 if(usaIncautaciones(crime)){paginaIncautaciones(category,crime);return}
 if(!casos(crime)&&crime.records){
  dvMain.innerHTML=`<article class="data-page">
  <a class="data-back" href="#delitos/${encodeURIComponent(category.id)}">← Análisis de ${htmlSeguro(category.name)}</a>
  <header class="data-hero data-animate">
   <div class="data-hero-copy">
    <span class="data-eyebrow">${iconoCategoria(category.id)} ${htmlSeguro(category.name)}</span>
    <h2>${htmlSeguro(crime.name)}</h2>
    <p>La base no reporta casos para este delito.</p>
   </div>
   ${visualDelito(category,crime)}
   <div class="data-stats">
    <div><b data-count-value="${crime.records}">0</b><span>Registros en la base</span></div>
    <div><b data-count-value="${crime.municipalityCount}">0</b><span>Municipios distintos</span></div>
   </div>
  </header>
  <section class="data-panel data-animate">
   <h3>¿Por qué no hay gráficos?</h3>
   <p>En la base final, la columna casos vale 0 en todos sus registros. Los indicadores de Indecol suman la columna casos, por eso este delito no aparece en las comparaciones.</p>
  </section>
 </article>`;
  animarAnalisis(dvMain);
  return;
 }
 const year=crime.years.find(item=>item.year===Number(selectedYear))||crime.years.at(-1);
 const annualSeries=[{
  name:"Casos",
  values:crime.years.map(casos)
 }];
 const monthItems=year?.months||[];
 const monthlySeries=[{
   name:"Casos",
   values:monthItems.map(casos),
  labels:monthItems.map(item=>monthsData[item.month-1]||item.month)
 }];
 const places=crime.municipalities.map(item=>({
  label:etiquetaLugar(item.name,item.department),
  value:casos(item)
 }));
 const placesDescription="Municipios con más casos reportados para este delito, con departamento para distinguir nombres repetidos.";
 dvMain.innerHTML=`<article class="data-page">
  <a class="data-back" href="#delitos/${encodeURIComponent(category.id)}">← Análisis de ${htmlSeguro(category.name)}</a>
  <header class="data-hero data-animate">
   <div class="data-hero-copy">
    <span class="data-eyebrow">${iconoCategoria(category.id)} ${htmlSeguro(category.name)}</span>
    <h2>${htmlSeguro(crime.name)}</h2>
    <p>En ${htmlSeguro(periodo(crime.years))}, SIEDCO registra ${fmtData(casos(crime))} casos para este delito. Aquí puedes consultar su evolución anual y mensual y los municipios con más casos.</p>
   </div>
   ${visualDelito(category,crime)}
   <div class="data-stats">
    <div><b data-count-value="${casos(crime)}">0</b><span>Casos reportados</span></div>
    <div><b data-count-value="${crime.municipalityCount}">0</b><span>Municipios distintos</span></div>
   </div>
  </header>
   <section class="data-panel data-animate">
   <h3>Casos por año</h3>
    <p>La línea permite observar cómo cambia el total anual de este delito durante el periodo. Cada punto representa la suma de la columna casos para ese año; su etiqueta facilita comparar los valores. Considera que el último año puede estar incompleto y que los cambios describen reportes, no tasas de riesgo.</p>
   ${graficaLineas(annualSeries,crime.years.map(item=>String(item.year)),"Evolución anual de casos")}
   ${parrafoLectura(lecturaAnual(crime.years.map(item=>({year:item.year,value:casos(item)}))))}
  </section>
  <section class="data-panel data-animate">
   <div class="data-panel-heading"><div><h3>Casos por mes</h3><p>Este gráfico desglosa el año elegido en meses y muestra la suma mensual de casos. Úsalo para comparar la distribución dentro de ese año; no representa una predicción ni explica por sí solo las causas de las variaciones.</p></div>
    <label>Año <select id="dataYear">${crime.years.map(item=>`<option value="${item.year}"${item.year===year?.year?" selected":""}>${etiquetaAnual(item.year)}</option>`).join("")}</select></label>
   </div>
   <div id="dataMonths">${graficaLineas(monthlySeries,monthItems.map(item=>monthsData[item.month-1]||item.month),"Casos por mes")}</div>
   ${parrafoLectura(lecturaMensual(monthItems,year?.year),"dataMonthsReading")}
  </section>
  <section class="data-panel data-animate">
   <h3>Casos por municipio</h3>
   <p>${placesDescription} Las barras facilitan comparar los municipios incluidos en el catálogo, y los valores a la derecha muestran los casos contabilizados. Revisa también el departamento indicado junto al municipio, pues algunos nombres se repiten en distintas zonas.</p>
   ${graficaDatos(places,item=>item.value,item=>item.label,true)}
   ${parrafoLectura(lecturaRanking(places,{valor:item=>item.value,etiqueta:item=>item.label,total:casos(crime),plural:"municipios"}))}
  </section>
  <p class="data-note">Este análisis suma la columna casos de SIEDCO. Los años parciales se identifican en las etiquetas.</p>
 </article>`;
 animarAnalisis(dvMain);
 const yearSelect=document.getElementById("dataYear");
 yearSelect.addEventListener("change",()=>{
  const selected=crime.years.find(item=>item.year===Number(yearSelect.value));
  const values=selected?.months||[];
  const months=document.getElementById("dataMonths");
  months.innerHTML=graficaLineas(
   [{name:"Casos",values:values.map(casos)}],
   values.map(item=>monthsData[item.month-1]||item.month),
   "Casos por mes"
  );
  escribirLectura("dataMonthsReading",lecturaMensual(values,selected?.year));
  animarAnalisis(months.closest(".data-animate"),true);
 });
}
const totalAnual=new Map();
CATALOGO.categories.forEach(category=>category.years.forEach(item=>{
 totalAnual.set(item.year,(totalAnual.get(item.year)||0)+casos(item));
}));
const porcentaje=(valor,total)=>{
 if(!total)return"0%";
 const share=valor/total*100;
 return share>0&&share<.05?"<0,1%":`${share.toFixed(1).replace(".",",")}%`;
};
// ===== lecturas: párrafos que describen cada gráfico con las cifras que muestra =====
const MESES_COMPLETOS=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const fmtDecimal=value=>value.toFixed(1).replace(".",",");
const fmtEntero=value=>fmtData(Math.round(value));
const listaHumana=items=>items.length<2?items.join(""):`${items.slice(0,-1).join(", ")} y ${items.at(-1)}`;
// separa en frases sin cortar en "D.C." ni en los puntos de las cifras
const dividirFrases=texto=>String(texto).trim().split(/(?<=\.)(?<!D\.C\.)\s+(?=[A-ZÁÉÍÓÚÑ¿0-9])|(?<=D\.C\.)\s+(?=(?:Le|Los|Las|La|El|En|Entre|Por|Su|Este|De)\s)/);
function puntosLectura(texto,titulo="Lectura de los datos."){
 const frases=dividirFrases(texto),corte=frases.length>3?2:frases.length;
 const lista=items=>`<ul class="puntos">${items.map(frase=>`<li>${htmlSeguro(frase)}</li>`).join("")}</ul>`;
 return `<b>${titulo}</b>${lista(frases.slice(0,corte))}${frases.length>corte?`<details class="ver-mas"><summary>Ver más</summary>${lista(frases.slice(corte))}</details>`:""}`;
}
const parrafoLectura=(texto,id="")=>`<div class="chart-reading"${id?` id="${id}"`:""}>${puntosLectura(texto)}</div>`;
function escribirLectura(id,texto){
 const elemento=document.getElementById(id);
 if(elemento)elemento.innerHTML=puntosLectura(texto);
}
function lecturaRanking(items,{valor,etiqueta,total,plural,contexto=""}){
 const datos=items.map(item=>({nombre:etiqueta(item),valor:valor(item)}))
  .filter(item=>item.valor>0).sort((a,b)=>b.valor-a.valor);
 if(!datos.length)return"No hay casos para describir en esta selección.";
 const suma=datos.reduce((acc,item)=>acc+item.valor,0);
 const base=total||suma;
 const [primero,segundo,tercero]=datos;
 const partes=[`${contexto}${primero.nombre} ocupa el primer lugar con ${fmtData(primero.valor)} casos, el ${porcentaje(primero.valor,base)} del total.`];
 if(segundo)partes.push(`Le sigue ${segundo.nombre}, con ${fmtData(segundo.valor)} casos (${porcentaje(segundo.valor,base)})${primero.valor>=segundo.valor*1.5?`; el primer lugar lo supera ${fmtDecimal(primero.valor/segundo.valor)} veces`:""}.`);
 if(tercero){
  const top3=primero.valor+segundo.valor+tercero.valor;
  partes.push(`Los tres primeros lugares, completados por ${tercero.nombre}, reúnen ${porcentaje(top3,base)} de los casos.`);
 }
 if(datos.length>3){
  const ultimo=datos.at(-1);
  partes.push(`En el otro extremo del gráfico, ${ultimo.nombre} suma ${fmtData(ultimo.valor)} casos (${porcentaje(ultimo.valor,base)}).`);
 }
 if(total&&suma<total)partes.push(`Los ${datos.length} ${plural} visibles representan ${porcentaje(suma,total)} del total de la selección.`);
 return partes.join(" ");
}
function lecturaAnual(puntos,contexto=""){
 const validos=puntos.filter(item=>Number.isFinite(item.value));
 if(!validos.some(item=>item.value>0))return"No hay casos anuales para describir en esta selección.";
 const completos=validos.filter(item=>periodosCompletos.has(item.year));
 const base=completos.length?completos:validos;
 const maximo=base.reduce((a,b)=>b.value>a.value?b:a);
 const minimo=base.reduce((a,b)=>b.value<a.value?b:a);
 const promedio=base.reduce((acc,item)=>acc+item.value,0)/base.length;
 const apertura=completos.length?"entre los años completos":"en los años disponibles";
 const partes=[`${contexto||apertura[0].toUpperCase()}${contexto?apertura:apertura.slice(1)}, el máximo se registró en ${maximo.year} con ${fmtData(maximo.value)} casos y el mínimo en ${minimo.year} con ${fmtData(minimo.value)}; el promedio es de ${fmtEntero(promedio)} casos por año.`];
 if(completos.length>=2){
  const primero=completos[0],ultimo=completos.at(-1);
  if(primero.value){
   const cambio=(ultimo.value-primero.value)/primero.value*100;
   partes.push(`De ${primero.year} a ${ultimo.year} el total ${cambio>=0?"aumentó":"disminuyó"} ${fmtDecimal(Math.abs(cambio))}%, al pasar de ${fmtData(primero.value)} a ${fmtData(ultimo.value)} casos.`);
  }
 }
 const parcial=validos.find(item=>anioParcial(item.year));
 if(parcial){
  const meses=coberturaAnual.get(parcial.year)?.monthsAvailable.length||12;
  const ultimoMes=MESES_COMPLETOS[(coberturaAnual.get(parcial.year)?.monthsAvailable.at(-1)||12)-1];
  partes.push(`${parcial.year} solo incluye datos hasta ${ultimoMes} (${meses} meses): suma ${fmtData(parcial.value)} casos, unos ${fmtEntero(parcial.value/meses)} por mes${completos.length?`, frente a ${fmtEntero(promedio/12)} por mes en promedio en los años completos`:""}.`);
 }
 return partes.join(" ");
}
function lecturaMensual(meses,year){
 const datos=meses.map(item=>({nombre:MESES_COMPLETOS[item.month-1]||String(item.month),valor:casos(item)}));
 const total=datos.reduce((acc,item)=>acc+item.valor,0);
 if(!total)return`No hay casos mensuales para ${year}.`;
 const maximo=datos.reduce((a,b)=>b.valor>a.valor?b:a);
 const minimo=datos.reduce((a,b)=>b.valor<a.valor?b:a);
 const partes=[`En ${year} se suman ${fmtData(total)} casos en ${datos.length} meses, con un promedio de ${fmtEntero(total/datos.length)} por mes.`,
  `El mes con más casos fue ${maximo.nombre} (${fmtData(maximo.valor)}, ${porcentaje(maximo.valor,total)} del año) y el de menos, ${minimo.nombre} (${fmtData(minimo.valor)}).`];
 if(minimo.valor)partes.push(`La diferencia entre ambos meses es de ${fmtData(maximo.valor-minimo.valor)} casos, es decir, el mes más alto supera al más bajo en ${fmtDecimal((maximo.valor/minimo.valor-1)*100)}%.`);
 if(anioParcial(year))partes.push(`Este año aún está incompleto, por lo que su total no es comparable con el de un año entero.`);
 return partes.join(" ");
}
function renderHomeInsight(){
 const leadingCrime=[...DELITOS_DATA].sort((a,b)=>casos(b)-casos(a))[0];
 if(!leadingCrime)return;
 const total=CATALOGO.totalCases;
 const periodoTotal=`${CATALOGO.years[0]}–${CATALOGO.years.at(-1)}`;
 const share=porcentaje(casos(leadingCrime),total);
 const rankingDelitos=[...DELITOS_DATA].sort((a,b)=>casos(b)-casos(a));
 const [,segundoDelito,tercerDelito]=rankingDelitos;
 const anioPico=[...leadingCrime.years].filter(item=>periodosCompletos.has(item.year)).sort((a,b)=>casos(b)-casos(a))[0];
 const unoDeCada=casos(leadingCrime)?Math.round(total/casos(leadingCrime)):0;
 const insightValue=document.getElementById("homeInsightValue");
 insightValue.dataset.countValue=casos(leadingCrime);
 insightValue.textContent=fmtData(casos(leadingCrime));
 document.getElementById("homeInsightLabel").textContent=`casos de ${leadingCrime.name.toLowerCase()}`;
 document.getElementById("homeInsightFootnote").textContent=
  `${share} de los ${fmtData(total)} casos de la base · ${periodoTotal}`;
 document.getElementById("homeInsightText").textContent=
  `${leadingCrime.name} es el delito con más casos de la base SIEDCO: suma ${fmtData(casos(leadingCrime))} entre ${CATALOGO.years[0]} y ${CATALOGO.years.at(-1)}, cerca de 1 de cada ${unoDeCada} casos registrados.${anioPico?` Su año completo más alto fue ${anioPico.year}, con ${fmtData(casos(anioPico))} casos.`:""}${segundoDelito&&tercerDelito?` Lo siguen ${segundoDelito.name} (${fmtData(casos(segundoDelito))}) y ${tercerDelito.name} (${fmtData(casos(tercerDelito))}).`:""}`;
 const rankingCategorias=[...CATALOGO.categories].sort((a,b)=>casos(b)-casos(a));
 const leadingCategory=rankingCategorias[0];
 const top3Categorias=rankingCategorias.slice(0,3);
 const top5Delitos=rankingDelitos.slice(0,5).reduce((acc,item)=>acc+casos(item),0);
 document.getElementById("projectOverview").textContent=
  `En el periodo ${periodoTotal}, la base reúne ${fmtData(total)} casos distribuidos en ${CATALOGO.crimeCount} delitos y ${CATALOGO.categoryCount} categorías. ${leadingCategory.name} es la categoría más numerosa, con ${fmtData(casos(leadingCategory))} casos (${porcentaje(casos(leadingCategory),total)} del total), y junto con ${listaHumana(top3Categorias.slice(1).map(item=>item.name))} concentra ${porcentaje(top3Categorias.reduce((acc,item)=>acc+casos(item),0),total)} de los registros. En el detalle por delito, ${leadingCrime.name} encabeza la lista con ${fmtData(casos(leadingCrime))} casos (${share}), y los cinco delitos más frecuentes suman ${porcentaje(top5Delitos,total)} de la base. Estas participaciones describen cómo se distribuyen los reportes; no son una probabilidad individual ni una tasa de criminalidad.`;
 const anuales=[...totalAnual].sort((a,b)=>a[0]-b[0]).map(([year,value])=>({year,value}));
 const departamentos=[...departmentTotals].map(([key,value])=>({
  name:mapaDepartamentos.departments.find(item=>item.key===key)?.name||key,value
 })).sort((a,b)=>b.value-a.value);
 const top5Deptos=departamentos.slice(0,5).reduce((acc,item)=>acc+item.value,0);
 document.getElementById("projectTrend").textContent=
  `${lecturaAnual(anuales,"En el total nacional, ")} En el territorio, la información cubre ${fmtData(zonaMunicipios.size)} municipios de ${mapaDepartamentos.departments.length} departamentos: ${departamentos[0]?.name} reúne ${porcentaje(departamentos[0]?.value||0,totalTerritorialRecords)} de los casos con departamento identificado y los cinco departamentos con más casos suman ${porcentaje(top5Deptos,totalTerritorialRecords)}.`;
}
let departmentPinnedKey="";
function descargarCSV(nombre,filas){
 const escapeCsv=value=>`"${String(value??"").replace(/"/g,'""')}"`;
 const contents="\uFEFF"+filas.map(row=>row.map(escapeCsv).join(",")).join("\r\n");
 const file=URL.createObjectURL(new Blob([contents],{type:"text/csv;charset=utf-8"}));
 const link=document.createElement("a");
 link.href=file;
 link.download=nombre;
 document.body.append(link);
 link.click();
 link.remove();
 setTimeout(()=>URL.revokeObjectURL(file),1000);
}
function rangoPorSelectores(fromId,toId){
 const firstYear=CATALOGO.years[0],lastYear=CATALOGO.years.at(-1);
 const fromYear=Number(document.getElementById(fromId)?.value||firstYear);
 const toYear=Number(document.getElementById(toId)?.value||lastYear);
 return fromYear<=toYear
  ?{startYear:fromYear,endYear:toYear}
  :{startYear:toYear,endYear:fromYear};
}
function conectarRangoAnual(fromId,toId,onChange){
 const fromSelect=document.getElementById(fromId);
 const toSelect=document.getElementById(toId);
 const actualizar=()=>{
  const fromYear=Number(fromSelect.value);
  const toYear=Number(toSelect.value);
  if(fromYear>toYear){
   fromSelect.value=String(toYear);
   toSelect.value=String(fromYear);
  }
  onChange();
 };
 fromSelect.addEventListener("change",actualizar);
 toSelect.addEventListener("change",actualizar);
}
function rangoAnalisisActual(){
 return rangoPorSelectores("analysisYearFrom","analysisYearTo");
}
function rangoZonaActual(){
 return rangoPorSelectores("zoneYearFrom","zoneYearTo");
}
function registrosEnRango(years,range=rangoAnalisisActual()){
 return (years||[]).reduce((sum,item)=>
  item.year>=range.startYear&&item.year<=range.endYear?sum+casos(item):sum,0);
}
function registrosDelitoEnArea(crime,range){
 if(!departmentPinnedKey)return registrosEnRango(crime.years,range);
 return (crime.municipalityData||[]).reduce((sum,item)=>
  departmentKey(item.department)===departmentPinnedKey
   ?sum+registrosEnRango(item.years,range)
   :sum,0);
}
function nombreAreaAnalisis(){
 if(!departmentPinnedKey)return"Colombia";
 return window.INDECOL_MAPA?.departments.find(item=>item.key===departmentPinnedKey)?.name||departmentPinnedKey;
}
function renderAnalisisGeneral(){
 const firstYear=CATALOGO.years[0],lastYear=CATALOGO.years.at(-1);
 const fromSelect=document.getElementById("analysisYearFrom");
 const toSelect=document.getElementById("analysisYearTo");
 const options=CATALOGO.years.map(year=>`<option value="${year}">${year}${anioParcial(year)?" · parcial":""}</option>`).join("");
 if(fromSelect&&!fromSelect.options.length){fromSelect.innerHTML=options;fromSelect.value=String(firstYear)}
 if(toSelect&&!toSelect.options.length){toSelect.innerHTML=options;toSelect.value=String(lastYear)}
 const {startYear,endYear}=rangoAnalisisActual();
 const inRange=year=>year>=startYear&&year<=endYear;
 const range={startYear,endYear};
 const area=nombreAreaAnalisis();
 document.getElementById("analysisEyebrow").textContent=
  `Lectura territorial · SIEDCO ${startYear}–${endYear}`;
 document.getElementById("analysisScopeTitle").textContent=
  departmentPinnedKey?`Análisis de ${area}`:"Análisis de Colombia";
 document.getElementById("analysisIntro").textContent=
  departmentPinnedKey
   ?`Explora los casos de ${area} entre ${startYear} y ${endYear}. Compara categorías, delitos y cambios anuales para este territorio.`
   :`Compara categorías, delitos y años en el panorama nacional según los casos reportados. Selecciona un departamento para enfocar los resultados.`;
 const crimeRank=DELITOS_DATA.map(crime=>({...crime,filteredRecords:registrosDelitoEnArea(crime,range)}))
  .sort((a,b)=>b.filteredRecords-a.filteredRecords);
 const categoryRank=CATALOGO.categories.map(category=>({
  ...category,
  filteredRecords:category.crimes.reduce((sum,crime)=>{
   const data=DELITO_POR_ID.get(crime.id);
   return sum+(data?registrosDelitoEnArea(data,range):0);
  },0)
 })).sort((a,b)=>b.filteredRecords-a.filteredRecords);
 const filteredTotal=crimeRank.reduce((sum,crime)=>sum+crime.filteredRecords,0);
 const leadingCategory=categoryRank.find(item=>item.filteredRecords>0);
 const leadingCrime=crimeRank.find(item=>item.filteredRecords>0);
 const years=[...totalAnual].sort((a,b)=>a[0]-b[0]);
 const selectedYears=years.filter(([year])=>inRange(year));
 const annualFiltered=selectedYears.map(([year,records])=>[
  year,
  departmentPinnedKey
   ?DELITOS_DATA.reduce((sum,crime)=>sum+registrosDelitoEnArea(crime,{startYear:year,endYear:year}),0)
   :records
 ]);
 const completeYears=annualFiltered.filter(([year])=>periodosCompletos.has(year));
 const lastCompleteYear=completeYears.at(-1);
 const previousYear=completeYears.at(-2);
 const change=previousYear&&lastCompleteYear[1]
  ?(lastCompleteYear[1]-previousYear[1])/previousYear[1]*100:null;
 const changeText=change===null?"No hay dos años completos para comparar."
  :`En ${area}, entre ${previousYear[0]} y ${lastCompleteYear[0]}, los casos ${change>=0?"aumentaron":"disminuyeron"} ${Math.abs(change).toFixed(1).replace(".",",")}% (${fmtData(previousYear[1])} a ${fmtData(lastCompleteYear[1])}).`;
 document.getElementById("analysisFindings").innerHTML=[
  {label:"Cobertura filtrada",value:`${crimeRank.filter(crime=>crime.filteredRecords>0).length} delitos`,detail:`${area} · ${startYear}–${endYear} · ${fmtData(filteredTotal)} casos`},
  {label:"Mayor volumen por categoría",value:leadingCategory?.name||"—",detail:`${porcentaje(leadingCategory?.filteredRecords||0,filteredTotal)} del total filtrado`},
  {label:"Delito con más casos",value:leadingCrime?.name||"—",detail:`${porcentaje(leadingCrime?.filteredRecords||0,filteredTotal)} del total filtrado`},
  {label:"Cambio anual",value:change===null?"—":`${change>=0?"+":"−"}${Math.abs(change).toFixed(1).replace(".",",")}%`,detail:changeText}
 ].map(item=>`<article class="finding-card"><span>${htmlSeguro(item.label)}</span><strong>${htmlSeguro(item.value)}</strong><small>${htmlSeguro(item.detail)}</small></article>`).join("");
 const fewestCrimes=[...crimeRank].filter(crime=>crime.filteredRecords>0).reverse().slice(0,3);
 document.getElementById("analysisLowCrimes").textContent=fewestCrimes.length
  ?`En ${area}, los delitos con menos casos entre ${startYear} y ${endYear} son ${fewestCrimes.map(crime=>`${crime.name} (${fmtData(crime.filteredRecords)}; categoría: ${crime.category.name})`).join("; ")}.`
  :`No hay casos reportados para ${area} en el periodo ${startYear}–${endYear}.`;
 document.getElementById("analysisFilterSummary").textContent=
  `Mostrando ${area} · ${startYear}–${endYear}; la comparación anual usa solo años completos.`;
 document.getElementById("analysisMapDescription").textContent=
  `El color de cada departamento representa la suma de casos de ${startYear}–${endYear} respecto a los demás territorios visibles. Pasa el cursor o enfoca un departamento para consultar su resumen; selecciónalo para filtrar las tarjetas y los gráficos. El mapa muestra totales absolutos, no tasas ajustadas por población.`;
 document.getElementById("analysisCategoriesDescription").textContent=
  `El anillo reparte los ${fmtData(filteredTotal)} casos del filtro entre las categorías con actividad. El tamaño de cada segmento corresponde a su participación porcentual y la leyenda indica tanto el porcentaje como el total de casos; así puedes identificar qué temas concentran más reportes en ${area}.`;
 document.getElementById("analysisCrimesDescription").textContent=
  `Estas barras ordenan los diez delitos con mayor número de casos en ${area} entre ${startYear} y ${endYear}. La longitud compara cada delito con el valor más alto del listado y la cifra al final conserva el conteo exacto; el porcentaje de la etiqueta indica su peso sobre el total filtrado.`;
 document.getElementById("analysisYearsDescription").textContent=
  `La línea resume la evolución temporal de los casos para el territorio y periodo seleccionados: cada punto corresponde a un año y su etiqueta muestra la suma registrada. La dirección de la línea ayuda a localizar aumentos o descensos, pero no explica sus causas. El año parcial se señala y debe compararse con cautela.`;
 const nationalRangeTotal=selectedYears.reduce((sum,[,records])=>sum+records,0);
 const activeCategories=categoryRank.filter(item=>item.filteredRecords>0).length;
 const activeCrimes=crimeRank.filter(item=>item.filteredRecords>0).length;
 const completeInRange=selectedYears.filter(([year])=>periodosCompletos.has(year)).length;
 document.getElementById("analysisScopeNote").textContent=
  `La consulta actual abarca ${selectedYears.length} ${selectedYears.length===1?"año":"años"} (${completeInRange} ${completeInRange===1?"completo":"completos"}) y suma ${fmtData(filteredTotal)} casos repartidos en ${activeCrimes} delitos y ${activeCategories} categorías${departmentPinnedKey?`, equivalentes al ${porcentaje(filteredTotal,nationalRangeTotal)} de los ${fmtData(nationalRangeTotal)} casos del país en el mismo periodo`:""}.`;
 document.getElementById("analysisDataQuality").textContent=
  `Cómo se calculan las cifras: cada valor es la suma de la columna casos de SIEDCO para el territorio y los años elegidos. Los porcentajes se calculan sobre el total de esa misma selección, el cambio anual compara únicamente años de doce meses y ${CATALOGO.yearCoverage?.at(-1)?.complete===false?`${CATALOGO.yearCoverage.at(-1).year} se muestra como año parcial`:"todos los años están completos"}. Son conteos absolutos: un territorio más poblado tiende a acumular más casos, por lo que estas cifras no equivalen a tasas por habitante.`;
 const categoriesFiltered=categoryRank.filter(item=>item.filteredRecords>0);
 const crimesFiltered=crimeRank.filter(item=>item.filteredRecords>0);
 const yearlyFiltered=annualFiltered.map(([year,records])=>({label:String(year),value:records}));
 const latestAvailable=CATALOGO.yearCoverage?.at(-1);
 const incompleteYearNote=latestAvailable&&!latestAvailable.complete&&inRange(latestAvailable.year)
  ?` ${latestAvailable.year} es parcial: hay datos de ${latestAvailable.monthsAvailable.length} meses, hasta ${monthsData[latestAvailable.monthsAvailable.at(-1)-1]||"el último mes disponible"}.`
  :"";
 const yearlyPanel=document.getElementById("analysisYears");
 document.getElementById("analysisCategories").innerHTML=graficaAnillo(
  categoriesFiltered,
  item=>item.filteredRecords,
  item=>item.name,
  `Participación de las categorías en ${area}`
 );
 document.getElementById("analysisCrimes").innerHTML=graficaDatos(
  crimesFiltered.slice(0,10),
  item=>item.filteredRecords,
  item=>`${item.name} · ${porcentaje(item.filteredRecords,filteredTotal)}`,
  true
 );
 yearlyPanel.innerHTML=graficaLineas(
  [{name:"Casos",values:yearlyFiltered.map(item=>item.value)}],
  yearlyFiltered.map(item=>item.label),
  `Evolución anual de casos en ${area}`
 );
 const yearNote=document.createElement("p");
 yearNote.className="data-note";
 yearNote.textContent=`${changeText}${incompleteYearNote} Los porcentajes se calculan sobre los casos del periodo seleccionado.`;
 yearlyPanel.append(yearNote);
 escribirLectura("analysisCategoriesReading",lecturaRanking(categoriesFiltered,{
  valor:item=>item.filteredRecords,etiqueta:item=>item.name,total:filteredTotal,plural:"categorías",contexto:`En ${area}, `
 })+` ${activeCategories<CATALOGO.categoryCount?`${CATALOGO.categoryCount-activeCategories} de las ${CATALOGO.categoryCount} categorías no registran casos en esta selección.`:`Las ${CATALOGO.categoryCount} categorías tienen casos en esta selección.`}`);
 escribirLectura("analysisCrimesReading",lecturaRanking(crimesFiltered.slice(0,10),{
  valor:item=>item.filteredRecords,etiqueta:item=>item.name,total:filteredTotal,plural:"delitos"
 })+(crimesFiltered.length>10?` Los ${crimesFiltered.length-10} delitos restantes aportan ${porcentaje(crimesFiltered.slice(10).reduce((sum,item)=>sum+item.filteredRecords,0),filteredTotal)}.`:""));
 escribirLectura("analysisYearsReading",lecturaAnual(annualFiltered.map(([year,value])=>({year,value})),`En ${area}, `));
 resumenAnalisis={area,startYear,endYear,filteredTotal,nationalRangeTotal,categoryRank,crimeRank,annualFiltered,change,lastCompleteYear,previousYear};
 ["analysisCategories","analysisCrimes","analysisYears"].forEach(id=>{
  const panel=document.getElementById(id).closest(".data-panel");
  if(panel)animarAnalisis(panel,true);
 });
}
let resumenAnalisis=null;
// Párrafo principal del análisis y lectura del mapa: usa los totales departamentales ya calculados.
function renderAnalisisNarrativa(){
 const resumen=resumenAnalisis;
 if(!resumen)return;
 const {area,startYear,endYear,filteredTotal,nationalRangeTotal,categoryRank,crimeRank,annualFiltered,change,lastCompleteYear,previousYear}=resumen;
 const narrative=document.getElementById("analysisNarrative");
 const mapReading=document.getElementById("analysisMapReading");
 if(!filteredTotal){
  narrative.textContent=`No hay casos reportados para ${area} entre ${startYear} y ${endYear}. Prueba con otro periodo o vuelve al panorama nacional.`;
  if(mapReading)mapReading.innerHTML="";
  return;
 }
 const categorias=categoryRank.filter(item=>item.filteredRecords>0);
 const delitos=crimeRank.filter(item=>item.filteredRecords>0);
 const top3Cat=categorias.slice(0,3);
 const top5Del=delitos.slice(0,5).reduce((sum,item)=>sum+item.filteredRecords,0);
 const completos=annualFiltered.filter(([year])=>periodosCompletos.has(year));
 const promedio=completos.length?completos.reduce((sum,[,value])=>sum+value,0)/completos.length:0;
 const pico=[...completos].sort((a,b)=>b[1]-a[1])[0];
 const departamentos=[...departmentTotals].map(([key,value])=>({key,value,
  name:mapaDepartamentos.departments.find(item=>item.key===key)?.name||key
 })).filter(item=>item.value>0).sort((a,b)=>b.value-a.value);
 const partes=[];
 partes.push(departmentPinnedKey
  ?`Entre ${startYear} y ${endYear}, ${area} acumula ${fmtData(filteredTotal)} casos, el ${porcentaje(filteredTotal,nationalRangeTotal)} del total nacional del mismo periodo${(()=>{const puesto=departamentos.findIndex(item=>item.key===departmentPinnedKey);return puesto>=0?`, lo que lo ubica en el puesto ${puesto+1} de ${departamentos.length} departamentos por volumen`:""})()}.`
  :`Entre ${startYear} y ${endYear}, Colombia acumula ${fmtData(filteredTotal)} casos en la base SIEDCO.`);
 if(top3Cat.length)partes.push(`Las categorías con más casos son ${listaHumana(top3Cat.map(item=>`${item.name.toLowerCase()} (${porcentaje(item.filteredRecords,filteredTotal)})`))}; juntas representan ${porcentaje(top3Cat.reduce((sum,item)=>sum+item.filteredRecords,0),filteredTotal)} de la selección.`);
 if(delitos[0])partes.push(`Por delito, ${delitos[0].name} lidera con ${fmtData(delitos[0].filteredRecords)} casos (${porcentaje(delitos[0].filteredRecords,filteredTotal)}) y los cinco delitos más frecuentes suman ${porcentaje(top5Del,filteredTotal)} del total, de modo que una parte importante de los reportes se concentra en pocos tipos de delito.`);
 if(pico)partes.push(`El año completo con más casos fue ${pico[0]} (${fmtData(pico[1])}) y el promedio de los años completos es de ${fmtEntero(promedio)} casos por año.`);
 if(change!==null)partes.push(`En la comparación más reciente, de ${previousYear[0]} a ${lastCompleteYear[0]}, el volumen ${change>=0?"creció":"se redujo"} ${fmtDecimal(Math.abs(change))}%.`);
 narrative.innerHTML=puntosLectura(partes.join(" "),"Resumen del periodo.");
 if(mapReading){
  const top5=departamentos.slice(0,5);
  const sumaTop5=top5.reduce((sum,item)=>sum+item.value,0);
  const ultimo=departamentos.at(-1);
  mapReading.innerHTML=departamentos.length?puntosLectura(`Entre ${startYear} y ${endYear}, ${departamentos[0].name} es el departamento con más casos: ${fmtData(departamentos[0].value)}, el ${porcentaje(departamentos[0].value,totalTerritorialRecords)} de los casos con departamento identificado. Los cinco primeros (${listaHumana(top5.map(item=>item.name))}) suman ${porcentaje(sumaTop5,totalTerritorialRecords)}, mientras que ${ultimo.name} registra el menor volumen, con ${fmtData(ultimo.value)} casos. Los tonos más oscuros del mapa corresponden a estos territorios de mayor volumen absoluto.`):"";
 }
}
function actualizarAnalisisCompleto(){
 renderAnalisisGeneral();
 renderDepartmentMap();
 renderDepartmentComparison();
 renderAnalisisNarrativa();
}
function consejoPrevencion(crimeName){
 const name=norm(crimeName);
 if(name.includes("hurto"))return"Cuida tus pertenencias, procura usar rutas concurridas y evita compartir en público información sobre tus recorridos o bienes.";
 if(name.includes("informatic")||name.includes("estafa")||name.includes("autor"))return"Verifica la identidad de quien te contacta, evita abrir enlaces inesperados y activa la verificación en dos pasos en tus cuentas.";
 if(name.includes("violencia")||name.includes("lesion")||name.includes("amenaza"))return"Si hay riesgo inmediato, aléjate a un lugar seguro y contacta a las autoridades o a una persona de confianza. No enfrentes a quien te amenaza.";
 if(name.includes("extors")||name.includes("secuestro")||name.includes("trata"))return"No compartas datos personales ni consignes dinero ante amenazas; conserva los mensajes y busca apoyo de las autoridades.";
 if(name.includes("transito"))return"Planea el trayecto, respeta las señales y usa elementos de protección. Si ocurre un siniestro, prioriza la atención de las personas.";
 return"Infórmate sobre los canales locales de denuncia y apoyo. Si estás en peligro inmediato, busca un lugar seguro y comunícate con las autoridades.";
}
function departmentKey(value){
 const key=norm(String(value||"").trim()).replace(/[.,]/g,"");
 return key==="guajira"?"la guajira":key;
}
const REGIONES_COLOMBIA=[
 {id:"andina",name:"Andina",departments:["ANTIOQUIA","BOGOTA D.C","BOYACA","CALDAS","CUNDINAMARCA","HUILA","NORTE DE SANTANDER","QUINDIO","RISARALDA","SANTANDER","TOLIMA"]},
 {id:"caribe",name:"Caribe",departments:["ATLANTICO","BOLIVAR","CESAR","CORDOBA","GUAJIRA","MAGDALENA","SUCRE"]},
 {id:"pacifica",name:"Pacífica",departments:["CAUCA","CHOCO","NARINO","VALLE DEL CAUCA"]},
 {id:"orinoquia",name:"Orinoquía",departments:["ARAUCA","CASANARE","META","VICHADA"]},
 {id:"amazonia",name:"Amazonía",departments:["AMAZONAS","CAQUETA","GUAINIA","GUAVIARE","PUTUMAYO","VAUPES"]},
 {id:"insular",name:"Insular",departments:["SAN ANDRES"]}
];
const REGION_POR_DEPTO=new Map(REGIONES_COLOMBIA.flatMap(region=>
 region.departments.map(department=>[departmentKey(department),region.id])
));
const TODAS_ZONAS="__all__";
const zonaMunicipios=new Map(),zonaDepartamentos=new Map();
function acumularAnios(totals,years){
 (years||[]).forEach(item=>totals.set(item.year,(totals.get(item.year)||0)+casos(item)));
}
function sumarAniosEnRango(totals,range){
 let total=0;
 totals.forEach((records,year)=>{
  if(year>=range.startYear&&year<=range.endYear)total+=records;
 });
 return total;
}
DELITOS_DATA.forEach(crime=>(crime.municipalityData||[]).forEach(item=>{
 const department=String(item.department||"").trim()||"Departamento no especificado";
 const name=String(item.name||"").trim();
 const region=item.region||REGION_POR_DEPTO.get(departmentKey(department))||"sin-region";
 if(["","no reportado","nan","none"].includes(norm(department)))return;
 if(["","no reportado","nan","none"].includes(norm(name))){
  const departmentId=departmentKey(department);
  const departmentValue=zonaDepartamentos.get(departmentId)||{
   name:departmentId==="guajira"||departmentId==="la guajira"?"La Guajira":department,
   region,
   records:0
  };
  if(departmentValue.region!==region){
   throw new Error(`SIEDCO asigna más de una región al departamento ${department}.`);
  }
  departmentValue.records+=casos(item);
  zonaDepartamentos.set(departmentId,departmentValue);
  return;
 }
 const municipalityKey=`${norm(department)}|${norm(name)}`;
 const municipality=zonaMunicipios.get(municipalityKey)||{
  department,name,region,records:0,annualRecords:new Map()
 };
 if(municipality.region!==region){
  throw new Error(`SIEDCO asigna más de una región a ${name}, ${department}.`);
 }
 municipality.records+=casos(item);
 acumularAnios(municipality.annualRecords,item.years);
 zonaMunicipios.set(municipalityKey,municipality);
 const departmentId=departmentKey(department);
 const departmentValue=zonaDepartamentos.get(departmentId)||{
   name:departmentId==="guajira"||departmentId==="la guajira"?"La Guajira":department,
   region,
   records:0
 };
 if(departmentValue.region!==region){
   throw new Error(`SIEDCO asigna más de una región al departamento ${department}.`);
 }
 departmentValue.records+=casos(item);
 zonaDepartamentos.set(departmentId,departmentValue);
}));
const zoneRegion=document.getElementById("zoneRegion");
const zoneMunicipality=document.getElementById("zoneMunicipality");
const zoneDepartment=document.getElementById("zoneDepartment");
const zoneYearFrom=document.getElementById("zoneYearFrom");
const zoneYearTo=document.getElementById("zoneYearTo");
const zoneAnnualCsvYear=document.getElementById("zoneAnnualCsvYear");
function inicializarAniosZona(){
 const firstYear=CATALOGO.years[0],lastYear=CATALOGO.years.at(-1);
 const options=CATALOGO.years.map(year=>
  `<option value="${year}">${etiquetaAnual(year)}</option>`
 ).join("");
 zoneYearFrom.innerHTML=options;
 zoneYearTo.innerHTML=options;
 zoneAnnualCsvYear.innerHTML=options;
 zoneYearFrom.value=String(firstYear);
 zoneYearTo.value=String(lastYear);
 zoneAnnualCsvYear.value=String(lastYear);
}
function renderZoneOptions(){
 const selectedRegion=zoneRegion.value||TODAS_ZONAS;
 const regions=[...REGIONES_COLOMBIA];
 if([...zonaDepartamentos.values()].some(item=>item.region==="sin-region")){
  regions.push({id:"sin-region",name:"Sin región asignada",departments:[]});
 }
 regions.sort((a,b)=>a.name.localeCompare(b.name,"es"));
 const departmentOptions=[...zonaDepartamentos.entries()]
   .filter(([,item])=>selectedRegion===TODAS_ZONAS||item.region===selectedRegion)
   .sort((a,b)=>a[1].name.localeCompare(b[1].name,"es"));
 const selectedDepartment=zoneDepartment.value||TODAS_ZONAS;
 const municipalityOptions=[...zonaMunicipios.entries()]
   .filter(([,item])=>(selectedRegion===TODAS_ZONAS||item.region===selectedRegion)
    &&(selectedDepartment===TODAS_ZONAS||departmentKey(item.department)===selectedDepartment))
   .sort((a,b)=>a[1].name.localeCompare(b[1].name,"es")||a[1].department.localeCompare(b[1].department,"es"));
 zoneRegion.innerHTML=`<option value="${TODAS_ZONAS}">Todas las regiones</option>${regions.map(region=>`<option value="${region.id}">${region.name}</option>`).join("")}`;
 zoneRegion.value=selectedRegion;
 zoneDepartment.innerHTML=`<option value="${TODAS_ZONAS}">Todos los departamentos</option>${departmentOptions.map(([key,item])=>`<option value="${htmlSeguro(key)}">${htmlSeguro(item.name)}</option>`).join("")}`;
 if(!departmentOptions.some(([key])=>key===selectedDepartment))zoneDepartment.value=TODAS_ZONAS;
 else zoneDepartment.value=selectedDepartment;
 zoneMunicipality.innerHTML=`<option value="${TODAS_ZONAS}">Todos los municipios</option>${municipalityOptions.map(([key,item])=>`<option value="${htmlSeguro(key)}">${htmlSeguro(item.name)} · ${htmlSeguro(item.department)}</option>`).join("")}`;
 if(!municipalityOptions.some(([key])=>key===zoneMunicipality.value))zoneMunicipality.value=TODAS_ZONAS;
 renderZona();
}
function renderZona(){
 const selectedRegion=zoneRegion.value;
 const selectedDepartment=zoneDepartment.value;
 const selectedMunicipality=zoneMunicipality.value;
 const range=rangoZonaActual();
 const localCrimes=[];
 const categoryTotals=new Map();
 let total=0;
 DELITOS_DATA.forEach(crime=>{
   let records=0;
   const annualRecords=new Map();
   (crime.municipalityData||[]).forEach(item=>{
   const department=String(item.department||"").trim()||"Departamento no especificado";
    const region=item.region||REGION_POR_DEPTO.get(departmentKey(department))||"sin-region";
    const municipalityKey=`${norm(department)}|${norm(String(item.name||"").trim())}`;
    const matches=(selectedRegion===TODAS_ZONAS||region===selectedRegion)
     &&(selectedDepartment===TODAS_ZONAS||departmentKey(department)===selectedDepartment)
     &&(selectedMunicipality===TODAS_ZONAS||municipalityKey===selectedMunicipality);
    if(matches){
     records+=registrosEnRango(item.years,range);
     acumularAnios(annualRecords,item.years);
    }
   });
   total+=records;
   localCrimes.push({name:crime.name,records,crime,annualRecords});
   if(records)categoryTotals.set(crime.category.id,(categoryTotals.get(crime.category.id)||0)+records);
 });
 localCrimes.sort((a,b)=>b.records-a.records||a.name.localeCompare(b.name,"es"));
 const topCrime=localCrimes.find(item=>item.records>0);
 const topCategory=[...categoryTotals.entries()].sort((a,b)=>b[1]-a[1])[0];
 const category=CATEGORIA_POR_ID.get(topCategory?.[0]);
 const zoneCategories=[...categoryTotals.entries()]
  .map(([id,records])=>({name:CATEGORIA_POR_ID.get(id)?.name||id,records}))
  .sort((a,b)=>b.records-a.records);
 const localMunicipalities=[...zonaMunicipios.entries()]
  .filter(([key,item])=>(selectedRegion===TODAS_ZONAS||item.region===selectedRegion)
   &&(selectedDepartment===TODAS_ZONAS||departmentKey(item.department)===selectedDepartment)
   &&(selectedMunicipality===TODAS_ZONAS||key===selectedMunicipality))
  .map(([,item])=>({
   label:etiquetaLugar(item.name,item.department),
   records:sumarAniosEnRango(item.annualRecords,range)
  }))
  .filter(item=>item.records>0)
  .sort((a,b)=>b.records-a.records||a.label.localeCompare(b.label,"es"))
  .slice(0,10);
 const yearlyFiltered=CATALOGO.years
  .filter(year=>year>=range.startYear&&year<=range.endYear)
  .map(year=>({
   label:String(year),
   value:localCrimes.reduce((sum,crime)=>sum+(crime.annualRecords.get(year)||0),0)
  }));
 const municipality=zonaMunicipios.get(selectedMunicipality);
 const department=zonaDepartamentos.get(selectedDepartment);
 const whereParts=[];
 if(selectedRegion!==TODAS_ZONAS)whereParts.push(zoneRegion.selectedOptions[0]?.textContent||"");
 if(department)whereParts.push(department.name);
 if(municipality){
   if(selectedDepartment===TODAS_ZONAS)whereParts.push(municipality.department);
   whereParts.push(municipality.name);
 }
 const where=whereParts.filter(Boolean).join(" · ")||"todas las regiones";
 document.getElementById("zoneFilterSummary").textContent=
  `Mostrando ${where} · ${range.startYear}–${range.endYear}.`;
 const result=document.getElementById("zoneResult");
 const nationalTotal=CATALOGO.years.filter(year=>year>=range.startYear&&year<=range.endYear)
  .reduce((sum,year)=>sum+(totalAnual.get(year)||0),0);
 const lecturaZona=total?`${where==="todas las regiones"?"El país":where} suma ${fmtData(total)} casos entre ${range.startYear} y ${range.endYear}${where==="todas las regiones"?"":`, el ${porcentaje(total,nationalTotal)} del total nacional del mismo periodo`}. ${zoneCategories.length} categorías y ${localCrimes.filter(item=>item.records>0).length} delitos registran al menos un caso en esta selección.`:"";
 result.innerHTML=`<p class="chart-reading zone-intro-reading data-animate">${lecturaZona?`<b>Resumen de la selección.</b> ${htmlSeguro(lecturaZona)}`:""}</p>
 <div class="zone-summary data-animate">
   <div><span>Casos incluidos</span><strong data-count-value="${total}">0</strong></div>
   <div><span>Categoría con más casos</span><strong>${htmlSeguro(category?.name||"Sin datos")}</strong><small>${porcentaje(topCategory?.[1]||0,total)} del total seleccionado</small></div>
   <div><span>Delito con más casos</span><strong>${htmlSeguro(topCrime?.name||"Sin datos")}</strong><small>${porcentaje(topCrime?.records||0,total)} del total seleccionado</small></div>
 </div>
 <div class="zone-charts">
 <section class="zone-subpanel data-animate"><h4>Participación por categoría</h4><p>El anillo reparte los ${fmtData(total)} casos de ${htmlSeguro(where)} entre las categorías con actividad. Cada segmento representa la proporción de esa categoría y la leyenda muestra su porcentaje y total, lo que permite comparar rápidamente la composición del territorio filtrado.</p>
   ${graficaAnillo(zoneCategories,item=>item.records,item=>item.name,`Participación por categoría en ${where}`)}
   ${parrafoLectura(lecturaRanking(zoneCategories,{valor:item=>item.records,etiqueta:item=>item.name,total,plural:"categorías"}))}
 </section>
 <section class="zone-subpanel data-animate"><h4>Municipios con más casos</h4><p>Se muestran hasta diez municipios ordenados por la suma de casos del periodo elegido. La longitud de las barras facilita la comparación y el valor junto a cada nombre indica el total; el departamento se incluye para distinguir municipios homónimos.</p>
   ${graficaDatos(localMunicipalities,item=>item.records,item=>item.label,true)}
   ${parrafoLectura(lecturaRanking(localMunicipalities,{valor:item=>item.records,etiqueta:item=>item.label,total,plural:"municipios"}))}
 </section>
 <section class="zone-subpanel data-animate"><h4>Delitos con más casos</h4><p>El gráfico compara los ${fmtData(localCrimes.filter(item=>item.records>0).length)} delitos con casos en esta selección y ordena primero los de mayor total. La longitud indica el volumen relativo y la cifra final da el número exacto de casos, útil para reconocer qué delitos concentran más reportes en la zona.</p>
   ${listaCorta(localCrimes.filter(item=>item.records>0))}
   ${parrafoLectura(lecturaRanking(localCrimes.filter(item=>item.records>0),{valor:item=>item.records,etiqueta:item=>item.name,total,plural:"delitos"}))}
 </section>
 <section class="zone-subpanel data-animate"><h4>Evolución anual</h4><p>La línea resume cómo se distribuyen los casos de ${htmlSeguro(where)} entre los años seleccionados. Cada punto representa la suma anual y ayuda a identificar cambios de volumen; no demuestra por sí mismo qué los causó. Los años parciales cubren menos meses y se comparan con cautela.</p>
   ${graficaLineas([{name:"Casos",values:yearlyFiltered.map(item=>item.value)}],yearlyFiltered.map(item=>item.label),`Evolución anual en ${where}`)}
   ${parrafoLectura(lecturaAnual(yearlyFiltered.map(item=>({year:Number(item.label),value:item.value}))))}
 </section></div>
 ${topCrime?`<div class="zone-advice"><b>Una recomendación relacionada</b><p>${htmlSeguro(consejoPrevencion(topCrime.name))}</p></div>`:"<p class=\"data-empty\">No hay casos para esta combinación de filtros.</p>"}`;
 animarAnalisis(result);
 mostrarAlBajar(result);
}
function listaCorta(delitos){
 const grafico=graficaDatos(delitos,item=>item.records,item=>item.name,true);
 if(delitos.length<=10)return grafico;
 return `<div class="lista-corta">${grafico}<button type="button" class="ver-lista" aria-expanded="false" data-total="${delitos.length}">Ver los ${delitos.length} delitos</button></div>`;
}
document.getElementById("zoneResult").addEventListener("click",event=>{
 const boton=event.target.closest(".ver-lista");
 if(!boton)return;
 const abierta=boton.parentElement.classList.toggle("abierta");
 boton.setAttribute("aria-expanded",String(abierta));
 boton.textContent=abierta?"Ver solo los 10 primeros":`Ver los ${boton.dataset.total} delitos`;
 if(!abierta)boton.scrollIntoView({block:"center"});
 revelarAnalisisVisibles();
});
document.getElementById("zoneChange").addEventListener("click",()=>{
 document.querySelector(".zone-controls").scrollIntoView({behavior:"smooth",block:"center"});
 document.getElementById("zoneRegion").focus({preventScroll:true});
});
function filasCSVAnual(year){
 const rows=[["Región","Departamento","Municipio","Categoría","Delito","Año","Casos"]];
 DELITOS_DATA.forEach(crime=>{
  (crime.municipalityData||[]).forEach(item=>{
   const yearData=(item.years||[]).find(entry=>Number(entry.year)===year);
   if(!casos(yearData))return;
   const department=String(item.rawDepartment||"").trim()||"Departamento no especificado";
   const region=item.region||REGION_POR_DEPTO.get(departmentKey(department))||"sin-region";
   const regionName=REGIONES_COLOMBIA.find(candidate=>candidate.id===region)?.name
    ||(region==="sin-region"?"Sin región asignada":region);
   rows.push([
    regionName,department,String(item.rawName||"").trim()||"Municipio no especificado",
    crime.category.rawName,crime.rawName,year,casos(yearData)
   ]);
  });
 });
 return rows;
}
zoneRegion.addEventListener("change",()=>{
 zoneDepartment.value=TODAS_ZONAS;
 zoneMunicipality.value=TODAS_ZONAS;
 renderZoneOptions();
});
zoneDepartment.addEventListener("change",()=>{
 zoneMunicipality.value=TODAS_ZONAS;
 renderZoneOptions();
});
zoneMunicipality.addEventListener("change",renderZona);
conectarRangoAnual("zoneYearFrom","zoneYearTo",renderZona);
conectarRangoAnual("analysisYearFrom","analysisYearTo",actualizarAnalisisCompleto);
document.getElementById("resetZoneFilters").addEventListener("click",()=>{
 zoneYearFrom.value=String(CATALOGO.years[0]);
 zoneYearTo.value=String(CATALOGO.years.at(-1));
 zoneRegion.value=TODAS_ZONAS;
 zoneDepartment.value=TODAS_ZONAS;
 zoneMunicipality.value=TODAS_ZONAS;
 renderZoneOptions();
});
const zoneAnnualCsvStatus=document.getElementById("zoneAnnualCsvStatus");
zoneAnnualCsvYear.addEventListener("change",()=>{zoneAnnualCsvStatus.textContent="";});
document.getElementById("exportAnnualZoneCsv").addEventListener("click",()=>{
 const year=Number(zoneAnnualCsvYear.value);
 const rows=filasCSVAnual(year);
 const recordRows=rows.length-1;
 zoneAnnualCsvStatus.textContent="";
 if(!recordRows){
  zoneAnnualCsvStatus.textContent=`No hay casos registrados para ${year}.`;
  return;
 }
 const recordTotal=rows.slice(1).reduce((sum,row)=>sum+Number(row[6]),0);
 descargarCSV(`indecol-datos-${year}.csv`,rows);
 zoneAnnualCsvStatus.textContent=`CSV ${year} descargado: ${fmtData(recordRows)} combinaciones y ${fmtData(recordTotal)} casos.`;
});
renderAnalisisGeneral();
inicializarAniosZona();
renderZoneOptions();
function registrosDepartamento(selectedKey){
 const crimes=[];
 let total=0;
 DELITOS_DATA.forEach(crime=>{
  const records=(crime.municipalityData||[]).reduce((sum,item)=>
   departmentKey(item.department)===selectedKey
    ?sum+registrosEnRango(item.years)
    :sum,0);
  if(records){
   total+=records;
   crimes.push({name:crime.name,records});
  }
 });
 crimes.sort((a,b)=>b.records-a.records||a.name.localeCompare(b.name,"es"));
 return{total,crimes};
}
function registrosNacionales(){
 const crimes=DELITOS_DATA.map(crime=>({name:crime.name,records:registrosEnRango(crime.years)}))
  .filter(item=>item.records).sort((a,b)=>b.records-a.records||a.name.localeCompare(b.name,"es"));
 return{total:crimes.reduce((sum,item)=>sum+item.records,0),crimes};
}
const mapaDepartamentos=window.INDECOL_MAPA;
mapaDepartamentos?.departments?.forEach(item=>item.name=nombreLugar(item.name));
if(!mapaDepartamentos?.departments?.length){
 throw new Error("No se pudo cargar assets/data/departamentos.js. Regenera el mapa departamental.");
}
const departmentMap=document.getElementById("departmentMap");
const departmentSelection=document.getElementById("departmentSelection");
const departmentCrimes=document.getElementById("departmentCrimes");
function renderDepartmentDetails(key){
 const picker=document.getElementById("departmentPicker");
 if(picker)picker.value=key||"";
 const departamento=mapaDepartamentos.departments.find(item=>item.key===key)?.name;
 const name=departamento||"Colombia";
 const {total,crimes}=departamento?registrosDepartamento(key):registrosNacionales();
 const {startYear,endYear}=rangoAnalisisActual();
 departmentSelection.innerHTML=`<strong>${htmlSeguro(name)}</strong><span>${fmtData(total)} casos · ${startYear}–${endYear} · ${departamento?`${porcentaje(total,totalTerritorialRecords)} del total territorial`:"todo el país"}</span>`;
 if(!total){
  departmentCrimes.innerHTML=`<p class="data-empty">No se encontraron casos SIEDCO asociados a ${htmlSeguro(name)}.</p>`;
  return;
 }
 departmentCrimes.innerHTML=`<h4>Top 10 delitos en ${htmlSeguro(name)}</h4><p>Conteos para ${startYear}–${endYear}. ${departamento?"Al seleccionar el departamento, los demás gráficos también se filtran por este territorio.":"Toca o señala un departamento del mapa para ver su detalle."}</p>
 <div class="map-top-header" aria-hidden="true"><span></span><span>Delito</span><span>Casos</span><span>%</span></div>
 <ol class="map-top-list">${crimes.slice(0,10).map((crime,index)=>`<li>
  <span class="map-rank">${String(index+1).padStart(2,"0")}</span>
  <span class="map-crime-name" title="${htmlSeguro(crime.name)}: ${fmtData(crime.records)} casos, ${porcentaje(crime.records,total)}"><span>${htmlSeguro(crime.name)}</span><i><b data-bar-target style="--bar:${(crime.records/total*100).toFixed(2)}%;--i:${index}"></b></i></span>
  <strong>${fmtData(crime.records)}</strong><small>${porcentaje(crime.records,total)}</small>
 </li>`).join("")}</ol>
 ${departamento?parrafoLectura(`En ${name}, ${crimes[0].name} es el delito con más casos (${porcentaje(crimes[0].records,total)} ${departamento?"del departamento":"del país"}) y los diez primeros de la lista reúnen ${porcentaje(crimes.slice(0,10).reduce((sum,item)=>sum+item.records,0),total)} de sus ${fmtData(total)} casos.`):""}`;
 seguirAlBajar(departmentCrimes);
 const barras=departmentCrimes.querySelectorAll("[data-bar-target]");
 if(movimientoReducido.matches)barras.forEach(barra=>barra.classList.add("data-bar-revealed"));
 else enSiguienteCuadro(()=>barras.forEach(barra=>barra.classList.add("data-bar-revealed")));
}
let detalleDepartamentoActual="";
function setHoveredDepartment(key,forzar=false){
 const visibleKey=departmentPinnedKey||key||"";
 const firma=`${visibleKey}|${departmentPinnedKey}`;
 if(!forzar&&firma===detalleDepartamentoActual)return;
 detalleDepartamentoActual=firma;
 departmentMap.classList.toggle("has-pinned-selection",Boolean(departmentPinnedKey));
 departmentMap.querySelectorAll("[data-department]").forEach(path=>{
  path.classList.toggle("is-active",path.dataset.department===visibleKey);
  path.classList.toggle("is-pinned",path.dataset.department===departmentPinnedKey);
  path.setAttribute("aria-pressed",String(path.dataset.department===departmentPinnedKey));
 });
 renderDepartmentDetails(visibleKey);
}
let departmentTotals=new Map(mapaDepartamentos.departments.map(item=>[
 item.key,registrosDepartamento(item.key).total
]));
let totalTerritorialRecords=[...departmentTotals.values()].reduce((sum,value)=>sum+value,0);
let largestDepartment=Math.max(1,...departmentTotals.values());
function departmentColor(total){
 const intensity=Math.sqrt(total/largestDepartment);
 const desde=[232,218,192],hasta=[24,50,74];
 return `rgb(${desde.map((canal,i)=>Math.round(canal+(hasta[i]-canal)*intensity)).join(", ")})`;
}
const departmentOptions=[...mapaDepartamentos.departments]
 .sort((a,b)=>a.name.localeCompare(b.name,"es"));
const departmentOptionMarkup=departmentOptions.map(item=>
 `<option value="${htmlSeguro(item.key)}">${htmlSeguro(item.name)}</option>`
).join("");
document.getElementById("departmentPicker").innerHTML=
 '<option value="">Todos los departamentos</option>'+departmentOptionMarkup;
["departmentCompareA","departmentCompareB"].forEach((id,index)=>{
 const select=document.getElementById(id);
 select.innerHTML=departmentOptionMarkup;
 const largest=[...departmentTotals.entries()].sort((a,b)=>b[1]-a[1]);
 select.value=largest[index]?.[0]||departmentOptions[index]?.key||"";
 select.addEventListener("change",renderDepartmentComparison);
});
document.getElementById("departmentPicker").addEventListener("change",event=>{
 departmentPinnedKey=event.target.value;
 actualizarAnalisisCompleto();
});
const svgPaths=mapaDepartamentos.departments.map(item=>{
 const total=departmentTotals.get(item.key)||0;
 const fill=departmentColor(total);
 return `<path class="department-shape" data-department="${htmlSeguro(item.key)}" d="${item.path}" fill="${fill}" tabindex="0" role="button" aria-pressed="false" aria-label="${htmlSeguro(item.name)}: ${fmtData(total)} casos reportados"><title>${htmlSeguro(item.name)} · ${fmtData(total)} casos</title></path>`;
}).join("");
departmentMap.innerHTML=`<svg viewBox="${htmlSeguro(mapaDepartamentos.viewBox)}" role="group" aria-label="Mapa interactivo de los departamentos de Colombia">${svgPaths}</svg>`;
function renderDepartmentMap(){
 const {startYear,endYear}=rangoAnalisisActual();
 departmentTotals=new Map(mapaDepartamentos.departments.map(item=>[
  item.key,registrosDepartamento(item.key).total
 ]));
 totalTerritorialRecords=[...departmentTotals.values()].reduce((sum,value)=>sum+value,0);
 largestDepartment=Math.max(1,...departmentTotals.values());
 departmentMap.querySelectorAll("[data-department]").forEach(path=>{
  const total=departmentTotals.get(path.dataset.department)||0;
  const name=mapaDepartamentos.departments.find(item=>item.key===path.dataset.department)?.name||path.dataset.department;
  path.setAttribute("fill",departmentColor(total));
  path.setAttribute("aria-label",`${name}: ${fmtData(total)} casos entre ${startYear} y ${endYear}`);
  path.querySelector("title").textContent=`${name} · ${fmtData(total)} casos`;
 });
 setHoveredDepartment(departmentPinnedKey,true);
}
function renderDepartmentComparison(){
 const firstSelect=document.getElementById("departmentCompareA");
 const secondSelect=document.getElementById("departmentCompareB");
 if(departmentPinnedKey){
  firstSelect.value=departmentPinnedKey;
  if(secondSelect.value===departmentPinnedKey){
   secondSelect.value=departmentOptions.find(item=>item.key!==departmentPinnedKey)?.key||"";
  }
 }
 const first=firstSelect.value;
 const second=secondSelect.value;
 const result=document.getElementById("departmentCompareResult");
 const firstName=departmentOptions.find(item=>item.key===first)?.name;
 const secondName=departmentOptions.find(item=>item.key===second)?.name;
 if(!firstName||!secondName||first===second){
  result.innerHTML='<p class="data-empty">Selecciona dos departamentos distintos para compararlos.</p>';
  return;
 }
 const firstData=registrosDepartamento(first),secondData=registrosDepartamento(second);
 const firstCrimes=new Map(firstData.crimes.map(item=>[item.name,item.records]));
 const secondCrimes=new Map(secondData.crimes.map(item=>[item.name,item.records]));
 const rows=[...new Set([...firstCrimes.keys(),...secondCrimes.keys()])]
  .map(name=>({name,first:firstCrimes.get(name)||0,second:secondCrimes.get(name)||0}))
  .sort((a,b)=>Math.max(b.first,b.second)-Math.max(a.first,a.second)||a.name.localeCompare(b.name,"es"))
  .slice(0,10);
 const {startYear,endYear}=rangoAnalisisActual();
 const mayor=firstData.total>=secondData.total?{name:firstName,data:firstData}:{name:secondName,data:secondData};
 const menor=mayor.name===firstName?{name:secondName,data:secondData}:{name:firstName,data:firstData};
 const brecha=[...rows].sort((a,b)=>Math.abs(b.first-b.second)-Math.abs(a.first-a.second))[0];
 const compartidos=rows.filter(item=>item.first&&item.second).length;
 const lecturaComparacion=`${mayor.name} registra ${fmtData(mayor.data.total)} casos entre ${startYear} y ${endYear}${menor.data.total?`, ${fmtDecimal((mayor.data.total/menor.data.total-1)*100)}% más que ${menor.name} (${fmtData(menor.data.total)})`:`, mientras ${menor.name} no tiene casos en el periodo`}. El delito principal es ${firstData.crimes[0]?.name||"—"} en ${firstName} y ${secondData.crimes[0]?.name||"—"} en ${secondName}.${brecha?` La mayor diferencia aparece en ${brecha.name}: ${fmtData(Math.abs(brecha.first-brecha.second))} casos de distancia.`:""} ${compartidos} de los ${rows.length} delitos de la tabla tienen casos en ambos departamentos.`;
 result.innerHTML=`<p>Compara conteos SIEDCO de ${startYear}–${endYear}, no tasas ajustadas por población. Se muestran los delitos con mayor volumen en cualquiera de los dos departamentos.</p>
 <div class="department-compare-chart">${graficaDatos(
  [{label:firstName,value:firstData.total},{label:secondName,value:secondData.total}],
  item=>item.value,item=>item.label,true)}</div>
 ${parrafoLectura(lecturaComparacion)}
 <div class="department-compare-table-wrap"><table><caption>Diez delitos con mayor conteo combinado · ${startYear}–${endYear}</caption>
 <thead><tr><th scope="col">Delito</th><th scope="col">${htmlSeguro(firstName)}</th><th scope="col">${htmlSeguro(secondName)}</th></tr></thead>
 <tbody>${rows.map(item=>`<tr><th scope="row">${htmlSeguro(item.name)}</th><td>${fmtData(item.first)}</td><td>${fmtData(item.second)}</td></tr>`).join("")}</tbody>
 </table></div>`;
 animarAnalisis(result.closest(".data-animate"));
 mostrarAlBajar(result);
}
renderDepartmentComparison();
renderDepartmentMap();
renderAnalisisNarrativa();
renderHomeInsight();
departmentMap.addEventListener("pointerover",event=>{
 const path=event.target.closest("[data-department]");
 if(path&&!departmentPinnedKey)setHoveredDepartment(path.dataset.department);
});
departmentMap.addEventListener("focusin",event=>{
 const path=event.target.closest("[data-department]");
 if(path&&!departmentPinnedKey)setHoveredDepartment(path.dataset.department);
});
departmentMap.addEventListener("click",event=>{
 const path=event.target.closest("[data-department]");
 if(!path)return;
 departmentPinnedKey=departmentPinnedKey===path.dataset.department?"":path.dataset.department;
 actualizarAnalisisCompleto();
});
departmentMap.addEventListener("keydown",event=>{
 const path=event.target.closest("[data-department]");
 if(!path||!["Enter"," "].includes(event.key))return;
 event.preventDefault();
 departmentPinnedKey=departmentPinnedKey===path.dataset.department?"":path.dataset.department;
 actualizarAnalisisCompleto();
});
[["stat-records",CATALOGO.totalCases],["stat-crimes",CATALOGO.crimeCount],["stat-categories",CATALOGO.categoryCount]].forEach(([id,value])=>{
 const elemento=document.getElementById(id);
 if(!elemento)return;
 elemento.dataset.countValue=value;
 elemento.textContent=fmtData(value);
});
const periodoDatos=document.getElementById("stat-period");
if(periodoDatos)periodoDatos.textContent=CATALOGO.years.length
 ?`${CATALOGO.years[0]}–${CATALOGO.years.at(-1)}`:"Sin fechas válidas";
const registrosPortada=document.getElementById("heroRecordCount");
if(registrosPortada)registrosPortada.textContent=fmtData(CATALOGO.totalCases);
const rpubsCases=document.getElementById("rpubsCases");
if(rpubsCases)rpubsCases.textContent=fmtData(CATALOGO.totalCases);
(function hallazgosInforme(){
 const destino=document.getElementById("rpubsHallazgos");
 const completos=[...totalAnual].filter(([year])=>periodosCompletos.has(year)).sort((a,b)=>a[0]-b[0]);
 if(!destino||completos.length<2)return;
 const [primero,ultimo]=[completos[0],completos.at(-1)],cambio=(ultimo[1]/primero[1]-1)*100;
 const [clave,casosDepto]=[...departmentTotals].sort((a,b)=>b[1]-a[1])[0];
 const depto=mapaDepartamentos.departments.find(item=>item.key===clave)?.name;
 const categoria=[...CATEGORIAS].sort((a,b)=>casos(b)-casos(a))[0];
 destino.innerHTML=[
  [`${cambio>=0?"+":"−"}${fmtDecimal(Math.abs(cambio))}%`,"Evolución",`Los casos pasaron de ${fmtData(primero[1])} en ${primero[0]} a ${fmtData(ultimo[1])} en ${ultimo[0]}, los años completos de los extremos.`],
  [porcentaje(casosDepto,totalTerritorialRecords),"Territorio",`${depto} concentra la mayor parte de los casos con departamento identificado: ${fmtData(casosDepto)}.`],
  [porcentaje(casos(categoria),CATALOGO.totalCases),"Categoría",`${categoria.name} es la categoría con más casos: ${fmtData(casos(categoria))}.`]
 ].map(([cifra,tema,texto])=>`<article><span>${tema}</span><strong>${cifra}</strong><p>${htmlSeguro(texto)}</p></article>`).join("");
})();
const periodoPortada=document.getElementById("heroPeriod");
if(periodoPortada)periodoPortada.textContent=CATALOGO.years.length
 ?`${CATALOGO.years[0]}–${CATALOGO.years.at(-1)}`:"Periodo no disponible";
const departamentosPortada=document.getElementById("heroDepartmentCount");
if(departamentosPortada)departamentosPortada.textContent=`${mapaDepartamentos.departments.length} departamentos`;
const mapaPortada=document.getElementById("heroMap");
if(mapaPortada)mapaPortada.innerHTML=`<svg viewBox="${htmlSeguro(mapaDepartamentos.viewBox)}" focusable="false">${mapaDepartamentos.departments.map(item=>`<path d="${htmlSeguro(item.path)}"></path>`).join("")}</svg>`;
DELITOS.splice(0,DELITOS.length,...DELITOS_DATA.map(crime=>({nombre:crime.name})));
document.getElementById("dvCnt").textContent=`${CATALOGO.categoryCount} categorías · ${CATALOGO.crimeCount} delitos`;
dvNav.innerHTML=CATEGORIAS.map(category=>`<div class="dg" data-cat="${htmlSeguro(category.id)}">
 <button type="button" class="dgh" aria-expanded="false"><span>${htmlSeguro(category.name)}</span><em>${category.crimes.length}</em><i></i></button>
 <div class="dgl"><div>
  <div class="di category-link" data-q="${htmlSeguro(norm(category.name))}"><a class="dil" href="#delitos/${encodeURIComponent(category.id)}"><span>${iconoCategoria(category.id)}</span>Ver análisis de categoría</a></div>
  ${category.crimes.map(crime=>`<div class="di" data-crime="${htmlSeguro(crime.id)}" data-q="${htmlSeguro(norm(`${category.name} ${crime.name}`))}"><a class="dil" href="#delitos/${encodeURIComponent(category.id)}/${encodeURIComponent(crime.id)}"><span>${iconoCategoria(category.id)}</span>${htmlSeguro(crime.name)}</a></div>`).join("")}
 </div></div>
</div>`).join("")+'<p class="dv-vacio" id="dvNo" hidden>No hay categorías o delitos con ese nombre.</p>';
const mapaCobertura=`<svg class="info-coverage-map" viewBox="${htmlSeguro(mapaDepartamentos.viewBox)}" role="img" aria-label="Mapa de Colombia dividido por departamentos">${mapaDepartamentos.departments.map(item=>`<path d="${htmlSeguro(item.path)}"></path>`).join("")}</svg>`;
const INFO=[
 {title:"Qué es Indecol",visual:'<img class="info-brand-logo" src="assets/images/logo-principal.png" alt="Logotipo de Indecol">',text:"Indecol significa Indicadores Delictivos en Colombia. Es una página para explorar los casos reportados por delito, año y territorio, pensada para estudiantes, periodistas, autoridades locales y cualquier ciudadano que quiera entender mejor su entorno con datos."},
 {title:"Fuente",visual:'<div class="info-source-mark"><img src="assets/images/escudo-policia-nacional.png" alt="Escudo de la Policía Nacional de Colombia"><span><strong>SIEDCO</strong><small>Policía Nacional de Colombia</small></span></div>',text:`Los datos provienen del Sistema de Información Estadístico, Delincuencial, Contravencional y Operativo (SIEDCO), de la Policía Nacional. Aquí se suma la columna casos de ${CATALOGO.years[0]} a ${CATALOGO.years.at(-1)} para su consulta. SIEDCO consolida las denuncias y actuaciones registradas por la Policía en todo el país.`,link:"https://portalsiedco.policia.gov.co:4443/extensions/PortalPublico/index.html",linkLabel:"Visitar el portal oficial"},
 {title:"Cobertura",visual:mapaCobertura,text:`La base reúne ${fmtData(CATALOGO.totalCases)} casos para ${CATALOGO.crimeCount} delitos, agrupados en ${CATALOGO.categoryCount} categorías, entre ${CATALOGO.years[0]} y ${CATALOGO.years.at(-1)}. Incluye ${mapaDepartamentos.departments.length} departamentos y ${fmtData(zonaMunicipios.size)} municipios; en el mapa de Análisis puedes explorar los casos por departamento.`},
 {title:"Cómo leer los datos",visual:'<svg class="info-reading-icon" viewBox="0 0 120 90" aria-hidden="true"><path d="M12 75h96M22 68V47h17v21M52 68V29h17v39M82 68V15h17v53" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="7"></path><path d="m18 35 25-15 24 2 28-14" fill="none" stroke="var(--oro-d)" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"></path><circle cx="18" cy="35" r="4" fill="var(--oro-d)"></circle><circle cx="43" cy="20" r="4" fill="var(--oro-d)"></circle><circle cx="67" cy="22" r="4" fill="var(--oro-d)"></circle><circle cx="95" cy="8" r="4" fill="var(--oro-d)"></circle></svg>',text:`Cada cifra suma la columna casos de la base final. Los gráficos comparan los casos por delito y territorio, y bajo cada uno encontrarás una lectura con sus cifras clave. ${CATALOGO.yearCoverage?.at(-1)?.complete===false?`El periodo ${CATALOGO.yearCoverage.at(-1).year} incluye datos hasta ${MESES_COMPLETOS[CATALOGO.yearCoverage.at(-1).monthsAvailable.at(-1)-1]}.`:""}`}
];
const RETRATO_PALETAS=["#d9b8a5","#c99e82","#e4c4a0","#b9856d","#d8aa83","#c8a9a0","#dfb994","#ae806b"];
const integrantes=Array.from({length:22},(_,index)=>{
 const numero=index+1;
 const rol=numero===1?"Líder de Backend":numero===2?"Líder de Frontend":numero<=7?"Equipo Frontend":"Equipo Backend";
 return{
  id:numero<=2?"leader":"member",
  numero:String(numero).padStart(2,"0"),
  nombre:`Integrante ${String(numero).padStart(2,"0")}`,
  tono:RETRATO_PALETAS[index%RETRATO_PALETAS.length],
  desc:rol
 };
});
const instructores=[
 {id:"instructor",nombre:"Instructor Roymer",tono:"#c49a78",desc:"Instructor del proyecto."},
 {id:"instructor",nombre:"Instructor Miguel",tono:"#a77d68",desc:"Instructor del proyecto."}
];
const tarjetaEquipo=e=>`<article class="eqb ${e.id}" role="listitem" tabindex="0" aria-label="${htmlSeguro(e.nombre)}. ${htmlSeguro(e.desc)}. Retrato ilustrado provisional.">
 <figure class="team-portrait" style="--portrait-tone:${e.tono}">
  <svg viewBox="0 0 160 160" role="img" aria-label="Avatar ilustrado de ${htmlSeguro(e.nombre)}">
   <rect width="160" height="160" rx="28" fill="#e9dccb"/>
   <path d="M25 160c3-31 23-48 55-48s52 17 55 48" fill="#203d56"/>
   <path d="M63 105h34v27c-8 9-26 9-34 0z" fill="${e.tono}"/>
   <ellipse cx="80" cy="73" rx="38" ry="45" fill="${e.tono}"/>
   <path d="M42 70c-4-36 14-54 41-53 28 1 40 22 34 52-9-5-16-16-19-27-12 13-31 19-56 18z" fill="#302b2a"/>
   <ellipse cx="66" cy="77" rx="3.5" ry="4" fill="#203d56"/>
   <ellipse cx="94" cy="77" rx="3.5" ry="4" fill="#203d56"/>
   <path class="team-mouth-neutral" d="M68 97h24"/>
   <path class="team-mouth-smile" d="M67 93q13 17 26 0"/>
  </svg>
  <figcaption class="team-portrait-hint">Pasa el cursor o enfoca para animar</figcaption>
 </figure>
 ${e.numero?`<span class="team-index" aria-label="Número ${Number(e.numero)}">${e.numero}</span>`:'<span class="team-index" aria-hidden="true">I</span>'}
 <h3>${htmlSeguro(e.nombre)}</h3><p class="d">${htmlSeguro(e.desc)}</p>
</article>`;
const grupoEquipo=(id,titulo,items,clase="")=>`<section class="team-group" aria-labelledby="${id}">
 <h3 id="${id}">${titulo}</h3>
 <div class="team-cards ${clase}" role="list">${items.map(tarjetaEquipo).join("")}</div>
</section>`;
document.getElementById("eq").innerHTML=[
 grupoEquipo("team-instructors-title","Instructores",instructores,"team-instructors"),
 grupoEquipo("team-leaders-title","Liderazgo",integrantes.slice(0,2),"team-leaders"),
 grupoEquipo("team-frontend-title","Frontend",integrantes.slice(2,7),"team-frontend"),
 grupoEquipo("team-backend-title","Backend",integrantes.slice(7),"team-backend")
].join("");
const teamList=document.getElementById("eq");
teamList.addEventListener("pointerover",event=>{
 const card=event.target.closest(".eqb");
 if(card)card.classList.add("is-active");
});
teamList.addEventListener("pointerout",event=>{
 const card=event.target.closest(".eqb");
 if(card&&!card.contains(event.relatedTarget))card.classList.remove("is-active");
});
teamList.addEventListener("focusin",event=>{
 const card=event.target.closest(".eqb");
 if(card)card.classList.add("is-active");
});
teamList.addEventListener("focusout",event=>{
 const card=event.target.closest(".eqb");
 if(card&&!card.contains(event.relatedTarget))card.classList.remove("is-active");
});
document.getElementById("info").innerHTML=INFO.map((item,k)=>`<article class="info-card" style="--k:${k}"><div class="info-card-visual">${item.visual}</div><h3>${htmlSeguro(item.title)}</h3><p>${htmlSeguro(item.text)}</p>${item.link?`<a class="info-source-link" href="${htmlSeguro(item.link)}" target="_blank" rel="noopener noreferrer">${htmlSeguro(item.linkLabel)}</a>`:""}</article>`).join("");
function contar(el){
 const n=+el.dataset.n,s=el.dataset.s||"",t0=performance.now();
 (function f(t1){const p=Math.min((t1-t0)/1500,1);el.textContent=Math.round(n*(1-Math.pow(1-p,3))).toLocaleString("es-CO")+s;if(p<1)requestAnimationFrame(f)})(t0);
}
const DASHBOARD_URL="https://app.powerbi.com/view?r=eyJrIjoiNjA2MGE5ZjYtOWNlMC00YzUzLTgyNGYtMzRkNDBlMzM2ZTVlIiwidCI6ImNiZTM5ZThmLTNlODktNDQ4Zi04M2FlLWVlYWI3MWU1ZjNiMSIsImMiOjl9";
let dashListo=false;
function cargarInforme({url,frameId,placeholderId,actionsId,title,fullscreenId}){
 const frame=document.getElementById(frameId),placeholder=document.getElementById(placeholderId),actions=document.getElementById(actionsId);
 const loading=document.createElement("div");loading.className="dbl";loading.textContent="Cargando informe…";
 const iframe=document.createElement("iframe");iframe.title=title;iframe.src=url;
 iframe.setAttribute("loading","lazy");
 iframe.setAttribute("allowfullscreen","true");iframe.setAttribute("frameborder","0");iframe.setAttribute("referrerpolicy","no-referrer-when-downgrade");
 const loadingTimer=setTimeout(()=>{
  if(loading.isConnected)loading.textContent="El informe no cargó aquí. Usa «Abrir en otra pestaña».";
 },5000);
 iframe.addEventListener("load",()=>{clearTimeout(loadingTimer);loading.remove()},{once:true});
 placeholder.remove();frame.append(iframe,loading);
 const openLink=document.createElement("a");openLink.href=url;openLink.target="_blank";openLink.rel="noopener noreferrer";openLink.textContent="Abrir en otra pestaña";
 if(fullscreenId){
  const fullscreen=document.createElement("button");fullscreen.type="button";fullscreen.id=fullscreenId;fullscreen.textContent="Pantalla completa";
  fullscreen.addEventListener("click",()=>{const request=frame.requestFullscreen||frame.webkitRequestFullscreen;if(request)request.call(frame)});
  actions.append(fullscreen);
 }
 actions.append(openLink);
}
function cargarDash(){
 if(dashListo)return;dashListo=true;
 cargarInforme({url:DASHBOARD_URL,frameId:"dbf",placeholderId:"dbv",actionsId:"dbt",title:"Dashboard de Indecol",fullscreenId:"dbfs"});
}
// carrusel del inicio: una imagen para cada categoría del catálogo
const CATEGORY_CAROUSEL={
 "control-de-armas-sustancias-y-capturas":{
  label:"Control de armas, sustancias y capturas",src:"assets/images/portada-02.jpg",position:"50% 48%",alt:"Paquetes incautados durante un operativo"
 },
 "delitos-contra-bienes-y-recursos":{
  label:"Delitos contra bienes y recursos",src:"assets/images/portada-06.jpg",position:"50% 48%",alt:"Carga comercial bajo inspección"
 },
 "delitos-contra-la-vida-e-integridad":{
  label:"Delitos contra la vida e integridad",src:"assets/images/portada-03.jpg",position:"52% 50%",alt:"Una persona enfrenta un robo junto a su vehículo"
 },
 "delitos-informaticos-y-propiedad-intelectual":{
  label:"Delitos informáticos y propiedad intelectual",src:"assets/images/categoria-digital.jpg",position:"68% 50%",alt:"Persona frente a pantallas con elementos de seguridad digital y derechos de autor"
 },
 "gestion-y-funcion-publica":{
  label:"Gestión y función pública",src:"assets/images/portada-01.jpg",position:"52% 35%",alt:"Estatua de la justicia frente a un edificio"
 },
 "libertad-movilidad-humana-y-secuestros":{
  label:"Libertad, movilidad humana y secuestros",src:"assets/images/portada-05.jpg",position:"52% 42%",alt:"Carteles de búsqueda de personas desaparecidas"
 },
 "modalidades-de-hurtos":{
  label:"Modalidades de hurtos",src:"assets/images/portada-04.jpg",position:"50% 38%",alt:"Robo de pertenencias personales"
 },
 "proteccion-ambiental-y-animal":{
  label:"Protección ambiental y animal",src:"assets/images/categoria-ambiental.jpg",position:"50% 50%",alt:"Voluntarios protegen el bosque y ayudan a la fauna silvestre"
 },
 "vehiculos-y-transito":{
  label:"Vehículos y tránsito",src:"assets/images/portada-07.jpg",position:"52% 50%",alt:"Patio con motocicletas recuperadas"
 }
};
const CRIME_IMAGE_FILE_OVERRIDES=new Map([
 ["Capturas","CAPTURAS COLOMBIA.jpg"],
 ["Incautacion Armas de Fuego","INCAUTACION ARMAS COLOMBIA.jpg"],
 ["Incautacion de Estupefacientes","INCAUTACION DROGAS COLOMBIA.jpg"],
 ["Hurto a Motocicletas","- Hurto a Motocicletas.jpg"],
 ["Hurto a Personas","- Hurto a Personas.jpg"]
]);
function rutaImagenDelito(crime){
 const filename=CRIME_IMAGE_FILE_OVERRIDES.get(crime.rawName)||`${crime.rawName}.jpg`;
 return new URL(`assets/images/categoria y delitos/delitos/${filename}`,document.baseURI).href;
}
function visualDelitos(source,description){
 return `<div class="data-hero-visual" role="img" aria-label="${htmlSeguro(description)}" style="--category-image:url('${htmlSeguro(source)}')"></div>`;
}
function visualCategoria(category){
 const source=new URL(`assets/images/categoria y delitos/${category.rawName}.jpg`,document.baseURI).href;
 return visualDelitos(source,`Imagen de la categoría ${category.name}`);
}
function visualDelito(category,crime){
 return visualDelitos(rutaImagenDelito(crime),`Imagen de ${crime.name}, categoría ${category.name}`);
}
const heroCarousel=document.getElementById("heroCarousel");
const categoryLabel=document.getElementById("carouselCategory");
const pts=document.getElementById("dots");
const sds=CATEGORIAS.map((category,index)=>{
 const image=CATEGORY_CAROUSEL[category.id];
 if(!image)throw new Error(`Falta la imagen del carrusel para la categoría ${category.name}.`);
 const slide=document.createElement("div");
 slide.className=`sd${index===0?" on":""}`;
 slide.setAttribute("aria-hidden",String(index!==0));
 if(index===0)slide.style.backgroundImage=`url("${image.src}")`;
 slide.style.setProperty("--bp",image.position);
 slide.setAttribute("aria-label",`${image.label}: ${image.alt}`);
 heroCarousel.append(slide);
 return slide;
});
let cur=0,tmr;
pts.innerHTML=CATEGORIAS.map(category=>`<button type="button" aria-label="Ver categoría: ${htmlSeguro(category.name)}"><i></i></button>`).join("");
pts.children[0].classList.add("on");
pts.children[0].setAttribute("aria-current","true");
categoryLabel.textContent=CATEGORY_CAROUSEL[CATEGORIAS[0].id].label;
heroCarousel.setAttribute("aria-label",`Categoría destacada: ${CATEGORY_CAROUSEL[CATEGORIAS[0].id].label}. ${CATEGORY_CAROUSEL[CATEGORIAS[0].id].alt}`);
function ver(i){
 if(i===cur)return;
 const image=CATEGORY_CAROUSEL[CATEGORIAS[i].id];
 if(!sds[i].dataset.imageLoaded){sds[i].style.backgroundImage=`url("${image.src}")`;sds[i].dataset.imageLoaded="true"}
 const o=sds[cur];o.classList.remove("on");o.classList.add("out");setTimeout(()=>o.classList.remove("out"),1600);
 o.setAttribute("aria-hidden","true");
 pts.children[cur].classList.remove("on");pts.children[cur].removeAttribute("aria-current");
 cur=i;sds[i].classList.add("on");sds[i].setAttribute("aria-hidden","false");pts.children[i].classList.add("on");pts.children[i].setAttribute("aria-current","true");
 categoryLabel.textContent=CATEGORY_CAROUSEL[CATEGORIAS[i].id].label;
 heroCarousel.setAttribute("aria-label",`Categoría destacada: ${CATEGORY_CAROUSEL[CATEGORIAS[i].id].label}. ${CATEGORY_CAROUSEL[CATEGORIAS[i].id].alt}`);
}
function auto(){
 clearInterval(tmr);
 if(movimientoReducido.matches)return;
 tmr=setInterval(()=>ver((cur+1)%sds.length),5000);
}
[...pts.children].forEach((b,i)=>b.addEventListener("click",()=>{ver(i);auto()}));
movimientoReducido.addEventListener("change",auto);
auto();
const footerTemplate=document.getElementById("siteFooterTemplate");
document.querySelectorAll(".pg").forEach(section=>section.append(footerTemplate.content.cloneNode(true)));
const pages=[...document.querySelectorAll(".pg")],links=[...document.querySelectorAll("nav .links a")];
const nav=document.querySelector("nav"),navToggle=document.getElementById("navToggle");
const cerrarMenuNavegacion=()=>{nav.classList.remove("open");navToggle.setAttribute("aria-expanded","false");navToggle.setAttribute("aria-label","Abrir menú de navegación")};
navToggle.addEventListener("click",()=>{
 const open=nav.classList.toggle("open");
 navToggle.setAttribute("aria-expanded",String(open));
 navToggle.setAttribute("aria-label",open?"Cerrar menú de navegación":"Abrir menú de navegación");
});
links.forEach(link=>link.addEventListener("click",cerrarMenuNavegacion));
document.addEventListener("keydown",event=>{if(event.key==="Escape")cerrarMenuNavegacion()});
let ultimoDestino="";
function ruta(forzar){
 let raw=typeof forzar==="string"?forzar:location.hash.slice(1);
 let [base,sel,sub]=raw.split("/").map(part=>{
  try{return decodeURIComponent(part||"")}catch{return part||""}
 });
 if(DELITO_POR_ID.has(base)){sub=base;sel=DELITO_POR_ID.get(base).category.id;base="delitos"}
 let pg=pages.find(p=>p.id===base),ancla=null;
 if(!pg){ancla=document.getElementById(base);pg=pages[0]}
 const mismo=pg.id==="delitos"&&pg.classList.contains("active");
 if(!mismo){pages.forEach(p=>{p.classList.remove("active","in")});void pg.offsetWidth;pg.classList.add("active","in");window.scrollTo(0,0)}
 else if(pg.id==="delitos"&&ultimoDestino!==raw)window.scrollTo({top:0,behavior:"instant"});
 if(pg.id==="dashboard")cargarDash();
 links.forEach(a=>a.classList.toggle("act",a.getAttribute("href")==="#"+pg.id));
 if(pg.id==="delitos"){
  if(sub)paginaDelito(sel,sub);
  else if(DELITO_POR_ID.has(sel)){
   const crime=DELITO_POR_ID.get(sel);
   paginaDelito(crime.category.id,crime.id);
  }else paginaCategoria(sel||CATEGORIAS[0]?.id);
 }
 else{
  // Igual que en Delitos: cada visita a la página vuelve a reproducir las animaciones de sus gráficos.
  animarAnalisis(pg,true);
  pg.querySelectorAll("[data-n]").forEach(contar);
  if(ancla&&pg.contains(ancla))setTimeout(()=>ancla.scrollIntoView({behavior:"smooth"}),50)
 }
 mostrarAlBajar(pg,!mismo);
 ultimoDestino=raw;
}
document.addEventListener("click",e=>{
 const a=e.target.closest&&e.target.closest('a[href^="#"]');
 if(!a||a.hasAttribute("data-menu"))return;
 const h=a.getAttribute("href");if(h.length<2)return;
 e.preventDefault();ruta(h.slice(1));
 try{history.pushState(null,"",h)}catch(x){}
});
addEventListener("hashchange",()=>ruta());addEventListener("popstate",()=>ruta());ruta();

// ===== introducción: el total debe salir de la base de datos del proyecto =====
const INTRO={desde:CATALOGO.years[0]||2020,total:CATALOGO.totalCases};
(function(){
 const MAPA={"w":722,"h":1000,"ring":[216,752,190,738,161,718,144,728,93,720,79,694,68,695,8,661,0,642,22,638,20,608,34,586,63,582,88,544,111,513,89,499,100,464,87,410,100,394,90,343,66,312,74,282,93,287,104,269,90,234,98,225,128,227,173,185,198,179,198,159,209,109,243,81,281,80,286,67,332,72,379,42,402,29,431,0,452,4,468,19,456,39,418,50,403,79,380,97,363,119,355,161,339,196,369,200,377,228,390,241,395,265,388,287,390,300,405,305,419,325,495,320,530,327,572,379,596,372,639,375,673,369,694,379,683,411,670,431,665,474,677,514,694,532,696,545,666,575,688,588,704,609,722,668,710,676,699,640,682,621,663,642,547,641,547,678,582,684,580,707,568,701,535,711,534,754,561,776,570,810,569,836,542,1000,512,968,494,967,533,906,487,878,451,883,430,873,397,889,353,881,318,818,290,803,271,775,231,747,216,752],"dots":[540,847,164,518,480,841,188,236,238,732,29,648,225,203,542,658,132,654,510,670,541,795,455,533,540,829,370,693,476,710,374,517,333,163,531,689,443,872,242,494,607,479,292,348,290,118,412,650,505,877,671,591,105,283,436,824,395,63,254,585,179,327,493,693,442,506,437,651,237,241,482,578,457,15,61,661,665,484,118,695,598,404,581,416,226,567,253,532,591,432,180,266,325,269,527,649,393,700,327,300,170,247,467,549,426,492,423,24,471,800,653,545,391,525,348,367,247,265,346,141,435,689,318,183,187,693,393,549,659,443,349,617,372,618,482,458,123,318,434,10,664,402,476,362,490,815,552,573,343,503,174,440,180,422,220,324,650,588,114,300,406,350,333,575,268,595,558,508,654,383,537,379,294,611,445,850,383,816,361,668,651,501,143,220,239,646,508,827,540,899,28,668,229,276,73,575,192,642,80,307,325,140,415,560,423,664,414,779,550,364,589,453,212,578,527,578,226,255,465,498,283,399,284,507,391,717,708,657,502,594,403,671,234,544,343,819,379,875,457,746,55,624,488,609,510,636,514,763,458,825,331,237,175,390,365,319,433,550,328,339,478,742,528,616,327,318,261,500,137,387,339,840,415,826,491,428,437,457,194,466,353,571,359,553,480,379,131,720,450,475,439,781,118,512,246,349,481,632,130,582,315,773,414,880,395,314,514,860,350,864,533,921,219,381,541,413,574,699,527,670,497,762,182,515,90,626,440,736,138,302,260,428,357,383,205,215,372,400,90,559,234,151,141,319,461,372,585,634,507,806,295,73,234,469,164,598,253,549,387,366,87,594,495,390,369,485,632,640,265,303,327,533,112,716,345,286,569,523,310,166,317,677,442,33,243,109,285,269,700,638,225,305,608,586,250,705,182,293,445,432,447,766,247,91,106,228,377,677,323,438,157,369,336,207,149,243,327,458,47,645,572,618,210,711,529,451,512,447,302,757,319,706,402,491,487,675,459,699,102,604,346,259,548,556,323,751,562,389,145,710,240,606,152,435,668,564,417,397,585,575,268,340,8,645,390,455,295,155,232,407,267,388,226,628,204,332,501,324,130,250,514,394,299,409,594,373,641,421,153,623,647,562,189,717,181,310,480,341,502,845,267,566,397,883,310,493,399,80,293,137,386,497,534,509,572,460,185,481,296,283,305,554,198,262,235,518,601,527,588,472,96,361,554,617,639,522,346,684,592,509,509,966,289,446,118,632,161,546,506,564,453,356,33,626,325,386,304,698,691,617,69,598,101,447,21,610,557,802,617,533,141,488,384,754,145,505,679,391,500,472,322,516,679,549,209,289,426,435,615,618,249,142,347,424,519,729,127,232,364,720,458,784,125,602,366,642,255,375,176,574,106,254,159,227,93,431,270,620,505,498,137,461,280,224,491,554,279,251,292,741,419,597,495,710,307,659,400,440,533,743,357,835,195,565,389,336,455,418,214,441,556,704,359,220,399,602,644,627,283,171,139,364,254,675,455,725,271,734,255,639,227,586,623,575,662,634,201,415,337,788,379,583,279,669,289,688,161,417,672,372,223,105,47,590,560,890,260,765,244,421,380,238,517,529,524,556,242,750,217,545,455,394,76,324,508,612,316,116,207,145,569,824,631,379,574,548,460,636,263,123,530,778,679,519,452,681,317,620,409,373,578,498,306,455,625,486,442,708,169,630,109,672,618,414,189,367,430,620,136,537,281,326,468,879,406,760,352,91,427,861,439,582,186,202,513,483,477,596,138,284,418,326,106,393,134,412,596,619,443,807,517,354,264,475,481,779,378,98,438,328,488,525,425,44,370,252,615,639,117,432,497,653,200,619,689,595,562,842,223,603,288,487,330,552,679,412,232,663,275,712,349,71,284,304,553,536,95,704,267,97,97,327,122,267,316,725,134,435,154,452,511,426,148,663,362,768,255,458,305,437,342,664,544,678,192,399,425,801,454,657,307,338,413,418,215,497,431,345,665,609,344,589,548,868,355,797,262,282,466,444,542,478,187,666,373,465,237,189,366,367,227,169,423,529,467,765,539,431,273,529,543,636,173,650,309,637,609,552,142,638,83,656,579,592,503,737,197,500,336,484,530,812,224,137,97,309,389,841,630,555,385,386,157,400,592,559,317,421,268,447,411,728,400,574,561,480,155,340,223,357,144,608,121,344,551,780,200,525,328,809,252,327,419,456,454,563,299,524,263,197,303,257,40,609,362,112,374,600,380,564,309,600,500,365,400,797,351,465,478,860,385,779,389,276,346,174,383,650,469,405,293,470,340,400,196,738,160,312,474,658,471,515,369,54,274,641,663,528,215,739,342,722,427,758,200,162,189,546,221,691,484,496,283,763,83,289,647,473,265,163,342,223,337,119,512,691,198,184,152,684,376,434,530,713,87,683,362,532,102,344,560,640,298,102,363,852,327,88,306,309,563,426,150,263,310,86,380,76,167,203,254,245,359,300,412,700,218,422,288,791,455,603,364,746,221,648,364,419,404,849,285,550,160,291,245,439,255,722,528,339,238,223,212,459,303,583,101,650,344,333,116,365,403,628,372,339,364,272,545,599,247,393,169,461,205,662,613,380,534,976,106,573,163,705,438,380,124,473,184,599,202,351,282,86,75,634,503,787,152,581,281,420,314,228,374,292,218,480,315,202,116,410,467,616,320,367,272,685,220,233,206,306,232,711,616,510,317,791,204,242,118,535,636,601,513,945,208,117,275,144,293,238,309,394,277,365,168,485,398,406,297,201,110,489,625,449,535,537,407,508,332,641,361,444,182,347,537,945,134,554]};
 const $=id=>document.getElementById(id),el=$("ix");if(!el)return;
 const fmt=n=>Math.round(n).toLocaleString("es-CO"),cv=$("ixC"),cx=cv.getContext("2d"),cam=$("ixCam"),num=$("ixNum"),cnt=$("ixCnt"),st=$("ixSt");
 const T={ini:.8,cuenta:7.2,imp:8.0,cards:10.0,b:[10.0,10.8,11.6,12.4,13.2],txt:14.8,col:18.6,pt:20.2,logo:20.5,sub:22.3,fin:25.0},NT=140,EXP=2.4,NY=CATALOGO.years.length||1;
 const total=INTRO.total;
 const aniosIntro=CATALOGO.years.length?CATALOGO.years:[INTRO.desde];
 let tm=[],raf=0,t0=0,tp=0,ac=null,mg=null,rv=null,ruido=null,silen=false,fin=false,corre=false,dpr=1,W=0,H=0,cards=[],dim=0,cierreConError=false,focoAnterior=null;
 const ys=[];for(let i=0;i<NY;i++){const d=document.createElement("span");d.className="ix-y";d.textContent=CATALOGO.years[i]??INTRO.desde;$("ixYs").appendChild(d);ys.push(d)}
 $("ixLogo").src=$("ixLg2").src="assets/images/logo-principal.png";
 function rnd(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
 const R=rnd(11);
 // Tarjetas con los delitos del catálogo + tarjetas vacías de fondo.
 const orden=Array.from({length:DELITOS.length},(_,i)=>i).sort(()=>R()-.5);
 for(let i=0;i<Math.max(104,DELITOS.length);i++){const nm=i<DELITOS.length,c=document.createElement("div");c.className="ix-c "+(nm?"":"gh ")+"v"+(i%4);
  c.innerHTML=nm?'<small>'+String(i+1).padStart(2,"0")+'</small><b>'+DELITOS[orden[i]].nombre+'</b><s></s><s></s><s></s>':'<s></s><s></s><s></s>';st.appendChild(c);
  cards.push({el:c,nm:nm,born:-1,x:0,y:0,z0:-1300,zt:0,r:R()*60-30,vr:R()*16-8,ry:R()*50-25,rx:R()*30-15,lvl:0,vz:R()*40-20})}
 function resize(){dpr=Math.min(window.devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+"px";cv.style.height=H+"px";
  const rx=W<700?40:39,ry=W<700?27:35;ys.forEach((y,i)=>{const a=-Math.PI/2+i/NY*2*Math.PI;y.style.left=(50+Math.cos(a)*rx)+"%";y.style.top=(50+Math.sin(a)*ry)+"%"})}
 addEventListener("resize",resize);
 function nacer(i,t){const c=cards[i];c.born=t;c.x=(R()*2-1)*W*.46;c.y=(R()*2-1)*H*.4;c.zt=-200+R()*470;c.z0=-1400}
 function ola(k){const c=[1,3,4,8,18][k];let n=0;for(let i=0;i<DELITOS.length&&n<c;i++)if(cards[i].born<0){nacer(i,(performance.now()-t0)/1000);n++}
  $("ixCcN").textContent=[1,4,8,16,DELITOS.length][k];$("ixCcL").textContent=k?"delitos":"delito";
  const w=$("ixWd"),pal=["Hurto.","Homicidio.","Estafa.","Extorsión.","Secuestro."];w.textContent=pal[k];w.style.left=(8+R()*38)+"vw";w.style.top=(18+R()*36)+"%";w.classList.remove("on");void w.offsetWidth;w.classList.add("on");
  if(k===3)for(let i=DELITOS.length;i<104;i++)cards[i].nac=T.b[3]+(i-DELITOS.length)/(104-DELITOS.length)*(T.txt-T.b[3]+1.2)}
 function dibujar(f,tt){cx.setTransform(dpr,0,0,dpr,0,0);cx.clearRect(0,0,W,H);
  const s=Math.min(H*.82/MAPA.h,W*.92/MAPA.w),ox=(W-MAPA.w*s)/2,oy=(H-MAPA.h*s)/2,Rg=MAPA.ring;
  cx.beginPath();for(let i=0;i<Rg.length;i+=2){const x=ox+Rg[i]*s,y=oy+Rg[i+1]*s;i?cx.lineTo(x,y):cx.moveTo(x,y)}cx.closePath();
  cx.fillStyle="rgba(230,191,139,.04)";cx.fill();cx.strokeStyle="rgba(230,191,139,.3)";cx.lineWidth=1.2;cx.stroke();
  const n=Math.floor(f*MAPA.dots.length/2);
  for(let i=0;i<n;i++){const rec=n-i<30;cx.globalAlpha=rec?1:.6;cx.fillStyle=rec?"#F0E2CF":"#E6BF8B";cx.beginPath();cx.arc(ox+MAPA.dots[2*i]*s,oy+MAPA.dots[2*i+1]*s,rec?3:2.1,0,6.283);cx.fill()}
  cx.globalAlpha=1;cx.fillStyle="rgba(240,226,207,.14)";
  for(let i=0;i<44;i++){const px=(i*97%100)/100*W,py=(((i*53%100)/100*H-tt*(6+i%4*3))%H+H)%H;cx.fillRect(px,py,1.6,1.6)}}
 function tarjetas(t,dt){
  const col=Math.max(0,Math.min((t-T.col)/(T.pt-T.col),1)),e=col*col*(3-2*col);
  if(t>=T.txt&&dim<.85)dim=Math.min(.85,dim+dt*.9);
  cards.forEach((c,i)=>{if(c.nac!==undefined&&c.born<0&&t>=c.nac)nacer(i,t);if(c.born<0)return;
   const age=t-c.born,k=Math.min(age/1.7,1),ez=1-Math.pow(1-k,3);let z=c.z0+(c.zt-c.z0)*ez+c.vz*Math.max(0,age-1.7);
   c.r+=c.vr*dt;let x=c.x,y=c.y;
   if(col>0){const a=e*2.6,cs=Math.cos(a),sn=Math.sin(a),px=x*(1-e),py=y*(1-e);x=px*cs-py*sn;y=px*sn+py*cs;z-=e*900}
   let op=Math.min(1,age/.5)*(c.nm?1:.55)*(1-dim*(c.nm?.88:.7))*(col>0?(1-e):1);if(col>=1)op=0;
   c.el.style.opacity=op.toFixed(3);
   c.el.style.transform="translate3d("+x.toFixed(1)+"px,"+y.toFixed(1)+"px,"+z.toFixed(1)+"px) rotateX("+c.rx.toFixed(1)+"deg) rotateY("+(c.ry+age*6).toFixed(1)+"deg) rotateZ("+c.r.toFixed(1)+"deg)";
   const l=z>220?2:z>40?1:0;if(l!==c.lvl){c.lvl=l;c.el.classList.toggle("b1",l===1);c.el.classList.toggle("b2",l===2)}});
  const pt=$("ixPt");if(col>0&&t<T.pt+.05){pt.style.opacity=Math.min(1,Math.max(0,(e-.55)/.45));pt.style.transform="scale("+(1+e*1.6)+")"}}
 let ult=0;
 function loop(now){if(!corre)return;const t=(now-t0)/1000,dt=Math.min(.05,(now-ult)/1000||.016);ult=now;let f=0,p=0;
  if(t>=T.ini){p=Math.min((t-T.ini)/T.cuenta,1);f=Math.pow(p,EXP)}
  if(t>=T.imp){f=1;p=1;if(!fin)impacto()}
  if(t<T.cards){num.textContent=fmt(f*total);$("ixLi").style.width=(f*100)+"%"}
  if(!fin){const yy=aniosIntro[Math.min(aniosIntro.length-1,Math.floor(f*aniosIntro.length))];$("ixLab").textContent=t>=T.ini?yy:INTRO.desde;
   ys.forEach((y,i)=>{y.classList.toggle("on",f>=i/NY);y.classList.toggle("cur",aniosIntro[i]===yy&&f>0)});
   const sh=Math.pow(p,3)*5;cam.style.transform="translate("+((Math.random()-.5)*sh)+"px,"+((Math.random()-.5)*sh)+"px) scale("+(1+.2*p)+")"}
  if(t<T.cards||t<T.cards+1.5)dibujar(f,t);
  if(t>=T.cards)tarjetas(t,dt);
  raf=requestAnimationFrame(loop)}
 function impacto(){fin=true;el.classList.add("fin");$("ixLab").textContent="REGISTROS ACUMULADOS";ys.forEach(y=>y.classList.remove("cur"));
  $("ixFl").classList.remove("go");void $("ixFl").offsetWidth;$("ixFl").classList.add("go");
  cam.style.transition="transform 1.3s cubic-bezier(.2,.8,.2,1)";cam.style.transform="scale(1)"}
 function en(seg,fn){tm.push(setTimeout(fn,seg*1000))}
 // ---- sonido sintetizado (drone agudo + bajo + pulsos, al estilo del video) ----
 function initAudio(){try{ac=new(window.AudioContext||window.webkitAudioContext)()}catch(e){ac=null;return}
  mg=ac.createGain();mg.gain.value=silen?0:.9;const c=ac.createDynamicsCompressor();mg.connect(c);c.connect(ac.destination);
  const L=Math.floor(ac.sampleRate*2.8),ir=ac.createBuffer(2,L,ac.sampleRate);for(let k=0;k<2;k++){const d=ir.getChannelData(k);for(let i=0;i<L;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/L,2.4)}
  rv=ac.createConvolver();rv.buffer=ir;const rg=ac.createGain();rg.gain.value=.55;rv.connect(rg);rg.connect(mg);
  const N=ac.sampleRate*2,nb=ac.createBuffer(1,N,ac.sampleRate),d=nb.getChannelData(0);for(let i=0;i<N;i++)d[i]=Math.random()*2-1;ruido=nb}
 function tono(tipo,f,t,d,v,dest,f2){const o=ac.createOscillator(),g=ac.createGain();o.type=tipo;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(dest||mg);o.start(t);o.stop(t+d+.05)}
 function nz(t,d){const s=ac.createBufferSource();s.buffer=ruido;s.loop=true;s.start(t);s.stop(t+d);return s}
 function barrido(t,d,f1,f2,v){const s=nz(t,d),bp=ac.createBiquadFilter(),g=ac.createGain();bp.type="bandpass";bp.Q.value=1.1;bp.frequency.setValueAtTime(f1,t);bp.frequency.exponentialRampToValueAtTime(f2,t+d);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+d*.5);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(bp);bp.connect(g);g.connect(mg);g.connect(rv)}
 function boom(t,v){tono("sine",140,t,1.6,v,mg,34);const s=nz(t,1.6),lq=ac.createBiquadFilter(),g=ac.createGain();lq.type="lowpass";lq.frequency.setValueAtTime(3200,t);lq.frequency.exponentialRampToValueAtTime(160,t+1.5);
  g.gain.setValueAtTime(v*.55,t);g.gain.exponentialRampToValueAtTime(.0001,t+1.5);s.connect(lq);lq.connect(g);g.connect(mg);g.connect(rv)}
 function sonar(){const b=ac.currentTime+.12,fin2=b+T.fin+5;
  // drone agudo constante (≈554 Hz) con leve coro
  [554.37,556.4,277.2].forEach((f,i)=>{const o=ac.createOscillator(),g=ac.createGain(),lp=ac.createBiquadFilter();o.type=i===2?"sine":"triangle";o.frequency.value=f;lp.type="lowpass";lp.frequency.value=1800;
   g.gain.setValueAtTime(.0001,b);g.gain.linearRampToValueAtTime(i===2?.04:.045,b+2.5);g.gain.setValueAtTime(i===2?.04:.045,b+T.pt-.05);g.gain.linearRampToValueAtTime(.0001,b+T.pt);g.gain.linearRampToValueAtTime(i===2?.05:.05,b+T.pt+1.2);g.gain.setTargetAtTime(.0001,b+T.fin+1.5,1);
   o.connect(lp);lp.connect(g);g.connect(mg);g.connect(rv);o.start(b);o.stop(fin2)});
  // bajo que crece
  const lb=ac.createBiquadFilter(),bg=ac.createGain();lb.type="lowpass";lb.frequency.setValueAtTime(160,b);lb.frequency.exponentialRampToValueAtTime(420,b+T.imp);
  bg.gain.setValueAtTime(.0001,b);bg.gain.exponentialRampToValueAtTime(.2,b+T.imp-.3);bg.gain.setValueAtTime(.2,b+T.imp);bg.gain.setTargetAtTime(.11,b+T.imp+.5,1.2);bg.gain.setValueAtTime(.11,b+T.col);bg.gain.linearRampToValueAtTime(.0001,b+T.pt);bg.gain.linearRampToValueAtTime(.14,b+T.pt+.3);bg.gain.setTargetAtTime(.0001,b+T.fin+1.5,1);
  [69.3,103.8].forEach(f=>{const o=ac.createOscillator();o.type="sawtooth";o.frequency.value=f;o.connect(lb);o.start(b);o.stop(fin2)});lb.connect(bg);bg.connect(mg);
  // subida y tics acelerados con glissando
  const rs=nz(b+T.ini,T.imp-T.ini),hp=ac.createBiquadFilter(),rg=ac.createGain();hp.type="highpass";hp.frequency.setValueAtTime(300,b+T.ini);hp.frequency.exponentialRampToValueAtTime(7000,b+T.imp);
  rg.gain.setValueAtTime(.0001,b+T.ini);rg.gain.exponentialRampToValueAtTime(.18,b+T.imp-.05);rg.gain.setValueAtTime(.0001,b+T.imp);rs.connect(hp);hp.connect(rg);rg.connect(mg);
  for(let k=1;k<=NT;k++){const p=Math.pow(k/NT,1/EXP),f=700+1500*k/NT;tono("triangle",f,b+T.ini+T.cuenta*p,.06,.11,mg,f*1.5)}
  // impacto en el total
  const ti=b+T.imp;boom(ti,.95);
  [277.2,329.63,415.3,554.37].forEach(f=>{const o=ac.createOscillator(),g=ac.createGain();o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(.0001,ti+.1);g.gain.linearRampToValueAtTime(.045,ti+1.4);g.gain.setTargetAtTime(.0001,b+T.cards,.6);o.connect(g);g.connect(mg);g.connect(rv);o.start(ti+.1);o.stop(b+T.cards+4)});
  // pulso de arpegio a 117 bpm cuando salen los delitos
  const e8=60/117/2,nts=[554.37,659.26,830.61,659.26];
  for(let t=b+T.cards,i=0;t<b+T.col;t+=e8,i++){tono("triangle",nts[i%4]*(i%16>11?1.5:1),t,.22,.05,rv);if(i%2===0)tono("sine",nts[i%4]*(i%16>11?1.5:1),t,.2,.04,mg)}
  T.b.forEach((tb,k)=>{barrido(b+tb,.5,500,4200,.16+k*.03);tono("sine",90,b+tb,.5,.3+k*.06,mg,48)});
  barrido(b+T.txt-.2,1.8,300,1800,.1);
  // colapso hacia el punto de luz y entrada del logo
  const cs=nz(b+T.col,T.pt-T.col),ch=ac.createBiquadFilter(),cg=ac.createGain();ch.type="highpass";ch.frequency.setValueAtTime(400,b+T.col);ch.frequency.exponentialRampToValueAtTime(8000,b+T.pt);
  cg.gain.setValueAtTime(.0001,b+T.col);cg.gain.exponentialRampToValueAtTime(.2,b+T.pt-.05);cg.gain.setValueAtTime(.0001,b+T.pt);cs.connect(ch);ch.connect(cg);cg.connect(mg);
  tono("sine",220,b+T.col,T.pt-T.col,.1,mg,2400);
  const tl=b+T.pt;boom(tl,1);
  [554.37,659.26,830.61,987.77].forEach((f,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(.0001,tl);g.gain.linearRampToValueAtTime(.05,tl+1.6+i*.2);g.gain.setTargetAtTime(.0001,b+T.fin+1,1);o.connect(g);g.connect(mg);g.connect(rv);o.start(tl);o.stop(fin2)});
  [1109,1319,1661,1319,1109].forEach((f,i)=>tono("sine",f,tl+1.4+i*.35,.9,.04,rv))}
 function apagarAudio(){if(!ac)return;try{mg.gain.setTargetAtTime(0,ac.currentTime,.12)}catch(e){}const a=ac;ac=null;setTimeout(()=>{try{a.close()}catch(e){}},700)}
 // ---- control ----
 function parar(){corre=false;cancelAnimationFrame(raf);tm.forEach(clearTimeout);tm=[];$("ixVideo").pause()}
 function reset(){el.classList.remove("fin","out","tl","video-playing");["ixCc","ixEnd"].forEach(i=>$(i).classList.remove("on"));$("ixH").classList.remove("on","off");$("ixFin").classList.remove("on","sub");$("ixPt").classList.remove("bloom");$("ixPt").style.opacity=0;$("ixWd").classList.remove("on");
  $("ixVideo").currentTime=0;cierreConError=false;
  cnt.classList.remove("baja");$("ixLn").classList.remove("off");cam.style.transition="";cam.style.transform="";num.textContent="0";$("ixLab").textContent=INTRO.desde;ys.forEach(y=>y.classList.remove("on","cur"));$("ixLi").style.width="0";
  dim=0;cards.forEach(c=>{c.born=-1;c.lvl=0;c.el.style.opacity=0;c.el.classList.remove("b1","b2");if(!c.nm)c.nac=undefined})}
 function mostrarErrorCierre(error){if(cierreConError)return;cierreConError=true;console.error("No se pudo reproducir el video de cierre de Indecol.",error);el.classList.remove("video-playing");$("ixFin").classList.add("on");$("ixEnd").classList.add("on")}
 $("ixVideo").addEventListener("ended",()=>$("ixEnd").classList.add("on"));
 $("ixVideo").addEventListener("error",()=>mostrarErrorCierre($("ixVideo").error));
 // en pantallas verticales el video horizontal deja el texto diminuto: se usa el cierre hecho en la página
 function reproducirCierre(){if(matchMedia("(max-aspect-ratio:3/4)").matches){$("ixFin").classList.add("on");en(T.fin-T.logo,()=>$("ixEnd").classList.add("on"));return}
  const video=$("ixVideo");video.currentTime=0;video.play().then(()=>{if(!el.classList.contains("out")&&!el.hidden)el.classList.add("video-playing")}).catch(error=>{if(!el.hidden&&!el.classList.contains("out"))mostrarErrorCierre(error)})}
 function start(){parar();apagarAudio();
  if(el.hidden&&document.activeElement&&!el.contains(document.activeElement))focoAnterior=document.activeElement;
  silen=false;reset();resize();
  el.hidden=false;$("ixGate").hidden=true;document.documentElement.classList.add("nos");fin=false;
  initAudio();
  $("ixMute").hidden=!ac;$("ixMute").textContent="Sonido activado";
  t0=performance.now()+120;ult=t0;corre=true;if(ac)sonar();
  en(T.cards,()=>{cnt.classList.add("baja");el.classList.add("tl");$("ixLn").classList.add("off");$("ixCc").classList.add("on")});
  T.b.forEach((tb,k)=>en(tb,()=>ola(k)));
  en(T.txt,()=>$("ixH").classList.add("on"));
  en(T.col-.4,()=>{$("ixH").classList.remove("on");$("ixH").classList.add("off");$("ixCc").classList.remove("on")});
  en(T.pt,()=>{$("ixPt").classList.add("bloom");$("ixFl").classList.remove("go");void $("ixFl").offsetWidth;$("ixFl").classList.add("go")});
  en(T.logo,reproducirCierre);en(T.sub,()=>{if(!el.classList.contains("video-playing"))$("ixFin").classList.add("sub")});
  raf=requestAnimationFrame(loop);$("ixSkip").focus()}
 function cerrar(){parar();apagarAudio();el.classList.add("out");document.documentElement.classList.remove("nos");
  const activa=document.querySelector(".pg.active");mostrarAlBajar(activa,true);animarAnalisis(activa,true);
  const ocultar=()=>{if(el.classList.contains("out")){el.hidden=true;$("ixGate").hidden=false;if(focoAnterior?.isConnected)focoAnterior.focus();focoAnterior=null}};
  if(reduce)ocultar();else setTimeout(ocultar,850);
  try{sessionStorage.setItem("indecol_intro","1")}catch(e){}}
 $("ixCon").addEventListener("click",start);$("ixSkip").addEventListener("click",cerrar);$("ixGo").addEventListener("click",cerrar);$("ixRe").addEventListener("click",start);$("rpIntro").addEventListener("click",start);
 $("ixMute").addEventListener("click",()=>{silen=!silen;if(mg&&ac)mg.gain.setTargetAtTime(silen?0:.9,ac.currentTime,.05);$("ixMute").textContent=silen?"Sonido apagado":"Sonido activado"});
 document.addEventListener("keydown",e=>{
  if(el.hidden)return;
  if(e.key==="Escape"){cerrar();return}
  if(e.key!=="Tab")return;
  const focusables=[...el.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])')]
   .filter(item=>!item.closest("[hidden]")&&getComputedStyle(item).visibility!=="hidden");
  const first=focusables[0],last=focusables.at(-1);
  if(!first)return;
  if(e.shiftKey&&(document.activeElement===first||!el.contains(document.activeElement))){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&(document.activeElement===last||!el.contains(document.activeElement))){e.preventDefault();first.focus()}
 });
 const h=location.hash.slice(1);let visto=null;try{visto=sessionStorage.getItem("indecol_intro")}catch(e){}
 if((!h||h==="inicio")&&!visto){focoAnterior=$("rpIntro");el.hidden=false;document.documentElement.classList.add("nos");resize();$("ixCon").focus()}
})();
