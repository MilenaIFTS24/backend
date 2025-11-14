import * as craftsProductsService from '../services/craftsProducts.service.js';
import { log, logError } from '../utils/logger.utils.js';
export const getCraftsProducts = async (req, res) => {
    try {
        const products = await craftsProductsService.getAllCraftsProducts();

        if (products.length === 0) {
            log('Controlador', 'getCraftsProducts', 'No hay productos disponibles');
            return res.status(404).json({ error: 'No hay productos disponibles' });
        }

        log('Controlador', 'getCraftsProducts', 'Productos obtenidos', products);
        return res.status(200).json(products);
    } catch (error) {
        logError('Controlador', 'getCraftsProducts', error, 'Error al obtener los productos');
        return res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

export const getCraftProductById = async (req, res) => {
    try {

        const { id } = req.params;
        if (!id) {
            logError('Controlador', 'getCraftProductById', 'ID de producto inválido');
            return res.status(400).json({ error: 'ID de producto inválido' });
        }
        const product = await craftsProductsService.getCraftProductById(id);

        log('Controlador', 'getCraftProductById', 'Producto obtenido', product);
        return res.status(200).json(product);
    } catch (error) {
        if (error.message === 'Producto no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        logError('Controlador', 'getCraftProductById', error, 'Error al obtener el producto');
        return res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

export const searchCraftProductByName = async (req, res) => {
    const { name } = req.query;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        log('Controlador', 'searchCraftProductByName', 'Se requiere el query param << name >>');
        return res.status(400).json({ error: 'Se requiere el query param << name >>' });
    }

    try {
        const filteredProducts = await craftsProductsService.searchCraftProductByName(name);

        log('Controlador', 'searchCraftProductByName', 'name', name)
        log('Controlador', 'searchCraftProductByName', 'filteredProducts', filteredProducts)
        return res.status(200).json(filteredProducts);;
    } catch (error) {
        logError('Controlador', 'searchCraftProductByName', error, 'Error al buscar el producto por nombre');
        return res.status(500).json({ error: 'Error al buscar el producto por nombre' });
    }
};

export const createCraftProduct = async (req, res) => {
    const validation = craftsProductsService.validateProductData(req.body);

    if (!validation.valid) {
        log('Controlador', 'createCraftProduct', 'Datos inválidos', validation.errors);
        return res.status(400).json({
            error: 'Datos inválidos',
            details: validation.errors
        });
    }

    const { name, brandArtist, creationDate, description, ecoFriendly, price, stock } = req.body;

    try {
        const newProduct = await craftsProductsService.createCraftProduct({
            name,
            brandArtist,
            creationDate,
            description,
            ecoFriendly,
            price,
            stock,
        });

        log('Controlador', 'createCraftProduct', 'Producto creado', newProduct);
        return res.status(201).json(newProduct);
    } catch (error) {
        logError('Controlador', 'createCraftProduct', error, 'Error al crear el producto');
        return res.status(500).json({ error: 'Error al crear el producto' });
    }
};

export const updateCraftProduct = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        log('Controlador', 'updateCraftProduct', 'ID de producto inválido');
        return res.status(400).json({ error: 'ID de producto inválido' });
    }

    const validation = craftsProductsService.validateUpdateData(req.body);

    if (!validation.valid) {
        log('Controlador', 'updateCraftProduct', 'Datos inválidos', validation.errors);
        return res.status(400).json({
            error: 'Datos inválidos',
            details: validation.errors
        });
    }

    const { name, brandArtist, creationDate, description, ecoFriendly, price, stock } = req.body;

    try {
        const updatedProduct = await craftsProductsService.updateCraftProduct(id, { name, brandArtist, creationDate, description, ecoFriendly, price, stock });

        log('Controlador', 'updateCraftProduct', 'Producto actualizado', updatedProduct);
        return res.status(200).json(updatedProduct);
    } catch (error) {
        if (error.message === 'Producto no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        logError('Controlador', 'updateCraftProduct', error, 'Error al actualizar el producto');
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

export const deleteCraftProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            log('Controlador', 'deleteCraftProduct', 'ID de producto inválido');
            return res.status(400).json({ error: 'ID de producto inválido' });
        }
        const deletedProduct = await craftsProductsService.deleteCraftProduct(id);

        log('Controlador', 'deleteCraftProduct', 'Producto eliminado', deletedProduct);
        return res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        if (error.message === 'Producto no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        logError('Controlador', 'deleteCraftProduct', error, 'Error al eliminar el producto');
        return res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

