import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginSignUp from "./pages/LoginSignUp/LoginSignUp";
import Home from "./pages/Home/Home";
import AddProduct from "./pages/AddProducts/AddProduct";
import Header from "./components/Header";
import Footer from "./components/footer";
import { AuthCallback } from "./components/authController";
import SnackbarMsg from "./components/SnackbarMsg";
import ProtectedRoute from "./components/protectedRoute";
import UnauthOnlyRoute from "./components/unauthOnlyRoute";
import { useEffect } from "react";
import axiosApi from "./utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./redux/store";
import { setAccessToken, setCheckRefreshToken } from "./redux/tokenSlice";
import axios from "axios";
import { setUserInformationReducer } from "./redux/userInfoSlice";
import UserList from "./pages/UsersList/UserList";
import refreshAccessToken from "./services/refreshAccessToken";
import { SnackbarProvider } from "notistack";

const base_url = process.env.REACT_APP_API_URL;

function App() {
  const dispatch = useDispatch<AppDispatch>();

  const intervalId = useSelector(
    (state: RootState) => state.tokenReducer.intervalId
  );

  useEffect(() => {
    getUserInfo();
    return () => clearInterval(intervalId as ReturnType<typeof setInterval>);
  }, []);

  const getUserInfo = async () => {
    try {
      const tokenResponse = await axiosApi.post("/users/refresh_token");
      if (tokenResponse.data.token) {
        refreshAccessToken(dispatch);
        const userInfo = await axios.get(`${base_url}/users/get_user_info`, {
          headers: {
            authorization: `Bearer ${tokenResponse.data.token}`,
          },
        });
        const responseUserData = userInfo.data.data;
        const userInformation = {
          id: responseUserData._id,
          email: responseUserData.email,
          name: responseUserData.name,
          role: responseUserData.role,
          profileImage: responseUserData.profileImage.imgUrl,
        };
        dispatch(setAccessToken(tokenResponse.data.token));
        dispatch(setUserInformationReducer(userInformation));
        dispatch(setCheckRefreshToken(true));
      }
    } catch (error) {
      dispatch(setCheckRefreshToken(true));
    }
  };

  return (
    <BrowserRouter>
      <SnackbarProvider
        maxSnack={8}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/loginSignUp"
            element={
              <UnauthOnlyRoute>
                <LoginSignUp />
              </UnauthOnlyRoute>
            }
          />
          <Route
            path="/addProduct"
            element={
              <ProtectedRoute allowedRoles={["admin", "product_manager"]}>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auth/signUp"
            element={
              <UnauthOnlyRoute>
                <AuthCallback />
              </UnauthOnlyRoute>
            }
          />
          <Route
            path="/auth/signIn"
            element={
              <UnauthOnlyRoute>
                <AuthCallback />
              </UnauthOnlyRoute>
            }
          />
          <Route
            path="/showUserList"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UserList />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
        <SnackbarMsg />
      </SnackbarProvider>
    </BrowserRouter>
  );
}

export default App;
