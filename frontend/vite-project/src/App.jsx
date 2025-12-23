import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import RecordDetail from "./RecordDetail";
import Cart from "./Cart"
import Order from "./Order";
import MyOrders from "./MyOrders";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Account from "./Account";
import Auth from "./Auth";

//componente principale dell'app
function App() {
  return (
    //così App decide quale componente mostrare in base alla rotta
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route index element={<Home />} />
        <Route path="records/:id" element={<RecordDetail />} />
        <Route path="auth" element={<Auth />} />

        {/* rotte protette */}
        <Route element={<ProtectedRoute />} >
          <Route path="cart" element={<Cart />} />
          <Route path="order" element={<Order />} />
          <Route path="account" element={<Account />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
