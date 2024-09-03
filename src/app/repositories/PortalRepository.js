import { consulta } from '../database/conexao.js'

class PortalRepository {

    // CRUD
    createArquiteto(reg) {
        var sql = "insert into arquitetos (idPessoa, nome, cpfcnpj, email, senha, nr_cupom) values ( ?, ?, ?, ?, ?, ?)";
        return consulta(sql, [reg.IDPESSOA, reg.NOMUSUARIO, reg.CPFCNPJ, reg.EMAIL, reg.SENHA, reg.CUPOM], 'Erro Portal createArquiteto!')
    }

    updateArquiteto(reg, pSituacao) {
        var sql = "update arquitetos set nome = ?, cpfcnpj = ?, email = ?, nr_cupom = ?, indSituacao = ? where idPessoa = ?";
        return consulta(sql, [reg.NOMUSUARIO, reg.CPFCNPJ, reg.EMAIL, reg.CUPOM, pSituacao, reg.IDPESSOA], 'Erro Portal updateArquiteto!')
    }

    createExtrato(reg) {
        var sql = "insert into extrato (idproposta, codusuario, numproposta, nomcliente, valor, pontos, loja, datacompra) values (?, (SELECT idArquiteto from arquitetos where idPessoa = ?), ?, ?, ?, ?, ?, ?)";
        return consulta(sql, [reg.IDPROPOSTA, reg.IDPESSOA, reg.PROPOSTA, reg.CLIENTE, reg.VALOR, parseInt(reg.VALOR), reg.EQUIPE, reg.EMISSAO], 'Não Incluir o extrato!')
    }

    createPremios(reg) {
        var sql = "insert into premios (idfluig, indtipo, titulo, texto, pontos, status) values (?, ?, ?, ?, ?, ?)";
        return consulta(sql, [reg.ID, (reg.RESGATE == true ? 'R' : 'A'), reg.TITULO, reg.TEXTO, parseInt(reg.PONTOS), 'A'], 'Não Incluir o Premio!')
    }

    createPremiosFotos(idpremio, reg) {
        var sql = "insert into premios_fotos (idpremio, idfluig, foto) values (?, ?, ?)";
        return consulta(sql, [idpremio, reg.ID, reg.FOTO], 'Não Incluir as fotos dos Premio!')
    }    

    findAll() {

        var sql = "select id, indtipo, titulo, '' as texto, pontos from premios where status = 'A'";
        return consulta(sql, 'Erro Portal findAll!')
    }

    findByID(idPremio) {

        var sql = "select id, indtipo, titulo, texto, pontos, convert(foto using utf8) as picture from premios where status = 'A' and id = ?";
        return consulta(sql, [idPremio], 'Erro Portal findByID!')
    }

    findNotByID(idPremio) {

        var sql = "select id, indtipo, titulo, texto, pontos, convert(foto using utf8) as picture from premios where status = 'A' and id <> ?";
        return consulta(sql, [idPremio], 'Erro Portal findNotByID!')
    }

    findPontosByID(idusuario) {

        var sql = "select codusuario, sum(pontos) as numpontos from extrato where codusuario = ?";
        return consulta(sql, [idusuario], 'Erro Portal findPontosByID!')
    }

    findFotosByID(idPremio) {

        var sql = "select id, idpremio, convert(foto using utf8) as foto from premios_fotos where idpremio = ?";
        return consulta(sql, [idPremio], 'Erro Portal findFotosByID!')
    }

    findExtratoByID(idUsuario) {

        var sql = "select idproposta, numproposta, nomcliente, valor, pontos, loja, DATE_FORMAT(datacompra, '%d/%m/%Y' ) as datacompra from extrato where codusuario = ?";
        return consulta(sql, [idUsuario], 'Erro Portal findExtratoByID!')
    }


}

export default new PortalRepository()
