import express, {Router, Request, Response, NextFunction } from "express";
//controller
import MeasureController from "../controllers/measureController";

const measureController = new MeasureController();

const router: Router = express.Router();

router.post("/upload",  async (req: Request, res: Response, next: NextFunction)  => {
    try {
        measureController.validateNewMeasureData(req.body);
        await measureController.validateMeasureMonth(req.body)
        const measure = await measureController.post(req.body)
        res.status(200).json(measure);
    } catch (error) {
        next(error);
    }
});

router.patch("/confirm",  async (req: Request, res: Response, next: NextFunction)  => {
    try {
        measureController.validateUpdateMeasureData(req.body);
        const hasUpdated = await measureController.patch(req.body)
        if(hasUpdated){
            res.status(200).json({success: true});
        }
    } catch (error) {
        next(error);
    }
});

router.get("/:customer_code/list",  async (req: Request, res: Response, next: NextFunction)  => {
    try {
        const measure_type = req.query.measure_type || null;
        const customer_code = req.params.customer_code
        const measures = await measureController.getCustomerList(req.params.customer_code, measure_type)
        res.status(200).json({customer_code: customer_code, measures: measures});
    } catch (error) {
        next(error);
    }
});

export default router;