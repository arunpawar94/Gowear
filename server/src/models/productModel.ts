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
      images: string[];
      name: string;
      quantity: number;
    }[];
  };
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
    sizes: {
      type: [
        {
          name: { type: String, required: [true, "Size name is required."] },
          colors: {
            type: [
              {
                name: {
                  type: String,
                  required: [true, "Color name is required."],
                },
                images: {
                  type: [
                    { imgUrl: { type: String }, publicId: { type: String } },
                  ],
                  validate: {
                    validator: (val: string[]) => val.length > 0,
                    message: "At least one image is required in colors",
                  },
                },
                quantity: {
                  type: Number,
                  required: [true, "Color name is required."],
                },
              },
            ],
            validate: {
              validator: (val: any[]) => val.length > 0,
              message: "At least one color is required in each size",
            },
          },
        },
      ],
      required: true,
      validate: {
        validator: function (v: any[]) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "At least one size is required.",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);
