import {
  Box,
  Button,
  Typography,
  Grid2 as Grid,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import mensTopwear from "../../assets/mensTopwear.png";
import mensBottomwear from "../../assets/mensBottomwear.jpg";
import womensTopwear from "../../assets/womensTopwear.jpg";
import womensBottomwear from "../../assets/womensBottomwear.jpg";
import { CSSProperties } from "react";
import {
  approvedColor,
  errorColor,
  lightTextColor,
  primaryColor,
} from "../../config/colors";
import configJSON from "./config";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CarouselCart from "../../components/CarouselCart";
import Slider from "react-slick";
import Banner from "../../components/Banner";
import CartBoxContainer from "../../components/CartBoxContainer";

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

const dataObject = {
  name: "Scott International Shirt for Men",
  description:
    "Women's Short Sleeve Button-Down Shirt | Printed Casual Crop Top | Stylish Collared Shirt for Women | Oversized Shirt for Woman",
  price: 677,
  mrp: 1200,
  discount: 56,
  imageUrl: womensBottomwear,
};

export default function ViewDetail() {
  const renderImageSelectBox = (
    imageUrl: string,
    index: number,
    name: undefined | string
  ) => {
    return (
      <Box key={index}>
        <Box sx={webStyle.selectImageBox}>
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
          {Array(10)
            .fill(null)
            .map((_, index) => (
              <CarouselCart key={index} product={dataObject} />
            ))}
        </Slider>
      </div>
    );
  };

  const renderDetailView = () => {
    return (
      <Box sx={webStyle.mainDetailBox}>
        <Box style={webStyle.mainDetailTopBox}>
          <Box sx={webStyle.detailLeftBox}>
            <Box sx={webStyle.detailLeftArrayBox}>
              {Array(8)
                .fill(null)
                .map((_item, index) =>
                  renderImageSelectBox(mensTopwear, index, undefined)
                )}
            </Box>
            <img src={womensTopwear} style={webStyle.mainImage} />
          </Box>
          <Box>
            <Typography style={webStyle.categorieLabel}>
              Men Collection
            </Typography>
            <Typography sx={webStyle.productName}>
              Scott International Shirt for Men ASDFJASK JDFA SDFJ ASJD FJASJD
              FHAWUETHJKSD JF HA
            </Typography>
            <Typography sx={webStyle.mrpText}>
              <span>₹1699</span> <span>(56% OFF)</span>
            </Typography>
            <Typography style={webStyle.priceText}>₹ 747.56</Typography>
            <Box>
              <Typography style={webStyle.colorText}>
                {configJSON.color}
              </Typography>
              <Box sx={webStyle.colorArrayBox}>
                {Array(10)
                  .fill(null)
                  .map((_item, index) =>
                    renderImageSelectBox(mensTopwear, index, "dark Navy")
                  )}
              </Box>
            </Box>
            <Box>
              <Typography style={webStyle.colorText}>
                {configJSON.selectSize}
              </Typography>
              <Box sx={webStyle.sizeArrayBox}>
                {configJSON.sizeArray.map((item, index) => (
                  <Box key={index} sx={webStyle.sizeBox}>
                    <Typography>{item}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            <Typography style={webStyle.inStockText}>In Stock</Typography>
            <Box sx={webStyle.buttonBox}>
              <Button style={webStyle.activeButton}>
                <FavoriteRoundedIcon sx={webStyle.wishCartIcon} />
                {configJSON.wishlist}
              </Button>
              <Button style={webStyle.activeButton}>
                <ShoppingCartIcon sx={webStyle.wishCartIcon} />
                {configJSON.addToCart}
              </Button>
            </Box>
          </Box>
        </Box>
        <Box sx={webStyle.mainDetailSecondBox}>
          <Typography style={webStyle.detailDesTextBox}>
            {configJSON.productDescription}:
          </Typography>
          <Typography>
            Women's Short Sleeve Button-Down Shirt | Printed Casual Crop Top |
            Stylish Collared Shirt for Women | Oversized Shirt for Woman
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderCategoryBlock = () => {
    return (
      <ThemeProvider theme={customTheme}>
        <Box>
          <Box style={webStyle.categoryTopBox}>
            <Typography style={webStyle.headingOneText}>Men Topwear</Typography>
            <Box>
              <Grid container spacing={3}>
                {Array(8)
                  .fill(null)
                  .map((_, index) => (
                    <Grid
                      key={index}
                      size={{ xs: 12, xsm: 6, sm: 4, md: 3, lg: 1.5 }}
                    >
                      <CarouselCart product={dataObject} />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </Box>
          <Box style={webStyle.categoryTopBox}>
            <Typography style={webStyle.headingOneText}>
              More in Men Category
            </Typography>
            <Box>{renderCarousel()}</Box>
          </Box>
        </Box>
      </ThemeProvider>
    );
  };

  return (
    <Box>
      {renderDetailView()}
      {renderCategoryBlock()}
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
  mainDetailSecondBox: {
    padding: "20px",
    borderBottom: "1px solid lightgray",
    "@media(max-width: 600px)": {
      padding: "0px 10px 10px",
    },
  },
  mainImage: {
    width: "100%",
    maxWidth: "480px",
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
    backgroundColor: lightTextColor,
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
