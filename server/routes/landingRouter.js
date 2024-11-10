import express from 'express'
import ctr from '../controllers/landingController.js'
import mdd from '../middlewares/middlewares.js'
import auth from '../middlewares/validation/index.js'

const landingRouter = express.Router()

landingRouter.post('/land', ctr.createLandingController)

landingRouter.put('/land/:id', ctr.updLandingController)

landingRouter.delete('/land/:id', ctr.deleteLandingController)

landingRouter.get('/land', ctr.getLandingController)

export default landingRouter;