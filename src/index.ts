import express, {Request, Response, Express} from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app: Express = express();
const PORT = process.env.PORT || 5999;

const runServer = () => {
    app.use(cors());
    app.listen(PORT, ()=>{
        console.log(`motionshare server is listening on PORT: ${PORT}`)
    })
}

app.get('/', (req: Request, res: Response)=>{
    const serverStatus = {serverStatus: 'Running'};
    res.json(serverStatus);
})

runServer();