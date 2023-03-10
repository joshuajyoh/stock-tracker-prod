import express from "express";
import FinanceRoutes from "./finance.js";
import SessionRoutes from "./session.js";
import UserRoutes from "./user.js";

export default class StockTrackerRoutes {
    static setup() {
        const stockTrackerRouter = express.Router();

        stockTrackerRouter.use('/user', UserRoutes.setup());
        stockTrackerRouter.use('/finance', FinanceRoutes.setup());
        stockTrackerRouter.use('/session', SessionRoutes.setup());

        return stockTrackerRouter;
    }
}