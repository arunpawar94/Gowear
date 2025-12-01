import { Avatar, Box, IconButton, Typography, Button } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PhoneEnabledRoundedIcon from "@mui/icons-material/PhoneEnabledRounded";
import DomainRoundedIcon from "@mui/icons-material/DomainRounded";
import { CSSProperties, useEffect, useState } from "react";
import mensTopwear from "../../assets/mensTopwear.png";
import configJSON from "./config";
import {
  extraLightPrimaryColor,
  lightTextColor,
  primaryColor,
} from "../../config/colors";
import { SvgIconProps } from "@mui/material/SvgIcon";
import AddressModal from "../../components/AddressModal";
import { useSnackbar } from "notistack";

interface PersonalInfo {
  fullname: string;
  contactNo: string;
  dateOfBirth: string;
  profileImage: string;
}

interface MainAddress {
  addressLineOne: string;
  addressLineTwo: string;
  city: string;
  zipCode: string;
  state: string;
  country: string;
}

interface DeliveryAddress {
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
  address: DeliveryAddress | null;
}

const initialModalParams = {
  type: "",
  heading: "",
  okButtonLabel: "",
  address: null,
};

const initialPersonalInfo = {
  fullname: "",
  contactNo: "",
  dateOfBirth: "",
  profileImage: mensTopwear,
};

const apiData = {
  fullname: "Arun Pawar",
  dateOfBirth: "",
  contact: "",
  profileImage: "",
  mainAddress: {
    addressLineOne: "",
    addressLineTwo: "",
    city: "",
    zipCode: "",
    state: "",
    country: "India",
  },

  deliveryAddress: {
    name: "Arun Pawar",
    contact: "",
    addressLineOne: "",
    addressLineTwo: "",
    city: "",
    zipCode: "",
    state: "",
    country: "India",
  },
};

