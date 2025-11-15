import { log, logError } from '../utils/logger.utils.js';
import * as model from "../models/reservations.model.js";

export const getAllReservations = async () => {
    log('Servicio', 'getAllReservations', 'Reservas enviadas');
    return await model.getAllReservations();
};

export const getReservationById = async (id) => {
    const reservation = await model.getReservationById(id);
    if (!reservation) {
        log('Servicio', 'getReservationById', 'Reserva no encontrada');
        throw new Error('Reserva no encontrada');
    }

    log('Servicio', 'getReservationById', 'Reserva enviada');
    return reservation;
};

export const createReservation = async (data) => {
    try {

        if (data.products && Array.isArray(data.products)) {
            log('Servicio', 'createReservation', 'Preparando referencia de/l los producto/s ', data.products);
            data.products = prepareProducts(data.products);
        }

        return await model.createReservation(data);
    } catch (error) {
        logError('Servicio', 'createReservation', error, 'Error creando reserva');
        throw new Error(`Error creando reserva: ${error.message}`);
    }
};

export const updateReservation = async (id, updateData) => {
    const updateReservation = await model.getReservationById(id);
    if (!updateReservation) {
        throw new Error('Reserva no encontrada');
    }

    if (updateData.products && Array.isArray(updateData.products)) {
        if (updateData.products.length === 0) {
            log('Servicio', 'updateReservation', 'Debe haber al menos un producto en la reserva');
            throw new Error('Debe haber al menos un producto en la reserva');
        }
        log('Servicio', 'updateReservation', 'Preparando referencia de/l los producto/s ', updateData.products);
        updateData.products = prepareProducts(updateData.products);
    }

    log('Servicio', 'updateReservation', 'Enviado');
    return await model.updateReservation(id, updateData);
};

export const deleteReservation = async (id) => {
    const deleteReservation = await model.getReservationById(id);
    if (!deleteReservation) {
        log('Servicio', 'deleteReservation', 'Reserva no encontrada');
        throw new Error('Reserva no encontrada');
    }

    log('Servicio', 'deleteReservation', 'Enviado');
    return await model.deleteReservation(id);
};

