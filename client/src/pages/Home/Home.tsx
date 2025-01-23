import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { Box } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { setSharedState } from "../../redux/sharedSlice";
import image from "../../assets/gowearImage.png";

const Home: React.FC = () => {
  const sharedState = useSelector((state: RootState) => state.shared.cartCount);
  const dispatch = useDispatch<AppDispatch>();

  const updateState = () => {
    dispatch(setSharedState(1));
  };

  const renderCarousel = () => {
    return (
      <Box className="slider-container">
        <Carousel>
          <div>
            <img src={image} />
            <p className="legend">Legend 1</p>
          </div>
          <div>
            <img src={image} />
            <p className="legend">Legend 2</p>
          </div>
          <div>
            <img src={image} />
            <p className="legend">Legend 3</p>
          </div>
        </Carousel>
      </Box>
    );
  };

  return (
    <Box>
      Home
      <Box style={{ margin: "100px" }}>{renderCarousel()}</Box>
    </Box>
  );
};

export default Home;
