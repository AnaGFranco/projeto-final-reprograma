const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RemediosSchema = new Schema({
  _id: {type: mongoose.Schema.Types.ObjectId, auto: true, required: true },
  nome: { type: String, required: true },
  // foto: { type: String },
  dataInicial: {type: Date},
  dataFinal: {type: Date},
  intervalo: {type: Number},
  ultimoConsumo: {type: Date},
})

const remediosModel = mongoose.model('remedios', RemediosSchema);

module.exports = { remediosModel, RemediosSchema };
