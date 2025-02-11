
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

        // var wAmbiente = '';
        var wAmbiente = (process.env.AMBIENTE != undefined && process.env.AMBIENTE != '' ? process.env.AMBIENTE : 'PRD')
        // console.log('Amb: ' + wAmbiente);


        const row = await EndPointsRepository.findAll(wAmbiente)
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
