import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  Grid2 as Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  styled,
  Button,
  CircularProgress,
  Modal,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { errorColor, lightTextColor, primaryColor } from "../../config/colors";
import axios from "axios";
import { SnackbarProvider, useSnackbar } from "notistack";
import consfigJSON from "./config";

const base_url = process.env.REACT_APP_API_URL;

type CategorieType = "men" | "women" | null;
type SubCategorieType = "topwear" | "bottomwear" | null;

type ColorItemsArray = ColorItemInterface[];

interface ColorItemInterface {
  images: File[];
  name: string;
  sizes: { name: string; quantity: number }[];
}

type colorErrorType = {
  errorColorIndex: number | null;
  imagesErr: string;
  nameErr: string;
  sizeErr: string;
}[];

type SnackbarType = string | null;

type ErrorType = {
  productName: string;
  productMrp: string;
  productDiscount: string;
  productDesc: string;
  productCategorie: string;
  productSubCategorie: string;
  colorEmptyError: string;
};

const initialError = {
  productName: "",
  productMrp: "",
  productDiscount: "",
  productDesc: "",
  productCategorie: "",
  productSubCategorie: "",
  colorEmptyError: "",
};

const initialColorItem = {
  name: "",
  images: [],
  sizes: [
    { name: "XS", quantity: 0 },
    { name: "S", quantity: 0 },
    { name: "M", quantity: 0 },
    { name: "L", quantity: 0 },
    { name: "XL", quantity: 0 },
    { name: "XXL", quantity: 0 },
  ],
};

