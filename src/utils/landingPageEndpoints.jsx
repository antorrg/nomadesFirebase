import axios from "axios";
import * as toast from "../Auth/generalComponents/HandlerError";
import {setAuthHeader} from "../Auth/generalComponents/axiosUtils";

//Endpoinst landing page:

export const sendEmail = async (body, onClose) => { //Envio de emails del visitante
  try {
    const response = await axios.post(
      `/api/v1/land/emails`,
      body,
    );
    if (response.status === 200) {
      toast.showSuccess("Email enviado correctamente");
      await onClose(); // Cierra el modal después de guardar los cambios
    }
  } catch (error) {
    toast.HandlError(error);
  }
};

export const updateLanding = async (id, product, onClose) => {
    console.log(id);
    try {
      const response = await axios.put(
        `/api/v1/land/${id}`,
        product,
        setAuthHeader()
      );
      if (response.status === 200) {
        toast.showSuccess("Pagina actualizada correctamente");
        await onClose(); // Cierra el modal después de guardar los cambios
      }
    } catch (error) {
      toast.HandlError(error);
      console.error("Error al actualizar la pagina:", error);
    }
  };

  export const createLanding = async (product, onClose) => {
    try {
      const response = await axios.post(
        `/api/v1/land/create`,
        product,
        setAuthHeader()
      );
      if (response.status === 201) {
        toast.showSuccess("Pagina creada correctamente");
        await onClose(); // Cierra el modal después de guardar los cambios
      }
    } catch (error) {
      toast.HandlError(error);
      //console.error("Error al crear el producto:", error);
    }
  };
  

  //Endpoints OurWork:

 export const updateWorks = async (id, product, onClose) => {
    console.log(id);
    try {
      const response = await axios.put(
        `/api/v1/work/${id}`,
        product,
        setAuthHeader()
      );
      if (response.status === 200) {
        toast.showSuccess("Item actualizado correctamente");
        await onClose(); // Cierra el modal después de guardar los cambios
      }
    } catch (error) {
      toast.HandlError(error);
      console.error("Error al actualizar el item:", error);
    }
  };

  export const createWorks = async (product, onClose) => {
    try {
      const response = await axios.post(
        `/api/v1/work/create`,
        product,
        setAuthHeader()
      );
      if (response.status === 201) {
        toast.showSuccess("Item creado correctamente");
        await onClose(); // Cierra el modal después de guardar los cambios
      }
    } catch (error) {
      toast.HandlError(error);
      //console.error("Error al crear el producto:", error);
    }
  };
  

  export const deleteWorks = async (id) => {
    try {
      const response = await axios.delete(
        `/api/v1/work/${id}`,
        setAuthHeader()
      );
      if (response.status === 200) {
        toast.showSuccess("Producto borrado correctamente");
       // await onClose(); // Cierra el modal después de guardar los cambios
      }
    } catch (error) {
      toast.HandlError(error);
    }
  };
//Endpoints media/video:
export const updateMedia = async (id, product, onClose) => {

    try {
      const response = await axios.put(
        `/api/v1/media/videos/update/${id}`,
        product,
        setAuthHeader()
      );
      if (response.status === 200) {
        toast.showSuccess("Item actualizado correctamente");
        await onClose(); // Cierra el modal después de guardar los cambios
      }
    } catch (error) {
      toast.HandlError(error);
      console.error("Error al actualizar la pagina:", error);
    }
  };

  export const createMedia = async (product, onClose) => {
    try {
      const response = await axios.post(
        `/api/v1/media/videos/create`,
        product,
        setAuthHeader()
      );
      if (response.status === 201) {
        toast.showSuccess("Item creado correctamente");
        await onClose(); // Cierra el modal después de guardar los cambios
      }
    } catch (error) {
      toast.HandlError(error);
      //console.error("Error al crear el producto:", error);
    }
  };
  

  export const deleteMedia = async (id) => {
   
    try {
      const response = await axios.delete(
        `/api/v1/media/videos/${id}`,
        setAuthHeader()
      );
      if (response.status === 200) {
        toast.showSuccess("Producto borrado correctamente");
        //await onClose(); // Cierra el modal después de guardar los cambios
      }
    } catch (error) {
      toast.HandlError(error);
    }
  };