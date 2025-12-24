import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  const location = useLocation();

  //rotte senza navbar e footer
  const hideNavbarFooter = ["/login", "/register", "/order", "/auth"];

  //rotte senza footer
  const hideFooterOnly = ["/cart"];

  const hideNavbar = hideNavbarFooter.includes(location.pathname);
  const hideFooter = hideNavbarFooter.includes(location.pathname) || hideFooterOnly.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main style={{ padding: "18px 16px" }}>
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </>
  );
}
