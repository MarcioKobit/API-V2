import jwt from 'jsonwebtoken';
import crypto from 'crypto';
const { sign, verify } = jwt;

class JWTController {

	criarJWT(jSonDados, res) {
        try {
            const token = jwt.sign(jSonDados, process.env.SECRET);
            return [true, token];
        } catch (error) {
            res.status(403);
            res.end();
            return [false, null];
        }

    }

	validarJWT(req, res) {
        const jwt = req.headers["authorization"] || req.headers["x-access-token"];
        try {
			const verifycode = verify(jwt, process.env.SECRET);
			// console.log(verifycode)
            return [true, verifycode];
        } catch (error) {
            res.status(403);
            res.end();
            return [false, null];
        }
    }

	encryptPass(senha) {
        try {
            return [true, crypto.createHash('md5').update(senha).digest("hex")];
		} catch (error) {
            return [false, null];
        }
    }


}
// padrão Singleton
export default new JWTController()
