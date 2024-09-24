import { consulta } from '../database/conexao.js'

class InstalacoesRepository {

    // CRUD
    create(reg) {
        var sql = "insert into instalacoes (datregistro, idproposta, orderid, seqInstall, nomcliente, numtelefone, nomendereco, nombairro, numcep, nomcidade, uf, codusuario, datatribuido, datagendado, datAgendadoFim, indsituacao) values ";
        sql += "(current_date(),?, ?, ?, ?, ?, ?, ?, ?, ?, ?, (select codusuario from usuarios where login = ?), ?, ?, ?, 'P') ";
        return consulta(sql, [reg.PROPOSTA, reg.IDPROPOSTA, reg.SEQINSTALL, reg.CLIENTE, reg.NUMTELEFONE, reg.ENDERECO, reg.BAIRRO, reg.CEP, reg.CIDADE, reg.UF, reg.INSTALADOR, reg.DATATRIBUIDO, reg.DATAGENDA, reg.DATAGENDAFIM], 'Erro Instalador create!')
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
        return consulta(sql, [reg.IDINSTALACAO, reg.IDSERVICO, reg.ID], 'Erro ao delete instalacaoServicoFoto!')
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
		var sql = "update instalacoes set indSituacao = ?, latitudeR = ?, longitudeR = ?, observacao = ? where idInstalacao = ?";
		return consulta(sql, [reg.STATUS, reg.LATITUDE, reg.LONGITUDE, reg.IDSEROBSVICO, reg.IDINSTALACAO], 'Não foi possível atualizar instalacao 2!')
    }

    updateInstalacaoServico(reg) {
        var sql = "update instalacaoServico set indSituacao = ?  where id = ? and  idInstalacao = ?";
		return consulta(sql, [reg.STATUS, reg.IDSERVICO, reg.IDINSTALACAO], 'Não foi possível atualizar servico!')
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
		sql += "  and indSituacao in ('P','E')";

        return consulta(sql, [pCodUsuario], 'Erro Instalador findAll!')
    }

    findByID(idProposta, seqProposta) {

        var sql = "";
        sql += "select ";
        sql += "idInstalacao, "
        sql += "idProposta, ";
        sql += "orderid, ";
        sql += "indsituacao ";
        sql += "from instalacoes ";
        sql += "where orderid = ?"
        sql += "  and seqInstall = ?"

        return consulta(sql, [idProposta, seqProposta], 'Erro Instalador findByID!')
    }

    findServicoAll(pCodUsuario, pCodInstalacao) {
        var sql = "";
        sql += "select ";
        sql += "InsS.* ";
        sql += "from instalacaoServico InsS ";
        sql += "    inner join instalacoes i on (i.idInstalacao = InsS.idInstalacao) ";
		sql += "                            and i.indSituacao in ('P','E')  ";
        sql += "where i.codUsuario = ?";
        sql += " and i.idInstalacao = ?";
        sql += " and InsS.indSituacao = 'P'";

        return consulta(sql, [pCodUsuario, pCodInstalacao], 'Erro Instalador findServicoAll!')
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
