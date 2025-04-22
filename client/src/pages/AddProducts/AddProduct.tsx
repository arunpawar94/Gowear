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
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";

const base_url = process.env.REACT_APP_API_URL;

type CategorieType = "men" | "women" | null;
type SubCategorieType = "topwear" | "bottomwear" | null;

interface SizeItem {
  name: string;
  colors: ColorItemInterface[];
}

interface ColorItemInterface {
  images: File[];
  name: string;
  quantity: number | null;
}

type SizesType = SizeItem[];

type SizesColorErrorType = {
  errorSize: string;
  errorColorIndex: number | null;
  imagesErr: string;
  nameErr: string;
  quantityErr: string;
}[];

type SnackbarType = string | null;

type ErrorType = {
  productName: string;
  productMrp: string;
  productDiscount: string;
  productDesc: string;
  productCategorie: string;
  productSubCategorie: string;
  sizeEmptyError: string;
};

const initialError = {
  productName: "",
  productMrp: "",
  productDiscount: "",
  productDesc: "",
  productCategorie: "",
  productSubCategorie: "",
  sizeEmptyError: "",
};

const sizeArray = ["XS", "S", "M", "L", "XL", "XXL"];

const AddProductFunction: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [mrpPrice, setMrpPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [categorie, setCategorie] = useState<CategorieType>(null);
  const [subCategorie, setSubCategorie] = useState<SubCategorieType>(null);
  const [sizes, setSizes] = useState<SizesType>([]);
  const [snackbarMessage, setSnackbarMessage] = useState<SnackbarType>(null);
  const [snackbarSuccessMessage, setSnackbarSuccessMessage] =
    useState<SnackbarType>(null);
  const [checkSubmit, setCheckSubmit] = useState(false);
  const [errors, setErrors] = useState<ErrorType>(initialError);
  const [sizeColorErrors, setSizeColorErrors] = useState<SizesColorErrorType>(
    []
  );
  const [showProgresModal, setShowProgresModal] = useState(false);

  useEffect(() => {
    handleSizeColorError();
    handleErrors();
    handleChangePrice();
  }, [
    sizes,
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
    const updateSizeArray = sizes.map((sizeItem) => {
      const colorsArray = sizeItem.colors.map((colorsItem) => {
        const imagesArray = colorsItem.images.map((_imageItem) => "");
        return {
          ...colorsItem,
          images: imagesArray,
          quantity: Number(colorsItem.quantity),
        };
      });
      return { ...sizeItem, colors: colorsArray };
    });
    formData.append("sizes", JSON.stringify(updateSizeArray));
    sizes.forEach((sizeItem, sizeIndex) => {
      sizeItem.colors.forEach((colorItem, colorIndex) => {
        colorItem.images.forEach((imageFile, imageIndex) => {
          formData.append(
            `sizes[${sizeIndex}][colors][${colorIndex}][images][${imageIndex}]`,
            imageFile
          );
        });
      });
    });
    axios
      .post(`${base_url}/products/add_product`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data && response.data.data) {
          setSnackbarSuccessMessage("Product added successfully!");
        } else {
          setSnackbarMessage("Something went wrong!.");
        }
        setShowProgresModal(false);
        setCheckSubmit(false);
      })
      .catch((error) => {
        if (error.response.data && Array.isArray(error.response.data.errors)) {
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
    sizeIndex: number,
    colorIndex: number
  ) => {
    const value = event.target.value;
    const file = (event.target as HTMLInputElement).files?.[0];
    const regex = /^\d*$/.test(value);
    const updateSize = sizes.map((item, indexNumber) => {
      if (indexNumber === sizeIndex) {
        return {
          ...item,
          colors: item.colors.map((item, colorIndexNumber) => {
            if (colorIndex === colorIndexNumber) {
              if (name === "color_name") {
                return { ...item, name: value };
              } else if (name === "quantity" && regex) {
                return { ...item, quantity: value };
              } else if (name === "image" && file) {
                const updateImageArray = item.images;
                updateImageArray.push(file);
                return { ...item, images: updateImageArray };
              } else {
                return item;
              }
            } else {
              return item;
            }
          }),
        };
      } else {
        return item;
      }
    });
    setSizes(updateSize as SizesType);
  };

  const handleRemoveImage = (
    sizeIndex: number,
    colorIndex: number,
    imageIndex: number
  ) => {
    const updateSize = sizes.map((item, indexNumber) => {
      if (sizeIndex === indexNumber) {
        return {
          ...item,
          colors: item.colors.map((colorItem, colorIndexNumber) => {
            if (colorIndex === colorIndexNumber) {
              return {
                ...colorItem,
                images: colorItem.images.filter(
                  (_imageItem, imageIndexNumber) =>
                    imageIndex !== imageIndexNumber
                ),
              };
            } else {
              return colorItem;
            }
          }),
        };
      } else {
        return item;
      }
    });
    setSizes(updateSize);
  };

  const handleAddSize = (action: "add" | "delete", sizeName: string) => {
    if (action === "add") {
      const sizeExist = sizes.find((item) => item.name === sizeName);
      if (!sizeExist) {
        const initialSizeItem = {
          name: sizeName,
          colors: [
            {
              images: [],
              name: "",
              quantity: null,
            },
          ],
        };
        setSizes([...sizes, initialSizeItem]);
      }
    } else {
      const deleteItemSizeArray = sizes.filter(
        (item) => item.name !== sizeName
      );
      setSizes(deleteItemSizeArray);
    }
  };

  const handleAddMoreColor = (sizeIndex: number) => {
    const updateSize = sizes.map((item, indexNumber) => {
      if (sizeIndex === indexNumber) {
        const lastColorItem = item.colors[item.colors.length - 1];
        if (
          lastColorItem.name &&
          lastColorItem.quantity &&
          lastColorItem.images.length > 0
        ) {
          const initialColorItem = {
            images: [],
            name: "",
            quantity: null,
          };
          return {
            ...item,
            colors: [...item.colors, initialColorItem],
          };
        } else {
          setSnackbarMessage("Please first fill the last color fields.");
          return item;
        }
      } else {
        return item;
      }
    });
    setSizes(updateSize);
  };

  const handleRemoveColor = (sizeIndex: number, colorIndex: number) => {
    const updateSize = sizes.map((item, indexNumber) => {
      if (sizeIndex === indexNumber) {
        if (item.colors.length > 1) {
          return {
            ...item,
            colors: item.colors.filter(
              (_colorItem, colorIndexNumber) => colorIndex !== colorIndexNumber
            ),
          };
        } else {
          setSnackbarMessage("At least one color is required");
          return item;
        }
      } else {
        return item;
      }
    });
    setSizes(updateSize);
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
      sizeEmptyError = "";
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
    if (sizes.length === 0) {
      sizeEmptyError = "Select at least one size*.";
    }
    const errorObject = {
      productName: productNameError,
      productMrp: productMrpError,
      productDiscount: productDiscountError,
      productDesc: productDescError,
      productCategorie: productCategorieError,
      productSubCategorie: productSubCategorieError,
      sizeEmptyError,
    };
    setErrors(errorObject);
  };

  const handleSizeColorError = () => {
    let errorsArray: SizesColorErrorType = [];
    sizes.forEach((item) => {
      item.colors.forEach((colorItem, colorIndex) => {
        let nameError = "",
          imageError = "",
          quantityError = "";
        if (colorItem.name.length === 0) {
          nameError = "Color name is required*.";
        }
        if (colorItem.name.length < 3) {
          nameError = "Color name must have atleast three characters*.";
        }
        if (!colorItem.quantity) {
          quantityError = "Minimum one item required*.";
        }
        if (colorItem.images.length === 0) {
          imageError = "At least one product color image is required*.";
        }
        if (nameError || imageError || quantityError) {
          const errorObject = {
            errorSize: item.name,
            errorColorIndex: colorIndex,
            imagesErr: imageError,
            nameErr: nameError,
            quantityErr: quantityError,
          };
          errorsArray.push(errorObject);
        }
      });
    });
    setSizeColorErrors(errorsArray);
  };

  const handleAddProduct = () => {
    handleErrors();
    handleSizeColorError();
    setCheckSubmit(true);
    const isError = Object.values(errors).find((item) => item.length !== 0);
    if (!isError && sizeColorErrors.length === 0) {
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
    sizeIndex: number,
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
          onChange={(event) =>
            handleColorInputChange(event, name, sizeIndex, colorIndex)
          }
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
    item: SizeItem,
    index: number,
    colorItem: ColorItemInterface,
    colorIndex: number
  ) => {
    const nonErrorObj = {
      errorSize: "",
      errorColorIndex: null,
      imagesErr: "",
      nameErr: "",
      quantityErr: "",
    };
    const checkError = sizeColorErrors.find(
      (errorItem) =>
        errorItem.errorSize === item.name &&
        errorItem.errorColorIndex === colorIndex
    );
    const error = checkError ? checkError : nonErrorObj;
    return (
      <Box
        key={colorIndex}
        style={{
          ...webStyle.colorItemBox,
          marginBottom: item.colors.length - 1 === colorIndex ? "0" : "10px",
          borderColor: checkSubmit && checkError ? errorColor : primaryColor,
        }}
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            {renderColorInput(
              "Color Name",
              "color_name",
              colorItem.name,
              index,
              colorIndex,
              error.nameErr
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            {renderColorInput(
              "Quantity",
              "quantity",
              colorItem.quantity,
              index,
              colorIndex,
              error.quantityErr
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
                  onClick={() =>
                    handleRemoveImage(index, colorIndex, imageIndex)
                  }
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
                accept="image/*"
                onChange={(event) =>
                  handleColorInputChange(event, "image", index, colorIndex)
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
        <Box style={webStyle.deleteColorIconBox}>
          <IconButton
            title="Delete selected color."
            onClick={() => handleRemoveColor(index, colorIndex)}
          >
            <ClearRoundedIcon style={webStyle.deleteColorIcon} />
          </IconButton>
        </Box>
      </Box>
    );
  };

  return (
    <Box style={webStyle.mainBox}>
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
                checkSubmit && errors.sizeEmptyError
                  ? errorColor
                  : lightTextColor,
            }}
          >
            <Box style={webStyle.sizeTopBox}>
              <Typography style={webStyle.selectSizeText}>
                Select Sizes:
              </Typography>
              <Box style={webStyle.sizeSelectBox}>
                {sizeArray.map((item, index) => (
                  <Box
                    key={index}
                    style={{
                      ...webStyle.sizeSelectItemBox,
                      background: sizes.find(
                        (sizeItem) => sizeItem.name === item
                      )
                        ? lightTextColor
                        : "#000",
                    }}
                    onClick={() => handleAddSize("add", item)}
                  >
                    <Typography
                      style={{
                        ...webStyle.sizeSelectItemText,
                        color: sizes.find((sizeItem) => sizeItem.name === item)
                          ? primaryColor
                          : lightTextColor,
                      }}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            {sizes.length > 0 ? (
              <>
                {sizes.map((item, index) => (
                  <Box key={index} pb={2} style={webStyle.sizeItemBox}>
                    <Box style={webStyle.sizeItemNameMainBox}>
                      <Box display="flex">
                        <Typography style={webStyle.sizeIndexNumber}>{`${
                          index + 1
                        }.`}</Typography>
                        &nbsp;
                        <Typography style={webStyle.sizeNameText}>
                          {" "}
                          {item.name}
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={() => handleAddSize("delete", item.name)}
                        title="Delete selected Size."
                      >
                        <DeleteOutlineRoundedIcon style={webStyle.deleteIcon} />
                      </IconButton>
                    </Box>
                    <Box p={1}>
                      <Box style={webStyle.colorsHeadingTextBox}>
                        <Typography mb={1}>Colors:</Typography>
                        <IconButton
                          title="Add more color."
                          onClick={() => handleAddMoreColor(index)}
                        >
                          <AddRoundedIcon style={webStyle.colorAddIcon} />
                        </IconButton>
                      </Box>
                      {item.colors.map((colorItem, colorIndex) =>
                        renderColorItem(item, index, colorItem, colorIndex)
                      )}
                    </Box>
                  </Box>
                ))}
              </>
            ) : (
              <Box style={webStyle.emptyTextBox}>
                <AddCircleOutlineRoundedIcon style={webStyle.emptyAddIcon} />
                <Typography style={webStyle.emptyAddText}>
                  Select at least one size
                </Typography>
              </Box>
            )}
          </Box>
          {checkSubmit && errors.sizeEmptyError && (
            <Typography mt={0.5} fontSize={14} color={errorColor}>
              {errors.sizeEmptyError}
            </Typography>
          )}
        </Grid>
      </Grid>
      <Box style={webStyle.addProductButtonBox}>
        <AddButton onClick={() => handleAddProduct()}>Add Product</AddButton>
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

const webStyle = {
  mainBox: {
    padding: "25px",
  },
  mainSizeBox: {
    paddingBottom: "10px",
    borderRadius: "8px",
    border: `1px solid ${lightTextColor}`,
    overflow: "hidden",
  },
  imageBoxWrapper: {
    marginTop: "5px",
    display: "flex",
    gap: "10px",
  },
  progressBox: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
  } as React.CSSProperties,
  deleteIcon: {
    fontSize: "25px",
    color: "red",
  },
  deleteColorIcon: {
    fontSize: "25px",
    color: "red",
  },
  deleteColorIconBox: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
  },
  colorsHeadingTextBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
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
  sizeItemBox: {
    border: `1px solid ${primaryColor}`,
    margin: "10px 10px 20px",
    padding: "10px",
    borderRadius: "8px",
  },
  colorAddIcon: {
    fontSize: "30px",
    color: primaryColor,
  },
  sizeIndexNumber: {
    fontSize: "18px",
  },
  colorItemBox: {
    border: `1px solid ${primaryColor}`,
    padding: "10px",
    borderRadius: "8px",
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
  sizeNameText: {
    fontSize: "20px",
    color: primaryColor,
    fontWeight: "bold",
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
  },
  sizeSelectBox: {
    display: "flex",
    gap: "10px",
  },
  sizeSelectItemBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    border: `2px solid ${primaryColor}`,
    width: "40px",
    height: "40px",
    cursor: "pointer",
  },
  sizeSelectItemText: {
    color: lightTextColor,
    fontWeight: "bold",
  },
};
