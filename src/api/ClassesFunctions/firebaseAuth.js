import { auth, db } from "./firebaseConfig";
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword} from "firebase/auth";
import customError from "./customError";

const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Traemos los datos del usuario desde Firestore
    const userDoc = await getDoc(doc(db, 'users', uid));
    const userData = userDoc.exists() ? userDoc.data() : null;

    return {
      message: "Autenticacion exitosa",
      user: {
        uid,
        email: userCredential.user.email,
        ...userData,
      },
    };
  } catch (error) {
    if (error.code === "auth/wrong-password") {
      customError("Contraseña incorrecta", 401);
    } else if (error.code === "auth/user-not-found") {
      customError("Usuario no encontrado", 404);
    } else {
      customError(`Error al iniciar sesión: ${error.message}`, 400, true);
    }
  }
};


const createUser = async (email, password, additionalData = {}) => {
  try {
    const userCreated = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCreated.user.uid;

    // Guardamos en Firestore (colección 'users', documento con ID = uid)
    await setDoc(doc(db, 'users', uid), {
      email,
      ...additionalData,
      createdAt: new Date(),
    });

    return {
      message: "Usuario creado exitosamente",
      user: userCreated.user,
    };
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      customError("El correo ya está en uso", 409);
    } else {
      customError(`Error al crear usuario: ${error.message}`, 400, true);
    }
  }
}
export { login, createUser };
