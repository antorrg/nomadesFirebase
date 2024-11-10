import express from 'express'
import ctr from '../controllers/productControllers.js'
import mdd from '../middlewares/middlewares.js'
import auth from '../middlewares/validation/index.js'


const productRouter = express.Router()

productRouter.post('/product/create', auth.verifyToken, auth.checkRole([0,2,9]), ctr.createController)
productRouter.put('/product/:id', auth.verifyToken, auth.checkRole([0,2,9]), ctr.updController)
productRouter.delete('/product/:id', auth.verifyToken, auth.checkRole([0,9]), ctr.delController)
productRouter.post('/product/item/create', auth.verifyToken, auth.checkRole([0,2,9]), ctr.createItemController)
productRouter.put('/product/item/:id', auth.verifyToken, auth.checkRole([0,2,9]), ctr.detailUpdController)
productRouter.delete('/product/item/:id', auth.verifyToken, auth.checkRole([0,2,9]), ctr.delItemController)
productRouter.get('/product', ctr.getProductHand)// experimental, debe borrarse
productRouter.get('/product/:id', ctr.getProductById)// experimental, debe borrarse
productRouter.get('/product/item/:id', ctr.getItemById)// experimental, debe borrarse
export default productRouter;