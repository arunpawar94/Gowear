import React from "react";
import { Box, Typography, styled } from "@mui/material";
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
      appendDots: (dots: React.ReactNode[]) => <StyledDots>{dots}</StyledDots>,
    };
    return (
      <StyledSliderWrapper style={webStyle.mainCarouselBox}>
        <Slider {...settings}>
          {[image1, image2, image3, image4].map((item, index) => (
            <Box key={index} style={{ border: "1px solid green" }}>
              <img
                style={{
                  width: "100%",
                  height: "500px",
                  objectFit: "cover",
                  objectPosition: "top",
                }}
                src={item}
              />
            </Box>
          ))}
        </Slider>
      </StyledSliderWrapper>
    );
  };

  const renderItemCarousel = () => {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
    };
    return (
      <Box>
        <Typography>Top wears</Typography>
        <Slider {...settings}>
          {Array(5)
            .fill(null)
            .map((_item, index) => (
              <Box style={webStyle.itemBox} key={index}>
                {index}
              </Box>
            ))}
        </Slider>
      </Box>
    );
  };

  return (
    <Box>
      {renderCarousel()}
      {renderItemCarousel()}
    </Box>
  );
};

export default Home;

const StyledSliderWrapper = styled("div")({
  width: "80%",
  margin: "0 auto",
  position: "relative",
});

const StyledDots = styled("ul")({
  position: "absolute",
  bottom: "12px !important"
});

const webStyle = {
  mainCarouselBox: {
    width: "80%",
    margin: "0 auto",
  } as React.CSSProperties,
  itemBox: {
    width: "100px",
    height: "100px",
    border: "1px solid red",
  },
};
