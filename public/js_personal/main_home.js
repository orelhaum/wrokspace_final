/*********Funciones testeo***********/
//Actualización en tiempo real del valor del bitcoin

//import { servicioWeb } from "./http.js";
import { servicioWebSocket } from "./websocket.js";
//import { pintar } from "./pintar.js";
//import { utilidades } from "./utilidades.js";

//let sw = new servicioWeb.ServicioWeb();
let sws = new servicioWebSocket.ServicioWebSocket();

let precioActualizado = (data, ws) => {
  let jsonData = JSON.parse(data);
  $("#"+jsonData.symbol).text(jsonData.lastPrice + "$");
}

sws.coin('BTCUSDT', () => {}, precioActualizado);
sws.coin('ETHBTC', () => {}, precioActualizado);
sws.coin('LTCBTC', () => {}, precioActualizado);