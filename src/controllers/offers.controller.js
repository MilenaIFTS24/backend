import * as offersService from '../services/offers.service.js';

export const getOffers = async (req, res) => {
    try {
        const offers = await offersService.getAllOffers();

        if (offers.length === 0) {
            return res.status(404).json({ error: 'No hay ofertas disponibles' });
        }

        console.log("Capa Controlador ---> getOffers: ", offers);
        return res.status(200).json(offers);

    } catch (error) {
        console.error('Capa Controlador --> Error al obtener las ofertas:', error);
        return res.status(500).json({ error: 'Error al obtener las ofertas' });
    }
};

export const getOfferById = async (req, res) => {
    try {

        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID de oferta inválido' });
        }
        const offer = await offersService.getOfferById(id);

        console.log("Capa Controlador ---> getOfferById: ", offer);
        return res.status(200).json(offer);
    } catch (error) {
        if (error.message === 'Oferta no encontrada') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Capa Controlador --> Error al obtener la oferta:', error);
        return res.status(500).json({ error: 'Error al obtener la oferta' });
    }
};

export const searchOfferByTitle = async (req, res) => {
    const { title } = req.query;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Se requiere el query param << title >>' });
    }

    try {
        const filteredOffers = await offersService.searchOfferByTitle(title);

        console.log('Capa Controlador ---> title: ', title);
        console.log('Capa Controlador ---> searchOfferByTitle: ', filteredOffers);
        return res.status(200).json(filteredOffers);
    } catch (error) {
        console.error('Capa Controlador --> Error al buscar la oferta por titulo:', error);
        return res.status(500).json({ error: 'Error al buscar la oferta por titulo' });
    }
}

export const createOffer = async (req, res) => {
    const validation = offersService.validateOfferData(req.body);

    if (!validation.valid) {
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

        console.log("Capa Controlador ---> createOffer: ", newOffer);
        return res.status(201).json(newOffer);
    } catch (error) {
        console.error('Capa Controlador --> Error al crear la oferta:', error);
        return res.status(500).json({ error: 'Error al crear la oferta' });
    }
}

export const updateOffer = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'ID de oferta inválido' });
    }

    const validation = offersService.validateUpdateData(req.body);

    if (!validation.valid) {
        return res.status(400).json({
            error: 'Datos inválidos',
            details: validation.errors
        });
    }

    const { title, description, applicableTo, minimumPurchase, isLimited, limit, state, promotionalCode, startDate, endDate } = req.body;

    try {
        const updatedProduct = await offersService.updateOffer(id, { title, description, applicableTo, minimumPurchase, isLimited, limit, state, promotionalCode, startDate, endDate });

        console.log("Capa Controlador ---> updateOffer: ", updatedProduct);
        return res.status(200).json(updatedProduct);
    } catch (error) {
        if (error.message === 'Oferta no encontrada') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Capa Controlador --> Error al actualizar la oferta:', error);
        return res.status(500).json({ error: 'Error al actualizar la oferta' });
    }
};

export const deleteOffer = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID de oferta inválido' });
        }
        const deletedOffer = await offersService.deleteOffer(id);

        console.log("Capa Controlador ---> deleteOffer: ", deletedOffer);
        return res.status(200).json({ message: 'Oferta eliminada correctamente' });
    } catch (error) {
        if (error.message === 'Oferta no encontrada') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Capa Controlador --> Error al eliminar la oferta:', error);
        return res.status(500).json({ error: 'Error al eliminar la oferta' });
    }
};