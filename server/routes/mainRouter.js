import express from "express";
import mediaRouter from "./mediaRouter.js";
import productRouter from "./productRouterRest.js";
import userRouter from "./userRouterRest.js";
import landingRouter from "./landingRouter.js";
import aboutRouter from "./aboutRouter.js";
import  upload from "../middlewares/multerMidd.js";
import uploadController from "../services/uploadImg.js"
//import mid from "../middlewares/middlewares.js";

const mainRouter = express.Router();
//mainRouter.use(mid.sanitizeBody);
//mainRouter.use(mid.sanitizeQuery);

mainRouter.post("/api/v1/imgupload", uploadController); //Ruta de subida de imagenes

mainRouter.use("/api/v1", productRouter);

mainRouter.use("/api/v1", landingRouter);

mainRouter.use("/api/v1", userRouter);

//mainRouter.use("/api/v1", mediaRouter);

//mainRouter.use("/api/v1", aboutRouter)

//mainRouter.use(mid.lostRoute)

export default mainRouter;
