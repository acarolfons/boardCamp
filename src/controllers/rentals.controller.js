import rentalsService from "../services/rentals.service.js";

export async function getRentals(req, res, next) {
    const rentals = await rentalsService.getRentals();
    res.status(200).send(rentals);
}

export async function createRental(req, res, next) {
    await rentalsService.createRental(req.body);
    res.sendStatus(201);
}

export async function returnGameRental(req, res, next) {
    await rentalsService.returnRental(req.params.id);
    res.sendStatus(200);
}

export async function deleteRental(req, res, next) {
    await rentalsService.deleteRental(req.params.id);
    res.sendStatus(200);
}
