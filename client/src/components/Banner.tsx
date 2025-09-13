import { Box, styled, Typography } from "@mui/material";
import { lightTextColor, primaryColor } from "../config/colors";
import { bannerImage } from "../config/assets";

export default function Banner() {
  return (
    <BannerBox>
      <Box>
        <Typography style={webStyle.bannerText}>
          Discover the
          <br />
          <span style={webStyle.shadowText}>perfect</span>
          <br />
          blend of style
          <br />
          <span style={webStyle.shadowText}>and</span>
          <br />
          confort
        </Typography>
      </Box>
      <Box>
        <Box style={webStyle.bannerImageWrapper}>
          <Box style={webStyle.bannerImageBackBox}></Box>
          <Box style={webStyle.bannerImageBox}>
            <img
              src={bannerImage}
              style={webStyle.bannerImage}
              alt="banner_image"
            />
          </Box>
        </Box>
      </Box>
    </BannerBox>
  );
}

const webStyle = {
  bannerText: {
    color: lightTextColor,
    fontSize: "35px",
    fontWeight: 600,
    textTransform: "uppercase",
  } as React.CSSProperties,
  shadowText: {
    fontSize: "35px",
    color: "#000",
    WebkitTextStroke: `0.5px ${lightTextColor}`,
  },
  bannerImageWrapper: {
    position: "relative",
    height: "300px",
    width: "200px",
  } as React.CSSProperties,
  bannerImageBackBox: {
    position: "absolute",
    background: primaryColor,
    width: "200px",
    height: "300px",
    zIndex: 0,
    rotate: "-6deg",
  } as React.CSSProperties,
  bannerImageBox: {
    top: 0,
    position: "absolute",
    zIndex: 1,
  } as React.CSSProperties,
  bannerImage: {
    width: "200px",
  },
};

const BannerBox = styled(Box)({
  background: "#000",
  padding: "50px 0px",
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-evenly",
  alignItems: "center",
  gap: "30px",
});
