import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./layout";
import Home from "./home";
import MarketMain from "./components/market/marketMain.jsx";
import Checkout from "./components/market/checkout.jsx";
import FullAbout from "./components/About/fullAbout.jsx";
import ContactUsPage from "./contactUsPage.jsx";
import ResourcesPage from "./components/resources.jsx";
import MyAccount from "./components/myAccount.jsx";
import OrderDetail from "./components/market/orderDetail.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/market" element={<MarketMain />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<FullAbout />} />
          <Route path="/contacts" element={<ContactUsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/account" element={<MyAccount />} />
          <Route path="/order-detail" element={<OrderDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}
