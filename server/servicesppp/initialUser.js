//import {collection, query, getDocs} from 'firebase/firestore';
// import { db } from "../firebase.js";
// import env from "../envConfig.js";
// import serv from "./userServices.js";

// // Definir coleccion:
// const User = collection(db, "user")

// const initialUser = async () => {
//   const email = env.UserEmail;
//   const password = env.UserPass;
//   const role = 9;
//   try {
//     const users = await getDocs(query(User));
//     if (!users.empty) {
//       return console.log("The user already exists!");
//     }
//     const superUser = await serv.userCreate(email, password, role);
//     if (!superUser) {
//       const error = error;
//       error.status = 500;
//       throw error;
//     }
//     return console.log("The user was successfully created!!");
//   } catch (error) {
//     console.error("Algo ocurrió al inicio: ", error);
//   }
// };
// export default initialUser;

import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "../firebase.js";
import env from "../envConfig.js";
import serv from "./userServices.js";

// Definir colección:
const User = collection(db, "user");

const initialUser = async () => {
    const email = env.UserEmail;
    const password = env.UserPass;
    const role = 9;

    try {
        // Primero verificamos específicamente si existe un usuario con rol 9
        const q = query(User, where('role', '==', 9));
        const superUserQuery = await getDocs(q);

        if (!superUserQuery.empty) {
            console.log("Superusuario ya existe!");
            return;
        }

        // Si no existe, verificamos si el email ya está en uso
        const emailQuery = query(User, where('email', '==', email));
        const emailCheck = await getDocs(emailQuery);

        if (!emailCheck.empty) {
            console.log("El email ya está en uso!");
            return;
        }

        // Crear superusuario
        const superUser = await serv.userCreate(email, password, role);
        
        if (superUser) {
            console.log("Superusuario creado exitosamente!");
            return superUser;
        } else {
            throw new Error("No se pudo crear el superusuario");
        }

    } catch (error) {
        console.error("Error en la inicialización del superusuario:", error.message);
        throw error; // Re-lanzar el error para manejo superior si es necesario
    }
};

export default initialUser;