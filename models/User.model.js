const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema (
  {
    name: {
      type: String,
      required: [true, "User name is required."],
      trim: true,
      unique:true
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required."],
    },

    // relation fields for collections
    cardCollection: {
      type: [Number],
      default: [],
    },

  favouriteDeckCollection: [
      {
        type: Schema.Types.ObjectId,
        ref: "Deck"
      }
    ]
  },
  {
    timestamps: true,
  },

  /*aftermvp/bonus!!!!:

{  coins: {
  type: Number,
  default: 0
},
lp: {
  type: Number,
  default: 0
}
 } */
);

const User = mongoose.model("User", userSchema);

module.exports = User;
