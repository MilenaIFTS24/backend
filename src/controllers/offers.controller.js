import * as offersService from '../services/offers.service.js';
import { log, logError } from '../utils/logger.utils.js';

export const getOffers = async (req, res) => {
    try {
        const offers = await offersService.getAllOffers();

        if (offers.length === 0) {
            log('Controlador', 'getOffers', 'No hay ofertas disponibles', null, 404);
            return res.status(404).json({ error: 'No hay ofertas disponibles' });
        }

        log('Controlador', 'getOffers', 'Ofertas obtenidas', offers);
        return res.status(200).json(offers);
    } catch (error) {
        logError('Controlador', 'getOffers', error, 'Error al obtener las ofertas', 500);
        return res.status(500).json({ error: 'Error al obtener las ofertas' });
    }
};

export const getOfferById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            log('Controlador', 'getOfferById', 'ID de oferta inválido', null, 400);
            return res.status(400).json({ error: 'ID de oferta inválido' });
        }
        const offer = await offersService.getOfferById(id);

        log('Controlador', 'getOfferById', 'Oferta obtenida', offer);
        return res.status(200).json(offer);
    } catch (error) {
        if (error.message === 'Oferta no encontrada') {
            return res.status(404).json({ error: error.message });
        }
        logError('Controlador', 'getOfferById', error, 'Error al obtener la oferta', 500);
        return res.status(500).json({ error: 'Error al obtener la oferta' });
    }
};

export const searchOfferByTitle = async (req, res) => {
    const { title } = req.query;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        log('Controlador', 'searchOfferByTitle', 'Se requiere el query param << title >>', null, 400);
        return res.status(400).json({ error: 'Se requiere el query param << title >>' });
    }

    try {
        const filteredOffers = await offersService.searchOfferByTitle(title);

        log('Controlador', 'searchOfferByTitle', 'title', title);
        log('Controlador', 'searchOfferByTitle', 'filteredOffers', filteredOffers);
        return res.status(200).json(filteredOffers);
    } catch (error) {
        logError('Controlador', 'searchOfferByTitle', error, 'Error al buscar la oferta por titulo', 500);
        return res.status(500).json({ error: 'Error al buscar la oferta por titulo' });
    }
};

export const createOffer = async (req, res) => {
    const validation = offersService.validateOfferData(req.body);

    if (!validation.valid) {
        log('Controlador', 'createOffer', 'Datos inválidos', validation.errors, 400);
        return res.status(400).json({
            error: 'Datos inválidos',
            details: validation.errors
        });
    }

    const { title, description, applicableTo, minimumPurchase, isLimited, limit, state, promotionalCode, startDate, endDate } = req.body;

    try {
        const newOffer = await offersService.createOffer({
            title,
            description,
            applicableTo,
            minimumPurchase,
            isLimited,
            limit,
            state,
            promotionalCode,
            startDate,
            endDate,
        });

        log('Controlador', 'createOffer', 'Oferta creada', newOffer, 201);
        return res.status(201).json(newOffer);
    } catch (error) {
        logError('Controlador', 'createOffer', error, 'Error al crear la oferta', 500);
        return res.status(500).json({ error: 'Error al crear la oferta' });
    }
};

export const updateOffer = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        log('Controlador', 'updateOffer', 'ID de oferta inválido', null, 400);
        return res.status(400).json({ error: 'ID de oferta inválido' });
    }

    const validation = offersService.validateUpdateData(req.body);

    if (!validation.valid) {
        log('Controlador', 'updateOffer', 'Datos inválidos', validation.errors, 400);
        return res.status(400).json({
            error: 'Datos inválidos',
            details: validation.errors
        });
    }

    const { title, description, applicableTo, minimumPurchase, isLimited, limit, state, promotionalCode, startDate, endDate } = req.body;

    try {
        const updatedProduct = await offersService.updateOffer(id, { title, description, applicableTo, minimumPurchase, isLimited, limit, state, promotionalCode, startDate, endDate });

        log('Controlador', 'updateOffer', 'Oferta actualizada', updatedProduct);
        return res.status(200).json(updatedProduct);
    } catch (error) {
        if (error.message === 'Oferta no encontrada') {
            return res.status(404).json({ error: error.message });
        }
        logError('Controlador', 'updateOffer', error, 'Error al actualizar la oferta', 500);
        return res.status(500).json({ error: 'Error al actualizar la oferta' });
    }
};

export const deleteOffer = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            log('Controlador', 'deleteOffer', 'ID de oferta inválido', null, 400);
            return res.status(400).json({ error: 'ID de oferta inválido' });
        }
        const deletedOffer = await offersService.deleteOffer(id);

        log('Controlador', 'deleteOffer', 'Oferta eliminada', deletedOffer);
        return res.status(200).json({ message: 'Oferta eliminada correctamente' });
    } catch (error) {
        if (error.message === 'Oferta no encontrada') {
            return res.status(404).json({ error: error.message });
        }
        logError('Controlador', 'deleteOffer', error, 'Error al eliminar la oferta', 500);
        return res.status(500).json({ error: 'Error al eliminar la oferta' });
    }
};