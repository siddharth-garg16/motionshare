import multer from "multer";
import path from 'path';

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        const uploadPath = path.resolve(__dirname, '../../public/temp');
        cb(null, uploadPath)
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
        cb(null, file.originalname + "-" + uniqueSuffix)
    }
})

export const upload = multer({storage: storage})