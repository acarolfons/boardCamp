import { Router } from "express";
import { validateSchema } from "../middlewares/validation.middleware.js";
import { rentalSchema } from "../schemas/rental.schema.js";
import { createRental, getRentals, returnGameRental, deleteRental } from "../controllers/rentals.controller.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", validateSchema(rentalSchema), createRental);
rentalsRouter.post("/rentals/:id/return", returnGameRental);
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;