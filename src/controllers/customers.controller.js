import customersService from "../services/customers.service.js";

export async function getCustomers(req, res, next) {
    const customers = await customersService.getCustomers();
    res.status(200).send(customers);
}

export async function getCustomersById(req, res, next) {
    const customer = await customersService.getCustomerById(req.params.id);
    res.status(200).send(customer);
}

export async function createCustomer(req, res, next) {
    await customersService.createCustomer(req.body);
    res.sendStatus(201);
}
