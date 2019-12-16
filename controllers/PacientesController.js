const { connect } = require('../models/Repository')
const pacientesModel = require('../models/PacientesSchema')
const { remediosModel } = require('../models/RemediosSchema')
const moment = require('moment');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const SEGREDO = process.env.SEGREDO

connect()

// listar todos os pacientes
const getAll = (request, response) => {
  pacientesModel.find((error, pacientes) => {
    if (error) {
      return response.status(500).send(error)
    }

    return response.status(200).send(pacientes)
  })
}

// listar paciente por id
const getById = (request, response) => {
  const id = request.params.id

  return pacientesModel.findById(id, (error, paciente) => {
    if (error) {
      return response.status(500).send(error)
    }

    if (paciente) {
      return response.status(200).send(paciente)
    }

    return response.status(404).send('Paciente não encontrado.')
  })
}

// adicionar paciente comum
const add = (request, response) => {
  const senhaCriptografada = bcrypt.hashSync(request.body.senha)
  request.body.senha = senhaCriptografada
  request.body.grupo = 'comum'
  const novoPaciente = new pacientesModel(request.body)

  novoPaciente.save((error) => {
    if (error) {
      return response.status(500).send(error)
    }

    return response.status(201).send(novoPaciente)
  })
}

//adicionar administrador
const addAdmin = (request, response) => {
  const senhaCriptografada = bcrypt.hashSync(request.body.senha)
  request.body.senha = senhaCriptografada
  request.body.grupo = 'admin'
  const novoPaciente = new pacientesModel(request.body)

  novoPaciente.save((error) => {
    if (error) {
      return response.status(500).send(error)
    }

    return response.status(201).send(novoPaciente)
  })
}

// remover paciente
const remove = (request, response) => {
  const id = request.params.id

  pacientesModel.findByIdAndDelete(id, (error, paciente) => {
    if (error) {
      return response.status(500).send(error)
    }

    if (paciente) {
      return response.status(200).send(id)
    }

    return response.status(404).send('Paciente não encontrado.')
  })
}

// atualizar paciente
const update = (request, response) => {
  const id = request.params.id
  const pacienteUpdate = request.body
  const options = { new: true }

  pacientesModel.findByIdAndUpdate(
    id,
    pacienteUpdate,
    options,
    (error, paciente) => {
      if (error) {
        return response.status(500).send(error)
      }

      if (paciente) {
        return response.status(200).send(paciente)
      }

      return response.status(404).send('Paciente não encontrado.')
    }
  )
}

// adicionar remedios
const addRemedio = async (request, response) => {
  const pacienteId = request.params.pacienteId
  const remedio = request.body
  const options = { new: true }

  const novoRemedio = new remediosModel(remedio)
  const paciente = await pacientesModel.findById(pacienteId)


  paciente.remedios.push(novoRemedio)
  paciente.save((error) => {
    if (error) {
      return response.status(500).send(error)
    }

    return response.status(201).send(paciente)
  })
}

// listar todos os remedios de um determinado paciente
const getRemedios = async (request, response) => {
  const pacienteId = request.params.id
  await pacientesModel.findById(pacienteId, (error, paciente) => {
    if (error) {
      return response.status(500).send(error)
    }

    if (paciente) {
      return response.status(200).send(paciente.remedios)
    }

    return response.status(404).send('Paciente não encontrado.')
  })
}

// atualizar remedio
const updateRemedio = (request, response) => {
  const pacienteId = request.params.pacienteId
  const remedioId = request.params.remedioId
  const options = { new: true }

  pacientesModel.findOneAndUpdate(
    { _id: pacienteId, 'remedios._id': remedioId },
    {
      $set: {
        'remedios.$.nome': request.body.nome,
        'remedios.$.foto': request.body.foto,
        'remedios.$.dataInicial': request.body.dataInicial,
        'remedios.$.dataFinal': request.body.dataFinal,
        'remedios.$.intervalo': request.body.intervalo,
        'remedios.$.qtdConsumoRemedio':request.body.qtdConsumoRemedio,
        'remedios.$.totalEstoqueRemedio': request.body.totalEstoqueRemedio
      }
    },
    options,
    (error, paciente) => {
      if (error) {
        return response.status(500).send(error)
      }

      if (paciente) {
        return response.status(200).send(paciente)
      }

      return response.status(404).send('Paciente não encontrado.')
    }
  )
}

//  listar um unico remedio
const getRemedioById = async (request, response) => {
  const pacienteId = request.params.pacienteId
  const remedioId = request.params.remedioId
  const paciente = await pacientesModel.findById(pacienteId)
  const remedio = paciente.remedios.find(remedio => remedio._id == remedioId)

  return response.status(200).send(remedio)
}

