// import { Console } from 'console';
import PortalRepository from '../repositories/PortalRepository.js';
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

        const objPremios = await PortalRepository.findPontosByID(id);
        var wArrayData = [];
        for (var i = 0; i < objPremios.length; i++) {

            var data = {
                codusuario: objPremios[i].codusuario,
                pontos: objPremios[i].numpontos
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
                texto: objPremios[i].texto,
                points: objPremios[i].pontos,
                // picture: objPremios[i].picture,
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

    async storeArquitetos(req, res) {
        // ####### Validacao do JWT #######
        var wOjJWT = jwtController.validar(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1]
        // ####### Validacao do JWT #######

        const corpo = req.body;
        var wArray = {
            STATUS: false,
            RECORDS: 0,
            DATA: []
        };


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
                // await InstalacoesRepository.updateInstalacaoAgenda(corpo[i]).then((resposta) => {
                //     InstalacoesRepository.removeServico(corpo[i]);
                //     for (var x = 0; x < corpo[i].SERVICOS.length; x++) {
                //         try {
                //             InstalacoesRepository.createinstalacoesServico(corpo[i], corpo[i].SERVICOS[x])
                //         } catch (error) {
                //             continue;
                //         }
                //     }

                //     var data = {
                //         IDINT: corpo[i].IDINT,
                //         IDPROPOSTA: corpo[i].IDPROPOSTA,
                //         SEQINSTALL: corpo[i].SEQINSTALL,
                //         ACAO: 'UPD'
                //     }
                //     wArrayData.push(data)
                // });
            }
        }

        wArray = {
            STATUS: true,
            RECORDS: wArrayData.length,
            DATA: wArrayData
        };


        res.json(wArray);
    }

    async storeInstalacaoFoto(req, res) {
        // ####### Validacao do JWT #######
        var wOjJWT = jwtController.validar(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1]
        // ####### Validacao do JWT #######

        const corpo = req.body;
        var wArray = [];


        var length = Object.keys(corpo).length;

        // console.log("R: " + length)
        var wArrayData = []
        for (var i = 0; i < length; i++) {

            switch (corpo[i].INDSYNC) {
                case "S":
                    corpo[i].FOTO = await auxiliares.resizeBase64({ base64Image: corpo[i].FOTO, maxWidth: 800 });
                    InstalacoesRepository.createinstalacoesServicoFoto(corpo[i]);
                    break;
                case "D":
                    InstalacoesRepository.removeServicoFoto(corpo[i]);
                    break;
            }

        }

        wArray.push({
            STATUS: true,
            RECORDS: length,
            DATA: wArrayData
        });

        res.json(wArray);
    }

    async updateInstalacao(req, res) {
        // ####### Validacao do JWT #######
        var wOjJWT = jwtController.validar(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1]
        // ####### Validacao do JWT #######

        const corpo = req.body;
        var wArray = [];

        var length = Object.keys(corpo).length;
        var wArrayData = []
        for (var i = 0; i < length; i++) {

            switch (corpo[i].INDACAO) {
                case "I":
                    InstalacoesRepository.updateInstalacao(corpo[i]);
                    break;
                case "S":
                    InstalacoesRepository.updateInstalacaoServico(corpo[i]);
                    break;
            }
        }

        wArray.push({
            STATUS: true,
            RECORDS: length,
            DATA: wArrayData
        });

        res.json(wArray);
    }

}

export default new PortalController()
