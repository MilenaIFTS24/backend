const admin = require('firebase-admin');
const fs = require('fs');

// 1. Inicializa la app con tus credenciales de servicio
// Asegúrate de que este nombre coincida con el archivo JSON que renombraste.
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Función que lee una colección y la guarda en un JSON
async function exportCollection(collectionName) {
  console.log(`Exportando colección: ${collectionName}...`);
  const snapshot = await db.collection(collectionName).get();
  const data = {};
  
  snapshot.forEach(doc => {
    data[doc.id] = doc.data();
  });

  fs.writeFileSync(`./${collectionName}_backup.json`, JSON.stringify(data, null, 2));
  console.log(`✅ ${collectionName} exportada con éxito a ./${collectionName}_backup.json`);
}

// 2. Llama a la función para CADA colección de tu esquema
// Usamos .then() para garantizar que las exportaciones se ejecuten en orden.
exportCollection('users')
  .then(() => exportCollection('teasProducts')) // <-- Colección faltante 1
  .then(() => exportCollection('craftsProducts')) // <-- Colección faltante 2
  .then(() => exportCollection('events')) // <-- Colección faltante 3
  .then(() => exportCollection('offers')) // <-- Colección faltante 4
  .then(() => exportCollection('reservations'))
  .then(() => console.log('\n🌟 Backup completo de Firestore finalizado.'))
  .catch(error => {
    console.error('❌ Error durante el proceso de backup:', error);
  });