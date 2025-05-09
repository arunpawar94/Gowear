import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid2 as Grid,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Snackbar,
  Alert,
  useMediaQuery,
} from "@mui/material";
import configJSON from "./config";
import { primaryColor, errorColor, lightTextColor } from "../../config/colors";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import { linkedInIcon, gitHubIcon } from "../../config/assets";

const signInTexts = {
  activeHeading: configJSON.signIn,
  activeSubText: configJSON.orUseEmailPassword,
  activeButton: configJSON.signIn,
  inActHeading: configJSON.helloFriend,
  inActSubText: configJSON.signUpSubText,
  inActButton: configJSON.signUp,
};

const signUpTexts = {
  activeHeading: configJSON.createAccount,
  activeSubText: configJSON.orUseEmailRegistration,
  activeButton: configJSON.signUp,
  inActHeading: configJSON.welcomeBack,
  inActSubText: configJSON.signInSubText,
  inActButton: configJSON.signIn,
};

const noErrorValues = {
  fullNameErr: "",
  emailErr: "",
  passwordErr: "",
  confirmPasswordErr: "",
};

type ActionType = "signIn" | "signUp";

type UserType = "user" | "product_manager" | "admin" | null;

type InputErrors = {
  fullNameErr: string;
  emailErr: string;
  passwordErr: string;
  confirmPasswordErr: string;
};

type SnackbarType = string | null;

