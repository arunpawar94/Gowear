import {
  Box,
  Button,
  FormControl,
  ListItemText,
  MenuItem,
  Select,
  styled,
  Typography,
  useMediaQuery,
} from "@mui/material";
import configJSON from "./config";
import {
  approvedColor,
  errorColor,
  extraLightPrimaryColor,
  primaryColor,
  rejectedColor,
} from "../../config/colors";
import womensTopwear from "../../assets/womensTopwear.jpg";
import mensTopwear from "../../assets/mensTopwear.png";
import womensBottomwear from "../../assets/womensBottomwear.jpg";
import { emptyWishlist, emptyCart } from "../../config/assets";
import { SelectChangeEvent } from "@mui/material/Select";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GradientCircularProgress from "../../components/GradientCircularProgress";

const itemArray = [
  {
    _id: "1",
    name: "radhehandycraft",
    color: "Blue",
    price: 600,
    size: "SM",
    quantity: 1,
    imageUrl: womensTopwear,
  },
  {
    _id: "2",
    name: "radhehandycraft",
    color: "Blue",
    price: 700,
    size: null,
    quantity: 3,
    imageUrl: mensTopwear,
  },
  {
    _id: "3",
    name: "radhehandycraft asd fasd fkasd fajsdkfjak ga asjdkfa;l",
    color: "Blue",
    price: 600,
    size: null,
    quantity: 1,
    imageUrl: womensBottomwear,
  },
  {
    _id: "4",
    name: "radhehandycraft asd fasd fkasd fajsdkfjak ga asjdkfa;l",
    color: "Blue",
    price: 600,
    size: null,
    quantity: 1,
    imageUrl: womensBottomwear,
  },
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 5.5 + ITEM_PADDING_TOP,
      width: 150,
    },
  },
};

interface WishlistProps {
  pageName: string;
}

interface WishlistItem {
  _id: string;
  name: string;
  color: string;
  price: number;
  size: null | string;
  quantity: number;
  imageUrl: string;
}

const initialParams = {
  pageHeading: "",
  emptyListSubText: "",
};

interface WishlistParams {
  pageHeading: string;
  emptyListSubText: string;
}

