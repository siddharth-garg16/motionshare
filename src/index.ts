import dotenv from "dotenv";
import connectDB from "./db/db.connection";
import { app } from "./app";

dotenv.config();

connectDB()
.then(() => {
    runServer();
})
.catch((err)=>{
    console.log(err);
})

const runServer = () => {
    const PORT = process.env.PORT || 5999;
    app.listen(PORT, ()=>{
        console.log(`motionshare server is listening on PORT: ${PORT}`)
    })
}