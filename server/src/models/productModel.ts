import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  categorie: "men" | "women";
  subCategorie: "topwear" | "bottomwear";
  price: number;
  mrp: number;
  discount: number;
  sizes: {
    name: string;
    colors: {
      coverImage: string;
      images: string[];
      name: string;
      quantity: number;
    }[];
  };
}

const productSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  categorie: {
    type: String,
    required: true,
    enum: ["men", "women"],
  },
  subCategorie: {
    type: String,
    required: true,
    enum: ["topwear", "bottomwear"],
  },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  discount: { type: Number, required: true },
  images: [{ type: String }],
  sizes: {
    type: [
      {
        name: { type: String, required: true },
        colors: {
          type: [
            {
              name: { type: String, required: true },
              coverImage: { type: String, required: true },
              images: [{ type: String }],
              quantity: { type: Number, required: true },
            },
          ],
        },
      },
    ],
  },
});

export default mongoose.model<IProduct>("Product", productSchema);
