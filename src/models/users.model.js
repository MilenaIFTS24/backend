import { db } from "../config/data.js";
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { log, logError } from '../utils/logger.utils.js';

const usersCollection = collection(db, "users");

export const getAllUsers = async () => {
    try {
        const snapshot = await getDocs(usersCollection);

        log('Modelo', 'getAllUsers', 'Usuarios obtenidos exitosamente');
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        logError('Modelo', 'getAllUsers', error, 'Error al obtener los usuarios');
        return [];
    }
};

export const getUserById = async (id) => {
    try {
        const userRef = doc(usersCollection, id);
        const snapshot = await getDoc(userRef);

        log('Modelo', 'getUserById', 'Usuario obtenido exitosamente');
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
        logError('Modelo', 'getUserById', error, 'Error al obtener el usuario');
        return null;
    }
};

export const getUserByEmail = async (email) => {
    try {
        const users = await getAllUsers();

        if (!users || users.length === 0) {
            log('Modelo', 'getUserByEmail', 'No se encontraron usuarios en la coleccion');
            return null;
        }

        const user = users.find(user => user.email === email);

        if (!user) {
            log('Modelo', 'getUserByEmail', 'No se encontro un usuario con el email proporcionado');
            return null;
        }

        log('Modelo', 'getUserByEmail', 'Usuario obtenido exitosamente', user);
        return user || null;
    } catch (error) {
        logError('Modelo', 'getUserByEmail', error, 'Error al obtener el usuario');
        return null;
    }
};

export const createUser = async (data) => {
    try {
        if (!data || typeof data !== 'object') {
            log('Modelo', 'createUser', 'Los datos del usuario no son válidos');
            throw new Error('Los datos del usuario no son válidos');
        }

        const existingUser = await getUserByEmail(data.email);
        if (existingUser) {
            log('Modelo', 'createUser', 'El email ya esta registrado');
            throw new Error('El email ya está registrado');
        }

        // Uso bcrypt para encriptar la contraseña
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 12);
        }

        const userData = {
            fullName: data.fullName,
            dateOfBirth: data.dateOfBirth,
            email: data.email,
            password: data.password,
            accountEnabled: true,
            phone: data.phone || '',
            address: data.address || '',
            role: 'user',
            createdAt: new Date().toISOString(),
        };

        const docRef = await addDoc(usersCollection, userData);

        log('Modelo', 'createUser', 'Usuario creado exitosamente');
        return { id: docRef.id, ...userData, password: undefined };
    } catch (error) {
        logError('Modelo', 'createUser', error, 'Error al crear el usuario en la base de datos');
        throw new Error('Error al crear el usuario en la base de datos');
    }
};

export const updateUser = async (id, data) => {
    try {
        let userRef = doc(usersCollection, id);
        let snapshot = await getDoc(userRef);

        const updateData = { ...data };
        
        // Si se actualiza la contraseña, la encripto
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 12);
        }

        if (!snapshot.exists()) {
            log('Modelo', 'updateUser', `No existe doc con doc.id='${id}', buscando por campo 'id' en documentos...`);

            const allSnapshot = await getDocs(usersCollection);
            const found = allSnapshot.docs.find(d => {
                const userData = d.data();
                return userData?.id == id || userData?.id == Number(id);
            });

            if (!found) {
                log('Modelo', 'updateUser', `No se encontró documento con campo 'id' == ${id}`);
                return null;
            }
            if (data.password) {
                updateData.password = await bcrypt.hash(data.password, 12);
            }

            userRef = doc(usersCollection, found.id);
            snapshot = await getDoc(userRef);
            log('Modelo', 'updateUser', `Encontrado doc con doc.id='${found.id}'`);
        }

        await updateDoc(userRef, updateData);
        const updatedSnapshot = await getDoc(userRef);
        const updatedData = {
            id: updatedSnapshot.id,
            ...updatedSnapshot.data(),
            password: undefined // No devuelvo la contraseña por seguridad
        };

        log('Modelo', 'updateUser', 'Usuario actualizado exitosamente');
        return updatedData;
    } catch (error) {
        logError('Modelo', 'updateUser', error, 'Error al actualizar el usuario en la base de datos');
        throw new Error('Error al actualizar el usuario en la base de datos');
    }
};

export const deleteUser = async (id) => {
    try {
        const userRef = doc(usersCollection, id);
        const snapshot = await getDoc(userRef);

        if (!snapshot.exists()) {
            log('Modelo', 'deleteUser', `No existe doc con doc.id='${id}'`);
            return { deleted: false, message: 'Usuario no encontrado' };
        }

        await deleteDoc(userRef);

        log('Modelo', 'deleteUser', 'Usuario eliminado exitosamente');
        return {
            deleted: true, data: {
                id: snapshot.id,
                ...snapshot.data()
            }
        };
    } catch (error) {
        logError('Modelo', 'deleteUser', error, 'Error al eliminar el usuario');
        return {
            deleted: false,
            message: 'Error al eliminar el usuario',
            error: error.message
        };
    }
};

