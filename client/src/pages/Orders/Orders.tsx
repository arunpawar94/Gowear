import { CSSProperties, Fragment } from "react";
import {
  Box,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  useMediaQuery,
} from "@mui/material";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import DeliveryDiningOutlinedIcon from "@mui/icons-material/DeliveryDiningOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import configJSON from "./config";
import {
  errorColor,
  extraLightPrimaryColor,
  lightTextColor,
  primaryColor,
} from "../../config/colors";

const steps = ["Order Placed", "Confirmed", "Dispatch", "Arrived", "Delivered"];

export default function Orders() {
  const size850 = useMediaQuery("(min-width:850px)");

  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage: `linear-gradient( 136deg, ${extraLightPrimaryColor} 0%, ${lightTextColor} 50%, ${primaryColor} 100%)`,
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage: `linear-gradient( 136deg, ${extraLightPrimaryColor} 0%, ${lightTextColor} 50%, ${primaryColor} 100%)`,
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      width: size850 ? "auto" : 4,
      height: size850 ? 3 : 50,
      border: 0,
      marginLeft: size850 ? 0 : 6,
      backgroundColor: "#eaeaf0",
      borderRadius: 1,
      ...theme.applyStyles("dark", {
        backgroundColor: theme.palette.grey[800],
      }),
    },
  }));

  const ColorlibStepIconRoot = styled("div")<{
    ownerState: { completed?: boolean; active?: boolean };
  }>(({ theme }) => ({
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 40,
    height: 40,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[700],
    }),
    variants: [
      {
        props: ({ ownerState }) => ownerState.active,
        style: {
          backgroundImage: `linear-gradient( 136deg, ${lightTextColor} 0%, ${primaryColor} 50%, ${lightTextColor} 100%)`,
          boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
        },
      },
      {
        props: ({ ownerState }) => ownerState.completed,
        style: {
          backgroundImage: `linear-gradient( 136deg, ${primaryColor} 0%, ${lightTextColor} 50%, ${primaryColor} 100%)`,
        },
      },
    ],
  }));

  function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    const icons: { [index: string]: React.ReactElement<unknown> } = {
      1: <Inventory2OutlinedIcon style={{ color: primaryColor }} />,
      2: <CheckRoundedIcon style={{ color: primaryColor }} />,
      3: <LocalShippingOutlinedIcon style={{ color: lightTextColor }} />,
      4: <DeliveryDiningOutlinedIcon style={{ color: primaryColor }} />,
      5: <AutoAwesomeOutlinedIcon style={{ color: primaryColor }} />,
    };

    return (
      <ColorlibStepIconRoot
        ownerState={{ completed, active }}
        className={className}
      >
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }

  function CustomizedSteppers() {
    return (
      <Stack
        sx={{ width: "100%", alignItems: size850 ? "stretch" : "center" }}
        spacing={4}
      >
        <Stepper
          alternativeLabel={Boolean(size850)}
          activeStep={2}
          connector={<ColorlibConnector />}
          orientation={size850 ? "horizontal" : "vertical"}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={ColorlibStepIcon}
                style={{ whiteSpace: "nowrap" }}
              >
                <Typography style={webStyle.stepLabel}>{label}</Typography>
                <Typography style={webStyle.stepLabelDate}>
                  Wed 04 Jul 26 11:00 AM
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Stack>
    );
  }
  const renderOrderCart = () => {
    return (
      <Box style={webStyle.mainOrderCartBox}>
        <Typography style={webStyle.orderHeader}>
          1. Order Id: Usaeau42
        </Typography>
        <Box style={webStyle.orderMainWrapperBox}>
          <Box style={webStyle.orderWrapperBox}>
            <Typography style={webStyle.orderDetailsText}>
              {configJSON.orderDetails}
            </Typography>
            <Box style={webStyle.orderBodyBox}>
              <CustomizedSteppers />
              <Box display={"flex"} alignItems={"center"} mt={1}>
                <Typography fontSize={"18px"}>{configJSON.date}:</Typography>
                <Typography pt={0.3} fontSize={"14px"}>
                  {" "}
                  &nbsp;Wed 04 Jul 26 11:00 AM
                </Typography>
              </Box>
              <Box
                display={"flex"}
                alignItems={"center"}
                flexWrap={"wrap"}
                mt={0.5}
              >
                <Typography fontSize={"18px"} whiteSpace={"nowrap"}>
                  {configJSON.paymentId}:
                </Typography>
                <Typography pt={0.2} fontSize={"16px"} color={errorColor}>
                  {" "}
                  &nbsp;uasdfjaejpjasdfa
                </Typography>
              </Box>
              <Box display={"flex"} mt={0.5} flexWrap={"wrap"}>
                <Typography fontSize={"18px"} whiteSpace={"nowrap"}>
                  {configJSON.deliveryAddress}:
                </Typography>
                <Typography mt={0.6} fontSize={"14px"}>
                  {" "}
                  &nbsp; Arun Pawar <br />
                  &nbsp;33, Mukund Khedi, Dewas
                  <br />
                  &nbsp;Madhya Pradesh, India, 455001
                  <br />
                  &nbsp;Contact No.: 8827348971
                </Typography>
              </Box>
              <Box display={"flex"} mt={0.5} flexWrap={"wrap"}>
                <Typography fontSize={"18px"} whiteSpace={"nowrap"}>
                  {configJSON.amountPaid}:
                </Typography>
                &nbsp;
                <Box pt={0.4} display={"flex"} gap={1}>
                  <Box>
                    <Typography fontWeight={"bold"} fontSize={"15px"}>
                      {configJSON.subTotal}:
                    </Typography>
                    <Typography fontWeight={"bold"} fontSize={"15px"}>
                      {configJSON.shippingCharge}:
                    </Typography>
                    <Typography fontWeight={"bold"} fontSize={"15px"}>
                      {configJSON.total}:
                    </Typography>
                  </Box>
                  <Box>
                    <Typography fontSize={"15px"}>₹547.77</Typography>
                    <Typography fontSize={"15px"}>₹0</Typography>
                    <Typography fontSize={"15px"}>₹547.77</Typography>
                  </Box>
                  <Box display={"flex"} justifyContent={"space-between"}></Box>
                </Box>
              </Box>
              <Box mt={0.5}>
                <Typography fontSize={"18px"}>
                  {configJSON.productDetail}:
                </Typography>
                <TableContainer style={{ marginTop: "8px" }}>
                  <Table>
                    <TableHead>
                      <TableRow style={{ background: extraLightPrimaryColor }}>
                        <TableCell
                          style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                        >
                          Sr. No.
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>ID</TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                          Category
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                          Color
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                          Size
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                          Quantity
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                          Amount
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>1.</TableCell>
                        <TableCell>003</TableCell>
                        <TableCell style={{ whiteSpace: "nowrap" }}>
                          Men-Topwear
                        </TableCell>
                        <TableCell>Red</TableCell>
                        <TableCell>XXL</TableCell>
                        <TableCell>3</TableCell>
                        <TableCell>₹547.77</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2.</TableCell>
                        <TableCell>003</TableCell>
                        <TableCell>Men-Topwear</TableCell>
                        <TableCell>Red</TableCell>
                        <TableCell>XXL</TableCell>
                        <TableCell>3</TableCell>
                        <TableCell>₹547.77</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };
  return (
    <Box>
      <Typography style={webStyle.headingText}>
        {configJSON.myOrders}
      </Typography>
      <Box style={webStyle.mainBody}>
        {Array(5)
          .fill(null)
          .map((item, index) => (
            <Fragment key={index}>{renderOrderCart()}</Fragment>
          ))}
      </Box>
    </Box>
  );
}

const webStyle = {
  headingText: {
    fontSize: "30px",
    padding: "15px 20px",
  },
  mainBody: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: "20px",
    marginBottom: "40px",
    borderTop: `1px solid ${lightTextColor}`,
    borderBottom: `1px solid ${lightTextColor}`,
    padding: "30px 20px",
  } as CSSProperties,
  mainOrderCartBox: {
    border: "1px solid gray",
    borderRadius: "8px",
    overflow: "hidden",
    maxWidth: "1100px",
    width: "100%",
    margin: "auto 50px",
  },
  orderHeader: {
    backgroundColor: "black",
    color: "white",
    padding: "10px",
  },
  orderMainWrapperBox: {
    padding: "5px",
    backgroundColor: "#c1c1c1",
  },
  orderWrapperBox: {
    border: "1px solid black",
  },
  orderBodyBox: {
    padding: "8px",
    backgroundColor: "white",
  },
  orderDetailsText: {
    background: "linear-gradient(to bottom,#fff,#ececec)",
    padding: "8px",
    fontSize: "18px",
  },
  stepLabel: {
    fontSize: "14px",
  },
  stepLabelDate: {
    fontSize: "12px",
  },
};
