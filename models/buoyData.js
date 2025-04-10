import mongoose from "mongoose";

const buoyDataSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    turbidity: String,
    ph: Number,
    tds: Number,
    temperature: Number,
    humidity: Number,
    latitude: Number,
    longitude: Number,
    speed: Number,
    altitude: Number,
    satellites: Number,
    timestamp: String,
})


export default mongoose.models.buoyData || mongoose.model("buoyData", buoyDataSchema)