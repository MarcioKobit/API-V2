// import { Console } from 'console';
import EndPointsRepository from '../repositories/EndPointsRepository.js';
import UsuarioRepository from '../repositories/UsuarioRepository.js'

import jwtController from './jwtController.js';


class UsuarioController {

    async home(req, res) {
        var wArray = [];
        wArray.push({
            STATUS: false,
            RECORDS: 0,
            DATA: []
        });

        res.json(wArray)

    }

    async index(req, res) {
        // ####### Validacao do JWT #######
        var wOjJWT = jwtController.validar(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1]
        // ####### Validacao do JWT #######

        var wArray = [];
        const row = await UsuarioRepository.findAll(codempresa)
        var length = Object.keys(row).length;
        if (length > 0) {
            var wArrayData = [];
            for (var i = 0; i < length; i++) {
                var data = {
                    ID: row[i].codusuario,
                    CODEMPRESA: row[i].codempresa,
                    NOME: row[i].nomUsuario,
                    LOGIN: row[i].login,
                    SENHA: row[i].senha
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

    async login(req, res) {

        // console.log(req);

        const corpo = req.body;
        var wArray = {};
        var wOjSenha = jwtController.encrypt(corpo.SENHA);
        if (!wOjSenha[0]) { return false; };
        const row = (corpo.AREA == undefined || corpo.AREA == '' || corpo.AREA == 'APP') ? await UsuarioRepository.login(corpo.LOGIN, wOjSenha[1], corpo.SENHA) : await UsuarioRepository.loginPortal(corpo.LOGIN, wOjSenha[1], corpo.SENHA)

        var length = Object.keys(row).length;
        if (length > 0) {
            var dadosUsuario = {};
            for (var i = 0; i < length; i++) {

                if (corpo.AREA != undefined && corpo.AREA != '' && corpo.AREA == 'APP') {
                    dadosUsuario = {
                        id: row[i].codUsuario,
                        codempresa: row[i].codEmpresa,
                        nome: row[i].nomUsuario
                    };
                } else {
                    dadosUsuario = {
                        id: row[i].codUsuario,
                        idPessoa: row[i].idPessoa,
                        nome: row[i].nomUsuario,
                        nr_cupom: row[i].nr_cupom
                    };
                }


                // ####### Criaçao do JWT #######
                var wOjJWT = jwtController.criar(dadosUsuario, res);
                if (!wOjJWT[0]) { return false; };
                const token = wOjJWT[1]
                // ####### Validacao do JWT #######
                var wAmbiente = (corpo.AMBIENTE != undefined ? corpo.AMBIENTE : 'PROD');
                var wRota = "/01";

                const objAmbiente = await EndPointsRepository.findAmbiente(wAmbiente)
                if (objAmbiente.length > 0) {
                    wRota = objAmbiente[0].rota;
                }

                // console.log(row[i]);
                var data = {
                    ID: row[i].codUsuario,
                    IDPESSOA: row[i].idPessoa,
                    CODEMPRESA: row[i].codEmpresa,
                    NOME: row[i].nomUsuario,
                    CUPOM: row[i].nr_cupom,
                    TOKEN: token,
                    ROTA: wRota
                };

                wArray = {
                    STATUS: true,
                    RECORDS: length,
                    DATA: data
                };
                // console.log(wArray);
            }
            res.json(wArray);
        } else {
            wArray = {
                STATUS: false,
                RECORDS: 0,
                DATA: []
            };
            // console.log(wArray);
            res.json(wArray);
            // res.end();
        }

        // res.json(wArray);
    }


    async store(req, res) {
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

            var wOjSenha = jwtController.encrypt(corpo[i].senha);
            if (!wOjSenha[0]) { continue; };
            corpo[i].senha = wOjSenha[1]

            try {
                var registro = null
                await UsuarioRepository.create(codempresa, corpo[i]).then((resposta) => {
                    var data = {
                        nome: corpo[i].nome,
                        cpf: corpo[i].cpf
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
export default new UsuarioController()


