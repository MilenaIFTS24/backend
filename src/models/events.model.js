import { db } from "../config/data.js";
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { log, logError } from '../utils/logger.utils.js';

const eventsCollection = collection(db, "events");

export const getAllEvents = async () => {
    try {
        const snapshot = await getDocs(eventsCollection);
        
        log('Modelo', 'getAllEvents', 'Eventos obtenidos exitosamente');
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        logError('Modelo', 'getAllEvents', error, 'Error al obtener los eventos');
        return [];
    }
};

export const getEventById = async (id) => {
    try {
        const eventRef = doc(eventsCollection, id);
        
        const snapshot = await getDoc(eventRef);
        
        log('Modelo', 'getEventById', 'Evento obtenido exitosamente');
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
        logError('Modelo', 'getEventById', error, 'Error al obtener el evento');
        return null;
    }
};

export const createEvent = async (data) => {
    try {
        if (!data || typeof data !== 'object') {
            log('Modelo', 'createEvent', 'Los datos del evento no son válidos'); 
            throw new Error('Los datos de la oferta no son válidos');
        }
         const docRef = await addDoc(eventsCollection, data);
         log('Modelo', 'createEvent', 'Evento creado exitosamente');
         return { id: docRef.id, ...data };
    } catch (error) {
        logError('Modelo', 'createEvent', error, 'Error al crear el evento en la base de datos');
        throw new error('Error al crear el evento en la base de datos');
    }
};

export const updateEvent = async (id, data) => {
    try {
        let eventRef = doc(eventsCollection, id);
        let snapshot = await getDoc(eventRef);

        if (!snapshot.exists) {
            log('Modelo', 'updateEvent', `No existe doc con doc.id='${id}', buscando por campo 'id' en documentos...`);
        
            const allSnapshot = await getDocs(eventsCollection);
            const found = allSnapshot.docs.find(d => {
                const data = d.data();
                return data?.id == id || data?.id == Number(id);
            });
        
            if (!found) {
                log('Modelo', 'updateEvent', `No se encontró documento con campo 'id' == ${id}`);
                return null;
            }
        
            eventRef = doc(eventsCollection, found.id);
            snapshot = await getDoc(eventRef);
            log('Modelo', 'updateEvent', `Encontrado doc con doc.id='${found.id}'`);       
        }

        await updateDoc(eventRef, data);
        const updatedSnapshot = await getDoc(eventRef);
        const updatedData = { id: updatedSnapshot.id, ...updatedSnapshot.data() };
        
        log('Modelo', 'updateEvent', 'Evento actualizado exitosamente');
        return updatedData;
    } catch (error) {
        logError('Modelo', 'updateEvent', error, 'Error al actualizar el evento en la base de datos');
        return null;
    }
};

export const deleteEvent = async (id) => {
    try {
        const eventRef = doc(eventsCollection, id);
        const snapshot = await getDoc(eventRef);

        if (!snapshot.exists) {
            log('Modelo', 'deleteEvent', `No existe doc con doc.id='${id}'`);
            return { deleted: false, message: 'Evento no encontrado' };
        }

        await deleteDoc(eventRef);
        log('Modelo', 'deleteEvent', 'Evento eliminado exitosamente');
        return snapshot.data();
    } catch (error) {
        logError('Modelo', 'deleteEvent', error, 'Error al eliminar el evento');
        return null;
    }
};