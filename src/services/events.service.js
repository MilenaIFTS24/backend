import * as model from "../models/events.model.js";

export const getAllEvents = async () => {
    return await model.getAllEvents();
};

export const getEventById = async (id) => {
    const event = await model.getEventById(id);
    if (!event) {
        throw new Error('Evento no encontrado');
    }
    return event;
};

export const searchEventByTitle = async (title) => {
    const events = await model.getAllEvents();

    if (!Array.isArray(events)) {
        throw new Error('Error interno al obtener eventos');
    }

    const filteredEvents = products.filter((event) =>
        typeof event.title === 'string' &&
        event.title.toLowerCase().includes(title.toLowerCase().trim())
    );

    if (filteredEvents.length === 0) {
        throw new Error('No se encontraron eventos con ese título');
    }

    return filteredEvents;
}


export const createEvent = async (data) => {
    return await model.createEvent(data);
};

export const updateEvent = async (id, data) => {
    const event = await model.getEventById(id);
    if (!event) {
        throw new Error('Evento no encontrado');
    }
    return await model.updateEvent(id, data);
};

export const deleteEvent = async (id) => {
    const event = await model.getEventById(id);
    if (!event) {
        throw new Error('Evento no encontrado');
    }
    return await model.deleteEvent(id);
};

export const validateEventData = (data) => {
    const errors = [];

    // Verifico si se recibió algún dato
    if (!data) {
        errors.push("No se proporcionó data del evento");
        return { valid: false, errors };
    }

    // --- Validación del campo "title" (Título) ---
    if (typeof data.title !== 'string' || data.title.trim().length < 5) {
        errors.push('El campo "title" es obligatorio y debe ser un string de al menos 5 caracteres.');
    }

    // --- Validación del campo "date" ---
    const dateRegex = /^\d{2}-\d{2}-\d{2}$/; // Formato DD-MM-YY
    if (!data.date || typeof data.date !== 'string' || !dateRegex.test(data.date)) {
        errors.push('El campo "date" es obligatorio y debe tener formato DD-MM-YY (ej: 20-10-24).');
    }

    // --- Validación del campo "startTime" ---
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // Formato HH:MM
    if (!data.startTime || typeof data.startTime !== 'string' || !timeRegex.test(data.startTime)) {
        errors.push('El campo "startTime" es obligatorio y debe tener formato HH:MM (ej: 15:00).');
    }

    // --- Validación del campo "endTime" ---
    if (!data.endTime || typeof data.endTime !== 'string' || !timeRegex.test(data.endTime)) {
        errors.push('El campo "endTime" es obligatorio y debe tener formato HH:MM (ej: 17:00).');
    }

    // Validar que endTime sea posterior a startTime
    if (data.startTime && data.endTime && timeRegex.test(data.startTime) && timeRegex.test(data.endTime)) {
        const start = new Date(`2000-01-01T${data.startTime}`);
        const end = new Date(`2000-01-01T${data.endTime}`);
        if (end <= start) {
            errors.push('El campo "endTime" debe ser posterior a "startTime".');
        }
    }

    // --- Validación del campo "registrationRequired" ---
    if (data.registrationRequired !== undefined && typeof data.registrationRequired !== 'boolean') {
        errors.push('El campo "registrationRequired" debe ser un valor booleano (true/false).');
    }

    // --- Validación del campo "isFree" ---
    if (data.isFree !== undefined && typeof data.isFree !== 'boolean') {
        errors.push('El campo "isFree" debe ser un valor booleano (true/false).');
    }

    // --- Validación del campo "description" ---
    if (typeof data.description !== 'string' || data.description.trim().length < 10) {
        errors.push('El campo "description" es obligatorio y debe ser un string de al menos 10 caracteres.');
    }

    // --- Validación del campo "location" ---
    if (typeof data.location !== 'string' || data.location.trim().length < 5) {
        errors.push('El campo "location" es obligatorio y debe ser un string de al menos 5 caracteres.');
    }

    // --- Validación del campo "isVirtual" ---
    if (data.isVirtual !== undefined && typeof data.isVirtual !== 'boolean') {
        errors.push('El campo "isVirtual" debe ser un valor booleano (true/false).');
    }

    // --- Validación del campo "entryPrice" ---
    if (data.entryPrice == null || isNaN(Number(data.entryPrice)) || Number(data.entryPrice) < 0) {
        errors.push('El campo "entryPrice" es obligatorio, debe ser numérico y no negativo.');
    }

    // Validación consistente: si es gratis, el precio debe ser 0
    if (data.isFree === true && Number(data.entryPrice) !== 0) {
        errors.push('Si el evento es gratuito (isFree: true), el "entryPrice" debe ser 0.');
    }

    // --- Validación del campo "cancelledByRain" ---
    if (data.cancelledByRain !== undefined && typeof data.cancelledByRain !== 'boolean') {
        errors.push('El campo "cancelledByRain" debe ser un valor booleano (true/false).');
    }

    return { valid: errors.length === 0, errors };
};

