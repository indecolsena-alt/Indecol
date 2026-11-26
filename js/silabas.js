// ===== división por sílabas para el texto justificado =====
// No todos los navegadores parten palabras en español por sí solos; sin cortes, el texto
// justificado deja huecos grandes entre palabras. Aquí se marcan los puntos de corte
// con guiones invisibles, que solo se ven cuando la palabra queda al final de un renglón.
(function(){
 // la misma lista de textos que se justifican en css/styles.css
 const TEXTOS=".pg :is(p,.chart-reading,.analysis-narrative,.analysis-steps li,.puntos li,.hd-formas li,.accesos span,.analysis-controls>span,.zone-annual-note):not(.dbv *,.team-cards *,.zone-barra *,.data-empty)";
 const GUION="­";
 const VOCAL=/[aeiouáéíóúü]/;
 // parejas de consonantes que no se separan
 const UNIDAS=/^(ch|ll|rr|[pbfcgk][lr]|[td]r)$/;
 function dividir(palabra){
  // las siglas (SIEDCO, DANE) no se parten
  if(palabra===palabra.toUpperCase())return palabra;
  const letras=palabra.toLowerCase(),cortes=[];
  let anterior=-1;
  for(let i=0;i<letras.length;i++){
   if(!VOCAL.test(letras[i]))continue;
   const consonantes=i-anterior-1;
   if(anterior>=0&&consonantes>0){
    const corte=consonantes===1?anterior+1:UNIDAS.test(letras.slice(i-2,i))?i-2:i-1;
    // se dejan al menos dos letras antes del guion y tres después
    if(corte>=2&&corte<=letras.length-3)cortes.push(corte);
   }
   anterior=i;
  }
  return cortes.reduceRight((texto,corte)=>texto.slice(0,corte)+GUION+texto.slice(corte),palabra);
 }
 function marcar(nodo){
  if(nodo.nodeValue.includes(GUION)||nodo.parentElement.closest("svg,select,[data-count-value]"))return;
  const nuevo=nodo.nodeValue.replace(/\p{L}{6,}/gu,dividir);
  if(nuevo!==nodo.nodeValue)nodo.nodeValue=nuevo;
 }
 function recorrer(raiz){
  if(raiz.nodeType===Node.TEXT_NODE){
   if(raiz.parentElement?.closest(TEXTOS))marcar(raiz);
   return;
  }
  if(raiz.nodeType!==Node.ELEMENT_NODE)return;
  const textos=document.createTreeWalker(raiz,NodeFilter.SHOW_TEXT);
  for(let nodo=textos.nextNode();nodo;nodo=textos.nextNode()){
   if(nodo.parentElement.closest(TEXTOS))marcar(nodo);
  }
 }
 recorrer(document.body);
 // las lecturas y fichas se redibujan al filtrar: también se dividen al aparecer
 new MutationObserver(cambios=>cambios.forEach(cambio=>cambio.addedNodes.forEach(recorrer)))
  .observe(document.body,{childList:true,subtree:true});
 // al copiar, el texto sale sin los guiones invisibles
 document.addEventListener("copy",evento=>{
  const texto=String(getSelection());
  if(!texto.includes(GUION))return;
  evento.clipboardData.setData("text/plain",texto.replaceAll(GUION,""));
  evento.preventDefault();
 });
})();
