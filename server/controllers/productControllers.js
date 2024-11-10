import eh from "../utils/errorHandlers.js";
import serv from "../services/productServices.js";

export default {
  createController: eh.catchAsync(async (req, res) => {
    const { title, landing, info_header, info_body, items } = req.body;
    const response = await serv.createProduct(
      title,
      landing,
      info_header,
      info_body,
      items
    );
    res.status(201).json(response);
  }),

  createItemController: eh.catchAsync(async (req, res) => {
    const { img, text, id } = req.body;
    const response = await serv.addNewItem(img, text, id);
    res.status(201).json(response);
  }),

  delController: eh.catchAsync(async (req, res) => {
    const { id } = req.params;
    const response = await serv.delProduct(id);
    res.status(200).json(response);
  }),

  delItemController: eh.catchAsync(async (req, res) => {
    const { id } = req.params;
    const response = await serv.delItem(id);
    res.status(200).json(response);
  }),

  updController: eh.catchAsync(async (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    const response = await serv.updProduct(id, newData);
    res.status(200).json(response);
  }),

  detailUpdController: eh.catchAsync(async (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    const response = await serv.updItem(id, newData);
    res.status(200).json(response);
  }),

  getProductHand: eh.catchAsync(async (req, res) => {
    const response = await serv.getProduct();
    if (response.cache === true) {
      res.status(203).json(response.products);
    } else {
      res.status(200).json(response.products);
    }
  }),

  getProductById: eh.catchAsync(async (req, res) => {
    const { id } = req.params;
    const response = await serv.getById(id);
    res.status(200).json(response);
  }),

  getItemById: eh.catchAsync(async (req, res) => {
    const { id } = req.params;
    const response = await serv.getDetail(id);
    res.status(200).json(response);
  }),
};
