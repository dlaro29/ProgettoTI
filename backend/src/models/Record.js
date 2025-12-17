const mongoose = require("mongoose");

const TrackSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    duration: { type: String }, // es: "3:45"
    position: { type: String }  // es: "A1", "A2", "B1"
  },
  { _id: false }
);

const RecordSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  year: { type: Number },
  genre: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  imageUrl: { type: String },
  description: { type: String },
  tracks: {
    type: [String],
    default: []
  }

});

module.exports = mongoose.model("Record", RecordSchema);
