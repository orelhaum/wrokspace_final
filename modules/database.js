const { Configuracion } = require('./configuracion');
const { DatabaseRedis } = require('./database_redis');
const { DatabaseFile } = require('./database_file');
const { DatabaseMongo } = require('./database_mongo');
const { DatabaseMysql } = require('./database_mysql');

const { CONSTANTES_CONF } = require('./constantes');

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
    } else if (tipo_almacenamiento === "mysql") {
      this.db = new DatabaseMysql(conf);
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