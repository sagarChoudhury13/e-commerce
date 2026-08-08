import { Router } from "express";
import authRoutes from "./auth.ts";
import productsRoutes from "./products.ts";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/products", productsRoutes)

export default rootRouter;
