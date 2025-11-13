import { db } from "../config/data.js";
import { collection, doc, getDocs, getDoc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";

const productsCollection = collection(db, "teasProducts");

export const getAllTeasProducts = async () => {
    try {
        const snapshot = await getDocs(productsCollection);

        console.log('Capa Modelo ---> getAllTeasProducts: enviado');
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Capa Modelo --> Error al obtener los productos:', error);
        return [];
    }
};

export const getTeaProductById = async (id) => {
    try {
        const productRef = doc(productsCollection, id);

        const snapshot = await getDoc(productRef);

        console.log('Capa Modelo ---> getTeaProductById: enviado');
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
        console.error('Capa Modelo --> Error al obtener el producto:', error);
        return null;
    }
};

export const createTeaProduct = async (data) => {
    try {
        if (!data || typeof data !== 'object') {
            throw new Error('Los datos del producto no son válidos');
        }

        const docRef = await addDoc(productsCollection, data);

        console.log('Capa Modelo ---> createTeaProduct: enviado');
        return { id: docRef.id, ...data };

    } catch (error) {
        console.error('Capa Modelo --> Error al crear el producto en la base de datos:', error);
        throw new Error('Error al crear el producto en la base de datos');
    }
};

export const updateTeaProduct = async (id, updateData) => {

    try {
        let productRef = doc(productsCollection, id);
        let snapshot = await getDoc(productRef);

        if (!snapshot.exists()) {
            console.warn(`No existe doc con doc.id='${id}', buscando por campo 'id' en documentos...`);

            const allSnapshot = await getDocs(productsCollection);

            const found = allSnapshot.docs.find(d => {
                const data = d.data();
                return data?.id == id || data?.id == Number(id);
            });

            if (!found) {
                console.warn(`No se encontró documento con campo 'id' == ${id}`);
                return null;
            }

            productRef = doc(productsCollection, found.id);
            snapshot = await getDoc(productRef);
            console.log(`Encontrado doc con doc.id='${found.id}'`);
        }

        await updateDoc(productRef, updateData);

        const updatedSnapshot = await getDoc(productRef);
        const updatedData = { id: updatedSnapshot.id, ...updatedSnapshot.data() };

        console.log('Capa Modelo ---> updateTeaProduct:', updatedData);
        return updatedData;
    } catch (error) {
        console.error('Capa Modelo --> Error al actualizar el producto:', error);
        return null;
    }
}

export const deleteTeaProduct = async (id) => {
    try {
        const productRef = doc(productsCollection, id);

        const snapshot = await getDoc(productRef);

        if (!snapshot.exists()) {
            console.warn(`No existe doc con doc.id='${id}'`);
            return { deleted: false, message: 'Producto no encontrado' };
        }

        await deleteDoc(productRef);

        console.log('Capa Modelo ---> deleteTeaProduct: enviado');
        return snapshot.data();
    } catch (error) {
        console.error('Capa Modelo --> Error al eliminar el producto:', error);
        return null;
    }
}
