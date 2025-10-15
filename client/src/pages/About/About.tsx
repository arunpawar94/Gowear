import { Box, Typography } from "@mui/material";
import configJSON from "./config";
import { CSSProperties } from "react";

export default function Checkout() {
  return (
    <Box sx={webStyle.mainBox}>
      <Typography style={webStyle.mainHeading}>{configJSON.aboutUs}</Typography>
      <Typography style={webStyle.paraOne}>{configJSON.paraOne}</Typography>
      <Typography style={webStyle.visionHeading}>
        {configJSON.ourVisionIs}
      </Typography>
      <Typography style={webStyle.visionParaOne}>
        {configJSON.visionParaOne}
      </Typography>
      <Typography>{configJSON.visionParaTwo}</Typography>
    </Box>
  );
}

const webStyle = {
  mainBox: {
    padding: "30px 30px 40px",
    "@media(max-width: 400px)": {
      padding: "30px 10px",
    },
  },
  mainHeading: {
    fontSize: "30px",
    textDecoration: "underline",
    textAlign: "center",
  } as CSSProperties,
  paraOne: {
    marginTop: "20px",
  },
  visionHeading: {
    fontSize: "22px",
    marginTop: "10px",
  },
  visionParaOne: {
    fontWeight: "bold",
    marginTop: "10px",
    marginBottom: "10px",
  },
};
