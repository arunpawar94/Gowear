import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  styled,
  Typography,
  Grid2 as Grid,
  Button,
  createTheme,
  ThemeProvider,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { lightTextColor, primaryColor } from "../../config/colors";
import { useEffect, useState } from "react";
import axios from "axios";
import CartBox from "../../components/CartBox";
import CartBoxSkeleton from "../../components/CartBoxSkeleton";
import configJSON from "./config";
import SortRoundedIcon from "@mui/icons-material/SortRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import GradientCircularProgress from "../../components/GradientCircularProgress";

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

interface ParamsType {
  heading: string;
  showSubCategorieFilter: boolean;
  category: string;
}

type GetProductsResp = {
  _id: string;
  name: string;
  description: string;
  categorie: "men" | "women";
  subCategorie: "topwear" | "bottomwear";
  price: number;
  mrp: number;
  discount: number;
  colors: ColorsInterface[];
};

interface ColorsInterface {
  name: string;
  images: { imgUrl: string }[];
  sizes: { name: string; quantity: number }[];
}

const categorieArray = [
  { label: "Both", value: "both" },
  { label: "Topwear", value: "topwear" },
  { label: "Bottomwear", value: "bottomwear" },
];

const rangeArray = [
  { label: "All", value: "all" },
  { label: "Under ₹1000", value: "under1k" },
  { label: "₹1000 - ₹5000", value: "1kto5k" },
  { label: "₹5000 - ₹10000", value: "5kto10k" },
  { label: "Above ₹10000", value: "above10k" },
];

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

