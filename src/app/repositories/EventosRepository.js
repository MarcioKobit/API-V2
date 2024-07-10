import { consulta } from '../database/conexao.js'

class EventosRepository {
    // CRUD
    create(pcodEmpresa, reg) {
        var sql = "insert into eventos (codEmpresa, idFluig, documentID, codOrigem, nomEvento, datInicio, datFim, codCidade, nomEndereco, nomBairro, latitude, longitude, indSituacao) values ";
        sql += " (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'P')";
        return consulta(sql, [pcodEmpresa, reg.ID, reg.DOCUMENTID, reg.CODORIGEM, reg.EVENTO, reg.INICIO, reg.FIM, reg.CODCIDADE, reg.ENDERECO, reg.BAIRRO, reg.LATITUDE, reg.LONGITUDE], 'Não foi possível cadastrar!')
    }

    EventoUsuarios(pcodEmpresa, pcodEvento, reg) {
        var sql = "insert into usuarioEventos (codEvento, codUsuario, datInicio, datFim) values ";
        sql += " (?, (select codUsuario from usuarios where codEmpresa = ? and (login = ? or numCPF = ?)), ?, ?)";
        return consulta(sql, [pcodEvento, pcodEmpresa, reg.CPF, reg.CPF, reg.INICIO, reg.FIM], 'Não foi possível cadastrar!')
    }

    EventoLeads(pcodEmpresa, pcodUsuario, reg) {
        var sql = "INSERT INTO leadEventos (codEvento,codUsuario,idMobile,datRegistro,nomLead,email,numTelefone,codCidade,nomEndereco,nomBairro,codProfissao,idGestor,indAmostra,ObsLead,indDivulgador,latitude,longitude,indSituacao,indSync) values";
        sql += "  (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        return consulta(sql, [reg.IDEVENTO, pcodUsuario, reg.ID, reg.DATAREGISTRO, reg.NOMLEAD, reg.EMAIL, reg.TELEFONE, reg.CODCIDADE, reg.ENDERECO, reg.BAIRRO, reg.CODPROFISSAO, reg.IDGESTOR, reg.INDAMOSTRA, reg.OBSLEAD, reg.INDDIVULGADOR, reg.LATITUDE, reg.LONGITUDE, reg.INDSITUACAO, 'S'], 'Não foi possível cadastrar!')
    }

    findAll(pCodEmpresa, pCodUsuario) {

        var sql = "select ";
        sql += "    e.codEvento, ";
        sql += "    e.idFluig, ";
        sql += "    e.documentID, ";
        sql += "    e.nomEvento, ";
        sql += "    DATE_FORMAT( e.datInicio, '%Y-%m-%d' ) as datInico, ";
        sql += "    DATE_FORMAT( e.datFim, '%Y-%m-%d' ) as datFim, ";
        sql += "    e.codCidade, ";
        sql += "    c.cidade, ";
        sql += "    c.uf, ";
        sql += "    e.nomEndereco, ";
        sql += "    e.nomBairro, ";
        sql += "    e.latitude, ";
        sql += "    e.longitude, ";
        sql += "    e.indSituacao ";
        sql += "from eventos e  ";
        sql += "    inner join cidades c on (c.codCidade = e.codCidade) ";
        sql += "where e.codEmpresa = ? "
        sql += "  and (e.datInicio <= current_date() and e.datFim >= current_date())  "
        sql += "  and not exists (select 1 from usuarioEventos ue where ue.codEvento = e.codEvento) ";
        sql += "union all ";
        sql += "select 	 ";
        sql += "    e.codEvento, ";
        sql += "    e.idFluig, ";
        sql += "    e.documentID, ";
        sql += "    e.nomEvento, ";
        sql += "    DATE_FORMAT( e.datInicio, '%Y-%m-%d' ) as datInico, ";
        sql += "    DATE_FORMAT( e.datFim, '%Y-%m-%d' ) as datFim, ";
        sql += "    e.codCidade, ";
        sql += "    c.cidade, ";
        sql += "    c.uf, ";
        sql += "    e.nomEndereco, ";
        sql += "    e.nomBairro, ";
        sql += "    e.latitude, ";
        sql += "    e.longitude, ";
        sql += "    e.indSituacao from eventos e  ";
        sql += "    inner join cidades c on (c.codCidade = e.codCidade) ";
        sql += "    inner join usuarioEventos eu on (eu.codEvento = e.codEvento) ";
        sql += "                                and (eu.codUsuario = ?)";
        sql += "where e.codEmpresa = ?";
        sql += "  and (e.datInicio <= current_date() and e.datFim >= current_date()) ";

        return consulta(sql, [pCodEmpresa, pCodUsuario, pCodEmpresa], 'Não foi possível localizar!')
    }

    findLeadAll(pCodEmpresa, pCodUsuario, pCodEvento) {

        var sql = "";
        sql += "select ";
        sql += "    l.numLead as IDAPI, ";
        sql += "    l.codEvento as IDEVENTO, ";
        sql += "    l.idMobile as IDMOBILE, ";
        sql += "    DATE_FORMAT(l.datRegistro, '%Y-%m-%d' ) as datRegistro, ";
        sql += "    l.nomLead, ";
        sql += "    l.email, ";
        sql += "    l.numTelefone, ";
        sql += "    l.codCidade, ";
        sql += "    c.cidade, ";
        sql += "    c.uf, ";
        sql += "    l.nomEndereco, ";
        sql += "    l.nomBairro, ";
        sql += "    l.codProfissao, ";
        sql += "    p.Profissao, ";
        sql += "    COALESCE(l.idGestor,0) as idGestor, ";
        sql += "    l.indAmostra, ";
        sql += "    l.ObsLead, ";
        sql += "    COALESCE(l.latitude,0) as latitude, ";
        sql += "    COALESCE(l.longitude,0) as longitude, ";
        sql += "    l.indSituacao ";
        sql += "from leadEventos l ";
        sql += "    inner join cidades c on (c.codCidade = l.codCidade) ";
        sql += "    inner join profissoes p on (p.codEmpresa = ?) ";
        sql += "                           and (p.id = l.codProfissao) ";
        sql += "where l.codEvento = ?";
        sql += "  and l.codUsuario = ?";

        return consulta(sql, [pCodEmpresa, pCodEvento, pCodUsuario], 'Não foi possível localizar!')
    }

}

export default new EventosRepository()
