import express, {Request, Response, Express} from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/db.connection";

dotenv.config();

connectDB();

const app: Express = express();
const PORT = process.env.PORT || 5999;
const allowedOrigins = ['https://testdomain.com', 'http://localhost:4200']
const corsOptions: cors.CorsOptions = {
    origin: function(origin, callback){
        if(allowedOrigins.indexOf(origin!) !== 1 || !origin){
            callback(null, true)
        } else {
            callback(new Error('Blocked by CORS policy'));
        }
    }
};

const runServer = () => {
    app.use(cors(corsOptions));
    app.listen(PORT, ()=>{
        console.log(`motionshare server is listening on PORT: ${PORT}`)
    })
}

app.get('/health', (req: Request, res: Response)=>{
    const serverStatus = {serverStatus: 'Running'};
    res.json(serverStatus);
})

runServer();