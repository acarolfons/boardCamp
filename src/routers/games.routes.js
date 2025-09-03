import { Router } from "express";
import { validateSchema } from "../middlewares/validation.middleware.js";
import { gamesSchema } from "../schemas/games.schema.js";
import { createGame, getGames } from "../controllers/games.controller.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", validateSchema(gamesSchema), createGame);

export default gamesRouter;
