import express from 'express'
import routes from './routes.js'
import bodyParser from 'body-parser'
import cors from 'cors';


const app = express();

// indicar para o express ler body com json
app.use(cors({
    origin: '*'
}))



// app.use(express.json())
app.use(bodyParser.json({ limit: 1024 * 1024 * 20, type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true, limit: 1024 * 1024 * 20, type: 'application/json' }));
app.use(routes)


export default app
