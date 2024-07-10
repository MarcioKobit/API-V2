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
// router.get('/login', UsuarioController.login);
router.post('/login', UsuarioController.login)


// router.post('/02/arquitetos', PortalController.storeArquitetos)

var wEndpoints = await EndPointController.listar();
// console.log(JSON.stringify(wEndpoints))
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


// // ################### Usuarios #############
// router.get('/usuarios', UsuarioController.index)


// // ################### Eventos #############
// router.get('/eventos', EventosController.showEventos)

// // ################### Instalações #############
// router.get('/v2/instalacoes', InstalacoesController.showInstalacoes)

// // ################### Pormade Movel #############
// router.get('/viagem', MovelController.showViagem)
// router.get('/tipoLocal', MovelController.showTipoLocal)
// router.get('/cidades', MovelController.showCidades)
// router.get('/profissoes', MovelController.showProfissoes)
// router.get('/vendedores', MovelController.showVendedores)
// router.get('/pipe', MovelController.showPipe)
// router.get('/retornoFluig', MovelController.showRetornoFluig)



// //POST

// // ################### Usuarios #############
// router.post('/usuarios', UsuarioController.store)


// // ################### Eventos #############
// router.post('/eventos', EventosController.storeEventos)
// router.post('/leadevento', EventosController.storeLeadEvento)


// // ################### Instalações #############
// router.post('/instalacoes', InstalacoesController.storeInstalacoes)
// router.post('/servicofoto', InstalacoesController.storeInstalacaoFoto)
// router.post('/updateinstalacao', InstalacoesController.updateInstalacao)


// // ################### Pormade Movel #############
// router.post('/retornoFluig', MovelController.storeRetornoFluig)
// router.post('/tipoLocal', MovelController.storeTipoLocal)
// router.post('/tipoVisita', MovelController.storeTipoVisita)
// router.post('/cidades', MovelController.storeCidades)
// router.post('/vendedores', MovelController.storeVendedores)

// router.post('/visitas', MovelController.storeVisitas)



export default router
