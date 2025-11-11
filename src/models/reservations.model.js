import { db } from "../config/data.js";
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

const reservationsCollection = collection(db, "reservations");

export const getAllReservations = async () => {
    try {
        const snapshot = await getDocs(reservationsCollection);

        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error al obtener las reservas:', error);
        return [];
    }
}

export const getReservationById = async (id) => {
    try {
        const reservationRef = doc(reservationsCollection, id);

        const snapshot = await getDoc(reservationRef);

        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
        console.error('Error al obtener la reserva:', error);
        return null;
    }
}

export const createReservation = async (data) => {
    try {
        // Validación básica
        if (!data || typeof data !== 'object') {
            throw new Error('Los datos de la reserva no son válidos');
        }

        if (data.products && Array.isArray(data.products)) {
            data.products = data.products.map(product => {
                console.log('🔍 Creando referencia para:', product);

                // Crear referencia de Firestore (ya viene collection preparada)
                const productRef = doc(db, product.collection, product.id);
                console.log('✅ Referencia creada:', productRef.path);

                return {
                    productRef: productRef,
                    quantity: product.quantity,
                    unitPrice: product.unitPrice
                };
            });
        }

        const docRef = await addDoc(reservationsCollection, data);
        return { id: docRef.id, ...data };

    } catch (error) {
        console.error('Error al crear la reserva en la base de datos:', error);
        throw new Error('Error al crear la reserva en la base de datos');
    }
}

export const updateReservation = async (id, updateData) => {
    try {
        let reservationRef = doc(reservationsCollection, id);
        let snapshot = await getDoc(reservationRef);

        if (!snapshot.exists()) {
            console.warn(`No existe doc con doc.id='${id}', buscando por campo 'id' en documentos...`);

            // Tomo todos los docs 
            const allSnapshot = await getDocs(reservationsCollection);

            const found = allSnapshot.docs.find(d => {
                const data = d.data();
                return data?.id == id || data?.id == Number(id);
            });

            if (!found) {
                console.warn(`No se encontró documento con campo 'id' == ${id}`);
                return null;
            }

            reservationRef = doc(reservationsCollection, found.id);
            snapshot = await getDoc(reservationRef);
            console.log(`Encontrado doc con doc.id='${found.id}'`);
        }

        if (updateData.products && Array.isArray(updateData.products)) {
            updateData.products = updateData.products.map(product => ({
                productRef: doc(db, product.collection, product.id), // ✅ Referencia
                quantity: product.quantity,                          // ✅ Mantener
                unitPrice: product.unitPrice                         // ✅ Mantener
            }));
        }

        await updateDoc(reservationRef, updateData);

        const updatedSnapshot = await getDoc(reservationRef);
        const updatedData = { id: updatedSnapshot.id, ...updatedSnapshot.data() };

        console.log('Reserva actualizada:', updatedData);
        return updatedData;

    } catch (error) {
        console.error('Error al actualizar la reserva:', error);
        return null;
    }
}

export const deleteReservation = async (id) => {
    try {
        const reservationRef = doc(reservationsCollection, id);

        const snapshot = await getDoc(reservationRef);

        if (!snapshot.exists()) {
            return null;
        }

        await deleteDoc(reservationRef);
        return snapshot.data();
    } catch (error) {
        console.error('Error al eliminar la reserva:', error);
        return null;
    }
}