import express from 'express'
import media from '../controllers/mediaControllers.js'

const mediaRouter = express.Router()

mediaRouter.get('/media/imgs', media.getImagesController)

mediaRouter.delete('/media/imgs/:id', media.deleteImagesController)


export default mediaRouter;