export default function LoginSignUp() {
  const [action, setAction] = useState<ActionType>("signIn");
  const [acceptPolicy, setAcceptPolicy] = useState<boolean>(false);
  const [userType, setUserType] = useState<UserType>("user");
  const [fullName, setFullName] = useState<string>("");
  const [emailId, setEmailId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [inputErrors, setInputErrors] = useState<InputErrors>(noErrorValues);
  const [checkSubmit, setCheckSubmit] = useState<boolean>(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState<boolean>(false);
  const [errorSnackbarMsg, setErrorSnackbarMsg] = useState<SnackbarType>(null);
  const [successSnackbarMsg, setSuccessSnackbarMsg] =
    useState<SnackbarType>(null);

  const textShow = action === "signIn" ? signInTexts : signUpTexts;
  const match600 = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    handleErrors();
  }, [fullName, emailId, password, confirmPassword, checkSubmit]);

  const handleAcceptPolicyChange = () => {
    setAcceptPolicy(!acceptPolicy);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string
  ) => {
    const { value } = event.target;
    if (name === "user_type") {
      setUserType(value as UserType);
    }
    if (name === "fullName") {
      setFullName(value);
    }
    if (name === "email") {
      setEmailId(value.trim());
    }
    if (name === "password") {
      setPassword(value.trim());
    }
    if (name === "confirmPassword") {
      setConfirmPassword(value.trim());
    }
  };

  const handleActionChange = () => {
    handleReset();
    setAction(action === "signIn" ? "signUp" : "signIn");
  };

  const handleReset = () => {
    setFullName("");
    setEmailId("");
    setPassword("");
    setConfirmPassword("");
    setAcceptPolicy(false);
    setCheckSubmit(false);
    setUserType("user");
  };

  const handleSubmit = () => {
    setCheckSubmit(true);
    if (action === "signUp") {
      const isError = Object.values(inputErrors).some((item) => item);
      if (!isError) {
        if (acceptPolicy) {
          setSuccessSnackbarMsg("You are registered successfully!");
          handleActionChange();
        } else {
          setErrorSnackbarMsg("Please accept terms and conditions!");
        }
      }
    } else {
      if (
        emailId &&
        password &&
        !inputErrors.emailErr &&
        !inputErrors.passwordErr
      ) {
        setSuccessSnackbarMsg("Log in successfully!");
        handleReset();
      }
    }
  };

  const handleErrors = () => {
    let fullNameError = "",
      emailError = "",
      passwordError = "",
      confirmPasswordError = "";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      emailId
    );
    if (fullName.trim().length < 3) {
      fullNameError = "Full name must have at least three characters*.";
    }
    if (!fullName.trim()) {
      fullNameError = "Full name is required*.";
    }
    if (!emailRegex) {
      emailError = "Invalid email id*.";
    }
    if (!emailId.trim()) {
      emailError = "Email is required*.";
    }
    if (action === "signUp") {
      passwordError = handlePasswordErrorMsg();
    } else {
      if (!password.trim()) {
        passwordError = "Password is required*.";
      }
    }
    if (password.trim() !== confirmPassword.trim()) {
      confirmPasswordError = "Confirm Password should be match with password*.";
    }
    const errorsValue = {
      fullNameErr: fullNameError,
      emailErr: emailError,
      passwordErr: passwordError,
      confirmPasswordErr: confirmPasswordError,
    };
    setInputErrors(errorsValue);
  };

  const handlePasswordErrorMsg = () => {
    let error = "";
    const lowerCaseRegex = /^(?!.*[a-z]).*$/.test(password);
    const upperCaseRegex = /^(?!.*[A-Z]).*$/.test(password);
    const numberRegex = /^(?!.*\d).*$/.test(password);
    const specialCharacterRegex =
      /^(?!.*[!@#$%^&()_\-+={};:'",<.>\/?\\|`~]).*$/.test(password);
    if (password.trim().length < 8) {
      error = "Password must have minimum eight character*.";
    }
    if (lowerCaseRegex) {
      error = "Password must have one lower case letter*.";
    }
    if (upperCaseRegex) {
      error = "Password must have one upper case letter*.";
    }
    if (numberRegex) {
      error = "Password must have one numeric value*.";
    }
    if (specialCharacterRegex) {
      error = "Password must have one special character*.";
    }
    if (!password.trim()) {
      error = "Password is required*.";
    }
    return error;
  };

  const handleSnackbarClose = () => {
    setErrorSnackbarMsg(null);
    setSuccessSnackbarMsg(null);
  };

  const renderInputs = (
    name: string,
    placeholder: string,
    value: string,
    error: string
  ) => {
    return (
      <Box style={{ width: "100%" }}>
        <TextField
          name={name}
          value={value}
          placeholder={placeholder}
          fullWidth
          type="text"
          sx={
            checkSubmit && error
              ? webStyle.inputErrorStyle
              : webStyle.inputStyle
          }
          onChange={(event) => handleInputChange(event, name)}
        />
        {checkSubmit && error && (
          <Typography mt={0.1} mb={-2} fontSize={14} color={errorColor}>
            {error}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Box style={webStyle.mainBox}>
      <Box style={{ ...webStyle.inMainBox, width: match600 ? "100%" : "auto" }}>
        <Grid
          container
          sx={{
            ...webStyle.mainGridContainer,
            transform: action === "signUp" ? "scaleX(-1)" : "scaleX(1)",
            width: match600 ? "100%" : "auto",
          }}
          spacing={1}
        >
          <Grid
            sx={{
              ...webStyle.leftGrid,
              transform: action === "signUp" ? "scaleX(-1)" : "scaleX(1)",
            }}
            size={{ xs: 12, sm: 6, lg: 6 }}
          >
            <Box sx={webStyle.inMainLeftBox}>
              <Typography style={webStyle.signInHeadingText}>
                {textShow.activeHeading}
              </Typography>
              <Box style={webStyle.iconWrapperBox}>
                {[
                  GoogleIcon,
                  FacebookOutlinedIcon,
                  gitHubIcon,
                  linkedInIcon,
                ].map((Item, index) => (
                  <Box key={index} style={webStyle.iconBox}>
                    {index === 0 || index === 1 ? (
                      <Item style={{ color: primaryColor }} />
                    ) : (
                      <img
                        src={Item}
                        alt="loginSocialIcon"
                        style={webStyle.socialIconImages}
                      />
                    )}
                  </Box>
                ))}
              </Box>
              <Typography style={webStyle.emailPassSubText}>
                {textShow.activeSubText}
              </Typography>
              <Box style={webStyle.inputWrapperBox}>
                {action === "signUp" && (
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    value={userType}
                    row
                    onChange={(event) => handleInputChange(event, "user_type")}
                    style={{ marginBottom: "-15px", marginTop: "-10px" }}
                  >
                    <FormControlLabel
                      value="user"
                      control={<Radio sx={webStyle.radioButtonStyle} />}
                      label="User"
                      sx={webStyle.radioControllerStyle}
                    />
                    <FormControlLabel
                      value="product_manager"
                      control={<Radio sx={webStyle.radioButtonStyle} />}
                      label="Product Manager"
                      sx={webStyle.radioControllerStyle}
                    />
                    <FormControlLabel
                      value="admin"
                      control={<Radio sx={webStyle.radioButtonStyle} />}
                      label="Admin"
                      sx={webStyle.radioControllerStyle}
                    />
                  </RadioGroup>
                )}
                {action === "signIn" ? (
                  <>
                    {renderInputs(
                      "email",
                      "Email*",
                      emailId,
                      inputErrors.emailErr
                    )}
                    {renderInputs(
                      "password",
                      "Password*",
                      password,
                      inputErrors.passwordErr
                    )}
                  </>
                ) : (
                  <>
                    {renderInputs(
                      "fullName",
                      "Full Name*",
                      fullName,
                      inputErrors.fullNameErr
                    )}
                    {renderInputs(
                      "email",
                      "Email*",
                      emailId,
                      inputErrors.emailErr
                    )}
                    {renderInputs(
                      "password",
                      "Password*",
                      password,
                      inputErrors.passwordErr
                    )}
                    {renderInputs(
                      "confirmPassword",
                      "Confirm Password*",
                      confirmPassword,
                      inputErrors.confirmPasswordErr
                    )}
                  </>
                )}
                {action === "signUp" ? (
                  <Box style={webStyle.policyTermBox}>
                    <Checkbox
                      sx={webStyle.checkboxCheckedColor}
                      checked={acceptPolicy}
                      onClick={handleAcceptPolicyChange}
                    />
                    <Typography style={{ fontSize: "12px" }}>
                      I hereby consent to the{" "}
                      <span style={webStyle.privacyText}>privacy policy</span>{" "}
                      and <span style={webStyle.privacyText}>terms of use</span>
                      .
                    </Typography>
                  </Box>
                ) : (
                  <Box style={webStyle.policyTermBox}>
                    <Checkbox
                      sx={webStyle.checkboxCheckedColor}
                      checked={keepLoggedIn}
                    />
                    <Typography>{configJSON.keepMeLogIn}</Typography>
                  </Box>
                )}
                <Button sx={webStyle.signInButton} onClick={handleSubmit}>
                  {textShow.activeButton}
                </Button>
                {match600 && (
                  <>
                    {action === "signUp" ? (
                      <Typography fontSize={14}>
                        Already have have an account?{" "}
                        <span
                          style={webStyle.privacyText}
                          onClick={() => handleActionChange()}
                        >
                          Sign In!
                        </span>
                      </Typography>
                    ) : (
                      <Typography fontSize={14}>
                        Don't have an account?{" "}
                        <span
                          style={webStyle.privacyText}
                          onClick={() => handleActionChange()}
                        >
                          Sign Up!
                        </span>
                      </Typography>
                    )}
                  </>
                )}
              </Box>
            </Box>
          </Grid>
          {!match600 && (
            <Grid
              sx={{
                ...webStyle.rightGrid,
                transform: action === "signUp" ? "scaleX(-1)" : "scaleX(1)",
              }}
              size={{ xs: 12, sm: 6, lg: 6 }}
            >
              <Box
                style={{
                  ...webStyle.inMainRightBox,
                  borderRadius:
                    action === "signIn"
                      ? "100px 20px 20px 100px"
                      : "20px 100px 100px 20px",
                }}
              >
                <Typography style={webStyle.helloFriendText}>
                  {textShow.inActHeading}
                </Typography>
                <Typography style={webStyle.signUpSubText}>
                  {textShow.inActSubText}
                </Typography>
                <Button
                  sx={webStyle.signUpButton}
                  onClick={() => handleActionChange()}
                >
                  {textShow.inActButton}
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
      <Snackbar
        open={Boolean(errorSnackbarMsg)}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorSnackbarMsg}
        </Alert>
      </Snackbar>
      <Snackbar
        open={Boolean(successSnackbarMsg)}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {successSnackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

const webStyle = {
  mainBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  inMainBox: {
    display: "flex",
    borderRadius: "20px",
    boxShadow: `0px 0px 16px 2px ${primaryColor}`,
    margin: "50px 10px",
    height: "650px",
  },
  mainGridContainer: {
    transition: "transform 0.5s",
  } as React.CSSProperties,
  leftGrid: {
    transition: "transform 0.5s",
  },
  rightGrid: {
    transition: "transform 0.5s",
  },
  inMainLeftBox: {
    padding: "25px 40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: "15px",
    height: "100%",
    maxHeight: "600px",
    "@media (max-width: 900px)": {
      padding: "25px 10px",
    },
  } as React.CSSProperties,
  inMainRightBox: {
    padding: "25px",
    background: primaryColor,
    borderRadius: "100px 20px 20px 100px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    color: "#fff",
    gap: "20px",
    height: "100%",
    marginBottom: "50px",
    maxHeight: "600px",
  } as React.CSSProperties,
  policyTermBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "-10px",
  },
  helloFriendText: {
    fontSize: "30px",
    fontWeight: "bold",
  },
  signUpSubText: {
    fontSize: "18px",
    textAlign: "center",
  } as React.CSSProperties,
  inputWrapperBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "25px",
    width: "100%",
  } as React.CSSProperties,
  signInButton: {
    background: primaryColor,
    color: "#fff",
    width: "100%",
    maxWidth: "150px",
    borderRadius: "8px",
    fontSize: "18px",
    marginTop: "-20px",
  },
  signUpButton: {
    background: primaryColor,
    border: "1px solid #fff",
    color: "#fff",
    fontSize: "18px",
    width: "100%",
    maxWidth: "150px",
    borderRadius: "8px",
  },
  iconBox: {
    width: "40px",
    height: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "8px",
    border: `2px solid ${primaryColor}`,
    cursor: "pointer",
  },
  signInHeadingText: {
    fontSize: "30px",
    fontWeight: "bold",
  },
  emailPassSubText: {
    fontSize: "20px",
  },
  radioControllerStyle: {
    mr: "12px",
    "@media (max-width: 700px)": {
      "& .MuiFormControlLabel-label": {
        fontSize: "13px",
      },
    },
  },
  radioButtonStyle: {
    color: primaryColor,
    "&.Mui-checked": {
      color: primaryColor,
    },
    padding: "5px",
    "@media (max-width: 620px)": {
      "& .MuiSvgIcon-root": {
        width: 20,
        height: 20,
      },
    },
  },
  checkboxCheckedColor: {
    color: primaryColor,
    "&.Mui-checked": {
      color: primaryColor,
    },
  },
  privacyText: {
    color: primaryColor,
    textDecoration: "underline",
    cursor: "pointer",
  },
  iconWrapperBox: {
    display: "flex",
    gap: "10px",
  },
  socialIconImages: {
    width: "24px",
  },
  inputStyle: {
    "& .MuiOutlinedInput-root": {
      height: "45px",
      borderRadius: "6px",
      background: lightTextColor,
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
};
