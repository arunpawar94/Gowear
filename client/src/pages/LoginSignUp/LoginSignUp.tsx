import React, { useEffect, useState, useRef } from "react";
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
  InputBase,
  InputAdornment,
  IconButton,
} from "@mui/material";
import configJSON from "./config";
import { primaryColor, errorColor, lightTextColor } from "../../config/colors";
import GoogleIcon from "@mui/icons-material/Google";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { setAccessToken } from "../../redux/tokenSlice";
import { setUserInformationReducer } from "../../redux/userInfoSlice";
import refreshAccessToken from "../../services/refreshAccessToken";

const base_url = process.env.REACT_APP_API_URL;
const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

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

type ResetVerifyActionType =
  | "resetPassword"
  | "resetVerify"
  | "signUpVerify"
  | "resetPasswordEnter"
  | null;

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
  const [resetVerifyAction, setResetVerifyAction] =
    useState<ResetVerifyActionType>(null);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("Please enter OTP!");
  const [showMainPassword, setShowMainPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const dispatch = useDispatch<AppDispatch>();

  const textShow = action === "signIn" ? signInTexts : signUpTexts;
  const match600 = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    handleErrors();
    handleOtpErrorMsg();
  }, [fullName, emailId, password, confirmPassword, checkSubmit, otp]);

  const handleAcceptPolicyChange = () => {
    setAcceptPolicy(!acceptPolicy);
  };

  const handleKeepMeLoggedInChange = () => {
    setKeepLoggedIn(!keepLoggedIn);
  };

  const handleSocialSignInSignUp = (provider: string) => {
    if (action === "signUp") {
      if (!acceptPolicy) {
        setErrorSnackbarMsg("Please accept terms and conditions!");
        return;
      }
      localStorage.setItem("role", userType as string);
    }
    if (action === "signIn") {
      localStorage.setItem("keepLoggedIn", keepLoggedIn.toString());
    }
    const redirectUri = `http://localhost:3000/auth/${action}?provider=${provider}`;
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid email profile`;
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
    setShowMainPassword(false);
    setShowConfirmPassword(false);
    setUserType("user");
  };

  const handleSubmit = () => {
    setCheckSubmit(true);
    if (action === "signUp") {
      const isError = Object.values(inputErrors).some((item) => item);
      if (!isError) {
        if (acceptPolicy) {
          setCheckSubmit(false);
          const data = {
            name: fullName,
            email: emailId,
            password: password,
            role: userType,
            methodToSignUpLogin: "email",
            termsAndPolicies: acceptPolicy,
          };
          axios
            .post(`${base_url}/users/register`, data, {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((_response) => {
              setSuccessSnackbarMsg("You are registered successfully!");
              sendOtpApi("verifyEmail");
            })
            .catch((error) => {
              if (Array.isArray(error.response.data.errors)) {
                setErrorSnackbarMsg(error.response.data.errors[0]);
              } else {
                setErrorSnackbarMsg(error.response.data.errors);
              }
            });
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
        handleLogin();
      }
    }
  };

  const sendOtpApi = (
    OtpFor: "verifyEmail" | "resendVerifyEmail" | "verifyLoginEmail"
  ) => {
    const bodyData = { email: emailId };
    axios
      .post(`${base_url}/otp_verify/request`, bodyData, {
        headers: {
          "content-Type": "application/json",
        },
      })
      .then((_response) => {
        if (OtpFor === "verifyEmail") {
          setResetVerifyAction("signUpVerify");
        }
        if (OtpFor === "verifyLoginEmail") {
          setResetVerifyAction("signUpVerify");
          setSuccessSnackbarMsg("OTP send to your reginstered email.");
        }
        if (OtpFor === "resendVerifyEmail") {
          setSuccessSnackbarMsg("OTP send successfully!");
        }
      })
      .catch((error) => {
        setErrorSnackbarMsg(error.response.data.error);
      });
  };

  const verifyOtpApi = (_OtpFor: "verifyEmail") => {
    const bodyData = {
      email: emailId,
      otp: otp.join(""),
    };
    axios
      .post(`${base_url}/otp_verify/verify`, bodyData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((_response) => {
        setSuccessSnackbarMsg("Email verified successfully!");
        handleResetLoginClick();
      })
      .catch((error) => {
        setErrorSnackbarMsg(error.response.data.error);
      });
  };

  const handleLogin = async () => {
    axios
      .post(
        `${base_url}/users/login`,
        {
          email: emailId,
          password,
          keepMeLoggedIn: keepLoggedIn,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        const responseUserData = response.data.data.user;
        const userInformation = {
          id: responseUserData._id,
          email: responseUserData.email,
          name: responseUserData.name,
          role: responseUserData.role,
          profileImage: responseUserData.profileImage.imgUrl,
        };
        refreshAccessToken(dispatch);
        dispatch(setAccessToken(response.data.data.token));
        dispatch(setUserInformationReducer(userInformation));
        setSuccessSnackbarMsg("Log in successfully!");
        handleReset();
      })
      .catch((error) => {
        setErrorSnackbarMsg(error.response.data.error);
        if (error.response.data.error === "Email not verified.") {
          setCheckSubmit(false);
          sendOtpApi("verifyLoginEmail");
        }
      });
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
    if (action === "signUp" || resetVerifyAction === "resetPasswordEnter") {
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

  const handleOtpErrorMsg = () => {
    const isEmpty = otp.every((item) => !item);
    const isValid = otp.every((item) => item);
    if (isValid) {
      setOtpError("");
    } else {
      if (isEmpty) {
        setOtpError("Please enter OTP!");
      } else {
        setOtpError("Please enter valid OTP!");
      }
    }
  };

  const handleSnackbarClose = () => {
    setErrorSnackbarMsg(null);
    setSuccessSnackbarMsg(null);
  };

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return; // Only allow a single digit (0-9)

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next input if current is filled
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move focus to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData("text").trim();
    if (!/^\d{4}$/.test(paste)) return;
    const newOtp = paste.split("");
    setOtp(newOtp);
    newOtp.forEach((val, i) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i]!.value = val;
      }
    });
    inputRefs.current[3]?.focus();
    e.preventDefault();
  };

  const handleResetVerifyData = () => {
    let heading = "Verify Email!",
      buttonLabel = "Verify";
    if (resetVerifyAction === "resetPassword") {
      heading = "Reset Password!";
      buttonLabel = "Send OTP";
    }
    if (resetVerifyAction === "resetPasswordEnter") {
      heading = "Enter New Password!";
      buttonLabel = "Change";
    }
    return {
      heading,
      buttonLabel,
    };
  };

  const handleForgotPasswordClick = () => {
    handleReset();
    setResetVerifyAction("resetPassword");
  };

  const handleResetLoginClick = () => {
    handleReset();
    setResetVerifyAction(null);
    setAction("signIn");
    setCheckSubmit(false);
    setOtpError("Please enter OTP!");
    setOtp(["", "", "", ""]);
  };

  const handleResetSendOtpClick = () => {
    setCheckSubmit(true);
    if (resetVerifyAction === "resetPassword") {
      if (!inputErrors.emailErr) {
        setSuccessSnackbarMsg("OTP send succefully on the mail!");
        setResetVerifyAction("resetVerify");
        setCheckSubmit(false);
      }
    }
    if (resetVerifyAction === "resetVerify") {
      if (!otpError) {
        setSuccessSnackbarMsg("OTP verified successfully!");
        setResetVerifyAction("resetPasswordEnter");
        setCheckSubmit(false);
        setOtpError("Please enter OTP!");
      }
    }
    if (resetVerifyAction === "signUpVerify") {
      if (!otpError) {
        verifyOtpApi("verifyEmail");
      }
    }
    if (resetVerifyAction === "resetPasswordEnter") {
      if (!inputErrors.passwordErr && !inputErrors.confirmPasswordErr) {
        setSuccessSnackbarMsg("Password changed successfully!");
        handleResetLoginClick();
      }
    }
  };

  const handleResendOtpClick = () => {
    sendOtpApi("resendVerifyEmail");
  };

  const handleShowPassword = (name: string) => {
    if (name === "password") {
      setShowMainPassword(!showMainPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const renderInputs = (
    name: string,
    placeholder: string,
    value: string,
    error: string,
    showPassword?: boolean
  ) => {
    const isPassword = name === "password" || name === "confirmPassword";
    return (
      <Box style={{ width: "100%" }}>
        <TextField
          name={name}
          value={value}
          placeholder={placeholder}
          fullWidth
          type={isPassword && !showPassword ? "password" : "text"}
          sx={
            checkSubmit && error
              ? webStyle.inputErrorStyle
              : webStyle.inputStyle
          }
          slotProps={{
            input: {
              autoComplete: "off",
              endAdornment: isPassword ? (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => handleShowPassword(name)}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ) : (
                <></>
              ),
            },
          }}
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

  const signInSignUpGrid = () => {
    return (
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
              <Box
                style={webStyle.iconBox}
                onClick={() => handleSocialSignInSignUp("google")}
              >
                <GoogleIcon style={{ color: primaryColor }} />
              </Box>
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
                    inputErrors.passwordErr,
                    showMainPassword
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
                    inputErrors.passwordErr,
                    showMainPassword
                  )}
                  {renderInputs(
                    "confirmPassword",
                    "Confirm Password*",
                    confirmPassword,
                    inputErrors.confirmPasswordErr,
                    showConfirmPassword
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
                    <span style={webStyle.privacyText}>privacy policy</span> and{" "}
                    <span style={webStyle.privacyText}>terms of use</span>.
                  </Typography>
                </Box>
              ) : (
                <>
                  <Box style={webStyle.policyTermBox}>
                    <Checkbox
                      sx={webStyle.checkboxCheckedColor}
                      checked={keepLoggedIn}
                      onClick={handleKeepMeLoggedInChange}
                    />
                    <Typography>{configJSON.keepMeLogIn}</Typography>
                  </Box>
                  <Typography
                    style={webStyle.forgotPassword}
                    onClick={handleForgotPasswordClick}
                  >
                    {configJSON.forgotPassword}.
                  </Typography>
                </>
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
    );
  };

  const renderResetPassVerifyEmail = () => {
    const resetVerifyObject = handleResetVerifyData();
    return (
      <Box style={{ ...webStyle.resVerMainBox }}>
        <Typography mb={1} style={webStyle.signInHeadingText}>
          {resetVerifyObject.heading}
        </Typography>
        <Box style={webStyle.resetInputs}>
          {resetVerifyAction === "resetPassword" &&
            renderInputs("email", "Email*", emailId, inputErrors.emailErr)}
          {resetVerifyAction === "resetPasswordEnter" && (
            <>
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
          {(resetVerifyAction === "resetVerify" ||
            resetVerifyAction === "signUpVerify") && (
            <Box>
              <Box display="flex" gap={2} onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <InputBase
                    key={i}
                    inputRef={(el) => (inputRefs.current[i] = el)}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    inputProps={{ maxLength: 1 }}
                    style={{
                      width: "50px",
                      height: "50px",
                      textAlign: "center",
                      fontSize: "20px",
                      border: `1px solid ${primaryColor}`,
                      paddingLeft: "18px",
                      borderRadius: "4px",
                      backgroundColor: lightTextColor,
                      boxShadow: "0px 0px 4px 0px #965cf6",
                      marginTop: "10px",
                    }}
                  />
                ))}
              </Box>
              {checkSubmit && otpError && (
                <Typography mt={0.5} mb={-2} fontSize={14} color={errorColor}>
                  {otpError}
                </Typography>
              )}
            </Box>
          )}
        </Box>
        <Box style={webStyle.resVerButtonBox}>
          {(resetVerifyAction === "resetVerify" ||
            resetVerifyAction === "signUpVerify") && (
            <Button
              style={{ ...webStyle.clearButton, marginTop: "20px" }}
              onClick={handleResendOtpClick}
            >
              {configJSON.resend}
            </Button>
          )}
          <Button
            sx={{ ...webStyle.signInButton, marginTop: "20px" }}
            onClick={handleResetSendOtpClick}
          >
            {resetVerifyObject.buttonLabel}
          </Button>
        </Box>
        <Typography
          style={{ marginTop: "10px" }}
          onClick={handleResetLoginClick}
        >
          Back to <span style={webStyle.privacyText}>Login</span>
        </Typography>
      </Box>
    );
  };
  return (
    <Box style={webStyle.mainBox}>
      {!resetVerifyAction ? (
        <Box
          style={{ ...webStyle.inMainBox, width: match600 ? "100%" : "auto" }}
        >
          {signInSignUpGrid()}
        </Box>
      ) : (
        <Box
          style={{
            ...webStyle.inMainBox,
            width: "100%",
            maxWidth: "500px",
            height: "auto",
          }}
        >
          {renderResetPassVerifyEmail()}
        </Box>
      )}

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
  forgotPassword: {
    margin: "-20px auto 15px",
    color: primaryColor,
    textDecoration: "underline",
    cursor: "pointer",
  },
  resVerMainBox: {
    padding: "20px",
    width: "100%",
  },
  resetInputs: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  } as React.CSSProperties,
  mainGridContainer: {
    transition: "transform 0.5s",
  } as React.CSSProperties,
  leftGrid: {
    transition: "transform 0.5s",
  },
  rightGrid: {
    transition: "transform 0.5s",
  },
  resVerButtonBox: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "10px",
  } as React.CSSProperties,
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
  clearButton: {
    background: lightTextColor,
    color: primaryColor,
    width: "100%",
    maxWidth: "150px",
    borderRadius: "8px",
    fontSize: "18px",
    whiteSpace: "nowrap",
  },
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
      WebkitBoxShadow: `0 0 0px 1000px ${lightTextColor} inset`,
      height: "10px",
    },
    "& input::-ms-reveal": {
      display: "none",
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
      WebkitBoxShadow: `0 0 0px 1000px ${lightTextColor} inset`,
      height: "10px",
    },
    "& input::-ms-reveal": {
      display: "none",
    },
  },
};
