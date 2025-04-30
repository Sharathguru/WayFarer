import express from 'express';
import itineraryController from '../controllers/itenary.controllers.js';
import validateSchema from '../middlewares/validate.js';
import itinerarySchema from '../validators/itenary.validator.js';

const itineraryRouter = express.Router();

itineraryRouter.post("/",validateSchema(itinerarySchema),itineraryController.travelPlan);
itineraryRouter.get("/",itineraryController.getAllItinerary);

export default itineraryRouter;