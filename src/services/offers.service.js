import * as model from "../models/offers.model.js";

export const getAllOffers = async () => {
    return await model.getAllOffers();
};

export const getOfferById = async (id) => {
    const offer = await model.getOfferById(id);
    if (!offer) {
        throw new Error('Oferta no encontrada');
    }
    return offer;
};


export const searchOfferByTitle = async (title) => {
    const offers = await model.getAllOffers();

    if (!Array.isArray(offers)) {
        throw new Error('Error interno al obtener ofertas');
    }

    const filteredOffers = offers.filter((offer) =>
        typeof offer.title === 'string' &&
        offer.title.toLowerCase().includes(title.toLowerCase().trim())
    );

    if (filteredOffers.length === 0) {
        throw new Error('No se encontraron ofertas con ese titulo');
    }

    return filteredOffers;
}

export const createOffer = async (data) => {
    try {
        if (data.applicableTo && Array.isArray(data.applicableTo)) {            
            data.applicableTo = prepareApplicableTo(data.applicableTo);
        }

        return await model.createOffer(data);
    } catch (error) {
        throw new Error(`Error creando oferta: ${error.message}`);
    }

};

export const updateOffer = async (id, updateData) => {
    const updateOffer = await model.getOfferById(id);
    if (!updateOffer) {
        throw new Error('Oferta no encontrada');
    }

    if (updateData.applicableTo && Array.isArray(updateData.applicableTo)) {
        // Validaciones de negocio
        if (updateData.applicableTo.length === 0) {
            throw new Error('Debe haber al menos un producto aplicable');
        }

        updateData.applicableTo = prepareApplicableTo(updateData.applicableTo);
    }

    return await model.updateOffer(id, updateData);
};

export const deleteOffer = async (id) => {
    const deleteOffer = await model.getOfferById(id);
    if (!deleteOffer) {
        throw new Error('Oferta no encontrada');
    }
    return await model.deleteOffer(id);
};

export const validateOfferData = (data) => {
    const errors = [];

    // Verifico si se recibió algún dato
    if (!data) {
        errors.push("No se proporcionó data de la oferta");
        return { valid: false, errors };
    }

    // --- Validación del campo "title" (Título) ---
    if (typeof data.title !== 'string' || data.title.trim().length < 5) {
        errors.push('El campo "title" es obligatorio y debe ser un string de al menos 5 caracteres.');
    }

    // --- Validación del campo "description" ---
    if (typeof data.description !== 'string' || data.description.trim().length < 1) {
        errors.push('El campo "description" es obligatorio y debe ser un string no vacío.');
    }

    // --- Validación del campo "applicableTo" ---
    if (!Array.isArray(data.applicableTo) || data.applicableTo.length === 0) {
        errors.push('El campo "applicableTo" debe ser un array con al menos un producto.');
    } else {
        // Validar cada producto en el array
        data.applicableTo.forEach((product, index) => {
            if (typeof product !== 'object' || !product.type || !product.id) {
                errors.push(`Producto en posición ${index} debe tener type e id`);
            }

            // Validar tipos permitidos
            const validTypes = ['tea', 'craft'];
            if (product.type && !validTypes.includes(product.type)) {
                errors.push(`Tipo no válido en posición ${index}: ${product.type}. Tipos permitidos: ${validTypes.join(', ')}`);
            }
        });
    }

    // --- Validación del campo "minimumPurchase" ---
    if (data.minimumPurchase == null || isNaN(Number(data.minimumPurchase)) || Number(data.minimumPurchase) < 0) {
        errors.push('El campo "minimumPurchase" es obligatorio, debe ser numérico y no negativo.');
    }

    // --- Validación del campo "isLimited" (booleano) ---
    if (data.isLimited !== undefined && typeof data.isLimited !== 'boolean') {
        errors.push('El campo "isLimited" debe ser un valor booleano (true/false).');
    }

    // --- Validación del campo "limit" (solo si es limitado) ---
    if (data.isLimited === true) {
        if (data.limit == null || isNaN(Number(data.limit)) || Number(data.limit) <= 0) {
            errors.push('Si "isLimited" es true, el campo "limit" es obligatorio y debe ser un número positivo.');
        }
    }

    // --- Validación del campo "state" ---
    const validStates = ['active', 'inactive', 'expired'];
    if (typeof data.state !== 'string' || !validStates.includes(data.state)) {
        errors.push(`El campo "state" es obligatorio y debe ser uno de: ${validStates.join(', ')}.`);
    }

    // --- Validación del campo "promotionalCode" ---
    if (typeof data.promotionalCode !== 'string' || data.promotionalCode.trim().length < 3) {
        errors.push('El campo "promotionalCode" es obligatorio y debe ser un string de al menos 3 caracteres.');
    }

    // --- Validación de Fechas (startDate y endDate) ---
    const dateRegex = /^\d{2}-\d{2}-\d{2}$/; // Formato DD-MM-YY

    // Validación de "startDate"
    if (!data.startDate || typeof data.startDate !== 'string' || !dateRegex.test(data.startDate)) {
        errors.push('El campo "startDate" es obligatorio y debe tener formato DD-MM-YY (ej: 01-10-24).');
    }

    // Validación de "endDate"
    if (!data.endDate || typeof data.endDate !== 'string' || !dateRegex.test(data.endDate)) {
        errors.push('El campo "endDate" es obligatorio y debe tener formato DD-MM-YY (ej: 31-10-24).');
    }

    // Nota: La validación de que startDate sea anterior a endDate es compleja sin librerías de fecha
    // y se suele hacer en una etapa posterior de la lógica de negocio o a nivel de base de datos.

    return { valid: errors.length === 0, errors };
};

