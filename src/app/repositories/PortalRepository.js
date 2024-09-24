import { consulta } from '../database/conexao.js'

class PortalRepository {

    // CRUD
    createArquiteto(reg) {
		var sql = "insert into arquitetos (idPessoa, nome, cpfcnpj, email, senha, nr_cupom, telefone, indSituacao) values ( ?, ?, ?, ?, ?, ?, ?, ?)";
		return consulta(sql, [reg.IDPESSOA, reg.NOMUSUARIO, reg.CPFCNPJ, reg.EMAIL, reg.SENHA, reg.CUPOM, reg.TELEFONE, (reg.SITARQ == false || reg.SITPESSOA == false ? 'I' : 'A')], 'Erro Portal createArquiteto!')
    }

	updateArquiteto(reg) {
		var sql = "update arquitetos set nome = ?, cpfcnpj = ?, email = ?, nr_cupom = ?, telefone = ?, indSituacao = ? where idPessoa = ?";
		return consulta(sql, [reg.NOMUSUARIO, reg.CPFCNPJ, reg.EMAIL, reg.CUPOM, reg.TELEFONE, (reg.SITARQ == false || reg.SITPESSOA == false ? 'I' : 'A'), reg.IDPESSOA], 'Erro Portal updateArquiteto!')
    }

	createExtrato(reg) {
		var sql = "insert into extrato (idproposta, codusuario, numproposta, nomcliente, valor, pontos, loja, datacompra) values (?, (SELECT idArquiteto from arquitetos where idPessoa = ?), ?, ?, ?, ?, ?, ?)";
		return consulta(sql, [reg.IDPROPOSTA, reg.IDPESSOA, reg.PROPOSTA, reg.CLIENTE, reg.VALOR, parseInt(reg.VALOR), reg.EQUIPE, reg.EMISSAO], 'Não Incluir o extrato!')
	}

	createPremios(reg) {
		var sql = "insert into premios (idfluig, indtipo, titulo, dataInicio, datafinal, texto, pontos, status) values (?, ?, ?, ?, ?, ?, ?, ?)";
		return consulta(sql, [reg.ID, (reg.RESGATE == true ? 'R' : 'A'), reg.TITULO, reg.DATAINIRESGATE, reg.DATAFIMRESGATE, reg.TEXTO, parseInt(reg.PONTOS), 'A'], 'Não Incluir o Premio!')
	}

	updatePremios(reg) {
		var sql = "update premios  set titulo = ?, dataInicio = ?, datafinal = ?, texto = ?, pontos = ? where idfluig = ?";
		return consulta(sql, [reg.TITULO, reg.DATAINIRESGATE, reg.DATAFIMRESGATE, reg.TEXTO, parseInt(reg.PONTOS), reg.ID], 'Não Atualizar os Premio!')
	}

	deletePremiosFotos(reg) {
		var sql = "delete from premios_fotos where idpremio = (select id from premios where idfluig = ?)";
		return consulta(sql, [reg.ID], 'Não excluir as fotos dos Premio!')
	}

	createPremiosFotos(idpremio, reg) {
		var sql = "insert into premios_fotos (idpremio, idfluig, foto) values (?, ?, ?)";
		return consulta(sql, [idpremio, reg.ID, reg.FOTO], 'Não Incluir as fotos dos Premio!')
	}

	createUpdateArquiteto(reg) {
		var sql = "INSERT INTO arquitetosDados (idArquiteto,nome,cep,endereco,numero,uf,cidade,bairro,complemento,celular,indAplicado) VALUES (?,?,?,?,?,?,?,?,?,?,?);";
		return consulta(sql, [idpremio, reg.ID, reg.FOTO], 'Não foi possivel atualizar dados!')
	}

    findAll() {
        var sql = "select id, indtipo, titulo, texto, pontos, DATE_FORMAT(datainicio, '%d/%m/%Y' ) as datainicio, DATE_FORMAT(datafinal, '%d/%m/%Y' ) as datafinal from premios where status = 'A'";
        return consulta(sql, 'Erro Portal findAll!')
    }

    findByID(idPremio) {
        var sql = "select id, indtipo, titulo, texto, pontos, DATE_FORMAT(datainicio, '%d/%m/%Y' ) as datainicio, DATE_FORMAT(datafinal, '%d/%m/%Y' ) as datafinal from premios where status = 'A' and id = ?";
        return consulta(sql, [idPremio], 'Erro Portal findByID!')
    }

    findNotByID(idPremio) {
        var sql = "select id, indtipo, titulo, texto, pontos, DATE_FORMAT(datainicio, '%d/%m/%Y' ) as datainicio, DATE_FORMAT(datafinal, '%d/%m/%Y' ) as datafinal from premios where status = 'A' and id <> ?";
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

    findFaq() {
        var sql = "select id, topico from faq_portal where situacao = 'A'";
        return consulta(sql, 'Erro Portal findFaq!')
    }

    findFaqItem(idFaq) {
        var sql = "select id, titulo, texto from faq_portal_item where id_topico = ?";
        return consulta(sql, [idFaq], 'Erro Portal findFaqItem!')
    }

	findAllUF() {
		var sql = "select distinct uf as value, uf as label from cidades order by uf";
		return consulta(sql, 'Erro Movel findCidades!')
	}


}

export default new PortalRepository()
