// import { Console } from 'console';
import InstalacoesRepository from '../repositories/InstalacoesRepository.js';
import jwtController from './jwtController.js';
import auxiliares from '../components/auxiliares.js';


class InstalacoesController {


    async showInstalacoes(req, res) {
        // ####### Validacao do JWT #######
        var wOjJWT = jwtController.validar(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1]
        // ####### Validacao do JWT #######

        var wArray = [];
        const row = await InstalacoesRepository.findAll(id)
        var length = Object.keys(row).length;
        if (length > 0) {
            var wArrayData = [];
            for (var i = 0; i < length; i++) {
                var wArrayServ = [];
                const rowServ = await InstalacoesRepository.findServicoAll(id, row[i].idInstalacao)
                var lengthServ = Object.keys(rowServ).length;
                if (lengthServ > 0) {
                    var wArrayDataServ = [];
                    for (var x = 0; x < lengthServ; x++) {

                        var wArrayServFoto = [];
                        const rowServFoto = await InstalacoesRepository.findServicoFotoAll(row[i].idInstalacao, rowServ[x].id)
                        var lengthServFoto = Object.keys(rowServFoto).length;
                        if (lengthServFoto > 0) {
                            var wArrayDataServFoto = [];
                            for (var y = 0; y < lengthServFoto; y++) {
                                var data = {
                                    ID: rowServFoto[y].id,
                                    NOMARQUIVO: rowServFoto[y].nomArquivo,
                                    FOTO: rowServFoto[y].foto
                                }
                                wArrayDataServFoto.push(data);
                            }
                            wArrayServFoto.push({
                                STATUS: true,
                                RECORDS: lengthServ,
                                DATA: wArrayDataServFoto
                            });
                        } else {
                            wArrayServFoto.push({
                                STATUS: false,
                                RECORDS: 0,
                                DATA: []
                            });
                        }

                        var data = {
                            ID: rowServ[x].id,
                            IDINSTALACAO: rowServ[x].idInstalacao,
                            DESCRICAO: rowServ[x].descricao,
                            INDSITUACAO: rowServ[x].indSituacao,
                            FOTOS: wArrayServFoto
                        }
                        wArrayDataServ.push(data);
                    }
                    wArrayServ.push({
                        STATUS: true,
                        RECORDS: lengthServ,
                        DATA: wArrayDataServ
                    });
                } else {
                    wArrayServ.push({
                        STATUS: false,
                        RECORDS: 0,
                        DATA: []
                    });
                }

                var data = {
                    ID: row[i].idInstalacao,
                    PROPOSTA: row[i].idProposta,
                    ORDERID: row[i].orderid,
                    TELEFONE: row[i].numTelefone,
                    NOME: row[i].nomCliente,
                    ENDERECO: row[i].nomEndereco,
                    BAIRRO: row[i].nombairro,
                    CEP: row[i].numCEP,
                    CIDADE: row[i].nomCidade,
                    UF: row[i].uf,
                    DATAGENDADO: row[i].datAgendado,
                    LATITUDE: row[i].latitudeO,
                    LONGITUDE: row[i].longitudeO,
                    SERVICOS: wArrayServ
                }
                wArrayData.push(data)

            }
            wArray.push({
                STATUS: true,
                RECORDS: length,
                DATA: wArrayData
            });
        } else {
            wArray.push({
                STATUS: false,
                RECORDS: 0,
                DATA: []
            });
        }


        res.json(wArray)
    }

    async listarInstalacoes(req, res) {

        // console.log(req.query.proposta);
        // ####### Validacao do JWT #######
        var wOjJWT = jwtController.validar(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1]
        // ####### Validacao do JWT #######

        const { idproposta, seqinstall, fotos, servico } = req.query;

        // console.log(idproposta);


        // var wArrayData = [];
        // res.json(wArrayData);

        // return false

        var wArray = [];
        wArray.push({
            STATUS: false,
            RECORDS: 0,
            DATA: []
        });

        if (idproposta != undefined && idproposta != '') {

            const objInstalacao = await InstalacoesRepository.findByID(idproposta, seqinstall)
            // var length = Object.keys(objInstalacao).length;
            // if (length > 0) {
            var wArrayData = [];
            for (var i = 0; i < objInstalacao.length; i++) {
                var wArrayDataServ = [];
                if (servico == undefined || servico == '') {
                    const objServ = await InstalacoesRepository.findServicoByID(objInstalacao[i].idInstalacao);
                    for (var x = 0; x < objServ.length; x++) {
                        if (fotos == undefined || fotos == 'S') {

                        }

                        var data = {
                            ID: objServ[x].id,
                            IDINSTALACAO: objServ[x].idInstalacao,
                            IDSEQ: objServ[x].idseq,
                            DESCRICAO: objServ[x].descricao,
                            SITUACAO: objServ[x].indsituacao,
                            FOTOS: []
                        }
                        wArrayDataServ.push(data);
                    };
                }

                var data = {
                    ID: objInstalacao[i].idInstalacao,
                    PROPOSTA: objInstalacao[i].idProposta,
                    ORDERID: objInstalacao[i].orderid,
                    INDSITUACAO: objInstalacao[i].indsituacao,
                    SERVICOS: wArrayDataServ
                }
                wArrayData.push(data);


            }
            if (objInstalacao.length > 0) {
                wArray.length = 0;
                wArray.push({
                    STATUS: true,
                    RECORDS: objInstalacao.length,
                    DATA: wArrayData
                });

            }

            // }

        }

        res.json(wArrayData)
    }

    async storeInstalacoes(req, res) {
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


            if (corpo[i].INDACAO == undefined || corpo[i].INDACAO == 'A') {

                try {
                    await InstalacoesRepository.create(corpo[i]).then((resposta) => {
                        if (resposta.insertId > 0) {
                            // var lengthServ = Object.keys(corpo[i].SERVICOS).length;
                            for (var x = 0; x < corpo[i].SERVICOS.length; x++) {
                                try {
                                    InstalacoesRepository.createinstalacoesServico(corpo[i], corpo[i].SERVICOS[x]);
                                } catch (error) {
                                }
                            }
                        }

                        var data = {
                            IDINT: corpo[i].IDINT,
                            IDPROPOSTA: corpo[i].IDPROPOSTA,
                            SEQINSTALL: corpo[i].SEQINSTALL,
                            ACAO: 'INS'
                        }

                        wArrayData.push(data)
                    });

                } catch (error) {

                    await InstalacoesRepository.updateInstalacaoAgenda(corpo[i]).then((resposta) => {
                        InstalacoesRepository.removeServico(corpo[i]);
                        for (var x = 0; x < corpo[i].SERVICOS.length; x++) {
                            try {
                                InstalacoesRepository.createinstalacoesServico(corpo[i], corpo[i].SERVICOS[x])
                            } catch (error) {
                                continue;
                            }
                        }

                        var data = {
                            IDINT: corpo[i].IDINT,
                            IDPROPOSTA: corpo[i].IDPROPOSTA,
                            SEQINSTALL: corpo[i].SEQINSTALL,
                            ACAO: 'UPD'
                        }

                        wArrayData.push(data)
                    });



                }

            }


        }

        wArray.push({
            STATUS: true,
            RECORDS: wArrayData.length,
            DATA: wArrayData
        });


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

export default new InstalacoesController()