const AddProductFunction: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [mrpPrice, setMrpPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [categorie, setCategorie] = useState<CategorieType>(null);
  const [subCategorie, setSubCategorie] = useState<SubCategorieType>(null);
  const [colors, setColors] = useState<ColorItemsArray>([initialColorItem]);
  const [snackbarMessage, setSnackbarMessage] = useState<SnackbarType>(null);
  const [snackbarSuccessMessage, setSnackbarSuccessMessage] =
    useState<SnackbarType>(null);
  const [checkSubmit, setCheckSubmit] = useState(false);
  const [errors, setErrors] = useState<ErrorType>(initialError);
  const [colorErrors, setColorErrors] = useState<colorErrorType>([]);
  const [showProgresModal, setShowProgresModal] = useState(false);
  const [showAddSizeModal, setShowAddSizeModal] = useState(false);
  const [tempSizeIndex, setTempSizeIndex] = useState<number[]>([]);
  const [addSizeQuantityError, setAddSizeQuantityError] = useState<string>("");

  useEffect(() => {
    handleColorError();
    handleErrors();
    handleChangePrice();
  }, [
    colors,
    productName,
    description,
    mrpPrice,
    discount,
    categorie,
    subCategorie,
    checkSubmit,
  ]);

  const addProductApi = () => {
    setShowProgresModal(true);
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("description", description);
    formData.append("categorie", categorie ? categorie : "");
    formData.append("subCategorie", subCategorie ? subCategorie : "");
    formData.append("price", price);
    formData.append("mrp", mrpPrice);
    formData.append("discount", discount);
    const colorsArray = colors.map((colorsItem) => {
      const imagesArray = colorsItem.images.map((_imageItem) => "");
      const sizeArray = colorsItem.sizes.filter(
        (sizeItem) => sizeItem.quantity > 0
      );
      return {
        ...colorsItem,
        images: imagesArray,
        sizes: sizeArray,
      };
    });
    formData.append("colors", JSON.stringify(colorsArray));
    colors.forEach((colorItem, colorIndex) => {
      colorItem.images.forEach((imageFile, imageIndex) => {
        formData.append(
          `colors[${colorIndex}][images][${imageIndex}]`,
          imageFile
        );
      });
    });
    axios
      .post(`${base_url}/products/add_product`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response && response.data && response.data.data) {
          setSnackbarSuccessMessage("Product added successfully!");
        } else {
          setSnackbarMessage("Something went wrong!.");
        }
        setShowProgresModal(false);
        setCheckSubmit(false);
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          Array.isArray(error.response.data.errors)
        ) {
          error.response.data.errors.map((item: string, index: number) =>
            setTimeout(
              () => enqueueSnackbar(item, { variant: "error" }),
              index * 500
            )
          );
        } else {
          setSnackbarMessage("Something went wrong!.");
        }
        setShowProgresModal(false);
        setCheckSubmit(false);
      });
  };

  const formatMrp = (value: string) => {
    if (value) {
      const newValue = value.slice(0, 15);
      let intgerPart = parseInt(newValue);
      if (newValue.includes(".")) {
        if (newValue.length === 1) {
          return "0.";
        } else {
          const array = newValue.split(".");
          if (array[1] && array[1].length >= 3) {
            let floatPart = array[1].slice(0, 3);
            if (floatPart.length === 3 && floatPart === "000") {
              return `${intgerPart}.0`;
            } else {
              return `${intgerPart}.${floatPart}`;
            }
          } else {
            return `${intgerPart}.${array[1].slice(0, 3)}`;
          }
        }
      } else {
        return intgerPart.toString();
      }
    } else {
      return value;
    }
  };

  const formatDiscount = (value: string) => {
    if (value) {
      const newValue = value.slice(0, 15);
      let intgerPart = parseInt(newValue);
      if (intgerPart > 100) {
        intgerPart = 100;
      }
      if (newValue.includes(".")) {
        if (newValue.length === 1) {
          return "0.";
        } else {
          const array = newValue.split(".");
          if (array[1] && array[1].length >= 2) {
            let floatPart = array[1].slice(0, 2);
            if (floatPart.length === 3 && floatPart === "00") {
              return `${intgerPart}.0`;
            } else {
              return `${intgerPart}.${floatPart}`;
            }
          } else {
            return `${intgerPart}.${array[1].slice(0, 3)}`;
          }
        }
      } else {
        return intgerPart.toString();
      }
    } else {
      return value;
    }
  };

  const handleNameInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string
  ) => {
    const value = event.target.value;
    const regex = /^\d*\.?\d*$/.test(value);
    if (name === "name") {
      setProductName(value);
    }
    if (regex) {
      if (name === "mrp_price") {
        const getValue = formatMrp(value);
        setMrpPrice(getValue);
      }
      if (name === "discount") {
        const getValue = formatDiscount(value);
        setDiscount(getValue);
      }
    }
    if (name === "description") {
      setDescription(value);
    }
    if (name === "categorie") {
      setCategorie(value as CategorieType);
    }
    if (name === "sub_categorie") {
      setSubCategorie(value as SubCategorieType);
    }
  };

  const handleChangePrice = () => {
    if (mrpPrice) {
      let discountGiven = 0;
      if (discount) {
        discountGiven = Number(discount);
      }
      let discountPrice = ((100 - discountGiven) / 100) * Number(mrpPrice);
      const valueArray = discountPrice.toString().split(".");
      if (valueArray[1] && valueArray[1].length > 3) {
        discountPrice = Number(discountPrice.toFixed(3));
      }
      setPrice(discountPrice.toString());
    } else {
      setPrice("");
    }
  };

  const handleColorInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string,
    colorIndex: number
  ) => {
    const value = event.target.value.trim();
    const files = (event.target as HTMLInputElement).files;
    let fileList: File[] = [];
    if (files) {
      fileList = Array.from(files);
    }
    const regex = /^\d*$/.test(value);
    const updateColors = colors.map((item, colorIndexNumber) => {
      if (colorIndex === colorIndexNumber) {
        if (name === "color_name") {
          return { ...item, name: value };
        } else if (name === "quantity" && regex) {
          return { ...item, quantity: value };
        } else if (name === "image" && fileList) {
          const updateImageArray = [...item.images, ...fileList];
          return { ...item, images: updateImageArray };
        } else {
          return item;
        }
      } else {
        return item;
      }
    });
    setColors(updateColors);
  };

  const handleRemoveImage = (colorIndex: number, imageIndex: number) => {
    const updateColors = colors.map((colorItem, colorIndexNumber) => {
      if (colorIndex === colorIndexNumber) {
        return {
          ...colorItem,
          images: colorItem.images.filter(
            (_imageItem, imageIndexNumber) => imageIndex !== imageIndexNumber
          ),
        };
      } else {
        return colorItem;
      }
    });
    setColors(updateColors);
  };

  const handleAddSize = (
    colorIndex: number,
    sizeIndex: number,
    value: number
  ) => {
    if (tempSizeIndex.length !== 0 && value === 0) {
      setAddSizeQuantityError("Size quantity can't be zero.");
    } else {
      const updateColors = colors.map((colorItem, colorInd) => {
        if (colorIndex === colorInd) {
          return {
            ...colorItem,
            sizes: colorItem.sizes.map((sizeItem, sizeInd) => {
              if (sizeIndex === sizeInd) {
                return { ...sizeItem, quantity: value };
              } else {
                return sizeItem;
              }
            }),
          };
        } else {
          return colorItem;
        }
      });
      setColors(updateColors);
      setShowAddSizeModal(false);
      setTempSizeIndex([]);
      setAddSizeQuantityError("");
    }
  };

  const handleAddSizeModalOpen = (
    colorIndex: number,
    sizeIndex: number,
    action: "add" | "remove"
  ) => {
    if (action === "add") {
      setTempSizeIndex([0, colorIndex, sizeIndex]);
      setShowAddSizeModal(true);
    } else {
      handleAddSize(colorIndex, sizeIndex, 0);
    }
  };

  const handleAddSizeModalClose = () => {
    setTempSizeIndex([]);
    setShowAddSizeModal(false);
    setAddSizeQuantityError("");
  };

  const handleSizeModalInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value.slice(0, 15);
    const regex = /^\d*$/.test(value);
    if (regex) {
      let newValue = parseInt(value);
      newValue = Number.isNaN(newValue) ? 0 : newValue;
      const arrayValue = [newValue, tempSizeIndex[1], tempSizeIndex[2]];
      setTempSizeIndex(arrayValue);
    }
  };

  const handleAddMoreColor = () => {
    if (colors.length === 0) {
      setColors([initialColorItem]);
    } else {
      const lastColorItem = colors[colors.length - 1];
      const isSizeExist = lastColorItem.sizes.some(
        (sizeItem) => sizeItem.quantity > 0
      );
      if (
        lastColorItem.name &&
        lastColorItem.images.length > 0 &&
        isSizeExist
      ) {
        const updateColors = [...colors, { ...initialColorItem, images: [] }];
        setColors(updateColors);
      } else {
        setSnackbarMessage("Please first fill the last color fields.");
      }
    }
  };

  const handleRemoveColor = (colorIndex: number) => {
    if (colors.length > 1) {
      const updateColors = colors.filter(
        (_colorItem, colorIndexNumber) => colorIndex !== colorIndexNumber
      );
      setColors(updateColors);
    } else {
      setSnackbarMessage("At least one color is required!");
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarMessage(null);
    setSnackbarSuccessMessage(null);
  };

  const handleErrors = () => {
    let productNameError = "",
      productMrpError = "",
      productDiscountError = "",
      productDescError = "",
      productCategorieError = "",
      productSubCategorieError = "",
      colorEmptyError = "";
    if (productName.length < 3) {
      productNameError = "Product name must have atleast three characters*.";
    }
    if (!productName) {
      productNameError = "Product name is required*.";
    }
    if (!mrpPrice) {
      productMrpError = "MRP is required*.";
    }
    if (mrpPrice === "0") {
      productMrpError = "MRP can't be zero*.";
    }
    if (!discount) {
      productDiscountError = "Discount is required, it may be zero*.";
    }
    if (description.length < 3) {
      productDescError =
        "Product description must have atleast three characters*.";
    }
    if (!description) {
      productDescError = "Product description is required*.";
    }
    if (!categorie) {
      productCategorieError = "Product categorie is required*.";
    }
    if (!subCategorie) {
      productSubCategorieError = "Product sub-categorie is required*.";
    }
    if (colors.length === 0) {
      colorEmptyError = "Add at least one color*.";
    }
    const errorObject = {
      productName: productNameError,
      productMrp: productMrpError,
      productDiscount: productDiscountError,
      productDesc: productDescError,
      productCategorie: productCategorieError,
      productSubCategorie: productSubCategorieError,
      colorEmptyError,
    };
    setErrors(errorObject);
  };

  const handleColorError = () => {
    let errorsArray: colorErrorType = [];
    colors.forEach((colorItem, colorIndex) => {
      let nameError = "",
        imageError = "",
        sizeError = "";
      if (colorItem.name.length < 3) {
        nameError = "Color name must have atleast three characters*.";
      }
      if (colorItem.name.length === 0) {
        nameError = "Color name is required*.";
      }
      const sizeExist = colorItem.sizes.some((item) => item.quantity > 0);
      if (!sizeExist) {
        sizeError = "Minimum one size item required*.";
      }
      if (colorItem.images.length === 0) {
        imageError = "At least one product color image is required*.";
      }
      if (nameError || imageError || sizeError) {
        const errorObject = {
          errorColorIndex: colorIndex,
          imagesErr: imageError,
          nameErr: nameError,
          sizeErr: sizeError,
        };
        errorsArray.push(errorObject);
      }
    });
    setColorErrors(errorsArray);
  };

  const handleFieldClear = () => {
    setProductName("");
    setMrpPrice("");
    setDiscount("");
    setDescription("");
    setCategorie(null);
    setSubCategorie(null);
    setColors([{ ...initialColorItem, images: [] }]);
    setCheckSubmit(false);
  };

  const handleAddProduct = () => {
    handleErrors();
    handleColorError();
    setCheckSubmit(true);
    const isError = Object.values(errors).find((item) => item.length !== 0);
    if (!isError && colorErrors.length === 0) {
      addProductApi();
    } else {
      setSnackbarMessage("Please fill the required fields!");
    }
  };

  const renderInput = (
    label: string,
    name: string,
    value: string,
    error: string
  ) => {
    return (
      <Box>
        <Typography mb={1} style={webStyle.inputLabelStyle}>
          {label}
        </Typography>
        <TextField
          fullWidth
          name={name}
          disabled={name === "price"}
          type="text"
          value={value}
          multiline={name === "description"}
          onChange={(event) => handleNameInputChange(event, name)}
          sx={
            checkSubmit && error
              ? webStyle.inputErrorStyle
              : webStyle.inputStyle
          }
        />
        {checkSubmit && error && (
          <Typography mt={0.5} fontSize={14} color={errorColor}>
            {error}
          </Typography>
        )}
      </Box>
    );
  };

  const renderColorInput = (
    label: string,
    name: string,
    value: string | number | null,
    colorIndex: number,
    error: string
  ) => {
    return (
      <Box>
        <Typography mb={1}>{label}</Typography>
        <TextField
          fullWidth
          name={name}
          type="text"
          value={value ?? ""}
          onChange={(event) => handleColorInputChange(event, name, colorIndex)}
          sx={
            checkSubmit && error
              ? webStyle.inputErrorStyle
              : webStyle.inputStyle
          }
        />
        {checkSubmit && error && (
          <Typography mt={0.5} fontSize={14} color={errorColor}>
            {error}
          </Typography>
        )}
      </Box>
    );
  };

  const renderColorItem = (
    colorItem: ColorItemInterface,
    colorIndex: number
  ) => {
    const nonErrorObj = {
      errorColorIndex: null,
      imagesErr: "",
      nameErr: "",
      sizeErr: "",
    };
    const checkError = colorErrors.find(
      (errorItem) => errorItem.errorColorIndex === colorIndex
    );
    const error = checkError ? checkError : nonErrorObj;
    return (
      <Box
        key={colorIndex}
        style={{
          ...webStyle.colorItemBox,
          marginBottom: colors.length - 1 === colorIndex ? "0" : "10px",
          borderColor: checkSubmit && checkError ? errorColor : primaryColor,
        }}
      >
        <Box style={webStyle.sizeItemNameMainBox}>
          <Box display="flex">
            <Typography style={webStyle.sizeIndexNumber}>{`${
              colorIndex + 1
            }.`}</Typography>
          </Box>
          <IconButton
            onClick={() => handleRemoveColor(colorIndex)}
            title="Delete selected color."
          >
            <DeleteOutlineRoundedIcon style={webStyle.deleteIcon} />
          </IconButton>
        </Box>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            {renderColorInput(
              "Color Name",
              "color_name",
              colorItem.name,
              colorIndex,
              error.nameErr
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            <Typography>Sizes:</Typography>
            <Box style={webStyle.imageBoxWrapper}>
              {colorItem.sizes.map((sizeItem, sizeIndex) => (
                <Box key={sizeIndex} sx={webStyle.sizeBox}>
                  <Box>
                    <Typography
                      style={{
                        ...webStyle.sizeItemLabelText,
                        color:
                          sizeItem.quantity === 0
                            ? lightTextColor
                            : primaryColor,
                      }}
                    >
                      {sizeItem.name}
                    </Typography>
                    <Typography
                      style={{
                        ...webStyle.sizeItemQuantityText,
                        background: sizeItem.quantity === 0 ? "#0006" : "#000",
                      }}
                    >
                      {sizeItem.quantity}
                    </Typography>
                  </Box>
                  <Box
                    sx={webStyle.imageRemoveIconBox}
                    onClick={() =>
                      handleAddSizeModalOpen(
                        colorIndex,
                        sizeIndex,
                        sizeItem.quantity === 0 ? "add" : "remove"
                      )
                    }
                  >
                    {sizeItem.quantity === 0 ? (
                      <AddRoundedIcon style={webStyle.imageRemoveIcon} />
                    ) : (
                      <ClearRoundedIcon style={webStyle.imageRemoveIcon} />
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
            {checkSubmit && error.sizeErr && (
              <Typography mt={0.5} fontSize={14} color={errorColor}>
                {error.sizeErr}
              </Typography>
            )}
          </Grid>
        </Grid>
        <Box mt={1}>
          <Typography>Images:</Typography>
          <Box style={webStyle.imageBoxWrapper}>
            {colorItem.images.map((imageItem, imageIndex) => (
              <Box key={imageIndex} sx={webStyle.imageBox}>
                <img
                  style={webStyle.colorImage}
                  src={URL.createObjectURL(imageItem)}
                  alt="color_image"
                />
                <Box
                  sx={webStyle.imageRemoveIconBox}
                  onClick={() => handleRemoveImage(colorIndex, imageIndex)}
                >
                  <ClearRoundedIcon style={webStyle.imageRemoveIcon} />
                </Box>
              </Box>
            ))}
            <Box component={"label"} style={webStyle.imageAddIconBox}>
              <AddRoundedIcon style={webStyle.imageAddIcon} />
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={(event) =>
                  handleColorInputChange(event, "image", colorIndex)
                }
              />
            </Box>
          </Box>
          {checkSubmit && error.imagesErr && (
            <Typography mt={0.5} fontSize={14} color={errorColor}>
              {error.imagesErr}
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box style={webStyle.mainBox}>
      <Typography style={webStyle.addProductHeadingText}>
        Add Product
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          {renderInput("Product Name", "name", productName, errors.productName)}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          {renderInput("MRP", "mrp_price", mrpPrice, errors.productMrp)}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          {renderInput(
            "Discount",
            "discount",
            discount,
            errors.productDiscount
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          {renderInput("Price", "price", price, "")}
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
          {renderInput(
            "Product Description",
            "description",
            description,
            errors.productDesc
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Box>
            <FormControl>
              <Typography style={webStyle.inputLabelStyle} mb={1}>
                Categorie
              </Typography>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                value={categorie}
                onChange={(event) => handleNameInputChange(event, "categorie")}
              >
                <FormControlLabel
                  value="women"
                  control={<Radio sx={webStyle.radioCheckedColor} />}
                  label="Women"
                />
                <FormControlLabel
                  value="men"
                  control={<Radio sx={webStyle.radioCheckedColor} />}
                  label="Men"
                />
              </RadioGroup>
            </FormControl>
            {checkSubmit && errors.productCategorie && (
              <Typography mt={0.5} fontSize={14} color={errorColor}>
                {errors.productCategorie}
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Box>
            <FormControl>
              <Typography style={webStyle.inputLabelStyle} mb={1}>
                Sub-Categorie
              </Typography>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                value={subCategorie}
                onChange={(event) =>
                  handleNameInputChange(event, "sub_categorie")
                }
              >
                <FormControlLabel
                  value="topwear"
                  control={<Radio sx={webStyle.radioCheckedColor} />}
                  label="Topwear"
                />
                <FormControlLabel
                  value="bottomwear"
                  control={<Radio sx={webStyle.radioCheckedColor} />}
                  label="Bottomwear"
                />
              </RadioGroup>
            </FormControl>
            {checkSubmit && errors.productSubCategorie && (
              <Typography mt={0.5} fontSize={14} color={errorColor}>
                {errors.productSubCategorie}
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
          <Box
            style={{
              ...webStyle.mainSizeBox,
              borderColor:
                checkSubmit && errors.colorEmptyError
                  ? errorColor
                  : lightTextColor,
            }}
          >
            <Box style={webStyle.sizeTopBox}>
              <Typography style={webStyle.selectSizeText}>
                {consfigJSON.colors}
              </Typography>
              <Box
                sx={webStyle.colorAddIconBox}
                onClick={() => handleAddMoreColor()}
                title="Add more color."
              >
                <AddRoundedIcon sx={webStyle.colorAddIcon} />
              </Box>
            </Box>
            {colors.length > 0 ? (
              <>
                {colors.map((colorItem, colorIndex) =>
                  renderColorItem(colorItem, colorIndex)
                )}
              </>
            ) : (
              <Box style={webStyle.emptyTextBox}>
                <AddCircleOutlineRoundedIcon style={webStyle.emptyAddIcon} />
                <Typography style={webStyle.emptyAddText}>
                  {consfigJSON.addAtLeastOneColorError}
                </Typography>
              </Box>
            )}
          </Box>
          {checkSubmit && errors.colorEmptyError && (
            <Typography mt={0.5} fontSize={14} color={errorColor}>
              {errors.colorEmptyError}
            </Typography>
          )}
        </Grid>
      </Grid>
      <Box style={webStyle.addProductButtonBox}>
        <AddButton onClick={() => handleAddProduct()}>Add Product</AddButton>
        <ClearButton onClick={() => handleFieldClear()}>Clear</ClearButton>
      </Box>
      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={Boolean(snackbarSuccessMessage)}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarSuccessMessage}
        </Alert>
      </Snackbar>
      <Modal open={showProgresModal}>
        <Box style={webStyle.progressBox}>
          <CircularProgress style={{ color: primaryColor }} />
        </Box>
      </Modal>
      <Modal open={showAddSizeModal} onClose={handleAddSizeModalClose}>
        <Box style={webStyle.progressBox}>
          <Box style={webStyle.addSizeModalInnerBox}>
            <Typography style={webStyle.addQuantityText}>
              {consfigJSON.addQuantity}
            </Typography>
            <Box p={1}>
              <Typography
                mb={1}
                style={{
                  ...webStyle.inputLabelStyle,
                  textTransform: "capitalize",
                }}
              >
                {consfigJSON.quantity}:
              </Typography>
              <TextField
                fullWidth
                type="text"
                value={`${tempSizeIndex[0]}`}
                onChange={(event) => handleSizeModalInputChange(event)}
                sx={
                  addSizeQuantityError && tempSizeIndex[0] === 0
                    ? webStyle.inputErrorStyle
                    : webStyle.inputStyle
                }
              />
              {addSizeQuantityError && tempSizeIndex[0] === 0 && (
                <Typography mt={0.5} fontSize={14} color={errorColor}>
                  {addSizeQuantityError}
                </Typography>
              )}
              <Box style={webStyle.sizeModalButtonBox}>
                <ClearButton onClick={handleAddSizeModalClose}>
                  {consfigJSON.cancel}
                </ClearButton>
                <AddButton
                  onClick={() =>
                    handleAddSize(
                      tempSizeIndex[1],
                      tempSizeIndex[2],
                      tempSizeIndex[0]
                    )
                  }
                >
                  {consfigJSON.add}
                </AddButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

const AddProduct = () => {
  return (
    <SnackbarProvider
      maxSnack={8}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <AddProductFunction />
    </SnackbarProvider>
  );
};

export default AddProduct;

const AddButton = styled(Button)({
  background: primaryColor,
  color: "#fff",
});

const ClearButton = styled(Button)({
  background: lightTextColor,
  color: primaryColor,
});

const webStyle = {
  mainBox: {
    padding: "25px",
  },
  addProductHeadingText: {
    fontSize: "30px",
    fontWeight: "bold",
    marginBottom: "25px",
    color: primaryColor,
  } as React.CSSProperties,
  mainSizeBox: {
    paddingBottom: "10px",
    borderRadius: "8px",
    border: `1px solid ${lightTextColor}`,
    overflow: "hidden",
  },
  sizeItemLabelText: {
    fontSize: "23px",
    textAlign: "center",
    margin: "4px 0",
  } as React.CSSProperties,
  sizeItemQuantityText: {
    fontSize: "12px",
    textAlign: "center",
    color: lightTextColor,
  } as React.CSSProperties,
  imageBoxWrapper: {
    marginTop: "5px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  } as React.CSSProperties,
  progressBox: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  addSizeModalInnerBox: {
    background: "#fff",
    width: "100%",
    maxWidth: "400px",
    minHeight: "200px",
    borderRadius: "8px",
    boxShadow: `0px 0px 16px 2px ${primaryColor}`,
    overflow: "hidden",
    margin: "0 10px",
  },
  addQuantityText: {
    background: "#000",
    color: lightTextColor,
    padding: "10px",
    fontSize: "20px",
  },
  sizeModalButtonBox: {
    marginTop: "15px",
    display: "flex",
    gap: "10px",
    justifyContent: "space-between",
  },
  selectSizeText: {
    color: lightTextColor,
    fontSize: "22px",
  },
  inputLabelStyle: {
    fontSize: "17px",
    fontWeight: "bold",
  },
  imageBox: {
    width: "60px",
    height: "60px",
    borderRadius: "8px",
    border: `2px solid ${primaryColor}`,
    overflow: "hidden",
    position: "relative",
    cursor: "pointer",
    "&:hover": {
      "& .MuiBox-root": {
        visibility: "visible !important",
      },
    },
  } as React.CSSProperties,
  sizeBox: {
    width: "60px",
    height: "60px",
    borderRadius: "8px",
    border: `2px solid ${primaryColor}`,
    overflow: "hidden",
    position: "relative",
    cursor: "pointer",
    "&:hover": {
      "& .MuiBox-root": {
        visibility: "visible !important",
      },
    },
  } as React.CSSProperties,
  inputStyle: {
    "& .MuiOutlinedInput-root": {
      height: "45px",
      borderRadius: "6px",
      "& fieldset": {
        border: `1px solid #65279b`,
      },
      "&.Mui-focused fieldset": {
        borderColor: "#65279b",
        borderWidth: "1px",
        boxShadow: "0px 0px 4px 0px #965cf6",
      },
      "&:hover fieldset": {
        borderColor: "#65279b",
      },
      "&.Mui-disabled fieldset": {
        borderColor: "#65279b",
      },
    },
    "& .MuiInputBase-input": {
      fontFamily: "Arial",
      fontSize: "16px",
    },
    "& .MuiInputBase-input.Mui-disabled": {
      color: "#000",
      WebkitTextFillColor: "#000",
    },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0px 1000px #FFFFFF inset",
    },
  },
  inputErrorStyle: {
    "& .MuiOutlinedInput-root": {
      height: "45px",
      borderRadius: "6px",
      "& fieldset": {
        border: `1px solid ${errorColor}`,
      },
      "&.Mui-focused fieldset": {
        borderColor: `${errorColor}`,
        borderWidth: "1px",
        boxShadow: `0px 0px 4px 0px ${errorColor}`,
      },
      "&:hover fieldset": {
        borderColor: `${errorColor}`,
      },
    },
    "& .MuiInputBase-input": {
      fontFamily: "Arial",
      fontSize: "16px",
    },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0px 1000px #FFFFFF inset",
    },
  },
  radioCheckedColor: {
    color: primaryColor,
    "&.Mui-checked": {
      color: primaryColor,
    },
  },
  addProductButtonBox: {
    marginTop: "25px",
    display: "flex",
    flexDirection: "row-reverse",
    gap: "20px",
  } as React.CSSProperties,
  deleteIcon: {
    fontSize: "25px",
    color: "red",
  },
  imageAddIconBox: {
    width: "60px",
    height: "60px",
    borderRadius: "8px",
    border: `2px solid ${primaryColor}`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  colorAddIcon: {
    fontSize: "30px",
    color: lightTextColor,
    "&:hover": {
      color: primaryColor,
    },
  },
  sizeIndexNumber: {
    fontSize: "18px",
  },
  colorItemBox: {
    border: `1px solid ${primaryColor}`,
    padding: "10px",
    borderRadius: "8px",
    margin: "0 10px",
  },
  emptyAddIcon: {
    fontSize: "40px",
    color: primaryColor,
  },
  emptyAddText: {
    fontSize: "30px",
    color: primaryColor,
  },
  sizeItemNameMainBox: {
    display: "flex",
    justifyContent: "space-between",
  },
  emptyTextBox: {
    height: "200px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: "10px",
  } as React.CSSProperties,
  imageAddIcon: {
    fontSize: "40px",
    color: lightTextColor,
  },
  imageRemoveIconBox: {
    top: 0,
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "60px",
    height: "60px",
    position: "absolute",
    zIndex: 4,
    cursor: "pointer",
    background: "#6f63636b",
    visibility: "hidden",
  } as React.CSSProperties,
  imageRemoveIcon: {
    fontSize: "40px",
    color: primaryColor,
  },
  colorImage: {
    width: "60px",
    height: "60px",
    zIndex: 0,
  },
  sizeTopBox: {
    padding: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    background: "#000",
    flexWrap: "wrap",
  } as React.CSSProperties,
  colorAddIconBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    border: `2px solid ${primaryColor}`,
    width: "40px",
    height: "40px",
    cursor: "pointer",
    "&:hover": {
      background: lightTextColor,
      color: `${primaryColor} !important`,
    },
  },
};
