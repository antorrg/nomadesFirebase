import express from 'express'
import ctr from '../controllers/usersControllers.js'
import mdd from '../middlewares/middlewares.js'
import auth from '../middlewares/validation/index.js'
import cont from '../controllers/landingController.js'


const userRouter = express.Router()

userRouter.post('/user/create',  auth.verifyToken, auth.checkRole([0, 9]), mdd.createUser ,ctr.userCreateController)
userRouter.post('/user/login', mdd.loginUser ,ctr.loginController)
userRouter.get('/user',  auth.verifyToken, auth.checkRole([0,9]), ctr.getUserController)
userRouter.get('/user/:id', auth.verifyToken, mdd.middUuid, ctr.getUserByIdController)
userRouter.put('/user/updprofile/:id', auth.verifyToken, ctr.updUserCtr)
userRouter.post('/user/update', auth.verifyToken,  ctr.verifyPassCtr)
userRouter.put('/user/update/:id', auth.verifyToken,  ctr.changePassCtr)
userRouter.patch('/user/upgrade/:id', auth.verifyToken, auth.checkRole([0, 9]), ctr.changeStateUserCtr)
userRouter.post('/user/change', auth.verifyToken, auth.checkRole([0, 9]), ctr.resetPassCtr)
userRouter.delete('/user/:id', auth.verifyToken, mdd.middUuid, ctr.delUserCtr)

export default userRouter;