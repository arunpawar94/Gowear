import { CSSProperties, ReactNode, useEffect, useState } from "react";
import { Box, Button, Collapse, Typography } from "@mui/material";
import configJSON from "./config";
import {
  extraLightPrimaryColor,
  primaryColor,
  rejectedColor,
} from "../../config/colors";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import { useNavigate } from "react-router-dom";
import AddressModal from "../../components/AddressModal";
import { useSnackbar } from "notistack";

interface Address {
  fullname: string;
  contactNo: string;
  addressLineOne: string;
  addressLineTwo: string;
  city: string;
  zipCode: string;
  state: string;
  country: string;
}

interface ModalParams {
  type: string;
  heading: string;
  okButtonLabel: string;
  address: Address | null;
}

const initialModalParams = {
  type: "",
  heading: "",
  okButtonLabel: "",
  address: null,
};

export default function Checkout() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [showDefaultAdd, setShowDefaultAdd] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalParams, setModalParams] =
    useState<ModalParams>(initialModalParams);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (defaultAddress === null) {
      if (currentAddress) {
        setDefaultAddress(currentAddress);
      } else {
        setOpenModal(true);
        handleModalOpen("defaultAddress");
        setShowDefaultAdd(true);
      }
    } else {
      if (!currentAddress) {
        setCurrentAddress(defaultAddress);
      }
    }
  }, []);

  const handleModalOpen = (openFor: "defaultAddress" | "currentAddress") => {
    if (openFor === "defaultAddress") {
      setModalParams({
        heading: "Default Delivery Address",
        okButtonLabel: "Set",
        type: "defaultAddress",
        address: defaultAddress,
      });
    } else {
      setModalParams({
        heading: "Current Delivery Address",
        okButtonLabel: "Change",
        type: "currentAddress",
        address: currentAddress,
      });
    }
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleModalSubmit = (type: string, addressValue: Address) => {
    if (type === "defaultAddress") {
      setDefaultAddress(addressValue);
      if (!currentAddress) {
        setCurrentAddress(addressValue);
      }
      enqueueSnackbar("Address updated successfully!", { variant: "success" });
    } else {
      setCurrentAddress(addressValue);
      enqueueSnackbar("Address change successfully!", { variant: "success" });
    }
  };

  const handleDefaultAddSetClick = () => {
    if (!defaultAddress) {
      handleModalOpen("defaultAddress");
    } else {
      setCurrentAddress(defaultAddress);
      enqueueSnackbar("Address change successfully!", { variant: "success" });
    }
  };

  const handlePayClick = () => {
    if (!currentAddress) {
      enqueueSnackbar("Please provide delivery address!", { variant: "error" });
    }
  };

  const RenderItemMainBox = ({
    children,
    heading,
  }: {
    children: ReactNode;
    heading: string;
  }) => {
    return (
      <Box style={webStyle.mainItemWrapperBox}>
        <Typography style={webStyle.itemHeading}>{heading}</Typography>
        <Box style={webStyle.wrapperBodyBox}>{children}</Box>
      </Box>
    );
  };

  const renderAddressItem = () => {
    return (
      <Box style={webStyle.mainItemWrapperBox}>
        <Typography style={webStyle.itemHeading}>
          {"Current Delivery Address"}
        </Typography>
        <Box style={webStyle.wrapperBodyBox}>
          {currentAddress && (
            <>
              {currentAddress ? (
                <Box>
                  <Typography>{currentAddress.fullname}</Typography>
                  <Typography>{currentAddress.addressLineOne}</Typography>
                  {currentAddress.addressLineTwo && (
                    <Typography>{currentAddress.addressLineTwo}</Typography>
                  )}
                  <Typography>{`${currentAddress.city}, ${currentAddress.state}`}</Typography>
                  <Typography>{currentAddress.country}</Typography>
                  <Typography>{currentAddress.zipCode}</Typography>
                  <Typography>
                    Mobile No. +91-{currentAddress.contactNo}
                  </Typography>
                </Box>
              ) : (
                <Box display="flex" justifyContent="center" pt={1} pb={1}>
                  <Typography style={{ color: primaryColor, fontSize: "18px" }}>
                    {configJSON.addressNotAvailable}
                  </Typography>
                </Box>
              )}

              <Box display="flex" flexDirection={"row-reverse"} mt={1}>
                <Button
                  style={webStyle.buttonStyle}
                  title="Change"
                  onClick={() => handleModalOpen("currentAddress")}
                >
                  {configJSON.change}
                </Button>
              </Box>
            </>
          )}

          <Box sx={webStyle.viewDefAddressBox}>
            <Box
              sx={webStyle.viewAddressButtonBox}
              onClick={() => setShowDefaultAdd(!showDefaultAdd)}
            >
              <Typography fontSize={18}>
                {configJSON.viewDefaultAddress}
              </Typography>
              {showDefaultAdd ? (
                <ExpandLessRoundedIcon />
              ) : (
                <ExpandMoreRoundedIcon />
              )}
            </Box>
            <Collapse in={showDefaultAdd} timeout={500}>
              <Box p={1}>
                {defaultAddress ? (
                  <Box>
                    <Typography>{defaultAddress.fullname}</Typography>
                    <Typography>{defaultAddress.addressLineOne}</Typography>
                    {defaultAddress.addressLineTwo && (
                      <Typography>{defaultAddress.addressLineTwo}</Typography>
                    )}
                    <Typography>{`${defaultAddress.city}, ${defaultAddress.state}`}</Typography>
                    <Typography>{defaultAddress.country}</Typography>
                    <Typography>{defaultAddress.zipCode}</Typography>
                    <Typography>
                      Mobile No. +91-{defaultAddress.contactNo}
                    </Typography>
                  </Box>
                ) : (
                  <Box display="flex" justifyContent="center" pt={1} pb={1}>
                    <Typography
                      style={{ color: primaryColor, fontSize: "18px" }}
                    >
                      {configJSON.addressNotAvailable}
                    </Typography>
                  </Box>
                )}
                <Box display="flex" flexDirection={"row-reverse"} mt={1}>
                  <Button
                    style={webStyle.buttonStyle}
                    title="Set delivery address."
                    onClick={() => handleDefaultAddSetClick()}
                  >
                    {defaultAddress
                      ? configJSON.setForDelivery
                      : configJSON.add}
                  </Button>
                </Box>
              </Box>
            </Collapse>
          </Box>
        </Box>
      </Box>
    );
  };

  const renderTotalPriceItem = () => {
    return (
      <RenderItemMainBox heading="Order Summary">
        <>
          <Box style={webStyle.mainSubTotalBox}>
            <Box style={webStyle.subTotalBox}>
              <Typography fontSize={22}>{configJSON.subtotal}:</Typography>
              <Typography fontSize={22} mb={1}>
                ₹1600
              </Typography>
            </Box>
            <Box style={webStyle.subTotalBox}>
              <Typography fontSize={18}>{configJSON.shipping}:</Typography>
              <Typography fontSize={18}>₹0</Typography>
            </Box>
          </Box>
          <Box style={webStyle.subTotalBox}>
            <Typography fontSize={22}>{configJSON.total}:</Typography>
            <Typography fontSize={22} color={rejectedColor}>
              ₹1600
            </Typography>
          </Box>
        </>
      </RenderItemMainBox>
    );
  };

  return (
    <Box style={webStyle.mainBox}>
      <Button
        style={webStyle.backButton}
        onClick={() => navigate(-1)}
        title="Back"
      >
        <ArrowBackRoundedIcon /> &ensp;{configJSON.back}
      </Button>
      <Box style={webStyle.mainBodyBox}>
        {renderAddressItem()}
        {renderTotalPriceItem()}
        <Button
          style={{
            ...webStyle.payButton,
            backgroundColor: currentAddress ? primaryColor : "gray",
          }}
          title="Pay"
          onClick={handlePayClick}
        >
          {configJSON.proceedToPay}
        </Button>
      </Box>
      <AddressModal
        type={modalParams.type}
        address={modalParams.address}
        heading={modalParams.heading}
        modalOpen={openModal}
        handleModalClose={handleModalClose}
        okButtonLabel={modalParams.okButtonLabel}
        handleSubmit={handleModalSubmit}
      />
    </Box>
  );
}

