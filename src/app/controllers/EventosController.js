// import { Console } from 'console';
import EventosRepository from '../repositories/EventosRepository.js';
import jwtController from './jwtController.js';


class EventosController {


    async showEventos(req, res) {
        // ####### Validacao do JWT #######
		var wOjJWT = jwtController.validarJWT(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1]
        // ####### Validacao do JWT #######

        var wArray = [];
        const row = await EventosRepository.findAll(codempresa, id)
        var length = Object.keys(row).length;
        if (length > 0) {
            var wArrayData = [];
            for (var i = 0; i < length; i++) {
                var wArrayLead = [];
                const rowLead = await EventosRepository.findLeadAll(codempresa, id, row[i].codEvento)
                var lengthLead = Object.keys(rowLead).length;
                if (lengthLead > 0) {
                    var wArrayDataLEad = [];
                    for (var x = 0; x < lengthLead; x++) {
                        var data = {
                            IDAPI: rowLead[x].IDAPI,
                            IDEVENTO: rowLead[x].IDEVENTO,
                            IDMOBILE: rowLead[x].IDMOBILE,
                            DATREGISTRO: rowLead[x].datRegistro,
                            NOMLEAD: rowLead[x].nomLead,
                            EMAIL: rowLead[x].email,
                            TELEFONE: rowLead[x].numTelefone,
                            CODCIDADE: rowLead[x].codCidade,
                            CIDADE: rowLead[x].cidade,
                            UF: rowLead[x].uf,
                            ENDERECO: rowLead[x].nomEndereco,
                            BAIRRO: rowLead[x].nomBairro,
                            IDPROFISSAO: rowLead[x].codProfissao,
                            PROFISSAO: rowLead[x].Profissao,
                            IDGESTOR: rowLead[x].idGestor,
                            INDAMOSTRA: rowLead[x].indAmostra,
                            OBS: rowLead[x].ObsLead,
                            LATITUDE: rowLead[x].latitude,
                            LONGITUDE: rowLead[x].longitude,
                            INDSITUACAO: rowLead[x].indSituacao
                        }
                        wArrayDataLEad.push(data);
                    }
                    wArrayLead.push({
                        STATUS: true,
                        RECORDS: lengthLead,
                        DATA: wArrayDataLEad
                    });
                } else {
                    wArrayLead.push({
                        STATUS: false,
                        RECORDS: 0,
                        DATA: []
                    });
                }

                var data = {
                    IDAPI: row[i].codEvento,
                    IDFLUIG: row[i].idFluig,
                    DOCUMENTID: row[i].documentID,
                    EVENTO: row[i].nomEvento,
                    DATINICIO: row[i].datInico,
                    DATFIM: row[i].datFim,
                    CODCIDADE: row[i].codCidade,
                    CIDADE: row[i].cidade,
                    UF: row[i].uf,
                    ENDERECO: row[i].nomEndereco,
                    BAIRRO: row[i].nomBairro,
                    LATITUDE: row[i].latitude,
                    LONGITUDE: row[i].longitude,
                    INDSITUACAO: row[i].indSituacao,
                    LEADS: wArrayLead
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

    async storeEventos(req, res) {
        // ####### Validacao do JWT #######
		var wOjJWT = jwtController.validarJWT(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1]
        // ####### Validacao do JWT #######

        const corpo = req.body;
        var wArray = [];

        var length = Object.keys(corpo).length;
        var wArrayData = []
        for (var i = 0; i < length; i++) {

            try {
                var registro = null
                await EventosRepository.create(codempresa, corpo[i]).then((resposta) => {
                    // console.log(resposta)
                    if (resposta.insertId > 0) {
                        var lengthUser = Object.keys(corpo[i].USUARIOS).length;
                        for (var x = 0; x < lengthUser; x++) {
                            try {
                                EventosRepository.EventoUsuarios(codempresa, resposta.insertId, corpo[i].USUARIOS[x])
                            } catch (error) {

                            }
                        }
                    }
                    var data = {
                        codevento: resposta.insertId
                    }
                    wArrayData.push(data)
                });

            } catch (error) {
            }

        }
        wArray.push({
            STATUS: true,
            RECORDS: wArrayData.length,
            DATA: wArrayData
        });


        res.json(wArray);
    }

    async storeLeadEvento(req, res) {
        // ####### Validacao do JWT #######
		var wOjJWT = jwtController.validarJWT(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1]
        // ####### Validacao do JWT #######

        const corpo = req.body;
        var wArray = [];

        var length = Object.keys(corpo).length;
        var wArrayData = []
        for (var i = 0; i < length; i++) {

            try {
                var registro = null
                await EventosRepository.EventoLeads(codempresa, id, corpo[i]).then((resposta) => {
                    var data = {
                        codlead: resposta.insertId
                    }
                    wArrayData.push(data)
                });

            } catch (error) {
            }

        }
        wArray.push({
            STATUS: true,
            RECORDS: wArrayData.length,
            DATA: wArrayData
        });


        res.json(wArray);
    }

}

// padrão Singleton
export default new EventosController()


