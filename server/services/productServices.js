import { db, storage } from"../firebase.js";
import * as fire from "./storage.js"
import eh from '../utils/errorHandlers.js'
import help from "./helpers.js";
import NodeCache from "node-cache";

const Product = db.collection("product");

const Item = db.collection("item");

const cache = new NodeCache({ stdTTL: 1800 }); // TTL (Time To Live) de media hora

export default  {
  createProduct: async (title1, landing1, info_header1, info_body1, items1) => {
    try {
      // Verificar si existe un producto con el mismo título
      const titleQuery = await Product.where('title', '==', title1).get();
      if (!titleQuery.empty) {
        eh.throwError("Este titulo ya existe", 400);
      }

      // Crear un batch para manejar múltiples operaciones
      const batch = db.batch();

      // Preparar el documento del producto (inicialmente sin items)
      const productRef = Product.doc();
      const productData = {
        title: title1,
        landing: landing1,
        info_header: info_header1,
        info_body: info_body1,
        itemRefs: [], // Array que contendrá las referencias a los items
        createdAt: new Date(),
        enable: true,
      };

      // Crear referencias y datos para los items
      const itemRefs = [];
      const createdItems = [];

      // Crear los items y guardar sus referencias
      for (const item of items1) {
        const newItemRef = Item.doc();
        const newItemData = {
          img: item.img,
          text: item.text,
          productId: productRef.id, // Referencia al producto padre
          enable: true,
          createdAt: new Date()
        };
        
        batch.set(newItemRef, newItemData);
        itemRefs.push(newItemRef);
        createdItems.push({
          id: newItemRef.id,
          ...newItemData
        });
      }

      // Actualizar el producto con las referencias a los items
      productData.itemRefs = itemRefs.map(ref => ref.id);
      batch.set(productRef, productData);

      // Ejecutar todas las operaciones en batch
      await batch.commit();

      return {
        info: {
          id: productRef.id,
          ...productData
        },
        items: createdItems
      };
    } catch (error) {
      throw error;
    }
  },

  addNewItem: async (img, text, productId) => {
    try {
      // Obtener el producto
      const productRef = Product.doc(productId);
      const productDoc = await productRef.get();

      if (!productDoc.exists) {
        eh.throwError("Producto no encontrado", 404);
      }

      // Crear batch para operación atómica
      const batch = db.batch();

      // Crear nuevo item
      const newItemRef = Item.doc();
      const newItemData = {
        img,
        text,
        productId,
        enable: true,
        createdAt: new Date()
      };

      // Añadir el nuevo item al batch
      batch.set(newItemRef, newItemData);

      // Obtener referencias actuales y añadir la nueva
      const currentData = productDoc.data();
      const updatedRefs = [...(currentData.itemRefs || []), newItemRef.id];

      // Actualizar el producto con la nueva referencia
      batch.update(productRef, {
        itemRefs: updatedRefs,
        updatedAt: new Date()
      });

      // Ejecutar las operaciones en batch
      await batch.commit();

      // Invalidar cache ya que los datos han cambiado
      //cache.del("products");

      // Retornar el nuevo item creado
      return {
        id: newItemRef.id,
        ...newItemData
      };
    } catch (error) {
      throw error;
    }
  },

  getProduct: async () => {
    try {
      let products = cache.get("products");
      if (products) {
        return { products, cache: true };
      }

      const productsSnapshot = await Product
        .orderBy('createdAt', 'desc')
        .get();

      if (productsSnapshot.empty) {
        return {products: help.dataEmptyPage(), cache: false};
      }

      const productsData = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // No incluimos los items, solo la cantidad de referencias
        itemCount: doc.data().itemRefs ? doc.data().itemRefs.length : 0
      }));

      const data = help.productCleaner(productsData, false);
      cache.set("products", data);
      
      return { products: data, cache: false };
    } catch (error) {
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const productDoc = await Product.doc(id).get();
      
      if (!productDoc.exists) {
        eh.throwError("Dato no hallado", 404);
      }

      const productData = productDoc.data();
      const items = [];

      // Solo cargamos los items si el producto existe y tiene referencias
      if (productData.itemRefs && productData.itemRefs.length > 0) {
        const itemDocs = await Promise.all(
          productData.itemRefs.map(itemId => Item.doc(itemId).get())
        );

        // Filtramos solo los items activos
        for (const itemDoc of itemDocs) {
          if (itemDoc.exists && itemDoc.data().enable) {
            items.push({
              id: itemDoc.id,
              ...itemDoc.data()
            });
          }
        }
      }

      const fullProductData = {
        id: productDoc.id,
        ...productData,
        Items: items
      };

      return help.productCleaner(fullProductData, true);
    } catch (error) {
      throw error;
    }
  },
  getDetail: async (id) => {
    try {
      const itemDoc = await Item.doc(id).get();
      
      if (!itemDoc.exists || !itemDoc.data().enable) {
        eh.throwError("Dato no hallado", 404);
      }

      const itemData = {
        id: itemDoc.id,
        ...itemDoc.data()
      };

      return help.aux(itemData, true);
    } catch (error) {
      throw error;
    }
  },
  updProduct: async (id, newData) => {
    try {
      const productRef = Product.doc(id);
      const productDoc = await productRef.get();
      
      if (!productDoc.exists) {
        eh.throwError("Error inesperado, dato no hallado!", 404);
      }

      const parsedData = {
        title: newData.title,
        logo: newData.logo,
        landing: newData.landing,
        info_header: newData.info_header,
        info_body: newData.info_body,
        url: newData.url,
        enable: Boolean(newData.enable),
        updatedAt: new Date()
      };

      // Mantenemos las referencias existentes a items
      const currentData = productDoc.data();
      if (currentData.itemRefs) {
        parsedData.itemRefs = currentData.itemRefs;
      }

      await productRef.update(parsedData);
      //cache.del("products"); // Invalidamos el cache

      return {
        id,
        ...parsedData
      };
    } catch (error) {
      throw error;
    }
  },

  updItem: async (id, newData) => {
    try {
      const itemRef = Item.doc(id);
      const itemDoc = await itemRef.get();

      if (!itemDoc.exists) {
        eh.throwError("Error inesperado, item no hallado!", 404);
      }

      const parsedData = {
        img: newData.img,
        text: newData.text,
        enable: Boolean(newData.enable),
        updatedAt: new Date()
      };

      await itemRef.update(parsedData);
      
      return {
        id,
        ...parsedData
      };
    } catch (error) {
      throw error;
    }
  
  },

  delProduct: async (id) => {
    try {
      const productRef = Product.doc(id);
      const productDoc = await productRef.get();

      if (!productDoc.exists) {
        eh.throwError("Producto no hallado", 404);
      }

      const productData = productDoc.data();
      const batch = db.batch();

      // Eliminar todos los items referenciados
      if (productData.itemRefs && productData.itemRefs.length > 0) {
        for (const itemId of productData.itemRefs) {
          batch.delete(Item.doc(itemId));
        }
      }

      // Eliminar el producto
      batch.delete(productRef);

      // Ejecutar batch
      await batch.commit();
      //cache.del("products");

      return {
        message: "Producto y sus items asociados borrados exitosamente"
      };
    } catch (error) {
      throw error;
    }
  },
  delItem: async (id) => {
    try {
      // Encontrar el Home por ID
      const itemRef =  Item.doc(id);
      const itemDoc = await itemRef.get()
      if (!itemDoc.exists) {
        eh.throwError("Item no hallado", 404);
      }
     const batch = db.batch
      // Borrar el item
      batch.delete(itemRef);
      await batch.commit()
      //cache.del("products");
      return { message: "Item borrado exitosamente" };
    } catch (error) {
      throw error;
    }
  },
};
