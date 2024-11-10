import eh from "../utils/errorHandlers.js";
import sv from "../services/userServices.js";
import * as vld from "../middlewares/validation/sessionMiddle.js";

export default {
  userCreateController: eh.catchAsync(async (req, res) => {
    const { email } = req.body;
    const response = await sv.userCreate(email);
    res.status(201).json(response);
  }),
  loginController: eh.catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const response = await sv.userLog(email, password);
    res.status(200).json(response);
  }),
  logout: eh.catchAsync(async (req, res, next) => {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie("connect.sid"); // Limpia la cookie de sesión del cliente
      res.clearCookie("connect.id");
      res.clearCookie("sessionId");
      res.status(200).json("Sesion cerrada");
    });
  }),

  updUserCtr: eh.catchAsync(async (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    const response = await sv.userUpd(id, newData);
    res.status(200).json(response);
  }),

  changePassCtr: eh.catchAsync(async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    const response = await sv.userChangePass(id, password);
    res.status(200).json(response);
  }),
  resetPassCtr: eh.catchAsync(async (req, res) => {
    const { id } = req.body;
    const response = await sv.userResetPass(id);
    res.status(200).json(response);
  }),

  verifyPassCtr: eh.catchAsync(async (req, res) => {
    const { id, password } = req.body;
    const response = await sv.verifyPass(id, password);
    res.status(200).json(response);
  }),
  changeStateUserCtr: eh.catchAsync(async (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    const response = await sv.userUpgrade(id, newData);
    res.status(200).json(response);
  }),
  delUserCtr: eh.catchAsync(async (req, res) => {
    const { id } = req.params;
    const response = await sv.userDel(id);
    res.status(200).json(response);
  }),
  getUserController: eh.catchAsync(async (req, res) => {
    //provisiorio
    const response = await sv.getAllUsers();
    res.status(200).json(response);
  }),
  getUserByIdController: eh.catchAsync(async (req, res) => {
    const { id } = req.params;
    const response = await sv.getUsersById(id);
    res.status(200).json(response);
  }),
};
