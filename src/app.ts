import express, {Express, Request, Response} from 'express';
import cors from "cors";
import { allowedOrigins } from './constants/cors.constant';
import cookieParser from 'cookie-parser';

const corsOptions: cors.CorsOptions = {
    origin: function(origin, callback){
        if(allowedOrigins.indexOf(origin!) !== 1 || !origin){
            callback(null, true)
        } else {
            callback(new Error('Blocked by CORS policy'));
        }
    }
};

const app: Express = express();

// middlewares
app.use(cors(corsOptions));
app.use(express.json({limit: '200kb'}));
app.use(express.urlencoded({extended: true, limit: '50kb'}))
app.use(express.static("assets"));
app.use(cookieParser());

app.get('/health', (req: Request, res: Response)=>{
    const serverStatus = {serverStatus: 'Running'};
    res.json(serverStatus);
})

export { app }