export default function Profile() {
  const [modalParams, setModalParams] =
    useState<ModalParams>(initialModalParams);
  const [openModal, setOpenModal] = useState(false);
  const [mainAddress, setMainAddress] = useState<MainAddress | null>(null);
  const [deliveryAddress, setDeliveryAddress] =
    useState<DeliveryAddress | null>(null);
  const [personalInfo, setPersonalInfo] =
    useState<PersonalInfo>(initialPersonalInfo);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setMainAddress({
      addressLineOne: apiData.mainAddress.addressLineOne,
      addressLineTwo: apiData.mainAddress.addressLineTwo,
      city: apiData.mainAddress.city,
      zipCode: apiData.mainAddress.zipCode,
      state: apiData.mainAddress.state,
      country: apiData.mainAddress.country,
    });
    setDeliveryAddress({
      fullname: apiData.deliveryAddress.name,
      contactNo: apiData.deliveryAddress.contact,
      addressLineOne: apiData.deliveryAddress.addressLineOne,
      addressLineTwo: apiData.deliveryAddress.addressLineTwo,
      city: apiData.deliveryAddress.city,
      zipCode: apiData.deliveryAddress.zipCode,
      state: apiData.deliveryAddress.state,
      country: apiData.deliveryAddress.country,
    });
  }, []);

  const handleModalOpen = (openFor: "mainAddress" | "deliveryAddress") => {
    if (openFor === "mainAddress") {
      setModalParams({
        heading: "Update Detail",
        okButtonLabel: "Update",
        type: "mainAddress",
        address: {
          fullname: personalInfo.fullname,
          contactNo: personalInfo.contactNo,
          addressLineOne: mainAddress ? mainAddress.addressLineOne : "",
          addressLineTwo: mainAddress ? mainAddress.addressLineTwo : "",
          city: mainAddress ? mainAddress.city : "",
          zipCode: mainAddress ? mainAddress.zipCode : "",
          state: mainAddress ? mainAddress.state : "",
          country: mainAddress ? mainAddress.country : "",
        },
      });
    } else {
      setModalParams({
        heading: "Default Delivery Address",
        okButtonLabel: "Update",
        type: "deliveryAddress",
        address: deliveryAddress,
      });
    }
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleModalSubmit = (
    type: string,
    addressValue: DeliveryAddress,
    dateOfBirth?: string
  ) => {
    if (type === "mainAddress") {
      setPersonalInfo((prevState) => {
        const obj = {
          fullname: addressValue.fullname,
          contactNo: addressValue.contactNo,
          profileImage: prevState.profileImage,
          dateOfBirth: dateOfBirth as string,
        };
        return obj;
      });
      setMainAddress(addressValue);
      enqueueSnackbar("Detail updated successfully!", { variant: "success" });
    } else {
      setDeliveryAddress(addressValue);
      enqueueSnackbar("Address updated successfully!", { variant: "success" });
    }
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 4 * 1024 * 1024;
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

    if (!ALLOWED_TYPES.includes(file.type)) {
      enqueueSnackbar("Format should be jpeg, png or jpg!", {
        variant: "error",
      });
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE) {
      enqueueSnackbar("Image size should be less than 4 MB!", {
        variant: "error",
      });
      e.target.value = "";
      return;
    }

    const imgURL = URL.createObjectURL(file);
    setPersonalInfo((prevState) => {
      const obj = {
        fullname: prevState.fullname,
        contactNo: prevState.contactNo,
        profileImage: imgURL,
        dateOfBirth: prevState.dateOfBirth,
      };
      return obj;
    });
  };

  const renderDetailItem = (
    label: string,
    LabelIcon: React.ComponentType<SvgIconProps>,
    value?: string
  ) => {
    return (
      <Box style={webStyle.itemBox}>
        <Box style={webStyle.itemLabelBox}>
          <Typography style={webStyle.itemLabel}>{label}:</Typography>
          <LabelIcon style={webStyle.labelIcon} />
        </Box>
        {label === "Address" || label === "Delivery Address" ? (
          <Box>
            {label === "Delivery Address" ? (
              <>
                {deliveryAddress ? (
                  <>
                    <Typography>{deliveryAddress.fullname}</Typography>
                    <Typography>{deliveryAddress.addressLineOne}</Typography>
                    <Typography>{deliveryAddress.addressLineTwo}</Typography>
                    <Typography>{`${deliveryAddress.city}, ${deliveryAddress.state}`}</Typography>
                    <Typography>{deliveryAddress.country}</Typography>
                    <Typography>{deliveryAddress.zipCode}</Typography>
                    <Typography>
                      Mobile No. {deliveryAddress.contactNo}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography>{configJSON.na}</Typography>
                  </>
                )}
              </>
            ) : (
              <>
                {mainAddress && mainAddress.addressLineOne ? (
                  <>
                    <Typography>{mainAddress.addressLineOne}</Typography>
                    <Typography>{mainAddress.addressLineTwo}</Typography>
                    {mainAddress.city && (
                      <Typography>{`${mainAddress.city}, ${mainAddress.state}`}</Typography>
                    )}
                    <Typography>{mainAddress.country}</Typography>
                    <Typography>{mainAddress.zipCode}</Typography>
                  </>
                ) : (
                  <>
                    <Typography>{configJSON.na}</Typography>
                  </>
                )}
              </>
            )}
          </Box>
        ) : (
          <Typography style={webStyle.itemValue}>{value}</Typography>
        )}
      </Box>
    );
  };
  return (
    <Box>
      <Typography style={webStyle.headingText}>{configJSON.profile}</Typography>
      <Box style={webStyle.mainBody}>
        <Box>
          <Box style={webStyle.avatarBadge}>
            <Avatar
              src={personalInfo.profileImage}
              alt="profile_image"
              style={webStyle.avatarStyle}
            />
            <IconButton style={webStyle.editIconButton} component="label">
              <EditRoundedIcon style={webStyle.badgeEdit} />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={onImageChange}
              />
            </IconButton>
          </Box>
        </Box>
        {renderDetailItem(
          "Name",
          PersonOutlineOutlinedIcon,
          personalInfo.fullname ? personalInfo.fullname : "NA"
        )}
        {renderDetailItem(
          "Date Of Birth",
          CalendarMonthRoundedIcon,
          personalInfo.dateOfBirth ? personalInfo.dateOfBirth : "NA"
        )}
        {renderDetailItem(
          "Contact",
          PhoneEnabledRoundedIcon,
          personalInfo.contactNo ? personalInfo.contactNo : "NA"
        )}
        {renderDetailItem("Address", DomainRoundedIcon, "NA")}
        <Box style={webStyle.buttonRightAlignBox}>
          <Button
            style={webStyle.okButtonStyle}
            onClick={() => handleModalOpen("mainAddress")}
          >
            {configJSON.updateBasicInfo}
          </Button>
        </Box>
        {renderDetailItem("Delivery Address", DomainRoundedIcon, "NA")}
        <Box style={webStyle.buttonRightAlignBox}>
          <Button
            style={webStyle.okButtonStyle}
            onClick={() => handleModalOpen("deliveryAddress")}
          >
            {configJSON.updateDeliveryAddress}
          </Button>
        </Box>
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
  avatarBadge: {
    position: "relative",
    width: "fit-content",
  } as CSSProperties,
  avatarStyle: {
    width: "90px",
    height: "90px",
  },
  editIconButton: {
    position: "absolute",
    bottom: -15,
    right: -15,
  } as CSSProperties,
  badgeEdit: {
    fontSize: "25px",
    color: primaryColor,
  } as CSSProperties,
  itemBox: {
    background: extraLightPrimaryColor,
    padding: "15px",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "420px",
    boxSizing: "border-box",
  } as CSSProperties,
  itemLabelBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "5px",
  },
  itemLabel: {
    fontSize: "20px",
  },
  labelIcon: {
    color: primaryColor,
  },
  itemValue: {
    fontSize: "20px",
    color: "#5d5b5b",
  },
  buttonRightAlignBox: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    maxWidth: "420px",
  },
  okButtonStyle: {
    background: primaryColor,
    color: "#fff",
  },
};
