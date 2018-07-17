const { UpdateCoins } = require('./modules/update_coins');
const { Database } = require('./modules/database');
const { DatabasePromise } = require('./modules/database_promise');
const { Criptografia } = require('./modules/criptografia');
const { Configuracion } = require('./modules/configuracion');

let conf = new Configuracion('conf.json');

const user={
  user:"ramiro",
  passwordSha: "ramirosp",
  email: "pruebas.ramiro.saenz.picabea@gmail.com",
  activado: false
}

let db= new Database(conf).getDb();
/*
db.getUsers((err,data)=>{
  console.log(data);
});
*/
/*
db.deleteUser('ramiro',(err,data)=>{
  console.log(data);
});
*/

let o = new UpdateCoins(conf);
//inicia el proceso de actualización de los archivos
//o.start();
o.now();

/*
let db= new Database(conf).getDB();


db.getEmpresas((err,empresas)=>{
  if(err) console.log('Se ha producido un error:' + err);
  console.log('Datos obtenidos:' + empresas[0].DIRECCION);
  */
/*
let db= new Database(conf).getDB();


db.getHistorical((err,funds)=>{
  if(err) console.log(err);
  console.log(funds);
})

*/
/*
let db= new DatabasePromise(conf).getDb();
db.getHistorical('BTCUSDT').then((data)=>{
  console.log("datos recibidos:" + data);
}).catch((err)=>{
console.log("Se ha producido un error: " + err);
})
*/


/*
//Pruebas del modulo de Base de Datos
let db= new Database().getDB();

db.getCoins((err,coins)=>{
  console.log(coins);
})


db.getCoin('BTCUSDT',(err,data)=>{
  console.log(data);
})
*/


/*
//Pruebas del módulo de criptografía
const crypto = new Criptografia;

console.log(crypto.sh3('asd'));

const datosCifrados= crypto.cifrar('Hello World!');
console.log(datosCifrados);
const datosDesCifrados= crypto.descifrar(datosCifrados);
console.log(datosDesCifrados);

console.log(crypto.stringRandom(60));
*/


//const { ServicioWeb } = require('./modules/servicio_web_remoto');

/*
const { Configuracion } = require('./modules/configuracion');
const { CONSTANTES_URL,CONSTANTES_CONF } = require('./modules/constantes');

conf = new Configuracion('conf.json');
if(!conf.ok){
  console.log('Error leyendo el archivo de configuración');
  process.exit();
}



let sw = new ServicioWeb();
sw.coins(function(err, monedas) {
   console.log(monedas);
});
*/
/*
conf.eventEmitter.addListener('change_file',()=>{
  console.log(`Archivo de configuración actualizado`);
})

//ya tenemos almacenado correctamente el archivo de configuración de nuestra aplicación
//console.log(conf.data);
//Cambiar la dirección IP de escucha de mis servicios considerando la direccion_fisica y familia_ip del archivo de congifuración
conf.establecerDireccionLocal();
//console.log(conf.data);
conf.set("loggin_file","logprueba.txt");
*/