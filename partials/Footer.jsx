import React from "react";
import { Instagram, Facebook, Twitter } from "@material-ui/icons";

function Footer() {
  return (
    <footer className="footer">
      <ul className="social-media">
        <li className="social-media-item">
          <a href="#">
            <Facebook fontSize="default" />
          </a>
        </li>
        <li className="social-media-item middle-item">
          <a href="#">
            <Instagram fontSize="default" />
          </a>
        </li>
        <li className="social-media-item">
          <a href="#">
            <Twitter fontSize="default" />
          </a>
        </li>
      </ul>
      <ul className="footer-services">
        <li>Info</li>
        <li>Suporte</li>
        <li>Acompanhe seu pedido</li>
      </ul>
      <ul className="footer-services">
        <li>Formas de pagamento</li>
        <li>Politicas de privacidade</li>
      </ul>
      <p className="copyright">
        &copy; Copyright 2021 - Todos os direitos reservados
      </p>
    </footer>
  );
}

export default Footer;
