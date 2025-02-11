// import { Console } from 'console';
import InstalacoesRepository from '../repositories/InstalacoesRepository.js';
import jwtController from './jwtController.js';
import image from '../components/image.js';
import AUXController from './AuxiliaresController.js';
import UsuarioRepository from '../repositories/UsuarioRepository.js';


class InstalacoesController {

	async teste(req, res) {

		// const jwt = req.headers["authorization"] || req.headers["x-access-token"];
		// const objAPI = await UsuarioRepository.validaToken(jwt);

		// if (objAPI.length == 0) {
		// 	var wArray = {
		// 		STATUS: false,
		// 		RECORDS: 1,
		// 		DATA: [{
		// 			MENSAGEM: 'Token Inválido'
		// 		}]
		// 	};
		// 	res.json(wArray);
		// 	res.end();
		// 	return false;
		// }

		const corpo = req.body;

		console.log(JSON.stringify(corpo))

		var wArray = {};
		wArray = {
			STATUS: true,
			RECORDS: 0,
			DATA: []
		};


		res.status(207).json(wArray);
		res.end();
	}


	async logInstaladores(req, res) {

		// const jwt = req.headers["authorization"] || req.headers["x-access-token"];
		// const objAPI = await UsuarioRepository.validaToken(jwt);

		// if (objAPI.length == 0) {
		// 	var wArray = {
		// 		STATUS: false,
		// 		RECORDS: 1,
		// 		DATA: [{
		// 			MENSAGEM: 'Token Inválido'
		// 		}]
		// 	};
		// 	res.json(wArray);
		// 	res.end();
		// 	return false;
		// }

		const { codusuario, idinstalacao } = req.query;

		console.log(req.query)

		var wArray = {};
		wArray = {
			STATUS: false,
			RECORDS: 0,
			DATA: []
		};

		if (codusuario != undefined && idinstalacao != '') {

			const objLog = await InstalacoesRepository.findLogByIdAll(codusuario, idinstalacao)
			// console.log(objInstalacao);
			var wArrayData = [];
			for (var i = 0; i < objLog.length; i++) {
				var data = {
					SEQUENCE: objLog[i].sequence,
					ENDPOINT: objLog[i].endpoint,
					DATREGISTRO: objLog[i].datRegistro,
					JSON: objLog[i].json
				}
				wArrayData.push(data);
			}

			if (objLog.length > 0) {
				wArray = {
					STATUS: true,
					RECORDS: objLog.length,
					DATA: wArrayData
				};

			}

		}

		res.json(wArray);
		res.end();
	}


