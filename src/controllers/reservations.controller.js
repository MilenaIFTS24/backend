import * as reservationsService from '../services/reservations.service.js';
import { log, logError } from '../utils/logger.utils.js';
export const getReservations = async (req, res) => {
    try {
        const reservations = await reservationsService.getAllReservations();

        if (reservations.length === 0) {
            log('Controlador', 'getReservations', 'No existen reservas');
            return res.status(404).json({ error: 'No existen reservas' });
        }

        log('Controlador', 'getReservations', 'Reservas obtenidas', reservations);
        return res.status(200).json(reservations);
    } catch (error) {
        logError('Controlador', 'getReservations', error, 'Error al obtener las reservas');
        return res.status(500).json({ error: 'Error al obtener las reservas' });
    }
};

export const getReservationById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            log('Controlador', 'getReservationById', 'ID de reserva inválido');
            return res.status(400).json({ error: 'ID de reserva inválido' });
        }
        const reservation = await reservationsService.getReservationById(id);

        log('Controlador', 'getReservationById', 'Reserva obtenida', reservation);
        return res.status(200).json(reservation);
    } catch (error) {
        if (error.message === 'Reserva no encontrada') {
            return res.status(404).json({ error: error.message });
        }
        logError('Controlador', 'getReservationById', error, 'Error al obtener la reserva');
        return res.status(500).json({ error: 'Error al obtener la reserva' });
    }
};

export const createReservation = async (req, res) => {
    const validation = reservationsService.validateReservationData(req.body);

    if (!validation.valid) {
        log('Controlador', 'createReservation', 'Datos inválidos', validation.errors);
        return res.status(400).json({
            error: 'Datos inválidos',
            details: validation.errors
        });
    }

    const {
        userId,
        products,
        totalAmount,
        pickupDate,
        pickupTimeSlot,
        customerNotes,
        contactEmail,
        paymentMethod,
        subtotal,
        discount,
        state,
        discountCode,
        ecoPackaging
    } = req.body;

    try {
        const newReservation = await reservationsService.createReservation({
            userId,
            products,
            totalAmount,
            pickupDate,
            pickupTimeSlot,
            customerNotes,
            contactEmail,
            paymentMethod,
            subtotal,
            discount,
            state,
            discountCode,
            ecoPackaging
        });

        log('Controlador', 'createReservation', 'Reserva creada', newReservation);
        return res.status(201).json(newReservation);
    } catch (error) {
        logError('Controlador', 'createReservation', error, 'Error al crear la reserva');
        return res.status(500).json({ error: 'Error al crear la reserva' });
    }
};

export const updateReservation = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        log('Controlador', 'updateReservation', 'ID de reserva inválido');
        return res.status(400).json({ error: 'ID de reserva inválido' });
    }

    const validation = validateReservationUpdateData(req.body);

    if (!validation.valid) {
        log('Controlador', 'updateReservation', 'Datos inválidos', validation.errors);
        return res.status(400).json({
            error: 'Datos inválidos',
            details: validation.errors
        });
    }

    const {
        userId,
        products,
        totalAmount,
        pickupDate,
        pickupTimeSlot,
        customerNotes,
        contactEmail,
        paymentMethod,
        subtotal,
        discount,
        state,
        discountCode,
        ecoPackaging,
        cancellationDate
    } = req.body;

    try {
        const updatedReservation = await reservationsService.updateReservation(id, {
            userId,
            products,
            totalAmount,
            pickupDate,
            pickupTimeSlot,
            customerNotes,
            contactEmail,
            paymentMethod,
            subtotal,
            discount,
            state,
            discountCode,
            ecoPackaging,
            cancellationDate
        });

        log('Controlador', 'updateReservation', 'Reserva actualizada', updatedReservation);
        return res.status(200).json(updatedReservation);
    } catch (error) {
        if (error.message === 'Reserva no encontrada') {
            return res.status(404).json({ error: error.message });
        }
        logError('Controlador', 'updateReservation', error, 'Error al actualizar la reserva');
        return res.status(500).json({ error: 'Error al actualizar la reserva' });
    }
};

export const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            log('Controlador', 'deleteReservation', 'ID de reserva inválido');
            return res.status(400).json({ error: 'ID de reserva inválido' });
        }
        const deletedReservation = await reservationsService.deleteReservation(id);

        log('Controlador', 'deleteReservation', 'Reserva eliminada', deletedReservation);
        return res.status(200).json({ message: 'Reserva eliminada correctamente' });
    } catch (error) {
        if (error.message === 'Reserva no encontrada') {
            return res.status(404).json({ error: error.message });
        }
        logError('Controlador', 'deleteReservation', error, 'Error al eliminar la reserva');
        return res.status(500).json({ error: 'Error al eliminar la reserva' });
    }
};
