const mySql = require('mysql');

const { DatabaseBase } = require('./database_base');
const { CONSTANTES_CONF } = require('./constantes');

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

module.exports = { DatabaseMySql }