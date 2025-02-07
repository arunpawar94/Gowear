import React from "react";
import { Box, Typography, styled, Grid2 as Grid } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { setSharedState } from "../../redux/sharedSlice";
import image1 from "../../assets/Screenshot 2025-01-23 at 16-56-17 elegant-women-with-shopping-bags-city_1157-26769.avif (AVIF Image 626 × 417 pixels).png";
import image2 from "../../assets/istockphoto-639275740-612x612.jpg";
import image3 from "../../assets/maxresdefault.jpg";
import image4 from "../../assets/photo-1483985988355-763728e1935b.jpeg";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import CartBox from "../../components/CartBox";

const Home: React.FC = () => {
  const sharedState = useSelector((state: RootState) => state.shared.cartCount);
  const dispatch = useDispatch<AppDispatch>();

  const updateState = () => {
    dispatch(setSharedState(1));
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
            <Box key={index} style={{ border: "1px solid green" }}>
              <img style={webStyle.carouselImage} src={item} />
            </Box>
          ))}
        </Slider>
      </StyledSliderWrapper>
    );
  };

  const renderCartBox = () => {
    return (
      <GridContainer container spacing={3}>
        {Array(10)
          .fill(null)
          .map((_item, index) => (
            <Grid size={{ xs: 12, sm: 4, md: 3, lg: 2.4 }} key={index}>
              <CartBox />
            </Grid>
          ))}
      </GridContainer>
    );
  };

  return (
    <Box>
      {renderCarousel()}
      {renderCartBox()}
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

const GridContainer = styled(Grid)({
  maxWidth: "85%",
  margin: "20px auto",
  "@media (max-width: 900px)": {
    maxWidth: "100%",
    margin: "20px",
  },
});

const webStyle = {
  itemBox: {
    width: "100px",
    height: "100px",
    border: "1px solid red",
  },
  carouselImage: {
    width: "100%",
    aspectRatio: "954/500",
    objectFit: "cover",
    objectPosition: "top",
  } as React.CSSProperties,
};
