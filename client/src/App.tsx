import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
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
import { getCookie } from "./utils/manageCookies";
import axiosApi from "./utils/axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./redux/store";
import { setAccessToken } from "./redux/tokenSlice";
import axios from "axios";
import { setUserInformationReducer } from "./redux/userInfoSlice";

const base_url = process.env.REACT_APP_API_URL;

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    const refreshToken = getCookie("refreshToken");
    if (refreshToken) {
      try {
        const tokenResponse = await axiosApi.post("/users/refresh_token");
        if (tokenResponse.data.token) {
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
        }
      } catch (error) {
        console.log("@@@@UserEorror", error);
      }
    }
  };

  useAuth();

  return (
    <BrowserRouter>
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
      </Routes>
      <Footer />
      <SnackbarMsg />
    </BrowserRouter>
  );
}

export default App;
