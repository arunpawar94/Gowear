import {
  Box,
  Button,
  Typography,
  Grid2 as Grid,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import React, { CSSProperties, useEffect, useState } from "react";
import {
  approvedColor,
  buyButtonColor,
  errorColor,
  lightTextColor,
  pendingColor,
  primaryColor,
  rejectedColor,
} from "../../config/colors";
import configJSON from "./config";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CarouselCart from "../../components/CarouselCart";
import Slider from "react-slick";
import Banner from "../../components/Banner";
import CartBoxContainer from "../../components/CartBoxContainer";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import GradientCircularProgress from "../../components/GradientCircularProgress";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const base_url = process.env.REACT_APP_API_URL;

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xs: true;
    xsm: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
  }
}

const customTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      xsm: 400,
      sm: 600,
      md: 1000,
      lg: 1200,
      xl: 1600,
    },
  },
});

interface ColorsInterface {
  name: string;
  images: { imgUrl: string }[];
  sizes: { name: string; quantity: number }[];
}

interface ProductDetail {
  _id: string;
  name: string;
  description: string;
  price: number;
  mrp: number;
  discount: number;
  colors: ColorsInterface[];
  categorie: "men" | "women";
  subCategorie: "topwear" | "bottomwear";
}

const intialProductDetail = {
  _id: "",
  name: "",
  description: "",
  price: 0,
  mrp: 0,
  discount: 0,
  colors: [],
  categorie: "men" as ProductDetail["categorie"],
  subCategorie: "topwear" as ProductDetail["subCategorie"],
};

const initialSelectedColorValue = {
  name: "",
  images: [],
  sizes: [],
};

