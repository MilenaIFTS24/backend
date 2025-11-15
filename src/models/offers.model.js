import { db } from "../config/data.js";
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { log, logError } from '../utils/logger.utils.js';

const offersCollection = collection(db, "offers");

export const getAllOffers = async () => {
    try {
        const snapshot = await getDocs(offersCollection);

        log('Modelo', 'getAllOffers', 'Ofertas obtenidas exitosamente');
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        logError('Modelo', 'getAllOffers', error, 'Error al obtener las ofertas');
        return [];
    }
}

export const getOfferById = async (id) => {
    try {
        const offerRef = doc(offersCollection, id);

        const snapshot = await getDoc(offerRef);

        log('Modelo', 'getOfferById', 'Oferta obtenida exitosamente');
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
        logError('Modelo', 'getOfferById', error, 'Error al obtener la oferta');
        return null;
    }
}

export const createOffer = async (data) => {
    try {

        if (!data || typeof data !== 'object') {
            log('Modelo', 'createOffer', 'Los datos de la oferta no son válidos'); 
            throw new Error('Los datos de la oferta no son válidos');
        }
        if (data.applicableTo && Array.isArray(data.applicableTo)) {
            data.applicableTo = data.applicableTo.map(product =>
                doc(db, product.collection, product.id) 
            );
        }

        const docRef = await addDoc(offersCollection, data);

        log('Modelo', 'createOffer', 'Oferta creada exitosamente');
        return { id: docRef.id, ...data };

    } catch (error) {
        logError('Modelo', 'createOffer', error, 'Error al crear la oferta en la base de datos');
        throw new Error('Error al crear la oferta en la base de datos');
    }
}

export const updateOffer = async (id, updateData) => {
    try {
        let offerRef = doc(offersCollection, id);
        let snapshot = await getDoc(offerRef);

        if (!snapshot.exists()) {
            log('Modelo', 'updateOffer', `No existe doc con doc.id='${id}', buscando por campo 'id' en documentos...`);

            const allSnapshot = await getDocs(offersCollection);

            const found = allSnapshot.docs.find(d => {
                const data = d.data();
                return data?.id == id || data?.id == Number(id);
            });

            if (!found) {
                log('Modelo', 'updateOffer', `No se encontró documento con campo 'id' == ${id}`);
                return null;
            }

            offerRef = doc(offersCollection, found.id);
            snapshot = await getDoc(offerRef);
            log('Modelo', 'updateOffer', `Encontrado doc con doc.id='${found.id}'`);
        }

        if (updateData.applicableTo && Array.isArray(updateData.applicableTo)) {
            updateData.applicableTo = updateData.applicableTo.map(product =>
                doc(db, product.collection, product.id) 
            );
        }
        await updateDoc(offerRef, updateData);

        const updatedSnapshot = await getDoc(offerRef);
        const updatedData = { id: updatedSnapshot.id, ...updatedSnapshot.data() };

        log('Modelo', 'updateOffer', 'Oferta actualizada exitosamente');
        return updatedData;
    } catch (error) {
        logError('Modelo', 'updateOffer', error, 'Error al actualizar la oferta');
        return null;
    }
};

export const deleteOffer = async (id) => {
    try {
        const offerRef = doc(offersCollection, id);

        const snapshot = await getDoc(offerRef);

        if (!snapshot.exists()) {
            log('Modelo', 'deleteOffer', `No existe doc con doc.id='${id}'`);
            return { deleted: false, message: 'Oferta no encontrada' };
        }

        await deleteDoc(offerRef);
        log('Modelo', 'deleteOffer', 'Oferta eliminada exitosamente');
        return snapshot.data();
    } catch (error) {
        logError('Modelo', 'deleteOffer', error, 'Error al eliminar la oferta');
        return null;
    }
}