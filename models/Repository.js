const mongoose = require('mongoose');
const MONGO_URL ="mongodb+srv://ana:ana@cluster0-tairj.mongodb.net/test?retryWrites=true&w=majority";

function connect () {
  mongoose.connect(MONGO_URL,
    { useNewUrlParser: true },
    function (error) {
      if(error) {
        console.error("Ocorreu um erro: ", error)
      } else {
        console.log("Conectado no mongoDB.")
      }
    }
  );
}

module.exports = { connect }
