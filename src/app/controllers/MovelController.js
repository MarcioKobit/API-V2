import MovelRepository from '../repositories/MovelRepository.js';
import jwtController from './jwtController.js';



class MovelController {


    async showViagem(req, res) {
        // ####### Validacao do JWT #######
        var wOjJWT = jwtController.validarJWT(req, res);
        // console.log(req)
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1]
        // ####### Validacao do JWT #######

        var wArray = [];
        const rowRota = await MovelRepository.findRotasAll(codempresa, id)
        var length = Object.keys(rowRota).length;
        if (length > 0) {
            var wArrayData = [];
            for (var i = 0; i < length; i++) {
                var wArrayCity = [];
                const rowCity = await MovelRepository.findCidadesAll(rowRota[i].ID)
                var lengthCity = Object.keys(rowCity).length;
                if (lengthCity > 0) {
                    var wArrayDataCity = [];
                    for (var x = 0; x < lengthCity; x++) {

                        var wArrayCityVisita = [];
                        // console.log('ID: ' + rowCity[x].id)
                        const rowCityVisita = await MovelRepository.findVisitasAll(rowCity[x].id)
                        var lengthCityVisita = Object.keys(rowCityVisita).length;
                        if (lengthCityVisita > 0) {
                            var wArrayDataCityVisita = [];
                            for (var y = 0; y < lengthCityVisita; y++) {

                                var wArrayVisitaParceiro = [];
                                const rowVisitaParceiro = await MovelRepository.findParceirosAll(rowCityVisita[y].id)
                                var lengthVisitaParceiro = Object.keys(rowVisitaParceiro).length;
                                if (lengthVisitaParceiro > 0) {
                                    var wArrayDataVisitaParceiro = [];
                                    for (var n = 0; n < lengthVisitaParceiro; n++) {

                                        var data = {
                                            ID: rowVisitaParceiro[n].id,
                                            IDMOBILE: rowVisitaParceiro[n].idMobile,
                                            DOCUMENCTID: rowVisitaParceiro[n].documentoID,
                                            IDFLUIG: rowVisitaParceiro[n].IDFluig,
                                            CODVISITA: rowVisitaParceiro[n].codVisita,
                                            EMPRESA: rowVisitaParceiro[n].empresa,
                                            CONTATO: rowVisitaParceiro[n].contato,
                                            DATA: rowVisitaParceiro[n].data,
                                            HORA: rowVisitaParceiro[n].hora,
                                            TELEFONE: rowVisitaParceiro[n].telefone,
                                            CIDADE: rowVisitaParceiro[n].cidade,
                                            INTERESSE: rowVisitaParceiro[n].interesse,
                                            AREAINTERESSE: rowVisitaParceiro[n].areaInteresse,
                                            INDSITUACAO: rowVisitaParceiro[n].indSituacao
                                        }
                                        wArrayDataVisitaParceiro.push(data);
                                    }

                                    wArrayVisitaParceiro.push({
                                        STATUS: true,
                                        RECORDS: lengthVisitaParceiro,
                                        DATA: wArrayDataVisitaParceiro
                                    });

                                } else {
                                    wArrayVisitaParceiro.push({
                                        STATUS: false,
                                        RECORDS: 0,
                                        DATA: []
                                    });
                                }

                                var data = {
                                    ID: rowCityVisita[y].id,
                                    IDMOBILE: rowCityVisita[y].idMobile,
                                    CODROTA: rowCityVisita[y].codRota,
                                    CODCIDADE: rowCityVisita[y].codCidade,
                                    CIDADE: rowCityVisita[y].cidade,
                                    LOCAL: rowCityVisita[y].local,
                                    TIPLOCAL: rowCityVisita[y].tipLocal,
                                    DATA: rowCityVisita[y].data,
                                    HORA: rowCityVisita[y].hora,
                                    CONTATO: rowCityVisita[y].contato,
                                    TELEFONE: rowCityVisita[y].telefone,
                                    EXPEDIENTE: rowCityVisita[y].expediente,
                                    INDSITUACAO: rowCityVisita[y].indSituacao,
                                    PARCEIROS: wArrayVisitaParceiro
                                }
                                wArrayDataCityVisita.push(data);
                            }
                            wArrayCityVisita.push({
                                STATUS: true,
                                RECORDS: lengthCityVisita,
                                DATA: wArrayDataCityVisita
                            });
                        } else {
                            wArrayCityVisita.push({
                                STATUS: false,
                                RECORDS: 0,
                                DATA: []
                            });
                        }

                        var data = {
                            ID: rowCity[x].id,
                            CODROTA: rowCity[x].codRota,
                            CIDADE: rowCity[x].cidade,
                            DATINICIO: rowCity[x].datInicio,
                            DATFIM: rowCity[x].datFim,
                            EXPEDIENTE: rowCity[x].expediente,
                            VISITAS: wArrayCityVisita
                        }
                        wArrayDataCity.push(data);
                    }
                    wArrayCity.push({
                        STATUS: true,
                        RECORDS: lengthCity,
                        DATA: wArrayDataCity
                    });
                } else {
                    wArrayCity.push({
                        STATUS: false,
                        RECORDS: 0,
                        DATA: []
                    });
                }


                var wArrayResumo = [];
                const rowResumo = await MovelRepository.findResumo(id)
                var lengthResumo = Object.keys(rowResumo).length;
                if (lengthResumo > 0) {
                    for (var r = 0; r < lengthResumo; r++) {
                        var data = {
                            STATUS: true,
                            RECORDS: lengthResumo,
                            DATA: {
                                NUMVISITAS: rowResumo[r].numVisitas,
                                NUMPARCEIROS: rowResumo[r].numParceiros
                            }
                        }
                        wArrayResumo.push(data)
                    }
                } else {
                    wArrayResumo.push({
                        STATUS: true,
                        RECORDS: lengthResumo,
                        DATA: []
                    });
                }



                var data = {
                    ID: rowRota[i].ID,
                    NUMPLACA: rowRota[i].numPlaca,
                    DATINICIO: rowRota[i].datInicio,
                    HORINICIO: rowRota[i].horInicio,
                    DATFIM: rowRota[i].datFim,
                    HORFIM: rowRota[i].horFim,
                    TITULO: rowRota[i].titulo,
                    DETALHES: rowRota[i].detalhes,
                    INDSITUACAO: rowRota[i].indSituacao,
                    ROTAS: wArrayCity,
                    RESUMO: wArrayResumo

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

    async showTipoLocal(req, res) {
        // ####### Validacao do JWT #######
        var wOjJWT = jwtController.validarJWT(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1]
        // ####### Validacao do JWT #######

        var wArray = [];
        const row = await MovelRepository.findTipoLocal(codempresa)
        var length = Object.keys(row).length;
        if (length > 0) {
            var wArrayData = [];
            for (var i = 0; i < length; i++) {

                var data = {
                    ID: row[i].codLocal,
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


		res.json(wArray);
		res.end();
    }

    async showCidades(req, res) {
        // ####### Validacao do JWT #######
        var wOjJWT = jwtController.validarJWT(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1]
        // ####### Validacao do JWT #######

        var wArray = [];
        const row = await MovelRepository.findCidades(codempresa)
        var length = Object.keys(row).length;
        if (length > 0) {
            var wArrayData = [];
            for (var i = 0; i < length; i++) {

                var data = {
                    ID: row[i].codCidade.trim(),
                    UF: row[i].uf,
                    IBGE: row[i].codIBGE,
                    NOMCIDADE: row[i].cidade
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

    async showProfissoes(req, res) {
        // ####### Validacao do JWT #######
        var wOjJWT = jwtController.validarJWT(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1]
        // ####### Validacao do JWT #######

        var wArray = [];
        const row = await MovelRepository.findProfissoes(codempresa)
        var length = Object.keys(row).length;
        if (length > 0) {
            var wArrayData = [];
            for (var i = 0; i < length; i++) {

                var data = {
                    ID: row[i].id,
                    PROFISSAO: row[i].profissao.trim(),
                    INDGESTOR: row[i].indGestor
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

    async showVendedores(req, res) {
        // ####### Validacao do JWT #######
        var wOjJWT = jwtController.validarJWT(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1]
        // ####### Validacao do JWT #######

        var wArray = [];
        var wArrayData = [];
        const row = await MovelRepository.findVendedores()
        var length = Object.keys(row).length;
        if (length > 0) {
            for (var i = 0; i < length; i++) {

                var data = {
                    ID: row[i].id,
                    IDPROFISSAO: row[i].codprofissao,
                    NOMVENDEDOR: row[i].nomVendedor.trim()
                }
                wArrayData.push(data)
            }
        }

        wArray.push({
            STATUS: (length > 0 ? true : false),
            RECORDS: length,
            DATA: wArrayData
        });

		res.json(wArray);
		res.end();
    }

    async showPipe(req, res) {
        // // ####### Validacao do JWT #######
        // var wOjJWT = jwtController.validarJWT(req, res);
        // if (!wOjJWT[0]) { return false; };
        // const { codempresa, id } = wOjJWT[1]
        // // ####### Validacao do JWT #######

        var wdatInicio = req.query.datainicio;
        var wdataFim = req.query.datafim;

        var wArray = {};
        var wArrayData = [];
        const rowMovel = await MovelRepository.findPipeMovel(wdatInicio, wdataFim)
        var lengthMovel = Object.keys(rowMovel).length;
        if (lengthMovel > 0) {
            for (var i = 0; i < lengthMovel; i++) {
                var data = {
                    ORIGEM: "PM",
                    NUMPLACA: rowMovel[i].numPlaca,
                    CPFMOTORISTA: rowMovel[i].cpfmotorista,
                    MOTORISTA: rowMovel[i].motorista,
                    CPFAJUDANTE: rowMovel[i].cpfajudante,
                    AJUDANTE: rowMovel[i].ajudante,
                    INDCAPTURA: rowMovel[i].indcaptura,
                    INDSYNC: rowMovel[i].indSync,
                    ID: rowMovel[i].id,
                    DOCUMENCTID: rowMovel[i].documentoID,
                    IDFLUIG: rowMovel[i].idFluig,
                    CODVISITA: rowMovel[i].codVisita,
                    TIPOLOCAL: rowMovel[i].tiplocal,
                    LOCAL: rowMovel[i].local,
                    CODTIPOVISITA: rowMovel[i].codTipoVisita,
                    TIPOVISITA: rowMovel[i].tipovisita,
                    EMPRESA: rowMovel[i].empresa,
                    CONTATO: rowMovel[i].contato,
                    DATA: rowMovel[i].data,
                    HORA: rowMovel[i].hora,
                    TELEFONE: rowMovel[i].telefone,
                    UF: rowMovel[i].uf,
                    CODUF: rowMovel[i].codUf,
                    CIDADE: rowMovel[i].cidade,
                    IDCIDADE: rowMovel[i].idCidade,
                    CODPAIS: rowMovel[i].codPais,
                    PROFISSAO: rowMovel[i].profissao,
                    IDPIPE: rowMovel[i].idPipe,
                    IDFUNIL: rowMovel[i].idFunil,
                    FUNIL: rowMovel[i].funil,
                    IDGESTOR: rowMovel[i].idGestor,
                    MOTIVORECUSA: rowMovel[i].motivoRecusa,
                    OBSERVACAO: rowMovel[i].observacao,
                    LATITUDE: rowMovel[i].latitude,
                    LONGITUDE: rowMovel[i].longitude,
                    INDSITUACAO: rowMovel[i].indSituacao
                }
                wArrayData.push(data);
            }
        }

        const rowEventos = await MovelRepository.findPipeEventos(wdatInicio, wdataFim)
        var lengtEventos = Object.keys(rowEventos).length;
        if (lengtEventos > 0) {
            for (var i = 0; i < lengtEventos; i++) {
                var data = {
                    ORIGEM: "EV",
                    CPFMOTORISTA: rowEventos[i].cpf,
                    MOTORISTA: rowEventos[i].motorista,
                    ID: rowEventos[i].id,
                    DOCUMENCTID: rowEventos[i].documentID,
                    CODEVENTO: rowEventos[i].codEvento,
                    EVENTO: rowEventos[i].nomEvento,
                    CONTATO: rowEventos[i].nomLead,
                    DATA: rowEventos[i].data,
                    // HORA: rowEventos[i].horRegistro,
                    TELEFONE: rowEventos[i].telefone,
                    CIDADE: rowEventos[i].cidade,
                    UF: rowEventos[i].codUF,
                    // IDCIDADE: rowEventos[i].idCidade,
                    CODPAIS: rowEventos[i].codPais,
                    PROFISSAO: rowEventos[i].profissao,
                    IDPIPE: rowEventos[i].idPipe,
                    IDFUNIL: rowEventos[i].idFunil,
                    FUNIL: rowEventos[i].funil,
                    IDGESTOR: rowEventos[i].idGestor,
                    OBSERVACAO: rowEventos[i].ObsLead,
                    LATITUDE: rowEventos[i].latitude,
                    LONGITUDE: rowEventos[i].longitude,
                    INDSITUACAO: rowEventos[i].indSituacao
                }
                wArrayData.push(data);
            }
        }

        wArray = {
            STATUS: ((lengthMovel + lengtEventos) > 0 ? true : false),
            RECORDS: (lengthMovel + lengtEventos),
            DATA: wArrayData
        };

		res.json(wArray);
		res.end();
    }

    async showRetornoFluig(req, res) {
        // ####### Validacao do JWT #######
        var wOjJWT = jwtController.validarJWT(req, res);
        if (!wOjJWT[0]) { return false; };
        const { codempresa, id } = wOjJWT[1]
        // ####### Validacao do JWT #######

        var indRetorno = req.query.indretorno;

        var wArray = [];

        if (indRetorno == 'V') {
            var wArrayData = [];
            const row = await MovelRepository.findRetornoVisita()
            var length = Object.keys(row).length;
            if (length > 0) {
                for (var i = 0; i < length; i++) {
                    var data = {
                        CODVISITA: row[i].id,
                        INDSYNC: row[i].indSync,
                        DOCUMENCTID: row[i].documentoID,
                        IDINTINARARIO: row[i].id_itinerario,
                        IDFLUIG: row[i].idfluig,
                        NOMCIDADE: row[i].cidade,
                        LOCAL: row[i].local,
                        TPLOCAL: row[i].tipLocal,
                        DATA: row[i].data,
                        HORA: row[i].hora,
                        CONTATO: row[i].contato,
                        TELEFONE: row[i].telefone,
                        EXPEDIENTE: row[i].expediente,
                        LATITUDE: row[i].latitude,
                        LONGITUDE: row[i].longitude,
                        INDSITUACAO: row[i].indSituacao,
                    }
                    wArrayData.push(data);
                }
            }
        }

        if (indRetorno == 'P') {
            var wArrayData = [];
            const row = await MovelRepository.findRetornoParceiros()
            var length = Object.keys(row).length;
            if (length > 0) {
                for (var i = 0; i < length; i++) {
                    var data = {
                        INDORIGEM: "PM",
                        CPFMOTORISTA: row[i].cpfmotorista,
                        MOTORISTA: row[i].motorista,
                        CPFESPECIFICADOR: row[i].cpfajudante,
                        ESPECIFICADOR: row[i].ajudante,
                        CAPTURA: row[i].indcaptura,
                        INDSYNC: row[i].indSync,
                        ID: row[i].id,
                        DOCUMENCTID: row[i].documentoID,
                        IDFLUIG: row[i].idFluig,
                        CODVISITA: row[i].codVisita,
                        LOCAL: row[i].local,
                        EMPRESA: row[i].empresa,
                        CONTATO: row[i].contato,
                        DATA: row[i].data,
                        HORA: row[i].hora,
                        TELEFONE: row[i].telefone,
                        UF: row[i].uf,
                        CODUF: row[i].codUf,
                        CIDADE: row[i].cidade,
                        IDCIDADE: row[i].idCidade,
                        IBGE: row[i].codIBGE,
                        CODPAIS: row[i].codPais,
                        PROFISSAO: row[i].profissao,
                        IDPIPE: row[i].idPipe,
                        INDCRM: row[i].indCRM,
                        IDFUNIL: row[i].idFunil,
                        IDSETORFUNIL: row[i].idSetorFunil,
                        FUNIL: row[i].funil,
                        VENDEDOR: row[i].nomVendedor,
                        MOTIVORECUSA: row[i].motivoRecusa,
                        OBSERVACAO: row[i].observacao,
                        LATITUDE: row[i].latitude,
                        LONGITUDE: row[i].longitude,
                        INDSITUACAO: row[i].indSituacao
                    }
                    wArrayData.push(data);
                }
            }
        }

        if (indRetorno == 'LEAD') {
            var wArrayData = [];
            const row = await MovelRepository.findRetornoEventos()
            var length = Object.keys(row).length;
            if (length > 0) {
                for (var i = 0; i < length; i++) {

                    var Funil = row[i].funil;
                    var idFunil = row[i].idFunil;
                    var idSetorFunil = row[i].idSetorFunil;
                    var idPipe = row[i].idPipe

                    if (row[i].evCodFunil != null) {
                        var Funil = row[i].evNomFunil;
                        var idFunil = row[i].evCodFunil;
                        var idSetorFunil = row[i].idSetorFunil;
                        var idPipe = row[i].evUsuario
                    }

                    var data = {
                        STATUS: "OK",
                        INDORIGEM: "EV",
                        CPFMOTORISTA: row[i].cpf,
                        MOTORISTA: row[i].motorista,
                        CPFESPECIFICADOR: "",
                        ESPECIFICADOR: "",
                        CAPTURA: row[i].motorista,
                        INDSYNC: row[i].indSync,
                        ID: row[i].numLead,
                        DOCUMENCTID: row[i].documentID,
                        // CODORIGEM: row[i].codOrigem,
                        CODEVENTO: row[i].codEvento,
                        NOME: row[i].nomLead,
                        EMAIL: row[i].email,
                        TELEFONE: row[i].numTelefone,
                        CODCIDADE: row[i].codCidade,
                        CIDADE: row[i].cidade,
                        UF: row[i].UF,
                        IBGE: row[i].codIBGE,
                        ENDERECO: row[i].nomEndereco,
                        BAIRRO: row[i].nomBairro,
                        PROFISSAO: row[i].profissao,
                        IDPIPE: idPipe,
                        INDCRM: row[i].indCRM,
                        IDFUNIL: idFunil,
                        IDSETORFUNIL: idSetorFunil,
                        FUNIL: Funil,
                        VENDEDOR: row[i].nomVendedor,
                        IDGESTOR: row[i].idGestor,
                        AMOSTRA: row[i].indAmostra,
                        INDDIVULGADOR: row[i].indDivulgador,
                        TAG: row[i].evTag,
                        OBSERVACAO: row[i].obsLead,
                        LATITUDE: row[i].latitude,
                        LONGITUDE: row[i].longitude,
                    }
                    wArrayData.push(data);
                }
            }
        }


        wArray.push({
            STATUS: (length > 0 ? true : false),
            RECORDS: length,
            DATA: wArrayData
        });

		res.json(wArray);
		res.end();
    }

    async storeRetornoFluig(req, res) {
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
                if (corpo[i].INDACAO == 'V') {
                    await MovelRepository.updateRetornoVisita(corpo[i]).then((resposta) => {
                        var data = {
                            STATUS: true
                        }
                        wArrayData.push(data)
                    });
                }

                if (corpo[i].INDACAO == 'P') {
                    if (reg[i].IDCARD != null) {
                        await MovelRepository.updateRetornoParceiro(corpo[i]).then((resposta) => {
                            var data = {
                                ID: corpo[i].ID
                            }
                            wArrayData.push(data)
                        });
                    }
                }

                if (corpo[i].INDACAO == 'L') {
                    if (reg[i].IDCARD != null) {
                        await MovelRepository.updateRetornoEvento(corpo[i]).then((resposta) => {
                            var data = {
                                ID: corpo[i].ID
                            }
                            wArrayData.push(data)
                        });
                    }
                }


            } catch (error) {
            }

        }
        wArray.push({
            STATUS: true,
            RECORDS: wArrayData.length,
            DATA: wArrayData
        });


		res.json(wArray);
		res.end();
    }

    async storeTipoLocal(req, res) {
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
                await MovelRepository.createTipoLocal(codempresa, corpo[i]).then((resposta) => {
                    var data = {
                        id: resposta
                    }
                    wArrayData.push(data)
                });
            } catch (error) {
            }
        }
        wArray.push({
            STATUS: true,
            RECORDS: wArrayData.length,
            DATA: []
        });

		res.json(wArray);
		res.end();
    }

    async storeTipoVisita(req, res) {
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
                await MovelRepository.createTipoVisita(codempresa, corpo[i]).then((resposta) => {
                    var data = {
                        id: resposta
                    }
                    wArrayData.push(data)
                });
            } catch (error) {
            }
        }
        wArray.push({
            STATUS: true,
            RECORDS: wArrayData.length,
            DATA: []
        });

		res.json(wArray);
		res.end();
    }

    async storeCidades(req, res) {
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
                await MovelRepository.createCidades(codempresa, corpo[i]).then((resposta) => {
                    var data = {
                        id: resposta
                    }
                    wArrayData.push(data)
                });
            } catch (error) {
            }
        }
        wArray.push({
            STATUS: true,
            RECORDS: wArrayData.length,
            DATA: []
        });

		res.json(wArray);
		res.end();
    }

    async storeVendedores(req, res) {
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
                await MovelRepository.createVendedores(corpo[i]).then((resposta) => {
                    var data = {
                        id: resposta.insertId
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
		res.end();
    }

    async updateInstalacao(req, res) {
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
		res.end();
    }

}



// padrão Singleton
export default new MovelController()
