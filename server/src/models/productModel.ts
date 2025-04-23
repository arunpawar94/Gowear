import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  categorie: "men" | "women";
  subCategorie: "topwear" | "bottomwear";
  price: number;
  mrp: number;
  discount: number;
  colors: {
    images: string[];
    name: string;
    sizes: { name: string; quantity: number }[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema: Schema = new Schema(
  {
    name: { type: String, required: [true, "Product name is required."] },
    description: {
      type: String,
      required: [true, "Product description is required."],
    },
    categorie: {
      type: String,
      required: [true, "Categorie is required."],
      enum: {
        values: ["men", "women"],
        message: "Categorie must be either 'men' or 'women'.",
      },
    },
    subCategorie: {
      type: String,
      required: [true, "SubCategorie is required."],
      enum: {
        values: ["topwear", "bottomwear"],
        message: "SubCategorie must be either 'topwear' or 'bottomwear'.",
      },
    },
    price: { type: Number, required: [true, "Price is required."] },
    mrp: { type: Number, required: [true, "MRP is required."] },
    discount: { type: Number, required: [true, "Discount is required."] },
    colors: {
      type: [
        {
          name: {
            type: String,
            required: [true, "Color name is required."],
          },
          images: {
            type: [{ imgUrl: { type: String }, publicId: { type: String } }],
            validate: {
              validator: (val: any[]) => val.length > 0,
              message: "At least one image is required in colors",
            },
          },
          sizes: {
            type: [{ name: { type: String }, quantity: { type: Number } }],
            required: [true, "Size is required."],
            validate: {
              validator: (val: any[]) => val.length > 0,
              message: "At least one size is required in colors",
            },
          },
        },
      ],
      required: true,
      validate: {
        validator: (val: any[]) => val.length > 0,
        message: "At least one color is required.",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);
