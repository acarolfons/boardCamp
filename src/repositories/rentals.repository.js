import { db } from "../database/db.connection.js";
import dayjs from "dayjs";

async function getRentalsRepository() {
    const rentals = await db.query(`
        SELECT 
          rentals.*,
          customers.id AS "customerId",
          customers.name AS "customerName",
          games.id AS "gameId",
          games.name AS "gameName"
        FROM rentals
        JOIN customers ON rentals."customerId" = customers.id
        JOIN games ON rentals."gameId" = games.id;
    `);

    return rentals.rows.map(rental => ({
        id: rental.id,
        customerId: rental.customerId,
        gameId: rental.gameId,
        rentDate: rental.rentDate,
        daysRented: rental.daysRented,
        returnDate: rental.returnDate,
        originalPrice: rental.originalPrice,
        delayFee: rental.delayFee,
        customer: {
            id: rental.customerId,
            name: rental.customerName
        },
        game: {
            id: rental.gameId,
            name: rental.gameName
        }
    }));
}

async function createRentalRepository(customerId, gameId, daysRented) {
    const customer = await db.query(`SELECT * FROM customers WHERE id=$1`, [customerId]);
    if (customer.rows.length === 0) return null;

    const game = await db.query(`SELECT * FROM games WHERE id=$1`, [gameId]);
    if (game.rows.length === 0) return null;

    const gameData = game.rows[0];

    const rentalsCount = await db.query(
        `SELECT COUNT(*) FROM rentals WHERE "gameId"=$1 AND "returnDate" IS NULL`,
        [gameId]
    );

    if (parseInt(rentalsCount.rows[0].count) >= gameData.stockTotal) return null;

    const rentDate = dayjs().format("YYYY-MM-DD");
    const originalPrice = daysRented * gameData.pricePerDay;

    await db.query(
        `INSERT INTO rentals 
        ("customerId", "gameId", "rentDate", "daysRented", "originalPrice", "returnDate", "delayFee")
       VALUES ($1,$2,$3,$4,$5,null,null)`,
        [customerId, gameId, rentDate, daysRented, originalPrice]
    );

    return true;
}


async function returnRentalRepository(id) {
    const rentalResult = await db.query(
        `SELECT rentals.*, games."pricePerDay"
         FROM rentals
         JOIN games ON rentals."gameId" = games.id
         WHERE rentals.id=$1;`,
        [id]
    );

    if (rentalResult.rows.length === 0) return null;

    const rental = rentalResult.rows[0];

    if (rental.returnDate) return null;

    const returnDate = dayjs();
    const dueDate = dayjs(rental.rentDate).add(rental.daysRented, 'day');
    const delayDays = returnDate.diff(dueDate, 'day');
    const delayFee = delayDays > 0 ? delayDays * rental.pricePerDay : 0;

    await db.query(
        `UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3`,
        [returnDate.format("YYYY-MM-DD"), delayFee, id]
    );

    return true;
}

async function countOpenRentalsByGameId(gameId) {
    const result = await db.query(
      `SELECT COUNT(*) 
       FROM rentals 
       WHERE "gameId" = $1 AND "returnDate" IS NULL;`,
      [gameId]
    );
    return parseInt(result.rows[0].count);
  }

async function deleteRentalRepository(id) {
    const rentalResult = await db.query(`SELECT * FROM rentals WHERE id=$1;`, [id]);
    if (rentalResult.rows.length === 0) return null;

    const rental = rentalResult.rows[0];
    if (!rental.returnDate) return null;

    await db.query(`DELETE FROM rentals WHERE id=$1;`, [id]);

    return true;
}


async function getCustomerById(id) {
    const result = await db.query(`SELECT * FROM customers WHERE id=$1`, [id]);
    return result.rows[0] || null;
}

async function getGameById(id) {
    const result = await db.query(`SELECT * FROM games WHERE id=$1`, [id]);
    return result.rows[0] || null;
}

async function getRentalById(id) {
    const result = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
    return result.rows[0] || null;
}

const rentalsRepository = {
    getRentalsRepository,
    createRentalRepository,
    returnRentalRepository,
    deleteRentalRepository,
    getCustomerById,
    getGameById,
    getRentalById,
    countOpenRentalsByGameId
};

export default rentalsRepository