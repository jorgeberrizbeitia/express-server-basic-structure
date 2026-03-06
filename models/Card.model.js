const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      
    },
    set: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,

      trim: true,
    },
    faction: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    rarity: {
      type: String,
      required: true,
      trim: true,
    },
    buildCost: {
      type: Number,
      required: true,
    },
    buildSpeed: {
      type: Number,
      required: true,
    },
    fragmentRate: {
      type: Number,
      required: true,
    },
    integrity: {
      type: Number,
      required: true,
    },
    processingSpeed: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    image: {type: String,
      default:""
    }
  },
  {
    timestamps: true,
  },
);

const Card = model("Card", cardSchema);

module.exports = Card;
