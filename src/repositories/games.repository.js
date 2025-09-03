import { db } from "../database/db.connection.js";

async function getGamesRepository(){
    const resultado = await db.query(`SELECT * FROM games;`)
    return resultado
}

async function gameExistRepository(name){
    const gameExist = await db.query(`SELECT * FROM games WHERE name=$1;`, [name])
    return gameExist
}

async function createGameRepository(name, image, stockTotal, pricePerDay){
    await db.query(`
        INSERT INTO games (name, image, "stockTotal", "pricePerDay") 
            VALUES ($1, $2, $3, $4);
        `, [name, image, stockTotal, pricePerDay])
}

const gameRepository = {
    getGamesRepository,
    gameExistRepository,
    createGameRepository
}

export default gameRepository