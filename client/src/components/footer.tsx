import React from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { gowearLogoImageCrope } from "../config/assets";
import configJSON from "./config";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import { lightTextColor } from "../config/colors";

const Footer: React.FC = () => {
  const match600 = useMediaQuery("(max-width: 600px)");
  const match450 = useMediaQuery("(max-width: 450px)");
  return (
    <Box
      style={{
        ...webStyle.mainBox,
        padding: match600 ? "50px 25px" : "50px 80px",
      }}
    >
      <Box style={webStyle.logoImageBox}>
        <img
          src={gowearLogoImageCrope}
          alt="gowear_logo"
          style={{ width: match450 ? "250px" : "400px" }}
        />
      </Box>
      <Box
        style={
          match450 ? webStyle.footerMiddleBoxMatch450 : webStyle.footerMiddleBox
        }
      >
        <Box
          style={{
            ...webStyle.linkTextBox,
            alignItems: match450 ? "center" : "flex-start",
          }}
        >
          {["Home", "About Us", "Men's", "Women's"].map((item, index) => (
            <Typography sx={webStyle.linkText} key={index}>
              {item}
            </Typography>
          ))}
        </Box>
        <Box style={webStyle.contantUsBox}>
          <Typography mb={1} style={webStyle.linkText}>
            {configJSON.contactUs}
          </Typography>
          <Typography style={webStyle.contactUsSubText}>
            {configJSON.footerContactUsAddress.address}
          </Typography>
          <Typography
            style={webStyle.contactUsSubText}
          >{`Email: ${configJSON.footerContactUsAddress.email}`}</Typography>
          <Typography
            style={webStyle.contactUsSubText}
          >{`Phone: ${configJSON.footerContactUsAddress.phone}`}</Typography>
        </Box>
        <Box>
          <Typography mb={1} style={webStyle.linkText}>
            {configJSON.followUs}
          </Typography>
          <Box style={webStyle.followUsIconBox}>
            {[FacebookIcon, InstagramIcon, TwitterIcon].map((Item, index) => (
              <Item key={index} sx={webStyle.followIcon} />
            ))}
          </Box>
        </Box>
      </Box>
      <Box style={webStyle.copyRightBox}>
        <Typography>
          {`${configJSON.copyright} ${configJSON.copyrightSymbol} `}{" "}
          <span style={{ textDecoration: "underline" }}>
            {configJSON.gowear}
          </span>{" "}
          2025
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;

const webStyle = {
  mainBox: {
    background: "#000",
    color: lightTextColor,
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  } as React.CSSProperties,
  linkTextBox: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  } as React.CSSProperties,
  linkText: {
    fontSize: "18px",
    width: "fit-content",
    "&:hover": {
      textDecoration: `underline ${lightTextColor}`,
      cursor: "pointer",
    },
  },
  followIcon: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  contactUsSubText: {
    fontSize: "14px",
  },
  contantUsBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  } as React.CSSProperties,
  logoImageBox: {
    display: "flex",
    justifyContent: "center",
  },
  logoImage: {
    width: "400px",
  },
  footerMiddleBox: {
    display: "flex",
    justifyContent: "space-between",
  },
  footerMiddleBoxMatch450: {
    display: "flex",
    gap: "30px",
    alignItems: "center",
    flexDirection: "column",
  } as React.CSSProperties,
  followUsIconBox: {
    display: "flex",
    gap: "10px",
  },
  copyRightBox: {
    display: "flex",
    justifyContent: "center",
  },
};
