import "reflect-metadata";

import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import * as dotenv from "dotenv";

import config from "./config";
import routes from "./routes";

dotenv.config();

createConnection().then(async connection => {

    // create express app
    const app = express();

    app.get('/status', (req, res) => { res.status(200).end(); });
    app.head('/status', (req, res) => { res.status(200).end(); });
    app.enable('trust proxy');
  
    app.use(cors());
    app.use(require('morgan')('dev'));
    app.use(bodyParser.urlencoded({ extended: false }));
  
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());
  
    //Set all routes from routes folder
    app.use("/api", routes);
  
    app.use((req, res, next) => {
        const error : any = new Error("API Not found!");
        error.status = 404;
        next(error);
    });
  
    app.use((error, _req, res, next) => {
        res.status(error.status || 500);
        res.json({
            success: false,
            payload: null,
            message: `API :: ${error.message}`,
        });
        next();
    });
    
    const { port, host } = config;  
    app.listen(port, host, err => {
        if (err) {
        console.log(err);
        return;
        }
        console.log(`Server running at http://${host}:${port}/`);
    });

}).catch(error => console.log(error));
