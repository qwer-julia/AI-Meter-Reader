import express, {Router, Request, Response, NextFunction } from "express";
import MeasureController from "../controllers/measureController";

const measureController = new MeasureController();

const router: Router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.send('Hello, World!');
});

router.post("/",  (req: Request, res: Response, next: NextFunction) => {
    try {
        measureController.post(req.body)

        res.status(200).json({ message: 'Data is valid!' });
    } catch (error) {
        next(error);
    }
});

export default router;