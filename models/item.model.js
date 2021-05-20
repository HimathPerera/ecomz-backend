const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  creator: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Items", itemSchema);
