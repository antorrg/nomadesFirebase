import {collection, query, where, getDocs, getDoc, doc, writeBatch} from 'firebase/firestore';
import { db } from "../firebase.js";
import { oldImagesHandler } from "./storage.js";
import bcrypt from "bcrypt";
import jwt from '../middlewares/validation/index.js'
import env from "../envConfig.js";
import help from "./helpers.js";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 3600 }); // TTL (Time To Live) de una hora
// Definir coleccion:
const User = collection(db, "user")

export default {
  userCreate: async (email1, password1, role1) => {
    const finalPassword = password1? password1 : env.defaultPass
    try {
      const q = query(User, where('email', '==', email1))
      const emailUser = await getDocs(q)
      if (!emailUser.empty) {eh.throwError('Este usuario ya existe', 400)}
      //preparacion de variables:
      const hashedPassword = await bcrypt.hash(finalPassword, 12);
      const nickname1 = email1.split("@")[0];
      // Crear un batch:
      const batch = writeBatch(db);
      //Preparar el documento:
      const userRef = doc(User)
      const newUser = {
        email: email1,
        password:  hashedPassword,
        nickname: nickname1,
        given_name: "",
        role: role1 || 1,
        picture: `${env.userImg}`,
        country: "",
        enable: true
      };

      batch.set(userRef, newUser)
      await batch.commit()
      const userData = {
        id: userRef.id,
        ...newUser
      }
      return help.userParser(userData, true, true);
    } catch (error) {throw error;}
  },

  userLog: async (email1, password1) => {
    try {
      const q = query(User, where('email', '==', email1))
      const emailUser = await getDocs(q)
      if (emailUser.empty) {eh.throwError('Usuario no hallado', 404)}

      if(emailUser.data().enable===false){eh.throwError('Usuario bloqueado!', 403)}
      //verificacion de password:
      const userPass = emailUser.data().password;
      const passwordMatch = await bcrypt.compare(password1, userPass);
      if (!passwordMatch) {eh.throwError('Contraseña no valida', 400)}
      //formacion del token y retorno del usuario.
      const user = {
        id: emailUser.id,
        ...emailUser
      }
      return {user: help.userParser(user, true, true),
              token: jwt.generateToken(user)
             }
    } catch (error) {throw error;}
  },

  getAllUsers: async () => {
    try {
      const userFound = await getDocs(query(User));
      if (!userFound) {eh.throwError('Error inesperado. Usuario no hallado', 500)}
      if (userFound.empty) {return help.emptyUser()}
      const user = userFound.docs.map(doc =>({
        id: doc.id,
        ...doc.data()
      }))
      return help.userParser(user, false, true);
    } catch (error) { throw error;}
  },

  getUsersById: async (id) => {
    
    try {
      const userRef = doc(User, id)
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {eh.throwError('Usuario no hallado', 404)}
      const userDetail =  {
        id: userDoc.id,
        ...userDoc.data()
      }
      return help.userParser(userDetail, true, true);
    } catch (error) {
      throw error;
    }
  },

  userUpd: async (id, newData) => {
    let imageStore = "";
    const options = help.optionBoolean(newData.saver)
    try {
      const userRef = doc(User, id)
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {eh.throwError('Usuario no hallado', 404)}
      const user = userDoc.data()
      const edit = help.protectProtocol(user) // Proteger al superusuario contra edicion
      const nickname1 =  newData.email.split("@")[0];
      //Verifica si se esta actualizando la imagen
      if (newData.picture !== user.picture) {
              imageStore = user.picture}
      const updInfo = {
        email: edit? user.email : newData.email,
        nickname: edit? user.nickname : nickname1,
        given_name: newData.given_name,
        picture: newData.picture,
        country: newData.country,
      };
      const batch = writeBatch(db)
      batch.update(userRef, updInfo)
      await batch.commit()
      
      //Procesar la imagen antigua: 
      const pictureOld = await oldImagesHandler(imageStore, options)
      if(pictureOld.success===false){eh.throwError('Error al procesar imagen antigua', 500)}
      
     
      return help.userParser({id, ...updInfo}, true, true);
    } catch (error) { throw error; }
  },

  verifyPass: async (id, password) => {
    try {
      const userRef = doc(User, id)
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {eh.throwError('Usuario no hallado', 404)}
      const user = userDoc.data()
      const edit = help.protectProtocol(user) // Proteger al superusuario contra edicion
      if(edit){eh.throwError('No se puede cambiar la contraseña a este usuario. Accion no permitida', 403)}
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) { eh.throwError('Contraseña incorrecta!', 400)}
      return { message: "Contraseña verificada exitosamente" };
    } catch (error) { throw error; }
  },

  userChangePass: async (id, password) => {
    try {
      const userRef = doc(User, id)
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {eh.throwError('Usuario no hallado', 404)}
      const user = userDoc.data()

      const edit = help.protectProtocol(user) // Proteger al superusuario contra edicion
      if(edit){eh.throwError('No se puede cambiar la contraseña a este usuario. Accion no permitida', 403)}
      const hashedPassword = await bcrypt.hash(password, 12);
      const newData = { password: hashedPassword };
      await updateDoc(userRef, newData)
      
      return "Contraseña actualizada exitosamente";
    } catch (error) { throw error; }
  },
  userResetPass: async (id) => {
    console.log('soy el id:', id)
    const password = `${env.defaultPass}`
    try {
      const userRef = doc(User, id)
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {eh.throwError('Usuario no hallado', 404)}
      const user = userDoc.data()
      const edit = help.protectProtocol(user) // Proteger al superusuario contra edicion
      if(edit){eh.throwError('No se puede cambiar la contraseña a este usuario. Accion no permitida', 403)}
      const hashedPassword = await bcrypt.hash(password, 12);
      const newData = { password: hashedPassword };
      
      await updateDoc(userRef, newData);

      return "Contraseña reiniciada exitosamente";
    } catch (error) { throw error; }
  },
  userUpgrade: async (id, newData) => {
    try {
      const userRef = doc(User, id)
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {eh.throwError('Usuario no hallado', 404)}
      const user = userDoc.data()

      const edit = help.protectProtocol(user) // Proteger al superusuario contra edicion
      const newRole = help.revertScope(newData.role)

      const updInfo = {
        role: edit? Number(user.role) : Number(newRole),
        enable: edit? true : help.optionBoolean(newData.enable),
      };
      await updateDoc(userRef, updInfo)

      return 'Usuario actualizado correctamente'
    } catch (error) { throw error; }
  },

  userDel: async (id) => {
    try {
      const userRef = doc(User, id)
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {eh.throwError('Usuario no hallado', 404)}
      const user = userDoc.data()
      const imageUrl = user.picture;

      const edit = help.protectProtocol(user) // Proteger al superusuario contra edicion
      if(edit){eh.throwError('No se puede eliminar a este usuario', 403)}
      const batch = writeBatch(db)
      batch.delete(userRef)
      await batch.commit()
      
      await oldImagesHandler(imageUrl, false)
     
      return "Usuario borrado exitosamente" ;
    } catch (error) { throw error;}
  },
};
