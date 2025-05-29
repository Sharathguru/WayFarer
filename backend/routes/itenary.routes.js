import express from 'express';
import {
  travelPlan,
  getAllItinerary,
  GeminiTravelPlan,
  deleteItinerary,
  getAutoComplete,
  getItineraryById
} from '../controllers/itenary.controllers.js';
import validateSchema from '../middlewares/validate.js';
import itinerarySchema from '../validators/itenary.validator.js';
import auth from '../middlewares/auth.js';

const itineraryRouter = express.Router();

itineraryRouter.post("/", validateSchema(itinerarySchema), travelPlan);
itineraryRouter.get("/", getAllItinerary);
itineraryRouter.post("/gemini",auth, GeminiTravelPlan);
itineraryRouter.delete("/:id", auth, deleteItinerary);
itineraryRouter.get("/autocomplete", getAutoComplete);
itineraryRouter.get('/:id', auth, getItineraryById);

export default itineraryRouter;