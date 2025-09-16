import { Box, IconButton, Typography, styled } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { primaryColor } from "../config/colors";
import configJSON from "./config";
import { useNavigate } from "react-router-dom";

type CartBoxProps = {
  productId: string;
  name: string;
  description: string;
  price: number;
  mrp: number;
  discount: number;
  imageUrl: string;
  categorie: string;
  subCategorie: string;
  color: string;
};

export default function CarouselCart({ product }: { product: CartBoxProps }) {
  const navigate = useNavigate();
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
        <Box sx={webStyle.imgBox}>
          <img src={product.imageUrl} alt="product_image" />
        </Box>
      </Box>
      <Box sx={webStyle.detailBox}>
        <Typography style={webStyle.nameText}>{product.name}</Typography>
        <Typography>
          {configJSON.price} ₹{product.price}
        </Typography>
        <Typography style={webStyle.mrpText}>
          {configJSON.mrp}:{" "}
          <span
            style={{ ...webStyle.desText, textDecorationLine: "line-through" }}
          >
            ₹{product.mrp}
          </span>{" "}
          <span style={{ ...webStyle.desText, color: "red" }}>
            ({product.discount}% off)
          </span>
        </Typography>
        <Typography style={{ color: "green" }}>
          {configJSON.available}
        </Typography>
        <Typography
          style={webStyle.detailText}
          onClick={() =>
            navigate(
              `/viewDetail/${product.productId}?categorie=${product.categorie}&subCategorie=${product.subCategorie}&color=${product.color}`
            )
          }
        >
          {configJSON.detail}
        </Typography>
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

const webStyle = {
  detailBox: {
    marginTop: "10px",
    "& .MuiTypography-root": {
      fontSize: "14px",
      lineHeight: "1.3",
    },
  },
  nameText: {
    fontWeight: 600,
    maxWidth: "220px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  mrpText: {
    fontSize: "14px",
  },
  detailText: {
    textDecoration: "underline",
    cursor: "pointer",
  } as React.CSSProperties,
  desText: {
    fontSize: "12px",
  },
  imgWrapper: {
    display: "flex",
    justifyContent: "center",
    position: "relative",
  } as React.CSSProperties,
  addWishButton: {
    position: "absolute",
    right: "0px",
  } as React.CSSProperties,
  imgBox: {
    "& img:first-of-type": {
      height: "110px",
      maxHeight: "110px",
      width: "100%",
      objectFit: "contain",
      "@media(max-width: 400px)": {
        height: "210px",
        maxHeight: "210px",
      },
    },
  },
};
