import { body } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

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
  body("price").notEmpty().withMessage("Price is required"),
  body("mrp").notEmpty().withMessage("MRP is required"),
  body("discount").notEmpty().withMessage("Discount is required"),

  body("sizes").custom((value: string) => {
    let sizes: Size[];
    const errors: string[] = [];
    try {
      sizes = JSON.parse(value);
    } catch {
      throw new Error("Invalid JSON in sizes");
    }

    if (!Array.isArray(sizes) || sizes.length === 0) {
      errors.push("At least one size is required.");
    } else {
      sizes.forEach((size) => {
        if (!size.name) {
          errors.push(`Size name is required.`);
        }

        if (!Array.isArray(size.colors) || size.colors.length === 0) {
          errors.push(
            `At least one color is required for size: '${size.name}'`
          );
        } else {
          size.colors.forEach((color) => {
            if (!color.name) {
              errors.push(`Color name is required for size: '${size.name}'`);
            }

            if (!Array.isArray(color.images) || color.images.length === 0) {
              errors.push(
                `At least one image is required for color: '${color.name}' for size: '${size.name}'`
              );
            }

            if (color.quantity === 0 || color.quantity) {
              if (color.quantity <= 0) {
                errors.push(
                  `Quantity must be greater than zero for color: '${color.name}' for size: '${size.name}'`
                );
              }

              if (typeof color.quantity !== "number") {
                errors.push(
                  `Quantity must be a number for color: '${color.name}' for size: '${size.name}'`
                );
              }
            } else {
              errors.push(
                `Quantity is required for color: '${color.name}' for size: '${size.name}'`
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
  const sizesRaw = req.body.sizes;
  let sizes;

  try {
    sizes = JSON.parse(sizesRaw);
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
    for (let s = 0; s < sizes.length; s++) {
      for (let c = 0; c < sizes[s].colors.length; c++) {
        const colorPath = `sizes[${s}][colors][${c}]`;

        const imageFiles = uploadedImages.filter((f, index) =>
          f.fieldname.startsWith(`${colorPath}[images][${index}]`)
        );

        if (imageFiles.length === 0) {
          res
            .status(400)
            .json({ message: "Error", error: `Missing images for ${colorPath}` });
          return;
        }
        sizes[s].colors[c].images = imageFiles.map((img) => ({
          imgUrl: img.secure_url,
          publicId: img.public_id,
        }));
      }
    }
  } catch (error) {
    res.status(500).json({message: "Error", errors: "Image upload failed" });
  }
  req.body.sizes = JSON.stringify(sizes);
  next();
};
