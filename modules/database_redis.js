const redis = require('redis');
const { DatabaseBase } = require('./database_base');

const { Configuracion } = require('./configuracion');
const { CONSTANTES_CONF } = require('./constantes');


class DatabaseRedis extends DatabaseBase {
  constructor(conf) {
    super(conf); //al crear un objeto de esta clase llama tambien al constructor de la clase que está después de extends

    const options = {
      host: conf.get(CONSTANTES_CONF.database_redis_host),
      puerto: conf.get(CONSTANTES_CONF.database_redis_port)
    }
    const password= conf.get(CONSTANTES_CONF.database_redis_password);
    
    options.password=(password) ? password:undefined;

    this.client = redis.createClient(options);
    this.client_1 = redis.createClient(options);
    this.client_1.select(1);
  }

  setCoins(coins, callback) {
    this.client.del('coins');
    this.client.rpush('coins', coins);
    if (callback) callback();
  }

  getCoins(callback) {
    console.log('Método getCoins implementado');

    this.client.llen('coins', (err, longitud) => {
      console.log(longitud);
      if ((err) && (callback)) return callback(err);

      this.client.lrange('coins', 0, longitud, (err, data) => {
        if ((err) && (callback)) return callback(err);
        if (callback) callback(err, data);
      })
    })

  }

  setCoin(coin, dataCoin, callback) {
    this.client.hmset(coin, dataCoin);
    if (callback) callback();
  }

  getCoin(coin, callback) {
    this.client.hgetall(coin.toUpperCase(), (err, data) => {
      if ((err) && (callback)) return callback(err);
      callback(err, data);
    })
  }

  setFunds(dataFunds, callback) {
    console.log('Método setFunds implementado');
    //console.log(dataFunds);
    const data = {
      //guardamos un objeto JSON y dentro guardamos el tributo data con el array de monedas
      data: dataFunds
    }
    //encriptamos para guardarlo bien
    const dataFundsCifrados = this.crypto.cifrar(JSON.stringify(data));

    this.client.set('funds', dataFundsCifrados);
    if (callback) callback();
  }

  getFunds(callback) {
    console.log('Método getFunds implementado');

    this.client.get('funds', (err, data) => {
      const funds = this.crypto.descifrar(data.toString());
      const fundsJson = JSON.parse(funds);
      if (callback) callback(err, fundsJson.data);
    });
  }

  setHistorical(coin, dataHistorical, callback) {
    console.log('Método setHistorical implementado');

    this.client.rpush(`${coin}_historical`, JSON.stringify(dataHistorical));
    if (callback) callback();
  }

  getHistorical(coin, callback) {
    console.log('Método getHistorical implementado');

    this.client.llen(`${coin.toUpperCase()}_historical`, (err, longitud) => {
      //console.log(longitud);
      if ((err) && (callback)) return callback(err);

      this.client.lrange(`${coin.toUpperCase()}_historical`, 0, longitud, (err, datos) => {
        if ((err) && (callback)) return callback(err);
        
        let datosParseados=[];
        for (const dato of datos){
          datosParseados.push(JSON.parse(dato));
        }
        if (callback) callback(err, datosParseados);
      })
    })
  }

  lenHistorical(coin, callback) {
    //console.log('Método lenHistorical implementado');

    this.client.llen(`${coin.toUpperCase()}_historical`, (err, longitud) => {
      console.log(longitud);
      if ((err) && (callback)) return callback(err);
      if(callback) callback(err,longitud);
    })
  }

  lpopHistorical(coin, callback) {
    //console.log('Método lpopHistorical implementado');
    this.client.lpop(`${coin.toUpperCase()}_historical`,(err,data)=>{
      if ((err) && (callback)) return callback(err);
      if (callback) callback(data); 
    });
  }
  rpushHistorical(coin,data, callback) {
    //console.log('Método rpushHistorical implementado');
    this.client.rpush(`${coin.toUpperCase()}_historical`,JSON.stringify(data),(err)=>{
      if (callback) callback(err); 
    });
  }

  getTransaction(username,callback){
    console.log('Método getTransaction no implementado');
  }
  setTransaction(username,transactions,callback){
    console.log('Método setTransaction no implementado');
  }
  getMessages(username,callback){
    console.log('Método getMessages no implementado');
  }
  setMessages(username,messages,callback){
    console.log('Método setMessages no implementado');
  }

  createUser(user,callback){
    console.log('Método createUser implementado');
    this.client_1.hmset(user.usuario,user,(err)=>{
      if(callback) callback();
    });

  }

  getUsers(callback){
    console.log('Método getUsers implementado');
    this.client_1.keys('*',(err,keys)=>{
    if ((err) && (callback)) return callback(err);
    let users=[];
    for (let key of keys){
        this.client_1.hgetall(key,(err,user)=>{
          users.push(user);
          if (users.length === keys.length){
            callback(err,users);
          }
        });
      }
    });
  }

  getUser(username,callback){
    console.log('Método getUser implementado');
    this.client_1.hgetall(username,(err,user)=>{
      if ((err) && (callback)) return callback(err);
      callback(err,user);
    })
  }
  deleteUser(username,callback){
    console.log('Método deleteUser implementado');
    this.client_1.del(username);
    callback();
  }

  close(callback) {
    if (this.client.connected) this.client.quit();
    if(callback) callback();
  }
}

class Database {
  constructor(c) {
    let conf = (c) ? c : new Configuracion('conf.json');
    //let conf = new Configuracion();
    let tipo_almacenamiento = conf.get(CONSTANTES_CONF.site_sistema_almacenamiento);
    //this.db = undefined; //en función del tipo de almacenamiento almacenará una clase u otra
    console.log(tipo_almacenamiento);

    if (tipo_almacenamiento === "fichero") {
      this.db = new DatabaseFile(conf);
    } else if (tipo_almacenamiento === "redis") {
      this.db = new DatabaseRedis(conf);
    } //mongo
    else {
      this.db = new DatabaseMongo(conf);
    }
  }

  getDb() {
    return this.db;
  }
}

module.exports = { DatabaseRedis }