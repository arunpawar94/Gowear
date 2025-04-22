import { Request, Response } from "express";
import Product from "../models/productModel";
import cloudinary from "../config/cloudinaryConfig";

export const addProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      description,
      categorie,
      subCategorie,
      price,
      mrp,
      discount,
      sizes,
      uploadedImages
    } = req.body;
    let sizesData = [];
    if (sizes) {
      sizesData = JSON.parse(sizes);
    }

    const newProduct = new Product({
      name,
      description,
      categorie,
      subCategorie,
      price,
      mrp,
      discount,
      sizes: sizesData,
      uploadedImages
    });
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Success", data: newProduct });
  } catch (errors: any) {
    for (const img of req.body.uploadedImages) {
      try {
        await cloudinary.uploader.destroy(img.public_id);
      } catch (cleanupError) {
        console.error(
          `Failed to clean up image: ${img.public_id}`,
          cleanupError
        );
      }
    }
    if (errors.name === "ValidationError") {
      const UpdateError: Record<string, string> = {};
      for (const key in errors.errors) {
        UpdateError[key] = errors.errors[key].message;
      }
      let errorArray = Object.values(UpdateError);
      res
        .status(400)
        .json({ message: "Error", errors: errorArray });
    } else {
      res
        .status(400)
        .json({ message: "Error", errors });
    }
  }
};
