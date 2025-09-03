export default function errorHandler(error, req, res, next) {
    if (error.type === "conflict") return res.status(409).send(error.message);
    if (error.type === "notFound") return res.status(404).send(error.message);
    if (error.type === "badRequest") return res.status(400).send(error.message);
    if (error.type === "unavailable") return res.status(422).send(error.message);

    res.status(500).send(error.message || "Erro interno do servidor");
}
