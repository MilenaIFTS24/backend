import { db } from "../config/data.js";
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";

const usersCollection = collection(db, "users");

export const getAllUsers = async () => {
    try {
        const snapshot = await getDocs(usersCollection);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        return [];
    }
}

export const getUserById = async (id) => {
    try {
        const userRef = doc(usersCollection, id);
        const snapshot = await getDoc(userRef);
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        return null;
    }
}

export const getUserByEmail = async (email) => {
    try {
        
        const snapshot = await getAllUsers();
        
        if (!snapshot || snapshot.empty || !snapshot.docs) {
            console.log('No se encontraron documentos en la colección "users"');
            return null;
        }
        const userDoc = snapshot.docs.find(doc => {
            const userData = doc.data();
            return userData.email === email; // Buscar por el campo email
        });

        return userDoc ? { id: userDoc.id, ...userDoc.data() } : null;
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        return null;
    }
}

export const createUser = async (data) => {
    try {
        if (!data || typeof data !== 'object') {
            throw new Error('Los datos del usuario no son válidos');
        }

        //Verifico si el email ya esta registrado
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
            password: data.password, // Ya hasheada
            accountEnabled: true, // Default true
            phone: data.phone || '',
            address: data.address || '',
            role: 'user',
            createdAt: new Date().toISOString(),
        };

        const docRef = await addDoc(usersCollection, userData);
        return { id: docRef.id, ...userData, password: undefined };
    } catch (error) {
        console.error('Error al crear el usuario en la base de datos:', error);
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
            
            const updateData = { ...data };
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

        return updatedData;

    } catch (error) {
        console.error('Error al actualizar el usuario en la base de datos:', error);
        throw new Error('Error al actualizar el usuario en la base de datos');
    }
}

export const deleteUser = async (id) => {
    try {
        const userRef = doc(usersCollection, id);
        const snapshot = await getDoc(userRef);

        if (!snapshot.exists()) {
            return { deleted: false, message: 'Usuario no encontrado' };
        }

        await deleteDoc(userRef);

        return { deleted: true, data: snapshot.data() };
    } catch (error) {
        console.error('Error al eliminar el usuario en la base de datos:', error);
        return null;
    }
}

