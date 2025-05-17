import { Box, Snackbar, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { setSuccessMsg, setErrorMsg } from "../redux/snackbarMsgsSlice";

const SnackbarMsg = () => {
  const dispatch = useDispatch<AppDispatch>();
  const successSnackbarMsg = useSelector(
    (state: RootState) => state.snackbarSliceReducer.successMsg
  );
  const errorSnackbarMsg = useSelector(
    (state: RootState) => state.snackbarSliceReducer.errorMsg
  );

  const handleSnackbarClose = () => {
    dispatch(setSuccessMsg(null));
    dispatch(setErrorMsg(null));
  };

  return (
    <Box>
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
};

export default SnackbarMsg;
