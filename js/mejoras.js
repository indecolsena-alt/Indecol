// ===== perfil de cada delito, tasas por habitantes, mismo periodo del año y comparación de municipios =====
// Se carga antes que app.js: solo define funciones, que usan lo que app.js declara cuando se las llama.
const POBLACION=window.INDECOL_POBLACION;
const COMPARATIVOS=window.INDECOL_COMPARATIVOS;

// ----- tasas por cada 100.000 habitantes -----
// solo años completos: un año incompleto haría ver menor la tasa anual
const aniosParaTasa=range=>CATALOGO.years.filter(year=>year>=range.startYear&&year<=range.endYear&&periodosCompletos.has(year));
function tasaAnual(casosDelAnio,poblacion,range){
 let total=0,habitantes=0;
 aniosParaTasa(range).forEach(year=>{
  const personas=poblacion?.[POBLACION.years.indexOf(year)];
  if(personas){total+=casosDelAnio(year);habitantes+=personas}
 });
 return habitantes?total/habitantes*1e5:null;
}
const redondearTasa=valor=>valor===null?null:Number(valor.toFixed(valor<10?2:1));
const fmtTasa=valor=>valor===null?"—":fmtData(redondearTasa(valor));
function textoAniosTasa(range){
 const years=aniosParaTasa(range);
 if(!years.length)return "";
 return years.length===1?`año ${years[0]}`:`promedio anual ${years[0]}–${years.at(-1)}`;
}
const SIN_ANIO_COMPLETO="La tasa necesita al menos un año completo: incluye en el periodo un año distinto del parcial.";
function sumarPoblacion(claves){
 return POBLACION.years.map((_,i)=>claves.reduce((sum,key)=>sum+(POBLACION.departments[key]?.[i]||0),0));
}
function casosPorDepartamento(crimes){
 const result=new Map();
 crimes.forEach(crime=>(crime.municipalityData||[]).forEach(item=>{
  const key=departmentKey(item.department);
  if(!POBLACION.departments[key])return;
  if(!result.has(key))result.set(key,new Map());
  acumularAnios(result.get(key),item.years);
 }));
 return result;
}
let casosDeptoTodos=null;
const casosDepartamentales=()=>casosDeptoTodos||(casosDeptoTodos=casosPorDepartamento(DELITOS_DATA));
// departamentos ordenados por tasa, con sus casos del mismo rango de años completos
function rankingTasas(porDepartamento,range){
 const years=aniosParaTasa(range);
 return mapaDepartamentos.departments.map(item=>{
  const anios=porDepartamento.get(item.key);
  const tasa=tasaAnual(year=>anios?.get(year)||0,POBLACION.departments[item.key],range);
  return {key:item.key,label:item.name,tasa,cases:years.reduce((sum,year)=>sum+(anios?.get(year)||0),0)};
 }).filter(item=>item.tasa!==null).sort((a,b)=>b.tasa-a.tasa);
}
function tasaDelPais(porDepartamento,range){
 return tasaAnual(year=>[...porDepartamento.values()].reduce((sum,anios)=>sum+(anios.get(year)||0),0),
  sumarPoblacion(Object.keys(POBLACION.departments)),range);
}
function graficaTasas(ranking){
 const conCasos=ranking.filter(item=>item.cases>0);
 const grafico=graficaDatos(conCasos,item=>redondearTasa(item.tasa),item=>item.label,true);
 if(conCasos.length<=10)return grafico;
 const texto=`Ver los ${conCasos.length} departamentos`;
 return `<div class="lista-corta">${grafico}<button type="button" class="ver-lista" aria-expanded="false" data-texto="${texto}">${texto}</button></div>`;
}
function lecturaTasas(ranking,pais,seleccionado=""){
 const conCasos=ranking.filter(item=>item.cases>0);
 if(!conCasos.length)return "No hay casos para calcular tasas en esta selección.";
 const [primero,...resto]=conCasos,ultimo=conCasos.at(-1);
 const porCasos=[...conCasos].sort((a,b)=>b.cases-a.cases)[0];
 const frases=[`${primero.label} tiene la tasa más alta: ${fmtTasa(primero.tasa)} casos al año por cada 100.000 habitantes${resto.length?`, seguido de ${listaHumana(resto.slice(0,2).map(item=>`${item.label} (${fmtTasa(item.tasa)})`))}`:""}.`,
  `La tasa del país es ${fmtTasa(pais)}.`];
 if(conCasos.length>1)frases.push(`La más baja entre los departamentos con casos es la de ${ultimo.label} (${fmtTasa(ultimo.tasa)}).`);
 if(porCasos.key!==primero.key)frases.push(`En cantidad de casos el primero es ${porCasos.label}, que por tasa ocupa el puesto ${conCasos.indexOf(porCasos)+1}.`);
 if(ranking.length>conCasos.length)frases.push(`${ranking.length-conCasos.length} departamentos no registran casos y no aparecen.`);
 const elegido=conCasos.find(item=>item.key===seleccionado);
 if(elegido)frases.unshift(`${elegido.label} tiene una tasa de ${fmtTasa(elegido.tasa)} y ocupa el puesto ${conCasos.indexOf(elegido)+1} de ${conCasos.length}.`);
 return frases.join(" ");
}

