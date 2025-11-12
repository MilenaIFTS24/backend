import { db } from "../config/data.js";
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

const eventsCollection = collection(db, "events");

export const getAllEvents = async () => {
    try {
        const snapshot = await getDocs(eventsCollection);
        
        console.log('Capa Modelo ---> getAllEvents: ', snapshot.data());
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Capa Modelo --> Error al obtener los eventos:', error);
        return [];
    }
};

export const getEventById = async (id) => {
    try {
        const eventRef = doc(eventsCollection, id);
        
        const snapshot = await getDoc(eventRef);
        
        console.log('Capa Modelo ---> getEventById: ', snapshot.data());
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
        console.error('Capa Modelo --> Error al obtener el evento:', error);
        return null;
    }
};

export const createEvent = async (data) => {
    try {
        if (!data || typeof data !== 'object') { // Si no existe data o no es un objeto
            throw new Error('Los datos de la oferta no son válidos');
        }
         const docRef = await addDoc(eventsCollection, data);
         console.log('Capa Modelo ---> createEvent: ', docRef.data());
         return { id: docRef.id, ...data };
    } catch (error) {
        console.error('Capa Modelo --> Error al crear el evento en la base de datos:', error);
        throw new error('Error al crear el evento en la base de datos');
    }
};

export const updateEvent = async (id, data) => {
    try {
        let eventRef = doc(eventsCollection, id);
        let snapshot = await getDoc(eventRef);

        if (!snapshot.exists) {
            console.warn(`No existe doc con doc.id='${id}', buscando por campo 'id' en documentos...`);
        
            const allSnapshot = await getDocs(eventsCollection);
            const found = allSnapshot.docs.find(d => {
                const data = d.data();
                return data?.id == id || data?.id == Number(id);
            });
        
            if (!found) {
                console.warn(`No se encontró documento con campo 'id' == ${id}`);
                return null;
            }
        
            eventRef = doc(eventsCollection, found.id);
            snapshot = await getDoc(eventRef);
            console.log(`Encontrado doc con doc.id='${found.id}'`);        
        }

        await updateDoc(eventRef, data);
        const updatedSnapshot = await getDoc(eventRef);
        const updatedData = { id: updatedSnapshot.id, ...updatedSnapshot.data() };
        
        console.log('Capa Modelo ---> updateEvent: ', updatedData)
        return updatedData;
    } catch (error) {
        console.error('Capa Modelo --> Error al actualizar el evento en la base de datos:', error);
        return null;
    }
};

export const deleteEvent = async (id) => {
    try {
        const eventRef = doc(eventsCollection, id);
        const snapshot = await getDoc(eventRef);

        if (!snapshot.exists) {
            console.warn(`No existe doc con doc.id='${id}'`);
            return { deleted: false, message: 'Evento no encontrado' };
        }

        await deleteDoc(eventRef);
        console.log('Capa Modelo ---> deleteEvent: ', snapshot.data());
        return snapshot.data();
    } catch (error) {
        console.error('Capa Modelo --> Error al eliminar el evento de la base de datos:', error);
        return null;
    }
};