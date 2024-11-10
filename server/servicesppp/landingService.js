import {collection, query, where, getDocs, getDoc, doc, addDoc, deleteDoc, limit, writeBatch} from 'firebase/firestore';
import { db } from "../firebase.js";
import { oldImagesHandler } from './storage.js';
import eh from "../utils/errorHandlers.js";
import help from './helpers.js'

//ejemplo de implementacion eh.throwError('mensaje', 404)

//Coleccion:
const Landing = collection(db, "landing");
export default {
    createLanding : async(title, image, info_header, description, enable = true)=>{
        try {
            const q = query(Landing, where('title', '==', title))
            const titleQuery = await getDocs(q);
            if(!titleQuery.empty){eh.throwError('Este titulo ya existe', 400)}
            //Crear un batch:
            const batch = writeBatch(db)
            //Preparar el documento: 
            const landingRef  = doc(Landing);
            const landingData = {
                title,
                image,
                info_header,
                description,
                enable
            }
            //Crear nuevo documento:
            batch.set(landingRef, landingData);
            await batch.commit()
            return {
                id: landingRef.id,
                ...landingData
            }
        } catch (error) {
            throw error;
        }
    },
    getLandings : async()=>{
        try {
            
            const landingSnapshot = await getDocs(query(Landing));
            if(landingSnapshot.empty){return help.dataEmptyLanding()}
            const landingData = landingSnapshot.docs.map(doc =>({
                id: doc.id,
                ...doc.data()
            }))
            return help.cleanerLanding(landingData, false)
        } catch (error) {
            throw error;
        }
    },
    getLandById : async(id)=>{
        try {
            const landingRef = doc(Landing, id);
            const landingDoc = await getDoc(landingRef)
             if(!landingDoc.exists() ){return help.dataEmptyLanding()}
            const landingPage = {
                id: landingDoc.id,
                ...landingDoc.data()
            }
            return help.cleanerLanding(landingPage, true)
        } catch (error) {
            throw error;
        }
    },
    getOneLanding : async()=>{
        try {
            const q = query(Landing, where('enable', '==', true), limit(1))
            const landingDoc = await getDoc(q)
            if(landingDoc.empty){return help.dataEmptyLanding()}
           const landingPage = {
               id: landingDoc.id,
               ...landingDoc.data()
           }
           return help.cleanerLanding(landingPage, true)
        } catch (error) {
            throw error;
        }
    },
    updLanding : async(id, newData)=>{
        const options = help.optionBoolean(newData.saver)
        const parsedEnable = help.optionBoolean(newData.enable)
        let imageStore = "";
        try {
            const landingRef = doc(Landing, id)
            const landingDoc = await getDoc(landingRef)
            if(!landingDoc.exists()){eh.throwError('No hallado', 404)}
            const oldImage = landingDoc.data().image
            if(oldImage !== newData.image){
                imageStore = oldImage;
            }
            const parsedData = {
                title: newData.title,
                image: newData.image,
                info_header : newData.info_header,
                description : newData.description,
                enable : parsedEnable,
            }
            await updateDoc(landingRef, parsedData)

            const pictureOld = await oldImagesHandler(imageStore, options)
             if(pictureOld.success===false){eh.throwError('Error al procesar imagen antigua', 500)}
             return {
                id, 
                ...parsedData,
             }
           
        } catch (error) {
            throw error;
        }
    },
    delLanding : async(id)=>{
        try {
            const landingRef = doc(Landing, id)
            const landingDoc = await getDoc(landingRef)
            if(!landingDoc.exists()){eh.throwError('No hallado', 404)}
            //Guardar imagen para borrar del storage:
            const imageUrl = landingDoc.data().image
            const batch = writeBatch(db)
            batch.delete(landingRef)
            await batch.commit()
             // Eliminar la imagen antigua del storage:
                const pictureOld = await oldImagesHandler(imageUrl , false);
                if (pictureOld.success === false) {
                eh.throwError('Error al procesar imagen antigua', 500);
                }
            return 'Portada borrada exitosamente';
        } catch (error) {
            throw error;
        }
    },
};

