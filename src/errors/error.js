export function conflictError(entity) {
    return {
        type: "conflict",
        message: `Já existe ${entity} com esse valor!`
    };
}

export function notFoundError(entity) {
    return {
        type: "notFound",
        message: `${entity} não encontrado(a)`
    };
}

export function badRequestError(message) {
    return {
        type: "badRequest",
        message
    };
}

export function unavailableError(entity) {
    return {
        type: "unavailable",
        message: `${entity} indisponível`
    };
}
