async function obtenerDatosDiaActual() {
  try {
    const res = await fetch("./Assets/js/mindicador.json");
    const data = await res.json();
    return data;
  } catch (e) {
    alert(e.message);
  }
}
async function obtenerDatosHistoricos(moneda, fecha) {
  const res = await fetch(`https://mindicador.cl/api/${moneda}/${fecha}`);
  const data = await res.json()
  return data;
}

async function Select() {
  const data = await obtenerDatosDiaActual();
  const monedas = (Object.keys(data));
  let html = '<select name="moneda" id="moneda">';
  for (const codigo_moneda of monedas) {
    const moneda = data[codigo_moneda];
    if (moneda.unidad_medida == 'Pesos') {
      html += `<option value="${moneda.codigo}-${moneda.valor}">${moneda.nombre}</option>`;
    }
  }
  html += '</select>';
  const selector = document.querySelector('#convertir');
  selector.innerHTML = html;
}

function dibujaGrafico(fechas,valores) {
  const ctx = document.getElementById('myChart');
  const data = {
     labels: fechas,
     datasets: [{
      label: 'Valores',
      color: 'rgb(255,255,255)',
      data: valores,
      borderWidth: 2,
      backgroundColor: 'rgb(246, 248, 250)',
      borderColor: 'rgb(255, 0, 0)',
      hoverBackgroundColor: 'rgb(255, 0, 0)',
    }]
  };
  new Chart(ctx, {
    type: 'line',
    data: data,
  });
}
const botonCalcular = document.querySelector('#buscar');
botonCalcular.addEventListener('click', async function () {
  const valor = document.querySelector('#valor').value;
  const tasaConversion = document.querySelector('#moneda').value.split('-');
  const valorConvertido = (valor / tasaConversion[1]);
  document.querySelector('#resultado').innerHTML = valorConvertido.toFixed(2);

  const codigoMoneda = tasaConversion[0];
  const fechaActual = new Date();
  
  let fechas = [];
  let valores = [];

  /*Recorre dias */
 let ultimoValor = 0;
  for (i = 10;i>0;i--) {
        const dia = fechaActual.getDate()-i;
        const mes = fechaActual.getMonth()+1; /*Enero = 0*/
        const ano = fechaActual.getFullYear();
        const fechaConsulta = `${dia}-${mes}-${ano}`;
       const dataHistorica = await obtenerDatosHistoricos(codigoMoneda,fechaConsulta);
       console.log(dataHistorica);
       fechas.push(fechaConsulta);
       if (dataHistorica.serie.length > 0){
        valores.push(dataHistorica.serie[0].valor);
        ultimoValor = dataHistorica.serie[0].valor;
       } else {
        valores.push(ultimoValor);
       }      
  }
  dibujaGrafico(fechas,valores);
})
Select();




























/*const btnCarlcular = document.querySelector('#btnCalcular');

/*btnCarlcular.addEventListener('click', async function (){
    const valor = document.querySelector('#valor').value;
    const tasaConversion = document.querySelector('#valor').value;
    const valorConvertido = valor/tasaConversion;
    console.log(valor);
    console.log(tasaConversion);
   document.querySelector('#resultado').innerHTML = valorConvertido.toFixed[2];

   const codigo_moneda = ('')
   for(i = 0;i<10;i++){

   }
   dibujaGrafico()
});*/


