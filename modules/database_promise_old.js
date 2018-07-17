const redis = require('redis');
const fs = require('fs');

const { Configuracion } = require('./configuracion');
const { Criptografia } = require('./criptografia'); 
const { Compresion } = require('./compresion');
const { CONSTANTES_CONF } = require('./constantes');
const { Database } = require('./database');

class DatabaseBase{
  constructor(conf){
    this.crypto= new Criptografia(conf);
    this.compresion= new Compresion();
    this.dbWithoutPromise= new Database(conf);
  }

  setCoins(coins,callback){
    console.log('Método setCoins no implementado');
  }

  getCoins(callback){
    console.log('Método getCoins no implementado');
  }

  setCoin(coin,dataCoin,callback){
    console.log('Método setCoin no implementado');
  }

  getCoin(coin,callback){
    console.log('Método getCoin no implementado');
  }

  setFunds(funds,callback){
    console.log('Método setFunds no implementado');
  }

  getFunds(callback){
    console.log('Método getCoin no implementado');
  }

  setHistorical(data,callback){
    console.log('Método setHistorical no implementado');
  }

  getHistorical(callback){
    console.log('Método getHistorical no implementado');
  }
  close(){
    console.log('Método close no implementado');
  }
}

class DatabaseFile extends DatabaseBase{
  constructor(conf){
    super(conf); //al crear un objeto de esta clase llama tambien al constructor de la clase que está después de extends
    this.directorio= conf.get(CONSTANTES_CONF.directorio_almacenamiento);
  }

  setCoins(coins,callback){
    //console.log('Método setCoins implementado');
    const data ={
      //guardamos un objeto JSON y dentro guardamso ela tributo data con el array de monedas
      data : coins
    }
    // Asíncrono
    fs.writeFile(`${ this.directorio}coins.dat`, JSON.stringify(data,null,2) ,  function(err) {
      if(callback) callback(err);
      console.log('ya ha escrito el archivo');
    });
  }

  getCoins(callback){
    //console.log('Método getCoins implementado');

    fs.readFile(`${ this.directorio}coins.dat`, function (err, data) {
      if ((err) && (callback)){
        callback(err);
        return;
      }
      else{
        //los datos son correctos
        const dataJson = JSON.parse(data.toString());
        if(callback) callback(err,dataJson.data);
      }

    });
  }

  setCoin(coin,dataCoin,callback){
    console.log('Método setCoin implementado');

        //console.log('Método setCoins implementado');
        const data ={
          //guardamos un objeto JSON y dentro guardamso ela tributo data con el array de monedas
          data : dataCoin
        }
        // Asíncrono
        fs.writeFile(`${this.directorio}${coin.toUpperCase()}.dat`, JSON.stringify(data,null,2) ,  function(err) {
          if(callback) callback(err);
          console.log('ya ha escrito el archivo');
        });
  }

  getCoin(coin,callback){
    console.log('Método getCoin implementado');
    fs.readFile(`${this.directorio}${coin.toUpperCase()}.dat`, function (err, data) {
      if ((err) && (callback)){
        callback(err);
        return;
      }
      else{
        //los datos son correctos
        const dataJson = JSON.parse(data.toString());
        if(callback) callback(err,dataJson.data);
      }
    });
  }

  setFunds(dataFunds,callback){
    console.log('Método setFunds implementado');
    //console.log(dataFunds);
    const data ={
      //guardamos un objeto JSON y dentro guardamos el tributo data con el array de monedas
      data : dataFunds
    }
    //encriptamos para guardarlo bien
    const dataFundsCifrados= this.crypto.cifrar(JSON.stringify(data));
    // Asíncrono
    fs.writeFile(`${this.directorio}funds.dat`, dataFundsCifrados ,  (err)=> {
      if(callback) callback(err);
      //console.log('ya ha escrito el archivo');
    });

  }

  getFunds(callback){
    console.log('Método getFunds implementado');

    fs.readFile(`${this.directorio}funds.dat`,  (err, data)=> {
      if ((err) && (callback)){
        callback(err);
        return;
      }
      else{
        //los datos son correctos
        const funds=this.crypto.descifrar(data.toString());
        const fundsJson = JSON.parse(funds);
        if(callback) callback(err,fundsJson.data);
      }
    });
  }

  setHistorical(dataHistorical,callback){
    console.log('Método setHistorical implementado');

    const data ={
      //guardamos un objeto JSON y dentro guardamos el tributo data con el array de monedas
      data : dataHistorical
    }

    this.compresion.comprimir(JSON.stringify(data),(err,data)=>{
      if (err) return console.log(err);
    // Asíncrono
    fs.writeFile(`${this.directorio}historical.tar.gz`, data ,  (err)=> {
      if(callback) callback(err);
      //console.log('ya ha escrito el archivo');
    });
    })
  }

