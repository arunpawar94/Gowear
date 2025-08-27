import { Fragment } from "react";
import { CircularProgress } from "@mui/material";
import { lightTextColor, primaryColor } from "../config/colors";

export default function GradientCircularProgress({ ...props }) {
  const { size, margin } = props;
  return (
    <Fragment>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={lightTextColor} />
            <stop offset="100%" stopColor={primaryColor} />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress
        size={size}
        sx={{
          "svg circle": { stroke: "url(#my_gradient)" },
          margin,
        }}
      />
    </Fragment>
  );
}
