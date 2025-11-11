import * as eventsService from '../services/events.service.js';

export const getEvents = async (req, res) => {
    try {
        const events = await eventsService.getAllEvents();
        if (events.length === 0) {
            return res.status(404).json({ error: 'No hay eventos disponibles' });
        }

        console.log(events);
        return res.status(200).json(events);
    } catch (error) {
        console.error('Error al obtener los eventos:', error);
        return res.status(500).json({ error: 'Error al obtener los eventos' });
    }
};

export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID de evento inválido' });
        }

        const event = await eventsService.getEventById(id);
        console.log(event);
        return res.status(200).json(event);
    } catch (error) {
        if (error.message === 'Evento no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Error al obtener el evento:', error);
        return res.status(500).json({ error: 'Error al obtener el evento' });
    }
};

export const createEvent = async (req, res) => {
    const validation = eventsService.validateEventData(req.body);

    if (!validation.valid) {
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

        console.log(newEvent);
        return res.status(201).json(newEvent);
    } catch (error) {
        console.error('Error al crear el evento:', error);
        return res.status(500).json({ error: 'Error al crear el evento' });
    }
};

export const updateEvent = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'ID de evento inválido' });
    }

    const validation = eventsService.validateEventUpdateData(req.body);

    if (!validation.valid) {
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

        console.log(updatedEvent);
        return res.status(200).json(updatedEvent);
    } catch (error) {
        if (error.message === 'Evento no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Error al actualizar el evento:', error);
        return res.status(500).json({ error: 'Error al actualizar el evento' });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID de evento inválido' });
        }

        const deletedEvent = await eventsService.deleteEvent(id);

        console.log(deletedEvent);
        return res.status(200).json({ message: 'Evento eliminado correctamente' });
    } catch (error) {
        if (error.message === 'Evento no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Error al eliminar el evento:', error);
        return res.status(500).json({ error: 'Error al eliminar el evento' });
    }
};