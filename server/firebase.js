import admin from 'firebase-admin';
//import serviceAccount from "../proyectopreactSdk2.json" assert { type: "json" };
import env from "./envConfig.js"

// Inicializar Firebase solo una vez
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(env.firebaseConfig),
    storageBucket: env.storageBucket,
  });
}

const db = admin.firestore()
const storage = admin.storage().bucket();

export {
  db,
  admin,
  storage
};
// import { initializeApp } from "firebase/app";
// import en from './envConfig.js'
// import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
// import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// const firebaseConfig = {
//     apiKey: en.fireApiK,
//     authDomain: en.fireDomain,
//     projectId: en.firePId,
//     storageBucket: en.fireStoreBuck,
//     messagingSenderId: en.fireMess,
//     appId: en.fireAppId,
// };

// // Inicializar Firebase
// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const storage = getStorage(app);


/* Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from "firebase/app";
import "firebase/firestore";
import { getStorage } from "firebase/storage"; //almacenamiento de imágenes
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: en.fireApiK,
  authDomain: en.fireDomain,
  projectId: en.firePId,
  storageBucket: en.fireStoreBuck,
  messagingSenderId: en.fireMess,
  appId: en.fireAppId,
  measurementId: en.fireMeasure
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);*/