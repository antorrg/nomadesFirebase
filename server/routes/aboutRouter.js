import express from 'express'
import ctr from '../controllers/aboutController.js'
import midd from '../middlewares/middlewares.js'
import auth from '../middlewares/validation/index.js'

const aboutRouter = express.Router()

aboutRouter.post('/about/create', auth.verifyToken, midd.aboutWorkCreate, ctr.aboutCreate)

aboutRouter.get('/about', ctr.aboutGet)

aboutRouter.get('/about/:id', midd.middIntId, ctr.aboutById)

aboutRouter.put('/about/:id', auth.verifyToken, midd.middIntId, midd.aboutWorkUpd, ctr.aboutUpd)

aboutRouter.delete('/about/:id', auth.verifyToken, midd.middIntId, ctr.aboutDelete)

aboutRouter.post('/work/create', auth.verifyToken, midd.aboutWorkCreate, ctr.workCreate)

aboutRouter.get('/work', ctr.workGet)

aboutRouter.get('/work/:id', auth.verifyToken, midd.middIntId, ctr.workById)

aboutRouter.put('/work/:id', auth.verifyToken, midd.middIntId, midd.aboutWorkUpd, ctr.workUpd)

aboutRouter.delete('/work/:id', auth.verifyToken, midd.middIntId, ctr.workDelete)


export default aboutRouter;