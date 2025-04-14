import { body } from "express-validator";
import { Request, Response, NextFunction } from "express";

interface Color {
  name: string;
  coverImage: string;
  images: string[];
  quantity: number;
}

interface Size {
  name: string;
  colors: Color[];
}

export const productValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("categorie").isIn(["men", "women"]).withMessage("Invalid category"),
  body("subCategorie")
    .isIn(["topwear", "bottomwear"])
    .withMessage("Invalid sub-category"),
  body("price").isNumeric().withMessage("Price must be a number"),

  body("sizes").custom((value: string) => {
    let sizes: Size[];

    try {
      sizes = JSON.parse(value);
    } catch {
      throw new Error("Invalid JSON in sizes");
    }

    if (!Array.isArray(sizes) || sizes.length === 0) {
      throw new Error("At least one size is required.");
    }

    sizes.forEach((size, sizeIdx) => {
      if (!size.name) {
        throw new Error(`Size name is required.`);
      }

      if (!Array.isArray(size.colors) || size.colors.length === 0) {
        throw new Error(`At least one color is required.`);
      }

      size.colors.forEach((color, colorIdx) => {
        if (!color.name) {
          throw new Error(`Color name is required`);
        }
        if (!Array.isArray(color.images) || color.images.length === 0) {
          throw new Error(
            `Size[${sizeIdx}].Color[${colorIdx}]: at least one image is required`
          );
        }
        if (typeof color.quantity !== "number") {
          throw new Error(
            `Size[${sizeIdx}].Color[${colorIdx}]: quantity must be a number`
          );
        }
      });
    });

    return true;
  }),
];

export const validateImageFiles = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sizesRaw = req.body.sizes;
  let sizes;

  try {
    sizes = JSON.parse(sizesRaw);
  } catch {
    res.status(400).json({ message: "Invalid JSON for sizes" });
    return;
  }

  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) {
    res.status(400).json({ message: "No images uploaded" });
    return;
  }

  for (let s = 0; s < sizes.length; s++) {
    for (let c = 0; c < sizes[s].colors.length; c++) {
      const colorPath = `sizes[${s}][colors][${c}]`;

      const imageFiles = files.filter((f) =>
        f.fieldname.startsWith(`${colorPath}[images][`)
      );

      if (imageFiles.length === 0) {
        res.status(400).json({ message: `Missing images[] for ${colorPath}` });
        return;
      }
    }
  }

  next();
};