const webStyle = {
  mainBox: {
    padding: "10px 10px 20px",
  },
  backButton: {
    margin: "10px",
    fontSize: "18px",
    background: extraLightPrimaryColor,
    paddingRight: "20px",
    color: "#000",
    marginBottom: "10px",
    textTransform: "none",
  } as CSSProperties,
  mainBodyBox: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    alignItems: "center",
  } as CSSProperties,
  mainItemWrapperBox: {
    borderRadius: "8px",
    overflow: "hidden",
    width: "100%",
    maxWidth: "700px",
  },
  itemHeading: {
    background: "#000",
    color: "#fff",
    fontSize: "25px",
    textAlign: "center",
    padding: "5px 0",
  } as CSSProperties,
  wrapperBodyBox: {
    padding: "10px",
    background: "lightgray",
  },
  buttonStyle: {
    backgroundColor: "#000",
    color: "#fff",
    minWidth: "100px",
  } as CSSProperties,
  payButton: {
    color: "#fff",
    width: "100%",
    maxWidth: "700px",
  },
  mainSubTotalBox: {
    borderBottom: "3px solid #000",
    paddingBottom: "10px",
    marginBottom: "10px",
  },
  subTotalBox: {
    display: "flex",
    justifyContent: "space-between",
  },
  goCartButton: {
    background: "#000",
    color: "#fff",
    margin: "10px 0 30px",
    width: "100%",
  },
  viewAddressButtonBox: {
    display: "flex",
    justifyContent: "space-between",
    color: "black",
    padding: "8px",
    borderRadius: "5px",
    marginTop: "10px",
    cursor: "pointer",
    background: `linear-gradient(${extraLightPrimaryColor},lightgray)`,
    userSelect: "none",
  } as CSSProperties,
  viewDefAddressBox: {
    background: extraLightPrimaryColor,
    borderRadius: "5px",
  },
};