export const validateReservationData = (data) => {
    const errors = [];

    log('Servicio', 'validateReservationData', 'Validando datos de la reserva...');
    // Verifico si se recibieron datos
    if (!data) {
        errors.push("No se proporcionó data de la reserva");
        return { valid: false, errors };
    }

    // --- Validación del campo "userId" ---
    if (data.userId == null || (typeof data.userId !== 'string' && typeof data.userId !== 'number')) {
        errors.push('El campo "userId" es obligatorio y debe ser string o número.');
    }

    // --- Validación del campo "products" ---
    if (!Array.isArray(data.products) || data.products.length === 0) {
        errors.push('El campo "products" debe ser un array con al menos un producto.');
    } else {
        data.products.forEach((product, index) => {
            // Validar que es un objeto
            if (typeof product !== 'object' || product === null) {
                errors.push(`Producto en posición ${index} debe ser un objeto válido`);
                return;
            }

            // Validar type
            if (!product.type || typeof product.type !== 'string') {
                errors.push(`Producto en posición ${index} debe tener un "type" válido (string)`);
            }

            // Validar id
            if (!product.id || (typeof product.id !== 'string' && typeof product.id !== 'number')) {
                errors.push(`Producto en posición ${index} debe tener un "id" válido (string o número)`);
            }

            // Validar quantity
            if (product.quantity == null || isNaN(Number(product.quantity)) || Number(product.quantity) <= 0) {
                errors.push(`Producto en posición ${index} debe tener una "quantity" numérica mayor a 0`);
            }

            // Validar unitPrice
            if (product.unitPrice == null || isNaN(Number(product.unitPrice)) || Number(product.unitPrice) < 0) {
                errors.push(`Producto en posición ${index} debe tener un "unitPrice" numérico no negativo`);
            }

            // Validar tipos permitidos
            if (product.type) {
                const validTypes = ['tea', 'craft'];
                if (!validTypes.includes(product.type)) {
                    errors.push(`Tipo no válido en posición ${index}: "${product.type}". Tipos permitidos: ${validTypes.join(', ')}`);
                }
            }
        });
    }

    // --- Validación del campo "totalAmount" ---
    if (data.totalAmount == null || isNaN(Number(data.totalAmount)) || Number(data.totalAmount) < 0) {
        errors.push('El campo "totalAmount" es obligatorio, debe ser numérico y no negativo.');
    }

    // --- Validación del campo "pickupDate" ---
    const dateRegex = /^\d{2}-\d{2}-\d{2}$/;
    if (!data.pickupDate || typeof data.pickupDate !== 'string' || !dateRegex.test(data.pickupDate)) {
        errors.push('El campo "pickupDate" es obligatorio y debe tener formato DD-MM-YY (ej: 15-10-24).');
    }

    // --- Validación del campo "pickupTimeSlot" ---
    const timeSlotRegex = /^\d{2}:\d{2}-\d{2}:\d{2}$/;
    if (!data.pickupTimeSlot || typeof data.pickupTimeSlot !== 'string' || !timeSlotRegex.test(data.pickupTimeSlot)) {
        errors.push('El campo "pickupTimeSlot" es obligatorio y debe tener formato HH:MM-HH:MM (ej: 14:00-15:00).');
    }

    // --- Validación del campo "contactEmail" ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.contactEmail || typeof data.contactEmail !== 'string' || !emailRegex.test(data.contactEmail)) {
        errors.push('El campo "contactEmail" es obligatorio y debe ser un email válido.');
    }

    // --- Validación del campo "paymentMethod" ---
    const validPaymentMethods = ['debit', 'credit', 'cash', 'wallet'];
    if (!data.paymentMethod || typeof data.paymentMethod !== 'string' || !validPaymentMethods.includes(data.paymentMethod)) {
        errors.push(`El campo "paymentMethod" es obligatorio y debe ser uno de: ${validPaymentMethods.join(', ')}.`);
    }

    // --- Validación del campo "subtotal" ---
    if (data.subtotal == null || isNaN(Number(data.subtotal)) || Number(data.subtotal) < 0) {
        errors.push('El campo "subtotal" es obligatorio, debe ser numérico y no negativo.');
    }

    // --- Validación del campo "state" ---
    const validStates = ['pending_pickup', 'finished', 'cancelled', 'paid'];
    if (!data.state || typeof data.state !== 'string' || !validStates.includes(data.state)) {
        errors.push(`El campo "state" es obligatorio y debe ser uno de: ${validStates.join(', ')}.`);
    }

    // --- Validación del campo "ecoPackaging" ---
    if (data.ecoPackaging !== undefined && typeof data.ecoPackaging !== 'boolean') {
        errors.push('El campo "ecoPackaging" debe ser un valor booleano (true/false).');
    }

    return { valid: errors.length === 0, errors };
};

