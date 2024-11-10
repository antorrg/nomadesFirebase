import { db } from "../firebase.js";
import {oldImagesHandler} from "./storage.js"
import eh from "../utils/errorHandlers.js";
import bcrypt from "bcrypt";
import jwt from "../middlewares/validation/index.js";
import env from "../envConfig.js";
import help from "./helpers.js";


const User = db.collection("user");

export default {
  userCreate: async (email1, password1, role1) => {
    const finalPassword = password1 ? password1 : env.defaultPass;
    try {
      // Verificar si el usuario ya existe
      const userSnapshot = await User.where("email", "==", email1).get();
      if (!userSnapshot.empty) {
        eh.throwError("Este usuario ya existe", 400);
      }
      //preparacion de variables:
      const hashedPassword = await bcrypt.hash(finalPassword, 12);
      const nickname1 = email1.split("@")[0];

      const newUser = {
        email: email1,
        password: hashedPassword,
        nickname: nickname1,
        given_name: "",
        role: role1 || 1,
        picture: `${env.userImg}`,
        country:  ""
      };

      // Crear nuevo usuario en Firestore
      const docRef = await User.add(newUser);
      
      if (!docRef.id) {
        eh.throwError("Error inesperado en el servidor", 500);
      }

      // Obtener el usuario recién creado
      const createdUser = await docRef.get();
      
      return help.userParser({id: docRef.id, ...createdUser.data()}, true, true);
    } catch (error) {
      throw error;
    }
  },

  userLog: async (email1, password1) => {
    try {
      const userSnapshot = await User.where("email", "==", email1).limit(1).get();
      if (userSnapshot.empty) {
        eh.throwError("Este usuario no existe", 404);
      }
      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();
     
      if (userData.enable === false) {
        eh.throwError("Usuario bloqueado!", 403);
      }
      //verificacion de password:
      const passwordMatch = await bcrypt.compare(password1, userData.password);
      if (!passwordMatch) {
        eh.throwError("Contraseña no valida", 400);
      }
      //formacion del token y retorno del usuario.
      console.log(userDoc.id)
      const finalUser = {id: userDoc.id, ...userData}
      return {
        user: help.userParser(finalUser, true, true),
        token: jwt.generateToken(userData),
      };
    } catch (error) {
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const snapshot = await User.get();
      //return snapshot.docs
      if (snapshot.empty) {
        eh.throwError("No hay usuarios", 404);
      }
     const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return help.userParser(users, false, true)
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  },

  getUsersById : async (id) => {
    // Intento obtener los datos del caché
    //  let cachedUser = cache.get(`userById_${id}`);
    //  if (cachedUser) {
    //    return cachedUser;
    //  }
      try {
        const userDoc = await User.doc(id).get();
        if (!userDoc.exists) {
          eh.throwError("Usuario no encontrado", 404);
        }
        const user = {id: userDoc.id, ...userDoc.data()}
        return help.userParser(user, true, true);
      } catch (error) {
        console.error("Error al obtener usuario:", error);
        throw error;
      }
  },
  userUpd: async (id, newData) => {
    //let imageStore = "";
    try {
      const userRef = User.doc(id);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        eh.throwError("Usuario no encontrado", 404);
      }
      const oldData = userDoc.data()

      //console.log('Soy la imagen',oldData.picture)
      // if (newData.picture !== oldData.picture) {
      //  imageStore = oldData.picture
      // }
      const newNickname = newData.email.split("@")[0];
      const userUpdated = {
        email: newData.email,
        nickname: newNickname,
        given_name: newData.given_name,
        picture: newData.picture,
        country: newData.country,
      };
      await userRef.update(userUpdated);
      //const pictureOld = await oldImagesHandler(imageStore, newData.saver)
      //if(pictureOld.success===false){eh.throwError('Error al procesar imagen antigua', 500)}
      // Obtenemos y retornamos el usuario actualizado
      const updatedUserDoc = await userRef.get();
      const user = {
        id: updatedUserDoc.id,
        ...updatedUserDoc.data()
      };
      return help.userParser(user, true, true)
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
    }
  },
  verifyPass: async (id, password) => {
    try {
      const userDoc = await User.doc(id).get();
      if (!userDoc.exists) {eh.throwError("Usuario no encontrado", 404)}
      const user = userDoc.data();
      const edit = help.protectProtocol(user) // Proteger al superusuario contra edicion 
      if(edit){eh.throwError('No se puede cambiar la contraseña a este usuario. Accion no permitida', 403)}
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) { eh.throwError('Contraseña incorrecta!', 400)}
      return { message: "Contraseña verificada exitosamente" };
    } catch (error) { throw error; }
  },

  userChangePass: async (id, password) => {
    try {
      const userRef = User.doc(id);  // Referencia al documento
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        eh.throwError("Usuario no encontrado", 404);
      }
      const user = userDoc.data();
      const edit = help.protectProtocol(user); // Proteger al superusuario contra edicion
      if (edit) {
        eh.throwError(
          "No se puede cambiar la contraseña a este usuario. Accion no permitida",
          403
        );
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const newData = { password: hashedPassword };
      await userRef.update(newData);
      //if (newUser) {cache.del(`userById_${id}`)}
      return "Contraseña actualizada exitosamente";
    } catch (error) {
      throw error;
    }
  },
  userResetPass: async (id) => {
    console.log("soy el id:", id);
    const password = `${env.defaultPass}`;
    try {
      const userRef = User.doc(id);  // Referencia al documento
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        eh.throwError("Usuario no encontrado", 404);
      }
      const user = userDoc.data();
      const edit = help.protectProtocol(user); // Proteger al superusuario contra edicion
      if (edit) {
        eh.throwError(
          "No se puede cambiar la contraseña a este usuario. Accion no permitida",
          403
        );
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const newData = { password: hashedPassword };
      await userRef.update(newData);
        return "Contraseña reiniciada exitosamente";
    } catch (error) {
      throw error;
    }
  },
  userUpgrade: async (id, newData) => {
    try {
      const userRef = User.doc(id);  // Referencia al documento
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        eh.throwError("Usuario no encontrado", 404);
      }
      const user = userDoc.data();
      const edit = help.protectProtocol(user); // Proteger al superusuario contra edicion
      const newRole = help.revertScope(newData.role);
      const updInfo = {
        role: edit ? Number(user.role) : Number(newRole),
        enable: edit ? true : help.optionBoolean(newData.enable),
      };
      await userRef.update(updInfo);
      const newUser = {id: userDoc.id, ...user}
      
      return help.userParser(newUser, true, true);
    } catch (error) {
      throw error;
    }
  },

  userDel: async (id) => {
    try {
      const userRef = User.doc(id);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        eh.throwError("Usuario no encontrado", 404);
      }

      await userRef.delete();
      return { message: "Usuario eliminado exitosamente", id: id };
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      throw error;
    }
  },
};
