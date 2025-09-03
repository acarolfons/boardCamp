import { Router } from "express";
import { validateSchema } from "../middlewares/validation.middleware.js";
import { customerSchema } from "../schemas/customers.schema.js";
import { createCustomer, getCustomers, getCustomersById } from "../controllers/customers.controller.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomersById);
customersRouter.post("/customers", validateSchema(customerSchema), createCustomer);

export default customersRouter;
