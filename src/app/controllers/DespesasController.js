
import jwtController from './jwtController.js';
import DespesasRepository from '../repositories/DespesasRepository.js';

class DespesasController {

    async listaCategorias(req, res) {
        // ####### Validacao do JWT #######
        var wOjJWT = jwtController.validar(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1]
        // ####### Validacao do JWT #######

        var wArray = [];
        const row = await DespesasRepository.findAllCategorias()
        var length = Object.keys(row).length;
        if (length > 0) {
            var wArrayData = [];
            for (var i = 0; i < length; i++) {
                var data = {
                    ID: row[i].id,
                    INDREGISTRO: row[i].ind_transacao,
                    DESCRICAO: row[i].descricao
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

    async listaPagamentos(req, res) {

        // ####### Validacao do JWT #######
        var wOjJWT = jwtController.validar(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1]
        // ####### Validacao do JWT #######

        var wArray = [];
        const row = await DespesasRepository.findAllPagamentos()
        var length = Object.keys(row).length;
        if (length > 0) {
            var wArrayData = [];
            for (var i = 0; i < length; i++) {
                var data = {
                    ID: row[i].id,
                    BAIXAR: row[i].debita_na_hora,
                    INDREGISTRO: row[i].ind_transacao,
                    DESCRICAO: row[i].descricao
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

    async listaMovimentos(req, res) {

        // ####### Validacao do JWT #######
        var wOjJWT = jwtController.validar(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1]
        // ####### Validacao do JWT #######


        const corpo = req.query;
        var wArray = [];
        const row = await DespesasRepository.findAllMovimentos(codempresa, corpo.DATAINI, corpo.DATAFIM)
        var length = Object.keys(row).length;
        if (length > 0) {
            var wArrayData = [];
            for (var i = 0; i < length; i++) {
                var data = {
                    ID: row[i].id,
                    CATEGORIA: row[i].descategoria,
                    TRANSACAO: row[i].ind_transacao,
                    PAGAMENTO: row[i].Pagamento,
                    DEBITA: row[i].debita_na_hora,
                    DATA: row[i].data_registro,
                    DESCRICAO: row[i].descricao,
                    VALOR: row[i].val_registro,
                    SITUACAO: row[i].ind_situacao
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
        // console.log(JSON.stringify(wArray));
        res.json(wArray)

    }

    async listTotais(req, res) {

        // ####### Validacao do JWT #######
        var wOjJWT = jwtController.validar(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1]
        // ####### Validacao do JWT #######
        console.log('oi')

        var wArray = [];
        const row = await DespesasRepository.findTotais(codempresa)
        var length = Object.keys(row).length;
        if (length > 0) {
            var wArrayData = [];
            for (var i = 0; i < length; i++) {
                var data = {
                    ENTRADAS: row[i].totalEntrada,
                    SAIDAS: row[i].totalSaida
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
        // console.log('Total: ' + JSON.stringify(wArray));
        res.json(wArray)

    }

    async gravaMovimento(req, res) {
        // ####### Validacao do JWT #######
        var wOjJWT = jwtController.validar(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1]
        // ####### Validacao do JWT #######

        const corpo = req.body;
        var wArray = [];
        // console.log(corpo);

        var length = Object.keys(corpo).length;
        var wArrayData = []
        for (var i = 0; i < length; i++) {

            var data = {
                empresa: codempresa,
                mobile: corpo[i].id,
                data_registro: corpo[i].data.split("/").reverse().join("-"),
                categoria: corpo[i].categoria,
                pagamento: corpo[i].pagamento,
                data_pagamento: corpo[i].databaixa.split("/").reverse().join("-"),
                descricao: corpo[i].descricao,
                valor: corpo[i].valor,
                situacao: corpo[i].situacao
            }
            // console.log(data);
            try {
                var registro = corpo[i].id
                await DespesasRepository.create(data).then((resposta) => {
                    var data = {
                        id: registro,
                        idmov: resposta.insertId
                    }
                    wArrayData.push(data)
                    // console.log(wArrayData)
                });
                // console.log(row)
            } catch (error) {

            }

        }
        wArray.push({
            STATUS: true,
            RECORDS: 0,
            DATA: wArrayData
        });


        res.json(wArray);
    }

}

// padrão Singleton
export default new DespesasController()


