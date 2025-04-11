import { json, Request, Response } from "express";
import Product from "../models/productModel";
import cloudinary from "../config/cloudinaryConfig";

export const addProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const files = req.files as Express.Multer.File[] | undefined;
  const uploadedImages = (files ?? []).map((file) => ({
    url: (file as any).path,
    public_id: (file as any).filename
  }));
  try {
    const { name, description, categorie, subCategorie, price, mrp, discount, sizes } = req.body;
    const images = uploadedImages.map((img) => img.url);
    let formatSizeArray = JSON.parse(sizes);
    console.log("@@@@", formatSizeArray)

    formatSizeArray = formatSizeArray.map((item: any) => {
        const formatedColorsArray = item.colors.map((item: any) => {
            return {
                ...item,
                images: images
            }
        })
        return {
            ...item,
            colors: formatedColorsArray
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
      images,
      sizes: formatSizeArray
    });
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    for (const img of uploadedImages) {
      try {
        await cloudinary.uploader.destroy(img.public_id); // Remove image from Cloudinary
      } catch (cleanupError) {
        console.error(
          `Failed to clean up image: ${img.public_id}`,
          cleanupError
        );
      }
    }
    res.status(500).json({ message: "Error creating Product", error });
  }
};
