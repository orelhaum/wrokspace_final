let { Configuracion } = require('./configuracion');

const CONSTANTES_CONF = {
  directorio_almacenamiento:"directorio_almacenamiento",
  site_sistema_almacenamiento: "site_sistema_almacenamiento",
  servicio_web_remoto_token: "servicio_remoto_token",
  servicio_web_remoto_username: "servicio_remoto_username",
  servicio_web_remoto_protocolo: "servicio_web_remoto_protocolo",
  servicio_web_remoto_host: "servicio_web_remoto_host",
  servicio_web_remoto_port: "servicio_web_remoto_port",
  update_coins_periodic_time: "update_coins_periodic_time",
  criptografia_clave:"criptografia_clave",
  criptografia_algoritmo:"criptografia_algoritmo",

  database_redis_host: "database_redis_host",
  database_redis_port: "database_redis_port",
  database_redis_password: "database_redis_password",

  update_coins_max_time_historical:"update_coins_max_time_historical",

  database_mongo_host:"database_mongo_host",
  database_mongo_port:  "database_mongo_port",
  database_mongo_user:"database_mongo_user",
  database_mongo_password:"database_mongo_password",
  database_mongo_name:"database_mongo_name",
  database_mongo_dbname:"database_mongo_dbname",

  database_mysql_host : "database_mysql_host",
  database_mysql_port : "database_mysql_port",
  database_mysql_user : "database_mysql_user",
  database_mysql_password : "database_mysql_password",
  database_mysql_database : "database_mysql_database",

  email_account:"email_account",
  email_password:"email_password",
  email_server:"email_server"
}

conf = new Configuracion('conf.json');

let domain = `${conf.get(CONSTANTES_CONF.servicio_web_remoto_protocolo)}${conf.get(CONSTANTES_CONF.servicio_web_remoto_host)}:${conf.get(CONSTANTES_CONF.servicio_web_remoto_port)}`;

const CONSTANTES_URL = {
  /***************dominio y rutas*******/
  //coins
  urlCoins: `${domain}/coins`,
  methodCoins: "GET",

  //market
  urlMarket: `${domain}/market/:coin`,
  methodMarket: "GET",

  //historical
  urlHistorical: `${domain}/historical/:coin/:hours`,
  methodHistorical: "GET",

  //prediction
  urlPrediction: `${domain}/prediction/:hours`,
  methodPrediction: "GET",

  //info_user
  urlInfoUser: `${domain}/info_users`,
  methodInfoUser: "GET",

  //funds
  urlFunds: `${domain}/funds`,
  methodFunds: "POST",

  //buy
  urlBuy: `${domain}/buy/:coin/:cantidad`,
  methodBuy: "POST",

  //sell
  urlSell: `${domain}/sell/:coin/:cantidad`,
  methodSell: "POST",

  //msg list
  urlList: `${domain}/msg/list`,
  methodList: "POST",

  //msg send
  urlSend: `${domain}/msg/send`,
  methodSend: "POST",

  //msg read
  urlRead: `${domain}/msg/read/:idMessage`,
  methodRead: "POST",

  //msg remove
  urlMsgRemove: `${domain}/msg/remove/:idMessage`,
  methodMsgRemove: "POST",

  //msg remove_all
  urlMsgRemoveAll: `${domain}/msg/remove_all`,
  methodMsgRemoveAll: "POST"
}

module.exports = { CONSTANTES_URL,CONSTANTES_CONF };