export const validateEventUpdateData = (data) => {
    if (!data || typeof data !== 'object') {
        errors.push('No se proporcionaron datos para actualizar el evento.');
        return {
            valid: false,
            message: 'No se proporcionaron datos para actualizar el evento.'
        };
    }

    const {
        title, date, startTime, endTime, registrationRequired, isFree,
        description, location, isVirtual, entryPrice, cancelledByRain
    } = data;

    const errors = [];

    // Verificar que al menos un campo esté presente para actualizar
    if (!title && !date && !startTime && !endTime &&
        registrationRequired === undefined && isFree === undefined &&
        !description && !location && isVirtual === undefined &&
        entryPrice === undefined && cancelledByRain === undefined) {
        errors.push('Debes proporcionar al menos un campo para actualizar el evento.');
        return { valid: false, message: 'Debes proporcionar al menos un campo para actualizar el evento.' };
    }

    // --- Validación del campo "title" ---
    if (title !== undefined && (typeof title !== 'string' || title.trim().length < 5)) {
        errors.push('El campo "title" debe ser un string de al menos 5 caracteres.');
    }

    // --- Validación del campo "date" ---
    const dateRegex = /^\d{2}-\d{2}-\d{2}$/; // Formato DD-MM-YY
    if (date !== undefined && (typeof date !== 'string' || !dateRegex.test(date))) {
        errors.push('El campo "date" debe tener formato DD-MM-YY (ej: 20-10-24).');
    }

    // --- Validación del campo "startTime" ---
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // Formato HH:MM
    if (startTime !== undefined && (typeof startTime !== 'string' || !timeRegex.test(startTime))) {
        errors.push('El campo "startTime" debe tener formato HH:MM (ej: 15:00).');
    }

    // --- Validación del campo "endTime" ---
    if (endTime !== undefined && (typeof endTime !== 'string' || !timeRegex.test(endTime))) {
        errors.push('El campo "endTime" debe tener formato HH:MM (ej: 17:00).');
    }

    // Validar que endTime sea posterior a startTime (si ambos están presentes)
    if (startTime && endTime && timeRegex.test(startTime) && timeRegex.test(endTime)) {
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        if (end <= start) {
            errors.push('El campo "endTime" debe ser posterior a "startTime".');
        }
    }

    // --- Validación del campo "registrationRequired" ---
    if (registrationRequired !== undefined && typeof registrationRequired !== 'boolean') {
        errors.push('El campo "registrationRequired" debe ser un valor booleano (true/false).');
    }

    // --- Validación del campo "isFree" ---
    if (isFree !== undefined && typeof isFree !== 'boolean') {
        errors.push('El campo "isFree" debe ser un valor booleano (true/false).');
    }

    // --- Validación del campo "description" ---
    if (description !== undefined && (typeof description !== 'string' || description.trim().length < 10)) {
        errors.push('El campo "description" debe ser un string de al menos 10 caracteres.');
    }

    // --- Validación del campo "location" ---
    if (location !== undefined && (typeof location !== 'string' || location.trim().length < 5)) {
        errors.push('El campo "location" debe ser un string de al menos 5 caracteres.');
    }

    // --- Validación del campo "isVirtual" ---
    if (isVirtual !== undefined && typeof isVirtual !== 'boolean') {
        errors.push('El campo "isVirtual" debe ser un valor booleano (true/false).');
    }

    // --- Validación del campo "entryPrice" ---
    if (entryPrice !== undefined && (isNaN(Number(entryPrice)) || Number(entryPrice) < 0)) {
        errors.push('El campo "entryPrice" debe ser numérico y no negativo.');
    }

    // Validación consistente: si es gratis, el precio debe ser 0
    if (isFree === true && entryPrice !== undefined && Number(entryPrice) !== 0) {
        errors.push('Si el evento es gratuito (isFree: true), el "entryPrice" debe ser 0.');
    }

    // --- Validación del campo "cancelledByRain" ---
    if (cancelledByRain !== undefined && typeof cancelledByRain !== 'boolean') {
        errors.push('El campo "cancelledByRain" debe ser un valor booleano (true/false).');
    }

    return { valid: errors.length === 0, errors };
};