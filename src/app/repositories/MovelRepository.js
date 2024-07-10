import { consulta } from '../database/conexao.js'

class MovelRepository {

    // CRUD
    updateRetornoVisita(reg) {
        var sql = "UPDATE visitas set indSync = null where id = ?";
        return consulta(sql, [reg.ID], 'Não foi possível cadastrar!')
    }

    updateRetornoParceiro(reg) {
        var sql = "UPDATE parceiros set indSync = null, idCard = ? where id = ?";
        return consulta(sql, [reg[i].IDCARD, reg.ID], 'Não foi possível cadastrar!')
    }

    updateRetornoEvento(reg) {
        var sql = "UPDATE leadEventos set indSync = null, idCard = ? where numLead = ?";
        return consulta(sql, [reg[i].IDCARD, reg.ID], 'Não foi possível cadastrar!')
    }

    createTipoLocal(pCodEmpresa, reg) {
        var sql = "INSERT INTO tipolocal (codEmpresa, codLocal, descricao, indSituacao) values (?, ?, ?,'A')";
        return consulta(sql, [pCodEmpresa, reg.codigo, reg.descricao], 'Não foi possível cadastrar!')
    }

    createTipoVisita(pCodEmpresa, reg) {
        var sql = "INSERT INTO tipovisita (codEmpresa, codTipo, descricao, indSituacao) values (?, ?, ?, 'A')";
        return consulta(sql, [pCodEmpresa, reg.codigo, reg.descricao], 'Não foi possível cadastrar!')
    }

    createCidades(pCodEmpresa, reg) {
        var sql = "INSERT INTO cidades (codEmpresa, codCidade, idCidade, cidade, uf, codPais, codUF, codIBGE) values (?,?,?,?,?,?,?,?)";
        return consulta(sql, [pCodEmpresa, reg.codigo, reg.id, reg.cidade, reg.uf, reg.codpais, reg.coduf, reg.ibge], 'Não foi possível cadastrar!')
    }

    createVendedores(reg) {
        var idFunil = reg.indsis == 'CRM' ? reg.idcrm : reg.idpipedrive;
        var sql = "INSERT INTO vendedores (codProfissao, idFunil, nomVendedor, indDestino, indSituacao) values (?, ?, ?, ?, ?)";
        return consulta(sql, [reg.codprofissao, idFunil, reg.nomvendedor, reg.indsis, 'I'], 'Não foi possível cadastrar!')
    }

    findRotasAll(pCodEmpresa, pCodUsuario) {

        var sql = "";
        sql += " select "
        sql += "     ID,"
        sql += "     numPlaca,"
        sql += "     DATE_FORMAT( datInicio, '%Y-%m-%d' ) as datInicio,"
        sql += "     horInicio,"
        sql += "     DATE_FORMAT( datFim, '%Y-%m-%d' ) as datFim,"
        sql += "     horFim,"
        sql += "     titulo,"
        sql += "     detalhes,"
        sql += "     indSituacao"
        sql += " from rotas"
        sql += " where codEmpresa = ?"
        sql += " and (codUsuario = ?"
        sql += " or codAjudante = ? )"
        sql += " and indSituacao not in ('C','F')"
        sql += " and (datInicio <= current_date() and datfim >= curdate()) ";

        return consulta(sql, [pCodEmpresa, pCodUsuario, pCodUsuario], 'Não foi possível localizar!')
    }

    findCidadesAll(pCodRota) {
        var sql = "select id, codRota, cidade, DATE_FORMAT( datInicio, '%Y-%m-%d' ) as datInicio, ";
        sql += "DATE_FORMAT(datFim, '%Y-%m-%d') as datFim, expediente from rotas_cidades where codRota = ? ";

        return consulta(sql, [pCodRota], 'Não foi possível localizar!')
    }

    findVisitasAll(pCodCidade) {
        var sql = "select ";
        sql += "    v.id, ";
        sql += "    v.idMobile, ";
        sql += "    v.codCidade, ";
        sql += "    r.codRota,";
        sql += "    v.cidade, ";
        sql += "    v.local, ";
        sql += "    v.tipLocal, ";
        sql += "    DATE_FORMAT( v.data, '%Y-%m-%d' ) as data, ";
        sql += "    v.hora, ";
        sql += "    v.contato, ";
        sql += "    v.telefone, ";
        sql += "    v.expediente, ";
        sql += "    v.indSituacao ";
        sql += "from visitas v ";
        sql += "    inner join rotas_cidades r on (r.id = v.codCidade) ";
        sql += " where v.codCidade = ? ";

        return consulta(sql, [pCodCidade], 'Não foi possível localizar!')
    }

