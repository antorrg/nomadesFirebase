import eh from "../utils/errorHandlers.js";
import * as imgs from "../services/storage.js";

export default {
  getImagesController: eh.catchAsync(async (req, res) => {
    const response = await imgs.getImages();
    res.status(200).json(response);
  }),
  deleteImagesController: eh.catchAsync(async (req, res) => {
    const { id } = req.params;
    const response = await imgs.deleteImage(id, true);
    res.status(200).json(response);
  }),
  uploadImages : eh.catchAsync(async(req, res)=>{
    const file = req.file;
    //console.log(req.file)
    if(!file){throwError('Not found', 404)}
    const imageUrl = await imgs.uploadImageToFirebase(file)
    const response = {  success: true,
                        message: 'Imagen subida exitosamente',
                        data: {url: imageUrl}
                      }
    console.log('response: ', response)
    res.status(200).json(response)
  }),
};
