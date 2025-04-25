const {db, storage} = require("./");
const eh = require("./utils/errorHandlers.js");

// Declarar colleccion en firestore (carpeta)
const ImagesSaved = db.collection("imagesSaved");

//* Funcion principal (la que se exporta y dirige las acciones)
const oldImagesHandler = (imageUrl, isRedirect)=>{
  return isRedirect ? resaveImageFromStorage(imageUrl) :
  deleteImageFromStorage(imageUrl);
};

// Funcion para guardar imagen de Storage
const resaveImageFromStorage = async (imageUrl)=>{
  // Verificar si el usuario ya existe
  const imageSnapshot = await ImagesSaved.where(
      "imageUrl", "==", imageUrl).get();
  if (!imageSnapshot.empty) return {message: "Esta imagen ya fue guardada"};

  // Reubicar la imagen en firestore:
  const docRef = await ImagesSaved.add({
    imageUrl: imageUrl,
    createdAt: new Date(),
  });

  if (!docRef.id) {
    eh.throwError("Error inesperado en el servidor", 500);
  }
  return {message: "Imagen reubicada exitosamente", success: true};
};

// Función para eliminar imagen de Storage
const deleteImageFromStorage = async (imageUrl) => {
  try {
    // Extraer el path del archivo de la URL
    const filePathMatch = imageUrl;

    if (!filePathMatch) {
      throw new Error("URL de imagen no válida");
    }

    // filePath será: "images/1729187488915-autoUnion2.webp"
    const filePath = `images/${filePathMatch[1]}`;
    const file = storage.file(filePath);

    // Verificar si el archivo existe
    const [exists] = await file.exists();
    if (!exists) {
      throw new Error("Imagen no encontrada en Storage");
    }

    // Eliminar el archivo
    await file.delete();
    return {message: "Imagen borrada exitosamente", success: true};
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    throw error;
  }
};
const deleteImage = async (data, isId) => {
  let documentToDelete;

  if (isId) {
    // Búsqueda por ID
    const docSnapshot = await ImagesSaved.doc(data).get();
    if (!docSnapshot.exists) {
      eh.throwError("Imagen no hallada", 404);
    }
    documentToDelete = docSnapshot.ref;
  } else {
    // Búsqueda por URL
    const querySnapshot = await ImagesSaved.
        where("imageUrl", "==", data)
        .limit(1)
        .get();
    if (querySnapshot.empty) {
      eh.throwError("Imagen no hallada", 404);
    }
    documentToDelete = querySnapshot.docs[0].ref;
  }

  // Eliminar el documento
  await documentToDelete.delete();

  return "Imagen borrada exitosamente";
};


const getImages = async ()=>{
  const snapshot = await ImagesSaved.get();
  // return snapshot.docs
  if (snapshot.empty) {
    return [{id: 1, imageUrl: "NoData"}];
  }
  const imagesData = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return imagesData.map((img)=>({id: img.id, imageUrl: img.imageUrl}));
};


module.exports = {
  oldImagesHandler,
  getImages,
  deleteImage,
};
