/*********Funciones testeo***********/

import { servicioWeb } from "./http.js";
//import { servicioWebSocket } from "./websocket.js";
import { pintar } from "./pintar.js";
import { utilidades } from "./utilidades.js";

let sw = new servicioWeb.ServicioWeb();
//let sws = new servicioWebSocket.ServicioWebSocket();

//Pintar Tabla

let numMaxFilas = 5;
let pagina = 1;
let numTotalElementos = 0;
let numMaxPaginas;
let options = {
  received:{
  columnas: ["unread","username","message","date"],
  cabecera: ["Leido", "De","Mensaje","Fecha Mensaje"],
  id:"id"
},
sent:{
  columnas: ["unread","destination_user","message","date"],
  cabecera: ["Leido", "Para","Mensaje","Fecha Mensaje"],
  id:"id"
},
};


function pedirMensajesyPintar(mensajes,tipoMensaje) {
  let datosParaPintar = [];
  datosParaPintar = utilidades.ordenarArrayDeObjeto(mensajes, 'date');
  pintar.pintarTabla(tipoMensaje, datosParaPintar, options[tipoMensaje]);

}

function pintarMensajes(tipoMensaje) {
  sw.list(objetoAutenticacion.username,(err,mensajes) => {
    pedirMensajesyPintar(mensajes[tipoMensaje],tipoMensaje);

    //document.getElementById('boton_adelante').addEventListener('click', (e) => {
    $(`#boton_adelante_${tipoMensaje}`).click((e) => {
      pagina = (pagina == numMaxPaginas) ? 1 : pagina + 1;
      pedirMensajesyPintar(mensajes[tipoMensaje],tipoMensaje);
    })

    //document.getElementById('boton_atras').addEventListener('click', (e) => {
    $(`#boton_atras_${tipoMensaje}`).click((e) => {
      pagina = (pagina == 1) ? numMaxPaginas : pagina - 1;
      pedirMensajesyPintar(mensajes[tipoMensaje],tipoMensaje);

    })
  }, false)
}

pintarMensajes('received');
pintarMensajes('sent');