export default function CategoryClothes() {
  const [categoryType, setCategoryType] = useState<string>("both");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [pageParams, setPageParams] = useState<ParamsType | null>(null);
  const [products, setProducts] = useState<GetProductsResp[]>([]);
  const [isProductsFetched, setIsProductsFetched] = useState<boolean>(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);
  const [moreLoading, setMoreLoading] = useState(false);

  const size800 = useMediaQuery("(min-width:800px)");

  const { category_param: categorieParam } = useParams();

  useEffect(() => {
    handleCatrgoriePageChange();
  }, [categorieParam]);

  useEffect(() => {
    if (pageParams) {
      getProducts();
    }
  }, [pageParams, categoryType, priceRange, page]);

  const handleCatrgoriePageChange = () => {
    setIsProductsFetched(false);
    setCategoryType("both");
    setPriceRange("all");
    setProducts([]);
    setPageParamsFunc();
    setPage(1);
    setShowFilterDrawer(false);
  };

  const getProducts = () => {
    const priceRangeObject: {
      min_price: undefined | number;
      max_price: undefined | number;
    } = {
      min_price: undefined,
      max_price: undefined,
    };
    switch (priceRange) {
      case "under1k":
        priceRangeObject.max_price = 1000;
        break;
      case "1kto5k":
        priceRangeObject.min_price = 1000;
        priceRangeObject.max_price = 5000;
        break;
      case "5kto10k":
        priceRangeObject.min_price = 5000;
        priceRangeObject.max_price = 10000;
        break;
      case "above10k":
        priceRangeObject.min_price = 10000;
        break;
      default:
        priceRangeObject.min_price = undefined;
        priceRangeObject.max_price = undefined;
        break;
    }
    if (pageParams) {
      axios
        .get(`${base_url}/products/show_products`, {
          params: {
            per_page: 20,
            categorie: pageParams.category,
            sub_categorie: categoryType === "both" ? undefined : categoryType,
            page,
            min_price: priceRangeObject.min_price,
            max_price: priceRangeObject.max_price,
          },
        })
        .then((response) => {
          setProducts((prevState) => [...prevState, ...response.data.data]);
          setIsProductsFetched(true);
          setTotalPages(response.data.metadata.totalPages);
          setMoreLoading(false);
        })
        .catch((_error) => {
          setIsProductsFetched(true);
          setMoreLoading(false);
        });
    }
  };

  const setPageParamsFunc = () => {
    let paramObj = null;
    if (categorieParam === "menswear") {
      paramObj = {
        heading: "Men's Clothing",
        showSubCategorieFilter: true,
        category: "men",
      };
    }
    if (categorieParam === "womenswear") {
      paramObj = {
        heading: "Women's Clothing",
        showSubCategorieFilter: true,
        category: "women",
      };
    }
    if (categorieParam === "menstopwear") {
      paramObj = {
        heading: "Men's Topwear",
        showSubCategorieFilter: false,
        category: "men",
      };
      setCategoryType("topwear");
    }
    if (categorieParam === "mensbottomwear") {
      paramObj = {
        heading: "Men's Bottomwear",
        showSubCategorieFilter: false,
        category: "men",
      };
      setCategoryType("bottomwear");
    }
    if (categorieParam === "womenstopwear") {
      paramObj = {
        heading: "Women's Topwear",
        showSubCategorieFilter: false,
        category: "women",
      };
      setCategoryType("topwear");
    }
    if (categorieParam === "womensbottomwear") {
      paramObj = {
        heading: "Women's Bottomwear",
        showSubCategorieFilter: false,
        category: "women",
      };
      setCategoryType("bottomwear");
    }
    setPageParams(paramObj);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string
  ) => {
    const { value } = event.target;
    if (name === "categorie_type") {
      setPage(1);
      setCategoryType(value);
      setIsProductsFetched(false);
      setProducts([]);
    }
    if (name === "price_range") {
      setPage(1);
      setPriceRange(value);
      setIsProductsFetched(false);
      setProducts([]);
    }
  };

  const handleCartProductDetail = (product: GetProductsResp) => {
    let imageUrl = "",
      colorName = "";
    product.colors.some((item) => {
      const checkAvailability = item.sizes.some(
        (sizeItem) => sizeItem.quantity > 0
      );
      if (checkAvailability) {
        imageUrl = item.images[0].imgUrl;
        colorName = item.name;
        return true;
      } else {
        return false;
      }
    });
    const dataObject = {
      productId: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      mrp: product.mrp,
      discount: product.discount,
      imageUrl,
      categorie: product.categorie,
      subCategorie: product.subCategorie,
      color: colorName,
    };
    return dataObject;
  };

  const handleMoreViewClick = () => {
    setPage((prevState) => prevState + 1);
    setMoreLoading(true);
  };

  const renderRadioBox = (
    label: string,
    optionArray: { label: string; value: string }[],
    value: string,
    name: string
  ) => {
    return (
      <Box>
        <Typography style={webStyle.radioBoxLabel}>{label}</Typography>
        <Box style={webStyle.radioBox}>
          {label === "Categories" && (
            <Typography style={webStyle.radioCategorieLabel}>Men's</Typography>
          )}
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name={name}
            value={value}
            onChange={(event) => handleInputChange(event, name)}
          >
            {optionArray.map((item, index) => (
              <FormControlLabel
                key={index}
                value={item.value}
                control={<Radio sx={webStyle.radioButtonStyle} />}
                label={item.label}
                sx={webStyle.radioControllerStyle}
              />
            ))}
          </RadioGroup>
        </Box>
      </Box>
    );
  };

  const renderDrawer = () => {
    return (
      <Box sx={webStyle.leftSideBox}>
        {!size800 && (
          <Box style={webStyle.filterCloseIconBox}>
            <IconButton onClick={() => setShowFilterDrawer(false)}>
              <CloseRoundedIcon style={{ color: "#fff" }} />
            </IconButton>
          </Box>
        )}
        {pageParams &&
          pageParams.showSubCategorieFilter &&
          renderRadioBox(
            "Categories",
            categorieArray,
            categoryType,
            "categorie_type"
          )}
        {renderRadioBox("Price Range", rangeArray, priceRange, "price_range")}
      </Box>
    );
  };

  const renderCartBox = () => {
    return (
      <ThemeProvider theme={customTheme}>
        <GridBox>
          {isProductsFetched && products.length === 0 ? (
            <Box style={webStyle.noResultBox}>
              <Typography style={webStyle.noResultFoundText}>
                {configJSON.noResultFound}
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {isProductsFetched ? (
                <>
                  {products.map((item, index) => (
                    <Grid
                      size={{ xs: 12, xsm: 6, sm: 4, md: 3, lg: 2.4 }}
                      key={index}
                      style={{ minWidth: "160px" }}
                    >
                      <CartBox product={handleCartProductDetail(item)} />
                    </Grid>
                  ))}
                </>
              ) : (
                <>
                  {Array(10)
                    .fill(null)
                    .map((_item, index) => (
                      <Grid
                        size={{ xs: 12, xsm: 6, sm: 4, md: 3, lg: 2.4 }}
                        key={index}
                      >
                        <CartBoxSkeleton />
                      </Grid>
                    ))}
                </>
              )}
            </Grid>
          )}

          {products.length > 0 && page < totalPages && (
            <AddButton onClick={handleMoreViewClick}>
              {moreLoading ? (
                <GradientCircularProgress size={20} margin="2px 24px" />
              ) : (
                configJSON.viewMore
              )}
            </AddButton>
          )}
        </GridBox>
      </ThemeProvider>
    );
  };
  return (
    <Box>
      <Typography style={webStyle.headingText}>
        {pageParams ? pageParams.heading : ""}
      </Typography>
      <Box sx={webStyle.mainBodyBox}>
        {size800 ? (
          renderDrawer()
        ) : (
          <Box style={webStyle.mainFilterBox}>
            {showFilterDrawer ? (
              renderDrawer()
            ) : (
              <Box
                style={webStyle.filterIconBox}
                onClick={() => setShowFilterDrawer(true)}
              >
                <SortRoundedIcon style={{ color: primaryColor }} />
              </Box>
            )}
          </Box>
        )}
        {renderCartBox()}
      </Box>
      {showFilterDrawer && (
        <Box
          style={webStyle.filterBackdrop as React.CSSProperties}
          onClick={() => setShowFilterDrawer(false)}
        ></Box>
      )}
    </Box>
  );
}