const removeRemedio = async (request, response) => {
  const pacienteId = request.params.pacienteId
  const remedioId = request.params.remedioId
  
  const paciente = await pacientesModel.findById(pacienteId)
  const remedio = paciente.remedios.find(remedio => remedio._id == remedioId)
  
  paciente.remedios.remove(remedio)
  paciente.save((error) => {
    if (error) {
      return response.status(500).send(error)
    }

    return response.status(200).send("Remedio removido!")
  })

}

// verificar se o remedio está na hora de ser consumido
const proximoConsumo = async (request, response) => {
    const pacienteId = request.params.pacienteId
    const remedioId = request.params.remedioId
    const paciente = await pacientesModel.findById(pacienteId)

    if (!paciente) {
      return response.status(200).send('paciente não encontrado')
    }

    const remedio = paciente.remedios.find(remedio => remedio._id == remedioId)
    
    if (!remedio) {
      return response.status(200).send('remédio não encontrado')
    }

    let intervalo = remedio.intervalo * 60;
    let dataAtual = moment().subtract(1, "hours");
    console.log("hora atual: " + dataAtual.format());
    let dataUltimoConsumo = moment(remedio.ultimoConsumo);
    console.log("dataUltimoConsumo: " + dataUltimoConsumo.format())
  
    let diffHora = dataAtual.diff(dataUltimoConsumo,'minutes')
    console.log(diffHora)
    let proxConsumo = dataUltimoConsumo.add(intervalo, 'minutes').format('HH:mm:ss')

    if(diffHora > intervalo){

      return response.status(200).send({retorno: -1, msg: "Seu remédio está atrasado, você deveria ter tomado: " + proxConsumo})
    } 
    else if(diffHora < intervalo){
      return response.status(200).send({retorno: 0, msg: "Ainda não está na hora de tomar o remédio. Você deve tomar ás: " + proxConsumo })
    } 
    else{
      return response.status(200).send({retorno: 1, msg: "Está na hora de tomar seu remédio"})
    }
}

// verificar se o remedio acabou no estoque
const remediosSemEstoque = async (request, response) => {
  const pacienteId = request.params.pacienteId
  const paciente = await pacientesModel.findById(pacienteId)
  const remedio = paciente.remedios.find(remedio => remedio.totalEstoqueRemedio == 0)
  
  if(remedio){
    return response.status(200).send("Nome: " + remedio.nome + "\n Total em estoque: " + remedio.totalEstoqueRemedio + "\n");
  }
  return response.status(200).send("Todos os remédios possuem itens no estoque");
}
  //  o consumir remedio altera a data do ultimo consumo e o total em estoque
  const consumir = async (request, response) => {
    const pacienteId = request.params.pacienteId
    const remedioId = request.params.remedioId
    const paciente = await pacientesModel.findById(pacienteId)
    const remedio = paciente.remedios.find(remedio => remedio._id == remedioId)

    const options = {new: true}
  
    let novoTotal = remedio.totalEstoqueRemedio - remedio.qtdConsumoRemedio;
    let dataAtual = moment().utcOffset(-3).format()
    console.log(dataAtual);
    console.log(remedio.totalEstoqueRemedio >= remedio.qtdConsumoRemedio);

    if ( remedio.totalEstoqueRemedio >= remedio.qtdConsumoRemedio) {
    pacientesModel.findOneAndUpdate(
      { _id: pacienteId, 'remedios._id': remedioId },
      {
        $set: {
          'remedios.$.ultimoConsumo': dataAtual,
          'remedios.$.totalEstoqueRemedio': novoTotal
        }
      },
      options,
      (error, paciente) => {
        if (error) {
          return response.status(500).send(error)
        }
  
        if (paciente) {
         
            return response.status(200).send(paciente)

        }
        return response.status(404).send('Paciente não encontrado.')
      }
    )}
    else{
      return response.status(404).send('Não há remedios suficiente para consumo')
    }
  }

const login = async (request, response) => {
  const pacienteEncontrado = await pacientesModel.findOne({ email: request.body.email })

  if (pacienteEncontrado) {
    const senhaCorreta = bcrypt.compareSync(request.body.senha, pacienteEncontrado.senha)

    if (senhaCorreta) {
      const token = jwt.sign(
        {
          grupo: pacienteEncontrado.grupo
        },
        SEGREDO,
        { expiresIn: 6000 }
      )

      return response.status(200).send({ token })
    }

    return response.status(401).send('Senha incorreta.')
  }

  return response.status(404).send('Paciente não encontrado.')
}


module.exports = {
  getAll,
  getById,
  add,
  addAdmin,
  remove,
  update,
  addRemedio,
  getRemedios,
  updateRemedio,
  getRemedioById,
  proximoConsumo,
  consumir,
  removeRemedio,
  remediosSemEstoque,
  login
}
