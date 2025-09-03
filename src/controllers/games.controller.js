import gamesService from "../services/games.service.js";

export async function getGames(req, res, next) {
    const games = await gamesService.getGames();
    res.status(200).send(games);
}

export async function createGame(req, res, next) {
    await gamesService.createGame(req.body);
    res.sendStatus(201);
}
