const mongoose = require('mongoose');
const { RemediosSchema } = require('./RemediosSchema')
const Schema = mongoose.Schema;
const PacientesSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true, required: true },
  nome: { type: String, required: true },
  email: { type: String, required: true },
  foto: { type: String, required: true },
  remedios: [RemediosSchema],
  senha: { type: String, required: true },
  grupo: { type: String }
})

const pacientesModel = mongoose.model('pacientes', PacientesSchema);

module.exports = pacientesModel;
