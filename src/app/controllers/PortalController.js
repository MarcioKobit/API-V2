// import { Console } from 'console';
import PortalRepository from '../repositories/PortalRepository.js';
import UsuarioRepository from '../repositories/UsuarioRepository.js';
import jwtController from './jwtController.js';
import auxiliares from '../components/auxiliares.js';


class PortalController {


    async listarPontos(req, res) {

        // console.log(req);
        // ####### Validacao do JWT #######
        var wOjJWT = jwtController.validar(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1]
        // ####### Validacao do JWT #######

        var wArray = {}
        wArray = {
            STATUS: false,
            RECORDS: 0,
            DATA: []
        };

        // console.log(id)
        const objPremios = await PortalRepository.findPontosByID(id);
        var wArrayData = [];
        for (var i = 0; i < objPremios.length; i++) {

            var data = {
                codusuario: objPremios[i].codusuario != null ? objPremios[i].codusuario : 0,
                pontos: objPremios[i].numpontos != null ? objPremios[i].numpontos : 0
            }

        }
        if (objPremios.length > 0) {
            wArray = {
                STATUS: true,
                RECORDS: objPremios.length,
                DATA: data
            };
        }

        res.json(wArray)
    }

    async listarPremios(req, res) {

        // console.log(req);
        // ####### Validacao do JWT #######
        var wOjJWT = jwtController.validar(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1]
        // ####### Validacao do JWT #######

        const { idpremio, not } = req.query;

        var wArray = {}
        wArray = {
            STATUS: false,
            RECORDS: 0,
            DATA: []
        };

        const objPremios = (idpremio == undefined || idpremio == '') ? await PortalRepository.findAll() : (not == undefined || not == '') ? await PortalRepository.findByID(idpremio) : await PortalRepository.findNotByID(idpremio)
        var wArrayData = [];
        for (var i = 0; i < objPremios.length; i++) {

            const objFotos = await PortalRepository.findFotosByID(objPremios[i].id);
            var wArrayDataFotos = [];
            for (var y = 0; y < objFotos.length; y++) {

                var data = {
                    id: objFotos[y].id,
                    idpremio: objFotos[y].idpremio,
                    foto: objFotos[y].foto
                }
                wArrayDataFotos.push(data);
            }


            var data = {
                id: objPremios[i].id,
                type: objPremios[i].indtipo,
                title: objPremios[i].titulo,
                datainicio: objPremios[i].datainicio,
                datafim: objPremios[i].datafinal,
                texto: objPremios[i].texto,
                points: objPremios[i].pontos,
                photo: wArrayDataFotos
            }
            wArrayData.push(data);


        }
        if (objPremios.length > 0) {
            wArray = {
                STATUS: true,
                RECORDS: objPremios.length,
                DATA: wArrayData
            };

        }

        res.json(wArray)
    }

    async listarExtrato(req, res) {

        // console.log('Listar Extrato');
        // ####### Validacao do JWT #######
        var wOjJWT = jwtController.validar(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1]
        // ####### Validacao do JWT #######

        var wArray = {}
        wArray = {
            STATUS: false,
            RECORDS: 0,
            DATA: []
        };

        const objExtrato = await PortalRepository.findExtratoByID(id);
        var wArrayData = [];
        for (var i = 0; i < objExtrato.length; i++) {

            var data = {
                id: objExtrato[i].idproposta,
                proposta: objExtrato[i].numproposta,
                cliente: objExtrato[i].nomcliente,
                valor: objExtrato[i].valor,
                pontos: objExtrato[i].pontos,
                loja: objExtrato[i].loja,
                datacompra: objExtrato[i].datacompra,
                status: 'green'
            }
            wArrayData.push(data);


        }
        if (objExtrato.length > 0) {
            wArray = {
                STATUS: true,
                RECORDS: objExtrato.length,
                DATA: wArrayData
            };

        }

        res.json(wArray)
    }

    async listarfaq(req, res) {

        // console.log('Listar Extrato');
        // ####### Validacao do JWT #######
        var wOjJWT = jwtController.validar(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1]
        // ####### Validacao do JWT #######

        var wArray = {}
        wArray = {
            STATUS: false,
            RECORDS: 0,
            DATA: []
        };

        const objFaq = await PortalRepository.findFaq();
        var wArrayData = [];
        for (var i = 0; i < objFaq.length; i++) {

            const objFaqItem = await PortalRepository.findFaqItem(objFaq[i].id);
            var wArrayDataItem = [];
            for (var y = 0; y < objFaqItem.length; y++) {

                var data = {
                    id: objFaqItem[y].id,
                    title: objFaqItem[y].titulo,
                    subtitle: objFaqItem[y].titulo,
                    text: objFaqItem[y].texto
                }
                wArrayDataItem.push(data);
            }

            var data = {
                id: objFaq[i].id,
                topic: objFaq[i].topico,
                data: wArrayDataItem
            }
            wArrayData.push(data);


        }
        if (objFaq.length > 0) {
            wArray = {
                STATUS: true,
                RECORDS: objFaq.length,
                DATA: wArrayData
            };

        }

        res.json(wArray)
    }    

