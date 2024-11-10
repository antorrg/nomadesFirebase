import { db, storage } from"../firebase.js";
import * as fire from "./storage.js"
import eh from '../utils/errorHandlers.js'
import help from "./helpers.js";

//ejemplo de implementacion eh.throwError('mensaje', 404)

const Landing = db.collection("landing");

export default  {
    createLanding : async(title, image, info_header, description)=>{
        try {
            const page = await Landing.where("title", "==", title).get();
            if(page){eh.throwError('Este titulo ya existe', 400)}
            const newPage = {
                title,
                image,
                info_header,
                description,
                enable : false,
            }
            //Crear nueva page:
            const docRef = await Landing.add(newPage)
            if (!docRef.id){eh.throwError('Error inesperado en el servidor', 500)}
            const createdPage = await docRef.get();
            return {id:docRef.id, ...createdPage.data()}
        } catch (error) {
            throw error;
        }
    },
    getLandings : async()=>{
        try {
            const pageFound = await Landing.get()
            if(pageFound.empty){return help.dataEmptyLanding()}
            const pages = pageFound.docs.map(doc =>({id:doc.id, ...doc.data()}))
            return help.cleanerLanding(pages, false)
        } catch (error) {
            throw error;
        }
    },
    getOneLanding : async()=>{
        try {
            const pageFound = await Landing.get()
             if(pageFound.empty){return help.dataEmptyLanding()}
                    
            return help.cleanerLanding(pageFound, true)
        } catch (error) {
            throw error;
        }
    },
    getLandById : async(id)=>{
        try {
            const page = await Landing.findByPk(id)
            if(!page){eh.throwError('Elemento no encontrado', 404)}
            return page
        } catch (error) {
            throw error;
        }
    },
    updLanding : async(id, newData)=>{
        try {
            const page = await Landing.findByPk(id)
            if(!page){eh.throwError('No hallado', 404)}
            const newPage = await page.update(newData)
            return newPage;
        } catch (error) {
            throw error;
        }
    },
    delLanding : async(id)=>{
        try {
            const page = await Landing.findByPk(id)
            if(!page){eh.throwError('No hallado', 404)}
            await page.destroy(page)
            return 'Portada borrada exitosamente';
        } catch (error) {
            throw error;
        }
    },
};

