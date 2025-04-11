import mongoose from "mongoose"
const Schema = mongoose.Schema;

// Create the lake schema
const buoySchema = new Schema({
    departmentName: {
        type: String,
        required: true,
        trim: true
    },
    lakeName: {
        type: String,
        required: true,
        trim: true
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true
    }
});

// Create and export the Lake model
export default mongoose.models.buoy || mongoose.model('buoy', buoySchema);