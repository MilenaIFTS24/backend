import * as teasProductsService from '../services/teasProducts.service.js';

export const getTeasProducts = async (req, res) => { //Exportación nombrada (no default)
    try {
        const products = await teasProductsService.getAllTeasProducts();

        if (products.length === 0) {
            return res.status(404).json({ error: 'No hay productos disponibles' });
        }

        console.log("Capa Controlador ---> getTeasProducts: ", products);
        return res.status(200).json(products);
    } catch (error) {
        console.error('Capa Controlador --> Error al obtener los productos:', error);
        return res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

export const getTeaProductById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID de producto inválido' });
        }
        const product = await teasProductsService.getTeaProductById(id);

        console.log("Capa Controlador ---> getTeaProductById: ", product);
        return res.status(200).json(product);
    } catch (error) {
        if (error.message === 'Producto no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Capa Controlador --> Error al obtener el producto:', error);
        return res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

export const searchTeaProductByName = async (req, res) => {
    const { name } = req.query;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Se requiere el query param << name >>' });
    }

    try {
        const filteredProducts = await teasProductsService.searchTeaProductByName(name);

        console.log('Capa Controlador ---> name: ', name);
        console.log('Capa Controlador ---> searchTeaProductByName: ', filteredProducts);
        return res.status(200).json(filteredProducts);
    } catch (error) {
        console.error('Capa Controlador --> Error al buscar el producto por nombre:', error);
        return res.status(500).json({ error: 'Error al buscar el producto por nombre' });
    }
}

export const createTeaProduct = async (req, res) => {
    const validation = teasProductsService.validateProductData(req.body);

    if (!validation.valid) {
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

        console.log("Capa Controlador ---> createTeaProduct: ", newProduct);
        return res.status(201).json(newProduct);
    } catch (error) {
        console.error('Capa Controlador --> Error al crear el producto:', error);
        return res.status(500).json({ error: 'Error al crear el producto' });
    }
};

export const updateTeaProduct = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'ID de producto inválido' });
    }

    const validation = teasProductsService.validateUpdateData(req.body);

    if (!validation.valid) {
        return res.status(400).json({
            error: 'Datos inválidos',
            details: validation.errors
        });
    }

    const { name, brand, description, price, stock } = req.body;

    try {
        const updatedProduct = await teasProductsService.updateTeaProduct(id, { name, brand, description, price, stock });

        if (updatedProduct === null) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        console.log("Capa Controlador ---> updateTeaProduct: ", updatedProduct);
        return res.status(200).json(updatedProduct);
    } catch (error) {
        if (error.message === 'Producto no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Capa Controlador --> Error al actualizar el producto:', error);
        return res.status(500).json({ error: 'Error al actualizar el producto' });

    }
};

export const deleteTeaProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID de producto inválido' });
        }
        const deletedProduct = await teasProductsService.deleteTeaProduct(id);

        console.log("Capa Controlador ---> deleteTeaProduct: ", deletedProduct);
        return res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        if (error.message === 'Producto no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Capa Controlador --> Error al eliminar el producto:', error);
        return res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};