// ----- mismo periodo de cada año -----
const periodoComparable=()=>`enero–${MESES_COMPLETOS[COMPARATIVOS.months-1]}`;
const casosEnMeses=(crime,year)=>(crime.years.find(item=>item.year===year)?.months||[])
 .reduce((sum,item)=>item.month<=COMPARATIVOS.months?sum+casos(item):sum,0);
const variacion=(antes,ahora)=>antes?(ahora/antes-1)*100:null;
const textoVariacion=valor=>valor===null?"—":`${valor>=0?"+":"−"}${fmtDecimal(Math.abs(valor))}%`;
function casosComparables(crime,departamento,year){
 if(!departamento)return casosEnMeses(crime,year);
 return COMPARATIVOS.departments[departamento]?.[crime.id]?.[COMPARATIVOS.years.indexOf(year)]||0;
}
function lecturaComparable(puntos,area){
 const actual=puntos.at(-1),anterior=puntos.at(-2);
 if(!anterior||!puntos.some(item=>item.value))return "No hay casos suficientes para comparar este periodo.";
 const cambio=variacion(anterior.value,actual.value);
 const orden=[...puntos].sort((a,b)=>b.value-a.value);
 return `De ${periodoComparable().replace("–"," a ")} de ${actual.label}, ${area} suma ${fmtData(actual.value)} casos${cambio===null?` (en ${anterior.label} no hubo casos)`:`, ${fmtDecimal(Math.abs(cambio))}% ${cambio>=0?"más":"menos"} que en los mismos meses de ${anterior.label} (${fmtData(anterior.value)})`}. En esos meses, el año con más casos fue ${orden[0].label} (${fmtData(orden[0].value)}) y el de menos, ${orden.at(-1).label} (${fmtData(orden.at(-1).value)}).`;
}
function seccionMismoPeriodoDelito(crime){
 const puntos=COMPARATIVOS.years.map(year=>({label:String(year),value:casosEnMeses(crime,year)}));
 return `<section class="data-panel data-animate">
  <h3>El mismo periodo de cada año</h3>
  <p>Cada barra suma solo los casos de ${periodoComparable()}. Así el año en curso se compara en igualdad de condiciones; su último mes disponible está incompleto y no se incluye.</p>
  ${graficaDatos(puntos,item=>item.value,item=>item.label)}
  ${parrafoLectura(lecturaComparable(puntos,"el país"))}
 </section>`;
}

