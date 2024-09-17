// import { Console } from 'console';
import EndPointsRepository from '../repositories/EndPointsRepository.js';
import UsuarioRepository from '../repositories/UsuarioRepository.js'

import jwtController from './jwtController.js';
import AUXController from './AuxiliaresController.js';
import AuxiliaresController from './AuxiliaresController.js';


class UsuarioController {

    async home(req, res) {
        var wArray = [];
        wArray.push({
            STATUS: false,
            RECORDS: 0,
            DATA: []
        });

		res.json(wArray);
		res.end();

	}

	async cep(req, res) {
		// ####### Validacao do JWT #######
		var wOjJWT = jwtController.validar(req, res);
		if (!wOjJWT[0]) { return false; };
		const { codempresa, id } = wOjJWT[1]
		// ####### Validacao do JWT #######

		var wArray = {};
		const objCep = await AuxiliaresController.getDadosCEP(req.query.cep)
		wArray = {
			STATUS: objCep[0],
			RECORDS: objCep[0] == true ? 1 : 0,
			DATA: objCep[1]
		};

		res.json(wArray);
		res.end();

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


		res.json(wArray);
		res.end();
    }

    async login(req, res) {

        const corpo = req.body;
        var wArray = {};
        var wOjSenha = jwtController.encrypt(corpo.SENHA);
        if (!wOjSenha[0]) { return false; };

		const row = (corpo.AREA == undefined || corpo.AREA == '' || corpo.AREA == 'APP') ? await UsuarioRepository.login(corpo.LOGIN, wOjSenha[1], corpo.SENHA) : await UsuarioRepository.loginPortal(corpo.LOGIN, wOjSenha[1], corpo.SENHA);

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

                var data = {
                    ID: row[i].codUsuario,
                    IDPESSOA: row[i].idPessoa,
                    CODEMPRESA: row[i].codEmpresa,
                    NOME: row[i].nomUsuario,
                    CUPOM: row[i].nr_cupom,
                    TOKEN: token,
                    ROTA: wRota,
                    FOTO: row[i].foto != null && row[i].foto != undefined ? row[i].foto : null
                };

                wArray = {
                    STATUS: true,
                    RECORDS: length,
                    DATA: data
				};
            }
            res.json(wArray);
			res.end();
        } else {
            wArray = {
                STATUS: false,
                RECORDS: 0,
                DATA: []
            };

            res.json(wArray);
			res.end();
        }

        // res.json(wArray);
    }

    async passwordChange(req, res) {

        const corpo = req.body;
        var wArray = {};
        var wOjJWT = jwtController.validar(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1];

        if (corpo.EFETIVAR == undefined || corpo.EFETIVAR == '') {
            var wOjSenha = jwtController.encrypt(corpo.SENHA);
            var wOjNovaSenha = jwtController.encrypt(corpo.NOVASENHA);
            if (!wOjSenha[0]) { return false; };

            const row = (corpo.AREA == undefined || corpo.AREA == '' || corpo.AREA == 'APP') ? await UsuarioRepository.validaSenha(codempresa, id, wOjSenha[1]) : await UsuarioRepository.validaSenhaPortal(id, wOjSenha[1]);
            var length = Object.keys(row).length;
            if (length > 0) {

                await UsuarioRepository.ChangePassawordCancel(corpo.AREA, id);

                var dadosUsuario = {};
                if (row[0].telefone != null && row[0].telefone != '') {

					const objParans = await UsuarioRepository.getParans();
					var lengthParam = Object.keys(objParans).length;
					if (lengthParam == 0) { return false; }

					const objLoginFortics = await AUXController.loginFortics(JSON.parse(objParans[0].paramFortics));
                    if (objLoginFortics[0] == true) {

                        var wNumTelefone = (row[0].telefone.substring(0, 2) != "55" ? '55' + justNumbers(row[0].telefone) : justNumbers(row[0].telefone));
                        // wNumTelefone = '5547988112917';
                        // wNumTelefone = '5542991113692';
                        var wBearerToken = objLoginFortics[1].data.token;
                        var wToken = objLoginFortics[1].data.socket_token;
                        const wCodeConfirm = makeid(4);

                        var params = {
                            platform_id: wNumTelefone,
                            channel_id: "5fd0dc23f48c796d4c607c24",
                            close_session: '0',
                            is_hsm: 1,
                            hsm_template_name: "codigoacao",
                            hsm_placeholders: [row[0].nome, 'alteração', wCodeConfirm],
                            type: 'text',
                            token: wToken,
                            agent: "luana@pormadeonline.com.br",
                            attendance_id: "5f75d3e7b44ee012ee546533"
                        };

                        const retSend = await AUXController.enviaMensagem(params, wBearerToken)

                        if (retSend[0] == true) {
                            if (retSend[1].data.messages != undefined) {
                                const wIdMensagem = retSend[1].data.messages.message_id;
                                const wMensagem = retSend[1].data.message
                                UsuarioRepository.ChangePassaword(corpo.AREA, id, wOjNovaSenha[1], wCodeConfirm)
                                dadosUsuario = {
                                    status: true,
                                    idMensagem: wIdMensagem,
                                    codigo: wCodeConfirm
                                }
                            }
                        }
                    }
                }
            }
        } else {
            const row = await UsuarioRepository.validaTokenChangePassaword(corpo.AREA, id, corpo.EFETIVAR);
            var length = Object.keys(row).length;
            if (length > 0) {
                var wEfetivar = true;

                try {
                    const rowUPD = (corpo.AREA == undefined || corpo.AREA == '' || corpo.AREA == 'APP') ? await UsuarioRepository.updateSenha(codempresa, id, row[0].novaSenha) : await UsuarioRepository.updateSenhaPortal(id, row[0].novaSenha);
                    await UsuarioRepository.ChangePassawordFinally(corpo.AREA, id, corpo.EFETIVAR);
                    wEfetivar = true;
                } catch (error) {
                    wEfetivar = false;
                } finally {
                    dadosUsuario = {
                        status: wEfetivar
                    }
                }
            }
        }

        wArray = {
            STATUS: dadosUsuario.status != undefined ? true : false,
            RECORDS: dadosUsuario.status != undefined ? 1 : 0,
            DATA: dadosUsuario.status != undefined ? dadosUsuario : []
        };

        res.json(wArray);
		res.end();
    }

    async updateAvatar(req, res) {

        const corpo = req.body;
        var wArray = {};
        var wOjJWT = jwtController.validar(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1];

        try {

            // console.log('id: ' + id);
            // console.log('Area: ' + corpo.AREA);
            // console.log('Foto: ' + corpo.FOTO);
            const row = (corpo.AREA == undefined || corpo.AREA == '' || corpo.AREA == 'APP') ? await UsuarioRepository.validaSenha(codempresa, id, wOjSenha[1]) : await UsuarioRepository.updateAvatarPortal(id, corpo.FOTO);
            var length = Object.keys(row).length;
            if (length > 0) {

                wArray = {
                    STATUS: true,
                    RECORDS: 1,
                    DATA: []
                };

            }
        } catch (error) {

            console.log(error)
            wArray = {
                STATUS: false,
                RECORDS: 0,
                DATA: []
            };
        }

        res.json(wArray);
		res.end();
	}

    async store(req, res) {

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
			res.end();
            return false;
        }

        const objUser = req.body;
        var wArray = {};

        var wArrayData = [];
        if (objUser.RECORDS > 0) {
            await UsuarioRepository.deactivateUser(objUser.TIP)
        }

        for (var i = 0; i < objUser.RECORDS; i++) {
            if (objUser.DATA[i].CRYPT == 'S') {
                var wOjSenha = jwtController.encrypt(objUser.DATA[i].SENHA);
                if (!wOjSenha[0]) { continue; };
                objUser.DATA[i].SENHA = wOjSenha[1]
            }

            try {
                var registro = null
                await UsuarioRepository.create('1', objUser.DATA[i]).then((resposta) => {

                    UsuarioRepository.acessoUser(objUser.DATA[i]);
                    var data = {
                        acao: 'INS',
                        nome: objUser.DATA[i].NOMUSUARIO,
                        cpf: objUser.DATA[i].NUMCPF
                    }
                    wArrayData.push(data)
                });

            } catch (error) {
                try {
                    await UsuarioRepository.updateUser(objUser.DATA[i]).then((resposta) => {
                        var data = {
                            acao: 'UPD',
                            nome: objUser.DATA[i].NOMUSUARIO,
                            cpf: objUser.DATA[i].NUMCPF
                        }
                        wArrayData.push(data)
                    });
                } catch (errorUPD) {
                }
            }
        }

        wArray = {
            STATUS: true,
            RECORDS: wArrayData.length,
            DATA: wArrayData
        };

        res.json(wArray);
		res.end();
    }
}

function justNumbers(text) {
    text = text.replaceAll(" ", "")
    var numbers = text.replaceAll("[^0-9]", "")
    return parseInt(numbers);
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    // var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// padrão Singleton
export default new UsuarioController()


