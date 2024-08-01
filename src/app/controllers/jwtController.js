// import { Console } from 'console';
import jwt from 'jsonwebtoken';
// const crypto = require("crypto");
import crypto from 'crypto';
const { sign, verify } = jwt;

class JWTController {

    criar(jSonDados, res) {
        try {
            const token = jwt.sign(jSonDados, process.env.SECRET);
            return [true, token];
        } catch (error) {
            res.status(403);
            res.end();
            return [false, null];
        }

    }

    validar(req, res) {
        const jwt = req.headers["authorization"] || req.headers["x-access-token"];
        try {
            const verifycode = verify(jwt, process.env.SECRET);
            return [true, verifycode];
        } catch (error) {
            res.status(403);
            res.end();
            return [false, null];
        }
    }

    encrypt(senha) {
        try {
            return [true, crypto.createHash('md5').update(senha).digest("hex")];
        } catch (error) {
            // console.log(error)
            // res.status(403);
            // res.end();
            return [false, null];
        }
    }


}
// padrão Singleton
export default new JWTController()
