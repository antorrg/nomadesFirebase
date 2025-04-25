import FirestoreRepository from "../ClassesFunctions/FirestoreRepository";
import InfoClean from '../ClassesFunctions/infoClean'

// Instanciamos el repositorio=
const landing = new FirestoreRepository('landing')
const product = new FirestoreRepository('product')
const item = new FirestoreRepository('item')

  export const getLanding=  async()=>{
        let data;
        const response = await landing.getAll()
        if(!response) data = InfoClean.dataEmptyLanding()
         data = InfoClean.cleanerLanding(response[0])
       return data
    }
    export const getProduct= async()=>{
        const response = await product.getAlguno()
        if(!response) return InfoClean.dataEmptyPage()
        return response.map(mp => InfoClean.cleaner(mp))
        
    }
    export const getProductByid = async (id) => {
        const response = await product.getById(id);
        if (!response) return InfoClean.dataEmptyPage();
      
        // ✅ Resolver todas las promesas de los itemRefs
        const Items = await Promise.all(response.itemRefs.map(it => item.getById(it)));
      
        const finalRes = { ...response, Items };
        return  InfoClean.cleaner(finalRes, true);
      }
      export const getItem= async (id)=>{
        const response = await item.getById(id)
        return InfoClean.aux(response, true)
      }


