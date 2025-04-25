// ImageService.js
import { storage } from "./firebaseConfig";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import customError from "./customError";
import FirestoreRepository from "./FirestoreRepository";

class ImageService {
  constructor() {
    this.repo = new FirestoreRepository("imagesSaved");
  }

  async uploadFile(file) {
    try {
      const storageRef = ref(storage, `uploads/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      console.log("Archivo subido. URL:", downloadURL);
      return downloadURL;
    } catch (error) {
      customError("Error al subir imagen", 500, true);
    }
  }

  async handleOldImage(imageUrl, isRedirect) {
    return isRedirect
      ? this.resaveImageFromStorage(imageUrl)
      : this.deleteImageFromStorage(imageUrl);
  }

  async deleteImageFromStorage(imageUrl) {
    try {
      const filePath = `images/${imageUrl?.split("/").pop()}`;
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
      console.log("Archivo eliminado correctamente:", filePath);
      return "Imagen eliminada exitosamente";
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
      throw error;
    }
  }

  async resaveImageFromStorage(imageUrl) {
    const found = await this.repo.getOne({ field: 'imageUrl', operator: '==', value: imageUrl });
    if (found) customError("Esta imagen ya existe", 400);
    try {
      await this.repo.create(imageUrl);
      return "Imagen guardada exitosamente";
    } catch (error) {
      customError("Error al guardar la imagen", 500);
    }
  }

  async getImages() {
    try {
      return await this.repo.getAll();
    } catch (error) {
      customError("Error al obtener las imagenes", 500);
    }
  }

  async deleteImageFromCollection(id) {
    try {
      await this.repo.delete(id);
      return "Imagen borrada exitosamente";
    } catch (error) {
      customError("Error al borrar la imagen", 500);
    }
  }

  async deleteImage(id) {
    try {
      const image = await this.repo.getById(id);
      if (!image) customError("Imagen no hallada", 404);
      await this.deleteImageFromStorage(image.imageUrl);
      await this.repo.delete(id);
      return "Imagen borrada exitosamente";
    } catch (error) {
      customError("Error al borrar la imagen", 500);
    }
  }
}

const imageService = new ImageService()
export {ImageService}
export default imageService

// import { storage } from "./firebaseConfig";
// import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
// import customError from "./customError";
// import FirestoreRepository from "./FirestoreRepository";

// const images = new FirestoreRepository('imagesSaved');

// const extractPathFromUrl = (url) => {
//   const match = url.match(/%2F(.+)\?alt=media/);
//   return match ? match[1] : null;
// };

// const uploadFile = async (file) => {
//   try {
//     const storageRef = ref(storage, `uploads/${file.name}`);
//     await uploadBytes(storageRef, file);
//     const downloadURL = await getDownloadURL(storageRef);
//     console.log("Archivo subido. URL:", downloadURL);
//     return downloadURL;
//   } catch (error) {
//     customError("Error al subir imagen", 500, true);
//   }
// };

// const oldImagesHandler = (imageUrl, isRedirect) => {
//   return isRedirect ? resaveImageFromStorage(imageUrl) : deleteImageFromStorage(imageUrl);
// };

// const deleteImageFromStorage = async (imageUrl) => {
//   try {
//     const filePath = extractPathFromUrl(imageUrl);
//     if (!filePath) customError("URL de imagen no válida", 400);

//     const fileRef = ref(storage, `uploads/${filePath}`);
//     await deleteObject(fileRef);
//     console.log("Archivo eliminado correctamente:", filePath);
//     return 'Imagen eliminada exitosamente';
//   } catch (error) {
//     console.error("Error al eliminar imagen:", error);
//     throw error;
//   }
// };

// const resaveImageFromStorage = async (imageUrl) => {
//   const exists = await images.getOne({ field: 'imageUrl', operator: '==', value: imageUrl });
//   if (exists) customError('Esta imagen ya existe', 400);

//   try {
//     await images.create({ imageUrl });
//     return 'Imagen guardada exitosamente';
//   } catch (error) {
//     customError('Error al guardar la imagen', 500);
//   }
// };

// const getImages = async () => {
//   try {
//     const imagesSaved = await images.getAll();
//     return imagesSaved;
//   } catch (error) {
//     customError('Error al obtener las imágenes', 500);
//   }
// };

// const deleteImageFromCollection = async (id) => {
//   try {
//     await images.delete(id);
//     return 'Imagen borrada exitosamente';
//   } catch (error) {
//     customError('Error al borrar la imagen', 500);
//   }
// };

// const deleteImage = async (id) => {
//   try {
//     const image = await images.getById(id);
//     if (!image) customError('Imagen no hallada', 404);

//     if (image.imageUrl) {
//       await deleteImageFromStorage(image.imageUrl);
//     }

//     await images.delete(id);
//     return 'Imagen borrada exitosamente';
//   } catch (error) {
//     customError('Error al borrar la imagen', 500);
//   }
// };

// export {
//   uploadFile,
//   oldImagesHandler,
//   getImages,
//   deleteImageFromCollection,
//   deleteImage,
// };
