import itineraryModel from "../models/itenary.model.js";
import { jsonrepair } from "jsonrepair";
import axios from "axios";
import userModel from "../models/user.model.js";
import Gemini from "gemini-ai";

class ItineraryService {
  async GeminiTravelPlan(req) {

   
    const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
    console.log(UNSPLASH_ACCESS_KEY)
    const { travelType, location, startDate, endDate, budget } = req.body;

    // Optionally limit itinerary creation for free users
    // const user = await userModel.findById(req.userId);
    // if (!user.isSubscribed && user.itenaryCount >= 2) {
    //   const err = new Error("You have reached the limit of 2 itineraries. Please subscribe to create more.");
    //   err.statusCode = 403;
    //   throw err;
    // }

    console.log(req.body)
    const gemini = new Gemini(process.env.KEY_OPENAI);
    const prompt = `Create a travel itinerary for travel type "${travelType}" in "${location}" from "${startDate}" to "${endDate}" with a budget of $${budget}.
Return ONLY valid JSON. ONLY one single JSON object like:
{
  "days": [
    {
      "date": "YYYY-MM-DD",
       "plan": ["place 1", "place 2"],
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
}`;

    const response = await gemini.ask(prompt);
    if (!response) throw new Error("No response from Gemini");

    let itineraryJson;
    try {
      itineraryJson = JSON.parse(response);
    } catch (err) {
      itineraryJson = JSON.parse(jsonrepair(response));
    }

    console.log("Itenary ",itineraryJson);

    // Generate images using Unsplash for each place in the plan
     // Generate images using Unsplash for each place in the plan
    for (const day of itineraryJson.days) {
      day.planDetails = await Promise.all(
        day.plan.map(async (placeName) => {
          try {
            const unsplashRes = await axios.get(
              `https://api.unsplash.com/search/photos`,
              {
                params: {
                  client_id: UNSPLASH_ACCESS_KEY,
                  query: placeName,
                  per_page: 1,
                },
              }
            );
            console.log("Unsplash result for", placeName, unsplashRes.data); // <-- Add this line
            const imageUrl =
              unsplashRes.data.results.length > 0
                ? unsplashRes.data.results[0].urls.small
                : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
            return {
              photoUrl: imageUrl,
              placeName,
            };
          } catch (err) {
            console.error("Unsplash error for", placeName, err.message);
            return {
              photoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg",
              placeName,
            };
          }
        })
      );
    }

    const payload = {
      ...req.body,
      itinerary: itineraryJson,
    };

    await this.saveItinerary(payload);
    await userModel.findByIdAndUpdate(req.userId, {
      $inc: { itenaryCount: 1 },
    });

    return { message: "Success", data: itineraryJson };
  }

  async saveItinerary(payload) {
    const saved = await itineraryModel.create(payload);
    if (!saved) {
      const err = new Error("Unable to save itinerary");
      err.statusCode = 400;
      throw err;
    }
    return "saved";
  }

  async getItineraryById(id) {
    const itinerary = await itineraryModel.findById(id);
    if (!itinerary) {
      const err = new Error("Travel Plan not found");
      err.statusCode = 404;
      throw err;
    }
    return itinerary;
  }

  async getAllItinerary() {
    const itineraries = await itineraryModel.find();
    if (!itineraries || itineraries.length === 0) {
      throw new Error("No itineraries found.");
    }
    return itineraries;
  }

  async deleteItinerary(id) {
    const deleted = await itineraryModel.findByIdAndDelete(id);
    if (!deleted) {
      const err = new Error("Travel Plan not found");
      err.statusCode = 404;
      throw err;
    }
    return deleted;
  }

  async getAutocomplete(req) {
    const { location } = req.query;
    if (!location) {
      throw new Error("Missing location query parameter");
    }
    try {
      const res = await axios.get(
        "https://maps.googleapis.com/maps/api/place/autocomplete/json",
        {
          params: {
            input: location,
            key: process.env.GOOGLE_MAPS_API_KEY,
          },
        }
      );
      if (res.data.status !== "OK") {
        console.error("Google Maps API error:", res.data.status, res.data.error_message);
        throw new Error(res.data.error_message || "Google Maps API error");
      }
      return res.data.predictions.map((p) => p.description);
    } catch (err) {
      console.error("Autocomplete error:", err.message);
      throw new Error("Failed to fetch autocomplete suggestions");
    }
  }

