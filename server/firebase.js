import admin from 'firebase-admin';
import serviceAccount from "../proyectopreactSdk2.json" assert { type: "json" };
//import env from "./envConfig.js"

// Inicializar Firebase solo una vez
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "proyectopreact.appspot.com",
  });
}

const db = admin.firestore()
const storage = admin.storage().bucket();

export {
  db,
  admin,
  storage
};