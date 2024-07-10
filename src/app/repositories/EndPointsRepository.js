import { consulta } from '../database/conexao.js'

class EndPointsRepository {
    // CRUD

    findAll() {
        const sql = "SELECT " +
            "   e.method, " +
            "   e.endpoint, " +
            "   r.rota, " +
            "   e.endfunction  " +
            " FROM endpoints e " +
            "     inner join rota_endpoint r on(r.id = e.idrota) " +
            " where e.ind_situacao = 'A' "
        return consulta(sql, 'Não foi possível localizar!')
    }

    findAmbiente(pAmbiente) {
        const sql = "select rota from rota_endpoint where ambiente = ? "
        return consulta(sql, [pAmbiente], 'Não foi possível localizar!')
    }


}

export default new EndPointsRepository()
