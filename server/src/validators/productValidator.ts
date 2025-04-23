import { body } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

interface SizeItem {
  name: string;
  quantity: number;
}

interface Color {
  name: string;
  images: string[];
  sizes: SizeItem[];
}

export const productValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("categorie").isIn(["men", "women"]).withMessage("Invalid category"),
  body("subCategorie")
    .isIn(["topwear", "bottomwear"])
    .withMessage("Invalid sub-category"),
  body("price").notEmpty().withMessage("Price is required"),
  body("mrp").notEmpty().withMessage("MRP is required"),
  body("discount").notEmpty().withMessage("Discount is required"),

  body("colors").custom((value: string) => {
    let colors: Color[];
    const errors: string[] = [];
    try {
      colors = JSON.parse(value);
    } catch {
      throw new Error("Invalid JSON in colors");
    }
    if (!Array.isArray(colors) || colors.length === 0) {
      errors.push(`At least one color is required.`);
    } else {
      colors.forEach((colorItem, colorIndex) => {
        if (!colorItem.name) {
          errors.push(`Color name is required for S.no. ${colorIndex + 1}`);
        }

        if (!Array.isArray(colorItem.images) || colorItem.images.length === 0) {
          errors.push(
            `At least one image is required for color S.no: '${colorIndex + 1}'`
          );
        }

        if (!Array.isArray(colorItem.sizes) || colorItem.sizes.length === 0) {
          errors.push(
            `At least one size is required for color S.no: '${colorIndex + 1}'`
          );
        } else {
          colorItem.sizes.forEach((sizeItem) => {
            if (sizeItem.quantity === 0 || sizeItem.quantity) {
              if (sizeItem.quantity <= 0) {
                errors.push(
                  `Quantity must be greater than zero for color: '${colorItem.name}' for size: '${colorItem.name}'`
                );
              }

              if (typeof sizeItem.quantity !== "number") {
                errors.push(
                  `Quantity must be a number for color: '${colorItem.name}' for size: '${sizeItem.name}'`
                );
              }
            } else {
              errors.push(
                `Quantity is required for color: '${colorItem.name}' for size: '${sizeItem.name}'`
              );
            }
          });
        }
      });
    }

    if (errors.length > 0) {
      throw errors;
    }

    return true;
  }),
];

const uploadToCloudinary = (file: Express.Multer.File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "productImages",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ ...result, fieldname: file.fieldname });
      }
    );

    Readable.from(file.buffer).pipe(stream);
  });
};

export const validateImageFiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const colorsRaw = req.body.colors;
  let colors;

  try {
    colors = JSON.parse(colorsRaw);
  } catch {
    res.status(400).json({ message: "Error", error: "Invalid JSON for sizes" });
    return;
  }

  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) {
    res.status(400).json({ message: "Error", error: "No images uploaded" });
    return;
  }

  try {
    const uploadedImages = await Promise.all(
      files.map((file: Express.Multer.File) => uploadToCloudinary(file))
    );
    req.body.uploadedImages = uploadedImages;
    for (let c = 0; c < colors.length; c++) {
      const colorPath = `colors[${c}]`;

      const imageFiles = uploadedImages.filter((uploadImageItem) => {
        const fieldMatch = colors[c].images.some(
          (_imageItem: string, imageIndex: number) =>
            uploadImageItem.fieldname === `${colorPath}[images][${imageIndex}]`
        );
        return fieldMatch;
      });

      if (imageFiles.length === 0) {
        res.status(400).json({
          message: "Error",
          error: `Missing images for ${colorPath}`,
          uploaded: req.body.uploadedImages,
        });
        return;
      }
      colors[c].images = imageFiles.map((img) => ({
        imgUrl: img.secure_url,
        publicId: img.public_id,
      }));
    }
  } catch (error) {
    res.status(500).json({ message: "Error", errors: "Image upload failed" });
  }
  req.body.colors = JSON.stringify(colors);
  next();
};
