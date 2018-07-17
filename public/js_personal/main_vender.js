import {
  servicioWeb
} from "./http.js";
import {
  utilidades
} from "./utilidades.js";

let sw = new servicioWeb.ServicioWeb();
let selectMonedas = document.getElementById('selectMonedas');
let porcentaje = document.getElementById('porcentaje');
let botonVender = document.getElementById('botonVender');
let divResultado = document.getElementById('resultado');
//let vendidoOK = $('#vendidoOK');
let vendidoOK = document.getElementById('vendidoOK');
let spanTransaccion = document.getElementById('transaccion');

let  cantidadMoneda,cantidadMonedaAVender, nombreMoneda, cantidadBTC, ultimoPrecioMoneda;


function actualizarTransaccion() {
  spanTransaccion.innerHTML = `${cantidadMonedaAVender.toFixed(2)} ${nombreMoneda}-->${cantidadBTC.toFixed(2)} BTC `;
}

function pedirInformacionTransaccion(){
  sw.market(selectMonedas.options[selectMonedas.selectedIndex].id, (err, data) => {
    console.log('dentro de pedirInformacionTransaccion');
    ultimoPrecioMoneda = data[0].lastPrice;
    console.log(ultimoPrecioMoneda);
    cantidadMoneda=selectMonedas.options[selectMonedas.selectedIndex].valor;
    console.log(cantidadMoneda);
    cantidadMonedaAVender = cantidadMoneda * Number.parseInt(porcentaje.value) / 100;
    cantidadBTC=cantidadMonedaAVender*ultimoPrecioMoneda;
    nombreMoneda = selectMonedas.options[selectMonedas.selectedIndex].id;
    actualizarTransaccion();
    porcentaje.disabled = false;
  })
}

function obtieneValoresFondos(){
  console.log('obteniendo valores de los fondos');
sw.funds((err,fondos) => {
  //Primero me quedo sólo con las monedas que estén relacionadas con el BTC
  console.log(fondos);
  //Primero vaciamos el combo por si tuviera ya valores de antes
  utilidades.removeOptions(selectMonedas);
  for (let moneda in fondos.funds) {
    let option =document.createElement('option');
      
    console.log(moneda);
    if(moneda !=="BTCUSDT"){
      option.innerHTML=`${moneda} (${fondos.funds[moneda].toFixed(2)})` ;
      option.id=moneda;
      option.valor=fondos.funds[moneda].toFixed(2);
      selectMonedas.add(option);
    }
  }
  pedirInformacionTransaccion();
  botonVender.disabled=false;
})
}

porcentaje.onchange = (e) => {
  console.log('dentro de onchange porcentaje');
  document.getElementById('valorPorcentaje').innerHTML = porcentaje.value;
  
  cantidadMoneda=porcentaje.value;
  pedirInformacionTransaccion();
}

selectMonedas.onchange = (e) => {
  console.log(selectMonedas.value)
  cantidadMoneda=selectMonedas.options[selectMonedas.selectedIndex].valor;
  console.log(cantidadMoneda);
  pedirInformacionTransaccion();
}

botonVender.onclick= (e)=>{
sw.sell(selectMonedas.options[selectMonedas.selectedIndex].id,porcentaje.value,(err,data)=>{
  if(err){
    divResultado.innerHTML= "Venta realizada correctamente";
    vendidoOK.show();
  }
  else
  {}
  divResultado.innerHTML= (err) ? err : "Venta realizada correctamente";
  console.log('despues de vender y antes de actualizar');
  obtieneValoresFondos();
setTimeout(() => {
  resultado.innerHTML="";
  vendidoOK.hide();
}, 3000);

})
}

obtieneValoresFondos();