import express from "express";
import OpenAI from "openai";

let router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { travelType, location, startDate, endDate, budget } = req.body;
    
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const response = await client.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages: [
        {
          role: "user",
          content: `Create a travel itenary for travel type ${travelType} for the location ${location} from date (${startDate} to date ${endDate},and budget of  $${budget}). Return JSON:
{
  "days": [{
    "date": "YYYY-MM-DD",
    "plan": ["activity/place 1", "activity/place 2"],
    "cost": 0,
    "tip": "daily tip"
  }],
  "total": {
    "stay": 0,
    "food": 0,
    "travel": 0
  },
  "tips": ["general tip 1", "general tip 2"]
}`
        },
      ],
    });

    if (!response || !response.choices || response.choices.length === 0) {
      let err = new Error("No response from OpenAI");
      err.statusCode = 500;
      return next(err);
    }
    let content = response.choices[0].message.content;
      content = content.replace(/```json\n/g, '').replace(/```/g, '').trim();

      const jsonData = JSON.parse(content);

    res.status(200).json({
      message: "Success",
      data: jsonData,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
