/*********Funciones testeo***********/
//Actualización en tiempo real del valor del bitcoin

/*
let precioActualizado = (data, ws) => {
  let jsonData = JSON.parse(data);
  $("#"+jsonData.symbol).text(jsonData.lastPrice + "$");
}

coin('BTCUSDT', () => {}, precioActualizado);
coin('ETHBTC', () => {}, precioActualizado);
coin('LTCBTC', () => {}, precioActualizado);
*/


import { servicioWeb } from "./http.js";
//import { servicioWebSocket } from "./websocket.js";
import { pintar } from "./pintar.js";
import { utilidades } from "./utilidades.js";

let sw = new servicioWeb.ServicioWeb();
//let sws = new servicioWebSocket.ServicioWebSocket();



//Pintar Tabla
let options = {
  columnas : ["symbol", "lastPrice", "volume", "highPrice"],
  cabecera : ["Moneda", "Precio", "Volumen", "Precio Máximo"],
  id:"symbol"
};
let numMaxFilas = 5;
let pagina = 1;
let numTotalElementos = 0;
let numMaxPaginas;



function pedirMonedasyPintar(monedasOrdenadas) {
  let datosParaPintar = [];

  let indice_inicial = (pagina - 1) * numMaxFilas;
  let indice_final = ((pagina * numMaxFilas) > numTotalElementos) ? numTotalElementos : pagina * numMaxFilas;

  console.log(monedasOrdenadas);
  for (let i = indice_inicial; i < indice_final; i++) {
    //hacemos la consulta del último precio para la moneda
    sw.market(monedasOrdenadas[i], (err,data) => {
      datosParaPintar.push(data[0]);
      if (datosParaPintar.length === indice_final - indice_inicial) {
        datosParaPintar = utilidades.ordenarArrayDeObjeto(datosParaPintar, 'symbol');
        pintar.pintarTabla('monedas', datosParaPintar, options);
      }
    },false)
  }
  $('#pagina_actual').html(`Página actual: ${pagina} de ${numMaxPaginas}`);
}

function pintarMonedas() {
  /*console.log("dentro de pintar monedas");
  console.log(monedas );*/
  //preguntamos por todas las monedas para ir recorriendolas luego y pedir su precio actual
  sw.coins((err,monedas) => {
    //Primero me quedo sólo con las monedas que estén relacionadas con el BTC
    let monedasOrdenadas = utilidades.limpiarMonedas(monedas);
    numTotalElementos = monedasOrdenadas.length;
    //Calculamos el número máximo de páginas según el número de elementos
    numMaxPaginas = Math.ceil(numTotalElementos / numMaxFilas);
    console.log(`Número máximo de páginas es:${numMaxPaginas}`)

    pedirMonedasyPintar(monedasOrdenadas);

    //document.getElementById('boton_adelante').addEventListener('click', (e) => {
    $('#boton_adelante').click((e) => {
      pagina = (pagina == numMaxPaginas) ? 1 : pagina + 1;
      pedirMonedasyPintar(monedasOrdenadas);
    })

    //document.getElementById('boton_atras').addEventListener('click', (e) => {
    $('#boton_atras').click((e) => {
      pagina = (pagina == 1) ? numMaxPaginas : pagina - 1;
      pedirMonedasyPintar(monedasOrdenadas);

    })
  },false)
}

pintarMonedas();


