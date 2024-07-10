import { consulta } from '../database/conexao.js'

class PortalRepository {

    // CRUD
    createArquiteto(reg) {
        var sql = "insert into arquitetos (idPessoa, nome, cpfcnpj, email, senha, nr_cupom) values ( ?, ?, ?, ?, ?, ?)";
        return consulta(sql, [reg.IDPESSOA, reg.NOMUSUARIO, reg.CPFCNPJ, reg.EMAIL, reg.SENHA, reg.CUPOM], 'Não foi possível cadastrar!')
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

    findAll() {

        var sql = "select id, indtipo, titulo, '' as texto, pontos, convert(foto using utf8) as picture from premios where status = 'A'";
        return consulta(sql, 'Não foi possível localizar!')
    }

    findByID(idPremio) {

        var sql = "select id, indtipo, titulo, texto, pontos, convert(foto using utf8) as picture from premios where status = 'A' and id = ?";
        return consulta(sql, [idPremio], 'Não foi possível localizar!')
    }

    findNotByID(idPremio) {

        var sql = "select id, indtipo, titulo, texto, pontos, convert(foto using utf8) as picture from premios where status = 'A' and id <> ?";
        return consulta(sql, [idPremio], 'Não foi possível localizar!')
    }

    findPontosByID(idusuario) {

        var sql = "select codusuario, numpontos from pontos where codusuario = ?";
        return consulta(sql, [idusuario], 'Não foi possível localizar!')
    }

    findFotosByID(idPremio) {

        var sql = "select id, idpremio, convert(foto using utf8) as foto from premios_fotos where idpremio = ?";
        return consulta(sql, [idPremio], 'Não foi possível localizar!')
    }

    findExtratoByID(idUsuario) {

        var sql = "select idproposta, numproposta, nomcliente, valor, pontos, loja, DATE_FORMAT(datacompra, '%d/%m/%Y' ) as datacompra from extrato where codusuario = ?";
        return consulta(sql, [idUsuario], 'Não foi possível localizar!')
    }


}

export default new PortalRepository()
