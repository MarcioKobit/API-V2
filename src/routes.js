import { Router } from 'express'
import UsuarioController from './app/controllers/UsuarioController.js'
import EventosController from './app/controllers/EventosController.js'
import InstalacoesController from './app/controllers/InstalacoesController.js'
import MovelController from './app/controllers/MovelController.js'
import PortalController from './app/controllers/PortalController.js'

import EndPointController from './app/controllers/EndpointsContoller.js'


const router = Router()

// ROTAS
router.get('/', UsuarioController.home)
router.post('/login', UsuarioController.login)


var wEndpoints = await EndPointController.listar();
for (var i = 0; i < wEndpoints[0].RECORDS; i++) {
    switch (wEndpoints[0].DATA[i].method) {
        case "GET":
            router.get(wEndpoints[0].DATA[i].rota + wEndpoints[0].DATA[i].endpoint, eval(wEndpoints[0].DATA[i].endfunction));
            break;
        case "POST":
            router.post(wEndpoints[0].DATA[i].rota + wEndpoints[0].DATA[i].endpoint, eval(wEndpoints[0].DATA[i].endfunction));
            break;
        case "PUT":
            router.put(wEndpoints[0].DATA[i].rota + wEndpoints[0].DATA[i].endpoint, eval(wEndpoints[0].DATA[i].endfunction));
            break;
    }
}

export default router
