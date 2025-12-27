import "./Footer.css";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaSpotify
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footerInner">

        <div className="footerCol">
          <h4>CUSTOMER SERVICE</h4>
          <a href="/account">My Account</a>
          <a href="#">FAQ</a>
          <a href="#">Contact Us</a>

          <h4 className="footerSubTitle">PAGAMENTI SICURI</h4>
          <div className="paymentIcons">
          <a href="#">Paypal</a>
          <a href="#">Visa</a>
          <a href="#">Mastercard</a>
          </div>
        </div>

        <div className="footerCol">
            <h4>NAVIGATION</h4>
            <a href="#">Just Added</a>
            <a href="#">Preorders</a>
            <a href="#">Now Shipping</a>
            <a href="#">Best Sellers</a>
            <a href="#">Sale</a>
            <a href="#">Browse</a>           
        </div>

        <div className="footerCol">
            <h4>COMPANY</h4>
            <a href="/about">About Us</a>
            <a href="#">Wholesale</a>
            <a href="#">Licensing</a>
            <a href="#">Newsletter</a>
        </div>

        <div className="footerCol">
          <h4>IL NOSTRO SHOP</h4>
          <a href="#">Visit Our Record Shop</a>

          <h4 className="footerSubTitle">FOLLOW US</h4>
            <div className="socialIcons">
                <FaFacebookF />
                <FaTwitter />
                <FaInstagram />
                <FaYoutube />
                <FaSpotify />
            </div>
        </div>
        </div>

        <div className="footerCol">
          <p className="footerSignature">
            © 2025/2026 - Progetto universitario realizzato da Davide La Rosa
          </p>
        </div>
    </footer>
);
}