import { Box, Skeleton, styled } from "@mui/material";
import { primaryColor } from "../config/colors";

export default function CartBoxSkeleton() {
  return (
    <MainBox>
      <Box style={webStyle.imgWrapper}>
        <Skeleton variant="rectangular" style={webStyle.skeletonImgStyle} />
      </Box>
      <Box mt={2}>
        <Skeleton width="60%" />
        <Skeleton />
        <Skeleton width={100} />
        <Skeleton width="100%" height={50} style={{ margin: "0 0 -4px" }} />
        <Skeleton width="100%" height={50} />
      </Box>
    </MainBox>
  );
}

const MainBox = styled(Box)({
  padding: "10px",
  borderRadius: "12px",
  boxShadow: `0px 0px 4px #65279b29`,
  "&:hover": {
    boxShadow: `0px 0px 8px ${primaryColor}`,
  },
});

const webStyle: { [key: string]: React.CSSProperties } = {
  imgWrapper: {
    display: "flex",
    justifyContent: "center",
    position: "relative",
  },
  skeletonImgStyle: {
    width: "100%",
    height: "190px",
  } as React.CSSProperties,
};
