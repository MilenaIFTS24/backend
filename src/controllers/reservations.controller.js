import * as reservationsService from '../services/reservations.service.js';

export const getReservations = async (req, res) => {
    try {
        const reservations = await reservationsService.getAllReservations();

        if (reservations.length === 0) {
            return res.status(404).json({ error: 'No hay reservas' });
        }

        console.log("Capa Controlador ---> getReservations: ", reservations);
        return res.status(200).json(reservations);
    } catch (error) {
        console.error('Capa Controlador --> Error al obtener las reservas:', error);
        return res.status(500).json({ error: 'Error al obtener las reservas' });
    }
};

export const getReservationById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID de reserva inválido' });
        }
        const reservation = await reservationsService.getReservationById(id);

        console.log("Capa Controlador ---> getReservationById: ", reservation);
        return res.status(200).json(reservation);
    } catch (error) {
        if (error.message === 'Reserva no encontrada') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Capa Controlador --> Error al obtener la reserva:', error);
        return res.status(500).json({ error: 'Error al obtener la reserva' });
    }
};

export const createReservation = async (req, res) => {
    const validation = reservationsService.validateReservationData(req.body);

    if (!validation.valid) {
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

        console.log("Capa Controlador ---> createReservation: ", newReservation);
        return res.status(201).json(newReservation);
    } catch (error) {
        console.error('Capa Controlador --> Error al crear la reserva:', error);
        return res.status(500).json({ error: 'Error al crear la reserva' });
    }
};

export const updateReservation = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'ID de reserva inválido' });
    }

    const validation = validateReservationUpdateData(req.body);

    if (!validation.valid) {
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

        console.log("Capa Controlador ---> updateReservation: ", updatedReservation);
        return res.status(200).json(updatedReservation);
    } catch (error) {
        if (error.message === 'Reserva no encontrada') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Capa Controlador --> Error al actualizar la reserva:', error);
        return res.status(500).json({ error: 'Error al actualizar la reserva' });
    }

};

export const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID de reserva inválido' });
        }
        const deletedReservation = await reservationsService.deleteReservation(id);

        console.log("Capa Controlador ---> deleteReservation: ", deletedReservation);
        return res.status(200).json({ message: 'Reserva eliminada correctamente' });
    } catch (error) {
        if (error.message === 'Reserva no encontrada') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Capa Controlador --> Error al eliminar la reserva:', error);
        return res.status(500).json({ error: 'Error al eliminar la reserva' });
    }
};
