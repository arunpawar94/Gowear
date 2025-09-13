import { Box, Button, Typography } from "@mui/material";
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
  const renderDetailView = () => {
    return (
      <Box style={webStyle.mainDetailBox}>
        <Box style={webStyle.detailLeftBox}>
          <Box style={webStyle.detailLeftArrayBox}>
            {Array(5)
              .fill(null)
              .map((_item, index) =>
                renderImageSelectBox(mensTopwear, index, undefined)
              )}
          </Box>
          <img src={mensTopwear} />
        </Box>
        <Box>
          <Typography style={webStyle.categorieLabel}>
            Men Collection
          </Typography>
          <Typography style={webStyle.productName}>
            Scott International Shirt for Men
          </Typography>
          <Typography sx={webStyle.mrpText}>
            <span>₹1699</span> <span>(56% OFF)</span>
          </Typography>
          <Typography style={webStyle.priceText}>₹ 747.56</Typography>
          <Box>
            <Typography style={webStyle.colorText}>Color</Typography>
            <Box style={webStyle.colorArrayBox}>
              {Array(5)
                .fill(null)
                .map((_item, index) =>
                  renderImageSelectBox(mensTopwear, index, "dark Navy")
                )}
            </Box>
          </Box>
          <Box>
            <Typography style={webStyle.colorText}>Select Size</Typography>
            <Box style={webStyle.sizeArrayBox}>
              {configJSON.sizeArray.map((item, index) => (
                <Box key={index} sx={webStyle.sizeBox}>
                  <Typography>{item}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
          <Typography style={webStyle.inStockText}>In Stock</Typography>
          <Box style={webStyle.buttonBox}>
            <Button style={webStyle.activeButton}>
              <FavoriteRoundedIcon sx={webStyle.wishCartIcon} />
              Wishlist
            </Button>
            <Button style={webStyle.activeButton}>
              <ShoppingCartIcon sx={webStyle.wishCartIcon} />
              Add to cart
            </Button>
          </Box>
        </Box>
      </Box>
    );
  };
  return <Box>{renderDetailView()}</Box>;
}

const webStyle = {
  mainDetailBox: {
    display: "flex",
    gap: "25px",
    margin: "auto",
    justifyContent: "center",
    padding: "20px 0",
  },
  detailLeftBox: {
    display: "flex",
    gap: "25px",
  },
  detailLeftArrayBox: {
    display: "flex",
    gap: "12px",
    flexDirection: "column",
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
    margin: "5px 0 10px",
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
