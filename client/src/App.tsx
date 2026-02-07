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
import CategoryClothes from "./pages/CategoryClothes/CategoryClothes";
import NoPageFound from "./pages/NoPageFound/NoPageFound";
import ScrollToTop from "./utils/scrollToTop";
import ViewDetail from "./pages/ViewDetail/ViewDetail";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Wishlist from "./pages/WishlistCart/WishlistCart";
import Checkout from "./pages/Checkout/Checkout";
import About from "./pages/About/About";
import Test from "./pages/Test";
import Profile from "./pages/Profile/Profile";
import LoginAndSecurity from "./pages/LoginAndSecurity/LoginAndSecurity";
import Orders from "./pages/Orders/Orders";

const base_url = process.env.REACT_APP_API_URL;

function App() {
  const dispatch = useDispatch<AppDispatch>();

  const intervalId = useSelector(
    (state: RootState) => state.tokenReducer.intervalId,
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
      <ScrollToTop />
      <SnackbarProvider
        maxSnack={8}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/viewDetail/:id" element={<ViewDetail />} />
          <Route
            path="/categoryClothes/:category_param"
            element={<CategoryClothes />}
          />
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
            path="/loginAndSecurity"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "product_manager", "user"]}
              >
                <LoginAndSecurity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "product_manager", "user"]}
              >
                <Wishlist pageName="wishlist" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "product_manager", "user"]}
              >
                <Wishlist pageName="cart" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "product_manager", "user"]}
              >
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "product_manager", "user"]}
              >
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/myorders"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "product_manager", "user"]}
              >
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route path="/aboutUs" element={<About />} />
          <Route path="/test" element={<Test />} />
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
          <Route path="*" element={<NoPageFound />} />
        </Routes>
        <Footer />
        <SnackbarMsg />
      </SnackbarProvider>
    </BrowserRouter>
  );
}

export default App;