export default function WishlistCart({ pageName }: WishlistProps) {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<WishlistItem[]>(itemArray);
  const [pageParams, setPageParams] = useState<WishlistParams>(initialParams);
  const [loading, setLoading] = useState(true);

  const match850 = useMediaQuery("(min-width: 850px)");
  const match740 = useMediaQuery("(min-width: 740px)");
  const match730 = useMediaQuery("(min-width: 730px)");
  const match460 = useMediaQuery("(min-width: 460px)");

  const handleSelectChange = (
    event: SelectChangeEvent<string>,
    itemId: string,
  ) => {
    let newValue = event.target.value;
    const updateWishlist = wishlist.map((item) =>
      item._id === itemId ? { ...item, size: newValue } : item,
    );
    setWishlist(updateWishlist);
  };

  useEffect(() => {
    if (pageName === "cart") {
      const cartValues = {
        pageHeading: "Shopping Cart",
        emptyListSubText:
          "Must add items on the cart before proceed to checkout!",
      };
      setPageParams(cartValues);
    } else {
      const wishlistValues = {
        pageHeading: "My Wishlist",
        emptyListSubText: "Make a wish!",
      };
      setPageParams(wishlistValues);
    }
    setLoading(true);
    const showLoading = setTimeout(() => {
      setLoading(false);
      clearTimeout(showLoading);
    }, 500);
  }, [pageName]);

  const renderSelect = (options: string[], value: string, itemId: string) => {
    return (
      <FormControl
        sx={{
          width: 162,
          "@media(max-width: 428px)": {
            width: "100%",
          },
        }}
        size="small"
      >
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          value={value}
          name="size"
          onChange={(event) => handleSelectChange(event, itemId)}
          renderValue={(item) => (item ? item : "Select Size")}
          MenuProps={MenuProps}
          displayEmpty
          sx={webStyle.selectStyle}
          title="Select size."
        >
          {options.map((item) => (
            <MenuItem key={item} value={item} sx={webStyle.selectOptionStyle}>
              <ListItemText
                primary={item}
                style={{ textTransform: "capitalize", fontSize: "14px" }}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const renderStockBox = (quantity: number, price: number) => {
    return (
      <>
        <Typography fontSize={18} color={approvedColor} fontWeight={"bold"}>
          {configJSON.inStock}
        </Typography>
        <Typography
          style={{ textTransform: "uppercase", whiteSpace: "nowrap" }}
        >
          {configJSON.total}:{" "}
          <span style={{ fontWeight: "bold" }}>
            ₹{parseInt((quantity * price).toString())}
          </span>
        </Typography>
      </>
    );
  };

  const renderItemsList = () => {
    return (
      <Box style={webStyle.mainItemWrapperBox}>
        {wishlist.map((item) => (
          <Box
            key={item._id}
            sx={
              pageName === "cart" && !match740
                ? { ...webStyle.mainItemBox, flexDirection: "column" }
                : webStyle.mainItemBox
            }
          >
            <Box sx={webStyle.imageBox}>
              <img src={item.imageUrl} alt={`${item.name}`} />
            </Box>
            <Box sx={webStyle.itemDetailBox}>
              <EllipsisTypography style={webStyle.nameText}>
                {item.name}
              </EllipsisTypography>
              <Typography>
                <span style={{ textTransform: "uppercase" }}>
                  {configJSON.color}:
                </span>{" "}
                {item.color}
              </Typography>
              <Typography>
                <span style={{ textTransform: "uppercase" }}>
                  {configJSON.price}:
                </span>{" "}
                ₹{item.price}
              </Typography>
              {renderSelect(
                ["XS", "SM", "M", "L", "XL", "XXL"],
                item.size ? item.size : "",
                item._id,
              )}
              {pageName === "cart" && (
                <Box display={"flex"} gap="10px" alignItems="center" mt={1}>
                  <Typography style={{ textTransform: "uppercase" }}>
                    {configJSON.quantity}:
                  </Typography>
                  <Box display="flex" alignItems="center" gap="10px">
                    <Button
                      sx={webStyle.quantityButtonStyle}
                      title="Decrease quantity."
                    >
                      -
                    </Button>
                    <Typography>{item.quantity}</Typography>
                    <Button
                      sx={webStyle.quantityButtonStyle}
                      title="Increase quantity."
                    >
                      +
                    </Button>
                  </Box>
                </Box>
              )}
              {(!match460 || (pageName === "cart" && !match730)) &&
                renderStockBox(item.quantity, item.price)}
            </Box>
            {((pageName === "wishlist" && match460) ||
              (pageName === "cart" && match730)) && (
              <Box sx={webStyle.itemDetailBox}>
                {renderStockBox(item.quantity, item.price)}
              </Box>
            )}
            <Box
              sx={{
                ...webStyle.itemButtonBox,
                width: pageName === "cart" && !match850 ? "100%" : "auto",
              }}
            >
              <Button
                sx={webStyle.removeButton}
                title={"Remove from wishlist."}
              >
                {configJSON.remove}
              </Button>
              <Button sx={webStyle.buttonStyle} title="Add to cart.">
                {configJSON.addToCart}
              </Button>
              <Button
                sx={{ ...webStyle.buttonStyle, background: "#000" }}
                title="Show detail."
              >
                {configJSON.detail}
              </Button>
            </Box>
          </Box>
        ))}
        <Button
          style={{
            ...webStyle.buttonStyle,
            fontSize: "18px",
            fontWeight: "bold",
            padding: "5px 20px",
            maxWidth: match460 ? "300px" : "100%",
          }}
          onClick={() => navigate("/")}
          title="Go to Home."
        >
          {configJSON.addMoreItems}
        </Button>
      </Box>
    );
  };

  const renderAmountBox = () => {
    return (
      <Box style={webStyle.mainAmountBox}>
        <Typography style={webStyle.summaryText}>
          {configJSON.summary}
        </Typography>
        <Box style={webStyle.mainSubTotalBox}>
          <Box style={webStyle.subTotalBox}>
            <Typography fontSize={22}>{configJSON.subtotal}:</Typography>
            <Typography fontSize={22} mb={1}>
              ₹1600
            </Typography>
          </Box>
          <Box style={webStyle.subTotalBox}>
            <Typography fontSize={18}>{configJSON.shipping}:</Typography>
            <Typography fontSize={18}>₹0</Typography>
          </Box>
        </Box>
        <Box style={webStyle.subTotalBox}>
          <Typography fontSize={22}>{configJSON.total}:</Typography>
          <Typography fontSize={22} color={rejectedColor}>
            ₹1600
          </Typography>
        </Box>
        <Box style={webStyle.mainSubTotalBox}>
          <Button
            style={webStyle.goCartButton}
            onClick={() => navigate("/checkout")}
            title="Go to cart."
          >
            {configJSON.proceedToBuy}
          </Button>
          <Typography fontSize={14}>{configJSON.helpCallMsg}</Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      <Typography style={webStyle.headingText}>
        {pageParams.pageHeading}
      </Typography>
      {loading ? (
        <Box style={webStyle.loadingBox}>
          <GradientCircularProgress />
        </Box>
      ) : (
        <>
          {wishlist.length === 0 ? (
            <Box style={{ ...webStyle.loadingBox, padding: "50px 10px" }}>
              {pageName === "cart" ? (
                <>
                  <Box sx={webStyle.emptyImageBox}>
                    <img src={emptyCart} alt="empty_cart_image" />
                  </Box>
                  <Typography
                    fontSize={30}
                    color={primaryColor}
                    textAlign={"center"}
                  >
                    Your Cart is{" "}
                    <span style={{ color: errorColor }}>
                      {configJSON.empty}
                    </span>
                    !
                  </Typography>
                </>
              ) : (
                <>
                  <Box sx={webStyle.emptyImageBox}>
                    <img src={emptyWishlist} alt="empty_wishlist_image" />
                  </Box>
                  <Typography
                    fontSize={30}
                    color={primaryColor}
                    textAlign={"center"}
                  >
                    Your Wishlist is{" "}
                    <span style={{ color: errorColor }}>
                      {configJSON.empty}
                    </span>
                    !
                  </Typography>
                </>
              )}
              <Typography
                fontSize={25}
                color={primaryColor}
                textAlign={"center"}
              >
                {pageParams.emptyListSubText}
              </Typography>
              <Button
                sx={webStyle.emptyButtonStyle}
                onClick={() => navigate("/")}
              >
                {configJSON.startShopping}
              </Button>
            </Box>
          ) : (
            <Box sx={webStyle.bodyBox}>
              {renderItemsList()}
              {pageName === "cart" && renderAmountBox()}
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

const EllipsisTypography = styled(Typography)({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  wordBreak: "break-word",
  height: "25px",
  maxWidth: "150px",
});

const webStyle = {
  headingText: {
    fontSize: "35px",
    color: primaryColor,
    margin: "12px 20px",
  },
  bodyBox: {
    borderTop: "1px solid gray",
    borderBottom: "1px solid gray",
    display: "flex",
    marginBottom: "20px",
    "@media(max-width: 450px)": {
      flexDirection: "column",
    },
  } as React.CSSProperties,
  mainAmountBox: {
    padding: "10px 15px",
    background: "lightgray",
  },
  emptyButtonStyle: {
    fontSize: "20px",
    backgroundColor: primaryColor,
    color: "#fff",
    padding: "0 20px",
    borderRadius: "20px",
    marginTop: "10px",
    fontWeight: "bold",
  },
  loadingBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderTop: "1px solid gray",
    borderBottom: "1px solid gray",
    marginBottom: "20px",
    minHeight: "350px",
    flexDirection: "column",
  } as React.CSSProperties,
  summaryText: {
    fontSize: "30px",
  } as React.CSSProperties,
  mainSubTotalBox: {
    borderTop: "3px solid #000",
    borderBottom: "3px solid #000",
    padding: "10px 0",
    margin: "10px 0",
  },
  subTotalBox: {
    display: "flex",
    justifyContent: "space-between",
  },
  goCartButton: {
    background: "#000",
    color: "#fff",
    margin: "10px 0 30px",
    width: "100%",
  },
  nameText: {
    fontSize: "18px",
    fontWeight: "bold",
  } as React.CSSProperties,
  mainItemWrapperBox: {
    display: "flex",
    gap: "20px",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px 10px",
    width: "100%",
    maxHeight: "95vh",
    overflowY: "auto",
    scrollbarWidth: "none",
    boxSizing: "border-box",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  } as React.CSSProperties,
  mainItemBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    padding: "10px",
    maxWidth: "800px",
    boxShadow: `0px 0px 8px ${primaryColor}`,
    borderRadius: "8px",
    width: "100%",
    boxSizing: "border-box",
    flexWrap: "wrap",
    "@media(max-width: 600px)": {
      gap: "10px",
    },
    "@media(max-width: 460px)": {
      flexDirection: "column",
    },
  } as React.CSSProperties,
  mainItemLeftBox: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    "@media(max-width: 600px)": {
      justifyContent: "center",
      flexDirection: "column",
      gap: "10px",
    },
  } as React.CSSProperties,
  removeButton: {
    border: `1px solid ${errorColor}`,
    color: errorColor,
    width: "100%",
  },
  buttonStyle: {
    backgroundColor: primaryColor,
    color: "#fff",
    whiteSpace: "nowrap",
    width: "100%",
  } as React.CSSProperties,
  imageBox: {
    minWidth: "130px",
    "& img:first-of-type": {
      height: "150px",
      maxHeight: "150px",
      width: "100%",
      objectFit: "contain",
      "@media(max-width: 400px)": {
        height: "210px",
        maxHeight: "210px",
      },
    },
  },
  emptyImageBox: {
    minWidth: "180px",
    marginBottom: "25px",
    "& img:first-of-type": {
      height: "200px",
      maxHeight: "200px",
      width: "100%",
      objectFit: "contain",
      "@media(max-width: 400px)": {
        height: "210px",
        maxHeight: "210px",
      },
    },
  },
  itemDetailBox: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  } as React.CSSProperties,
  quantityButtonStyle: {
    backgroundColor: primaryColor,
    color: "#fff",
    minWidth: "30px",
    height: "30px",
    fontSize: "18px",
    fontWeight: "bold",
  },
  itemButtonBox: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    "@media(max-width: 630px)": {
      width: "100%",
    },
  } as React.CSSProperties,
  selectStyle: {
    height: "30px",
    fontSize: "14px",
    color: primaryColor,
    width: "120px",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: primaryColor,
      borderWidth: "1px",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: primaryColor,
      borderWidth: "1px",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: primaryColor,
      borderWidth: "1px",
    },
  },
  selectOptionStyle: {
    fontSize: "14px",
    textTransform: "capitalize",
    "&.Mui-selected": {
      backgroundColor: extraLightPrimaryColor,
    },
  },
};
