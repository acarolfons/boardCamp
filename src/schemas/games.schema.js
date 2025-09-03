import joi from "joi";

export const gamesSchema = joi.object({
    name: joi.string().trim().min(1).required(),
    image: joi.string().uri().required(),
    stockTotal: joi.number().integer().greater(0).required(),
    pricePerDay: joi.number().integer().greater(0).required(),
})