
// import DespesasRepository from '../repositories/DespesasRepository.js';
import EndPointsRepository from '../repositories/EndPointsRepository.js';

class EndPointController {

    async listar(req, res) {
        var wArray = [];
        wArray.push({
            STATUS: false,
            RECORDS: 0,
            DATA: []
        });

        const row = await EndPointsRepository.findAll()
        var length = Object.keys(row).length;
        if (length > 0) {
            wArray.length = 0;
            wArray.push({
                STATUS: true,
                RECORDS: length,
                DATA: row
            });
        }
        return wArray;
    }
}

export default new EndPointController()