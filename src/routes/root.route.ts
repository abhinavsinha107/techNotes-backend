import express, {Request, Response} from "express";
import path from "path";

const router = express.Router();

router.get('^/$|/index(.html)?', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

router.get

export default router;