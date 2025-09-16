import { Box, Button, IconButton, Typography, styled } from "@mui/material";
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

export default function CartBox({ product }: { product: CartBoxProps }) {
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
        <img
          src={product.imageUrl}
          alt="product_image"
          style={webStyle.imgStyle}
        />
      </Box>
      <Box style={webStyle.detailBox}>
        <Typography style={webStyle.nameText}>{product.name}</Typography>
        <EllipsisTypography style={webStyle.desText}>
          {product.description}
        </EllipsisTypography>
        <Typography>Price ₹{product.price}</Typography>
        <Typography style={webStyle.mrpText}>
          M.R.P:{" "}
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
        <Box style={webStyle.buttonBox}>
          <AddButton>{configJSON.addToCart}</AddButton>
          <DetailButton
            onClick={() =>
              navigate(
                `/viewDetail/${product.productId}?categorie=${product.categorie}&subCategorie=${product.subCategorie}&color=${product.color}`
              )
            }
          >
            {configJSON.viewDetail}
          </DetailButton>
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
    maxWidth: "220px",
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
    height: "190px",
    maxHeight: "190px",
    objectFit: "contain",
  } as React.CSSProperties,
};
