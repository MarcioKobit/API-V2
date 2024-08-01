import { consulta } from '../database/conexao.js'

class InstalacoesRepository {

    // CRUD
    create(reg) {
        var sql = "insert into instalacoes (datregistro, idproposta, orderid, seqInstall, nomcliente, numtelefone, nomendereco, nombairro, numcep, nomcidade, uf, codusuario, datatribuido, datagendado, indsituacao) values ";
        sql += "(current_date(),?, ?, ?, ?, ?, ?, ?, ?, ?, ?, (select codusuario from usuarios where login = ?), ?, ?, 'P') ";
        return consulta(sql, [reg.PROPOSTA, reg.IDPROPOSTA, reg.SEQINSTALL, reg.CLIENTE, reg.NUMTELEFONE, reg.ENDERECO, reg.BAIRRO, reg.CEP, reg.CIDADE, reg.UF, reg.INSTALADOR, reg.DATATRIBUIDO, reg.DATAGENDA], 'Não foi possível cadastrar!')
    }

    createinstalacoesServico(reg, regitem) {
        var sql = "insert into instalacaoServico (idinstalacao, idseq, descricao, indsituacao) values ((select idinstalacao from instalacoes where orderid = ? and seqInstall = ?), ?, ?, 'P') ";
        return consulta(sql, [reg.IDPROPOSTA, reg.SEQINSTALL, regitem.SEQ, regitem.DESCRICAO], 'Não foi possível cadastrar!')
    }

    createinstalacoesServicoFoto(reg) {
        var sql = "insert into instalacaoServicoFoto (idInstalacao, idServico, nomArquivo, foto) values (?, ?, ?, ?) ";
        return consulta(sql, [reg.IDINSTALACAO, reg.IDSERVICO, reg.NOMARQUIVO, reg.FOTO], 'Não foi possível cadastrar!')
    }

    removeServicoFoto(reg) {
        var sql = "delete from instalacaoServicoFoto where idInstalacao = ? and idServico = ? and id = ?";
        return consulta(sql, [reg.IDINSTALACAO, reg.IDSERVICO, reg.ID], 'Não foi possível cadastrar!')
    }

    removeServico(reg) {
        var sql = "delete from instalacaoServico where idInstalacao = (select idinstalacao from instalacoes where orderid = ? and seqInstall = ?) and indSituacao = 'P'";
        return consulta(sql, [reg.IDPROPOSTA, reg.SEQINSTALL], 'Não foi possível cadastrar!')
    }

    updateInstalacaoAgenda(reg) {
        var sql = "update instalacoes set datagendado = ?  where orderid = ? and seqInstall = ?";
        return consulta(sql, [reg.DATAGENDA, reg.IDPROPOSTA, reg.SEQINSTALL], 'Não foi possível atualizar!')
    }

    updateInstalacao(reg) {
        var sql = "update instalacoes set indSituacao = ? where idInstalacao = ?";
        return consulta(sql, [reg.STATUS, reg.IDINSTALACAO], 'Não foi possível cadastrar!')
    }

    updateInstalacaoServico(reg) {
        var sql = "update instalacaoServico set indSituacao = ?  where id = ? and  idInstalacao = ?";
        return consulta(sql, [reg.STATUS, reg.IDSERVICO, reg.IDINSTALACAO], 'Não foi possível cadastrar!')
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
        sql += "latitudeO, ";
        sql += "longitudeO ";
        sql += "from instalacoes ";
        sql += "where codUsuario = ?";
        sql += "  and indSituacao = 'P'";

        return consulta(sql, [pCodUsuario], 'Não foi possível localizar!')
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

        return consulta(sql, [idProposta, seqProposta], 'Não foi possível localizar!')
    }

    findServicoAll(pCodUsuario, pCodInstalacao) {
        var sql = "";
        sql += "select ";
        sql += "InsS.* ";
        sql += "from instalacaoServico InsS ";
        sql += "    inner join instalacoes i on (i.idInstalacao = InsS.idInstalacao) ";
        sql += "                            and i.indSituacao = 'P'  ";
        sql += "where i.codUsuario = ?";
        sql += " and i.idInstalacao = ?";
        sql += " and InsS.indSituacao = 'P'";

        return consulta(sql, [pCodUsuario, pCodInstalacao], 'Não foi possível localizar!')
    }

    findServicoByID(idInstalacao) {
        var sql = "select id, idInstalacao, idseq, descricao, indsituacao from instalacaoServico where idInstalacao = ?";
        return consulta(sql, [idInstalacao], 'Não foi possível localizar!')
    }
    findServicoByIDServ(idInstalacao, idServico) {
        var sql = "select id, idInstalacao, idseq, descricao, indsituacao from instalacaoServico where idInstalacao = ? and idSeq = ?";
        return consulta(sql, [idInstalacao, idServico], 'Não foi possível localizar!')
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

        return consulta(sql, [pCodUsuario], 'Não foi possível localizar!')
    }

    findServicoFotoAll(pCodInstalacao, pCodServico) {
        var sql = "select id, nomArquivo, foto from instalacaoServicoFoto where idInstalacao = ? and idServico = ?";
        return consulta(sql, [pCodInstalacao, pCodServico], 'Não foi possível localizar!');
    }

    findServicoFotoById(pCodInstalacao, pCodServico) {
        var sql = "select id, nomArquivo, convert(foto using utf8) as foto from instalacaoServicoFoto where idInstalacao = ? and idServico = ?";
        return consulta(sql, [pCodInstalacao, pCodServico], 'Não foi possível localizar!');
    }

    findServicoFotoByIdOld(pCodInstalacao, pCodServico) {
        var sql = "select id, nomArquivo, foto as foto from instalacaoServicoFoto_old where idInstalacao = ? and idServico = ?";
        return consulta(sql, [pCodInstalacao, pCodServico], 'Não foi possível localizar!');
    }

}

export default new InstalacoesRepository()
