
const { Criptografia } = require('./criptografia');
const { Compresion } = require('./compresion');


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

module.exports = { DatabaseBase }