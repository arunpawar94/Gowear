import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
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
  CircularProgress,
  Drawer,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

import gowearImage from "../assets/gowearImageCrope.png";
import gowearLogoImage from "../assets/gowearLogoTransparent.png";
import {
  extraLightPrimaryColor,
  primaryColor,
  lightTextColor,
} from "../config/colors";
import consfigJSON from "./config";
import { useNavigate } from "react-router-dom";
import logoutUser from "../services/logout";

const buttonArray = [
  { label: "Home", address: "" },
  { label: "Men's Topwear", address: "" },
  { label: "Men's Bottomwear", address: "" },
  { label: "Women's Topwear", address: "" },
  { label: "Women's Bottomwear", address: "" },
  { label: "Products", address: "addProduct" },
  { label: "Users", address: "showUserlist" },
];

function GradientCircularProgress() {
  return (
    <React.Fragment>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={lightTextColor} />
            <stop offset="100%" stopColor={primaryColor} />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress
        size={25}
        sx={{
          "svg circle": { stroke: "url(#my_gradient)" },
          margin: "1px auto",
        }}
      />
    </React.Fragment>
  );
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [profileImage, setProfileImage] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);

  const sharedState = useSelector((state: RootState) => state.shared.cartCount);
  const userInformation = useSelector(
    (state: RootState) => state.userInfoReducer
  );
  const accessToken = useSelector(
    (state: RootState) => state.tokenReducer.token
  );
  const checkRefreshToken = useSelector(
    (state: RootState) => state.tokenReducer.checkRefreshToken
  );
  const size450 = useMediaQuery("(min-width:450px)");
  const size800 = useMediaQuery("(min-width:800px)");

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
    logoutUser(dispatch, navigate, setAnchorEl);
  };

  const renderDrawer = () => {
    return (
      <Drawer
        open={openDrawer && !size800}
        PaperProps={{
          style: {
            width: 250,
            borderRadius: "8px",
            marginTop: size450 ? "64px" : "46px",
          },
        }}
        BackdropProps={{
          sx: {
            top: size450 ? "63px" : "45px",
          },
        }}
        variant="temporary"
        ModalProps={{
          keepMounted: true,
        }}
        onClose={() => setOpenDrawer(false)}
      >
        <Box style={webStyle.mainDrawerBox}>
          <Box style={webStyle.drawerHeaderBox}>
            <img
              src={gowearImage}
              alt="gowearImage"
              style={{ width: "100px", cursor: "pointer" }}
              onClick={() => handleNavigation("")}
            />
            <IconButton onClick={() => setOpenDrawer(false)}>
              <ClearRoundedIcon style={{ color: primaryColor }} />
            </IconButton>
          </Box>
          {buttonArray.map((item, index) => (
            <Box
              key={index}
              sx={webStyle.drawerButton}
              onClick={() => handleNavigation(item.address)}
            >
              {item.label}
            </Box>
          ))}
        </Box>
      </Drawer>
    );
  };

  return (
    <Box style={{ ...webStyle.mainBox }}>
      <Box
        style={{
          ...webStyle.mainTopBox,
          gap: size450 ? "25px" : "10px",
          padding: size450 ? "10px" : "5px",
        }}
        onClick={() => setOpenDrawer(false)}
      >
        <Box display={"flex"} gap={size450 ? "20px" : "10px"} width={"100%"}>
          {size450 ? (
            <img
              src={gowearImage}
              alt="gowearImage"
              style={webStyle.comLogoImage}
              onClick={() => handleNavigation("")}
            />
          ) : (
            <img
              src={gowearLogoImage}
              alt="gowearImage"
              style={{ width: "35px", cursor: "pointer", height: "35px" }}
              onClick={() => handleNavigation("")}
            />
          )}
          <Box flexGrow={1} style={{ width: "100%", maxWidth: "500px" }}>
            <TextField
              type="text"
              value={search}
              fullWidth
              onChange={handleSearchChange}
              sx={
                size450
                  ? webStyle.searchInputStyle
                  : webStyle.searchInputStyle450
              }
              placeholder="search"
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
              <IconButton
                style={webStyle.profileIconButton}
                onClick={handleMenuOpen}
              >
                <Avatar
                  style={webStyle.profileAvatar}
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
            sx={size450 ? webStyle.signInButton : webStyle.signInButton450}
            onClick={() => handleNavigation("loginSignUp")}
          >
            {checkRefreshToken ? (
              <>{consfigJSON.logIn}</>
            ) : (
              <GradientCircularProgress />
            )}
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
          <MenuItem onClick={handleMenuClose}>{consfigJSON.profile}</MenuItem>
          <MenuItem onClick={handleMenuClose}>{consfigJSON.orders}</MenuItem>
          <MenuItem onClick={handleMenuClose}>{consfigJSON.myWishlist}</MenuItem>
          <MenuItem onClick={handleLogout}>{consfigJSON.logout}</MenuItem>
        </Menu>
      </Box>
      {size800 ? (
        <Box style={webStyle.mainBottomBox}>
          {buttonArray.map((item, index) => (
            <Button
              key={index}
              style={webStyle.bottomButtom}
              onClick={() => handleNavigation(item.address)}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      ) : (
        <>
          {!openDrawer && (
            <Box
              style={webStyle.mainBottomButtonBox}
              onClick={() => setOpenDrawer(true)}
            >
              <NavigateNextRoundedIcon style={{ color: primaryColor }} />
            </Box>
          )}
        </>
      )}

      {renderDrawer()}
    </Box>
  );
};

export default Header;

const webStyle = {
  mainBox: {
    alignItems: "center",
    boxShadow: "0px 0px 10px 0px #965cf6",
    marginBottom: "5px",
  },
  mainTopBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    zIndex: 1301,
  } as React.CSSProperties,
  mainBottomBox: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    backgroundColor: extraLightPrimaryColor,
    padding: "5px",
  },
  mainDrawerBox: {
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  } as React.CSSProperties,
  drawerHeaderBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  drawerButton: {
    borderRadius: "4px",
    padding: "8px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: extraLightPrimaryColor,
      color: primaryColor,
    },
  },
  mainBottomButtonBox: {
    position: "absolute",
    zIndex: 50,
    backgroundColor: "#f9f1ff91",
    padding: "0px 5px",
    borderRadius: "0px 4px 4px 0px",
  } as React.CSSProperties,
  bottomButtom: {
    color: primaryColor,
    textTransform: "none",
    fontSize: "14px",
  } as React.CSSProperties,
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
  profileIconButton: {
    padding: "5px",
  },
  profileAvatar: {
    color: primaryColor,
    width: "35px",
    height: "35px",
  },
  logIn: {
    fontSize: "10px",
    color: primaryColor,
    whiteSpace: "nowrap",
    marginTop: "-4px",
  },
  signInButton: {
    background: primaryColor,
    color: "#fff",
    width: "100px",
    borderRadius: "8px",
    fontSize: "16px",
  },
  signInButton450: {
    background: primaryColor,
    color: "#fff",
    width: "90px",
    borderRadius: "8px",
    fontSize: "12px",
  },
  comLogoImage: {
    width: "120px",
    cursor: "pointer",
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
  searchInputStyle450: {
    "& .MuiOutlinedInput-root": {
      height: "33px",
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