  getHistorical(callback){
    console.log('Método getHistorical implementado');

    fs.readFile(`${this.directorio}historical.tar.gz`,  (err, data)=> {
      if ((err) && (callback)) return callback(err);
      else{
        //los datos son correctos
        this.compresion.desComprimir(data.toString(),()=>{
          const historicalJson = JSON.parse(historical);
          if(callback) callback(err,historicalJson.data);
        });
      }
    });

  }
  close(){

  }
}

class DatabaseRedis extends DatabaseBase{
  constructor(conf){
    super(conf); //al crear un objeto de esta clase llama tambien al constructor de la clase que está después de extends

    const options={
      host:conf.get(CONSTANTES_CONF.database_redis_host),
      puerto:conf.get(CONSTANTES_CONF.database_redis_port),
      password:conf.get(CONSTANTES_CONF.database_redis_password)
    }

    this.client = redis.createClient(options);
  }

  setCoins(coins,callback){
    this.client.del('coins');
    this.client.rpush('coins',coins);
  }

  getCoins(){
    console.log('Método getCoins implementado');
    return new Promise((resolve,reject)=>{
      const db=this.dbWithoutPromise.getDB();
      db.getCoins((err,data)=>{
        if (err) return reject(err);
        resolve(data);
      });
    })
/*
así seria con promesa real pero como el codigo se repite utilizamos la parte de no promesas y la convertimos en promes
      this.client.llen('coins',(err,longitud)=>{
        console.log(longitud);
        if (err) return reject(err); //si falla devuelvo el error
        this.client.lrange('coins',0,longitud,(err,data)=>{
          if (err) return reject(err);//si falla devuelvo el error
          resolve(data);//si va todo bien devuelvo los datos
        })
      })
    });*/
  }
  

  setCoin(coin,dataCoin,callback){
    this.client.hmset(coin,dataCoin);
  }

  getCoin(coin){
    return new Promise((resolve,reject)=>{
      const db=this.dbWithoutPromise.getDB();
      db.getCoin(coin,(err,data)=>{
        if (err) return reject(err);
        resolve(data);
      });
    })
  }

  setFunds(dataFunds,callback){
    console.log('Método setFunds implementado');
    //console.log(dataFunds);
    const data ={
      //guardamos un objeto JSON y dentro guardamos el tributo data con el array de monedas
      data : dataFunds
    }
    //encriptamos para guardarlo bien
    const dataFundsCifrados= this.crypto.cifrar(JSON.stringify(data));

    this.client.set('funds',dataFundsCifrados);

  }

  getFunds(callback){
    console.log('Método getFunds implementado');

    this.client.get('funds',(err, data)=>{
      const funds=this.crypto.descifrar(data.toString());
      const fundsJson = JSON.parse(funds);
      if(callback) callback(err,fundsJson.data);
    });
  }

  setHistorical(dataHistorical,callback){
    console.log('Método setHistorical implementado');

    const data ={
      //guardamos un objeto JSON y dentro guardamos el tributo data con el array de monedas
      data : dataHistorical
    }

    this.compresion.comprimir(JSON.stringify(data),(err,data)=>{
      if (err) return console.log(err);
      this.client.set('historical',data);
    })
  }

  getHistorical(callback){
    console.log('Método getHistorical implementado');
    this.client.get('historical',(err, data)=>{
      this.compresion.desComprimir(data.toString(),(historical)=>{
        const historicalJson = JSON.parse(historical);
        if(callback) callback(err,historicalJson.data);
    });
  })
}

close(){
    if(this.client.connected) this.client.quit();
  }
}

class DatabaseMongo extends DatabaseBase{
  constructor(conf){
    super(conf); //al crear un objeto de esta clase llama tambien al constructor de la clase que está después de extends
  }
}

class DatabasePromise{
  constructor(c){
    let conf = (c) ? c: new Configuracion('conf.json');
    //let conf = new Configuracion();
    let tipo_almacenamiento=conf.get(CONSTANTES_CONF.site_sistema_almacenamiento);
    //this.db = undefined; //en función del tipo de almacenamiento almacenará una clase u otra
    console.log(tipo_almacenamiento);

    if(tipo_almacenamiento==="fichero"){
      this.db = new DatabaseFile(conf);
    }
    else if(tipo_almacenamiento==="redis"){
      this.db = new DatabaseRedis(conf);
    }//mongo
    else{
      this.db = new DatabaseMongo(conf);
    }
  }

  getDB(){
    return this.db;
  }
}

module.exports = { DatabasePromise }