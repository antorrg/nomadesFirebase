import BaseFireAlias from "./mainFunctions/BaseFireAlias";
import main from '../api/main'

//* Info
//todo endpointXX = new BaseEndpoint(urlBase, admin = false)( cuando no es admin no añade el token de autorización)
// get(endpoint, params = {}, auxFunction = null,)
// Estas funciones pertenecen solo a las rutas publicas

const publicLanding = new BaseFireAlias(main.landing);
const publicProduct = new BaseFireAlias(main.product);
const publicItem = new BaseFireAlias(main.item); 
//const publicWork = new BaseFireAlias("/api/v1/work", false);

export const pbLanding = () => publicLanding.reqSimple('getLanding', );

export const sendEmails = (data, auxFunction, rejectFunction) =>
  publicLanding.post(
    "emails",
    data,
    auxFunction,
    rejectFunction,
    "Email enviado correctamente"
  );

export const pbProduct = () => publicProduct.reqSimple("getProduct", null, null);

export const pbProductId = (id) => publicProduct.reqWithId("getProductByid",`${id}`, null, null);

export const pbItem = (id) => publicItem.reqWithId("getItem", `${id}`, null,null)

export const pbMedia = () => publicMedia.get("", null, null);

export const pbWorks = () => publicWork.get("", null, null);
