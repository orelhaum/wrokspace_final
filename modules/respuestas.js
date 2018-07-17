class Respuestas{
  static ok(data){
    const response= {
      ok:true,
      code:0,
      msg:""
    }
    response.data=(data) ? data : [];
    return response;
  }
  
  static error(msg,code){
    const response= {
      ok:false,
      data:[]
    }
    response.code=(code) ? code : -1;
    response.msg=(msg) ? msg : "";
    return response;
  }
}

module.exports = { Respuestas }