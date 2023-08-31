import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";

import Layout from "./component/layout";
import AccountLayout from "./component/accountLayout";

import BuyNowPage from "./component/buy-now-page";

import Test from "./pages/test";

const App = () => (
  <Router>
    <Routes>
      <Route path="/test" element={<Test />}/>
      <Route path="/" element={<Layout />} />
      <Route path="/category/:category" element={<Layout />} />
      <Route path="/view/:sortby" element={<Layout />} />
      <Route path="/publish/:time" element={<Layout />} />
      <Route path="/search/:searchBook" element={<Layout />} />
      <Route path="/account/:info" element={<AccountLayout />} />
      <Route path="/book/:bookId" element={<BuyNowPage />} />
      
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </Router>
);

export default App;