export const validateUpdateData = (data) => {
    const { title, description, applicableTo, minimumPurchase, isLimited, limit, state, promotionalCode, startDate, endDate } = data;
    const errors = [];

    // Verificar que al menos un campo esté presente para actualizar
    if (!title && !description && !applicableTo && minimumPurchase === undefined && isLimited === undefined && limit === undefined && !state && !promotionalCode && !startDate && !endDate) {
        errors.push('Debes proporcionar al menos un campo para actualizar la oferta.');
        return { valid: false, message: 'Debes proporcionar al menos un campo para actualizar la oferta.' };
    }

    // --- Validación del campo "title" (Título) ---
    if (title !== undefined && (typeof title !== 'string' || title.trim().length < 5)) {
        errors.push('El campo "title" debe ser un string de al menos 5 caracteres.');
    }

    // --- Validación del campo "description" ---
    if (description !== undefined && (typeof description !== 'string' || description.trim().length < 1)) {
        errors.push('El campo "description" debe ser un string no vacío.');
    }

    // --- Validación del campo "applicableTo" ---
    if (applicableTo !== undefined) {
        if (!Array.isArray(applicableTo) || applicableTo.length === 0) {
            errors.push('El campo "applicableTo" debe ser un array con al menos un producto.');
        } else {
            // Validar cada producto en el array
            applicableTo.forEach((product, index) => {
                // Validar que es un objeto y tiene las propiedades requeridas
                if (typeof product !== 'object' || product === null) {
                    errors.push(`Producto en posición ${index} debe ser un objeto válido`);
                    return; // Salir de esta iteración
                }

                // Validar que tiene type e id
                if (!product.type || typeof product.type !== 'string') {
                    errors.push(`Producto en posición ${index} debe tener un "type" válido (string)`);
                }

                if (!product.id || typeof product.id !== 'string') {
                    errors.push(`Producto en posición ${index} debe tener un "id" válido (string)`);
                }

                // Validar tipos permitidos solo si type existe
                if (product.type) {
                    const validTypes = ['tea', 'craft'];
                    if (!validTypes.includes(product.type)) {
                        errors.push(`Tipo no válido en posición ${index}: "${product.type}". Tipos permitidos: ${validTypes.join(', ')}`);
                    }
                }

                // Validar que el id no esté vacío
                if (product.id && product.id.trim() === '') {
                    errors.push(`El "id" en posición ${index} no puede estar vacío`);
                }
            });
        }
    }

    // --- Validación del campo "minimumPurchase" ---
    if (minimumPurchase !== undefined && (isNaN(Number(minimumPurchase)) || Number(minimumPurchase) < 0)) {
        errors.push('El campo "minimumPurchase" debe ser numérico y no negativo.');
    }

    // --- Validación del campo "isLimited" (booleano) ---
    if (isLimited !== undefined && typeof isLimited !== 'boolean') {
        errors.push('El campo "isLimited" debe ser un valor booleano (true/false).');
    }

    // --- Validación del campo "limit" (solo si es limitado) ---
    if (data.isLimited === true) {
        if (data.limit == null || isNaN(Number(data.limit)) || Number(data.limit) <= 0) {
            errors.push('Si "isLimited" es true, el campo "limit" es obligatorio y debe ser un número positivo.');
        }
    }

    // --- Validación del campo "state" ---
    const validStates = ['active', 'inactive', 'expired'];
    if (state !== undefined && (typeof state !== 'string' || !validStates.includes(state))) {
        errors.push(`El campo "state" debe ser uno de: ${validStates.join(', ')}.`);
    }

    // --- Validación del campo "promotionalCode" ---
    if (promotionalCode !== undefined && (typeof promotionalCode !== 'string' || promotionalCode.trim().length < 3)) {
        errors.push('El campo "promotionalCode" debe ser un string de al menos 3 caracteres.');
    }

    // --- Validación de Fechas (startDate y endDate) ---
    const dateRegex = /^\d{2}-\d{2}-\d{2}$/; // Formato DD-MM-YY

    // Validación de "startDate"
    if (startDate !== undefined && (typeof startDate !== 'string' || !dateRegex.test(startDate))) {
        errors.push('El campo "startDate" debe tener formato DD-MM-YY (ej: 01-10-24).');
    }

    // Validación de "endDate"
    if (endDate !== undefined && (typeof endDate !== 'string' || !dateRegex.test(endDate))) {
        errors.push('El campo "endDate" debe tener formato DD-MM-YY (ej: 31-10-24).');
    }

    return { valid: errors.length === 0, errors };
};

const prepareApplicableTo = (applicableTo) => { //Preparo la información de los productos para enviarse como referencia
    return applicableTo.map(product => {
        const collectionMap = {
            'tea': 'teasProducts',
            'craft': 'craftProducts'
        };

        const collectionName = collectionMap[product.type];
        if (!collectionName) {
            throw new Error(`Tipo de producto no válido: ${product.type}`);
        }

        return {
            collection: collectionName,
            id: product.id,
            type: product.type
        };
    });
};