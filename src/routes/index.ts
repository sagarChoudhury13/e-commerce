import { Router } from "express";
import authRoutes from "./auth.ts";
import productsRoutes from "./products.ts";
import { userRoutes } from "./users.ts";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/products", productsRoutes)
rootRouter.use("/user", userRoutes)

export default rootRouter;
