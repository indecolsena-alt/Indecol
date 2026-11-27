// Contenido del apartado "Historia delictiva", transcrito del documento
// "SIEDCO: de 18 a 34 categorías de delitos" (consulta del 26 de noviembre de 2026).
window.INDECOL_HISTORIA = {
 tipos: {
  mantiene: { etiqueta: "Se mantiene", plural: "se mantienen" },
  divide: { etiqueta: "Se divide", plural: "salen de una división" },
  nuevo: { etiqueta: "Nuevo delito", plural: "nuevos delitos" },
  operativo: { etiqueta: "Resultado operativo", plural: "resultados operativos" }
 },
 familias: [
  "Libertad individual",
  "Patrimonio económico",
  "Violencia contra las personas",
  "Orden público y seguridad",
  "Bienes jurídicos nuevos",
  "Respuesta policial"
 ],
 // [número, categoría, tipo de cambio, familia, norma, año]
 categorias: [
  [1, "Capturas", "operativo", "Respuesta policial", "Actividad operativa registrada en SIEDCO", 2003],
  [2, "Incautación de armas de fuego", "operativo", "Orden público y seguridad", "Art. 365 Ley 599 (porte ilegal de armas)", 2000],
  [3, "Incautación de estupefacientes", "operativo", "Orden público y seguridad", "Art. 376 Ley 599 (tráfico de estupefacientes)", 2000],
  [4, "Estafa", "nuevo", "Patrimonio económico", "Art. 246 Ley 599", 2000],
  [5, "Extorsión", "mantiene", "Libertad individual", "Art. 244 Ley 599", 2000],
  [6, "Terrorismo", "mantiene", "Orden público y seguridad", "Art. 343 Ley 599", 2000],
  [7, "Amenazas", "mantiene", "Violencia contra las personas", "Art. 347 Ley 599", 2000],
  [8, "Delitos sexuales", "mantiene", "Violencia contra las personas", "Título IV Ley 599", 2000],
  [9, "Homicidios", "mantiene", "Violencia contra las personas", "Art. 103 Ley 599", 2000],
  [10, "Injuria y calumnia", "nuevo", "Violencia contra las personas", "Arts. 220 y 221 Ley 599", 2000],
  [11, "Lesiones personales", "mantiene", "Violencia contra las personas", "Art. 111 Ley 599", 2000],
  [12, "Violencia intrafamiliar", "mantiene", "Violencia contra las personas", "Art. 229 Ley 599", 2000],
  [13, "Delitos informáticos", "nuevo", "Patrimonio económico", "Ley 1273 de 2009", 2009],
  [14, "Derechos de autor", "nuevo", "Patrimonio económico", "Arts. 270 a 272 Ley 599", 2000],
  [15, "Contra la administración pública", "nuevo", "Bienes jurídicos nuevos", "Título XV Ley 599", 2000],
  [16, "Violencia a servidor público", "nuevo", "Violencia contra las personas", "Art. 429 Ley 599", 2000],
  [17, "Secuestro extorsivo", "divide", "Libertad individual", "Art. 169 Ley 599", 2000],
  [18, "Secuestro simple", "divide", "Libertad individual", "Art. 168 Ley 599", 2000],
  [19, "Tráfico de migrantes", "nuevo", "Libertad individual", "Art. 188 Ley 599", 2000],
  [20, "Trata de personas", "nuevo", "Libertad individual", "Art. 188A (Ley 747 de 2002)", 2002],
  [21, "Abigeato", "mantiene", "Patrimonio económico", "Art. 243A (Ley 1944 de 2018)", 2018],
  [22, "Hurto a automotores", "mantiene", "Patrimonio económico", "Art. 239 Ley 599", 2000],
  [23, "Hurto a comercio", "mantiene", "Patrimonio económico", "Art. 239 Ley 599", 2000],
  [24, "Hurto a entidades financieras", "mantiene", "Patrimonio económico", "Art. 239 Ley 599", 2000],
  [25, "Hurto a motocicletas", "mantiene", "Patrimonio económico", "Art. 239 Ley 599", 2000],
  [26, "Hurto a personas", "mantiene", "Patrimonio económico", "Art. 239 Ley 599", 2000],
  [27, "Hurto a residencias", "mantiene", "Patrimonio económico", "Art. 239 Ley 599", 2000],
  [28, "Piratería terrestre", "mantiene", "Patrimonio económico", "Arts. 239 y 241 Ley 599 (hurto agravado)", 2000],
  [29, "Delitos contra el medio ambiente", "nuevo", "Bienes jurídicos nuevos", "Título XI (sustituido por Ley 2111 de 2021)", 2021],
  [30, "Maltrato animal", "nuevo", "Violencia contra las personas", "Art. 339A (Ley 1774 de 2016)", 2016],
  [31, "Automotores recuperados", "operativo", "Patrimonio económico", "Actividad operativa registrada en SIEDCO", 2003],
  [32, "Homicidios en accidentes de tránsito", "mantiene", "Violencia contra las personas", "Art. 109 Ley 599 (homicidio culposo)", 2000],
  [33, "Lesiones en accidentes de tránsito", "mantiene", "Violencia contra las personas", "Art. 120 Ley 599 (lesiones culposas)", 2000],
  [34, "Motocicletas recuperadas", "operativo", "Patrimonio económico", "Actividad operativa registrada en SIEDCO", 2003]
 ],
 // delito de 2010 -> números de las categorías actuales que salen de él (en el orden del diagrama).
 // Los dos últimos no son delitos de la lista de 2010.
 origenes: [
  ["Extorsión", [5]],
  ["Secuestro", [17, 18, 19, 20]],
  ["Abigeato", [21, 29]],
  ["Hurto a automotores", [22, 31]],
  ["Hurto a comercio", [23, 14]],
  ["Hurto a entidades financieras", [24, 13]],
  ["Hurto a motocicletas", [25, 34]],
  ["Hurto a personas", [26, 4]],
  ["Hurto a residencias", [27]],
  ["Piratería terrestre", [28]],
  ["Amenazas", [7, 10]],
  ["Delitos sexuales", [8]],
  ["Homicidios", [9, 2]],
  ["Homicidios en accidentes de tránsito", [32]],
  ["Lesiones en accidentes de tránsito", [33]],
  ["Lesiones personales", [11, 30, 16]],
  ["Violencia intrafamiliar", [12]],
  ["Terrorismo", [6, 3]],
  ["Ninguno (bien jurídico nuevo)", [15], "fuera"],
  ["Todos los delitos", [1], "fuera"]
 ],
 hitos: [
  { anio: 1955, titulo: "Inicio de la estadística policial", texto: "La Policía empieza a llevar estadísticas de delitos y contravenciones; el registro es manual.", categorias: [] },
  { anio: 2000, titulo: "Nuevo Código Penal (Ley 599)", texto: "Se expide el Código Penal vigente; allí están la mayoría de los delitos que hoy cuenta el SIEDCO.", categorias: [7, 8, 5, 9, 32, 22, 23, 24, 25, 26, 27, 33, 11, 28, 6, 12, 17, 18, 15, 14, 4, 10, 19, 16, 2, 3] },
  { anio: 2002, titulo: "Piloto del SIEDCO en Bogotá y Ley 747", texto: "El SIEDCO arranca como piloto en Bogotá; la Ley 747 crea el delito de trata de personas (art. 188A).", categorias: [20] },
  { anio: 2003, titulo: "SIEDCO en todo el país", texto: "El sistema funciona a nivel nacional y empieza a registrar también la actividad operativa (capturas y recuperaciones).", categorias: [31, 1, 34] },
  { anio: 2009, titulo: "Ley 1273: delitos informáticos", texto: "Se crea el título de delitos informáticos en el Código Penal.", categorias: [13] },
  { anio: 2010, titulo: "Se publican los 18 delitos de impacto", texto: "La Policía publica series de 18 delitos de impacto por año (2010 a 2025).", categorias: [] },
  { anio: 2016, titulo: "Ley 1774: maltrato animal", texto: "Los animales se reconocen como seres sintientes y el maltrato animal se vuelve delito.", categorias: [30] },
  { anio: 2018, titulo: "Ley 1944 (abigeato) e integración con la Fiscalía", texto: "El abigeato pasa a tener tipo penal propio y las cifras del SIEDCO empiezan a unificarse con el SPOA de la Fiscalía.", categorias: [21] },
  { anio: 2021, titulo: "Ley 2111: delitos ambientales", texto: "Se sustituye el título de delitos contra los recursos naturales y el medio ambiente.", categorias: [29] },
  { anio: 2025, titulo: "Transición a la clasificación ICCS", texto: "La Policía termina el paso al nuevo modelo estadístico con la clasificación internacional de delitos adaptada por el DANE.", categorias: [] },
  { anio: 2026, titulo: "Portal SIEDCO con 34 delitos", texto: "Consulta del portal público del SIEDCO (noviembre de 2026): 34 delitos, incluidos 5 resultados operativos de la Policía.", categorias: [] }
 ]
};