    async storeArquitetos(req, res) {

        const jwt = req.headers["authorization"] || req.headers["x-access-token"];
        const objAPI = await UsuarioRepository.validaToken(jwt);

        if (objAPI.length == 0) {
            var wArray = {
                STATUS: false,
                RECORDS: 1,
                DATA: [{
                    MENSAGEM: 'Token Inválido'
                }]
            };
            res.json(wArray);
            return false;
        }

        const corpo = req.body;
        var wArray = {
            STATUS: false,
            RECORDS: 0,
            DATA: []
        };
        // res.json(wArray);
        // return false;
        var wArrayData = []
        for (var i = 0; i < corpo.RECORDS; i++) {
            var wOjSenha = jwtController.encrypt(corpo.DATA[i].SENHA);
            if (!wOjSenha[0]) { return false; };
            corpo.DATA[i].SENHA = wOjSenha[1];

            try {
                await PortalRepository.createArquiteto(corpo.DATA[i]).then((resposta) => {
                    if (resposta.insertId > 0) {

                        var data = {
                            IDINT: resposta.insertId,
                            IDPESSOA: corpo.DATA[i].IDPESSOA,
                            ACAO: 'INS'
                        }

                        wArrayData.push(data);
                    }
                });

            } catch (error) {
                // console.log(error)
                var wIndSituacao = corpo.DATA[i].SITARQ == false || corpo.DATA[i].SITPESSOA == false ? false : true;
                await PortalRepository.updateArquiteto(corpo.DATA[i], wIndSituacao).then((resposta) => {


                    var data = {
                        IDINT: null,
                        IDPESSOA: corpo.DATA[i].IDPESSOA,
                        ACAO: 'UPD'
                    }

                    wArrayData.push(data);

                });

            }
        }

        wArray = {
            STATUS: true,
            RECORDS: wArrayData.length,
            DATA: wArrayData
        };


        res.json(wArray);
    }

    async storeExtratos(req, res) {

        const jwt = req.headers["authorization"] || req.headers["x-access-token"];
        const objAPI = await UsuarioRepository.validaToken(jwt);

        if (objAPI.length == 0) {
            var wArray = {
                STATUS: false,
                RECORDS: 1,
                DATA: [{
                    MENSAGEM: 'Token Inválido'
                }]
            };

            res.json(wArray);
            return false;
        }


        const corpo = req.body;
        var wArray = {
            STATUS: false,
            RECORDS: 0,
            DATA: []
        };

        // return false;
        var wArrayData = []
        for (var i = 0; i < corpo.RECORDS; i++) {
            try {
                await PortalRepository.createExtrato(corpo.DATA[i]).then((resposta) => {
                    if (resposta.insertId > 0) {

                        var data = {
                            IDINT: resposta.insertId,
                            IDPROPOSTA: corpo.DATA[i].IDPROPOSTA,
                            ACAO: 'INS'
                        }

                        wArrayData.push(data);
                    }
                });

            } catch (error) {
                // console.log(error)
            }
        }

        wArray = {
            STATUS: true,
            RECORDS: wArrayData.length,
            DATA: wArrayData
        };


        res.json(wArray);
    }

    async storePremios(req, res) {

        const jwt = req.headers["authorization"] || req.headers["x-access-token"];
        const objAPI = await UsuarioRepository.validaToken(jwt);

        if (objAPI.length == 0) {
            var wArray = {
                STATUS: false,
                RECORDS: 1,
                DATA: [{
                    MENSAGEM: 'Token Inválido'
                }]
            };

            res.json(wArray);
            return false;
        }


        const corpo = req.body;
        var wArray = {
            STATUS: false,
            RECORDS: 0,
            DATA: []
        };

        // return false;
        var wArrayData = []
        for (var i = 0; i < corpo.RECORDS; i++) {
            try {
                await PortalRepository.createPremios(corpo.DATA[i]).then((resposta) => {
                    if (resposta.insertId > 0) {

                        var data = {
                            IDINT: resposta.insertId,
                            IDPROPOSTA: corpo.DATA[i].IDPROPOSTA,
                            ACAO: 'INS'
                        }

                        wArrayData.push(data);

                        for (var x = 0; x < corpo.DATA[i].FOTOS.length; x++) {
                            PortalRepository.createPremiosFotos(resposta.insertId, corpo.DATA[i].FOTOS[x]);
                        }
                    }
                });

            } catch (error) {
                console.log(error)
            }
        }

        wArray = {
            STATUS: true,
            RECORDS: wArrayData.length,
            DATA: wArrayData
        };


        res.json(wArray);
    } 

}

export default new PortalController()
