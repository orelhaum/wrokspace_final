/*********Funciones testeo***********/

import {
  servicioWeb
} from "./http.js";
import { servicioWebSocket } from "./websocket.js";
import {
  utilidades
} from "./utilidades.js";
import { pintar } from "./pintar.js";

let sw = new servicioWeb.ServicioWeb();
let sws = new servicioWebSocket.ServicioWebSocket();

//Actualización en tiempo real del valor del bitcoin
let precioActualizado = (data, ws) => {
  //let precioBitcoin = document.getElementById('precioBitcoin');
  let jsonData = JSON.parse(data);
  $("#precioBitcoin").text(jsonData.lastPrice + "$");
  //precioBitcoin.innerHTML = jsonData.lastPrice + "$";
}

sws.coin('btcusdt', (err) => {}, precioActualizado)

//Pintar Tabla

let numMaxFilas = 5;
let pagina = 1;
let numTotalElementos = 0;
let numMaxPaginas;
let options = {
  columnas: ["symbol", "cantidad"],
  cabecera: ["Moneda", "Valor"],
  id:"symbol"
};


function pedirFondosyPintar(fondos) {
  let datosParaPintar = [];

  for (let nombreFondo in fondos.funds) {
    let fondo = {
      "symbol": nombreFondo,
      "cantidad": fondos.funds[nombreFondo]
    };
    datosParaPintar.push(fondo);
  }
  datosParaPintar = utilidades.ordenarArrayDeObjeto(datosParaPintar, 'symbol');
  pintar.pintarTabla('funds', datosParaPintar, options);

}

function pintarFondos() {
  sw.funds((err,fondos) => {
    //Primero me quedo sólo con las monedas que estén relacionadas con el BTC
    //numTotalElementos = fondos.length;
    //Calculamos el número máximo de páginas según el número de elementos
    //numMaxPaginas = Math.ceil(numTotalElementos / numMaxFilas);
    //console.log(`Número máximo de páginas es:${numMaxPaginas}`)

    pedirFondosyPintar(fondos);

    //document.getElementById('boton_adelante').addEventListener('click', (e) => {
    $('#boton_adelante').click((e) => {
      pagina = (pagina == numMaxPaginas) ? 1 : pagina + 1;
      pedirFondosyPintar(fondos);
    })

    //document.getElementById('boton_atras').addEventListener('click', (e) => {
    $('#boton_atras').click((e) => {
      pagina = (pagina == 1) ? numMaxPaginas : pagina - 1;
      pedirFondosyPintar(fondos);

    })
  }, false)
}

pintarFondos();