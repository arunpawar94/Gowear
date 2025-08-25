import { Request, Response } from "express";
import Product, { IProduct } from "../models/productModel";
import cloudinary from "../config/cloudinaryConfig";
import isNaturalNumberString from "../utils/checkIsNaturalNumberString";

interface ProductFilter {
  categorie?: { $regex: RegExp };
  subCategorie?: { $regex: RegExp };
  "colors.sizes.quantity"?: { $gt: number };
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
  let { page, per_page, sub_categorie, available } = req.query;
  const errors: string[] = [];
  if (page && !isNaturalNumberString(page as string)) {
    errors.push("Invalid page no.");
  }
  if (per_page && !isNaturalNumberString(per_page as string)) {
    errors.push("Invalid per page count.");
  }
  if (errors.length > 0) {
    res.status(400).json({ message: "error", errors });
    return;
  }
  try {
    const filters: ProductFilter = {};

    if (typeof req.query.categorie === "string") {
      const categorie = req.query.categorie.toLowerCase();
      filters.categorie = { $regex: new RegExp(`^${categorie}$`, "i") };
    }

    if (typeof sub_categorie === "string") {
      const subCategorie = sub_categorie.toLowerCase();
      filters.subCategorie = { $regex: new RegExp(`^${subCategorie}$`, "i") };
    }
    if (typeof available === "string") {
      const availableCheck = available.toLowerCase();
      if (availableCheck === "true") {
        filters["colors.sizes.quantity"] = { $gt: 0 };
      } else if (availableCheck === "false") {
        let updateFilters = {
          ...filters,
          $expr: {
            $or: [
              {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: "$colors",
                        as: "color",
                        cond: { $eq: [{ $size: "$$color.sizes" }, 0] },
                      },
                    },
                  },
                  0,
                ],
              },
              {
                $eq: [
                  {
                    $size: {
                      $filter: {
                        input: {
                          $reduce: {
                            input: "$colors",
                            initialValue: [],
                            in: { $concatArrays: ["$$value", "$$this.sizes"] },
                          },
                        },
                        as: "size",
                        cond: { $gt: ["$$size.quantity", 0] },
                      },
                    },
                  },
                  0,
                ],
              },
            ],
          },
        };
      }
    }
    const productsFiltered = await Product.find(filters);
    const allProducts = await Product.find();
    let productsFilterdSliced: IProduct[];
    let currentPage = Number(page),
      perPageData = Number(per_page),
      nextPage: number | null,
      previousPage: number | null,
      totalPages: number | null;

    if (productsFiltered.length === 0) {
      productsFilterdSliced = [];
      currentPage = 1;
      nextPage = null;
      previousPage = null;
      totalPages = 1;
    } else {
      if (!page) {
        currentPage = 1;
      }
      if (!per_page) {
        perPageData = productsFiltered.length;
      }
      const startingIndex = (currentPage - 1) * perPageData;
      const lastIndexPlusOne = currentPage * perPageData;
      productsFilterdSliced = productsFiltered.slice(
        startingIndex,
        lastIndexPlusOne
      );
      totalPages = Math.ceil(productsFiltered.length / perPageData);
      nextPage = currentPage === totalPages ? null : currentPage + 1;
      previousPage = currentPage === 1 ? null : currentPage - 1;
      if (currentPage > totalPages) {
        nextPage = null;
        previousPage = totalPages;
      }
    }

    const metadata = {
      currentPage,
      nextPage,
      previousPage,
      totalPages,
      count: productsFiltered.length,
      total_count: allProducts.length,
    };
    res
      .status(200)
      .json({ message: "success", data: productsFilterdSliced, metadata });
  } catch (error) {
    res.status(400).json({ message: "error", error: error });
  }
};