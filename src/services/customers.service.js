import customersRepository from "../repositories/customers.repository.js";
import { conflictError, notFoundError, badRequestError } from "../errors/error.js";

async function getCustomers() {
    const result = await customersRepository.getCustomersRepository();
    return result.rows;
}

async function getCustomerById(id) {
    const customer = await customersRepository.getCustomersIdRepository(id);
    if (customer.rows.length === 0) throw notFoundError("Cliente");
    return customer.rows[0];
}

async function createCustomer({ name, phone, cpf }) {
    if (!name || !phone || !cpf) throw badRequestError("Todos os campos são obrigatórios");

    const cpfExist = await customersRepository.customerCpfExistRepository(cpf);
    if (cpfExist.rows.length > 0) throw conflictError("Cliente");

    await customersRepository.createCustomerRepository(name, phone, cpf);
    return true;
}

export default { getCustomers, getCustomerById, createCustomer };
