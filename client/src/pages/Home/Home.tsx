import React from "react";
import {
  Box,
  Typography,
  styled,
  Grid2 as Grid,
  useMediaQuery,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { setSharedState } from "../../redux/sharedSlice";
import image1 from "../../assets/Screenshot 2025-01-23 at 16-56-17 elegant-women-with-shopping-bags-city_1157-26769.avif (AVIF Image 626 × 417 pixels).png";
import image2 from "../../assets/istockphoto-639275740-612x612.jpg";
import image3 from "../../assets/maxresdefault.jpg";
import image4 from "../../assets/photo-1483985988355-763728e1935b.jpeg";

import mensCategorie from "../../assets/mensCategorie.png";
import womensCategorie from "../../assets/womensCategorie.png";
import mensTopwear from "../../assets/mensTopwear.png";
import mensBottomwear from "../../assets/mensBottomwear.jpg";
import womensTopwear from "../../assets/womensTopwear.jpg";
import womensBottomwear from "../../assets/womensBottomwear.jpg";

import Slider from "react-slick";

import { primaryColor, lightTextColor } from "../../config/colors";
import { gowearLogo } from "../../config/assets";
import configJSON from "./config";
import { useNavigate } from "react-router-dom";
import Banner from "../../components/Banner";
import CartBoxContainer from "../../components/CartBoxContainer";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const sharedState = useSelector((state: RootState) => state.shared.cartCount);
  const dispatch = useDispatch<AppDispatch>();
  const size1030 = useMediaQuery("(max-width:1030px)");
  const size930 = useMediaQuery("(max-width:930px)");

  const updateState = () => {
    dispatch(setSharedState(1));
  };

  const handleNavigation = (route: string) => {
    navigate(`/${route}`);
  };

  const renderCarousel = () => {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      arrows: false,
      appendDots: (dots: React.ReactNode[]) => <StyledDots>{dots}</StyledDots>,
    };
    return (
      <StyledSliderWrapper>
        <Slider {...settings}>
          {[image1, image2, image3, image4].map((item, index) => (
            <Box key={index}>
              <img style={webStyle.carouselImage} src={item} />
            </Box>
          ))}
        </Slider>
      </StyledSliderWrapper>
    );
  };

  return (
    <Box mb={3}>
      {renderCarousel()}
      <CartBoxContainer />
      <Banner />
      <Box style={webStyle.categorieMainBox}>
        <Typography style={webStyle.categorieHeadingText}>
          {configJSON.shopByCategories}
        </Typography>
        <Box
          style={{
            ...webStyle.categorieMainImageBox,
            padding: size1030 ? "0" : "0 50px",
          }}
        >
          <Box
            sx={webStyle.categorieImageBox}
            onClick={() => handleNavigation("categoryClothes/menswear")}
          >
            <img
              src={mensCategorie}
              alt="mens_categories"
              style={webStyle.categorieImage}
            />
            <Typography style={webStyle.categorieText}>
              {configJSON.mensClothing}
            </Typography>
          </Box>
          {!size930 && (
            <Box>
              <img
                src={gowearLogo}
                alt="gowear_logo"
                style={{ width: "250px" }}
              />
            </Box>
          )}
          <Box
            sx={webStyle.categorieImageBox}
            onClick={() => handleNavigation("categoryClothes/womenswear")}
          >
            <img
              src={womensCategorie}
              alt="womens_categories"
              style={webStyle.categorieImage}
            />
            <Typography style={webStyle.categorieText}>
              {configJSON.womensClothing}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box style={webStyle.categorieMainBox}>
        <Typography style={webStyle.categorieHeadingText}>
          {configJSON.mensAndWomensClothing}
        </Typography>
        <Grid container spacing={3}>
          {[
            {
              imageValue: mensTopwear,
              altName: "mens_topwear",
              label: "Men's Topwear",
              urlAddress: "menstopwear",
            },
            {
              imageValue: mensBottomwear,
              altName: "mens_bottomwear",
              label: "Men's Bottomwear",
              urlAddress: "mensbottomwear",
            },
            {
              imageValue: womensTopwear,
              altName: "womens_topwear",
              label: "Women's Topwear",
              urlAddress: "womenstopwear",
            },
            {
              imageValue: womensBottomwear,
              altName: "womens_bottomwear",
              label: "Women's Bottomwear",
              urlAddress: "womensbottomwear",
            },
          ].map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }} key={index}>
              <Box
                sx={webStyle.subCatorieImageBox}
                onClick={() =>
                  handleNavigation(`categoryClothes/${item.urlAddress}`)
                }
              >
                <img
                  src={item.imageValue}
                  alt={item.altName}
                  style={webStyle.subCatorieImage}
                />
                <Box style={webStyle.subCatorieLabelBox}>
                  <Typography style={webStyle.subCatorieLabelText}>
                    {item.label}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;

const StyledSliderWrapper = styled("div")({
  width: "80%",
  margin: "0 auto",
  position: "relative",
  "@media (max-width: 900px)": {
    width: "100%",
  },
});

const StyledDots = styled("ul")({
  position: "absolute",
  bottom: "12px !important",
});

const webStyle = {
  itemBox: {
    width: "100px",
    height: "100px",
  },
  carouselImage: {
    width: "100%",
    aspectRatio: "954/500",
    objectFit: "cover",
    objectPosition: "top",
  } as React.CSSProperties,
  categorieMainBox: {
    margin: "40px 25px 0",
  },
  subCatorieImageBox: {
    overflow: "hidden",
    position: "relative",
    background: "#efe8ef",
    borderRadius: "6px",
    border: `1px solid ${primaryColor}`,
    cursor: "pointer",
    height: "400px",
    "&:hover": {
      boxShadow: `0px 0px 8px ${primaryColor}`,
    },
  } as React.CSSProperties,
  subCatorieLabelBox: {
    position: "absolute",
    background: "#000",
    width: "100%",
    height: "160px",
    bottom: -120,
    display: "flex",
    justifyContent: "center",
    borderRadius: "50% 50% 0 0",
    paddingTop: "25px",
  } as React.CSSProperties,
  subCatorieLabelText: {
    color: lightTextColor,
  },
  subCatorieImage: {
    width: "100%",
    height: "400px",
    objectFit: "cover",
    objectPosition: "top",
  } as React.CSSProperties,
  categorieImage: {
    width: "100%",
    maxWidth: "250px",
  },
  categorieImageBox: {
    borderRadius: "6px",
    background: "#000",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
    cursor: "pointer",
    "&:hover": {
      boxShadow: `0px 0px 8px ${primaryColor}`,
    },
  } as React.CSSProperties,
  categorieHeadingText: {
    fontSize: "24px",
    textTransform: "uppercase",
    fontWeight: "bold",
    marginBottom: "20px",
    color: primaryColor,
  } as React.CSSProperties,
  categorieText: {
    color: lightTextColor,
    fontSize: "20px",
  },
  categorieMainImageBox: {
    display: "flex",
    justifyContent: "space-evenly",
    gap: "25px",
    alignItems: "center",
    flexWrap: "wrap",
  } as React.CSSProperties,
};
