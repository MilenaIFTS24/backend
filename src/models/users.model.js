import { db } from "../config/data.js";
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";

const usersCollection = collection(db, "users");

export const getAllUsers = async () => {
    try {
        const snapshot = await getDocs(usersCollection);

        console.log('Capa Modelo ---> getAllUsers: enviado',);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Capa Modelo --> Error al obtener los usuarios:', error);
        return [];
    }
}

export const getUserById = async (id) => {
    try {
        const userRef = doc(usersCollection, id);
        const snapshot = await getDoc(userRef);

        console.log('Capa Modelo ---> getUserById: enviado',);
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
        console.error('Capa Modelo --> Error al obtener el usuario:', error);
        return null;
    }
}

export const getUserByEmail = async (email) => {
    try {
        console.log('🎯 [MODELO] Buscando usuario con email:', email);

        const users = await getAllUsers();

        if (!users || users.length === 0) {
            console.log('No hay usuarios en la colección');
            return null;
        }

        const user = users.find(user => user.email === email);

        if (!user) {
            console.log('No se encontró un usuario con el email proporcionado');
            return null;
        }

        console.log('Capa Modelo ---> getUserByEmail: enviado: ', user);
        return user || null;

    } catch (error) {
        console.error('Capa Modelo --> Error al obtener el usuario:', error);
        return null;
    }
}

export const createUser = async (data) => {
    try {
        if (!data || typeof data !== 'object') {
            throw new Error('Los datos del usuario no son válidos');
        }

        const existingUser = await getUserByEmail(data.email);
        if (existingUser) {
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

        console.log('Capa Modelo ---> createUser: enviado');
        return { id: docRef.id, ...userData, password: undefined };
    } catch (error) {
        console.error('Capa Modelo --> Error al crear el usuario en la base de datos:', error);
        throw new Error('Error al crear el usuario en la base de datos');
    }
}

export const updateUser = async (id, data) => {
    try {
        let userRef = doc(usersCollection, id);
        let snapshot = await getDoc(userRef);

        const updateData = { ...data };
        // Si se actualiza, encripto la nueva contraseña
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 12);
        }
        if (!snapshot.exists()) {
            console.warn(`No existe doc con doc.id='${id}', buscando por campo 'id' en documentos...`);

            const allSnapshot = await getDocs(usersCollection);
            const found = allSnapshot.docs.find(d => {
                const userData = d.data();
                return userData?.id == id || userData?.id == Number(id);
            });

            if (!found) {
                console.warn(`No se encontró documento con campo 'id' == ${id}`);
                return null;
            }


            if (data.password) {
                updateData.password = await bcrypt.hash(data.password, 12);
            }

            userRef = doc(usersCollection, found.id);
            snapshot = await getDoc(userRef);
            console.log(`Encontrado doc con doc.id='${found.id}'`);
        }

        await updateDoc(userRef, updateData);
        const updatedSnapshot = await getDoc(userRef);
        const updatedData = {
            id: updatedSnapshot.id,
            ...updatedSnapshot.data(),
            password: undefined // No devuelvo la contraseña por seguridad
        };

        console.log('Capa Modelo ---> updateUser: ', updatedData);
        return updatedData;

    } catch (error) {
        console.error('Capa Modelo --> Error al actualizar el usuario en la base de datos:', error);
        throw new Error('Error al actualizar el usuario en la base de datos');
    }
}

export const deleteUser = async (id) => {
    try {
        const userRef = doc(usersCollection, id);
        const snapshot = await getDoc(userRef);

        if (!snapshot.exists()) {
            console.warn(`No existe doc con doc.id='${id}'`);
            return { deleted: false, message: 'Usuario no encontrado' };
        }

        await deleteDoc(userRef);

        console.log('Capa Modelo ---> deleteUser: enviado');
        return {
            deleted: true, data: {
                id: snapshot.id,
                ...snapshot.data()
            }
        };
    } catch (error) {
        console.error('Capa Modelo --> Error al eliminar el usuario en la base de datos:', error);
        return {
            deleted: false,
            message: 'Error al eliminar el usuario',
            error: error.message
        };
    }
}

