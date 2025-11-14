import * as model from "../models/craftsProducts.model.js";
import { log } from '../utils/logger.utils.js';

export const getAllCraftsProducts = async () => {
    log('Servicio', 'getAllCraftsProducts', 'Productos enviados');
    return await model.getAllCraftsProducts();
};

export const getCraftProductById = async (id) => {
    const product = await model.getCraftProductById(id);
    if (!product) {
        log('Servicio', 'getCraftProductById', 'Producto no encontrado');
        throw new Error('Producto no encontrado');
    }

    log('Servicio', 'getCraftProductById', 'Producto enviado');
    return product;
};

export const createCraftProduct = async (data) => {
    log('Servicio', 'createCraftProduct', 'Enviado');
    return await model.createCraftProduct(data);
};

export const searchCraftProductByName = async (name) => {
    const products = await model.getAllCraftsProducts();

    if (!Array.isArray(products)) {
        log('Servicio', 'searchCraftProductByName', 'Error interno al obtener productos');
        throw new Error('Error interno al obtener productos');
    }

    const filteredProducts = products.filter((product) =>
        typeof product.name === 'string' &&
        product.name.toLowerCase().includes(name.toLowerCase().trim())
    );

    if (filteredProducts.length === 0) {
        log('Servicio', 'searchCraftProductByName', 'No se encontraron productos con ese nombre');
        throw new Error('No se encontraron productos con ese nombre');
    }

    log('Servicio', 'searchCraftProductByName', 'Producto/s enviados');
    return filteredProducts;
};

export const updateCraftProduct = async (id, updateData) => {

    const updateProduct = await model.getCraftProductById(id);
    if (!updateProduct) {
        log('Servicio', 'updateCraftProduct', 'Producto no encontrado');
        throw new Error('Producto no encontrado');
    }

    log('Servicio', 'updateCraftProduct', 'Enviado');
    return await model.updateCraftProduct(id, updateData);
};

export const deleteCraftProduct = async (id) => {
    const deleteProduct = await model.getCraftProductById(id);
    if (!deleteProduct) {
        log('Servicio', 'deleteCraftProduct', 'Producto no encontrado');
        throw new Error('Producto no encontrado');
    }

    log('Servicio', 'deleteCraftProduct', 'Enviado');
    return await model.deleteCraftProduct(id);
};


export const validateProductData = (data) => {
    const errors = [];

    log('Servicio', 'validateProductData', 'Validando datos del producto...');
    // Verifico si se recibió algún dato
    if (!data) {
        errors.push("No se proporcionó data del producto");
        return { valid: false, errors };
    }

    // Validación del campo "name"
    if (typeof data.name !== 'string' || data.name.trim().length < 1) {
        errors.push('El campo "name" es obligatorio y debe ser un string no vacío');
    }

    // Validación del campo "brandArtist" (obligatorio para artesanías)
    if (typeof data.brandArtist !== 'string' || data.brandArtist.trim().length < 1) {
        errors.push('El campo "brandArtist" es obligatorio y debe ser un string no vacío');
    }

    // Validación del campo "creationDate" (formato DD-MM-YY)
    if (!data.creationDate || typeof data.creationDate !== 'string') {
        errors.push('El campo "creationDate" es obligatorio');
    } else {
        // Validar formato básico de fecha (DD-MM-YY)
        const dateRegex = /^\d{2}-\d{2}-\d{2}$/;
        if (!dateRegex.test(data.creationDate)) {
            errors.push('El campo "creationDate" debe tener formato DD-MM-YY (ej: 15-09-24)');
        }
    }

    // Validación del campo "description" (obligatorio para artesanías)
    if (typeof data.description !== 'string' || data.description.trim().length < 1) {
        errors.push('El campo "description" es obligatorio y debe ser un string no vacío');
    }

    // Validación del campo "ecoFriendly" (booleano)
    if (data.ecoFriendly !== undefined && typeof data.ecoFriendly !== 'boolean') {
        errors.push('El campo "ecoFriendly" debe ser un valor booleano (true/false)');
    }

    // Validación del campo "price"
    if (data.price == null || isNaN(Number(data.price)) || Number(data.price) <= 0) {
        errors.push('El campo "price" es obligatorio, debe ser numérico y mayor a 0');
    }

    // Validación del campo "stock" (para artesanías únicas suele ser 1)
    if (data.stock == null || isNaN(Number(data.stock)) || Number(data.stock) < 0) {
        errors.push('El campo "stock" es obligatorio, debe ser numérico y no negativo');
    }

    return { valid: errors.length === 0, errors };
};

export const validateUpdateData = (data) => {
    const { name, brandArtist, creationDate, description, ecoFriendly, price, stock } = data;
    const errors = [];

    log('Servicio', 'validateUpdateData', 'Validando datos para actualizar el producto...');
    // Verificar que al menos un campo esté presente para actualizar
    if (!name && !brandArtist && !creationDate && !description &&
        ecoFriendly === undefined && !price && stock === undefined) {
        errors.push('Debes proporcionar al menos un campo para actualizar');
        return { valid: false, message: 'Debes proporcionar al menos un campo para actualizar' };
    }

    // Validación del campo "name"
    if (name !== undefined && (typeof name !== 'string' || name.trim().length < 1)) {
        errors.push('El campo "name" debe ser un string no vacío');
    }

    // Validación del campo "brandArtist"
    if (brandArtist !== undefined && (typeof brandArtist !== 'string' || brandArtist.trim().length < 1)) {
        errors.push('El campo "brandArtist" debe ser un string no vacío');
    }

    // Validación del campo "creationDate" (formato DD-MM-YY)
    if (creationDate !== undefined) {
        if (typeof creationDate !== 'string') {
            errors.push('El campo "creationDate" debe ser un string');
        } else {
            const dateRegex = /^\d{2}-\d{2}-\d{2}$/;
            if (!dateRegex.test(creationDate)) {
                errors.push('El campo "creationDate" debe tener formato DD-MM-YY (ej: 15-09-24)');
            }
        }
    }

    // Validación del campo "description"
    if (description !== undefined && (typeof description !== 'string' || description.trim().length < 1)) {
        errors.push('El campo "description" debe ser un string no vacío');
    }

    // Validación del campo "ecoFriendly" (booleano)
    if (ecoFriendly !== undefined && typeof ecoFriendly !== 'boolean') {
        errors.push('El campo "ecoFriendly" debe ser un valor booleano (true/false)');
    }

    // Validación del campo "price"
    if (price !== undefined && (isNaN(Number(price)) || Number(price) <= 0)) {
        errors.push('El campo "price" debe ser numérico y mayor a 0');
    }

    // Validación del campo "stock"
    if (stock !== undefined && (isNaN(Number(stock)) || Number(stock) < 0)) {
        errors.push('El campo "stock" debe ser numérico y no negativo');
    } else if (stock !== undefined && stock > 10) {
        errors.push('Para artesanías el stock no debería exceder 10 unidades');
    }

    return { valid: errors.length === 0, errors };
};
