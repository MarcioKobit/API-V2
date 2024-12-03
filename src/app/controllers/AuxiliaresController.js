import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8890',
    responseType: 'json',
})

class AUXController {

    async loginFortics(pParamFortics) {
        try {

            var wRetorno = null;
            // wRetorno = await api.post('https://pormadeportas.sz.chat/api/v4/auth/login', { email: 'luana@pormadeonline.com.br', password: '123456' });
            wRetorno = await api.post('https://pormadeportas.sz.chat/api/v4/auth/login', pParamFortics);

            return [true, wRetorno];
        } catch (error) {
            return [false, null];
        }

    }

    async enviaMensagem(pJson, pBearerToken) {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + pBearerToken
            }

            var wRetorno = null;
            wRetorno = await api.post('https://pormadeportas.sz.chat/api/v4/message/send', pJson, { headers: headers });

            return [true, wRetorno];
        } catch (error) {
            return [false, null];
        }

    }

    async getDadosSYS(pIdPessoa, pToken) {
        try {
            const headers = {
                'Content-Type': 'keep-alive',
                'Token': pToken
            }

            var wRetorno = null;
            const ObjSYS = await api.get('https://sis.pormadeonline.com.br/api.rule?sys=PON&service=getPerson&field=personId&filter=' + pIdPessoa, { headers: headers });
            wRetorno = ObjSYS.data.getPerson.success == true ? ObjSYS.data.getPerson.data[0] : null;

            return [wRetorno != null ? true : false, wRetorno];
        } catch (error) {
            console.log(error)
            return [false, null];
        }
    }

    async getDadosCEP(pCEP) {
        try {

            var wRetorno = null;
            const ObjCEP = await api.get('https://viacep.com.br/ws/' + pCEP + '/json/');
            wRetorno = ObjCEP.data;

            return [wRetorno.cep != undefined ? true : false, wRetorno];
        } catch (error) {
            console.log(error)
            return [false, null];
        }
	}
}

export default new AUXController()
