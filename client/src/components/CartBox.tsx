import { Box, Button, IconButton, Typography, styled } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { primaryColor } from "../config/colors";

import product from "../assets/61xoajnZ55L._SY879_.jpg";

export default function CartBox() {
  return (
    <MainBox>
      <Box style={webStyle.imgWrapper}>
        <IconButton style={webStyle.addWishButton}>
          {false ? (
            <FavoriteIcon style={{ color: "red" }} />
          ) : (
            <FavoriteBorderIcon style={{ color: "red" }} />
          )}
        </IconButton>
        <img src={product} alt="product_image" style={webStyle.imgStyle} />
      </Box>
      <Box style={webStyle.detailBox}>
        <Typography style={webStyle.nameText}>
          Symbol Premium Symbol PremiumSymbol PremiumSymbol Premium
        </Typography>
        <EllipsisTypography style={webStyle.desText}>
          Men's Cotton Non-Iron Formal Shirt (Regular Fit | Solid)
        </EllipsisTypography>
        <Typography>Price ₹1,899</Typography>
        <Typography style={webStyle.mrpText}>
          M.R.P:{" "}
          <span
            style={{ ...webStyle.desText, textDecorationLine: "line-through" }}
          >
            ₹3,999
          </span>{" "}
          <span style={{ ...webStyle.desText, color: "red" }}>(53% off)</span>
        </Typography>
        <Typography style={{ color: "green" }}>Available</Typography>
        <Box style={webStyle.buttonBox}>
          <AddButton>Add to cart</AddButton>
          <DetailButton>View Detail</DetailButton>
        </Box>
      </Box>
    </MainBox>
  );
}

const MainBox = styled(Box)({
  padding: "10px",
  borderRadius: "12px",
  boxShadow: `0px 0px 4px #65279b29`,
  "&:hover": {
    boxShadow: `0px 0px 8px ${primaryColor}`,
  },
});

const EllipsisTypography = styled(Typography)({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
  wordBreak: "break-word",
  height: "33px",
});

const AddButton = styled(Button)({
  background: primaryColor,
  color: "#fff",
});

const DetailButton = styled(Button)({
  background: "#000",
  color: "#fff",
});

const webStyle: { [key: string]: React.CSSProperties } = {
  detailBox: {
    marginTop: "10px",
  },
  nameText: {
    fontWeight: 600,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  buttonBox: {
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  mrpText: {
    fontSize: "14px",
  },
  desText: {
    fontSize: "12px",
  },
  imgWrapper: {
    display: "flex",
    justifyContent: "center",
    position: "relative",
  },
  addWishButton: {
    position: "absolute",
    right: "0px",
  },
  imgStyle: {
    width: "100%",
    maxWidth: "130px",
    height: "100%",
    objectFit: "contain",
  } as React.CSSProperties,
};
