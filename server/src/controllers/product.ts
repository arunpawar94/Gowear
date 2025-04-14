import { Request, Response } from "express";
import Product from "../models/productModel";
import cloudinary from "../config/cloudinaryConfig";

export const addProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const files = req.files as Express.Multer.File[] | undefined;
  const uploadedImages = (files ?? []).map((file) => ({
    url: (file as any).path,
    public_id: (file as any).filename,
    fieldname: file.fieldname,
  }));

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
    } = req.body;
    let sizesData = [];
    if (sizes) {
      sizesData = JSON.parse(sizes);
    }
    uploadedImages.forEach((img) => {
      const match = img.fieldname.match(
        /sizes\[(\d+)\]\[colors\]\[(\d+)\]\[(images|coverImage)\](?:\[(\d+)\])?/
      );
      if (!match) return;

      const [_, sizeIdx, colorIdx, type, imageIdx] = match;

      if (type === "coverImage") {
        sizesData[sizeIdx].colors[colorIdx].coverImage = img.url;
      } else if (type === "images") {
        sizesData[sizeIdx].colors[colorIdx].images =
          sizesData[sizeIdx].colors[colorIdx].images || [];
        sizesData[sizeIdx].colors[colorIdx].images[imageIdx] = img.url;
      }
    });

    const newProduct = new Product({
      name,
      description,
      categorie,
      subCategorie,
      price,
      mrp,
      discount,
      sizes: sizesData,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (errors: any) {
    for (const img of uploadedImages) {
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
        .json({ message: "Addition of product is failed", error: errorArray });
    } else {
      res
        .status(400)
        .json({ message: "Addition of product is failed", errors });
    }
  }
};
