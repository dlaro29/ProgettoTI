import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main style={{ padding: "18px 16px" }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
