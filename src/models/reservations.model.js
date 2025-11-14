import { db } from "../config/data.js";
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { log, logError } from '../utils/logger.utils.js';

const reservationsCollection = collection(db, "reservations");

export const getAllReservations = async () => {
    try {
        const snapshot = await getDocs(reservationsCollection);

        log('Modelo', 'getAllReservations', 'Reservas obtenidas exitosamente');
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        logError('Modelo', 'getAllReservations', error, 'Error al obtener las reservas');
        return [];
    }
};

export const getReservationById = async (id) => {
    try {
        const reservationRef = doc(reservationsCollection, id);

        const snapshot = await getDoc(reservationRef);

        log('Modelo', 'getReservationById', 'Reserva obtenida exitosamente');
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
        logError('Modelo', 'getReservationById', error, 'Error al obtener la reserva');
        return null;
    }
};

export const createReservation = async (data) => {
    try {
        // Validación básica
        if (!data || typeof data !== 'object') {
            log('Modelo', 'createReservation', 'Los datos de la reserva no son válidos');
            throw new Error('Los datos de la reserva no son válidos');
        }

        if (data.products && Array.isArray(data.products)) {
            data.products = data.products.map(product => {
                log('Modelo', 'createReservation', 'Creando referencia para el producto ', product);

                // Crear referencia de Firestore (ya viene collection preparada)
                const productRef = doc(db, product.collection, product.id);
                log('Modelo', 'createReservation', 'Referencia creada para el producto ', productRef.path);

                return {
                    productRef: productRef,
                    quantity: product.quantity,
                    unitPrice: product.unitPrice
                };
            });
        }

        const docRef = await addDoc(reservationsCollection, data);
        log('Modelo', 'createReservation', 'Reserva creada exitosamente');
        return { id: docRef.id, ...data };
    } catch (error) {
        logError('Modelo', 'createReservation', error, 'Error al crear la reserva en la base de datos');
        throw new Error('Error al crear la reserva en la base de datos');
    }
};

export const updateReservation = async (id, updateData) => {
    try {
        let reservationRef = doc(reservationsCollection, id);
        let snapshot = await getDoc(reservationRef);

        if (!snapshot.exists()) {
            log('Modelo', 'updateReservation', `No existe doc con doc.id='${id}', buscando por campo 'id' en documentos...`);

            const allSnapshot = await getDocs(reservationsCollection);

            const found = allSnapshot.docs.find(d => {
                const data = d.data();
                return data?.id == id || data?.id == Number(id);
            });

            if (!found) {
                log('Modelo', 'updateReservation', `No se encontró documento con campo 'id' == ${id}`);
                return null;
            }

            reservationRef = doc(reservationsCollection, found.id);
            snapshot = await getDoc(reservationRef);
            log('Modelo', 'updateReservation', `Encontrado doc con doc.id='${found.id}'`);
        }

        if (updateData.products && Array.isArray(updateData.products)) {
            updateData.products = updateData.products.map(product => ({
                productRef: doc(db, product.collection, product.id), 
                quantity: product.quantity,                          
                unitPrice: product.unitPrice                         
            }));
        }

        await updateDoc(reservationRef, updateData);

        const updatedSnapshot = await getDoc(reservationRef);
        const updatedData = { id: updatedSnapshot.id, ...updatedSnapshot.data() };

        log('Modelo', 'updateReservation', 'Reserva actualizada exitosamente');
        return updatedData;
    } catch (error) {
        logError('Modelo', 'updateReservation', error, 'Error al actualizar la reserva');
        return null;
    }
};

export const deleteReservation = async (id) => {
    try {
        const reservationRef = doc(reservationsCollection, id);

        const snapshot = await getDoc(reservationRef);

        if (!snapshot.exists()) {
            log('Capa Modelo', 'deleteReservation', `No existe doc con doc.id='${id}'`);
            return { deleted: false, message: 'Reserva no encontrada' };
        }

        await deleteDoc(reservationRef);

        log('Capa Modelo', 'deleteReservation', 'Reserva eliminada exitosamente');
        return snapshot.data();
    } catch (error) {
        logError('Capa Modelo', 'deleteReservation', error, 'Error al eliminar la reserva');
        return null;
    }
};