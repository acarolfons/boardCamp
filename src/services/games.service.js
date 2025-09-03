import gameRepository from "../repositories/games.repository.js";
import { conflictError, badRequestError } from "../errors/error.js";

async function getGames() {
    const result = await gameRepository.getGamesRepository();
    return result.rows;
}

async function createGame({ name, image, stockTotal, pricePerDay }) {
    if (!name || !image || !stockTotal || !pricePerDay) 
        throw badRequestError("Todos os campos são obrigatórios");

    if (stockTotal <= 0 || pricePerDay <= 0) 
        throw badRequestError("stockTotal e pricePerDay devem ser maiores que 0");

    const gameExist = await gameRepository.gameExistRepository(name);
    if (gameExist.rows.length > 0) throw conflictError("Jogo");

    await gameRepository.createGameRepository(name, image, stockTotal, pricePerDay);
    return true;
}

export default { getGames, createGame };
