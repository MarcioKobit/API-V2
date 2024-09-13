import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8890',
    // baseURL: 'https://localhost:443',
    // baseURL: 'http://52.67.34.79:8890',
    // baseURL: 'https://52.67.34.79:443',
    responseType: 'json',
})

class AUXController {

    async loginFortics() {
        try {

            var wRetorno = null;
            wRetorno = await api.post('https://pormadeportas.sz.chat/api/v4/auth/login', { email: 'luana@pormadeonline.com.br', password: '123456' });

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


}

export default new AUXController()
