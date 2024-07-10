
const crypto = require("crypto");

module.exports = {
    fCcriptografar: function (senha) {
        return crypto.createHash('md5').update(senha).digest("hex");
    },
    EncodeBase64: function (valor) {
        let data = valor;
        var buff = new Buffer.from(data);
        return buff.toString('base64');
    },
    DecodeBase64: function (valor) {
        var buff = new Buffer.from(valor, 'base64');
        return buff.toString('ascii');
    },
    parseJwt: function (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }
}
