import itineraryService from "../services/itenary.services.js";
import expressAsyncHandler from "express-async-handler";

// Gemini-based itinerary
export const GeminiTravelPlan = expressAsyncHandler(async (req, res) => {
  const travelPlan = await itineraryService.GeminiTravelPlan(req);
  res.status(200).json(travelPlan);
});

// Save itinerary (via OpenAI or manual input)
export const travelPlan = expressAsyncHandler(async (req, res) => {
  const travelPlan = await itineraryService.saveItinerary(req.body);
  res.status(200).json({ message: "Itinerary saved", data: travelPlan });
});

// Fetch all itineraries
export const getAllItinerary = expressAsyncHandler(async (req, res) => {
  const alltravelPlan = await itineraryService.getAllItinerary(req);
  res.status(200).json(alltravelPlan);
});

// Delete itinerary by ID
export const deleteItinerary = expressAsyncHandler(async (req, res) => {
  await itineraryService.deleteItinerary(req.params.id);
  res.sendStatus(204);
});

// Google Autocomplete
export const getAutoComplete = expressAsyncHandler(async (req, res) => {
  const autocomplete = await itineraryService.getAutocomplete(req);
  if (!autocomplete || autocomplete.length === 0) {
    return res.status(404).json({ message: "No data Found" });
  }
  res.status(200).json(autocomplete);
});

// Get itinerary by ID
export const getItineraryById = expressAsyncHandler(async (req, res) => {
  const itinerary = await itineraryService.getItineraryById(req.params.id);
  res.status(200).json(itinerary);
});
