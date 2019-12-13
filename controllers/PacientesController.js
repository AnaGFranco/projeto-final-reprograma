const { connect } = require('../models/Repository')
const pacientesModel = require('../models/PacientesSchema')
const { remediosModel } = require('../models/RemediosSchema')
const moment = require('moment');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const SEGREDO = 'MIICXAIBAAKBgQCOl54HaBM/WiL/jPPdFGjm9f8VprUst1J+vs7G/YRGRHYLGqt+M/ljAhcROPy3FdaVi2smqqyZhf4d+EZ9lKM6LVed91sxvcyMFEp6x8R2KS9wIzUtJ6r1MAIKd8HURmbaN4V2TV/FLeOUANRCZ+QhYEy+eNbuVIJANYtXBUSn8QIDAQABAoGBAIuVS/MAJGdNuxjiSA5Q3mfIw03UhWIiirTb39rXbNbESbGRB/NguW38K8yGNoya6hY2BkwxowgeLKX11js0d5sSHgEgL+pDQtXshHu7vlYU0ksHwfmD/R8+ZHJH6F6L0vuzs4NoVK/8iQHFLboUjF2sORyuLHbBmFZQWhInet8pAkEA0OlL2uHCYhkNuokJ9H+OnJEqKS2BtYSkH3Hrh2opZg2HtvUtXEIxzmj/95CzxMXQtNJhQMK3ekvnF3Upcj2avwJBAK67i8OEKM2jerbFKrBqr6/kUkZeyHLA8I4L2C3/3nKPGUj/GAc2xxuK1XxnpC0e3Wqz5OMwzkWU4Ynblsdq2U8CQHu9U6LICbzVHh6YwP7C9xOhoBlXzPZZJGVDssA4j2DVLsednUqCIsIhy0s1uGUazi3sVpJnQwn7H1vzl6ME/j0CQAT7qj+4LCW5LM27j70aPcppW4NQPq0vHW0fn1moe2KO/CydwcSq5kC909rJZeA3ih755GQqRyeq2EfDMGidfncCQD770Za6sJP1/i1vcdoWuWYnhpiU8TNKjFb2vJEN598amcyJV9PlAAdEkszh6EDA76t6/yT6NoUn/y9x4YskzQo='

connect()


const getAll = (request, response) => {
  pacientesModel.find((error, pacientes) => {
    if (error) {
      return response.status(500).send(error)
    }

    return response.status(200).send(pacientes)
  })
}

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

const updateRemedio = (request, response) => {
  const pacienteId = request.params.pacienteId
  const remedioId = request.params.remedioId
  const options = { new: true }

  pacientesModel.findOneAndUpdate(
    { _id: pacienteId, 'remedios._id': remedioId },
    {
      $set: {
        'remedios.$.nome': request.body.nome,
        'remedios.$.foto': request.body.foto
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

const getRemedioById = async (request, response) => {
  const pacienteId = request.params.pacienteId
  const remedioId = request.params.remedioId
  const paciente = await pacientesModel.findById(pacienteId)
  const remedio = paciente.remedios.find(remedio => remedio._id == remedioId)

  return response.status(200).send(remedio)
}

// const proximoConsumo = async (request, response) => {
//   const pacienteId = request.params.pacienteId
//   const remedioId = request.params.remedioId
//   const paciente = await pacientesModel.findById(pacienteId)
//   const remedio = paciente.remedios.find(remedio => remedio._id == remedioId)
  
//   //diferença em Horas entre duas datas
//   const intervalo = remedio.intervalo;
//   const datataAtual = new Date();
//   console.log("hora atual: " + datataAtual)
//   const dataUltimoConsumo = remedio.dataUltimoConsumo;
//   console.log("dataUltimoConsumo: " + dataUltimoConsumo)

//   const diferencaEmMilisegundos = datataAtual - dataUltimoConsumo;
//   const diferencaEmHoras = Math.floor((diferencaEmMilisegundos % 86400000) / 3600000)


//   if(diferencaEmHoras > intervalo){
//     return response.status(200).send("Seu remédio está atrasado")
//   } 
//   else if(diferencaEmHoras < intervalo){
//     return response.status(200).send("Ainda não esá na hora de tomar o remédio")
//   } 
//   else{
//     return response.status(200).send("Está na hora de tomar seu remédio")
//   }
// }


const proximoConsumo = async (request, response) => {
    const pacienteId = request.params.pacienteId
    const remedioId = request.params.remedioId
    const paciente = await pacientesModel.findById(pacienteId)
    const remedio = paciente.remedios.find(remedio => remedio._id == remedioId)
    
    //diferença em Horas entre duas datas
    const intervalo = remedio.intervalo;
    const dataAtual = moment().format();
    console.log("hora atual: " + dataAtual)
    const dataUltimoConsumo = moment(remedio.dataUltimoConsumo).format();
    console.log("dataUltimoConsumo: " + dataUltimoConsumo)
  
    // const diferencaEmMilisegundos = datataAtual - dataUltimoConsumo;
    // const diferencaEmHoras = Math.floor((diferencaEmMilisegundos % 86400000) / 3600000)
   
    const diffHora = dataAtual.moment(dataUltimoConsumo,'hours')
  
    if(diffHora > intervalo){
      return response.status(200).send("Seu remédio está atrasado")
    } 
    else if(diffHora < intervalo){
      return response.status(200).send("Ainda não esá na hora de tomar o remédio")
    } 
    else{
      return response.status(200).send("Está na hora de tomar seu remédio")
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
  login
}
