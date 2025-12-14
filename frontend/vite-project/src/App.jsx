import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import RecordDetail from "./RecordDetail";
import Login from "./Login";
import Cart from "./Cart"
import Order from "./Order";

//componente principale dell'app
function App() {
  return (
    //così app decide quale componente mostrare in base alla rotta
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/records/:id" element={<RecordDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="order" element={<Order />} />
    </Routes>
  );
}

export default App
