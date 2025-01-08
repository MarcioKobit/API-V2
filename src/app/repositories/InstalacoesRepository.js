import { consulta } from '../database/conexao.js'

class InstalacoesRepository {

    // CRUD
    create(reg) {
        var sql = "insert into instalacoes (datregistro, idproposta, orderid, seqInstall, nomcliente, numtelefone, nomendereco, nombairro, numcep, nomcidade, uf, codusuario, datatribuido, datagendado, datAgendadoFim, indsituacao) values ";
		sql += "(current_date(),?, ?, ?, ?, ?, ?, ?, ?, ?, ?, (select codusuario from usuarios where login = ?), ?, ?, ?, ?) ";
		return consulta(sql, [reg.PROPOSTA, reg.IDPROPOSTA, reg.SEQINSTALL, reg.CLIENTE, reg.NUMTELEFONE, reg.ENDERECO, reg.BAIRRO, reg.CEP, reg.CIDADE, reg.UF, reg.INSTALADOR, reg.DATATRIBUIDO, reg.DATAGENDA, reg.DATAGENDAFIM, reg.DATAGENDA == 'null' ? 'A' : 'P'], 'Erro Instalador create!')
	}

	createinstalacoesAceite(reg) {
		var sql = "insert into instalacaoAceite (idinstalacao, numDocumento, urlDocumento, indsituacao) values ((select idinstalacao from instalacoes where orderid = ? and seqInstall = ?), ?, ?, 'P') ";
		return consulta(sql, [reg.IDPROPOSTA, reg.SEQINSTALL, reg.DOCUMENTO.ID, reg.DOCUMENTO.URLDOCUMENTO], 'Error ao cadastrar instalacaoAceite!')
	}

    createinstalacoesServico(reg, regitem) {
        var sql = "insert into instalacaoServico (idinstalacao, idseq, descricao, indsituacao) values ((select idinstalacao from instalacoes where orderid = ? and seqInstall = ?), ?, ?, 'P') ";
        return consulta(sql, [reg.IDPROPOSTA, reg.SEQINSTALL, regitem.SEQ, regitem.DESCRICAO], 'Error ao cadastrar instalacaoServico!')
    }

	createinstalacoesServicoFoto(reg) {
		var sql = "insert into instalacaoServicoFoto (idInstalacao, idServico, nomArquivo, foto) values (?, ?, ?, ?) ";
		return consulta(sql, [reg.IDINSTALACAO, reg.IDSERVICO, reg.NOMARQUIVO, reg.FOTO], 'Error ao cadastrar instalacaoServicoFoto!')
	}

	createFotoTMP(foto) {
		var sql = "insert into fototmp (foto) values (?) ";
		return consulta(sql, [foto, foto], 'Error ao foto TMP!')
	}

    removeServicoFoto(reg) {
        var sql = "delete from instalacaoServicoFoto where idInstalacao = ? and idServico = ? and id = ?";
		return consulta(sql, [reg.IDINSTALACAO, reg.IDSERVICO, reg.IDAPI], 'Erro ao delete instalacaoServicoFoto!')
    }

    removeServicoPendente(reg) {
        var sql = "delete from instalacaoServico where idInstalacao = (select idinstalacao from instalacoes where orderid = ? and seqInstall = ?) and indSituacao = 'P'";
        return consulta(sql, [reg.IDPROPOSTA, reg.SEQINSTALL], 'Erro ao deleter instalacao Pendente!')
    }

    removeServicoFotoPendente(reg) {
        var sql = "delete from instalacaoServicoFoto where idInstalacao = (select idinstalacao from instalacoes where orderid = ? and seqInstall = ?) and idServico in (select id from instalacaoServico where idInstalacao = (select idinstalacao from instalacoes where orderid = ? and seqInstall = ?) and indSituacao = 'P')";
        return consulta(sql, [reg.IDPROPOSTA, reg.SEQINSTALL, reg.IDPROPOSTA, reg.SEQINSTALL], 'Error ao deletar instalacao Foto Pendente!')
    }


    removeServicoGeral(reg) {
        var sql = "delete from instalacaoServico where idInstalacao = (select idinstalacao from instalacoes where orderid = ? and seqInstall = ?)";
        return consulta(sql, [reg.IDPROPOSTA, reg.SEQINSTALL], 'Erro deleter instalacao Servicao Geral!')
    }

