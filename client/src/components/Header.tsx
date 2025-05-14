import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
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
  const [search, setSearch] = useState("");
  const sharedState = useSelector((state: RootState) => state.shared.cartCount);
  const userInformation = useSelector(
    (state: RootState) => state.userInfoReducer
  );
  const accessToken = useSelector(
    (state: RootState) => state.tokenReducer.token
  );
  const size450 = useMediaQuery("(min-width:450px)");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
  };

  const handleNavigation = (route: string) => {
    navigate(`/${route}`);
  };

  return (
    <Box style={webStyle.mainBox}>
      <Box display={"flex"} gap={"20px"} width={"100%"}>
        {size450 ? (
          <img
            src={gowearImage}
            alt="gowearImage"
            style={webStyle.comLogoImage}
          />
        ) : (
          <img
            src={gowearLogoImage}
            alt="gowearImage"
            style={{ width: "40px" }}
          />
        )}
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
            <IconButton>
              <Avatar
                style={{ color: "#65279b" }}
                src={userInformation.profileImage}
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
    </Box>
  );
};

export default Header;

const webStyle = {
  mainBox: {
    height: "40px",
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
