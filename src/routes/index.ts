import express, {Router, Request, Response, NextFunction } from "express";
import MeasureController from "../controllers/measureController";
const measureController = new MeasureController();

const router: Router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.send('Hello, World!');
});

router.post("/",  async (req: Request, res: Response, next: NextFunction)  => {
    try {
        measureController.validateData(req.body);
        await measureController.validateMeasureMonth(req.body)
        const measure = await measureController.post(req.body)
        res.status(200).json(measure);
    } catch (error) {
        next(error);
    }
});

export default router;