    removeServicoFotoGeral(reg) {
        var sql = "delete from instalacaoServicoFoto where idInstalacao = (select idinstalacao from instalacoes where orderid = ? and seqInstall = ?)";
        return consulta(sql, [reg.IDPROPOSTA, reg.SEQINSTALL], 'Erro deleter instalacao Servicao Foto Geral!')
    }


    removeInstalacaoGeral(reg) {
        var sql = "delete from instalacoes where orderid = ? and seqInstall = ?";
        return consulta(sql, [reg.IDPROPOSTA, reg.SEQINSTALL], 'Erro deleter instalacao Geral!')
    }

    updateInstalacaoAgenda(reg) {
        var sql = "update instalacoes set datagendado = ?, datAgendadoFim = ?  where orderid = ? and seqInstall = ?";
        return consulta(sql, [reg.DATAGENDA, reg.DATAGENDAFIM, reg.IDPROPOSTA, reg.SEQINSTALL], 'Não foi possível atualizar instalacao!')
    }

	updateInstalacao(reg) {
		var sql = "update instalacoes set datagendado = ?, datAgendadoFim = ?, indSituacao = ?, latitudeR = ?, longitudeR = ?, observacao = ? where idInstalacao = ?";
		return consulta(sql, [reg.DATAAGENDAINI, reg.DATAAGENDAFIM, reg.STATUS, reg.LATITUDE, reg.LONGITUDE, reg.OBS, reg.IDINSTALACAO], 'Não foi possível atualizar instalacao 2!')
	}

	updateInstalacaoAceite(reg) {
		var sql = "update instalacaoAceite set datAceite = ?, aceite = ?, foto = ?, latitude = ?, longitude = ?, observacao = ?, indsituacao = ? where idInstalacao = ?";
		return consulta(sql, [reg.DATA, reg.ACEITE, reg.FOTO, reg.LATITUDE, reg.LONGITUDE, reg.OBS, reg.STATUS, reg.IDINSTALACAO], 'Não foi possível atualizar Aceite!')
	}

    updateInstalacaoServico(reg) {
        var sql = "update instalacaoServico set indSituacao = ?  where id = ? and  idInstalacao = ?";
		return consulta(sql, [reg.SITUACAO, reg.IDSERVICO, reg.IDINSTALACAO], 'Não foi possível atualizar servico!')
	}

	findLogByID(endpoint) {
		var sql = "";
		sql += "select indLog from log_endpoint where endpoint = ? ";
		return consulta(sql, [endpoint], 'Erro findLogByID!')
	}

	createlog(reg) {
		var sql = "insert into log_endpoint_data (endpoint, datregistro, codUsuario, json) values (?, current_timestamp(), ?, ?) ";
		return consulta(sql, [reg.endPoint, reg.codUsuario, reg.json], 'Error createlog!')
	}

    findAll(pCodUsuario) {

        var sql = "";
        sql += "select ";
        sql += "idInstalacao, "
        sql += "idProposta, ";
        sql += "orderid, ";
        sql += "numTelefone, ";
        sql += "nomCliente, ";
        sql += "nomEndereco, ";
        sql += "nombairro, ";
        sql += "numCEP, ";
        sql += "nomCidade, ";
        sql += "uf, ";
        sql += "DATE_FORMAT(datAgendado, '%Y-%m-%d' ) as datAgendado, ";
        sql += "DATE_FORMAT(datAgendadofim, '%Y-%m-%d' ) as datAgendadofim, ";
        sql += "latitudeO, ";
        sql += "longitudeO, ";
        sql += "indSituacao ";
        sql += "from instalacoes ";
        sql += "where codUsuario = ? ";
		sql += "  and indSituacao in ('P','E','A','K')";

        return consulta(sql, [pCodUsuario], 'Erro Instalador findAll!')
    }

    findByID(idProposta, seqProposta) {

        var sql = "";
        sql += "select ";
        sql += "idInstalacao, "
        sql += "idProposta, ";
		sql += "orderid, ";
		sql += "datAgendado, ";
		sql += "datAgendadoFim, ";
		sql += "observacao, ";
		sql += "latitudeR, ";
		sql += "longitudeR, ";
		sql += "indsituacao ";
        sql += "from instalacoes ";
        sql += "where orderid = ?"
        sql += "  and seqInstall = ?"

        return consulta(sql, [idProposta, seqProposta], 'Erro Instalador findByID!')
	}

