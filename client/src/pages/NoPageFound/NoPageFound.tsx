import { Box, Button, Typography } from "@mui/material";
import React from "react";
import consfigJSON from "./config";
import { primaryColor } from "../../config/colors";

export default function NoPageFound() {
  return (
    <Box style={webStyle.mainBox}>
      <Typography sx={webStyle.codeText}>{consfigJSON.notFoundCode}</Typography>
      <Typography sx={webStyle.msgText}>{consfigJSON.notFoundMsg}</Typography>
      <Button sx={webStyle.buttonStyle}>{consfigJSON.goHome}</Button>
    </Box>
  );
}

const webStyle = {
  mainBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    height: "70vh",
  } as React.CSSProperties,
  codeText: {
    fontSize: "120px",
    lineHeight: "1em",
    color: primaryColor,
    "@media(max-width: 450px)": {
      fontSize: "80px",
    },
  },
  msgText: {
    fontSize: "40px",
    color: primaryColor,
    "@media(max-width: 450px)": {
      fontSize: "25px",
    },
  },
  buttonStyle: {
    fontSize: "20px",
    backgroundColor: primaryColor,
    color: "#fff",
    padding: "0 20px",
    borderRadius: "20px",
    marginTop: "10px",
    fontWeight: "bold",
  },
};
