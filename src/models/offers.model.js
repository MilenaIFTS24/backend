import { db } from "../config/data.js";
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

const offersCollection = collection(db, "offers");

export const getAllOffers = async () => {
    try {
        const snapshot = await getDocs(offersCollection);

        console.log('Capa Modelo ---> getAllOffers: ', snapshot.data());
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Capa Modelo --> Error al obtener las ofertas:', error);
        return [];
    }
}

export const getOfferById = async (id) => {
    try {
        const offerRef = doc(offersCollection, id);

        const snapshot = await getDoc(offerRef);

        console.log('Capa Modelo ---> getOfferById: ', snapshot.data());
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
        console.error('Capa Modelo --> Error al obtener la oferta:', error);
        return null;
    }
}

export const createOffer = async (data) => {
    try {

        if (!data || typeof data !== 'object') { // Si no existe data o no es un objeto
            throw new Error('Los datos de la oferta no son válidos');
        }
        if (data.applicableTo && Array.isArray(data.applicableTo)) {
            data.applicableTo = data.applicableTo.map(product =>
                doc(db, product.collection, product.id) // ✅ SOLO el modelo crea referencias
            );
        }

        const docRef = await addDoc(offersCollection, data);

        console.log('Capa Modelo ---> createOffer: ', docRef.data());
        return { id: docRef.id, ...data };

    } catch (error) {
        console.error('Capa Modelo --> Error al crear la oferta en la base de datos:', error);
        throw new Error('Error al crear la oferta en la base de datos');
    }
}

export const updateOffer = async (id, updateData) => {
    try {
        let offerRef = doc(offersCollection, id);
        let snapshot = await getDoc(offerRef);

        if (!snapshot.exists()) {
            console.warn(`No existe doc con doc.id='${id}', buscando por campo 'id' en documentos...`);

            // Tomo todos los docs 
            const allSnapshot = await getDocs(offersCollection);

            const found = allSnapshot.docs.find(d => {
                const data = d.data();
                return data?.id == id || data?.id == Number(id);
            });

            if (!found) {
                console.warn(`No se encontró documento con campo 'id' == ${id}`);
                return null;
            }

            offerRef = doc(offersCollection, found.id);
            snapshot = await getDoc(offerRef);
            console.log(`Encontrado doc con doc.id='${found.id}'`);
        }

        if (updateData.applicableTo && Array.isArray(updateData.applicableTo)) {
            updateData.applicableTo = updateData.applicableTo.map(product =>
                doc(db, product.collection, product.id) // ✅ SOLO el modelo crea referencias
            );
        }
        await updateDoc(offerRef, updateData);

        const updatedSnapshot = await getDoc(offerRef);
        const updatedData = { id: updatedSnapshot.id, ...updatedSnapshot.data() };

        console.log('Capa Modelo ---> updateOffer: ', updatedData);
        return updatedData;


    } catch (error) {
        console.error('Capa Modelo --> Error al actualizar la oferta:', error);
        return null;
    }
}

export const deleteOffer = async (id) => {
    try {
        const offerRef = doc(offersCollection, id);

        const snapshot = await getDoc(offerRef);

        if (!snapshot.exists()) {
            console.warn(`No existe doc con doc.id='${id}'`);
            return { deleted: false, message: 'Oferta no encontrada' };
        }

        await deleteDoc(offerRef);
        console.log('Capa Modelo ---> deleteOffer: ', snapshot.data());
        return snapshot.data();
    } catch (error) {
        console.error('Capa Modelo --> Error al eliminar la oferta:', error);
        return null;
    }
}