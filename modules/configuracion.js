let fs = require("fs");
let events = require('events');
let os = require('os');


class Configuracion{

  constructor(filename='conf.json'){
    this.ok=true;
    this.filename=filename;

    this.eventEmitter = new events.EventEmitter();
    //console.log(this.eventEmitter);

    try
    {
      // Leer archivo
      let data = fs.readFileSync(filename);  // arroja excepción en caso de error
      this.data=JSON.parse(data.toString());
    }
    catch(e){
      //console.log(e);
      this.ok=false;
      process.exit();
    }
  }

  get(name){
    return this.data[name];
  }
  set(name,value){
    //console.log(this.data[name]);
    this.data[name]=value;
    //console.log(this.data[name]);
    fs.writeFile(this.filename,JSON.stringify(this.data,null,2),  (err)=> {
      if (err) return console.error(err);
      //console.log(`Archivo de configuración actualizado con el nuevo valor ${name}=${value}`);
      this.eventEmitter.emit('change_file');
   });
  }

  establecerDireccionLocal(){
    /*
    //let interfazdeRed=os.networkInterfaces();
    //interfazdeRed es un objeto
    //let ethernet=interfazdeRed["Ethernet"];
    //ethernet es un array

    for (let i = 0; i < ethernet.length; i++) {
      if (ethernet[i].family===this.get("familia_ip") && ethernet[i].mac===this.get("direccion_fisica")){
        this.set("servicio_web_local_host",ethernet[i].address);
        this.set("servicio_websocket_local_host",ethernet[i].address);
        this.set("site_host",ethernet[i].address);
        this.save();
      }
    }
    */
   
    for (let elemento of os.networkInterfaces()["Ethernet"]) {
      if (elemento.family===this.get("familia_ip") && elemento.mac===this.get("direccion_fisica")){
        this.set("servicio_web_local_host",elemento.address);
        this.set("servicio_websocket_local_host",elemento.address);
        this.set("site_host",elemento.address);
      }
    }
  }
}

module.exports={ Configuracion };
/*
conf = new Configuracion('conf.json');
if(!conf.ok){
  console.log('Error leyendo el archivo de configuración');
  process.exit();
}

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