    findParceirosAll(pCodVisita) {
        var sql = "select id, idMobile, codVisita, empresa, contato, ";
        sql += " DATE_FORMAT(data, '%Y-%m-%d') as data, hora, telefone, cidade, ";
        sql += " interesse, areaInteresse, indSituacao, documentoID, IDFluig ";
        sql += " from parceiros where codVisita = ? ";

        return consulta(sql, [pCodVisita], 'Não foi possível localizar!')
    }

    findTipoLocal(pCodEmpresa) {
        var sql = "select codLocal, descricao from tipolocal where codEmpresa = ?";
        return consulta(sql, [pCodEmpresa], 'Não foi possível localizar!')
    }

    findCidades(pCodEmpresa) {
        var sql = "select codCidade, uf, cidade, COALESCE(codIBGE, 0) as codIBGE from cidades where codEmpresa = ?";
        return consulta(sql, [pCodEmpresa], 'Não foi possível localizar!')
    }

    findProfissoes(pCodEmpresa) {
        var sql = "select id, profissao, indGestor from profissoes where codEmpresa = ?";
        return consulta(sql, [pCodEmpresa], 'Não foi possível localizar!')
    }

    findResumo(pCodUsuario) {
        var sql = "select count(v.id) as numVisitas,";
        sql += "     (select count(*) from parceiros  ";
        sql += " where codUsuario = r.codUsuario ";
        sql += " and(year(data) = year(current_date()) and month(data) = month(current_date()))) as numParceiros";
        sql += " from rotas r ";
        sql += "     inner join rotas_cidades rc on(rc.codRota = r.id) ";
        sql += "     inner join visitas v on(v.codCidade = rc.id)";
        sql += "         and(year(v.data) = year(current_date()) and month(v.data) = month(current_date()))";
        sql += "         where(year(r.datInicio) = year(current_date()) and month(r.datInicio) = month(current_date()) or year(r.datfim) = year(current_date()) and month(r.datfim) = month(current_date()))";
        sql += "         and(r.codUsuario = ? or codAjudante = ?); ";
        return consulta(sql, [pCodUsuario, pCodUsuario], 'Não foi possível localizar!')
    }

    findVendedores() {
        var sql = "select ";
        sql += "    v.id, ";
        sql += "    v.codprofissao, ";
        sql += "    v.nomVendedor ";
        sql += "from vendedores v ";
        sql += "where v.indSituacao = 'A'";
        return consulta(sql, 'Não foi possível localizar!')
    }