// ----- panel de análisis: mismo periodo y tasas por departamento -----
function renderAnalisisMejoras(){
 const area=nombreAreaAnalisis(),range=rangoAnalisisActual();
 const years=COMPARATIVOS.years,actual=years.at(-1),anterior=years.at(-2);
 const filas=DELITOS_DATA.map(crime=>({name:crime.name,values:years.map(year=>casosComparables(crime,departmentPinnedKey,year))}));
 const puntos=years.map((year,i)=>({label:String(year),value:filas.reduce((sum,fila)=>sum+fila.values[i],0)}));
 const top=filas.map(fila=>({name:fila.name,antes:fila.values.at(-2),ahora:fila.values.at(-1)}))
  .filter(fila=>fila.ahora||fila.antes).sort((a,b)=>b.ahora-a.ahora||b.antes-a.antes).slice(0,10);
 const periodo=document.getElementById("analysisPeriod");
 periodo.innerHTML=`<p>Compara ${periodoComparable()} de cada año en ${htmlSeguro(area)}. No cambia con los filtros «Desde» y «Hasta»; sí con el departamento elegido.</p>
  ${graficaDatos(puntos,item=>item.value,item=>item.label)}
  ${parrafoLectura(lecturaComparable(puntos,area==="Colombia"?"el país":area))}
  <div class="tabla-scroll"><table class="tabla-datos"><caption>Diez delitos con más casos en ${periodoComparable()} de ${actual}</caption>
   <thead><tr><th scope="col">Delito</th><th scope="col">${anterior}</th><th scope="col">${actual}</th><th scope="col">Cambio</th></tr></thead>
   <tbody>${top.map(fila=>`<tr><th scope="row">${htmlSeguro(fila.name)}</th><td>${fmtData(fila.antes)}</td><td>${fmtData(fila.ahora)}</td><td>${textoVariacion(variacion(fila.antes,fila.ahora))}</td></tr>`).join("")}</tbody>
  </table></div>`;
 const tasas=document.getElementById("analysisRates");
 if(!aniosParaTasa(range).length)tasas.innerHTML=`<p class="data-empty">${SIN_ANIO_COMPLETO}</p>`;
 else{
  const porDepartamento=casosDepartamentales(),ranking=rankingTasas(porDepartamento,range);
  tasas.innerHTML=`<p>Casos al año por cada 100.000 habitantes (${textoAniosTasa(range)}), con las proyecciones de población del DANE. Así se comparan departamentos de distinto tamaño. Incluye todos los casos, también los resultados operativos de la Policía.</p>
   ${graficaTasas(ranking)}
   ${parrafoLectura(lecturaTasas(ranking,tasaDelPais(porDepartamento,range),departmentPinnedKey))}`;
 }
 [periodo,tasas].forEach(destino=>{
  animarAnalisis(destino.closest(".data-animate"),true);
  seguirAlBajar(destino);
 });
}

function seccionTasasDelito(crime){
 const range={startYear:CATALOGO.years[0],endYear:CATALOGO.years.at(-1)};
 const porDepartamento=casosPorDepartamento([crime]),ranking=rankingTasas(porDepartamento,range);
 return `<section class="data-panel data-animate">
  <h3>Departamentos según su población</h3>
  <p>Casos al año por cada 100.000 habitantes (${textoAniosTasa(range)}), con las proyecciones del DANE. En delitos poco frecuentes, unos pocos casos cambian mucho la tasa.</p>
  ${graficaTasas(ranking)}
  ${parrafoLectura(lecturaTasas(ranking,tasaDelPais(porDepartamento,range)))}
 </section>`;
}

