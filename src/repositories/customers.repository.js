import { db } from "../database/db.connection.js";

async function getCustomersRepository(){
    const resultado = await db.query(`SELECT * FROM customers;`)
    return resultado
}

async function getCustomersIdRepository(id){
    const customer = await db.query(`SELECT * FROM customers WHERE id=$1;`, [id])
    return customer
}

async function customerCpfExistRepository(cpf){
    const cpfExist = await db.query(`SELECT * FROM customers WHERE cpf=$1;`, [cpf])
    return cpfExist
}

async function createCustomerRepository(name, phone, cpf){
    await db.query(`
        INSERT INTO customers (name, phone, cpf) 
            VALUES ($1,$2,$3);
        `, [name, phone,cpf])
}

const customersRepository = {
    getCustomersRepository,
    getCustomersIdRepository,
    createCustomerRepository, 
    customerCpfExistRepository
}

export default customersRepository