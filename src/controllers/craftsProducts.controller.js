import * as craftsProductsService from '../services/craftsProducts.service.js';

export const getCraftsProducts = async (req, res) => {
    try {
        const products = await craftsProductsService.getAllCraftsProducts();

        if (products.length === 0) {
            return res.status(404).json({ error: 'No hay productos disponibles' });
        }

        console.log("Capa Controlador ---> getCraftsProducts: ", products);
        return res.status(200).json(products);
    } catch (error) {
        console.error('Capa Controlador --> Error al obtener los productos: ', error);
        return res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

export const getCraftProductById = async (req, res) => {
    try {

        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID de producto inválido' });
        }
        const product = await craftsProductsService.getCraftProductById(id);

        console.log("Capa Controlador ---> getCraftProductById: ", product);
        return res.status(200).json(product);
    } catch (error) {
        if (error.message === 'Producto no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Capa Controlador --> Error al obtener el producto:', error);
        return res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

export const searchCraftProductByName = async (req, res) => {
    const { name } = req.query;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Se requiere el query param << name >>' });
    }

    try {
        const filteredProducts = await craftsProductsService.searchCraftProductByName(name);

        console.log('Capa Controlador ---> name: ', name);
        console.log('Capa Controlador ---> searchCraftProductByName: ', filteredProducts);
        return res.status(200).json(filteredProducts);;
    } catch (error) {
        console.error('Capa Controlador --> Error al buscar el producto por nombre:', error);
        return res.status(500).json({ error: 'Error al buscar el producto por nombre' });
    }
};

export const createCraftProduct = async (req, res) => {
    const validation = craftsProductsService.validateProductData(req.body);

    if (!validation.valid) {
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

        console.log("Capa Controlador ---> createCraftProduct: ", newProduct);
        return res.status(201).json(newProduct);
    } catch (error) {
        console.error('Capa Controlador --> Error al crear el producto:', error);
        return res.status(500).json({ error: 'Error al crear el producto' });
    }
};

export const updateCraftProduct = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'ID de producto inválido' });
    }

    const validation = craftsProductsService.validateUpdateData(req.body);

    if (!validation.valid) {
        return res.status(400).json({
            error: 'Datos inválidos',
            details: validation.errors
        });
    }

    const { name, brandArtist, creationDate, description, ecoFriendly, price, stock } = req.body;

    try {
        const updatedProduct = await craftsProductsService.updateCraftProduct(id, { name, brandArtist, creationDate, description, ecoFriendly, price, stock });

        console.log("Capa Controlador ---> updateCraftProduct: ", updatedProduct);
        return res.status(200).json(updatedProduct);
    } catch (error) {
        if (error.message === 'Producto no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Capa Controlador --> Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });

    }
};

export const deleteCraftProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID de producto inválido' });
        }
        const deletedProduct = await craftsProductsService.deleteCraftProduct(id);

        console.log("Capa Controlador ---> deleteCraftProduct: ", deletedProduct);
        return res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        if (error.message === 'Producto no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Capa Controlador --> Error al eliminar el producto:', error);
        return res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

