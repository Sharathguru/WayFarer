import openAi from 'openai';
import itineraryModel from '../models/itenary.model.js';
import { jsonrepair } from 'jsonrepair'; // For repairing broken JSON
import axios from 'axios'
import Gemini from "gemini-ai";
import userModel from '../models/user.model.js'

class ItineraryService {

    async GeminiTravelPlan(req)
    {   
        const { travelType, from ,to , startDate, endDate, budget } = req.body;
        console.log(req.userId);
        
        let user=await userModel.findById(req.userId)
        console.log("sfdsdf",user)
        if(!user.isSubscribed && user.itenaryCount>=2){
                let err = new Error("You have reached the limit of 2 itineraries. Please subscribe to create more itineraries.");
                err.statusCode = 403;
                throw err;
            }

        const gemini = new Gemini(process.env.KEY_OPENAI);
        const content = `Create a travel itinerary for travel type "${travelType}" in "${from}" from " and "${to}" to${startDate}" to "${endDate}" with a budget of $${budget}.
Return ONLY valid JSON. NO markdown. NO explanation. NO comments. ONLY one single JSON object like:
{
  "days": [
    {
      "date": "YYYY-MM-DD",
      "plan": ["activity/place 1", "activity/place 2"],
      "cost": 0,
      "tip": "daily tip"
    }
  ],
  "total": {
    "stay": 0,
    "food": 0,
    "travel": 0
  },
  "tips": ["general tip 1", "general tip 2"]
}`
      
        const response = await gemini.ask(content);
            
        let jsonData;
        if(response){
            try {
                jsonData = JSON.parse(response);
            } catch(error){
                jsonData = JSON.parse(jsonrepair(response));
            }

            let payload = req.body;
            payload.itinerary = jsonData;
            await this.saveItinerary(payload);
             await userModel.findByIdAndUpdate(req.userId, { $inc: { itenaryCount: 1 } });

            return { message: "Success", data: jsonData };
        } else {
            return { message: "Failure", data: "No Response from AI" };
        }
        
    }

    async travelPlan(req) {
        console.log("📦 Incoming Request Body:", req.body);
        try {
            const { travelType, location, startDate, endDate, budget } = req.body;

            const client = new openAi({
                apiKey: process.env.KEY_OPENAI,
                baseURL: "https://openrouter.ai/api/v1",
            });

            // 🔥 Strict prompt to avoid invalid formats
            const response = await client.chat.completions.create({
                model: "deepseek/deepseek-r1:free",
                messages: [
                    {
                        role: "user",
                        content: `Create a travel itinerary for travel type "${travelType}" in "${location}" from "${startDate}" to "${endDate}" with a budget of $${budget}.
Return ONLY valid JSON. NO markdown. NO explanation. NO comments. ONLY one single JSON object like:
{
  "days": [
    {
      "date": "YYYY-MM-DD",
      "plan": ["activity/place 1", "activity/place 2"],
      "cost": 0,
      "tip": "daily tip"
    }
  ],
  "total": {
    "stay": 0,
    "food": 0,
    "travel": 0
  },
  "tips": ["general tip 1", "general tip 2"]
}`
                    }
                ]
            });

            if (!response || !response.choices || response.choices.length === 0) {
                throw new Error("No response from OpenAI");
            }

            let content = response.choices[0].message.content;
            console.log("🧾 Raw AI Response:\n", content);

            // 🧼 Strip markdown if present
            // if (content.startsWith("```json") || content.startsWith("```")) {
            //     content = content.replace(/```json|```/g, "").trim();
            // }

            let jsonData;
            try {
                jsonData = JSON.parse(content);
            } catch (err) {
                console.warn("❌ JSON.parse failed, attempting jsonrepair...");
                try {
                    console.log(jsonData);
                    
                    jsonData = JSON.parse(jsonrepair(content));
                } catch (repairError) {
                    console.error("🛠️ jsonrepair failed:", repairError.message);
                    throw new Error("Invalid JSON format in AI response.");
                }
            }

            // ✅ Save the itinerary
            let payload = req.body;
            payload.itinerary = jsonData;
            await this.saveItinerary(payload);

            return { message: "Success", data: jsonData };

        } catch (error) {
            console.error("❌ Error in travelPlan:", error.message);
            throw error;
        }
    }
    
    async saveItinerary(payload) {
        const newTravelPlan = await itineraryModel.create(payload);
        if (newTravelPlan) {
            return "saved";
        } else {
            const error = new Error("Unable to save itinerary");
            error.statusCode = 400;
            throw error;
        }
    }

    async getAllItinerary(req) {
        const allTravelPlans = await itineraryModel.find();
        if (allTravelPlans) {
            return allTravelPlans;
        } else {
            const err = new Error("Travel Plans not found");
            err.statusCode = 404;
            throw err;
        }
    }

    async deleteItinerary(id) {
        const deletedTravelPlan = await itineraryModel.findByIdAndDelete(id);
        if (deletedTravelPlan) {
            return deletedTravelPlan;
        } else {
            const err = new Error("Travel Plan not found");
            err.statusCode = 404;
            throw err;
        }
    }


    async getAutocomplete(req) {
        let { location } = req.query;
         
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
       params: {
         input: location,
         key: process.env.GOOGLE_API,
       },
     });

    //  console.log(response.data);
    //  console.log(response.data.predictions);
     return response.data.predictions.map((prediction) => prediction.description);
    // return response.data;
     }
async getItineraryById(id) {
        let itinerary = await itineraryModel.findById(id);
        if (itinerary) {
            return itinerary;
        } else {
            let err = new Error("Travel Plans not found");
            err.statusCode = 404;
            throw err;
        }
    }
}

export default new ItineraryService();
