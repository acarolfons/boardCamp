import rentalsRepository from "../repositories/rentals.repository.js";
import dayjs from "dayjs";
import { notFoundError, badRequestError, unavailableError } from "../errors/error.js";

async function getRentals() {
    const rentals = await rentalsRepository.getRentalsRepository();
    return rentals;
}

async function createRental({ customerId, gameId, daysRented }) {
    if (!customerId || !gameId || !daysRented || daysRented <= 0)
        throw badRequestError("customerId, gameId e daysRented são obrigatórios e daysRented > 0");

    const customer = await rentalsRepository.getCustomerById(customerId);
    if (!customer) throw notFoundError("Cliente");

    const game = await rentalsRepository.getGameById(gameId);
    if (!game) throw notFoundError("Jogo");

    const rentalsCount = await rentalsRepository.countOpenRentalsByGameId(gameId);
    if (rentalsCount >= game.stockTotal) throw unavailableError("Jogo");

    const rentDate = dayjs().format("YYYY-MM-DD");
    const originalPrice = daysRented * game.pricePerDay;

    await rentalsRepository.createRentalRepository(customerId, gameId, daysRented, rentDate, originalPrice);
    return true;
}

async function returnRental(id) {
    const rental = await rentalsRepository.getRentalById(id);
    if (!rental) throw notFoundError("Aluguel");
    if (rental.returnDate) throw unavailableError("Aluguel já devolvido");

    const returnDate = dayjs();
    const dueDate = dayjs(rental.rentDate).add(rental.daysRented, "day");
    const delayDays = returnDate.diff(dueDate, "day");
    const delayFee = delayDays > 0 ? delayDays * rental.pricePerDay : 0;

    await rentalsRepository.returnRentalRepository(id, returnDate.format("YYYY-MM-DD"), delayFee);
    return true;
}

async function deleteRental(id) {
    const rental = await rentalsRepository.getRentalById(id);
    if (!rental) throw notFoundError("Aluguel");
    if (!rental.returnDate) throw badRequestError("Não é possível deletar um aluguel não finalizado");

    await rentalsRepository.deleteRentalRepository(id);
    return true;
}

export default { getRentals, createRental, returnRental, deleteRental };
