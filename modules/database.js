const redis = require('redis');
const fs = require('fs');
const mySql = require('mysql');
const MongoClient = require('mongodb').MongoClient;

const { Configuracion } = require('./configuracion');
const { Criptografia } = require('./criptografia');
const { Compresion } = require('./compresion');
const { CONSTANTES_CONF } = require('./constantes');


class DatabaseBase {
  constructor(conf) {
    this.crypto = new Criptografia(conf);
    this.compresion = new Compresion();
  }

  setCoins(coins, callback) {
    console.log('Método setCoins no implementado');
  }

  getCoins(callback) {
    console.log('Método getCoins no implementado');
  }

  setCoin(coin, dataCoin, callback) {
    console.log('Método setCoin no implementado');
  }

  getCoin(coin, callback) {
    console.log('Método getCoin no implementado');
  }

  setFunds(funds, callback) {
    console.log('Método setFunds no implementado');
  }

  getFunds(callback) {
    console.log('Método getCoin no implementado');
  }

  setHistorical(data, callback) {
    console.log('Método setHistorical no implementado');
  }

  getHistorical(coin, callback) {
    console.log('Método getHistorical no implementado');
  }

  lenHistorical(coin, callback) {
    console.log('Método lenHistorical no implementado');
  }

  lpopHistorical(data, callback) {
    console.log('Método lpopHistorical no implementado');
  }
  rpushHistorical(data, callback) {
    console.log('Método rpushHistorical no implementado');
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
    console.log('Método createUser no implementado');
  }
  getUsers(callback){
    console.log('Método getUsers no implementado');
  }
  getUser(username,callback){
    console.log('Método getUser no implementado');
  }
  deleteUser(username,callback){
    console.log('Método deleteUser no implementado');
  }
  close() {
    console.log('Método close no implementado');
  }
}

class DatabaseFile extends DatabaseBase {
  constructor(conf) {
    super(conf); //al crear un objeto de esta clase llama tambien al constructor de la clase que está después de extends
    this.directorio = conf.get(CONSTANTES_CONF.directorio_almacenamiento);
  }

  setCoins(coins, callback) {
    //console.log('Método setCoins implementado');
    const data = {
      //guardamos un objeto JSON y dentro guardamso ela tributo data con el array de monedas
      data: coins
    }
    // Asíncrono
    fs.writeFile(`${ this.directorio}coins.dat`, JSON.stringify(data, null, 2), function (err) {
      if (callback) callback(err);
      console.log('ya ha escrito el archivo');
    });
  }

  getCoins(callback) {
    //console.log('Método getCoins implementado');

    fs.readFile(`${ this.directorio}coins.dat`, function (err, data) {
      if ((err) && (callback)) {
        callback(err);
        return;
      } else {
        //los datos son correctos
        const dataJson = JSON.parse(data.toString());
        if (callback) callback(err, dataJson.data);
      }

    });
  }

  setCoin(coin, dataCoin, callback) {
    console.log('Método setCoin implementado');

    //console.log('Método setCoins implementado');
    const data = {
      //guardamos un objeto JSON y dentro guardamso ela tributo data con el array de monedas
      data: dataCoin
    }
    // Asíncrono
    fs.writeFile(`${this.directorio}${coin.toUpperCase()}.dat`, JSON.stringify(data, null, 2), function (err) {
      if (callback) callback(err);
      console.log('ya ha escrito el archivo');
    });
  }

  getCoin(coin, callback) {
    console.log('Método getCoin implementado');
    fs.readFile(`${this.directorio}${coin.toUpperCase()}.dat`, function (err, data) {
      if ((err) && (callback)) {
        callback(err);
        return;
      } else {
        //los datos son correctos
        const dataJson = JSON.parse(data.toString());
        if (callback) callback(err, dataJson.data);
      }
    });
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
    // Asíncrono
    fs.writeFile(`${this.directorio}funds.dat`, dataFundsCifrados, (err) => {
      if (callback) callback(err);
      //console.log('ya ha escrito el archivo');
    });

  }

  getFunds(callback) {
    console.log('Método getFunds implementado');

    fs.readFile(`${this.directorio}funds.dat`, (err, data) => {
      if ((err) && (callback)) {
        callback(err);
        return;
      } else {
        //los datos son correctos
        const funds = this.crypto.descifrar(data.toString());
        const fundsJson = JSON.parse(funds);
        if (callback) callback(err, fundsJson.data);
      }
    });
  }

  setHistorical(dataHistorical, callback) {
    console.log('Método setHistorical implementado');

    const data = {
      //guardamos un objeto JSON y dentro guardamos el tributo data con el array de monedas
      data: dataHistorical
    }

    this.compresion.comprimir(JSON.stringify(data), (err, data) => {
      if (err) return console.log(err);
      // Asíncrono
      fs.writeFile(`${this.directorio}historical.tar.gz`, data, (err) => {
        if (callback) callback(err);
        //console.log('ya ha escrito el archivo');
      });
    })
  }

  getHistorical(callback) {
    console.log('Método getHistorical implementado');

    fs.readFile(`${this.directorio}historical.tar.gz`, (err, data) => {
      if ((err) && (callback)) return callback(err);
      else {
        //los datos son correctos
        this.compresion.desComprimir(data.toString(), () => {
          const historicalJson = JSON.parse(historical);
          if (callback) callback(err, historicalJson.data);
        });
      }
    });

  }
  close() {

  }
}

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

class DatabaseMySql extends DatabaseBase{
  constructor(conf){
    super(conf); //al crear un objeto de esta clase llama tambien al constructor de la clase que está después de extends
    
    const options={
      database: conf.get(CONSTANTES_CONF.database_mysql_database),
      user: conf.get(CONSTANTES_CONF.database_mysql_user),
      password: conf.get(CONSTANTES_CONF.database_mysql_password),
      host: conf.get(CONSTANTES_CONF.database_mysql_host),
      port:conf.get(CONSTANTES_CONF.database_mysql_port),
      debug: false
  }

    this.connection = mySql.createConnection(options);
    this.connection.connect(function(err) {
    if(err) throw err;
    });
  }

  getEmpresas(callback){
    this.connection.query('SELECT * FROM smart2011.m_empresas', function(err, results) {
      if (err) throw err
      callback(err,results);
    })
  }
}

class DatabaseMongo extends DatabaseBase {
  constructor(conf) {
    super(conf); //al crear un objeto de esta clase llama tambien al constructor de la clase que está después de extends
    const database_mongo_host= conf.get(CONSTANTES_CONF.database_mongo_host);
    const database_mongo_port= conf.get(CONSTANTES_CONF.database_mongo_port);
    const database_mongo_user= conf.get(CONSTANTES_CONF.database_mongo_user);
    const database_mongo_password= conf.get(CONSTANTES_CONF.database_mongo_password);
    const database_mongo_name= conf.get(CONSTANTES_CONF.database_mongo_name);
    const database_mongo_dbname= conf.get(CONSTANTES_CONF.database_mongo_dbname);

    //MongoClient=mongodb.MongoClient;

    const url = `mongodb://${database_mongo_host}:${database_mongo_port}`;
    const dbName = database_mongo_dbname;
    
    MongoClient.connect(url, database_mongo_user,database_mongo_password,{ useNewUrlParser: true }, (err, client)=> {
      if (err) return console.log(err);
      this.db = client.db(dbName);
      this.col = this.db.collection(database_mongo_name);
    });
  }

  setCoins(coins, callback) {
    const data={
      coins
    }
    this.col.save(data).catch(console.log('se ha producido un error'));
    if (callback) callback();
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

module.exports = {
  Database
}