    findPipeMovel(pDataIni, pDataFim) {
        var sql = "select ";
        sql += "   p.id,  ";
        sql += "   p.indSync,  ";
        sql += "   r.numPlaca,  ";
        sql += "   v.id as codVisita,  ";
        sql += "   v.tiplocal,  ";
        sql += "   v.local,  ";
        sql += "   v.documentoID,  ";
        sql += "   p.idFluig,  ";
        sql += "   p.contato,  ";
        sql += "   case ";
        sql += "       when p.id is not null then ";
        sql += "           DATE_FORMAT( p.data, '%d/%m/%Y' ) ";
        sql += "       else ";
        sql += "           DATE_FORMAT( v.data, '%d/%m/%Y' ) ";
        sql += "   end as data, ";
        sql += "   p.hora,  ";
        sql += "   p.empresa,  ";
        sql += "   p.telefone,  ";
        sql += "   case ";
        sql += "       when p.uf is not null then ";
        sql += "           p.uf ";
        sql += "       else ";
        sql += "           rc.uf ";
        sql += "   end as uf, ";
        sql += "   case ";
        sql += "       when p.cidade is not null then ";
        sql += "           p.cidade ";
        sql += "       else ";
        sql += "           rc.cidade ";
        sql += "   end as cidade,   ";
        sql += "   case ";
        sql += "       when c.idCidade is not null then ";
        sql += "           c.idCidade ";
        sql += "       else ";
        sql += "           cy.idCidade ";
        sql += "   end as idCidade,     ";
        sql += "   case ";
        sql += "       when c.codUf is not null then ";
        sql += "           c.codUf ";
        sql += "       else ";
        sql += "           cy.codUf ";
        sql += "   end as codUf,     ";
        sql += "   case ";
        sql += "       when c.codPais is not null then ";
        sql += "           c.codPais ";
        sql += "       else ";
        sql += "           cy.codPais ";
        sql += "   end as codPais,      ";
        sql += "   p.idProfissao,  ";
        sql += "   case  ";
        sql += "      when p.idProfissao is null then  ";
        sql += "          p.profissao  ";
        sql += "      else  ";
        sql += "          pr.profissao  ";
        sql += "   end as profissao,  ";
        sql += "   pr.idFunil,  ";
        sql += "   pr.funil, ";
        sql += "   case    ";
        sql += "      when p.idGestor <> 0 then   ";
        sql += "          p.idGestor   ";
        sql += "      else  ";
        sql += "          vend.id  ";
        sql += "   end as idGestor,       ";
        sql += "   case    ";
        sql += "      when pr.idDestinatario is not null then   ";
        sql += "          pr.idDestinatario   ";
        sql += "      else   ";
        sql += "          case    ";
        sql += "          when p.idGestor <> 0 then   ";
        sql += "              g.idFunil    ";
        sql += "          else  ";
        sql += "              vend.idFunil  ";
        sql += "          end  ";
        sql += "   end as idPipe,   ";
        sql += "   case    ";
        sql += "      when p.idGestor <> 0 then   ";
        sql += "          g.nomGestor   ";
        sql += "      else  ";
        sql += "          vend.nomVendedor  ";
        sql += "   end as nomGestor,   ";
        sql += "   p.motivoRecusa,  ";
        sql += "   p.observacao,  ";
        sql += "   case ";
        sql += "       when u.nomUsuario is not null then ";
        sql += "           p.latitude ";
        sql += "       else ";
        sql += "           v.latitude ";
        sql += "   end as latitude,     ";
        sql += "    case ";
        sql += "       when u.nomUsuario is not null then ";
        sql += "           p.longitude ";
        sql += "       else ";
        sql += "           v.longitude ";
        sql += "   end as longitude,  ";
        sql += "   p.indSituacao, ";
        sql += "   uv.login as cpfmotorista, ";
        sql += "   uv.nomUsuario as motorista, ";
        sql += "   case ";
        sql += "       when u.login <> uv.login then ";
        sql += "           u.login ";
        sql += "       else ";
        sql += "           null ";
        sql += "   end as cpfajudante, ";
        sql += "   case ";
        sql += "       when uv.nomUsuario <> u.nomUsuario then ";
        sql += "           u.nomUsuario ";
        sql += "       else ";
        sql += "           null ";
        sql += "   end as ajudante, ";
        sql += "   case ";
        sql += "       when u.nomUsuario is not null then ";
        sql += "           u.nomUsuario ";
        sql += "       else ";
        sql += "           uv.nomUsuario ";
        sql += "   end as indcaptura ";
        sql += "from visitas v  ";
        sql += "    inner join rotas_cidades rc on (rc.id = v.codCidade) ";
        sql += "    inner join rotas r on (r.id = rc.codRota) ";
        sql += "    left join parceiros p on (v.id = p.codVisita) ";
        sql += "    left join usuarios u on (u.codUsuario = p.codusuario) ";
        sql += "    left join usuarios uv on (uv.codUsuario = r.codusuario) ";
        sql += "    left join cidades c on (c.cidade = p.cidade) ";
        sql += "                        and (c.uf = p.uf) ";
        sql += "    left join cidades cy on (cy.cidade = rc.cidade) ";
        sql += "                        and (cy.uf = rc.uf) ";
        sql += "    left join profissoes pr on (pr.id = p.idProfissao) ";
        sql += "    left join gestorFunil g on (g.codProfissao = p.idProfissao) ";
        sql += "                           and (g.id = p.idGestor) ";
        sql += "    left join vendedores vend on (vend.codProfissao = p.idProfissao) ";
        sql += "                             and (vend.id = p.idVendedor) ";
        sql += "where v.data between ? and ? ";
        return consulta(sql, [pDataIni, pDataFim], 'Não foi possível localizar!')
    }

