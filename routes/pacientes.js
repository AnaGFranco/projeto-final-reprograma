require('dotenv-safe').load()
const express = require('express');

const router = express.Router();
const controller = require("../controllers/PacientesController")
const jwt = require('jsonwebtoken')
const SEGREDO = process.env.SEGREDO

const autenticar = (request, response, next) => {
  const authHeader = request.get('authorization')
  let autenticado = false

  if (!authHeader) {
    return response.status(401).send('Você precisa fazer login!')
  }

  const token = authHeader.split(' ')[1]

  jwt.verify(token, SEGREDO, (error, decoded) => {
    if (error) {
      autenticado = false
    } else {
      if (decoded.grupo == 'comum' || decoded.grupo == 'admin') {
        autenticado = true
      } else {
        autenticado = false
      }
    }
  })

  if (!autenticado) {
    return response.status(403).send('Acesso negado.')
  }

  next()
}

const autenticarAdmin = (request, response, next) => {
  const authHeader = request.get('authorization')
  let autenticado = false

  if (!authHeader) {
    return response.status(401).send('Você precisa fazer login!')
  }

  const token = authHeader.split(' ')[1]

  jwt.verify(token, SEGREDO, (error, decoded) => {
    if (error) {
      autenticado = false
    } else {
      if (decoded.grupo == 'admin') {
        autenticado = true
      } else {
        autenticado = false
      }
    }
  })

  if (!autenticado) {
    return response.status(403).send('Acesso negado.')
  }

  next()
}

router.get('', autenticarAdmin, controller.getAll)
router.post('', autenticar, controller.add)
router.post('/admin', controller.addAdmin)
router.get('/:id', autenticar, controller.getById)
router.patch('/:id', autenticar, controller.update)
router.delete('/:id', autenticar, controller.remove)
router.post('/:pacienteId/remedios', autenticar, controller.addRemedio)
router.get('/:id/remedios', autenticar, controller.getRemedios)
router.patch('/:pacienteId/remedios/:remedioId', autenticar, controller.updateRemedio)
router.get('/:pacienteId/remedios/:remedioId', autenticar, controller.getRemedioById)
router.get('/:pacienteId/remediosSemEstoque', autenticar, controller.remediosSemEstoque)
router.get('/:pacienteId/remedios/:remedioId/ProximoConsumo', autenticar, controller.proximoConsumo)
router.patch('/:pacienteId/remedios/:remedioId/consumir', autenticar,controller.consumir)
router.delete('/:pacienteId/remedios/:remedioId', autenticar, controller.removeRemedio)
router.post('/login', controller.login)

module.exports = router



