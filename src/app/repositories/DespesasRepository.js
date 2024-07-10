import { consulta } from '../database/conexao.js'

class DespesasRepository {
    // CRUD

    findAllCategorias() {
        const sql = "SELECT id, descricao, ind_transacao FROM categorias where ind_situacao = 'A' "
        return consulta(sql, 'Não foi possível localizar!')
    }

    findAllPagamentos() {
        const sql = "SELECT id, descricao, debita_na_hora FROM pagamentos where ind_situacao = 'A'"
        return consulta(sql, 'Não foi possível localizar!')
    }

    findAllMovimentos(pIdEmpresa, pDataIni, pDataFim) {
        var sql = "select ";
        sql += "        m.id, ";
        sql += "        c.id as descategoria, ";
        sql += "        c.ind_transacao, ";
        sql += "        p.id as Pagamento, ";
        sql += "        p.debita_na_hora, ";
        sql += "        DATE_FORMAT(m.data_registro, '%d/%m/%Y') as data_registro, ";
        sql += "        m.descricao, ";
        sql += "        m.val_registro, ";
        sql += "        m.ind_situacao ";
        sql += "from movimento m ";
        sql += "    inner join categorias c on(c.id = m.id_categoria) ";
        sql += "    inner join pagamentos p on(p.id = m.id_pagamento) ";
        sql += "where m.id_empresa = ? "
        sql += "  and  m.data_registro between ? and ? "
        sql += " order by  m.data_registro"
        return consulta(sql, [pIdEmpresa, pDataIni, pDataFim], 'Não foi possível localizar!')
    }

    findTotais(pidEmpresa) {
        var sql = "select ";
        sql += "        sum( ";
        sql += "    case  ";
        sql += "        when c.ind_transacao = 'E' and p.debita_na_hora = 'S' then ";
        sql += "            m.val_registro ";
        sql += "    else ";
        sql += "    0 ";
        sql += "    end) as totalEntrada, ";
        sql += "    sum( ";
        sql += "    case ";
        sql += "        when c.ind_transacao = 'S' and p.debita_na_hora = 'S' then ";
        sql += "            m.val_registro ";
        sql += "        else ";
        sql += "        0 ";
        sql += "    end) as totalSaida ";
        sql += "from movimento m  ";
        sql += "    inner join categorias c on(c.id = m.id_categoria) ";
        sql += "    inner join pagamentos p on(p.id = m.id_pagamento)  ";
        sql += "where id_empresa = ?  ";
        return consulta(sql, [pidEmpresa], 'Não foi possível localizar!')
    }

    create(reg) {
        var sql = "insert into movimento (id_empresa, id_mobile, data_registro, id_categoria, id_pagamento, data_pagamento, descricao, val_registro, ind_situacao) values ";
        sql += "( ?,?,?,?,?,?,?,?,?)"
        return consulta(sql, [reg.empresa, reg.mobile, reg.data_registro, reg.categoria, reg.pagamento, reg.data_pagamento, reg.descricao, reg.valor, reg.situacao], 'Não foi possível cadastrar!')
    }

}

export default new DespesasRepository()
