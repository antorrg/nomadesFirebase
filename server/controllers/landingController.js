import sv from "../services/landingService.js";
import eh from "../utils/errorHandlers.js";

export default {
  createLandingController: eh.catchAsync(async (req, res) => {
    const { title, image, info_header, description } = req.body;
    const response = await sv.createLanding(
      title,
      image,
      info_header,
      description
    );
    res.status(201).json(response);
  }),
  updLandingController: eh.catchAsync(async (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    const response = await sv.updLanding(id, newData);
    res.status(200).json(response);
  }),
  deleteLandingController: eh.catchAsync(async (req, res) => {
    const { id } = req.params;
    const response = await sv.delLanding(id);
    res.status(200).json(response);
  }),
  getLandingController: eh.catchAsync(async (req, res) => {
    const response = await sv.getOneLanding();
    res.status(200).json(response);
  }),
  detailLandingController: eh.catchAsync(async (req, res) => {
    const { id } = req.params;
    const response = await sv.getLandById(id);
    res.status(200).json(response);
  }),
};
