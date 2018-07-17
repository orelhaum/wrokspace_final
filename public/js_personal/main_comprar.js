import {
  servicioWeb
} from "./http.js";
import {
  utilidades
} from "./utilidades.js";

let sw = new servicioWeb.ServicioWeb();
let selectMonedas = document.getElementById('selectMonedas');
let porcentaje = document.getElementById('porcentaje');
let botonComprar = document.getElementById('botonComprar');
let divResultado = document.getElementById('resultado');
let spanTransaccion = document.getElementById('transaccion');

let cantidadBTC, cantidadMonedaAComprar, nombreMoneda, BTCActual, ultimoPrecioMoneda;

function actualizarTransaccion() {
    spanTransaccion.innerHTML = `${cantidadBTC.toFixed(2)} BTC --> ${cantidadMonedaAComprar.toFixed(2)} ${nombreMoneda}`;
}

function pedirInformacionTransaccion(){
  sw.funds(function (err, data) {
    BTCActual = data.funds.BTCUSDT;
    cantidadBTC = BTCActual * Number.parseInt(porcentaje.value) / 100;
    console.log(cantidadBTC);

    sw.market(selectMonedas.value, (err, data) => {
      ultimoPrecioMoneda = data[0].lastPrice;
      cantidadMonedaAComprar = cantidadBTC / ultimoPrecioMoneda;
      nombreMoneda = selectMonedas.value;
      actualizarTransaccion();
      porcentaje.disabled = false;
    })
  });
}


sw.coins((err, monedas) => {
  //Primero me quedo sólo con las monedas que estén relacionadas con el BTC
  console.log(monedas);
  let monedasOrdenadas = utilidades.limpiarMonedas(monedas);
  for (let moneda of monedasOrdenadas) {
    let option = document.createElement('option');

    if (moneda !== "BTCUSDT") {
      option.innerHTML = moneda;
      selectMonedas.add(option);
    }
  }

  pedirInformacionTransaccion();
  botonComprar.disabled = false;
})

botonComprar.onclick = (e) => {

  sw.buy(selectMonedas.value, porcentaje.value, (err, data) => {
    divResultado.innerHTML = (err) ? err : "Compra realizada correctamente";

    if (!err) pedirInformacionTransaccion();
    

    setTimeout(() => {
      resultado.innerHTML = "";
    }, 3000);

  })
}


porcentaje.onchange = (e) => {
  document.getElementById('valorPorcentaje').innerHTML = porcentaje.value;
  cantidadBTC = BTCActual * Number.parseInt(porcentaje.value) / 100;
  cantidadMonedaAComprar = cantidadBTC / ultimoPrecioMoneda;
  actualizarTransaccion();
}

selectMonedas.onchange = (e) => {
  console.log(selectMonedas.value)
  

  pedirInformacionTransaccion();

}