const webStyle = {
  headingText: {
    fontSize: "30px",
    padding: "10px 20px",
  },
  mainBodyBox: {
    marginBottom: "40px",
    borderTop: `1px solid ${lightTextColor}`,
    borderBottom: `1px solid ${lightTextColor}`,
    display: "flex",
    "@media(max-width: 800px)": {
      position: "relative",
    },
  },
  leftSideBox: {
    backgroundColor: "#000",
    color: "#fff",
    padding: "20px",
    minWidth: "200px",
    maxWidth: "200px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    "@media(max-width: 1200px)": {
      minWidth: "180px",
    },
    "@media(max-width: 800px)": {
      maxWidth: "181px",
      borderRadius: "0 6px 6px 0",
      boxShadow: `0 0 9px 4px ${primaryColor}`,
    },
  } as React.CSSProperties,
  noResultBox: {
    width: "100%",
    height: "450px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  noResultFoundText: {
    fontSize: "20px",
    color: primaryColor,
  },
  filterCloseIconBox: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "-15px",
    marginBottom: "-25px",
    marginRight: "-10px",
  },
  radioBoxLabel: {
    fontSize: "20px",
  },
  mainFilterBox: {
    position: "absolute",
    zIndex: 52,
  } as React.CSSProperties,
  filterIconBox: {
    backgroundColor: "#f9f1ff91",
    padding: "0px 5px",
    borderRadius: "0px 4px 4px 0px",
  },
  filterBackdrop: {
    position: "fixed",
    width: "100vw",
    height: "100vh",
    top: 0,
    zIndex: 51,
  },
  radioCategorieLabel: {
    textDecoration: "underline",
    textUnderlineOffset: "2px",
  },
  radioBox: {
    margin: "5px 20px",
  },
  radioControllerStyle: {
    mr: "12px",
    marginTop: "5px",
    "& .MuiFormControlLabel-label": {
      fontSize: "15px",
    },
  },
  radioButtonStyle: {
    color: primaryColor,
    "&.Mui-checked": {
      color: primaryColor,
    },
    padding: "5px",
    "& .MuiSvgIcon-root": {
      width: 20,
      height: 20,
    },
  },
};

const GridBox = styled(Box)({
  maxWidth: "100%",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  gap: "25px",
  overflowY: "auto",
});

const AddButton = styled(Button)({
  background: primaryColor,
  color: "#fff",
  textTransform: "none",
});