// ----- perfil: cómo, dónde y a quién -----
const COBERTURA_MINIMA=.6;
const ORDEN_PERFIL=["zona","genero","edad","dia","sitio","arma","bien","vehiculo","modalidad"];
const perfilesPedidos=new Map();
// cada delito tiene su archivo: se descarga solo cuando se abre su ficha
function cargarPerfil(id){
 if(window.INDECOL_PERFILES?.[id])return Promise.resolve(window.INDECOL_PERFILES[id]);
 if(!perfilesPedidos.has(id))perfilesPedidos.set(id,new Promise((resolve,reject)=>{
  const script=document.createElement("script");
  const fallar=()=>{perfilesPedidos.delete(id);script.remove();reject(new Error(id))};
  script.src=`assets/data/perfiles/${id}.js`;
  script.onload=()=>window.INDECOL_PERFILES?.[id]?resolve(window.INDECOL_PERFILES[id]):fallar();
  script.onerror=fallar;
  document.head.append(script);
 }));
 return perfilesPedidos.get(id);
}
function tituloPerfil(dimension,crime){
 const capturas=crime.id.endsWith("-capturas");
 const titulos={
  zona:"Zona urbana o rural",dia:"Día de la semana",sitio:"Tipo de sitio",arma:"Arma o medio",
  genero:capturas?"Género de las personas capturadas":"Género registrado",
  edad:capturas?"Edad de las personas capturadas":"Grupo de edad registrado",
  bien:crime.id.endsWith("incautacion-armas-de-fuego")?"Tipo de arma incautada":crime.id.includes("recuperad")?"Tipo de vehículo recuperado":"Tipo de vehículo hurtado",
  vehiculo:crime.id.includes("recuperad")?"Tipo de vehículo recuperado":"Tipo de vehículo",
  modalidad:"Modalidad según el Código Penal"
 };
 return titulos[dimension];
}
function lecturaPerfil(items,conDato,total){
 const orden=items.filter(item=>item.label!=="Otros").sort((a,b)=>b.value-a.value);
 const [primero,...resto]=orden;
 if(!primero)return "";
 const frases=[`Entre los casos que traen este dato, ${primero.label} reúne ${porcentaje(primero.value,conDato)} (${fmtData(primero.value)} casos).`];
 if(resto.length)frases.push(`Le ${resto.length>1?"siguen":"sigue"} ${listaHumana(resto.slice(0,2).map(item=>`${item.label} (${porcentaje(item.value,conDato)})`))}.`);
 const sin=total-conDato;
 frases.push(sin>0?`${fmtData(sin)} casos (${porcentaje(sin,total)}) no traen el dato y no entran en los porcentajes.`:"Todos los casos del periodo traen este dato.");
 return frases.join(" ");
}
function tarjetasPerfil(crime,perfil,anio){
 const indices=perfil.years.map((year,i)=>i).filter(i=>!anio||perfil.years[i]===anio);
 const sumar=valores=>indices.reduce((sum,i)=>sum+valores[i],0);
 const total=sumar(perfil.cases);
 const periodoElegido=anio?String(anio):`${perfil.years[0]}–${perfil.years.at(-1)}`;
 if(!total)return '<p class="data-empty">No hay casos en el periodo elegido.</p>';
 return ORDEN_PERFIL.filter(name=>perfil.dims[name]).map(name=>{
  const datos=perfil.dims[name];
  let items=datos.labels.map((label,i)=>({label,value:sumar(datos.values[i])}));
  if(name!=="dia")items=items.filter(item=>item.value>0).sort((a,b)=>(a.label==="Otros")-(b.label==="Otros")||b.value-a.value);
  const conDato=items.reduce((sum,item)=>sum+item.value,0);
  const titulo=tituloPerfil(name,crime);
  const ancha=["sitio","arma","bien","vehiculo","modalidad","dia"].includes(name);
  let cuerpo;
  if(conDato/total<COBERTURA_MINIMA)cuerpo=`<p class="data-empty">En ${periodoElegido} solo ${porcentaje(conDato,total)} de los casos traen este dato: no alcanza para mostrar una distribución confiable.</p>`;
  else{
   const grafica=["zona","genero","edad"].includes(name)?graficaAnillo(items,item=>item.value,item=>item.label,`${titulo} · ${periodoElegido}`)
    :name==="dia"?graficaDatos(items,item=>item.value,item=>item.label)
    :graficaDatos(items,item=>item.value,item=>`${item.label} · ${porcentaje(item.value,conDato)}`,true);
   cuerpo=grafica+parrafoLectura(lecturaPerfil(items,conDato,total));
  }
  return `<section class="perfil-caja data-animate${ancha?" ancha":""}"><h4>${titulo}</h4>${cuerpo}</section>`;
 }).join("");
}
function seccionPerfil(crime){
 return `<section class="data-panel perfil" id="perfilDelito">
  <div class="data-panel-heading"><div><h3>¿Cómo, dónde y a quién?</h3><p>Detalles anotados en los casos de este delito. Solo aparece una característica cuando la mayoría de los casos la tiene. En capturas, el género y la edad son de la persona capturada; en los demás delitos la base no precisa el papel de la persona registrada. La base no incluye la hora.</p></div>
   <label>Periodo <select id="perfilAnio" disabled><option value="">Todos los años</option></select></label>
  </div>
  <div class="perfil-grid" id="perfilCajas"><p class="data-empty">Cargando el detalle de este delito…</p></div>
 </section>`;
}
function activarPerfil(crime){
 const cajas=document.getElementById("perfilCajas"),selector=document.getElementById("perfilAnio");
 if(!cajas)return;
 const dibujar=(perfil,reiniciar)=>{
  cajas.innerHTML=tarjetasPerfil(crime,perfil,Number(selector.value)||0);
  animarAnalisis(cajas,reiniciar);
  if(reiniciar)seguirAlBajar(cajas);else mostrarAlBajar(cajas);
 };
 cargarPerfil(crime.id).then(perfil=>{
  // si ya se abrió otra ficha, esta respuesta se descarta
  if(!cajas.isConnected)return;
  selector.innerHTML+=perfil.years.filter((year,i)=>perfil.cases[i]).map(year=>`<option value="${year}">${etiquetaAnual(year)}</option>`).join("");
  selector.disabled=false;
  selector.addEventListener("change",()=>dibujar(perfil,true));
  dibujar(perfil,false);
 }).catch(()=>{
  if(cajas.isConnected)cajas.innerHTML='<p class="data-empty">No se pudo cargar el detalle. Revisa tu conexión y vuelve a abrir este delito.</p>';
 });
}

