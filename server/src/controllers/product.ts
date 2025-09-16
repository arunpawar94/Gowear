import { Request, Response } from "express";
import Product from "../models/productModel";
import cloudinary from "../config/cloudinaryConfig";
import isNaturalNumberString from "../utils/checkIsNaturalNumberString";
import mongoose from "mongoose";

interface ProductFilter {
  categorie?: { $regex: RegExp };
  subCategorie?: { $regex: RegExp };
  "colors.sizes.quantity"?: { $gt: number };
  price?: {
    $gt?: number;
    $gte?: number;
    $lt?: number;
    $lte?: number;
  };
}

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
      colors,
      uploadedImages,
    } = req.body;
    let colorsData = [];
    if (colors) {
      colorsData = JSON.parse(colors);
    }

    const newProduct = new Product({
      name,
      description,
      categorie,
      subCategorie,
      price,
      mrp,
      discount,
      colors: colorsData,
      uploadedImages,
    });
    await newProduct.save();
    res.status(201).json({ message: "success", data: newProduct });
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
      res.status(400).json({ message: "error", errors: errorArray });
    } else {
      res.status(400).json({ message: "error", errors });
    }
  }
};

export const getProducts = async (req: Request, res: Response) => {
  let { page, per_page, sub_categorie, min_price, max_price } = req.query;
  const errors: string[] = [];
  if (page && !isNaturalNumberString(page as string)) {
    errors.push("Invalid page no.");
  }
  if (per_page && !isNaturalNumberString(per_page as string)) {
    errors.push("Invalid per page count.");
  }
  if (min_price && !validPriceCheck(min_price as string)) {
    errors.push("Invalid minimum price.");
  }
  if (max_price && !validPriceCheck(max_price as string)) {
    errors.push("Invalid maximum price.");
  }
  if (errors.length > 0) {
    res.status(400).json({ message: "error", errors });
    return;
  }
  try {
    const pageNum = parseInt(page as string) || 1;
    const limit = parseInt(per_page as string) || 10;
    const skip = (pageNum - 1) * limit;
    const filters: ProductFilter = {};

    if (typeof req.query.categorie === "string") {
      const categorie = req.query.categorie.toLowerCase();
      filters.categorie = { $regex: new RegExp(`^${categorie}$`, "i") };
    }

    if (typeof sub_categorie === "string") {
      const subCategorie = sub_categorie.toLowerCase();
      filters.subCategorie = { $regex: new RegExp(`^${subCategorie}$`, "i") };
    }

    if (min_price || max_price) {
      const min = Number(min_price);
      const max = Number(max_price);

      if (!isNaN(min)) {
        filters.price = { $gte: min };
      }
      if (!isNaN(max)) {
        filters.price = { $lte: max };
      }
      if (!isNaN(min) && !isNaN(max)) {
        filters.price = { $gte: min, $lte: max };
      }
    }
    const productsFiltered = await Product.find(filters)
      .skip(skip)
      .limit(limit);
    const totalFilteredCount = await Product.countDocuments(filters);
    const totalCount = await Product.countDocuments();
    const metadata = {
      currentPage: pageNum,
      totalPages: Math.ceil(totalFilteredCount / limit),
      count: totalFilteredCount,
      total_count: totalCount,
    };
    res.status(200).json({
      message: "success",
      data: productsFiltered,
      metadata,
    });
  } catch (error) {
    res.status(400).json({ message: "error", error: error });
  }
};

export const getProductDetail = async (
  request: Request,
  response: Response
) => {
  const { productId, categorie, subCategorie } = request.query;
  if (!productId) {
    response
      .status(400)
      .json({ message: "error", error: "User's ID is required." });
    return;
  } else {
    if (!mongoose.Types.ObjectId.isValid(productId as string)) {
      response
        .status(400)
        .json({ message: "error", error: "Invalid product ID format." });
      return;
    }
    try {
      const getProduct = await Product.findById(productId);
      const productsSubCategorieFiltered = await Product.find({
        subCategorie,
        categorie,
      }).limit(8);
      const productsCategorieFiltered = await Product.find({ categorie }).limit(
        24
      );
      response.status(200).json({
        message: "success",
        data: {
          productDetail: getProduct,
          subCategorieProducts: productsSubCategorieFiltered,
          categorieProducts: productsCategorieFiltered,
        },
      });
    } catch (error) {
      response
        .status(400)
        .json({ message: "error", error: "Something went wrong." });
      return;
    }
  }
};

function validPriceCheck(value: string): boolean {
  const num = Number(value);
  return !isNaN(num) && num >= 0 && /^\d+(\.\d+)?$/.test(value);
}
