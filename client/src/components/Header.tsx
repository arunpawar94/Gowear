import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { setAccessToken } from "../redux/tokenSlice";
import { clearUserInformationReducer } from "../redux/userInfoSlice";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Badge,
  useMediaQuery,
  Avatar,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import gowearImage from "../assets/gowearImageCrope.png";
import gowearLogoImage from "../assets/gowearLogoTransparent.png";
import { primaryColor } from "../config/colors";
import consfigJSON from "./config";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [profileImage, setProfileImage] = useState("");

  const sharedState = useSelector((state: RootState) => state.shared.cartCount);
  const userInformation = useSelector(
    (state: RootState) => state.userInfoReducer
  );
  const accessToken = useSelector(
    (state: RootState) => state.tokenReducer.token
  );
  const size450 = useMediaQuery("(min-width:450px)");

  useEffect(() => {
    if (userInformation.profileImage) {
      setProfileImage(userInformation.profileImage);
    }
  }, [userInformation.profileImage]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
  };

  const handleNavigation = (route: string) => {
    navigate(`/${route}`);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(setAccessToken(null));
    dispatch(clearUserInformationReducer());
    document.cookie =
      "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    handleMenuClose();
    navigate("/");
  };

  return (
    <Box style={webStyle.mainBox}>
      <Box display={"flex"} gap={"20px"} width={"100%"}>
        {size450 ? (
          <img
            src={gowearImage}
            alt="gowearImage"
            style={webStyle.comLogoImage}
            onClick={()=>handleNavigation("")}
          />
        ) : (
          <img
            src={gowearLogoImage}
            alt="gowearImage"
            style={{ width: "40px", cursor: "pointer" }}
            onClick={()=>handleNavigation("")}
          />
        )}
        <Button onClick={()=>handleNavigation("addProduct")}>Add Product</Button>
        <Button onClick={()=>handleNavigation("showuserlist")}>Users</Button>
        <Box flexGrow={1} style={{ width: "100%", maxWidth: "500px" }}>
          <TextField
            type="text"
            value={search}
            fullWidth
            onChange={handleSearchChange}
            sx={webStyle.searchInputStyle}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon style={{ color: "#65279b" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      </Box>
      {accessToken ? (
        <>
          <IconButton aria-label="cart" title="Go to Cart">
            <Badge badgeContent={sharedState} sx={webStyle.badgeCountStyle}>
              <ShoppingCartIcon style={{ color: primaryColor }} />
            </Badge>
          </IconButton>
          <Box style={webStyle.logInButtonBox}>
            <IconButton onClick={handleMenuOpen}>
              <Avatar
                style={{ color: "#65279b" }}
                src={profileImage}
                alt="user_image"
              />
            </IconButton>
            <Typography style={webStyle.logIn}>
              {userInformation.name}
            </Typography>
          </Box>
        </>
      ) : (
        <Button
          sx={webStyle.signInButton}
          onClick={() => handleNavigation("loginSignUp")}
        >
          {consfigJSON.logIn}
        </Button>
      )}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleMenuClose}>{consfigJSON.logout}</MenuItem>
        <MenuItem onClick={handleMenuClose}>{consfigJSON.myAccount}</MenuItem>
        <MenuItem onClick={handleLogout}>{consfigJSON.logout}</MenuItem>
      </Menu>
    </Box>
  );
};

export default Header;

const webStyle = {
  mainBox: {
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0px 0px 10px 0px #965cf6",
    padding: "15px",
    gap: "25px",
  },
  badgeCountStyle: {
    "& .MuiBadge-badge": {
      backgroundColor: "#DC2626",
      color: "white",
    },
  },
  logInButtonBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  } as React.CSSProperties,
  logIn: {
    fontSize: "12px",
    color: primaryColor,
    whiteSpace: "nowrap",
  },
  signInButton: {
    background: primaryColor,
    color: "#fff",
    width: "100px",
    borderRadius: "8px",
    fontSize: "18px",
  },
  comLogoImage: {
    width: "120px",
    cursor: "pointer"
  },
  searchInputStyle: {
    "& .MuiOutlinedInput-root": {
      height: "40px",
      borderRadius: "25px",
      "& fieldset": {
        border: `1px solid #65279b`,
      },
      "&.Mui-focused fieldset": {
        borderColor: "#65279b",
        borderWidth: "1px",
        boxShadow: "0px 0px 4px 0px #965cf6",
      },
      "&:hover fieldset": {
        borderColor: "#65279b",
      },
    },
    "& .MuiInputBase-input": {
      fontFamily: "Arial",
      fontSize: "16px",
    },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0px 1000px #FFFFFF inset",
    },
  },
};