// ----- Tu zona: población de la selección -----
let poblacionMunicipios=null;
function poblacionMunicipio(clave){
 if(!poblacionMunicipios){
  poblacionMunicipios=new Map();
  DELITOS_DATA.forEach(crime=>(crime.municipalityData||[]).forEach(item=>{
   const habitantes=POBLACION.municipalities[`${norm(String(item.rawDepartment||"").trim())}|${norm(String(item.rawName||"").trim())}`];
   if(habitantes)poblacionMunicipios.set(`${norm(String(item.department||"").trim())}|${norm(String(item.name||"").trim())}`,habitantes);
  }));
 }
 return poblacionMunicipios.get(clave);
}
function poblacionZona(region,departamento,municipio){
 if(municipio!==TODAS_ZONAS)return poblacionMunicipio(municipio);
 if(departamento!==TODAS_ZONAS)return POBLACION.departments[departamento];
 return sumarPoblacion([...zonaDepartamentos.entries()]
  .filter(([,item])=>region===TODAS_ZONAS||item.region===region).map(([key])=>key));
}
const tasaNacional=range=>tasaAnual(year=>totalAnual.get(year)||0,sumarPoblacion(Object.keys(POBLACION.departments)),range);

// ----- Tu zona: comparar municipios -----
const LETRAS_MUNICIPIO=["A","B","C"];
function iniciarComparaMunicipios(){
 const porDepartamento=new Map();
 [...zonaMunicipios.entries()].sort((a,b)=>a[1].department.localeCompare(b[1].department,"es")||a[1].name.localeCompare(b[1].name,"es"))
  .forEach(([key,item])=>{
   if(!porDepartamento.has(item.department))porDepartamento.set(item.department,[]);
   porDepartamento.get(item.department).push(`<option value="${htmlSeguro(key)}">${htmlSeguro(item.name)}</option>`);
  });
 const opciones=[...porDepartamento].map(([nombre,lista])=>`<optgroup label="${htmlSeguro(nombre)}">${lista.join("")}</optgroup>`).join("");
 const mayores=[...zonaMunicipios.entries()].sort((a,b)=>b[1].records-a[1].records).map(([key])=>key);
 LETRAS_MUNICIPIO.forEach((letra,i)=>{
  const selector=document.getElementById(`muni${letra}`);
  selector.innerHTML=`${i===2?'<option value="">Ninguno</option>':""}${opciones}`;
  selector.value=i===2?"":mayores[i];
  selector.addEventListener("change",renderComparaMunicipios);
 });
 const anio=document.getElementById("muniAnio");
 anio.innerHTML=`<option value="">Todos los años (${CATALOGO.years[0]}–${CATALOGO.years.at(-1)})</option>${CATALOGO.years.map(year=>`<option value="${year}">${etiquetaAnual(year)}</option>`).join("")}`;
 anio.addEventListener("change",renderComparaMunicipios);
}
function renderComparaMunicipios(){
 const primero=document.getElementById("muniA");
 if(!primero)return;
 if(!primero.options.length)iniciarComparaMunicipios();
 const destino=document.getElementById("muniResultado"),anio=Number(document.getElementById("muniAnio").value);
 const range=anio?{startYear:anio,endYear:anio}:{startYear:CATALOGO.years[0],endYear:CATALOGO.years.at(-1)};
 const periodo=anio?etiquetaAnual(anio):`${range.startYear}–${range.endYear}`;
 const claves=[...new Set(LETRAS_MUNICIPIO.map(letra=>document.getElementById(`muni${letra}`).value).filter(Boolean))];
 if(claves.length<2){
  destino.innerHTML='<p class="data-empty">Elige al menos dos municipios distintos para compararlos.</p>';
  return;
 }
 const municipios=claves.map(key=>{
  const item=zonaMunicipios.get(key);
  return {key,nombre:etiquetaLugar(item.name,item.department),
   total:sumarAniosEnRango(item.annualRecords,range),
   tasa:tasaAnual(year=>item.annualRecords.get(year)||0,poblacionMunicipio(key),range),delitos:new Map()};
 });
 const porClave=new Map(municipios.map(item=>[item.key,item]));
 DELITOS_DATA.forEach(crime=>(crime.municipalityData||[]).forEach(item=>{
  const municipio=porClave.get(`${norm(String(item.department||"").trim())}|${norm(String(item.name||"").trim())}`);
  if(!municipio)return;
  const valor=registrosEnRango(item.years,range);
  if(valor)municipio.delitos.set(crime.name,(municipio.delitos.get(crime.name)||0)+valor);
 }));
 const mayor=name=>Math.max(...municipios.map(item=>item.delitos.get(name)||0));
 const delitos=[...new Set(municipios.flatMap(item=>[...item.delitos.keys()]))].sort((a,b)=>mayor(b)-mayor(a)).slice(0,10);
 const porCasos=[...municipios].sort((a,b)=>b.total-a.total);
 const porTasa=municipios.filter(item=>item.tasa!==null).sort((a,b)=>b.tasa-a.tasa);
 const frases=[`${porCasos[0].nombre} es el que más casos suma ${anio?`en ${anio}${periodo===String(anio)?"":" (año parcial)"}`:`entre ${range.startYear} y ${range.endYear}`}: ${fmtData(porCasos[0].total)}.`];
 if(porTasa.length>1)frases.push(`Según su población, la tasa más alta es la de ${porTasa[0].nombre}: ${fmtTasa(porTasa[0].tasa)} casos al año por cada 100.000 habitantes, frente a ${listaHumana(porTasa.slice(1).map(item=>`${fmtTasa(item.tasa)} en ${item.nombre}`))}.`);
 frases.push(`La tasa del país es ${fmtTasa(tasaNacional(range))}.`,`El delito principal es ${listaHumana(municipios.map(item=>`${[...item.delitos].sort((a,b)=>b[1]-a[1])[0]?.[0]||"ninguno"} en ${item.nombre}`))}.`);
 const encabezado=municipios.map(item=>`<th scope="col">${htmlSeguro(item.nombre)}</th>`).join("");
 destino.innerHTML=`<div class="muni-graficas">
   <div><h4>Casos</h4>${graficaDatos(municipios,item=>item.total,item=>item.nombre,true)}</div>
   <div><h4>Casos al año por cada 100.000 habitantes</h4>${porTasa.length?graficaDatos(porTasa,item=>redondearTasa(item.tasa),item=>item.nombre,true):`<p class="data-empty">${anio?`${anio} todavía no está completo, por eso no se calcula su tasa.`:SIN_ANIO_COMPLETO}</p>`}</div>
  </div>
  ${parrafoLectura(porTasa.length?frases.join(" "):[frases[0],frases.at(-1)].join(" "))}
  <div class="tabla-scroll"><table class="tabla-datos"><caption>Diez delitos con más casos · ${periodo}</caption>
   <thead><tr><th scope="col">Delito</th>${encabezado}</tr></thead>
   <tbody>${delitos.map(name=>`<tr><th scope="row">${htmlSeguro(name)}</th>${municipios.map(item=>`<td>${fmtData(item.delitos.get(name)||0)}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div>`;
 animarAnalisis(destino.closest(".data-animate"));
 seguirAlBajar(destino);
}
