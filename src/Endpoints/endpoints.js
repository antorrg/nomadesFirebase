import BaseFireEndpoints from "./mainFunctions/BaseFireAlias";

//* Info
//todo endpointXX = new BaseEndpoint(urlBase, admin = false)( cuando no es admin no añade el token de autorización)
// get(endpoint, params = {}, auxFunction = null, )
//post(endpoint, data = {}, auxFunction = null, a rejectfunction, message)
//put(endpoint, data = {}, auxFunction = null,  rejectfunction, message)
//delete(endpoint, auxFunction = null,  rejectfunction, message)

//(endpoint, data = {}, auxFunction = null,  rejectFunction = null, message= 'Operación exitosa'

const userLogin = new BaseFireEndpoints("/api/v1/user", false);

export const loginUser = (data, aux, auxReject) =>
  userLogin.post(
    "login",
    data,
    aux,
    auxReject,
    "¡Verificación exitosa. Bienvenido!"
  );

export const userValid = new BaseFireEndpoints("/api/v1/user", true);
//* Para las tareas de edición usar esta instancia.

//todo  Endpoints Landing:

const landingAdmin = new BaseFireEndpoints("/api/v1/land", true);

export const landingCreate = (data, aux, auxReject) =>
  landingAdmin.post(
    "create",
    data,
    aux,
    auxReject,
    "Portada creada exitosamente"
  );

export const landingGet = () => landingAdmin.get("", null, null);

export const landingGetById = (id) => landingAdmin.get(`${id}`, null, null);

export const landingUpdate = (id, data, aux, auxReject) =>
  landingAdmin.put(
    `${id}`,
    data,
    aux,
    true,
    auxReject,
    "Portada actualizada exitosamente"
  );

export const landingDelete = (id, aux, auxReject) =>
  landingAdmin.delete(`/${id}`, aux, true, auxReject);

//todo Endpoints Product:

const productAdmin = new BaseFireEndpoints("/api/v1/product", true);

export const productGet = () => productAdmin.get("", null, null);

export const productGetById = (id) => productAdmin.get(`${id}`, null, null);

export const createProduct = (data, aux, auxReject) =>
  productAdmin.post(
    "create",
    data,
    aux,
    auxReject,
    "Product create successfully"
  );

export const updateProduct = (id, data, aux, auxReject) =>
  productAdmin.put(`${id}`, data, aux, auxReject);

export const deleteProduct = (id, aux, auxReject) =>
  productAdmin.delete(`${id}`, aux, auxReject);

//todo Endpoints Item

const itemAdmin = new BaseFireEndpoints("/api/v1/product/item", true);

export const createItem = (data, aux, auxReject) =>
  itemAdmin.post("create", data, aux, auxReject, "Item creado exitosamente");

export const getItemById = (id) => itemAdmin.get(`${id}`, null, null);

export const updateItem = (id, data, aux, auxReject) =>
  itemAdmin.put(`${id}`, data, aux, auxReject, "Item actualizado exitosamente");

export const deleteItem = (id, aux, auxReject) =>
  itemAdmin.delete(`${id}`, aux, auxReject);

//todo Endpoints User:

export const userGet = () => userValid.get("", null, null);

export const userGetbyid = (id, auxReject) =>
  userValid.get(`${id}`, null, null, auxReject);

export const userVerify = (data, aux, auxReject) =>
  userValid.post("verify", data, aux, auxReject);

export const userChangePass = (id, data, aux, auxReject) =>
  userValid.put(`update/${id}`, data, aux, auxReject);

export const userProfile = (id, data, aux, auxReject) =>
  userValid.put(`profile/${id}`, data, aux, auxReject);

export const userUpgrade = (id, data, aux, auxReject) =>
  userValid.put(`upgrade/${id}`, data, aux, auxReject);

export const userResetPass = (id, data, aux, auxReject) =>
  userValid.put(`reset/${id}`, data, aux, auxReject);

export const userCreate = (data, aux, auxReject) =>
  userValid.post("create", data, aux, auxReject);

export const userDelete = (id, aux, auxReject) =>
  userValid.delete(`${id}`, aux, auxReject);

//todo Endpoints Media:
const media = new BaseFireEndpoints("/api/v1/media", true);
export const getImages = () => media.get("img", null, null);

export const deleteImage = (id, aux, auxReject) =>
  media.delete(`img/${id}`, aux, auxReject);

export const createVideo = (data, aux, auxReject) =>
  media.post(
    "videos/create",
    data,
    aux,
    auxReject,
    "Video creado exitosamente"
  );

export const getVideos = () => media.get("videos", null, null);

export const getVideoById = (id) => media.get(`videos/${id}`, null, null);

export const updateVideo = (id, data, aux, auxReject) =>
  media.put(
    `videos/update/${id}`,
    data,
    aux,
    auxReject,
    "Video actualizado exitosamente"
  );

export const deleteVideo = (id, aux, auxReject) =>
  media.delete(`videos/${id}`, aux, auxReject);

//TODO Endpoints Works

const workAdmin = new BaseFireEndpoints("/api/v1/work", true);

export const createWorks = (data, aux, auxReject) =>
  workAdmin.post(`create`, data, aux, auxReject);

export const updateWorks = (id, data, aux, auxReject) =>
  workAdmin.put(`${id}`, data, aux, auxReject);

export const deleteWorks = (id, auxReject) =>
  workAdmin.delete(`${id}`, null, auxReject);
