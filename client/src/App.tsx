import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import LoginSignUp from "./pages/LoginSignUp/LoginSignUp";
import Home from "./pages/Home/Home";
import AddProduct from "./pages/AddProducts/AddProduct";
import Header from "./components/Header";
import Footer from "./components/footer";
import { AuthCallback } from "./components/authController";
import SnackbarMsg from "./components/SnackbarMsg";

function App() {
  useAuth();
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loginSignUp" element={<LoginSignUp />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/auth/signUp" element={<AuthCallback />} />
        <Route path="/auth/signIn" element={<AuthCallback />} />
      </Routes>
      <Footer />
      <SnackbarMsg />
    </BrowserRouter>
  );
}

export default App;
