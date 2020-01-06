import "reflect-metadata";

import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import * as dotenv from "dotenv";

import routes from "./routes/";

dotenv.config();

createConnection().then(async connection => {

    // create express app
    const app = express();

    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());

    //Set all routes from routes folder
    app.use("/", routes);
    // start express server

    const HOST = process.env.HOST || "127.0.0.1";
    const PORT = parseInt(process.env.PORT, 10) || 3000;
    
    app.listen(PORT, HOST, () => {
        console.log(`Server running at http://${HOST}:${PORT}/`);
    });

}).catch(error => console.log(error));
