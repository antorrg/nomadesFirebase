import { collection, query, where, getDocs, doc, addDoc, deleteDoc, limit } from 'firebase/firestore';
import { ref, deleteObject, uploadBytes, getDownloadURL} from 'firebase/storage';
import { db, storage } from "../firebase.js";  // Importamos las instancias ya configuradas
import eh from '../utils/errorHandlers.js';

// Referencia a la colección
const ImagesSaved = collection(db, "imagesSaved");

//*Función principal (la que se exporta y dirige las acciones)
const oldImagesHandler = (imageUrl, isRedirect) => {
    return isRedirect ? resaveImageFromStorage(imageUrl) : deleteImageFromStorage(imageUrl);
}

// Función para guardar imagen de Storage
const resaveImageFromStorage = async(imageUrl) => {
    try {
        // Verificar si el usuario ya existe
        const q = query(ImagesSaved, where("imageUrl", "==", imageUrl));
        const imageSnapshot = await getDocs(q);
        
        if (!imageSnapshot.empty) return { message: "Esta imagen ya fue guardada" };
        
        // Reubicar la imagen en firestore:
        const docRef = await addDoc(ImagesSaved, {
            imageUrl: imageUrl,
            createdAt: new Date()
        });

        if (!docRef.id) {
            eh.throwError("Error inesperado en el servidor", 500);
        }
        return { message: "Imagen reubicada exitosamente", success: true };
    } catch (error) {
        throw error;
    }
};
const uploadImageToFirebase = async (file) => {
    try {
      // Crear una referencia de almacenamiento con el nombre del archivo
      const storageRef = ref(storage, `images/${file.originalname}`);
  
      // Subir el archivo a Firebase Storage
      await uploadBytes(storageRef, file.buffer);
  
      // Obtener la URL de descarga
      const downloadURL = await getDownloadURL(storageRef);
      console.log('aca etoy: ',downloadURL)
  
      return downloadURL;
    } catch (error) {
      console.error('Error al subir la imagen a Firebase:', error);
      throw error;
    }
  };
// Función para eliminar imagen de Storage
const deleteImageFromStorage = async (imageUrl) => {
    try {
        // Extraer el path del archivo de la URL
        const filePathMatch = imageUrl.match(/images\/([^\/]+)$/);
        
        if (!filePathMatch) {
            throw new Error('URL de imagen no válida');
        }
        
        // filePath será: "images/1729187488915-autoUnion2.webp"
        const filePath = `images/${filePathMatch[1]}`;
        const fileRef = ref(storage, filePath);

        try {
            await deleteObject(fileRef);
            return { message: "Imagen borrada exitosamente", success: true };
        } catch (error) {
            if (error.code === 'storage/object-not-found') {
                throw new Error('Imagen no encontrada en Storage');
            }
            throw error;
        }
    } catch (error) {
        console.error('Error al eliminar imagen:', error);
        throw error;
    }
};

const deleteImage = async(data, isId) => {
    try {
        let documentToDelete;
        
        if (isId) {
            // Búsqueda por ID
            const docRef = doc(db, "imagesSaved", data);
            const docSnapshot = await getDocs(docRef);
            if (!docSnapshot.exists()) {
                eh.throwError('Imagen no hallada', 404);
            }
            documentToDelete = docRef;
        } else {
            // Búsqueda por URL
            const q = query(ImagesSaved, where("imageUrl", "==", data), limit(1));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                eh.throwError('Imagen no hallada', 404);
            }
            documentToDelete = doc(db, "imagesSaved", querySnapshot.docs[0].id);
        }

        // Eliminar el documento
        await deleteDoc(documentToDelete);
        if(isId){await deleteImageFromStorage(documentToDelete)}
        
        return {
            message: "Imagen borrada exitosamente",
            success: true
        };
    } catch (error) {
        throw error;
    }
};

const getImages = async() => {
    try {
        const snapshot = await getDocs(ImagesSaved);
        
        if (snapshot.empty) {
            return [{id: 1, imageUrl: 'NoData'}];
        }

        const imagesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        return imagesData.map((img) => ({
            id: img.id, 
            imageUrl: img.imageUrl
        }));
    } catch (error) {
        throw error;
    }
};

export { uploadImageToFirebase, oldImagesHandler, getImages, deleteImage };