  // --- Google Maps Place Details API ---
  async getPlaceDetails(placeId) {
    const res = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      {
        params: {
          place_id: placeId,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );
    return res.data.result; // Contains details like geometry, address, etc.
  }
}

export default new ItineraryService();




// import itineraryModel from "../models/itenary.model.js";
// import { jsonrepair } from "jsonrepair";
// import axios from "axios";
// import userModel from "../models/user.model.js";
// import Gemini from "gemini-ai";

// class ItineraryService {
//   async GeminiTravelPlan(req) {
//     const { travelType, location, startDate, endDate, budget } = req.body;

//     // const user = await userModel.findById(req.userId);
//     // if (!user.isSubscribed && user.itenaryCount >= 2) {
//     //   const err = new Error("You have reached the limit of 2 itineraries. Please subscribe to create more.");
//     //   err.statusCode = 403;
//     //   throw err;
//     // }

//     const gemini = new Gemini(process.env.KEY_OPENAI);
//     const prompt = `Create a travel itinerary for travel type "${travelType}" in "${location}" from "${startDate}" to "${endDate}" with a budget of $${budget}.
// Return ONLY valid JSON. NO markdown. NO explanation. NO comments. ONLY one single JSON object like:
// {
//   "days": [
//     {
//       "date": "YYYY-MM-DD",
//       "plan": ["activity/place 1", "activity/place 2"],
//       "cost": 0,
//       "tip": "daily tip"
//     }
//   ],
//   "total": {
//     "stay": 0,
//     "food": 0,
//     "travel": 0
//   },
//   "tips": ["general tip 1", "general tip 2"]
// }`;

//     const response = await gemini.ask(prompt);
//     if (!response) throw new Error("No response from Gemini");

//     let itineraryJson;
//     try {
//       itineraryJson = JSON.parse(response);
//     } catch (err) {
//       itineraryJson = JSON.parse(jsonrepair(response));
//     }

//     // Generate images using Google Custom Search API for each place in the plan
//     for (const day of itineraryJson.days) {
//       day.planDetails = await Promise.all(
//         day.plan.map(async (placeName) => {
//           try {
//             const googleRes = await axios.get(
//               "https://www.googleapis.com/customsearch/v1",
//               {
//                 params: {
//                   key: process.env.IMAGE_GOOGLE,
//                   cx: process.env.CX,
//                   q: placeName,
//                   searchType: "image",
//                   num: 1,
//                 },
//               }
//             );
//             const imageUrl =
//               googleRes.data.items && googleRes.data.items.length > 0
//                 ? googleRes.data.items[0].link
//                 : "https://via.placeholder.com/512x512?text=No+Image";

//             return {
//               photoUrl: imageUrl,
//               placeName,
//             };
//           } catch (err) {
//             console.error(
//               `Error fetching image from Google for "${placeName}":`,
//               err.message
//             );
//             return {
//               photoUrl: "https://via.placeholder.com/512x512?text=No+Image",
//               placeName,
//             };
//           }
//         })
//       );
//     }

//     const payload = {
//       ...req.body,
//       itinerary: itineraryJson,
//     };

//     await this.saveItinerary(payload);
//     await userModel.findByIdAndUpdate(req.userId, {
//       $inc: { itenaryCount: 1 },
//     });

//     return { message: "Success", data: itineraryJson };
//   }

//   async saveItinerary(payload) {
//     const saved = await itineraryModel.create(payload);
//     if (!saved) {
//       const err = new Error("Unable to save itinerary");
//       err.statusCode = 400;
//       throw err;
//     }
//     return "saved";
//   }

//   async getItineraryById(id) {
//     const itinerary = await itineraryModel.findById(id);
//     if (!itinerary) {
//       const err = new Error("Travel Plan not found");
//       err.statusCode = 404;
//       throw err;
//     }
//     return itinerary;
//   }

//   async getAllItinerary() {
//     const itineraries = await itineraryModel.find();
//     if (!itineraries || itineraries.length === 0) {
//       throw new Error("No itineraries found.");
//     }
//     return itineraries;
//   }

//   async deleteItinerary(id) {
//     const deleted = await itineraryModel.findByIdAndDelete(id);
//     if (!deleted) {
//       const err = new Error("Travel Plan not found");
//       err.statusCode = 404;
//       throw err;
//     }
//     return deleted;
//   }

//   async getAutocomplete(req) {
//     const { location } = req.query;
//     if (!location) {
//       throw new Error("Missing location query parameter");
//     }
//     try {
//       const res = await axios.get(
//         "https://maps.googleapis.com/maps/api/place/autocomplete/json",
//         {
//           params: {
//             input: location,
//             key: process.env.GOOGLE_MAPS_API_KEY,
//           },
//         }
//       );
//       if (res.data.status !== "OK") {
//         console.error(
//           "Google Maps API error:",
//           res.data.status,
//           res.data.error_message
//         );
//         throw new Error(res.data.error_message || "Google Maps API error");
//       }
//       return res.data.predictions.map((p) => p.description);
//     } catch (err) {
//       console.error("Autocomplete error:", err.message);
//       throw new Error("Failed to fetch autocomplete suggestions");
//     }
//   }

//   // --- Google Maps Place Details API ---
//   async getPlaceDetails(placeId) {
//     const res = await axios.get(
//       "https://maps.googleapis.com/maps/api/place/details/json",
//       {
//         params: {
//           place_id: placeId,
//           key: process.env.GOOGLE_MAPS_API_KEY,
//         },
//       }
//     );
//     return res.data.result; // Contains details like geometry, address, etc.
//   }
// }

// export default new ItineraryService();

