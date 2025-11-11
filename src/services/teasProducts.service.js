import * as model from "../models/teasProducts.model.js";

export const getAllTeasProducts = async () => {
    return await model.getAllTeasProducts();
};

export const getTeaProductById = async (id) => {
    const product = await model.getTeaProductById(id);
    if (!product) {
        throw new Error('Producto no encontrado');
    }
    return product;
}

export const searchTeaProductByName = async (name) => {
    const products = await model.getAllTeasProducts();

    if (!Array.isArray(products)) {
        throw new Error('Error interno al obtener productos');
    }

    const filteredProducts = products.filter((product) =>
        typeof product.name === 'string' &&
        product.name.toLowerCase().includes(name.toLowerCase().trim())
    );

    if (filteredProducts.length === 0) {
        throw new Error('No se encontraron productos con ese nombre');
    }

    return filteredProducts;
}

export const createTeaProduct = async (data) => {
    return await model.createTeaProduct(data);
};

export const updateTeaProduct = async (id, updateData) => {

    const updateProduct = await model.getTeaProductById(id);
    if (!updateProduct) {
        throw new Error('Producto no encontrado');
    }

    return await model.updateTeaProduct(id, updateData);
}

export const deleteTeaProduct = async (id) => {
    const deleteProduct = await model.getTeaProductById(id);
    if (!deleteProduct) {
        throw new Error('Producto no encontrado');
    }
    return await model.deleteTeaProduct(id);
}

export const validateProductData = (data) => {
    const errors = [];

    // Verifico si se recibió algún dato
    if (!data) {
        errors.push("No se proporcionó data del producto");
        return { valid: false, errors };
    }

    // Validación del campo "name"
    if (typeof data.name !== 'string' || data.name.trim().length < 1) {
        errors.push('El campo "name" es obligatorio y debe ser un string no vacío');
    }

    // Validación del campo "brand" (opcional)
    if (data.brand && typeof data.brand !== 'string') {
        errors.push('El campo "brand" debe ser un string');
    }

    // Validación del campo "description" (opcional)
    if (data.description && typeof data.description !== 'string') {
        errors.push('El campo "description" debe ser un string');
    }

    // Validación del campo "price"
    if (data.price == null || isNaN(Number(data.price)) || Number(data.price) <= 0) {
        errors.push('El campo "price" es obligatorio, debe ser numérico y mayor a 0');
    }

    // Validación del campo "stock"
    if (data.stock == null || isNaN(Number(data.stock)) || Number(data.stock) < 0) {
        errors.push('El campo "stock" es obligatorio, debe ser numérico y no negativo');
    }

    return { valid: errors.length === 0, errors };
};

export const validateUpdateData = (data) => {
    const { name, brand, description, price, stock } = data;
    const errors = [];
    
    if (!name && !brand && !description && !price && stock === undefined) {
        return { valid: false, message: 'Debes proporcionar al menos un campo para actualizar' };
    }

    if (name !== undefined && (typeof name !== 'string' || name.trim().length < 1)) {
        errors.push('El campo "name" debe ser un string no vacío');
    }
    
    if (brand !== undefined && typeof brand !== 'string') {
        errors.push('El campo "brand" debe ser un string');
    }
    
    if (description !== undefined && typeof description !== 'string') {
        errors.push('El campo "description" debe ser un string');
    }
    
    if (price !== undefined && (isNaN(Number(price)) || Number(price) <= 0)) {
        errors.push('El campo "price" debe ser numérico y mayor a 0');
    }
    
    if (stock !== undefined && (isNaN(Number(stock)) || Number(stock) < 0)) {
        errors.push('El campo "stock" debe ser numérico y no negativo');
    }
    
    return { valid: errors.length === 0, errors };
};