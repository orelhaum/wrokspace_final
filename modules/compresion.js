const zlib = require('zlib');


class Compresion{
  constructor(){
    //this.zlib = new ZLIB;
  }
  
  comprimir(data,callback){

    zlib.deflate(data, (err, buffer) => {
      if (err) {
        callback(err);
      }
      else callback(undefined,buffer.toString('base64'));
      
      console.log(buffer.toString('base64')); // 'eJzT0yMAAGTvBe8='
    });
  }

  desComprimir(data,callback){
    const buffer = Buffer.from(data, 'base64');
    zlib.unzip(buffer, (err, buffer) => {
      if (err)callback(err);
      else  callback(buffer.toString());
    });
  }
}

module.exports = { Compresion }