    findPipeEventos(pDataIni, pDataFim) {
        var sql = "select l.numLead as id, ";
        sql += "    e.codEvento, ";
        sql += "    e.nomEvento, ";
        sql += "    e.documentID, ";
        sql += "    l.nomLead, ";
        sql += "    DATE_FORMAT(l.datRegistro, '%d/%m/%Y' ) as data, ";
        sql += "    l.horRegistro, ";
        sql += "    l.email, ";
        sql += "    l.numTelefone as telefone, ";
        sql += "    c.UF as codUF, ";
        sql += "    c.cidade, ";
        sql += "    c.codPais, ";
        sql += "    l.codProfissao, ";
        sql += "    pr.profissao, ";
        sql += "    pr.idFunil,  ";
        sql += "    pr.funil,  ";
        sql += "    l.idGestor,   ";
        sql += "    case   ";
        sql += "        when pr.idDestinatario is not null then  ";
        sql += "            pr.idDestinatario  ";
        sql += "        else  ";
        sql += "            g.idFunil  ";
        sql += "    end as idPipe, ";
        sql += "    g.nomGestor,  ";
        sql += "    l.ObsLead,  ";
        sql += "    l.latitude,  ";
        sql += "    l.longitude,  ";
        sql += "    l.indSituacao  ";
        sql += "    ,u.nomUsuario as motorista  ";
        sql += "    ,u.login as cpf      ";
        sql += " ";
        sql += "from leadEventos l ";
        sql += "        inner join eventos e on (e.codEvento = l.codEvento) ";
        sql += "        inner join cidades c on (c.codCidade = l.codCidade) ";
        sql += "        inner join usuarios u on (u.codUsuario = l.codusuario) ";
        sql += "        left join profissoes pr on (pr.id = l.codProfissao) ";
        sql += "        left join gestorFunil g on (g.codProfissao = l.codProfissao)  ";
        sql += "                            and (g.id = l.idGestor)          ";
        sql += "where l.datRegistro between ? and ? ";
        return consulta(sql, [pDataIni, pDataFim], 'Não foi possível localizar!')
    }

    findRetornoVisita() {
        var sql = "select p.id, ";
        sql += "    p.indSync, ";
        sql += "    p.codVisita, ";
        sql += "    v.local, ";
        sql += "    p.documentoID, ";
        sql += "    p.idFluig, ";
        sql += "    p.contato, ";
        sql += "    DATE_FORMAT( p.data, '%d/%m/%Y' ) as data, ";
        sql += "    p.hora, ";
        sql += "    p.empresa, ";
        sql += "    p.telefone, ";
        sql += "    p.uf, ";
        sql += "    p.cidade, ";
        sql += "    c.idCidade, ";
        sql += "    c.codUf, ";
        sql += "    c.codPais, ";
        sql += "    c.codIBGE, ";
        sql += "    p.idProfissao, ";
        sql += "    case ";
        sql += "       when p.idProfissao is null then ";
        sql += "           p.profissao ";
        sql += "       else ";
        sql += "           pr.profissao ";
        sql += "    end as profissao, ";
        sql += "    pr.idFunil, ";
        sql += "    pr.idSetorFunil, ";
        sql += "    pr.funil, ";
        sql += "    case   ";
        sql += "        when pr.idDestinatario is not null then  ";
        sql += "            pr.indCRM  ";
        sql += "        else";
        sql += "            case   ";
        sql += "            when vend.indDestino = 'SIS' then  ";
        sql += "                1   ";
        sql += "            when vend.indDestino = 'CRM' then  ";
        sql += "                2 ";
        sql += "            else ";
        sql += "                pr.indCRM ";
        sql += "            end ";
        sql += "    end as indCRM,  ";
        sql += "   case   ";
        sql += "       when pr.idDestinatario is not null then  ";
        sql += "           pr.idDestinatario  ";
        sql += "       else  ";
        sql += "           case   ";
        sql += "           when p.idGestor <> 0 then  ";
        sql += "               g.idFunil   ";
        sql += "           else ";
        sql += "               vend.idFunil ";
        sql += "           end ";
        sql += "   end as idPipe,  ";
        sql += "   vend2.nomVendedor, ";
        sql += "    p.motivoRecusa, ";
        sql += "    p.observacao, ";
        sql += "    p.latitude, ";
        sql += "    p.longitude, ";
        sql += "    p.indSituacao, ";
        sql += "    uv.login as cpfmotorista, ";
        sql += "    uv.nomUsuario as motorista, ";
        sql += "   case ";
        sql += "       when u.login <> uv.login then ";
        sql += "           u.login ";
        sql += "       else ";
        sql += "           null ";
        sql += "   end as cpfajudante, ";
        sql += "   case ";
        sql += "       when uv.nomUsuario <> u.nomUsuario then ";
        sql += "           u.nomUsuario ";
        sql += "       else ";
        sql += "           null ";
        sql += "   end as ajudante, ";
        sql += "   case ";
        sql += "       when u.nomUsuario is not null then ";
        sql += "           u.nomUsuario ";
        sql += "       else ";
        sql += "           uv.nomUsuario ";
        sql += "   end as indcaptura ";
        sql += "from parceiros p  ";
        sql += "    inner join visitas v on (v.id = p.codVisita) ";
        sql += "    inner join rotas_cidades rc on (rc.id = v.codCidade) ";
        sql += "    inner join rotas r on (r.id = rc.codRota) ";
        sql += "    left join usuarios u on (u.codUsuario = p.codusuario) ";
        sql += "    left join usuarios uv on (uv.codUsuario = r.codusuario) ";
        sql += "    inner join cidades c on (c.cidade = p.cidade) ";
        sql += "                        and (c.uf = p.uf) ";
        sql += "    left join profissoes pr on (pr.id = p.idProfissao) ";
        sql += "    left join gestorFunil g on (g.codProfissao = p.idProfissao) ";
        sql += "                           and (g.id = p.idGestor) ";
        sql += "    left join vendedores vend on (vend.codProfissao = p.idProfissao) ";
        sql += "                           and (vend.id = p.idVendedor) ";
        sql += "    left join vendedores vend2 on (vend2.id = p.idVendedor) ";
        sql += "where p.indSync is not null ";
        return consulta(sql, 'Não foi possível localizar!')
    }

