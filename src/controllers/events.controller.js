import * as eventsService from '../services/events.service.js';
import { log, logError } from '../utils/logger.utils.js';
export const getEvents = async (req, res) => {
    try {
        const events = await eventsService.getAllEvents();
        if (events.length === 0) {
            log('Controlador', 'getEvents', 'No hay eventos disponibles');
            return res.status(404).json({ error: 'No hay eventos disponibles' });
        }

        log('Controlador', 'getEvents', 'Eventos obtenidos', events);
        return res.status(200).json(events);
    } catch (error) {
        logError('Controlador', 'getEvents', error, 'Error al obtener los eventos');
        return res.status(500).json({ error: 'Error al obtener los eventos' });
    }
};

export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            log('Controlador', 'getEventById', 'ID de evento inválido');
            return res.status(400).json({ error: 'ID de evento inválido' });
        }

        const event = await eventsService.getEventById(id);
        log('Controlador', 'getEventById', 'Evento obtenido', event);
        return res.status(200).json(event);
    } catch (error) {
        if (error.message === 'Evento no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        logError('Controlador', 'getEventById', error, 'Error al obtener el evento');
        return res.status(500).json({ error: 'Error al obtener el evento' });
    }
};

export const searchEventByTitle = async (req, res) => {
    const { title } = req.query;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        log('Controlador', 'searchEventByTitle', 'Se requiere el query param << title >>');
        return res.status(400).json({ error: 'Se requiere el query param << title >>' });
    }

    try {
        const filteredEvents = await eventsService.searchEventByTitle(title);

        log('Controlador', 'searchEventByTitle', 'title', title);
        log('Controlador', 'searchEventByTitle', 'filteredEvents', filteredEvents);
        return res.status(200).json(filteredEvents);
    } catch (error) {
        logError('Controlador', 'searchEventByTitle', error, 'Error al buscar el evento por titulo');
        return res.status(500).json({ error: 'Error al buscar el evento por titulo' });
    }
};

export const createEvent = async (req, res) => {
    const validation = eventsService.validateEventData(req.body);

    if (!validation.valid) {
        log('Controlador', 'createEvent', 'Datos inválidos', validation.errors);
        return res.status(400).json({
            error: 'Datos inválidos',
            details: validation.errors
        });
    }

    const {
        title,
        date,
        startTime,
        endTime,
        registrationRequired,
        isFree,
        description,
        location,
        isVirtual,
        entryPrice,
        cancelledByRain
    } = req.body;

    try {
        const newEvent = await eventsService.createEvent({
            title,
            date,
            startTime,
            endTime,
            registrationRequired,
            isFree,
            description,
            location,
            isVirtual,
            entryPrice,
            cancelledByRain
        });

        log('Controlador', 'createEvent', 'Evento creado', newEvent);
        return res.status(201).json(newEvent);
    } catch (error) {
        logError('Controlador', 'createEvent', error, 'Error al crear el evento');
        return res.status(500).json({ error: 'Error al crear el evento' });
    }
};

export const updateEvent = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        log('Controlador', 'updateEvent', 'ID de evento inválido');
        return res.status(400).json({ error: 'ID de evento inválido' });
    }

    const validation = eventsService.validateEventUpdateData(req.body);

    if (!validation.valid) {
        log('Controlador', 'updateEvent', 'Datos inválidos', validation.errors);
        return res.status(400).json({
            error: 'Datos inválidos',
            details: validation.errors
        });
    };

    const {
        title,
        date,
        startTime,
        endTime,
        registrationRequired,
        isFree,
        description,
        location,
        isVirtual,
        entryPrice,
        cancelledByRain
    } = req.body;

    try {
        const updatedEvent = await eventsService.updateEvent(id, {
            title,
            date,
            startTime,
            endTime,
            registrationRequired,
            isFree,
            description,
            location,
            isVirtual,
            entryPrice,
            cancelledByRain
        });

        log('Controlador', 'updateEvent', 'Evento actualizado', updatedEvent);
        return res.status(200).json(updatedEvent);
    } catch (error) {
        if (error.message === 'Evento no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        logError('Controlador', 'updateEvent', error, 'Error al actualizar el evento');
        return res.status(500).json({ error: 'Error al actualizar el evento' });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            log('Controlador', 'deleteEvent', 'ID de evento inválido');
            return res.status(400).json({ error: 'ID de evento inválido' });
        }

        const deletedEvent = await eventsService.deleteEvent(id);

        log('Controlador', 'deleteEvent', 'Evento eliminado', deletedEvent);
        return res.status(200).json({ message: 'Evento eliminado correctamente' });
    } catch (error) {
        if (error.message === 'Evento no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        logError('Controlador', 'deleteEvent', error, 'Error al eliminar el evento');
        return res.status(500).json({ error: 'Error al eliminar el evento' });
    }
};