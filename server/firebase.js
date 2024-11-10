import admin from 'firebase-admin';
import serviceAccount from "../proyectopreactSdk2.json" assert { type: "json" };
import env from "./envConfig.js"
const credential = env.firebaseConfig || serviceAccount;
// Inicializar Firebase solo una vez
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(credential),
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