export const validateReservationUpdateData = (data) => {
    const {
        userId, products, totalAmount, pickupDate, pickupTimeSlot,
        customerNotes, contactEmail, paymentMethod, subtotal,
        discount, state, discountCode, ecoPackaging, cancellationDate
    } = data;

    const errors = [];

    log('Servicio', 'validateReservationUpdateData', 'Validando datos para actualizar la reserva...');

    // Verificar que al menos un campo esté presente para actualizar
    if (userId === undefined && products === undefined && totalAmount === undefined &&
        pickupDate === undefined && pickupTimeSlot === undefined && customerNotes === undefined &&
        contactEmail === undefined && paymentMethod === undefined && subtotal === undefined &&
        discount === undefined && state === undefined && discountCode === undefined &&
        ecoPackaging === undefined && cancellationDate === undefined) {
        errors.push('Debes proporcionar al menos un campo para actualizar la reserva.');
        return { valid: false, message: 'Debes proporcionar al menos un campo para actualizar la reserva.' };
    }

    // --- Validación del campo "userId" ---
    if (userId !== undefined && (userId == null || (typeof userId !== 'string' && typeof userId !== 'number'))) {
        errors.push('El campo "userId" debe ser string o número.');
    }

    // --- Validación del campo "products" ---
    if (products !== undefined) {
        if (!Array.isArray(products) || products.length === 0) {
            errors.push('El campo "products" debe ser un array con al menos un producto.');
        } else {
            products.forEach((product, index) => {
                if (typeof product !== 'object' || product === null) {
                    errors.push(`Producto en posición ${index} debe ser un objeto válido`);
                    return;
                }

                // Validar type (si viene)
                if (product.type !== undefined && (typeof product.type !== 'string' || !['tea', 'craft'].includes(product.type))) {
                    errors.push(`Producto en posición ${index} debe tener un "type" válido (tea o craft)`);
                }

                // Validar id (si viene)
                if (product.id !== undefined && (product.id == null || (typeof product.id !== 'string' && typeof product.id !== 'number'))) {
                    errors.push(`Producto en posición ${index} debe tener un "id" válido`);
                }

                // Validar quantity (si viene)
                if (product.quantity !== undefined && (isNaN(Number(product.quantity)) || Number(product.quantity) <= 0)) {
                    errors.push(`Producto en posición ${index} debe tener una "quantity" numérica mayor a 0`);
                }

                // Validar unitPrice (si viene)
                if (product.unitPrice !== undefined && (isNaN(Number(product.unitPrice)) || Number(product.unitPrice) < 0)) {
                    errors.push(`Producto en posición ${index} debe tener un "unitPrice" numérico no negativo`);
                }
            });
        }
    }

    // --- Resto de validaciones ---
    const dateRegex = /^\d{2}-\d{2}-\d{2}$/;
    const timeSlotRegex = /^\d{2}:\d{2}-\d{2}:\d{2}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validPaymentMethods = ['debit', 'credit', 'cash', 'wallet', null];
    const validStates = ['pending_pickup', 'finished', 'cancelled', 'paid'];

    if (totalAmount !== undefined && (isNaN(Number(totalAmount)) || Number(totalAmount) < 0)) {
        errors.push('El campo "totalAmount" debe ser numérico y no negativo.');
    }

    if (pickupDate !== undefined && (typeof pickupDate !== 'string' || !dateRegex.test(pickupDate))) {
        errors.push('El campo "pickupDate" debe tener formato DD-MM-YY (ej: 15-10-24).');
    }

    if (pickupTimeSlot !== undefined && (typeof pickupTimeSlot !== 'string' || !timeSlotRegex.test(pickupTimeSlot))) {
        errors.push('El campo "pickupTimeSlot" debe tener formato HH:MM-HH:MM (ej: 14:00-15:00).');
    }

    if (customerNotes !== undefined && typeof customerNotes !== 'string') {
        errors.push('El campo "customerNotes" debe ser un string.');
    }

    if (contactEmail !== undefined && (typeof contactEmail !== 'string' || !emailRegex.test(contactEmail))) {
        errors.push('El campo "contactEmail" debe ser un email válido.');
    }

    if (paymentMethod !== undefined && !validPaymentMethods.includes(paymentMethod)) {
        errors.push(`El campo "paymentMethod" debe ser uno de: ${validPaymentMethods.filter(m => m !== null).join(', ')} o null.`);
    }

    if (subtotal !== undefined && (isNaN(Number(subtotal)) || Number(subtotal) < 0)) {
        errors.push('El campo "subtotal" debe ser numérico y no negativo.');
    }

    if (discount !== undefined && (isNaN(Number(discount)) || Number(discount) < 0)) {
        errors.push('El campo "discount" debe ser numérico y no negativo.');
    }

    if (state !== undefined && (typeof state !== 'string' || !validStates.includes(state))) {
        errors.push(`El campo "state" debe ser uno de: ${validStates.join(', ')}.`);
    }

    if (discountCode !== undefined && typeof discountCode !== 'string') {
        errors.push('El campo "discountCode" debe ser un string.');
    }

    if (ecoPackaging !== undefined && typeof ecoPackaging !== 'boolean') {
        errors.push('El campo "ecoPackaging" debe ser un valor booleano (true/false).');
    }

    if (cancellationDate !== undefined) {
        if (cancellationDate !== '' && (typeof cancellationDate !== 'string' || !dateRegex.test(cancellationDate))) {
            errors.push('El campo "cancellationDate" debe ser un string vacío o tener formato DD-MM-YY (ej: 09-10-24).');
        }
    }

    return { valid: errors.length === 0, errors };
};

export const prepareProducts = (products) => {
    return products.map(product => {
        const collectionMap = {
            'tea': 'teasProducts',
            'craft': 'craftProducts'
        };

        const collectionName = collectionMap[product.type];
        if (!collectionName) {
            log('Servicio', 'prepareProducts', 'Tipo de producto no válido', product.type);
            throw new Error(`Tipo de producto no válido: ${product.type}`);
        }

        return {
            collection: collectionName,
            id: product.id,
            quantity: product.quantity,
            unitPrice: product.unitPrice
        };
    });
};