export default function ViewDetail() {
  const { id: productId } = useParams();
  const query = new URLSearchParams(useLocation().search);
  const categorie = query.get("categorie");
  const subCategorie = query.get("subCategorie");
  const color = query.get("color");
  const { enqueueSnackbar } = useSnackbar();

  const [productDetail, setProductDetail] =
    useState<ProductDetail>(intialProductDetail);

  const [imageArray, setImageArray] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<ColorsInterface>(
    initialSelectedColorValue
  );
  const [selectedSize, setSelectedSize] = useState<{
    name: string;
    quantity: number;
  }>({ name: "", quantity: 5 });
  const [categorieProductArr, setCategorieProductArr] = useState<
    ProductDetail[]
  >([]);
  const [subCategorieProductArr, setSubCategorieProductArr] = useState<
    ProductDetail[]
  >([]);
  const [selectdImage, setSelectedImage] = useState<string>("");
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [totalColorCount, setTotalColorCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [existInWishlist, setExistInWishlist] = useState(false);
  const [existInCart, setExistInCart] = useState(false);

  const accessToken = useSelector(
    (state: RootState) => state.tokenReducer.token
  );

  useEffect(() => {
    getProduct();
  }, [productId]);

  const getProduct = () => {
    axios
      .get(`${base_url}/products/show_product_detail`, {
        params: {
          productId,
          categorie,
          subCategorie,
        },
      })
      .then((response) => {
        const productDetailData: ProductDetail | null =
          response.data.data.productDetail;
        if (productDetailData) {
          const colorsArrayResp = productDetailData.colors;
          let selectedColorItem = colorsArrayResp.find(
            (item) => item.name === color
          );
          if (!selectedColorItem) {
            selectedColorItem = colorsArrayResp[0];
          }
          const imageArrayResp = selectedColorItem
            ? selectedColorItem.images.map((item) => item.imgUrl)
            : [];
          setProductDetail(productDetailData);
          setImageArray(imageArrayResp);
          setSelectedImage(imageArrayResp[0]);
          setSelectedColor(
            selectedColorItem ? selectedColorItem : initialSelectedColorValue
          );
          if (selectedColorItem) {
            setTotalColorCount(getTotalColorCount(selectedColorItem.sizes));
          }
          setTotalCount(getTotalCount(colorsArrayResp));
        }

        setSelectedSize({ name: "", quantity: 5 });
        setCategorieProductArr(response.data.data.categorieProducts);
        setSubCategorieProductArr(response.data.data.subCategorieProducts);
        setLoading(false);
      })
      .catch((error) => {
        const errorValue = error.response.data.error;
        if (typeof errorValue === "string") {
          enqueueSnackbar(errorValue, { variant: "error" });
        } else {
          enqueueSnackbar("Something Went wrong!", { variant: "error" });
        }
        setLoading(false);
      });
  };

  const getTotalColorCount = (
    array: { name: string; quantity: number }[]
  ): number => {
    return array.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);
  };

  const getTotalCount = (array: ColorsInterface[]) => {
    return array.reduce(
      (acc, item) => (acc += getTotalColorCount(item.sizes)),
      0
    );
  };

  const handleImageSelectClick = (
    imageUrl: string,
    name: undefined | string,
    index: number
  ) => {
    if (name) {
      setSelectedColor(productDetail.colors[index]);
      const imageList = productDetail.colors[index].images.map(
        (item) => item.imgUrl
      );
      setTotalColorCount(getTotalColorCount(productDetail.colors[index].sizes));
      setImageArray(imageList);
      setSelectedImage(imageUrl);
      const checkSize = productDetail.colors[index].sizes.some((item) => {
        if (item.name === selectedSize.name && item.quantity > 0) {
          setSelectedSize(item);
          return true;
        } else {
          return false;
        }
      });
      if (!checkSize) {
        setSelectedSize({ name: "", quantity: 5 });
      }
    } else {
      setSelectedImage(imageUrl);
    }
  };

  const handleAddWishlistClick = () => {
    if (accessToken) {
      setExistInWishlist(!existInWishlist);
      if (existInWishlist) {
        enqueueSnackbar("Removed from wishlist successfully!", {
          variant: "warning",
        });
      } else {
        enqueueSnackbar("Added to wishlist successfully!", {
          variant: "success",
        });
      }
    } else {
      enqueueSnackbar("Please Login!", { variant: "error" });
    }
  };

  const handleAddCartClick = () => {
    if (accessToken) {
      setExistInCart(!existInCart);
      if (existInCart) {
        enqueueSnackbar("Removed from cart successfully!", {
          variant: "warning",
        });
      } else {
        enqueueSnackbar("Added to cart successfully!", { variant: "success" });
      }
    } else {
      enqueueSnackbar("Please Login!", { variant: "error" });
    }
  };

  const handleBuyClick = () => {
    if (accessToken) {
      enqueueSnackbar("Product buy successfully!", { variant: "success" });
    } else {
      enqueueSnackbar("Please Login!", { variant: "error" });
    }
  };

  const renderImageSelectBox = (
    imageUrl: string,
    index: number,
    name: undefined | string,
    selected: boolean
  ) => {
    return (
      <Box key={index}>
        <Box
          sx={{
            ...webStyle.selectImageBox,
            borderColor: selected ? primaryColor : "gray",
          }}
          onClick={() => handleImageSelectClick(imageUrl, name, index)}
        >
          <img src={imageUrl} style={webStyle.selectImage} />
        </Box>
        {name && <Typography style={webStyle.colorName}>{name}</Typography>}
      </Box>
    );
  };

  const renderCarousel = () => {
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 8,
      slidesToScroll: 8,
      responsive: [
        {
          breakpoint: 1250,
          settings: {
            slidesToShow: 6,
            slidesToScroll: 6,
            infinite: true,
            dots: true,
          },
        },
        {
          breakpoint: 1000,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 4,
            infinite: true,
            dots: true,
          },
        },
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2,
          },
        },
        {
          breakpoint: 400,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };
    return (
      <div className="slider-container">
        <Slider {...settings}>
          {categorieProductArr.map((item, index) => {
            const dataObject = {
              productId: item._id,
              name: item.name,
              description: item.description,
              price: item.price,
              mrp: item.mrp,
              discount: item.discount,
              imageUrl: item.colors[0].images[0].imgUrl,
              categorie: item.categorie,
              subCategorie: item.subCategorie,
              color: item.colors[0].name,
            };
            return <CarouselCart key={index} product={dataObject} />;
          })}
        </Slider>
      </div>
    );
  };

  const renderDetailView = () => {
    const getSizeArray: { name: string; quantity: number }[] = [];
    configJSON.sizeArray.forEach((item) => {
      selectedColor.sizes.forEach((newItem) => {
        if (newItem.name === item) {
          getSizeArray.push(newItem);
        }
      });
    });
    return (
      <Box sx={webStyle.mainDetailBox}>
        <Box style={webStyle.mainDetailTopBox}>
          <Box sx={webStyle.detailLeftBox}>
            <Box sx={webStyle.detailLeftArrayBox}>
              {imageArray.map((item, index) =>
                renderImageSelectBox(
                  item,
                  index,
                  undefined,
                  item === selectdImage
                )
              )}
            </Box>
            <Box sx={webStyle.mainImageBox}>
              <img src={selectdImage} style={webStyle.mainImage} />
            </Box>
          </Box>
          <Box>
            <Typography style={webStyle.categorieLabel}>
              {categorie} Collection
            </Typography>
            <Typography sx={webStyle.productName}>
              {productDetail.name}
            </Typography>
            <Typography sx={webStyle.mrpText}>
              <span>₹{productDetail.mrp}</span>{" "}
              <span>({productDetail.discount}% OFF)</span>
            </Typography>
            <Typography style={webStyle.priceText}>
              ₹ {productDetail.price}
            </Typography>
            <Box>
              <Typography style={webStyle.colorText}>
                {configJSON.color}
              </Typography>
              <Box sx={webStyle.colorArrayBox}>
                {productDetail.colors.map((item, index) => {
                  const imageUrl = item.images[0].imgUrl;
                  return renderImageSelectBox(
                    imageUrl,
                    index,
                    item.name,
                    item.name === selectedColor.name
                  );
                })}
              </Box>
            </Box>
            {typeof totalColorCount === "number" &&
              totalColorCount > 0 &&
              getSizeArray.length > 0 && (
                <Box>
                  <Typography style={webStyle.colorText}>
                    {configJSON.selectSize}
                  </Typography>
                  <Box sx={webStyle.sizeArrayBox}>
                    {getSizeArray.map((item, index) => (
                      <React.Fragment key={index}>
                        {item.quantity > 0 && (
                          <Box
                            key={index}
                            sx={{
                              ...webStyle.sizeBox,
                              backgroundColor:
                                item.name === selectedSize.name
                                  ? primaryColor
                                  : lightTextColor,
                              color:
                                item.name === selectedSize.name
                                  ? "#fff"
                                  : "#000",
                            }}
                            onClick={() => setSelectedSize(item)}
                          >
                            <Typography>{item.name}</Typography>
                          </Box>
                        )}
                      </React.Fragment>
                    ))}
                  </Box>
                </Box>
              )}
            {totalCount === 0 ||
            totalColorCount === 0 ||
            selectedSize.quantity < 1 ? (
              <Typography
                style={{ ...webStyle.inStockText, color: rejectedColor }}
              >
                {configJSON.outOfStock}
              </Typography>
            ) : (
              <>
                {selectedSize.quantity > 0 && selectedSize.quantity < 3 ? (
                  <Typography
                    style={{ ...webStyle.inStockText, color: pendingColor }}
                  >
                    {configJSON.only} {selectedSize.quantity} {configJSON.left}
                  </Typography>
                ) : (
                  <Typography style={webStyle.inStockText}>
                    {configJSON.inStock}
                  </Typography>
                )}
              </>
            )}
            <Box sx={webStyle.buttonBox}>
              <Button
                style={
                  existInWishlist
                    ? webStyle.activeButton
                    : webStyle.disableButton
                }
                onClick={() => handleAddWishlistClick()}
              >
                <FavoriteRoundedIcon sx={webStyle.wishCartIcon} />
                {configJSON.wishlist}
              </Button>
              <Button
                style={
                  existInCart ? webStyle.activeButton : webStyle.disableButton
                }
                onClick={() => handleAddCartClick()}
              >
                <ShoppingCartIcon sx={webStyle.wishCartIcon} />
                {configJSON.addToCart}
              </Button>
            </Box>
            <Box sx={webStyle.buttonBox}>
              <Button
                style={webStyle.buyButton}
                onClick={() => handleBuyClick()}
              >
                {configJSON.buyNow}
              </Button>
            </Box>
          </Box>
        </Box>
        <Box sx={webStyle.mainDetailSecondBox}>
          <Typography style={webStyle.detailDesTextBox}>
            {configJSON.productDescription}:
          </Typography>
          <Typography>{productDetail.description}</Typography>
        </Box>
      </Box>
    );
  };

  const renderCategoryBlock = () => {
    return (
      <ThemeProvider theme={customTheme}>
        <Box>
          {subCategorieProductArr.length > 0 && (
            <Box style={webStyle.categoryTopBox}>
              <Typography style={webStyle.headingOneText}>
                {categorie} {subCategorie}
              </Typography>
              <Box>
                <Grid container spacing={3}>
                  {subCategorieProductArr.map((item, index) => {
                    const dataObject = {
                      productId: item._id,
                      name: item.name,
                      description: item.description,
                      price: item.price,
                      mrp: item.mrp,
                      discount: item.discount,
                      imageUrl: item.colors[0].images[0].imgUrl,
                      categorie: item.categorie,
                      subCategorie: item.subCategorie,
                      color: item.colors[0].name,
                    };
                    return (
                      <Grid
                        key={index}
                        size={{ xs: 12, xsm: 6, sm: 4, md: 3, lg: 1.5 }}
                      >
                        <CarouselCart product={dataObject} />
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            </Box>
          )}
          {categorieProductArr.length > 0 && (
            <Box style={webStyle.categoryTopBox}>
              <Typography style={webStyle.headingOneText}>
                More in {categorie} Category
              </Typography>
              <Box>{renderCarousel()}</Box>
            </Box>
          )}
        </Box>
      </ThemeProvider>
    );
  };
  return (
    <Box>
      {loading ? (
        <Box style={webStyle.gradientBox}>
          <GradientCircularProgress />
        </Box>
      ) : (
        <>
          {productDetail._id ? (
            renderDetailView()
          ) : (
            <Box style={webStyle.noResultBox}>
              <Typography style={webStyle.noResultFoundText}>
                {configJSON.productNotFound}
              </Typography>
            </Box>
          )}
          {renderCategoryBlock()}
        </>
      )}

      <Banner />
      <CartBoxContainer />
    </Box>
  );
}

const webStyle = {
  mainDetailBox: {
    display: "flex",
    gap: "25px",
    justifyContent: "center",
    flexDirection: "column",
    "@media(max-width: 600px)": {
      gap: "0px",
    },
  } as CSSProperties,
  headingOneText: {
    textTransform: "uppercase",
    fontSize: "25px",
    marginBottom: "10px",
  } as CSSProperties,
  categoryTopBox: {
    borderBottom: "1px solid lightgray",
    padding: "20px 30px",
  },
  mainDetailTopBox: {
    display: "flex",
    gap: "25px",
    margin: "auto",
    justifyContent: "center",
    padding: "20px 10px",
    flexWrap: "wrap",
  } as CSSProperties,
  noResultBox: {
    width: "100%",
    height: "300px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  noResultFoundText: {
    fontSize: "20px",
    color: primaryColor,
  },
  mainDetailSecondBox: {
    padding: "20px",
    borderBottom: "1px solid lightgray",
    "@media(max-width: 600px)": {
      padding: "0px 10px 10px",
    },
  },
  gradientBox: {
    height: "400px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mainImageBox: {
    width: "480px",
    "@media(max-width: 600px)": {
      width: "100%",
    },
  },
  mainImage: {
    width: "100%",
    maxWidth: "480px",
    maxHeight: "540px",
    objectFit: "contain",
  } as CSSProperties,
  detailDesTextBox: {
    fontWeight: "bold",
    marginBottom: "2px",
    fontSize: "18px",
  },
  detailLeftBox: {
    display: "flex",
    gap: "25px",
    "@media(max-width: 600px)": {
      flexDirection: "column-reverse",
      gap: "15px",
    },
  } as CSSProperties,
  detailLeftArrayBox: {
    display: "flex",
    gap: "12px",
    flexDirection: "column",
    "@media(max-width: 600px)": {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: "8px",
    },
  } as CSSProperties,
  categorieLabel: {
    fontWeight: "bold",
    textTransform: "uppercase",
    color: primaryColor,
    fontSize: "18px",
    marginBottom: "5px",
  } as CSSProperties,
  productName: {
    fontSize: "25px",
    fontWeight: "bold",
    marginBottom: "5px",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
    overflow: "hidden",
    textOverflow: "ellipsis",
    wordBreak: "break-word",
    height: "70px",
    maxWidth: "400px",
  } as CSSProperties,
  mrpText: {
    "& span:first-of-type": {
      color: "gray",
      textDecorationLine: "line-through",
    },
    "& span:last-of-type": {
      color: errorColor,
      marginLeft: "2px",
      fontWeight: "bold",
    },
  },
  priceText: {
    fontSize: "25px",
  },
  buttonBox: {
    marginTop: "10px",
    display: "flex",
    gap: "20px",
    "@media(max-width: 600px)": {
      flexWrap: "wrap",
      gap: "15px",
      "& .MuiButton-root": {
        width: "100%",
      },
    },
  },
  activeButton: {
    backgroundColor: primaryColor,
    color: "#fff",
  },
  disableButton: {
    backgroundColor: "gray",
    color: "#fff",
  },
  buyButton: {
    backgroundColor: buyButtonColor,
    color: "#000",
    minWidth: "108px",
  },
  disableBuyButton: {
    backgroundColor: "gray",
    color: "#fff",
    minWidth: "108px",
  },
  wishCartIcon: {
    fontSize: "18px",
    marginRight: "5px",
  },
  colorText: {
    textTransform: "uppercase",
    fontSize: "18px",
    color: "gray",
  } as CSSProperties,
  sizeArrayBox: {
    display: "flex",
    gap: "15px",
    margin: "5px 0 10px",
    "@media(max-width: 600px)": {
      flexWrap: "wrap",
      gap: "10px",
    },
  },
  sizeBox: {
    width: "45px",
    height: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "18px",
    "&:hover": {
      backgroundColor: primaryColor,
      color: "#fff",
    },
  },
  inStockText: {
    color: approvedColor,
    fontSize: "25px",
    fontWeight: "bold",
  },
  selectImageBox: {
    width: "50px",
    height: "50px",
    overflow: "hidden",
    border: "3px solid gray",
    borderRadius: "6px",
    cursor: "pointer",
    "&:hover": {
      borderColor: primaryColor,
    },
  },
  selectImage: {
    objectFit: "contain",
    width: "100%",
  } as CSSProperties,
  colorArrayBox: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
    margin: "5px 0 10px",
    maxWidth: "400px",
    "@media(max-width: 600px)": {
      gap: "8px",
    },
  },
  colorName: {
    fontSize: "12px",
    width: "60px",
    marginTop: "2px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textTransform: "capitalize",
  } as CSSProperties,
};
