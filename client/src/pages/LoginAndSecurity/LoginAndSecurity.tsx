import {
  Box,
  Button,
  Grid2,
  IconButton,
  InputAdornment,
  InputBase,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import configJSON from "./config";
import {
  errorColor,
  extraLightPrimaryColor,
  lightTextColor,
  primaryColor,
  rejectedColor,
} from "../../config/colors";
import { CSSProperties, useEffect, useRef, useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useSnackbar } from "notistack";
import logoutUser from "../../services/logout";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";

type InputErrors = {
  emailErr: string;
  passwordErr: string;
  newPasswordErr: string;
  confirmPasswordErr: string;
};

const noErrorValues = {
  emailErr: "",
  passwordErr: "",
  newPasswordErr: "",
  confirmPasswordErr: "",
};

export default function LoginAndSecurity() {
  const [userData, setUserData] = useState({
    email: "myemail@gmail.com"
  })
  const [openModal, setOpenModal] = useState(false);
  const [modalOpenFor, setModalOpenFor] = useState("");
  const [modalHeading, setModalHeading] = useState("");
  const [checkSubmit, setCheckSubmit] = useState(false);
  const [showMainPassword, setShowMainPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("Please enter OTP!");
  const [confirmDelete, setConfirmDelete] = useState("");
  const [confirmDeleteError, setConfirmDeleteError] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailId, setEmailId] = useState<string>("");
  const [inputErrors, setInputErrors] = useState<InputErrors>(noErrorValues);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    handleErrors();
    handleOtpErrorMsg();
  }, [password, newPassword, confirmPassword, emailId, checkSubmit, modalOpenFor, otp, confirmDelete]);

  const handleErrors = () => {
    let emailError = "",
      passwordError = "",
      newPasswordError = "",
      confirmPasswordError = "";

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      emailId
    );
    if (!emailRegex) {
      emailError = "Invalid email id*.";
    }
    if (!emailId.trim()) {
      emailError = "Email is required*.";
    }
    if (modalOpenFor === "verifyPassEmailUpdate" && !password.trim()) {
      passwordError = "Password is required*.";
    }
    if (modalOpenFor === "verifyPassChangePassword") {
      if (!password.trim()) {
        passwordError = "Password is required*.";
      }
      newPasswordError = handlePasswordErrorMsg();
      if (newPassword.trim() !== confirmPassword.trim()) {
        confirmPasswordError = "Confirm Password should be match with new password*.";
      }
    }
    if (modalOpenFor === "confirmDelete") {
      if (!confirmDelete || confirmDelete !== "CONFIRM") {
        setConfirmDeleteError("Please enter 'CONFIRM' to delete*.");
      } else {
        setConfirmDeleteError("")
      }
    }

    const errorsValue = {
      emailErr: emailError,
      passwordErr: passwordError,
      newPasswordErr: newPasswordError,
      confirmPasswordErr: confirmPasswordError,
    };
    setInputErrors(errorsValue);
  };

  const handlePasswordErrorMsg = () => {
    let error = "";
    const lowerCaseRegex = /^(?!.*[a-z]).*$/.test(newPassword);
    const upperCaseRegex = /^(?!.*[A-Z]).*$/.test(newPassword);
    const numberRegex = /^(?!.*\d).*$/.test(newPassword);
    const specialCharacterRegex =
      /^(?!.*[!@#$%^&()_\-+={};:'",<.>\/?\\|`~]).*$/.test(newPassword);
    if (newPassword.trim().length < 8) {
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
    if (!newPassword.trim()) {
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

  const handleModalOpen = (action: string) => {
    if (action === "changeEmail") {
      setModalHeading("Change Email");
      setModalOpenFor("verifyPassEmailUpdate");
    }
    if (action === "changePassword") {
      setModalHeading("Change Password");
      setModalOpenFor("verifyPassChangePassword");
    }
    if (action === "deleteAccount") {
      setModalHeading("Delete Account");
      setModalOpenFor("verifyOtpDeleteAccount");
    }
    setOpenModal(true);
  };

  const handleOnClose = () => {
    setOpenModal(false);
    setModalOpenFor("");
    setModalHeading("");
    handleResetOnSubmit()
  };

  const handleResetOnSubmit = () => {
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setEmailId("");
    setConfirmDelete("");
    setConfirmDeleteError("");
    setOtp(["", "", "", ""])
    setCheckSubmit(false);
    setInputErrors(noErrorValues)
    setShowMainPassword(false)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
  }

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string
  ) => {
    const value = event.target.value;
    if (name === "password") {
      setPassword(value)
    }
    if (name === "new_email") {
      setEmailId(value)
    }
    if (name === "new_password") {
      setNewPassword(value)
    }
    if (name === "confirm_password") {
      setConfirmPassword(value)
    }
    if (name === "confirm_delete") {
      setConfirmDelete(value)
    }
  };

  const handleShowPassword = (name: string) => {
    if (name === "password") {
      setShowMainPassword(!showMainPassword);
    }
    if (name === "new_password") {
      setShowNewPassword(!showNewPassword);
    }
    if (name === "confirm_password") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };
  const handleModalSubmitClick = () => {
    setCheckSubmit(true);
    const passwordErrors = [inputErrors.passwordErr, inputErrors.newPasswordErr, inputErrors.confirmPasswordErr];
    const checkErrorsForPassword = passwordErrors.some(item => item.length > 0);
    if (modalOpenFor === "verifyPassEmailUpdate" && !inputErrors.passwordErr) {
      setModalOpenFor("newEmailEnterEmailUpdate");
      setCheckSubmit(false);
    }
    if (modalOpenFor === "newEmailEnterEmailUpdate" && !inputErrors.emailErr) {
      setModalOpenFor("verifyOTPEmailUpdate");
      setCheckSubmit(false);
    }
    if (modalOpenFor === "verifyOTPEmailUpdate" && !otpError) {
      enqueueSnackbar("New email update successfully", { variant: "success" });
      handleOnClose();
      setCheckSubmit(false);
    }
    if (modalOpenFor === "verifyPassChangePassword" && !checkErrorsForPassword) {
      setModalOpenFor("verifyOTPChangePassword");
      setCheckSubmit(false);
    }
    if (modalOpenFor === "verifyOTPChangePassword" && !otpError) {
      enqueueSnackbar("Password changed successfully", { variant: "success" });
      handleOnClose();
      setCheckSubmit(false);
    }
    if (modalOpenFor === "verifyOtpDeleteAccount" && !otpError) {
      setModalOpenFor("confirmDelete");
      setCheckSubmit(false);
    }
    if (modalOpenFor === "confirmDelete" && !confirmDeleteError) {
      handleLogout();
      enqueueSnackbar("Account deleted successfully", { variant: "success" });
      handleOnClose();
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
  const handleLogout = () => {
    logoutUser(dispatch, navigate);
  };

  const renderInput = (
    label: string,
    name: string,
    value: string,
    error: string,
    showPassword?: boolean
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
          type={
            name.includes("password") && !showPassword ? "password" : "text"
          }
          value={value}
          onChange={(event) => handleInputChange(event, name)}
          sx={
            checkSubmit && error
              ? webStyle.inputErrorStyle
              : webStyle.inputStyle
          }
          slotProps={{
            input: {
              autoComplete: "off",
              endAdornment: name.includes("password") ? (
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
        />
        {checkSubmit && error && (
          <Typography mt={0.5} fontSize={14} color={errorColor}>
            {error}
          </Typography>
        )}
      </Box>
    );
  };
  const renderOtpInputs = () => {
    return (
      <Box>
        <Typography mb={1} style={webStyle.inputLabelStyle}>
          Verify OTP send on mail {modalOpenFor === "verifyOTPEmailUpdate" ? emailId : userData.email}
          <span style={{ color: errorColor }}>*</span>:
        </Typography>
        <Box
          display="flex"
          justifyContent={"center"}
          gap={2}
          onPaste={handlePaste}
        >
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
    );
  };
  return (
    <Box>
      <Typography style={webStyle.headingText}>
        {configJSON.loginAndSecurity}
      </Typography>
      <Box style={webStyle.mainBody}>
        <Box style={webStyle.itemBox}>
          <Box style={webStyle.itemLabelBox}>
            <Typography style={webStyle.itemLabel}>
              {configJSON.email}:
            </Typography>
          </Box>
          <Box sx={webStyle.itemValueBox}>
            <Typography>{userData.email}</Typography>
            <Button
              sx={webStyle.okButtonStyle}
              onClick={() => handleModalOpen("changeEmail")}
            >
              {configJSON.update}
            </Button>
          </Box>
        </Box>
        <Box style={webStyle.itemBox}>
          <Box sx={webStyle.itemValueBox}>
            <Typography style={webStyle.itemLabel}>
              {configJSON.changePassword}:
            </Typography>
            <Button
              sx={webStyle.okButtonStyle}
              onClick={() => handleModalOpen("changePassword")}
            >
              {configJSON.change}
            </Button>
          </Box>
        </Box>
        <Box style={webStyle.itemBox}>
          <Box sx={webStyle.itemValueBox}>
            <Typography style={webStyle.itemLabel}>
              {configJSON.deleteAccount}:
            </Typography>
            <Button
              sx={webStyle.deleteButtonStyle}
              onClick={() => handleModalOpen("deleteAccount")}
            >
              {configJSON.delete}
            </Button>
          </Box>
        </Box>
      </Box>
      <Modal open={openModal} onClose={handleOnClose}>
        <Box style={webStyle.modalMainBox}>
          <Box style={webStyle.modalMainBodyBox}>
            <Box style={webStyle.headingBox}>
              <Typography style={webStyle.headingTextModal}>
                {modalHeading}
              </Typography>
              <IconButton onClick={handleOnClose}>
                <CloseRoundedIcon style={{ color: extraLightPrimaryColor }} />
              </IconButton>
            </Box>
            <Box style={webStyle.modalBodyBox}>
              {modalOpenFor === "verifyPassEmailUpdate" &&
                renderInput(
                  "Enter Password",
                  "password",
                  password,
                  inputErrors.passwordErr,
                  showMainPassword
                )}
              {modalOpenFor === "newEmailEnterEmailUpdate" &&
                renderInput(
                  "Enter New Email",
                  "new_email",
                  emailId,
                  inputErrors.emailErr
                )}
              {modalOpenFor === "verifyOTPEmailUpdate" && renderOtpInputs()}
              {modalOpenFor === "verifyPassChangePassword" && (
                <>
                  {renderInput(
                    "Enter Password",
                    "password",
                    password,
                    inputErrors.passwordErr,
                    showMainPassword
                  )}
                  {renderInput(
                    "Enter New Password",
                    "new_password",
                    newPassword,
                    inputErrors.newPasswordErr,
                    showNewPassword
                  )}
                  {renderInput(
                    "Confirm New Password",
                    "confirm_password",
                    confirmPassword,
                    inputErrors.confirmPasswordErr,
                    showConfirmPassword
                  )}
                </>
              )}
              {modalOpenFor === "verifyOTPChangePassword" && renderOtpInputs()}
              {modalOpenFor === "verifyOtpDeleteAccount" && renderOtpInputs()}
              {modalOpenFor === "confirmDelete" && (
                <Box>
                  <Typography mb={1} style={webStyle.inputLabelStyle}>
                    Please enter "
                    <span style={{ color: errorColor }}>CONFIRM</span>" to
                    delete account
                    <span style={{ color: errorColor }}>*</span>:
                  </Typography>
                  <TextField
                    fullWidth
                    name="confirm_delete"
                    type="text"
                    value={confirmDelete}
                    onChange={(event) =>
                      handleInputChange(event, "confirm_delete")
                    }
                    sx={
                      checkSubmit && confirmDeleteError
                        ? webStyle.inputErrorStyle
                        : webStyle.inputStyle
                    }
                    slotProps={{
                      input: {
                        autoComplete: "off",
                      },
                    }}
                  />
                  {checkSubmit && confirmDeleteError && (
                    <Typography mt={0.5} fontSize={14} color={errorColor}>
                      {confirmDeleteError}
                    </Typography>
                  )}
                </Box>
              )}

              <Grid2 container spacing={3} mt={2}>
                <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
                  <Button style={webStyle.cancelButtonStyle} onClick={handleOnClose}>
                    {configJSON.cancel}
                  </Button>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
                  {modalOpenFor === "confirmDelete" ? (
                    <Button
                      style={{ ...webStyle.deleteButtonStyle, width: "100%" }}
                      onClick={handleModalSubmitClick}
                    >
                      {configJSON.delete}
                    </Button>
                  ) : (
                    <Button
                      style={{ ...webStyle.okButtonStyle, width: "100%" }}
                      onClick={handleModalSubmitClick}
                    >
                      {configJSON.submit}
                    </Button>
                  )}
                </Grid2>
              </Grid2>
            </Box>
          </Box>
        </Box>
      </Modal>
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
  itemValueBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "@media (maxWidth: 400px)": {
      alignItems: "flex-start",
      flexDirection: "column",
      gap: "10px",
    },
  },
  okButtonStyle: {
    background: primaryColor,
    color: "#fff",
    "@media (maxWidth: 400px)": {
      width: "100%",
    },
  },
  deleteButtonStyle: {
    background: rejectedColor,
    color: "#fff",
    "@media (maxWidth: 400px)": {
      width: "100%",
    },
  },
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
    maxWidth: "550px",
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
  headingTextModal: {
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
  cancelButtonStyle: {
    width: "100%",
    background: lightTextColor,
    color: primaryColor,
  },
};