    findRetornoParceiros() {
        var sql = "select p.id, ";
        sql += "    p.indSync, ";
        sql += "    p.codVisita, ";
        sql += "    v.local, ";
        sql += "    p.documentoID, ";
        sql += "    p.idFluig, ";
        sql += "    p.contato, ";
        sql += "    DATE_FORMAT( p.data, '%d/%m/%Y' ) as data, ";
        sql += "    p.hora, ";
        sql += "    p.empresa, ";
        sql += "    p.telefone, ";
        sql += "    p.uf, ";
        sql += "    p.cidade, ";
        sql += "    c.idCidade, ";
        sql += "    c.codUf, ";
        sql += "    c.codPais, ";
        sql += "    c.codIBGE, ";
        sql += "    p.idProfissao, ";
        sql += "    case ";
        sql += "       when p.idProfissao is null then ";
        sql += "           p.profissao ";
        sql += "       else ";
        sql += "           pr.profissao ";
        sql += "    end as profissao, ";
        sql += "    pr.idFunil, ";
        sql += "    pr.idSetorFunil, ";
        sql += "    pr.funil, ";
        sql += "    case   ";
        sql += "        when pr.idDestinatario is not null then  ";
        sql += "            pr.indCRM  ";
        sql += "        else";
        sql += "            case   ";
        sql += "            when vend.indDestino = 'SIS' then  ";
        sql += "                1   ";
        sql += "            when vend.indDestino = 'CRM' then  ";
        sql += "                2 ";
        sql += "            else ";
        sql += "                pr.indCRM ";
        sql += "            end ";
        sql += "    end as indCRM,  ";
        sql += "   case   ";
        sql += "       when pr.idDestinatario is not null then  ";
        sql += "           pr.idDestinatario  ";
        sql += "       else  ";
        sql += "           case   ";
        sql += "           when p.idGestor <> 0 then  ";
        sql += "               g.idFunil   ";
        sql += "           else ";
        sql += "               vend.idFunil ";
        sql += "           end ";
        sql += "   end as idPipe,  ";
        sql += "   vend2.nomVendedor, ";
        sql += "    p.motivoRecusa, ";
        sql += "    p.observacao, ";
        sql += "    p.latitude, ";
        sql += "    p.longitude, ";
        sql += "    p.indSituacao, ";
        sql += "    uv.login as cpfmotorista, ";
        sql += "    uv.nomUsuario as motorista, ";
        sql += "   case ";
        sql += "       when u.login <> uv.login then ";
        sql += "           u.login ";
        sql += "       else ";
        sql += "           null ";
        sql += "   end as cpfajudante, ";
        sql += "   case ";
        sql += "       when uv.nomUsuario <> u.nomUsuario then ";
        sql += "           u.nomUsuario ";
        sql += "       else ";
        sql += "           null ";
        sql += "   end as ajudante, ";
        sql += "   case ";
        sql += "       when u.nomUsuario is not null then ";
        sql += "           u.nomUsuario ";
        sql += "       else ";
        sql += "           uv.nomUsuario ";
        sql += "   end as indcaptura ";
        sql += "from parceiros p  ";
        sql += "    inner join visitas v on (v.id = p.codVisita) ";
        sql += "    inner join rotas_cidades rc on (rc.id = v.codCidade) ";
        sql += "    inner join rotas r on (r.id = rc.codRota) ";
        sql += "    left join usuarios u on (u.codUsuario = p.codusuario) ";
        sql += "    left join usuarios uv on (uv.codUsuario = r.codusuario) ";
        sql += "    inner join cidades c on (c.cidade = p.cidade) ";
        sql += "                        and (c.uf = p.uf) ";
        sql += "    left join profissoes pr on (pr.id = p.idProfissao) ";
        sql += "    left join gestorFunil g on (g.codProfissao = p.idProfissao) ";
        sql += "                           and (g.id = p.idGestor) ";
        sql += "    left join vendedores vend on (vend.codProfissao = p.idProfissao) ";
        sql += "                           and (vend.id = p.idVendedor) ";
        sql += "    left join vendedores vend2 on (vend2.id = p.idVendedor) ";
        sql += "where p.indSync is not null ";
        return consulta(sql, 'Não foi possível localizar!')
    }

