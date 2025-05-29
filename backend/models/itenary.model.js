import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema({
    travelType: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    budget: {
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
                return value > 0;
            },
            message: "Budget must be a positive number"
        }
    },
    image:{
        type:String,
        default:"https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=170667a&w=0&k=20&c=LPUo_WZjbXXNnF6ok4uQr8I_Zj6WUVnH_FpREg21qaY="
    },
    itinerary: {
        type: Object,
        required: true
    }
},{timestamps: true})


itinerarySchema.pre('save', function(next) {
    const currentDate = new Date();
    if (this.startDate <= currentDate) {
        const err = new Error('Start date must be in the future');
        next(err);
    }
    next();
});


const Itinerary = mongoose.model("Itinerary", itinerarySchema);



export default Itinerary;