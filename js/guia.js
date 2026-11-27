// ===== Guía: dónde denunciar, glosario y metodología =====
// Se carga antes que app.js: solo define datos y funciones que app.js llama.
// Canales revisados en los sitios oficiales en noviembre de 2026.
const CANALES={
 "123":{marca:"123",nombre:"Línea única de emergencias",texto:"Para un peligro inmediato o un hecho que está ocurriendo.",href:"tel:123"},
 "122":{marca:"122",nombre:"Fiscalía General de la Nación",texto:"Denuncias y orientación las 24 horas desde celular. Desde teléfono fijo: 01 8000 919 748.",href:"tel:122"},
 "155":{marca:"155",nombre:"Orientación a mujeres víctimas de violencia",texto:"Orientación sobre cómo denunciar y a qué entidades acudir.",href:"tel:155"},
 "141":{marca:"141",nombre:"ICBF · niñas, niños y adolescentes",texto:"Protección, emergencia y orientación las 24 horas.",href:"tel:141"},
 "165":{marca:"165",nombre:"Gaula · extorsión y secuestro",texto:"Reporta una extorsión o un secuestro y recibe orientación.",href:"tel:165"},
 trata:{marca:"01 8000 52 20 20",nombre:"Línea nacional contra la trata de personas",texto:"Orientación y denuncia gratuita.",href:"tel:018000522020"},
 adenunciar:{marca:"En línea",nombre:"ADenunciar",texto:"Denuncia virtual de la Policía y la Fiscalía para algunos delitos; la plataforma indica cuáles recibe.",href:"https://adenunciar.policia.gov.co/Adenunciar/"},
 facil:{marca:"En línea",nombre:"Denuncia Fácil de la Fiscalía",texto:"Reporte virtual de hechos delictivos a cualquier hora.",href:"https://sicecon.fiscalia.gov.co/denuncia/ingresoPrincipal"},
 cai:{marca:"En línea",nombre:"CAI Virtual de la Policía",texto:"Orientación y reportes sobre delitos por internet.",href:"https://caivirtual.policia.gov.co/"},
 sedes:{marca:"En persona",nombre:"Sedes de la Fiscalía",texto:"Puntos de recepción de denuncias en todo el país. También puedes acudir a una estación de Policía o a un CAI.",href:"https://www.fiscalia.gov.co/servicios-de-informacion-al-ciudadano/donde-y-como-denunciar/"}
};
// explicación sencilla y canales sugeridos de cada delito (la clave es el final de su identificador)
const FICHAS={
 "capturas":["Personas detenidas por la Policía. Es un resultado de su trabajo, no un delito.",null],
 "incautacion-armas-de-fuego":["Armas de fuego que la Policía decomisa. Es un resultado operativo, no un delito cometido contra una víctima.",null],
 "incautacion-de-estupefacientes":["Sustancias ilegales que la Policía decomisa. Se mide por peso, no por número de casos.",null],
 "estafa":["Engañar a alguien para que entregue dinero o bienes y obtener un provecho ilegal.",["122","adenunciar","cai"]],
 "extorsion":["Exigir dinero o algo a otra persona bajo amenaza.",["165","123","122"]],
 "terrorismo":["Actos que buscan sembrar o mantener el miedo en la población poniendo en peligro vidas o bienes.",["123","122"]],
 "amenazas":["Anunciar a una persona, familia o comunidad que se le hará daño para atemorizarla.",["123","122","facil"]],
 "delitos-sexuales":["Actos o accesos de carácter sexual sin consentimiento o contra personas que no pueden darlo, como menores.",["123","155","141","122"]],
 "homicidios":["Muerte de una persona causada por otra. Las muertes en accidentes de tránsito se cuentan aparte.",["123","122"]],
 "injuria-y-calumnia":["Injuria es ofender el honor de alguien; calumnia es acusarlo falsamente de un delito.",["122","facil","sedes"]],
 "lesiones-personales":["Causar daño al cuerpo o a la salud de otra persona.",["123","122"]],
 "violencia-intrafamiliar":["Maltrato físico o psicológico contra alguien del núcleo familiar.",["123","155","141","122"]],
 "delitos-informaticos":["Delitos contra datos y sistemas, como entrar sin permiso a una cuenta o robar dinero por medios digitales.",["cai","adenunciar","122"]],
 "derechos-de-autor":["Usar, copiar o vender obras ajenas sin autorización o desconocer a quien las creó.",["122","facil"]],
 "contra-administracion-publica":["Delitos de corrupción o abuso en la función pública, como apropiarse de dineros públicos o prevaricar.",["122","facil","sedes"]],
 "violencia-a-servidor-publico":["Usar la fuerza contra un servidor público para obligarlo a hacer u omitir algo de su cargo.",["123","122"]],
 "secuestro-extorsivo":["Retener a una persona para exigir algo a cambio de su libertad.",["165","123","122"]],
 "secuestro-simple":["Retener u ocultar a una persona contra su voluntad sin exigir nada a cambio.",["165","123","122"]],
 "trafico-migrantes":["Facilitar de forma ilegal la entrada o salida de personas del país para obtener un beneficio.",["123","122"]],
 "trata-personas":["Captar, trasladar o acoger a una persona con fines de explotación.",["trata","123","122"]],
 "abigeato":["Hurto de ganado.",["123","122","adenunciar"]],
 "hurto-a-automotores":["Apoderarse de un carro u otro vehículo ajeno.",["123","adenunciar","122"]],
 "hurto-a-comercio":["Apoderarse de dinero o bienes de un establecimiento comercial.",["123","adenunciar","122"]],
 "hurto-a-entidades-financieras":["Apoderarse de dinero o bienes de bancos y otras entidades financieras.",["123","122"]],
 "hurto-a-motocicletas":["Apoderarse de una motocicleta ajena.",["123","adenunciar","122"]],
 "hurto-a-personas":["Apoderarse de pertenencias de una persona, con o sin violencia.",["123","adenunciar","122"]],
 "hurto-a-residencias":["Apoderarse de bienes que están en una vivienda.",["123","adenunciar","122"]],
 "pirateria-terrestre":["Hurto de vehículos de carga o de la mercancía que transportan en las vías.",["123","122"]],
 "delitos-contra-el-medio-ambiente":["Daños a la naturaleza prohibidos por la ley, como la minería ilegal o la contaminación.",["123","122","facil"]],
 "maltrato-animal":["Causar la muerte o lesiones graves a un animal.",["123","122"]],
 "automotores-recuperados":["Carros y otros vehículos hurtados que las autoridades recuperan. Es un resultado operativo.",null],
 "homicidios-en-accidentes-de-transito":["Muertes causadas en hechos de tránsito.",["123","122"]],
 "lesiones-en-accidentes-de-transito":["Personas heridas en hechos de tránsito.",["123","122"]],
 "motocicletas-recuperadas":["Motocicletas hurtadas que las autoridades recuperan. Es un resultado operativo.",null]
};
const fichaDelito=crime=>{
 const clave=Object.keys(FICHAS).filter(key=>crime.id.endsWith(`-${key}`)).sort((a,b)=>b.length-a.length)[0];
 return FICHAS[clave]||null;
};
const enlaceCanal=canal=>`href="${canal.href}"${canal.href.startsWith("http")?' target="_blank" rel="noopener noreferrer"':""}`;
const tarjetaCanal=id=>{
 const canal=CANALES[id];
 return `<li><a ${enlaceCanal(canal)}><b>${canal.marca}</b><strong>${canal.nombre}</strong><span>${canal.texto}</span></a></li>`;
};
// recuadro al final de cada ficha de delito
function cajaDenuncia(crime){
 const ficha=fichaDelito(crime);
 if(!ficha)return "";
 const [explicacion,canales]=ficha;
 return `<section class="data-panel denuncia">
  <h3>${canales?"¿Dónde denunciar?":"¿Sabes de un delito?"}</h3>
  <p><b>Qué es:</b> ${explicacion}${canales?"":" Si conoces un hecho que deba investigarse, usa estos canales."}</p>
  <ul class="canales">${(canales||["123","122"]).map(tarjetaCanal).join("")}</ul>
  <p><a href="#guia">Ver todos los canales, el glosario y la metodología →</a></p>
 </section>`;
}
const TERMINOS=[
 ["Caso","Unidad que suma Indecol: el valor de la columna casos de la base."],
 ["Registro","Cada fila de la base. Un registro puede reunir varios casos, por eso hay menos registros que casos."],
 ["Categoría","Grupo de delitos según la temática que reporta la fuente."],
 ["Resultado operativo","Actuación de la Policía que la base cuenta junto a los delitos: capturas, incautaciones y vehículos recuperados."],
 ["Tasa por cada 100.000 habitantes","Casos de un año divididos entre la población y multiplicados por 100.000. Permite comparar lugares de distinto tamaño."],
 ["Año parcial","Año que todavía no tiene sus doce meses completos. No se compara con años enteros."],
 ["Mismo periodo","Los mismos meses de distintos años, para comparar en igualdad de condiciones."],
 ["Sin dato","Casos en los que la característica no se reportó o no se identificó."],
 ["SIEDCO","Sistema de Información Estadístico, Delincuencial, Contravencional y Operativo de la Policía Nacional."],
 ["DANE","Departamento Administrativo Nacional de Estadística. Publica las proyecciones de población usadas en las tasas."]
];
function renderGuia(){
 const denuncia=document.getElementById("gdCanales");
 if(!denuncia)return;
 denuncia.innerHTML=["123","122","155","141","165","trata","adenunciar","facil","cai","sedes"].map(tarjetaCanal).join("");
 const delitos=[...DELITOS_DATA].sort((a,b)=>a.name.localeCompare(b.name,"es"));
 const entradas=[
  ...delitos.map(crime=>({nombre:crime.name,texto:fichaDelito(crime)?.[0]||"",href:`#delitos/${encodeURIComponent(crime.category.id)}/${encodeURIComponent(crime.id)}`,tipo:"Delito"})),
  ...TERMINOS.map(([nombre,texto])=>({nombre,texto,tipo:"Término"}))
 ];
 const lista=document.getElementById("gdGlosario");
 lista.innerHTML=entradas.map(item=>`<div data-q="${htmlSeguro(norm(`${item.nombre} ${item.texto}`))}"><dt>${item.href?`<a href="${item.href}">${htmlSeguro(item.nombre)}</a>`:htmlSeguro(item.nombre)}<small>${item.tipo}</small></dt><dd>${htmlSeguro(item.texto)}</dd></div>`).join("");
 const buscador=document.getElementById("gdBuscar"),vacio=document.getElementById("gdVacio");
 buscador.addEventListener("input",()=>{
  const consulta=norm(buscador.value.trim());
  let visibles=0;
  [...lista.children].forEach(entrada=>{
   entrada.hidden=!entrada.dataset.q.includes(consulta);
   if(!entrada.hidden)visibles++;
  });
  vacio.hidden=visibles>0;
  revelarAnalisisVisibles();
 });
 document.getElementById("gdRegistros").textContent=fmtData(CATALOGO.totalRecords);
 document.getElementById("gdCasos").textContent=fmtData(CATALOGO.totalCases);
 document.getElementById("gdIndice").addEventListener("click",event=>{
  const boton=event.target.closest("[data-ir]");
  if(boton)document.getElementById(boton.dataset.ir).scrollIntoView({behavior:"smooth",block:"start"});
 });
}
