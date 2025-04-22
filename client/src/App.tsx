import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginSignUp from "./pages/LoginSignUp/LoginSignUp";
import Home from "./pages/Home/Home";
import AddProduct from "./pages/AddProducts/AddProduct";
import Header from "./components/Header";
import Footer from "./components/footer";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loginSignUp" element={<LoginSignUp />} />
        <Route path="/addProduct" element={<AddProduct/>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
