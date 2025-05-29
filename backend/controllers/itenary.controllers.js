import itineraryService from "../services/itenary.services.js";
import expressAsyncHandler from "express-async-handler";

export const GeminiTravelPlan = expressAsyncHandler(async (req, res) => {
  console.log("djhf",req.body);
  console.log(req.userId);
  const travelPlan = await itineraryService.GeminiTravelPlan(req);
  res.status(200).json(travelPlan);
});

export const travelPlan = expressAsyncHandler(async (req, res) => {
  const travelPlan = await itineraryService.travelPlan(req);
  res.status(200).json(travelPlan);
});

export const getAllItinerary = expressAsyncHandler(async (req, res) => {
  
  const alltravelPlan = await itineraryService.getAllItinerary(req);
  res.status(200).json(alltravelPlan);
});

export const deleteItinerary = expressAsyncHandler(async (req, res) => {
  await itineraryService.deleteItinerary(req.params.id);
  res.sendStatus(204);
});

export const getAutoComplete = expressAsyncHandler(async (req, res) => {
  const autocomplete = await itineraryService.getAutocomplete(req);
  if (!autocomplete) {
    res.status(404).json({ message: "No data Found" });
    return;
  }
  res.status(200).json(autocomplete);
});
export const getItineraryById = expressAsyncHandler(async (req, res) => {
    console.log("kdhjh", req.body);
    console.log(req.body)
    const itinerary = await itineraryService.getItineraryById(req.params.id);
    if (!itinerary) {
        return res.status(404).json({ message: "No data found" });
    }
    res.status(200).json(itinerary);
});