    async showInstalacoes(req, res) {
        // ####### Validacao do JWT #######
        var wOjJWT = jwtController.validarJWT(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1]
        // ####### Validacao do JWT #######

        var wArray = {};
        const row = await InstalacoesRepository.findAll(id)
        var length = Object.keys(row).length;
        if (length > 0) {
            var wArrayData = [];
            for (var i = 0; i < length; i++) {

				var wArrayAceite = {};
				const rowAceite = await InstalacoesRepository.findAceiteAll(row[i].idInstalacao);
				var lengthAceite = Object.keys(rowAceite).length;
				if (lengthAceite > 0) {
					wArrayAceite = {
						ID: rowAceite[0].numDocumento,
						URL: rowAceite[0].urlDocumento
					}
				}

                var wArrayServ = {};
                const rowServ = await InstalacoesRepository.findServicoAll(id, row[i].idInstalacao)
                var lengthServ = Object.keys(rowServ).length;
                if (lengthServ > 0) {
                    var wArrayDataServ = [];
                    for (var x = 0; x < lengthServ; x++) {

                        var wArrayServFoto = {};
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
                            wArrayServFoto = {
                                STATUS: true,
								RECORDS: lengthServFoto,
                                DATA: wArrayDataServFoto
                            };
                        } else {
                            wArrayServFoto = {
                                STATUS: false,
                                RECORDS: 0,
                                DATA: []
                            };
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
                    wArrayServ = {
                        STATUS: true,
                        RECORDS: lengthServ,
                        DATA: wArrayDataServ
                    };
                } else {
                    wArrayServ = {
                        STATUS: false,
                        RECORDS: 0,
                        DATA: []
                    };
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
                    DATAGENDADOFIM: row[i].datAgendadofim,
                    LATITUDE: row[i].latitudeO,
                    LONGITUDE: row[i].longitudeO,
                    SITUACAO: row[i].indSituacao,
					DOCUMENTO: wArrayAceite,
                    SERVICOS: wArrayServ
                }
                wArrayData.push(data)

            }
            wArray = {
                STATUS: true,
                RECORDS: length,
                DATA: wArrayData
            };
        } else {
            wArray = {
                STATUS: false,
                RECORDS: 0,
                DATA: []
            };
        }


		res.json(wArray);
		res.end();
    }

    async listarInstalacoes(req, res) {

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

		const { idproposta, seqinstall, fotos, servico, aceite } = req.query;

        var wArray = [];
        wArray.push({
            STATUS: false,
            RECORDS: 0,
            DATA: []
        });

        if (idproposta != undefined && idproposta != '') {

            const objInstalacao = await InstalacoesRepository.findByID(idproposta, seqinstall)
			// console.log(objInstalacao);
            var wArrayData = [];
            for (var i = 0; i < objInstalacao.length; i++) {
				var wArrayDataServ = [];
				var wArrayDataAceite = {};

				var objAceite = await InstalacoesRepository.findAceiteById(objInstalacao[i].idInstalacao, aceite);
				if (objAceite.length > 0) {
					var wArrayDataAceite = {
						DOCUMENTO: objAceite[0].numDocumento,
						DATACEITE: objAceite[0].datAceite,
						ACEITE: objAceite[0].aceite,
						OBSERVACAO: objAceite[0].observacao,
						LATITUDE: objAceite[0].latitude,
						LONGITUDE: objAceite[0].longitude,
						SITUACAO: objAceite[0].indSituacao,
						FOTO: aceite == undefined || aceite == '' ? null : objAceite[0].foto
					}
				}

                if (servico == undefined || servico == '') {
                    var objServ = await InstalacoesRepository.findServicoByID(objInstalacao[i].idInstalacao);
                } else {
                    var objServ = await InstalacoesRepository.findServicoByIDServ(objInstalacao[i].idInstalacao, servico);
                }

                for (var x = 0; x < objServ.length; x++) {
                    var wArrayDataServFoto = [];
                    if (fotos == undefined || fotos == 'S') {
                        var objServFoto = await InstalacoesRepository.findServicoFotoById(objInstalacao[i].idInstalacao, objServ[x].id);
                        if (objServFoto.length == 0) {
                            var objServFoto = await InstalacoesRepository.findServicoFotoByIdOld(objInstalacao[i].idInstalacao, objServ[x].id);
                        }
                        for (var y = 0; y < objServFoto.length; y++) {
                            var data = {
                                ID: objServFoto[y].id,
                                ARQUIVO: objServFoto[y].nomArquivo,
                                FOTO: objServFoto[y].foto
                            }
                            wArrayDataServFoto.push(data);
                        }
                    }

                    var data = {
                        ID: objServ[x].id,
                        IDINSTALACAO: objServ[x].idInstalacao,
                        IDSEQ: objServ[x].idseq,
                        DESCRICAO: objServ[x].descricao,
                        SITUACAO: objServ[x].indsituacao,
                        FOTOS: wArrayDataServFoto
                    }
                    wArrayDataServ.push(data);
                };


                var data = {
                    ID: objInstalacao[i].idInstalacao,
                    PROPOSTA: objInstalacao[i].idProposta,
					ORDERID: objInstalacao[i].orderid,
					AGENDAINI: objInstalacao[i].datAgendado != null ? objInstalacao[i].datAgendado.split('T')[0] : '',
					AGENDAFIM: objInstalacao[i].datAgendadoFim != null ? objInstalacao[i].datAgendadoFim.split('T')[0] : '',
					LATITUDE: objInstalacao[i].latitudeR,
					LONGITUDE: objInstalacao[i].longitudeR,
					OBSERVACAO: objInstalacao[i].observacao,
					INDSITUACAO: objInstalacao[i].indsituacao,
					ACEITE: wArrayDataAceite,
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

		res.json(wArrayData);
		res.end();
    }

    async storeInstalacoes(req, res) {

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

        const corpo = req.body;
        var wArray = {};

        var length = Object.keys(corpo).length;
        var wArrayData = []
        for (var i = 0; i < length; i++) {


            if (corpo[i].INDACAO == undefined || corpo[i].INDACAO == 'A') {

                try {
					await InstalacoesRepository.create(corpo[i]).then((resposta) => {
						if (resposta.insertId > 0) {
							try {
								if (corpo[i].DOCUMENTO != undefined) {
									InstalacoesRepository.createinstalacoesAceite(corpo[i]);
								}
							} catch (error) {
								console.log(error)
							}

							for (var x = 0; x < corpo[i].SERVICOS.length; x++) {
								try {
									InstalacoesRepository.createinstalacoesServico(corpo[i], corpo[i].SERVICOS[x])
								} catch (error) {
									// console.log('Cacth createinstalacoesServico');
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
                    await InstalacoesRepository.updateInstalacaoAgenda(corpo[i])
                    await InstalacoesRepository.removeServicoPendente(corpo[i]);
                    await InstalacoesRepository.removeServicoFotoPendente(corpo[i]);
                    for (var x = 0; x < corpo[i].SERVICOS.length; x++) {
                        try {
                            await InstalacoesRepository.createinstalacoesServico(corpo[i], corpo[i].SERVICOS[x])
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

					wArrayData.push(data);
                }

            }

            if (corpo[i].INDACAO == 'D') {

                await InstalacoesRepository.removeServicoFotoGeral(corpo[i]);
                await InstalacoesRepository.removeServicoGeral(corpo[i]);
                await InstalacoesRepository.removeInstalacaoGeral(corpo[i]);

                var data = {
                    IDINT: corpo[i].IDINT,
                    IDPROPOSTA: corpo[i].IDPROPOSTA,
                    SEQINSTALL: corpo[i].SEQINSTALL,
                    ACAO: 'DEL'
                }

                wArrayData.push(data)

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

    async storeInstalacaoFoto(req, res) {
		// console.log('storeInstalacaoFoto');
        // ####### Validacao do JWT #######
        var wOjJWT = jwtController.validarJWT(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1]
        // ####### Validacao do JWT #######

        const corpo = req.body;
		var wArray = {};

		// console.log(corpo)

        var length = Object.keys(corpo).length;
		var wArrayData = [];
        for (var i = 0; i < length; i++) {
			// console.log(corpo[i])

			wArrayData.push(await processaServFotos(corpo[i]));
			// try {
			// 	switch (corpo[i].INDACAO) {
			// 		case "I":
			// 			corpo[i].FOTO = await AUXController.resizeBase64({ base64Image: corpo[i].FOTO, maxWidth: 800 });
			// 			const reg = await InstalacoesRepository.createinstalacoesServicoFoto(corpo[i]);
			// 			var data = {
			// 				ID: corpo[i].ID,
			// 				IDAPI: reg.insertId,
			// 				ACAO: 'INS'
			// 			}
			// 			wArrayData.push(data);
			// 			break;
			// 		case "D":
			// 			await InstalacoesRepository.removeServicoFoto(corpo[i]);
			// 			var data = {
			// 				ID: corpo[i].ID,
			// 				IDAPI: null,
			// 				ACAO: 'DEL'
			// 			}
			// 			wArrayData.push(data);
			// 			break;
			// 	}
			// } catch (error) {
			// 	var data = {
			// 		ID: corpo[i].ID,
			// 		IDAPI: null,
			// 		ACAO: 'ERROR'
			// 	}
			// 	wArrayData.push(data);
			// }
        }

		wArray = {
            STATUS: true,
            RECORDS: length,
            DATA: wArrayData
		};

		res.json(wArray);
		res.end();
    }

    async updateInstalacao(req, res) {
        // ####### Validacao do JWT #######
        var wOjJWT = jwtController.validarJWT(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1]
        // ####### Validacao do JWT #######

        const corpo = req.body;
		var wArray = {};


		const rowLog = await InstalacoesRepository.findLogByID('updateInstalacao');
		var length = Object.keys(rowLog).length;
		var reg = rowLog;

		if (length == 0) {
			const rowLog2 = await InstalacoesRepository.findLogByIDUsuario('updateInstalacao', id);
			var length = Object.keys(rowLog2).length;

			var reg = rowLog2;
		}


		if (length > 0) {
			if (reg[0].indLog == 'S') {
				var data = {
					codUsuario: id,
					endPoint: 'updateInstalacao',
					idInstalacao: corpo.IDINSTALACAO,
					json: JSON.stringify(corpo)
				}

				await InstalacoesRepository.createlog(data);
			}
		}

		// console.log('Atualizando')
		// console.log(JSON.stringify(corpo))

		// res.json(wArray);
		// res.end();
		// return

        var length = Object.keys(corpo).length;
        var wArrayData = []
        for (var i = 0; i < length; i++) {

            switch (corpo[i].INDACAO) {
                case "I":
					wArrayData.push(await processaInstalacao(corpo[i]));
                    break;
                case "S":
					wArrayData.push(await processaServ(corpo[i]));
                    break;
				case "F":
					wArrayData.push(await processaServFotos(corpo[i]));
					break;
				case "A":
					wArrayData.push(await processaInstalacaoAceite(corpo[i]));
					break;
            }
        }

		wArray = {
            STATUS: true,
            RECORDS: length,
            DATA: wArrayData
		};

		res.json(wArray);
		res.end();
    }

}


async function processaInstalacao(reg) {
	try {
		var wArray = {};
		var wArrayDataServices = [];
		var wArrayDataAceite = [];

		// console.log(reg)

		await InstalacoesRepository.updateInstalacao(reg);
		for (var i = 0; i < reg.SERVICOS.length; i++) {
			wArrayDataServices.push(await processaServ(reg.SERVICOS[i]));
		}

		for (var i = 0; i < reg.ACEITE.length; i++) {
			wArrayDataAceite.push(await processaInstalacaoAceite(reg.ACEITE[i]));
		}

		wArray = {
			INDACAO: 'I',
			ACAO: 'UPD',
			IDINSTALACAO: reg.IDINSTALACAO,
			STATUS: reg.STATUS,
			SERVICOS: wArrayDataServices,
			ACEITE: wArrayDataAceite
		}

	} catch (error) {
		wArray = {
			INDACAO: 'I',
			ACAO: 'ERROR',
			IDINSTALACAO: reg.IDINSTALACAO,
			STATUS: reg.STATUS,
			SERVICOS: wArrayDataServices,
			ACEITE: wArrayDataAceite
		}

	} finally {
		// console.log(wArray)
		return wArray;
	}
}

async function processaInstalacaoAceite(reg) {
	try {
		var wArray = {};
		var wArrayDataAceite = [];
		// console.log(reg);


		reg.FOTO = reg.FOTO != '' ? await image.resizeBase64({ base64Image: reg.FOTO, maxWidth: 800 }) : null;
		await InstalacoesRepository.updateInstalacaoAceite(reg);
		var data = {
			IDINSTALACAO: reg.IDINSTALACAO
		}

		wArrayDataAceite.push(data);


		wArray = {
			INDACAO: 'A',
			ACAO: 'UPD',
			INSTALACAO: wArrayDataAceite

		}

	} catch (error) {
		wArray = {
			INDACAO: 'A',
			ACAO: 'ERROR',
			INSTALACAO: wArrayDataAceite,
			MENSAGEM: error.toString()
		}
	} finally {
		return wArray;
	}
}

async function processaServ(reg) {
	try {
		var wArray = {};
		var wArrayDataFotos = [];

		// console.log(reg)
		await InstalacoesRepository.updateInstalacaoServico(reg);

		for (var x = 0; x < reg.FOTOS.length; x++) {
			// console.log(reg.FOTOS[x])
			wArrayDataFotos.push(await processaServFotos(reg.FOTOS[x]));
		}

		wArray = {
			INDACAO: 'S',
			ACAO: 'UPD',
			IDINSTALACAO: reg.IDINSTALACAO,
			IDSERVICO: reg.IDSERVICO,
			FOTOS: wArrayDataFotos
		}

	} catch (error) {
		console.log('Serv: ' + error)
		wArray = {
			INDACAO: 'S',
			ACAO: 'ERROR',
			IDINSTALACAO: reg.IDINSTALACAO,
			IDSERVICO: reg.IDSERVICO,
			FOTOS: wArrayDataFotos
		}

	} finally {
		return wArray;
	}
}

async function processaServFotos(reg) {
	try {
		var wArray = {};

		switch (reg.ACAO) {
			case "I":
				reg.FOTO = reg.FOTO != '' ? await image.resizeBase64({ base64Image: reg.FOTO, maxWidth: 800 }) : '';
				const row = await InstalacoesRepository.createinstalacoesServicoFoto(reg);
				wArray = {
					INDACAO: 'F',
					ID: reg.ID,
					IDAPI: row != null ? row.insertId : null,
					ACAO: 'INS'
				}
				break;
			case "D":
				await InstalacoesRepository.removeServicoFoto(reg);
				wArray = {
					INDACAO: 'F',
					ID: reg.ID,
					IDAPI: null,
					ACAO: 'DEL'
				}
				break;
		}
	} catch (error) {
		// console.log('Foto: ' + error)
		wArray = {
			ID: reg.ID,
			IDAPI: null,
			ACAO: 'ERROR'
		}

	} finally {
		return wArray;
	}
}

export default new InstalacoesController()
