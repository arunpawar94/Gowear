import {
  Box,
  Button,
  FormControl,
  Grid2,
  IconButton,
  InputAdornment,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  errorColor,
  extraLightPrimaryColor,
  lightTextColor,
  primaryColor,
} from "../config/colors";
import { CSSProperties, useEffect, useState } from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import { Country, State } from "country-state-city";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  addressLineRegex,
  cityNameRegex,
  fullNameRegex,
  mobileNoRegex,
  postalCodeRegex,
} from "../config/rejexValidation";
import getCountryCode from "../utils/getCountryName";
import { useSnackbar } from "notistack";
import configJSON from "./config";

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

interface AddressErrors {
  fullnameErr: string;
  contactNoErr: string;
  addressLineOneErr: string;
  addressLineTwoErr: string;
  cityErr: string;
  zipCodeErr: string;
  stateErr: string;
  countryErr: string;
}

interface CountryStateType {
  name: string;
  isoCode: string;
}

interface AddressModalProps {
  type: string;
  heading: string;
  address: Address | null;
  modalOpen: boolean;
  handleModalOpen?: () => void;
  handleModalClose: () => void;
  okButtonLabel: string;
  handleSubmit: (type: string, addressValue: Address) => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 5.5 + ITEM_PADDING_TOP,
      width: 150,
    },
  },
};

const initialAddress = {
  fullname: "",
  contactNo: "",
  addressLineOne: "",
  addressLineTwo: "",
  city: "",
  zipCode: "",
  state: "",
  country: "India",
};

const initialErrors = {
  fullnameErr: "",
  contactNoErr: "",
  addressLineOneErr: "",
  addressLineTwoErr: "",
  cityErr: "",
  zipCodeErr: "",
  stateErr: "",
  countryErr: "",
};