	findLogByIdAll(pCodUsuario, pCodInstalacao) {
		var sql = "";
		if (pCodInstalacao != null && pCodInstalacao != '') {
			sql = "  and  convert(JSON using utf8) like '%" + pCodInstalacao + "%' ";
		}
		sql += "select sequence, endpoint, datRegistro, convert(JSON using utf8) as json from log_endpoint_data where codUsuario = ? " + sql;
		return consulta(sql, [pCodUsuario], 'Erro Instalador findAceiteAll!')
	}

	findAceiteAll(pCodInstalacao) {
		var sql = "";
		sql += "select numDocumento, urlDocumento from instalacaoAceite where idInstalacao = ? ";
		return consulta(sql, [pCodInstalacao], 'Erro Instalador findAceiteAll!')
	}

	findServicoAll(pCodUsuario, pCodInstalacao) {
		var sql = "";
		sql += "select ";
		sql += "InsS.* ";
		sql += "from instalacaoServico InsS ";
		sql += "    inner join instalacoes i on (i.idInstalacao = InsS.idInstalacao) ";
		sql += "                            and i.indSituacao in ('P','E','A')  ";
		sql += "where i.codUsuario = ?";
		sql += " and i.idInstalacao = ?";
		sql += " and InsS.indSituacao = 'P'";

		return consulta(sql, [pCodUsuario, pCodInstalacao], 'Erro Instalador findServicoAll!')
	}

	findAceiteById(pCodInstalacao, aceite) {
		var wComple = '';
		if (aceite != undefined && aceite != '') {
			wComple = ', convert(foto using utf8) as foto';
		}
		var sql = `select numDocumento, datAceite, aceite ${wComple}, latitude, longitude, observacao, indSituacao from instalacaoAceite where idInstalacao = ?`;
		return consulta(sql, [pCodInstalacao], 'Erro findAceiteById!');
	}

    findServicoByID(idInstalacao) {
        var sql = "select id, idInstalacao, idseq, descricao, indsituacao from instalacaoServico where idInstalacao = ?";
        return consulta(sql, [idInstalacao], 'Erro Instalador findServicoByID!')
    }

    findServicoByIDServ(idInstalacao, idServico) {
        var sql = "select id, idInstalacao, idseq, descricao, indsituacao from instalacaoServico where idInstalacao = ? and idSeq = ?";
        return consulta(sql, [idInstalacao, idServico], 'Erro Instalador findServicoByIDServ!')
    }

    findServicoByUser(pCodUsuario) {
        var sql = "";
        sql += "select ";
        sql += "InsS.* ";
        sql += "from instalacaoServico InsS ";
        sql += "    inner join instalacoes i on (i.idInstalacao = InsS.idInstalacao) ";
        sql += "                            and i.indSituacao = 'P'  ";
        sql += "where i.codUsuario = ?";
        sql += " and InsS.indSituacao = 'P'";

        return consulta(sql, [pCodUsuario], 'Erro Instalador findServicoByUser!')
    }

    findServicoFotoAll(pCodInstalacao, pCodServico) {
        var sql = "select id, nomArquivo, convert(foto using utf8) as foto from instalacaoServicoFoto where idInstalacao = ? and idServico = ?";
        return consulta(sql, [pCodInstalacao, pCodServico], 'Erro Instalador findServicoFotoAll!');
    }

    findServicoFotoById(pCodInstalacao, pCodServico) {
        var sql = "select id, nomArquivo, convert(foto using utf8) as foto from instalacaoServicoFoto where idInstalacao = ? and idServico = ?";
        return consulta(sql, [pCodInstalacao, pCodServico], 'Erro Instalador findServicoFotoById!');
    }

    findServicoFotoByIdOld(pCodInstalacao, pCodServico) {
        var sql = "select id, nomArquivo, foto as foto from instalacaoServicoFoto_old where idInstalacao = ? and idServico = ?";
        return consulta(sql, [pCodInstalacao, pCodServico], 'Erro Instalador findServicoFotoByIdOld!');
    }

}

export default new InstalacoesRepository()
