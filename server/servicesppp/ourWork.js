import {collection, query, where, getDocs, getDoc, doc, addDoc, deleteDoc, limit, writeBatch} from 'firebase/firestore';
import { db } from "../firebase.js";
import { oldImagesHandler,  } from './storage.js';
import eh from "../utils/errorHandlers.js";
import help from './helpers.js'

 // Colecciones
 const Work = collection(db, "work");

export default {
    createWork : async(newData)=>{
        try {
            const q = query(Work, where('title', '==', newData.title))
            const work = await getDocs(q)
            if(!work.empty){eh.throwError('Este titulo ya existe', 400)}
            //Inicializar un batch:
            const batch = writeBatch(db)
            const workRef = doc(Work)
            const newWorkData =  {
                    title: newData.title,
                    text: newData.text,
                    image: newData.image,
                    enable: true,
                    craatedAt: new Date()
            };

            batch.set(workRef, newWorkData)
            await batch.commit()
            return help.parserWork({
                id: workRef.id,
                ...newWorkData
            }, true)
        } catch (error) {
        throw error;
        }
    },
    getWork : async()=>{
        try {
            const workSnapshot = await getDocs(query(Work))
            if(workSnapshot.empty){return [{id: 1, title: 'No hay titulo', text: 'No hay texto', image: ''}]}
            const work = workSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }))
            return help.parserWork(work, false)
        } catch (error) {
        throw error;
        }
    },
    workById: async(id)=>{
        try {
            const workRef = doc(Work, id)
            const workDoc = await getDoc(workRef)
            if(!workDoc.exists()){eh.throwError('Articulo no hallado',404)}
            
            return help.parserWork({
                id: workDoc.id,
                ...workDoc.data()
            }, false)
        } catch (error) {
        throw error;
        }
    },
    updWork : async(id, newData)=>{
        const options = help.optionBoolean(newData.saver)
        const useImgs = help.optionBoolean(newData.useImg)
        const enabledParsed = help.optionBoolean(newData.enable)
        let imageStore = "";
        try {
            const workRef = doc(Work, id)
            const workDoc = await getDoc(workRef)
            if(!workDoc.exists()){eh.throwError('Articulo no hallado',404)}
            const work = workDoc.data()

            if(work.image !== newData.image){imageStore = work.image}
            if(useImgs){await cloud.deleteImage(newData.image)}

            const newWork = {
                title: newData.title,
                text: newData.text,
                image: newData.image,
                enable: enabledParsed
            }
            await updateDoc(workRef, newWork)
            const pictureOld = await cloud.oldImagesHandler(imageStore, options)
            if(pictureOld.success===false){eh.throwError('Error al procesar imagen antigua', 500)}
            return 'Actualizacion exitosa'
        } catch (error) {
        throw error;
        }
    },
    delWork : async(id)=>{
        try {
            const workRef = doc(Work, id)
            const workDoc = await getDoc(workRef)
            if(!workDoc.exists()){eh.throwError('Articulo no hallado',404)}
            const work = workDoc.data()

            const imageUrl = work.image;
            
            const batch = writeBatch(db)
            batch.delete(workRef)
            await batch.commit(),

           await oldImagesHandler(imageUrl, false);
            
             return  'Item borrado exitosamente';
        } catch (error) {
        throw error;
        }
    }
}