import {collection, query, where, getDocs, getDoc, doc, addDoc, deleteDoc, limit, writeBatch} from 'firebase/firestore';
import { db } from "../firebase.js";
import  * as cloud from './storage.js';
import eh from "../utils/errorHandlers.js";

 // Colecciones
 const About = collection(db, "about");

export default {
    createAbout : async(newData)=>{
        try {
            const q = query(About, where('title', '==', newData.title))
            const titleQuery  = await getDocs(q)
            if(!titleQuery.empty){eh.throwError('Este titulo ya existe', 400)}
             // Crear un batch para manejar múltiples operaciones
            const batch = writeBatch(db)
             // Crear un batch para manejar múltiples operaciones
            const aboutRef = doc(About)
            const aboutData =  {
                    title: newData.title,
                    text: newData.text,
                    image: newData.image || ""
            };
            batch.set(aboutRef, aboutData)
            await batch.commit()
            return {id: aboutRef.id,
                ...aboutData
                  }
        } catch (error) {
        throw error;
        }
    },
    getAbout : async()=>{
        try {
            const q = query(About)
            const article = await getDocs(q)
            if(!article){eh.throwError('Error de servidor', 500)}
            if(article.empty){return [{id: 1, title: 'No hay titulo', text: 'No hay texto', image: ''}]}
            const aboutData = article.docs.map(doc=>({
                id: doc.id,
                ...doc.data()
            }))
            return aboutData;
        } catch (error) {
        throw error;
        }
    },
    aboutById: async(id)=>{
        try {
            const articleRef = doc(About, id)
            const articleDoc = await getDoc(articleRef)
            if(!articleDoc.exists()){eh.throwError('Articulo no hallado',404)}
            const article = {
                id:articleDoc.id,
                ...articleDoc.data()}
            return article;
        } catch (error) {
        throw error;
        }
    },
    updAbout : async(id, newData)=>{
        const options = help.optionBoolean(newData.saver)
        const useImgs = help.optionBoolean(newData.useImg)
        const enabledParsed = help.optionBoolean(newData.enable)
        let imageStore = "";
        try {
            const articleRef = doc(About, id);
            const articleDoc = await getDoc(articleRef)
            if(!articleDoc.exists()){eh.throwError('Articulo no hallado',404)}
            const oldImage = articleDoc.data().image
            if(oldImage !== newData.image){imageStore = oldImage}
            if(useImgs){await cloud.deleteImage(newData.image)}
            const newarticle = {
                title: newData.title,
                text: newData.text,
                image: newData.image,
                enable: enabledParsed
            }
            await updateDoc(articleRef, newarticle)

            const pictureOld = await cloud.oldImagesHandler(imageStore, options)

            if(pictureOld.success===false){eh.throwError('Error al procesar imagen antigua', 500)}
            return {
                id, 
                ...newarticle
            };
        } catch (error) {
        throw error;
        }
    },
    delAbout : async(id)=>{
        try {
            const articleRef = doc(About, id)
            const articleDoc = await getDoc(articleRef)
            if(!articleDoc.exists()){eh.throwError('Articulo no hallado',404)}
            const imageUrl = articleDoc.data().image;
            
            const batch = writeBatch(db);
            batch.delete(articleRef);
            await batch.commit()
            const pictureOld = await cloud.oldImagesHandler(imageUrl, false)
            if (pictureOld.success === false) {
                eh.throwError('Error al procesar imagen antigua', 500);
               }
             return 'Articulo borrado exitosamente';
        } catch (error) {
        throw error;
        }
    }
}