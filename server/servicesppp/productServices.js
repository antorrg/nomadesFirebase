import {collection, query, where, getDocs, getDoc, doc, addDoc, deleteDoc, limit} from 'firebase/firestore';
import { db } from "../firebase.js";
import { oldImagesHandler } from './storage.js';
import eh from "../utils/errorHandlers.js";
import NodeCache from "node-cache";
import help from "./helpers.js";
   

const cache = new NodeCache({ stdTTL: 1800 }); // TTL (Time To Live) de media hora

  
  // Colecciones
  const Product = collection(db, "product");
  const Item = collection(db, "item");

  
  export default {
  createProduct : async (title1, landing1, info_header1, info_body1, items1) => {
    try {
      // Verificar si existe un producto con el mismo título
      const q = query(Product, where('title', '==', title1));
      const titleQuery = await getDocs(q);
      if (!titleQuery.empty) {
        eh.throwError("Este titulo ya existe", 400);
      }
  
      // Crear un batch para manejar múltiples operaciones
      const batch = writeBatch(db);
  
      // Preparar el documento del producto
      const productRef = doc(Product);
      const productData = {
        title: title1,
        landing: landing1,
        info_header: info_header1,
        info_body: info_body1,
        itemRefs: [],
        createdAt: new Date(),
        enable: true,
      };
  
      const itemRefs = [];
      const createdItems = [];
  
      // Crear los items y guardar sus referencias
      for (const item of items1) {
        const newItemRef = doc(Item);
        const newItemData = {
          img: item.img,
          text: item.text,
          productId: productRef.id,
          enable: true,
          createdAt: new Date()
        };
        
        batch.set(newItemRef, newItemData);
        itemRefs.push(newItemRef.id);
        createdItems.push({
          id: newItemRef.id,
          ...newItemData
        });
      }
  
      // Actualizar el producto con las referencias
      productData.itemRefs = itemRefs;
      batch.set(productRef, productData);
  
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
  
  addNewItem : async (img, text, productId) => {
    try {
      const productRef = doc(Product, productId);
      const productDoc = await getDoc(productRef);
  
      if (!productDoc.exists()) {
        eh.throwError("Producto no encontrado", 404);
      }
  
      const batch = writeBatch(db);
  
      const newItemRef = doc(Item);
      const newItemData = {
        img,
        text,
        productId,
        enable: true,
        createdAt: new Date()
      };
  
      batch.set(newItemRef, newItemData);
  
      const currentData = productDoc.data();
      const updatedRefs = [...(currentData.itemRefs || []), newItemRef.id];
  
      batch.update(productRef, {
        itemRefs: updatedRefs,
        updatedAt: new Date()
      });
  
      await batch.commit();
      cache.del("products");
  
      return {
        id: newItemRef.id,
        ...newItemData
      };
    } catch (error) {
      throw error;
    }
  },
  
  getProduct : async () => {
    try {
      let products = cache.get("products");
      if (products) {
        return { products, cache: true };
      }
  
      const q = query(Product, orderBy('createdAt', 'desc'));
      const productsSnapshot = await getDocs(q);
  
      if (productsSnapshot.empty) {
        return help.dataEmptyPage();
      }
  
      const productsData = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        itemCount: doc.data().itemRefs?.length || 0
      }));
  
      const data = help.productCleaner(productsData, false);
      cache.set("products", data);
      return { products: data, cache: false };
    } catch (error) {
      throw error;
    }
  },
  
  getById : async (id) => {
    try {
      const productRef = doc(Product, id);
      const productDoc = await getDoc(productRef);
      
      if (!productDoc.exists()) {
        eh.throwError("Dato no hallado", 404);
      }
  
      const productData = productDoc.data();
      const items = [];
  
      if (productData.itemRefs?.length > 0) {
        const itemDocs = await Promise.all(
          productData.itemRefs.map(itemId => getDoc(doc(Item, itemId)))
        );
  
        for (const itemDoc of itemDocs) {
          if (itemDoc.exists() && itemDoc.data().enable) {
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
  
  getDetail : async (id) => {
    try {
      const itemRef = doc(Item, id);
      const itemDoc = await getDoc(itemRef);
      
      if (!itemDoc.exists() || !itemDoc.data().enable) {
        eh.throwError("Dato no hallado", 404);
      }
  
      return help.aux({
        id: itemDoc.id,
        ...itemDoc.data()
      }, true);
    } catch (error) {
      throw error;
    }
  },
  
  updProduct : async (id, newData) => {
    try {
      const productRef = doc(Product, id);
      const productDoc = await getDoc(productRef);
      
      if (!productDoc.exists()) {
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
  
      const currentData = productDoc.data();
      if (currentData.itemRefs) {
        parsedData.itemRefs = currentData.itemRefs;
      }
  
      await updateDoc(productRef, parsedData);
      cache.del("products");
  
      return {
        id,
        ...parsedData
      };
    } catch (error) {
      throw error;
    }
  },
  
  updItem : async (id, newData) => {
    try {
      const itemRef = doc(Item, id);
      const itemDoc = await getDoc(itemRef);
  
      if (!itemDoc.exists()) {
        eh.throwError("Error inesperado, item no hallado!", 404);
      }
  
      const parsedData = {
        img: newData.img,
        text: newData.text,
        enable: Boolean(newData.enable),
        updatedAt: new Date()
      };
  
      await updateDoc(itemRef, parsedData);
      
      return {
        id,
        ...parsedData
      };
    } catch (error) {
      throw error;
    }
  },
  
  delProduct : async (id) => {
    try {
      const productRef = doc(Product, id);
      const productDoc = await getDoc(productRef);
  
      if (!productDoc.exists()) {
        eh.throwError("Producto no hallado", 404);
      }
  
      const productData = productDoc.data();
      const batch = writeBatch(db);
      
         // Eliminar la imagen del producto
      await oldImagesHandler(productData.landing, false);

    // Eliminar los items relacionados
      if (productData.itemRefs?.length > 0) {
        for (const itemId of productData.itemRefs) {
          const itemRef = doc(Item, itemId);
         const itemDoc = await getDoc(itemRef);
          if (itemDoc.exists()) {
            // Eliminar la imagen del item
            await oldImagesHandler(itemDoc.data().img, false);
            batch.delete(itemRef);
          }
        }
      }

  
      batch.delete(productRef);
      await batch.commit();
      cache.del("products");
  
      return {
        message: "Producto y sus items asociados borrados exitosamente"
      };
    } catch (error) {
      throw error;
    }
  },
  
  delItem : async (id) => {
    try {
      const itemRef = doc(Item, id);
      const itemDoc = await getDoc(itemRef);
      
      if (!itemDoc.exists()) {
        eh.throwError("Item no hallado", 404);
      }
      
      const imageUrl = itemDoc.data().img;
      const batch = writeBatch(db);
      batch.delete(itemRef);
      await batch.commit();
      cache.del("products");
      // Eliminar la imagen antigua del storage:
      const pictureOld = await oldImagesHandler(imageUrl , false);
        if (pictureOld.success === false) {
         eh.throwError('Error al procesar imagen antigua', 500);
        }
      
      return "Item borrado exitosamente";
    } catch (error) {
      throw error;
    }
  },
};
/*export default {
createProduct : async (title1, landing1, info_header1, info_body1, items1 ) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const product = await Product.findOne({
            where:{title : title1

            }, transaction
        });
        if(product){eh.throwError('Este titulo ya existe', 400)};
        const newProduct = await Product.create({
            title:title1,
            landing: landing1,
            info_header:info_header1,
            info_body:info_body1,
        },{transaction});  
        const createdItems = await Promise.all(
            items1.map(async(item)=> {
                const newItem = await Item.create({
                    img : item.img,
                    text: item.text,
                },{transaction})

            await newProduct.addItem(newItem, {transaction})    
            return newItem;
            })
        );
        await transaction.commit()
        return {info: newProduct,
               items: createdItems}
    } catch (error) {
        if (transaction) { await transaction.rollback();}; throw error;}
},

addNewItem: async (img, text, id) => {
try {
    const productFound = await Product.findByPk(id);
    if(!productFound){eh.throwError('Ocurrio un error, objeto no encontrado', 404)};
    const newItem = await Item.create({
        img:img,
        text: text,})
    await productFound.addItem(newItem)
    return { message: "Item creado exitosamente"}
} catch (error) {throw error;}
},

getProduct : async () => {
    try {
        let products = cache.get('products');
        if (products) {
                       return {products: products,
                               cache: true 
                              }
                        }// Devolver los datos en caché si existen}
        const dataFound = await Product.findAll({
             include :[{
                model: Item,
                attributes:['id', 'img', 'text', 'ProductId'],
           },],
        })
        if(!dataFound){eh.throwError('Dato no hallado', 404)}
        if(dataFound.length === 0)return help.dataEmptyPage()
        const data = help.productCleaner(dataFound, false)
        cache.set('products', data);
        return {products: data,
                cache: false
                }
    } catch (error) {throw error;}
},
getById : async (id) => {
    try {
        const data = await Product.findByPk(id,{
            where:{
                deleteAt:false,
            },
                include : [{
                    model: Item,
                    attributes: ['id', 'img', 'text', 'ProductId'],
                }]
        })
        if(!data){eh.throwError('Dato no hallado', 404)}
        const dataFound = help.productCleaner(data, true)
        return dataFound
    } catch (error) {throw error;}
},
getDetail : async (id) => {
    try {
        const itemFound = await Item.findByPk(id,{
            where: {enable:true,}});
        if(!itemFound){eh.throwError('Dato no hallado', 404)}
        const item = help.aux(itemFound, true)
        return item;
    } catch (error) {throw error;}
},
updProduct : async (id, newData) => {
    const options = help.optionImage(newData.saver)
    const useImgs = help.optionImage(newData.useImg)
    let imageStore = "";
    try {
        const productFound = await Product.findByPk(id);
        if(!productFound){eh.throwError('Error inesperado, dato no hallado!',404)}
        if(productFound.landing !== newData.landing){
            imageStore = productFound.landing
        }
        if(useImgs){await cloud.deleteImage(newData.landing, false)}; 
        const parsedData = {
            title: newData.title,
            logo: newData.logo,
            landing: newData.landing,
            info_header: newData.info_header,
            info_body: newData.info_body,
            url: newData.url,
            enable: Boolean(newData.enable),
            deleteAt: Boolean(newData.deleteAt)}
        const productUpd = await productFound.update(parsedData)
        const pictureOld = await cloud.oldImagesHandler(imageStore, options)
        if(pictureOld.success===false){eh.throwError('Error al procesar imagen antigua', 500)}
        if (productUpd) {
            cache.del('products');
            }
        return productUpd;
    } catch (error) {throw error;}
},

updItem: async (id, newData)=>{
    const options = help.optionImage(newData.saver)
    const useImgs = help.optionImage(newData.useImg)
    let imageStore = "";
    try {
        const itemFound = await Item.findByPk(id);
    if(!itemFound){eh.throwError('Error inesperado, item no hallado!',404)}
    if(itemFound.img !== newData.img){imageStore = itemFound.img}
    if(useImgs){await cloud.deleteImage(newData.img, false)}
    const parsedData = {
        img: newData.img,
        text: newData.text,
        enable: Boolean(newData.enable)}
    const itemUpd = itemFound.update(parsedData)
    const pictureOld = await cloud.oldImagesHandler(imageStore, options, )
     if(pictureOld.success===false){eh.throwError('Error al procesar imagen antigua', 500)}
    return itemUpd
    } catch (error) {throw error;}
},

delProduct: async (id) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        
        // Buscar el Producto
        const product = await Product.findByPk(id, { transaction });
        if (!product) {
            eh.throwError('Producto no hallado', 404);
        }

        // Obtener todas las imágenes de items antes del borrado
        const itemImages = await imageItemCapture(id);
        
        // Borrar todos los Items asociados
        await Item.destroy({
            where: { ProductId: id },
            transaction
        });

        // Borrar el Producto
        await product.destroy({ transaction });

        // Después de operaciones exitosas en DB, borrar imágenes de Cloudinary
        const deletePromises = [
            // Borrar imagen principal del producto
            cloud.deleteFromCloudinary(product.landing),
            // Borrar todas las imágenes de items
            ...itemImages.map(imgUrl => cloud.deleteFromCloudinary(imgUrl))
        ];

        const results = await Promise.allSettled(deletePromises);
        
        // Verificar si hubo fallos en los borrados
        const fallosEnBorrado = results.filter(result => result.status === 'rejected');
        if (fallosEnBorrado.length > 0) {
            console.error('Algunas imágenes no se pudieron borrar de Cloudinary:', fallosEnBorrado);
            // Puedes querer registrar estos fallos pero no fallar toda la operación
        }

        await transaction.commit();
        return { 
            message: 'Producto y sus items asociados borrados exitosamente',
            imagenesBorradas: results.filter(r => r.status === 'fulfilled').length
        };

    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        throw error;
    }
},

delItem: async (id) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();

        // Buscar el Item
        const item = await Item.findByPk(id);
        if (!item) {
            eh.throwError('Item no hallado', 404);
        }

        // Borrar el Item de la base de datos
        await item.destroy({ transaction });

        // Borrar la imagen de Cloudinary
        const resultadoCloudinary = await cloud.deleteFromCloudinary(item.img);
        if (!resultadoCloudinary) {
            // Registrar el error pero no fallar la operación
            console.error('Advertencia: No se pudo borrar la imagen de Cloudinary:', item.img);
        }

        await transaction.commit();
        return {
            message: 'Item borrado exitosamente',
            imagenBorrada: !!resultadoCloudinary
        };

    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        throw error;
    }
}
};
async function imageItemCapture (id){
    try {
        const data = await Item.findAll({
            where:{
                ProductId : id,
                attributes: ['img']
            },
        })
        if(!data){eh.throwError('Error inesperado', 500)}
        return data.map(item => item.img);
    } catch (error) {
        throw error
    }
   
}*/