export default function AddressModal(props: AddressModalProps) {
  const {
    address,
    modalOpen,
    handleModalClose,
    heading,
    type,
    handleSubmit,
    okButtonLabel,
  } = props;

  const getAddress = address ? address : initialAddress;

  const { enqueueSnackbar } = useSnackbar();

  const [checkSubmit, setCheckSubmit] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>(getAddress);
  const [errorValues, setErrorValues] = useState<AddressErrors>(initialErrors);

  const countries: CountryStateType[] = Country.getAllCountries();
  const countryCode = getCountryCode(newAddress.country);
  const states: CountryStateType[] = countryCode
    ? State.getStatesOfCountry(countryCode.isoCode)
    : [];

  useEffect(() => {
    handleErrorsValue();
  }, [newAddress, checkSubmit]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string
  ) => {
    let newValue = event.target.value;
    if (
      (name === "fullname" && newValue && !fullNameRegex.test(newValue)) ||
      newValue.length > 100
    ) {
      return;
    }
    if (
      name === "addressLineOne" &&
      newValue &&
      !addressLineRegex.test(newValue)
    ) {
      return;
    }
    if (
      name === "addressLineTwo" &&
      newValue &&
      !addressLineRegex.test(newValue)
    ) {
      return;
    }
    if (name === "city" && newValue && !cityNameRegex.test(newValue)) {
      return;
    }
    if (name === "zipCode" && newValue && !postalCodeRegex.test(newValue)) {
      return;
    }
    if (name === "contactNo" && newValue && !mobileNoRegex.test(newValue)) {
      return;
    }

    setNewAddress((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const handleSelectChange = (
    event: SelectChangeEvent<string>,
    name: string
  ) => {
    let newValue = event.target.value;
    setNewAddress((prevState) => ({ ...prevState, [name]: newValue }));
  };

  const handleErrorsValue = () => {
    let fullnameError = "",
      contactNoError = "",
      addressLineOneError = "",
      addressLineTwoError = "",
      cityError = "",
      zipCodeError = "",
      stateError = "",
      countryError = "";
    const {
      fullname,
      contactNo,
      addressLineOne,
      city,
      zipCode,
      state,
      country,
    } = newAddress;

    if (fullname.trim().length < 3) {
      fullnameError = "Full name is too short*.";
    }
    if (!fullname.trim()) {
      fullnameError = "Fullname required*.";
    }
    if (contactNo.trim().length < 10) {
      contactNoError = "Invalid contact no.*.";
    }
    if (!contactNo.trim()) {
      contactNoError = "Contact no. required*.";
    }
    if (addressLineOne.trim().length < 5) {
      addressLineOneError = "Address is too short*.";
    }
    if (!addressLineOne.trim()) {
      addressLineOneError = "Address required*.";
    }
    if (city.trim().length < 3) {
      cityError = "City name is too short*.";
    }
    if (!city.trim()) {
      cityError = "City required*.";
    }
    if (zipCode.trim().length < 2) {
      zipCodeError = "Invalid ZIP code*.";
    }
    if (!zipCode.trim()) {
      zipCodeError = "ZIP code required*.";
    }
    if (!state.trim()) {
      stateError = "State required*.";
    }
    if (!country.trim()) {
      countryError = "Country required*.";
    }
    const errorObject = {
      fullnameErr: fullnameError,
      contactNoErr: contactNoError,
      addressLineOneErr: addressLineOneError,
      addressLineTwoErr: addressLineTwoError,
      cityErr: cityError,
      zipCodeErr: zipCodeError,
      stateErr: stateError,
      countryErr: countryError,
    };
    setErrorValues(errorObject);
  };

  const handleClear = () => {
    setCheckSubmit(false);
    setErrorValues(initialErrors);
    setNewAddress(initialAddress);
  };

  const handleModalSubmit = () => {
    setCheckSubmit(true);
    const checkError = Object.values(errorValues).some((value) => value);
    if (checkError) {
      enqueueSnackbar("Please fill required fields!", { variant: "error" });
    } else {
      handleSubmit(type, newAddress);
      handleModalClose();
      setCheckSubmit(false);
    }
  };

  const renderInput = (
    label: string,
    name: string,
    value: string,
    error: string
  ) => {
    return (
      <Box>
        <Typography mb={1} style={webStyle.inputLabelStyle}>
          {label}
          {name != "addressLineTwo" && (
            <span style={{ color: errorColor }}>*</span>
          )}{" "}
          :
        </Typography>
        <TextField
          fullWidth
          name={name}
          type="text"
          value={value}
          onChange={(event) => handleInputChange(event, name)}
          sx={
            checkSubmit && error
              ? webStyle.inputErrorStyle
              : webStyle.inputStyle
          }
          slotProps={{
            input: {
              startAdornment:
                name === "contactNo" ? (
                  <InputAdornment position="start">+91</InputAdornment>
                ) : undefined,
            },
          }}
        />
        {checkSubmit && error && (
          <Typography mt={0.5} fontSize={14} color={errorColor}>
            {error}
          </Typography>
        )}
      </Box>
    );
  };

  const handleRenderSelectValue = (value: string, name: string) => {
    let newValue;
    if (name === "country") {
      newValue = countries.find((item) => item.name === value);
    } else {
      newValue = states.find((item) => item.name === value);
    }
    if (value && newValue) {
      return newValue.name;
    } else {
      return "Select";
    }
  };

  const renderSelect = (
    label: string,
    options: CountryStateType[],
    value: string,
    name: string,
    error: string
  ) => {
    return (
      <FormControl
        sx={{
          width: "100%",
          "@media(max-width: 428px)": {
            width: "100%",
          },
        }}
        size="small"
      >
        <Typography mb={1} style={webStyle.inputLabelStyle}>
          {label}
          <span style={{ color: errorColor }}>*</span> :
        </Typography>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          value={value}
          name={name}
          onChange={(event) => handleSelectChange(event, name)}
          renderValue={(value) => handleRenderSelectValue(value, name)}
          MenuProps={MenuProps}
          displayEmpty
          sx={webStyle.selectStyle}
          disabled={name === "country" && value === "India"}
        >
          {options.map((item) => (
            <MenuItem
              key={item.isoCode}
              value={item.name}
              sx={webStyle.selectOptionStyle}
              selected={item.name === "India"}
            >
              <ListItemText
                primary={item.name}
                style={{ textTransform: "capitalize", fontSize: "14px" }}
              />
            </MenuItem>
          ))}
        </Select>
        {checkSubmit && error && (
          <Typography mt={0.5} fontSize={14} color={errorColor}>
            {error}
          </Typography>
        )}
      </FormControl>
    );
  };

  return (
    <>
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box style={webStyle.modalMainBox}>
          <Box style={webStyle.modalMainBodyBox}>
            <Box style={webStyle.headingBox}>
              <Typography style={webStyle.headingText}>{heading}</Typography>
              <IconButton onClick={handleModalClose}>
                <CloseRoundedIcon style={{ color: extraLightPrimaryColor }} />
              </IconButton>
            </Box>

            <Box style={webStyle.modalBodyBox}>
              <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
                  {renderInput(
                    "Full Name",
                    "fullname",
                    newAddress.fullname,
                    errorValues.fullnameErr
                  )}
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
                  {renderInput(
                    "Contact No.",
                    "contactNo",
                    newAddress.contactNo,
                    errorValues.contactNoErr
                  )}
                </Grid2>
              </Grid2>
              {renderInput(
                "Addres Line 1",
                "addressLineOne",
                newAddress.addressLineOne,
                errorValues.addressLineOneErr
              )}
              {renderInput(
                "Addres Line 2",
                "addressLineTwo",
                newAddress.addressLineTwo,
                errorValues.addressLineTwoErr
              )}
              <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
                  {renderInput(
                    "City",
                    "city",
                    newAddress.city,
                    errorValues.cityErr
                  )}
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
                  {renderInput(
                    "ZIP Code",
                    "zipCode",
                    newAddress.zipCode,
                    errorValues.zipCodeErr
                  )}
                </Grid2>
              </Grid2>
              <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
                  {renderSelect(
                    "State",
                    states,
                    newAddress.state,
                    "state",
                    errorValues.stateErr
                  )}
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
                  {renderSelect(
                    "Country",
                    countries,
                    newAddress.country,
                    "country",
                    errorValues.countryErr
                  )}
                </Grid2>
              </Grid2>
              <Grid2 container spacing={3} mt={2}>
                <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
                  <Button
                    style={webStyle.cancelButtonStyle}
                    onClick={handleClear}
                  >
                    {configJSON.clear}
                  </Button>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
                  <Button
                    style={webStyle.okButtonStyle}
                    onClick={handleModalSubmit}
                  >
                    {okButtonLabel}
                  </Button>
                </Grid2>
              </Grid2>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

const webStyle = {
  modalMainBox: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalMainBodyBox: {
    background: "#fff",
    width: "100%",
    maxWidth: "700px",
    maxHeight: "85vh",
    borderRadius: "8px",
    boxShadow: `0px 0px 16px 2px ${primaryColor}`,
    overflow: "auto",
    margin: "0 10px",
    scrollbarWidth: "none",
    "&::WebkitScrollbar": {
      display: "none",
    },
  } as CSSProperties,
  modalBodyBox: {
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  } as CSSProperties,
  headingBox: {
    background: "#000",
    display: "flex",
  },
  headingText: {
    color: extraLightPrimaryColor,
    fontSize: "25px",
    textAlign: "center",
    padding: "5px 0",
    width: "100%",
  } as CSSProperties,
  inputLabelStyle: {
    fontSize: "17px",
    fontWeight: "bold",
  },
  inputStyle: {
    "& .MuiOutlinedInput-root": {
      height: "45px",
      borderRadius: "6px",
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
      "&.Mui-disabled fieldset": {
        borderColor: "#65279b",
      },
    },
    "& .MuiInputBase-input": {
      fontFamily: "Arial",
      fontSize: "16px",
    },
    "& .MuiInputBase-input.Mui-disabled": {
      color: "#000",
      WebkitTextFillColor: "#000",
    },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0px 1000px #FFFFFF inset",
    },
  },
  inputErrorStyle: {
    "& .MuiOutlinedInput-root": {
      height: "45px",
      borderRadius: "6px",
      "& fieldset": {
        border: `1px solid ${errorColor}`,
      },
      "&.Mui-focused fieldset": {
        borderColor: `${errorColor}`,
        borderWidth: "1px",
        boxShadow: `0px 0px 4px 0px ${errorColor}`,
      },
      "&:hover fieldset": {
        borderColor: `${errorColor}`,
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
  selectStyle: {
    height: "45px",
    fontSize: "16px",
    width: "100%",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: primaryColor,
      borderWidth: "1px",
      borderRadius: "6px",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: primaryColor,
      borderWidth: "1px",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: primaryColor,
      borderWidth: "1px",
    },
    "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
      borderColor: primaryColor,
      borderWidth: "1px",
    },
    "& .MuiInputBase-input.Mui-disabled": {
      color: "#000",
      WebkitTextFillColor: "#000",
    },
    "& .MuiSelect-icon.Mui-disabled": {
      color: "#0000008a",
    },
  },
  selectOptionStyle: {
    fontSize: "14px",
    textTransform: "capitalize",
    "&.Mui-selected": {
      backgroundColor: extraLightPrimaryColor,
    },
  },
  cancelButtonStyle: {
    width: "100%",
    background: lightTextColor,
    color: primaryColor,
  },
  okButtonStyle: {
    width: "100%",
    background: primaryColor,
    color: "#fff",
  },
};
