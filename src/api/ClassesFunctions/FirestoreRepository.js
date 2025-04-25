import { 
        collection, 
        doc, 
        getDocs, 
        getDoc, 
        query, 
        where, 
        limit, 
        orderBy,
        startAfter,
        endBefore,
        startAt,
        endAt,
        updateDoc,
        deleteDoc,
        addDoc,
        setDoc,
        writeBatch,
        serverTimestamp
      } from 'firebase/firestore';
      import { db } from './firebaseConfig'
      import customError from './customError'
      /**
       * Clase repositorio genérica para operaciones con Firestore
       */
      class FirestoreRepository {
        /**
         * @param {string} collectionName - Nombre de la colección en Firestore
         * @param {object} options - Opciones adicionales (transformadores, validadores, etc)
         */
        constructor(collectionName, options = {}) {
          this.collectionRef = collection(db, collectionName);
          this.collectionName = collectionName;
          
          // Opciones personalizables
          this.options = {
            // Función para transformar datos antes de devolverlos al cliente
            dataTransformer: options.dataTransformer || ((data) => data),
            // Función para manejar resultados vacíos
            emptyHandler: options.emptyHandler || (() => []),
            // Función para transformar documentos individuales
            docTransformer: options.docTransformer || ((doc) => ({ id: doc.id, ...doc.data() })),
            // Si queremos añadir automáticamente timestamps
            addTimestamps: options.addTimestamps !== false
          };
        }
      
        /**
         * Obtiene todos los documentos de la colección
         * @param {object} options - Opciones adicionales como ordenamiento, límites, etc.
         * @returns {Promise<Array>} - Lista de documentos
         */
        async getAll(options = {}) {
          try {
            let q = this.collectionRef;
            
            // Aplicar condiciones si existen
            if (options.where) {
              options.where.forEach(condition => {
                q = query(q, where(condition.field, condition.operator, condition.value));
              });
            }
            
            // Aplicar ordenamiento
            if (options.orderBy) {
              options.orderBy.forEach(order => {
                q = query(q, orderBy(order.field, order.direction || 'asc'));
              });
            }
            
            // Limitar resultados
            if (options.limit) {
              q = query(q, limit(options.limit));
            }
            
            // Paginación
            if (options.startAfter) {
              q = query(q, startAfter(options.startAfter));
            }
            
            const snapshot = await getDocs(q);
            
            if (snapshot.empty) {
              return this.options.emptyHandler();
            }
            
            const docs = snapshot.docs.map(this.options.docTransformer);
            return this.options.dataTransformer(docs);
          } catch (error) {
            customError(`Error obteniendo documentos de ${this.collectionName}: ${error}`,500);
          }
        }
        async getAlguno() {
          try {
            const snapshot = await getDocs(this.collectionRef);
        
            if (snapshot.empty) {
              customError('No encontré nada', 404);
            }
        
            // 🔥 Esta es la corrección importante
            const docs = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
        
            return docs;
        
          } catch (error) {
            customError(`Error obteniendo documentos de ${this.collectionName}: ${error}`, 500);
          }
        }
      
        /**
         * Obtiene un documento por su ID
         * @param {string} id - ID del documento
         * @returns {Promise<object|null>} - Documento o null si no existe
         */
        async getById(id) {
          try {
            const docRef = doc(this.collectionRef, id);
            const docSnap = await getDoc(docRef);
            
            if (!docSnap.exists()) {
              return this.options.emptyHandler();
            }
            
            const document = this.options.docTransformer(docSnap);
            return this.options.dataTransformer(document);
          } catch (error) {
            customError(`Error obteniendo documentos de ${this.collectionName}: ${error}`,500);
          }
        }
      
        /**
         * Obtiene un único documento basado en condiciones
         * @param {object} conditions - Condiciones para filtrar (campo, operador, valor)
         * @returns {Promise<object|null>} - Documento único o null
         */
        async getOne(conditions = {}) {
          try {
            let q = this.collectionRef;
            
            // Aplicar condiciones
            if (conditions.field && conditions.operator && conditions.value !== undefined) {
              q = query(q, where(conditions.field, conditions.operator, conditions.value));
            }
            
            // Siempre limitamos a 1 resultado
            q = query(q, limit(1));
            
            const snapshot = await getDocs(q);
            
            if (snapshot.empty) {
              return this.options.emptyHandler();
            }
            
            const document = this.options.docTransformer(snapshot.docs[0]);
            return this.options.dataTransformer(document);
          } catch (error) {
            customError(`Error obteniendo documentos de ${this.collectionName}: ${error}`,500);
            
          }
        }
      
        /**
         * Obtiene documentos por un campo específico
         * @param {string} field - Campo a filtrar
         * @param {string} operator - Operador de comparación (==, >, <, etc)
         * @param {any} value - Valor a comparar
         * @param {object} options - Opciones adicionales
         * @returns {Promise<Array>} - Lista de documentos que cumplen la condición
         */
        async getByField(field, operator, value, options = {}) {
          try {
            let q = query(this.collectionRef, where(field, operator, value));
            
            // Aplicar ordenamiento
            if (options.orderBy) {
              options.orderBy.forEach(order => {
                q = query(q, orderBy(order.field, order.direction || 'asc'));
              });
            }
            
            // Limitar resultados
            if (options.limit) {
              q = query(q, limit(options.limit));
            }
            
            const snapshot = await getDocs(q);
            
            if (snapshot.empty) {
              return this.options.emptyHandler();
            }
            
            const docs = snapshot.docs.map(this.options.docTransformer);
            return this.options.dataTransformer(docs);
          } catch (error) {
            customError(`Error obteniendo documentos de ${this.collectionName}: ${error}`,500);
          }
        }
      
        /**
         * Crea un nuevo documento
         * @param {object} data - Datos del documento a crear
         * @param {string} customId - ID personalizado (opcional)
         * @returns {Promise<object>} - Documento creado con su ID
         */
        async create(data, customId = null) {
          try {
            let docRef;
            let finalData = { ...data };
            
            // Añadir timestamps si está habilitado
            if (this.options.addTimestamps) {
              finalData.createdAt = new Date();
              finalData.updatedAt = new Date();
            }
            
            if (customId) {
              // Usar ID personalizado
              docRef = doc(this.collectionRef, customId);
              await setDoc(docRef, finalData);
            } else {
              // Generar ID automáticamente
              docRef = await addDoc(this.collectionRef, finalData);
            }
            
            return {
              id: docRef.id,
              ...finalData
            };
          } catch (error) {
            customError(`Error creando documentos de ${this.collectionName}: ${error}`,500);
          }
        }
      
        /**
         * Actualiza un documento existente
         * @param {string} id - ID del documento a actualizar
         * @param {object} data - Datos a actualizar
         * @returns {Promise<object>} - Documento actualizado
         */
        async update(id, data) {
          try {
            const docRef = doc(this.collectionRef, id);
            const docSnap = await getDoc(docRef);
            
            if (!docSnap.exists()) {
              customError(`Documento con ID ${id} no encontrado en ${this.collectionName}`,404);
            }
            
            let updateData = { ...data };
            
            // Añadir timestamp de actualización si está habilitado
            if (this.options.addTimestamps) {
              updateData.updatedAt = new Date();
            }
            
            await updateDoc(docRef, updateData);
            
            return {
              id,
              ...docSnap.data(),
              ...updateData
            };
          } catch (error) {
            customError(`Error actualizando documento en ${this.collectionName}: ${error}`,500);
          }
        }
      
        /**
         * Elimina un documento
         * @param {string} id - ID del documento a eliminar
         * @returns {Promise<boolean>} - True si se eliminó correctamente
         */
        async delete(id) {
          try {
            const docRef = doc(this.collectionRef, id);
            const docSnap = await getDoc(docRef);
            
            if (!docSnap.exists()) {
              customError(`Documento con ID ${id} no encontrado en ${this.collectionName}`, 404);
            }
            
            await deleteDoc(docRef);
            
            return true;
          } catch (error) {
            customError(`Error eliminando documento en ${this.collectionName}: ${error}`,500);
          }
        }
        
        /**
         * Verifica si existe un documento con un valor específico en un campo
         * @param {string} field - Campo a verificar
         * @param {any} value - Valor a buscar
         * @returns {Promise<boolean>} - True si existe
         */
        async existsByField(field, value) {
          try {
            const q = query(this.collectionRef, where(field, '==', value), limit(1));
            const snapshot = await getDocs(q);
            return !snapshot.empty;
          } catch (error) {
            console.error(`Error verificando existencia en ${this.collectionName}:`,404 );
            throw error;
          }
        }
        
        /**
         * Ejecuta operaciones en batch (transacciones)
         * @param {Function} operations - Función que recibe el batch y ejecuta operaciones
         * @returns {Promise<void>}
         */
        async executeBatch(operations) {
          try {
            const batch = writeBatch(db);
            await operations(batch, this.collectionRef);
            await batch.commit();
            return true;
          } catch (error) {
            customError(`Error ejecutando batch en ${this.collectionName}:`);
            throw error;
          }
        }
      }
      
export default FirestoreRepository