    findRetornoEventos() {
        var sql = "select  ";
        sql += "    l.indSync, ";
        sql += "    l.codEvento, ";
        sql += "    l.numLead, ";
        sql += "    e.documentID, ";
        sql += "    e.codOrigem, ";
        sql += "    l.nomLead, ";
        sql += "    l.email, ";
        sql += "    l.numTelefone, ";
        sql += "    l.codCidade, ";
        sql += "    c.codIBGE, ";
        sql += "    c.cidade, ";
        sql += "    c.UF, ";
        sql += "    l.nomEndereco, ";
        sql += "    l.nomBairro, ";
        sql += "    l.codProfissao,      ";
        sql += "    pr.profissao, ";
        sql += "    pr.indCRM, ";
        sql += "    pr.idFunil, ";
        sql += "    pr.idSetorFunil, ";
        sql += "    pr.funil, ";
        sql += "    l.idGestor,  ";
        sql += "    case  ";
        sql += "        when pr.idDestinatario is not null then ";
        sql += "            pr.idDestinatario ";
        sql += "        else ";
        sql += "            g.idFunil ";
        sql += "    end as idPipe, ";
        sql += "   vend.nomVendedor, ";
        sql += "    l.indAmostra, ";
        sql += "    l.indDivulgador, ";
        sql += "    l.obsLead, ";
        sql += "    l.latitude, ";
        sql += "    l.longitude, ";
        sql += "    evf.codFunil, ";
        sql += "    u.numCPF as cpf, ";
        sql += "    u.numCPF as cpf, ";
        sql += "    evf.codFunil as evCodFunil, ";
        sql += "    evf.codUsuario as evUsuario, ";
        sql += "    evf.codTag as evTag, ";
        sql += "    evf.denFunil as evNomFunil ";
        sql += "from leadEventos l  ";
        sql += "    inner join eventos e on (e.codEvento = l.codEvento) ";
        sql += "    inner join cidades c on (c.codCidade = l.codCidade) ";
        sql += "    left join usuarios u on (u.codUsuario = l.codusuario) ";
        sql += "    left join profissoes pr on (pr.id = l.codProfissao) ";
        sql += "    left join gestorFunil g on (g.codProfissao = l.codProfissao) ";
        sql += "                        and (g.id = l.idGestor)     ";
        sql += "    left join vendedores vend on (vend.codProfissao = l.codProfissao) ";
        sql += "                           and (vend.id = l.idGestor) ";
        sql += "    left join eventoFunil evf on (evf.codEvento = l.codEvento)  ";
        sql += "where l.indSync is not null ";
        return consulta(sql, 'Não foi possível localizar!')
    }

}

export default new MovelRepository()
