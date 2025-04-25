import imageService from './ImageService'



const oldImagesHandler = imageService.handleOldImage;
const deleteImage = imageService.deleteImageFromCollection

class GenericService {
  constructor(Repo, useImage = false, parserFunction = null,) {
   this.Repo = Repo;
    this.useImage = useImage;
    this.parserFunction = parserFunction;
  }


  async handleImageDeletion(imageUrl, option) {
    if (this.useImage && imageUrl.trim()) {
      // Implement your Firebase image deletion logic here
      // This might involve using Firebase Storage
      await oldImagesHandler(imageUrl, option);
    }
  }
  async handleImageStored(imageUrl) {
    await deleteImage(imageUrl, false);
  }

  async create(data, uniqueField = null) {
    const useImg = help.optionBoolean(data.useImg);
    try {
      // Check for existing record with unique field
      if (uniqueField) {
        const existingQuery = await this.collection
          .where(uniqueField, "==", data[uniqueField])
          .where("deletedAt", "==", null)
          .get();

        if (!existingQuery.empty) {
          eh.throwError(
            `This ${this.collectionName} ${uniqueField} already exists`,
            400
          );
        }
      }
      useImg ? this.handleImageStored(data.picture) : null;

    } catch (error) {
      console.error("Create error:", error);
      throw error;
    }
  }

  async getAll(
    parserFunction = null,
    isAdmin = null,
    queryObject = null,
    emptyObject
  ) {
    const cacheKey = `${this.collectionName}`;

    // Check cache if enabled
    if (this.useCache) {
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        return {
          data: cachedData,
          cache: true,
        };
      }
    }

    try {
      // Query for non-deleted documents
      const snapshot = await this.collection
        .where("deletedAt", "==", null)
        .get();

      if (snapshot.empty) {
        emptyObject
          ? { data: emptyObject(), cache: false }
          : eh.throwError(
              `The ${this.collectionName} collection is empty`,
              404
            );
      }

      // Convert snapshot to array of documents with ID
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(data);
      // Parse data if parser function provided
      const dataParsed = parserFunction
        ? data.map((dataMap) => parserFunction(dataMap, isAdmin))
        : data;

      // Cache data if enabled
      if (this.useCache) {
        cache.set(cacheKey, dataParsed);
      }

      return {
        data: dataParsed,
        cache: false,
      };
    } catch (error) {
      console.error("GetAll error:", error);
      throw error;
    }
  }

  async getById(id, parserFunction = null, isAdmin = null) {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();

      if (!doc.exists || doc.data().deletedAt !== null) {
        eh.throwError(`${this.collectionName} not found`);
      }

      const data = {
        id: doc.id,
        ...doc.data(),
      };

      return parserFunction ? parserFunction(data, isAdmin) : data;
    } catch (error) {
      console.error("GetById error:", error);
      throw error;
    }
  }

  async update(id, newData, parserFunction = null) {
    let imageUrl = "";
    let handleImages = false;
    const options = help.optionBoolean(newData.saver);
    const useImgs = help.optionBoolean(newData.useImg);
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();

      if (!doc.exists || doc.data().deletedAt !== null) {
        eh.throwError(`${this.collectionName} not found`);
      }

      // Handle image update if applicable
      if (
        this.useImage &&
        doc.data().picture &&
        doc.data().picture !== newData.picture
      ) {
        imageUrl = doc.data().picture;
        handleImages = true;
        if (useImgs) {
          await deleteImage(newData.picture);
        }
      }

      // Prepare update data
      const updateData = {
        ...newData,
        updatedAt: FieldValue.serverTimestamp(),
      };

      // Update document
      await docRef.update(updateData);

      // Handle image deletion
      if (handleImages) {
        await this.handleImageDeletion(imageUrl, options);
      }

      // Clear cache if enabled
      if (this.useCache) this.clearCache();

      // Fetch and return updated document
      const updatedDoc = await docRef.get();
      const upData = {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      };

      return parserFunction ? parserFunction(upData) : upData;
    } catch (error) {
      console.error("Update error:", error);
      throw error;
    }
  }

  async delete(id, isHard = false) {
    let imageUrl = "";
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();

      if (!doc.exists || doc.data().deletedAt !== null) {
        eh.throwError(`${this.collectionName} not found`);
      }

      // Handle image if applicable
      if (this.useImage) {
        imageUrl = doc.data().picture || "";
      }

      if (isHard) {
        // Hard delete
        await docRef.delete();
        await this.handleImageDeletion(imageUrl, false);
      } else {
        // Soft delete
        await docRef.update({
          deletedAt: FieldValue.serverTimestamp(),
        });
        await this.handleImageDeletion(imageUrl, false);
      }

      // Clear cache if enabled
      if (this.useCache) this.clearCache();

      return `${this.collectionName} deleted successfully`;
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  }
}

export default GenericService;
