//Prueba de reloj que se va actualizando cada segundo




//import { servicioWeb } from "./http.js";
import {
  servicioWebSocket
} from "./websocket.js";
//import { pintar } from "./pintar.js";
import {
  utilidades
} from "./utilidades.js";

//let sw = new servicioWeb.ServicioWeb();
let sws = new servicioWebSocket.ServicioWebSocket();

utilidades.obtenerFecha();
setInterval(() => {
  document.getElementById("reloj").innerHTML = utilidades.obtenerFecha()
}, 1000)

//chat
let conexionEstablecida = (ws) => {
  console.log("Conexión establecida");
  //document.getElementById('submitmsg').addEventListener("click",ws.send(document.getElementById('usermsg').innerText));
  function enviarMensaje(e) {
    console.log("Pulsado");
    console.log($("#usermsg").val());
    ws.send($("#usermsg").val()); // document.getElementById('usermsg').value);
    //document.getElementById('usermsg').value = "";
    $("#usermsg").val("");
    //console.log($("#usermsg").val());
  }
  $('#submitmsg').click(enviarMensaje);
  //document.getElementById('submitmsg').addEventListener("click", enviarMensaje);
  console.log("evento asociado");
}

let mensajeEntrante = (data, ws) => {
  let nodoAux = document.createElement('p');
  let chatBoxElement = $("#chatbox");
  try {

    let mensajeRecibido = JSON.parse(data);
    console.log(mensajeRecibido);
    nodoAux.innerHTML = `${mensajeRecibido.username}: ${mensajeRecibido.msg}`;
    console.log(nodoAux);
    chatBoxElement.append(nodoAux);
  } catch (e) {
    //Aquí entra cuando el mensaje es OK o ERROR
    console.log(data);
    if (data === "OK") {
      $("#estado").html("CONECTADO")
      $("#conectado").show();
      setTimeout(() => {
        $("#conectado").hide()
      }, 3000)
      //document.getElementById('estado').innerHTML = "CONECTADO";
    } else {
      $("#estado").html("NO CONECTADO")
      $("#error").show();
      setTimeout(() => {
        $("#error").hide()
      }, 3000)
      //document.getElementById('estado').innerHTML = "NO CONECTADO";
    }

  }
}
sws.chat('ramiro', conexionEstablecida, mensajeEntrante)