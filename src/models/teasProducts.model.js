import { db } from "../config/data.js";
import { collection, doc, getDocs, getDoc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";
import { log, logError } from '../utils/logger.utils.js';

const productsCollection = collection(db, "teasProducts");

export const getAllTeasProducts = async () => {
    try {
        const snapshot = await getDocs(productsCollection);

        log('Modelo', 'getAllTeasProducts', 'Productos obtenidos exitosamente');
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        logError('Modelo', 'getAllTeasProducts', error, 'Error al obtener los productos');
        return [];
    }
};

export const getTeaProductById = async (id) => {
    try {
        const productRef = doc(productsCollection, id);

        const snapshot = await getDoc(productRef);

        log('Modelo', 'getTeaProductById', 'Producto obtenido exitosamente');
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
        logError('Modelo', 'getTeaProductById', error, 'Error al obtener el producto');
        return null;
    }
};

export const createTeaProduct = async (data) => {
    try {
        if (!data || typeof data !== 'object') {
            log('Modelo', 'createTeaProduct', 'Los datos del producto no son válidos');
            throw new Error('Los datos del producto no son válidos');
        }

        const docRef = await addDoc(productsCollection, data);

        log('Modelo', 'createTeaProduct', 'Producto creado exitosamente');
        return { id: docRef.id, ...data };
    } catch (error) {
        logError('Modelo', 'createTeaProduct', error, 'Error al crear el producto en la base de datos');
        throw new Error('Error al crear el producto en la base de datos');
    }
};

export const updateTeaProduct = async (id, updateData) => {
    try {
        let productRef = doc(productsCollection, id);
        let snapshot = await getDoc(productRef);

        if (!snapshot.exists()) {
            log('Modelo', 'updateTeaProduct', `No existe doc con doc.id='${id}', buscando por campo 'id' en documentos...`);
            const allSnapshot = await getDocs(productsCollection);

            const found = allSnapshot.docs.find(d => {
                const data = d.data();
                return data?.id == id || data?.id == Number(id);
            });

            if (!found) {
                log('Modelo', 'updateTeaProduct', `No se encontró documento con campo 'id' == ${id}`);
                return null;
            }

            productRef = doc(productsCollection, found.id);
            snapshot = await getDoc(productRef);
            log('Modelo', 'updateTeaProduct', `Encontrado doc con doc.id='${found.id}'`);
        }

        await updateDoc(productRef, updateData);

        const updatedSnapshot = await getDoc(productRef);
        const updatedData = { id: updatedSnapshot.id, ...updatedSnapshot.data() };

        log('Modelo', 'updateTeaProduct', 'Producto actualizado exitosamente');
        return updatedData;
    } catch (error) {
        logError('Modelo', 'updateTeaProduct', error, 'Error al actualizar el producto');
        return null;
    }
};

export const deleteTeaProduct = async (id) => {
    try {
        const productRef = doc(productsCollection, id);

        const snapshot = await getDoc(productRef);

        if (!snapshot.exists()) {
            log('Modelo', 'deleteTeaProduct', `No existe doc con doc.id='${id}'`);
            return { deleted: false, message: 'Producto no encontrado' };
        }

        await deleteDoc(productRef);

        log('Modelo', 'deleteTeaProduct', 'Producto eliminado exitosamente');
        return snapshot.data();
    } catch (error) {
        logError('Modelo', 'deleteTeaProduct', error, 'Error al eliminar el producto');
        return null;
    }
};
