
import itineraryService from "../services/itenary.services.js";

class ItineraryController{

    async travelPlan(req,res,next){
        let travelPlan = await itineraryService.travelPlan(req);
        res.status(200).json(travelPlan);
    }

    async getAllItinerary(req,res,next){
        let alltravelPlan = await itineraryService.getAllItinerary();
        res.status(200).json(alltravelPlan);
    }

}

export default new ItineraryController();
