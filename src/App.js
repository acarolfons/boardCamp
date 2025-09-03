import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routers/app.routes.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config()

const app = express();
app.use(express.json());
app.use(cors());

app.use(router)
app.use(errorHandler)

app.listen(process.env.PORT || 5000, () => {
    console.log(`Rodando na porta ${process.env.PORT}`)
})