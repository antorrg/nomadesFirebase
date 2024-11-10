import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import env from './envConfig.js'
import sm from "./middlewares/serverMiddlewares.js";
import mainRouter from './routes/mainRouter.js'
import path from 'path'


const dirname = path.resolve()
const server = express();

server.use(morgan("dev"));
server.use(cors());
//server.use(helmet())
server.use(express.json());
server.use(sm.validJson);
server.use(express.static(path.join(dirname, 'dist')))

server.use(mainRouter)



server.get('*', (req, res) => {
    res.sendFile(path.join(dirname, 'dist', 'index.html'));
  });

server.use(sm.lostRoute);
server.use(sm.errorEndWare);

export default server;