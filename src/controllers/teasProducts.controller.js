import * as teasProductsService from '../services/teasProducts.service.js';
import { log, logError } from '../utils/logger.utils.js';
export const getTeasProducts = async (req, res) => { //Exportación nombrada (no default)
    try {
        const products = await teasProductsService.getAllTeasProducts();

        if (products.length === 0) {
            log('Controlador', 'getTeasProducts', 'No hay productos disponibles', null, 404);
            return res.status(404).json({ error: 'No hay productos disponibles' });
        }

        log('Controlador', 'getTeasProducts', 'Productos obtenidos', products);
        return res.status(200).json(products);
    } catch (error) {
        logError('Controlador', 'getTeasProducts', error, 'Error al obtener los productos', 500);
        return res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

export const getTeaProductById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            log('Controlador', 'getTeaProductById', 'ID de producto inválido', null, 400);
            return res.status(400).json({ error: 'ID de producto inválido' });
        }
        const product = await teasProductsService.getTeaProductById(id);

        log('Controlador', 'getTeaProductById', 'Producto obtenido', product);
        return res.status(200).json(product);
    } catch (error) {
        if (error.message === 'Producto no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        logError('Controlador', 'getTeaProductById', error, 'Error al obtener el producto', 500);
        return res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

export const searchTeaProductByName = async (req, res) => {
    const { name } = req.query;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        log('Controlador', 'searchTeaProductByName', 'Se requiere el query param << name >>', null, 400);
        return res.status(400).json({ error: 'Se requiere el query param << name >>' });
    }

    try {
        const filteredProducts = await teasProductsService.searchTeaProductByName(name);

        log('Controlador', 'searchTeaProductByName', 'name', name);
        log('Controlador', 'searchTeaProductByName', 'filteredProducts', filteredProducts);
        return res.status(200).json(filteredProducts);
    } catch (error) {
        logError('Controlador', 'searchTeaProductByName', error, 'Error al buscar el producto por nombre', 500);
        return res.status(500).json({ error: 'Error al buscar el producto por nombre' });
    }
};

export const createTeaProduct = async (req, res) => {
    const validation = teasProductsService.validateProductData(req.body);

    if (!validation.valid) {
        log('Controlador', 'createTeaProduct', 'Datos inválidos', validation.errors, 400);
        return res.status(400).json({
            error: 'Datos inválidos',
            details: validation.errors
        });
    }

    const { name, brand, description, price, stock } = req.body;

    try {
        const newProduct = await teasProductsService.createTeaProduct({
            name,
            brand,
            description,
            price,
            stock,
        });

        log('Controlador', 'createTeaProduct', 'Producto creado', newProduct, 201);
        return res.status(201).json(newProduct);
    } catch (error) {
        logError('Controlador', 'createTeaProduct', error, 'Error al crear el producto', 500);
        return res.status(500).json({ error: 'Error al crear el producto' });
    }
};

export const updateTeaProduct = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        log('Controlador', 'updateTeaProduct', 'ID de producto inválido', null, 400);
        return res.status(400).json({ error: 'ID de producto inválido' });
    }

    const validation = teasProductsService.validateUpdateData(req.body);

    if (!validation.valid) {
        log('Controlador', 'updateTeaProduct', 'Datos inválidos', validation.errors, 400);
        return res.status(400).json({
            error: 'Datos inválidos',
            details: validation.errors
        });
    }

    const { name, brand, description, price, stock } = req.body;

    try {
        const updatedProduct = await teasProductsService.updateTeaProduct(id, { name, brand, description, price, stock });

        if (updatedProduct === null) {
            log('Controlador', 'updateTeaProduct', 'Producto no encontrado', null, 404);
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        log('Controlador', 'updateTeaProduct', 'Producto actualizado', updatedProduct);
        return res.status(200).json(updatedProduct);
    } catch (error) {
        if (error.message === 'Producto no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        logError('Controlador', 'updateTeaProduct', error, 'Error al actualizar el producto', 500);
        return res.status(500).json({ error: 'Error al actualizar el producto' });

    }
};

export const deleteTeaProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            log('Controlador', 'deleteTeaProduct', 'ID de producto inválido', null, 400);
            return res.status(400).json({ error: 'ID de producto inválido' });
        }
        const deletedProduct = await teasProductsService.deleteTeaProduct(id);

        log('Controlador', 'deleteTeaProduct', 'Producto eliminado', deletedProduct);
        return res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        if (error.message === 'Producto no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        logError('Controlador', 'deleteTeaProduct', error, 'Error al eliminar el producto', 500);
        return res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};