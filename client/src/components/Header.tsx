import React, { useState, useEffect, useRef } from "react";
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
  Drawer,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

import gowearImage from "../assets/gowearImageCrope.png";
import gowearLogoImage from "../assets/gowearLogoTransparent.png";
import { extraLightPrimaryColor, primaryColor } from "../config/colors";
import consfigJSON from "./config";
import { useNavigate } from "react-router-dom";
import logoutUser from "../services/logout";
import GradientCircularProgress from "./GradientCircularProgress";
import { useLocation } from "react-router-dom";

const buttonArray = [
  { label: "Home", address: "", authorize: ["user", "product_manager", "admin"], authRequired: false },
  { label: "Men", address: "categoryClothes/menswear", authorize: ["user", "product_manager", "admin"], authRequired: false },
  { label: "Women", address: "categoryClothes/womenswear", authorize: ["user", "product_manager", "admin"], authRequired: false },
  { label: "About", address: "aboutUs", authorize: ["user", "product_manager", "admin"], authRequired: false },
  { label: "Add New Product", address: "addProduct", authorize: ["product_manager", "admin"], authRequired: true },
  { label: "Users", address: "showUserlist", authorize: ["admin"], authRequired: true },
];

const Header: React.FC = () => {
  const mainBoxRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [profileImage, setProfileImage] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [navbarOffset, setNavbarOffset] = useState(0);

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
    setOpenDrawer(false);
    setAnchorEl(null);
  }, [pathname]);

  useEffect(() => {
    if (userInformation.profileImage) {
      setProfileImage(userInformation.profileImage);
    }
  }, [userInformation.profileImage]);

  useEffect(() => {
    if (mainBoxRef.current) {
      const updateOffset = () => {
        const rect = mainBoxRef.current!.getBoundingClientRect();
        let bottomStart = rect.bottom;
        if (bottomStart === 49) {
          bottomStart = 45;
        }
        if (bottomStart === 60) {
          bottomStart = 62;
        }
        setNavbarOffset(bottomStart);
      };

      updateOffset();
      window.addEventListener("resize", updateOffset);
      window.addEventListener("scroll", updateOffset);

      return () => {
        window.removeEventListener("resize", updateOffset);
        window.removeEventListener("scroll", updateOffset);
      };
    }
  }, []);

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
            marginTop: `${parseInt(navbarOffset.toString()) + 1}px`,
          },
        }}
        BackdropProps={{
          sx: {
            background: `linear-gradient(to bottom, transparent ${parseInt(navbarOffset.toString()) + 1
              }px, rgba(0,0,0,0.5) ${parseInt(navbarOffset.toString()) + 1}px)`,
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
            <>
              {
                (!item.authRequired || (item.authRequired && accessToken && item.authorize.includes(userInformation.role))) &&
                <Box
                  key={index}
                  sx={
                    pathname === `/${item.address}`
                      ? webStyle.drawerButtonActive
                      : webStyle.drawerButton
                  }
                  onClick={() => handleNavigation(item.address)}
                >
                  {item.label}
                </Box>
              }
            </>
          ))}
        </Box>
      </Drawer>
    );
  };

  return (
    <Box ref={mainBoxRef} style={{ ...webStyle.mainBox }}>
      <Box sx={webStyle.mainTopBox} onClick={() => setOpenDrawer(false)}>
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
          <Box sx={webStyle.loginButtonMainBox}>
            {size450 && (
              <>
                <IconButton
                  aria-label="wishlist"
                  title="Go to Wishlist"
                  style={{ height: "fit-content", width: "fit-content" }}
                  onClick={() => handleNavigation("wishlist")}
                >
                  <Badge badgeContent={0} sx={webStyle.badgeCountStyle}>
                    <FavoriteRoundedIcon sx={webStyle.wishCartIcon} />
                  </Badge>
                </IconButton>
                <IconButton
                  aria-label="cart"
                  title="Go to Cart"
                  style={{ height: "fit-content", width: "fit-content" }}
                  onClick={() => handleNavigation("cart")}
                >
                  <Badge
                    badgeContent={sharedState}
                    sx={webStyle.badgeCountStyle}
                  >
                    <ShoppingCartIcon sx={webStyle.wishCartIcon} />
                  </Badge>
                </IconButton>
              </>
            )}
            <Box style={webStyle.logInButtonBox}>
              <IconButton
                sx={webStyle.profileIconButton}
                onClick={handleMenuOpen}
              >
                <Avatar
                  sx={webStyle.profileAvatar}
                  src={profileImage}
                  alt="user_image"
                />
              </IconButton>
              <Typography sx={webStyle.logIn}>
                {userInformation.name.length > 10
                  ? userInformation.name.split(" ")[0]
                  : userInformation.name}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Button
            sx={webStyle.signInButton}
            onClick={() => {
              if (checkRefreshToken) {
                handleNavigation("loginSignUp");
              }
            }}
          >
            {checkRefreshToken ? (
              <>{consfigJSON.logIn}</>
            ) : (
              <GradientCircularProgress size={25} margin="1px auto" />
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
          <MenuItem
            onClick={() => handleNavigation("profile")}
            sx={webStyle.menuItemStyle}
          >
            {consfigJSON.profile}
          </MenuItem>
          <MenuItem
            onClick={() => handleNavigation("loginAndSecurity")}
            sx={webStyle.menuItemStyle}
          >
            {consfigJSON.loginAndSecurity}
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={webStyle.menuItemStyle}>
            {consfigJSON.orders}
          </MenuItem>
          {!size450 && (
            <>
              <MenuItem
                onClick={() => handleNavigation("wishlist")}
                sx={webStyle.menuItemStyle}
              >
                <Box sx={webStyle.menuItemBox}>
                  <Typography>{consfigJSON.myWishlist}</Typography>
                  <span>2</span>
                </Box>
              </MenuItem>
              <MenuItem
                onClick={() => handleNavigation("cart")}
                sx={webStyle.menuItemStyle}
              >
                <Box sx={webStyle.menuItemBox}>
                  <Typography>{consfigJSON.cart}</Typography>
                  <span>3</span>
                </Box>
              </MenuItem>
            </>
          )}
          <MenuItem onClick={handleLogout} sx={webStyle.menuItemStyle}>
            {consfigJSON.logout}
          </MenuItem>
        </Menu>
      </Box>
      {size800 ? (
        <Box style={webStyle.mainBottomBox}>
          {buttonArray.map((item, index) => (
            <>
              {(!item.authRequired || (item.authRequired && accessToken && item.authorize.includes(userInformation.role))) && <Button
                key={index}
                style={webStyle.bottomButtom}
                onClick={() => handleNavigation(item.address)}
              >
                {item.label}
              </Button>
              }</>
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
    gap: "25px",
    padding: "10px",
    "@media screen and (max-width: 600px)": {
      gap: "10px",
    },
    "@media screen and (max-width: 450px)": {
      padding: "5px",
    },
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
      borderRight: `3px solid ${primaryColor}`,
    },
  },
  drawerButtonActive: {
    borderRadius: "4px",
    padding: "8px",
    cursor: "pointer",
    backgroundColor: extraLightPrimaryColor,
    color: primaryColor,
    borderRight: `3px solid ${primaryColor}`,
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
  loginButtonMainBox: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    "@media screen and (max-width: 600px)": {
      gap: "0px",
    },
  },
  badgeCountStyle: {
    "& .MuiBadge-badge": {
      backgroundColor: "#DC2626",
      color: "white",
    },
  },
  menuItemStyle: {
    color: primaryColor,
  },
  menuItemBox: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    alignItems: "center",
    width: "100%",
    "& span": {
      background: "red",
      color: "white",
      borderRadius: "25px",
      fontSize: "12px",
      textAlign: "center",
      width: "17px",
      height: "17px",
    },
  },
  wishCartIcon: {
    color: primaryColor,
    "@media screen and (max-width: 800px)": {
      fontSize: "20px",
    },
  },
  logInButtonBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  } as React.CSSProperties,
  profileIconButton: {
    padding: "5px",
    "@media screen and (max-width: 450px)": {
      padding: "2px",
    },
  },
  profileAvatar: {
    color: primaryColor,
    width: "35px",
    height: "35px",
    "@media screen and (max-width: 800px)": {
      width: "24px",
      height: "24px",
    },
  },
  logIn: {
    fontSize: "10px",
    color: primaryColor,
    whiteSpace: "nowrap",
    marginTop: "-4px",
    maxWidth: "54px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    "@media screen and (max-width: 800px)": {
      fontSize: "8px",
    },
    "@media screen and (max-width: 450px)": {
      lineHeight: "1",
      marginTop: "-2px",
    },
  },
  signInButton: {
    background: primaryColor,
    color: "#fff",
    width: "100px",
    borderRadius: "8px",
    fontSize: "16px",
    "@media screen and (max-width: 450px)": {
      width: "90px",
      fontSize: "12px",
    },
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
