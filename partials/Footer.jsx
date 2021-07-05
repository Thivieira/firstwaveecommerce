import React from "react";
import { Instagram, Facebook, WhatsApp, MapRounded, PhoneEnabled, Mail } from "@material-ui/icons";
import NavLink from "../components/NavLink";

// 

function Footer() {
  return (
    <>
      <footer>
        <div className="container">
          <div className="sec aboutus">
            <NavLink href="/" className="footer-logo">
              <img src="/Logo-Lifestyle.jpg" alt="Logo" />
            </NavLink>
          </div>
          <div className="sec quicklinks">
            <h2>Contato</h2>
            <ul>
              <li><a href='#'><PhoneEnabled style={{marginRight: '5px'}} /> contato@lifestyle.com.br</a></li>
              <li><a href='#'><Mail style={{marginRight: '5px'}} /> (48) 3045-1663</a></li>
            </ul>
            <ul className="sci">
                <li><a href="#"><Instagram/></a></li>
                <li><a href="#"><Facebook/></a></li>
                <li><a href="#"><WhatsApp/></a></li>
            </ul>
          </div>
          <div className="sec contact">
            <h2>Loja Física</h2>
            <ul className="info">
              <li>
                <img src="/loja-footer.jpg" alt="" />
                <span><MapRounded style={{marginRight: '5px'}}/> Rua Anita Garibaldi, 118 - Sala 01 e 02 - Centro - CEP 88801-020 - Criciúma / CNPJ -11.662.872/0001-31 - SC</span>
              </li>
            </ul>
          </div>
          <div className="sec payments">
            <h2>Meios de Pagamento</h2>

          </div>
          <div className="sec certificate">
            <h2>Segurança</h2>

          </div>
        </div>
      </footer>
      <div className="copyrightText">
        <p>Todos os direitos reservados - Lifestyle Floripa - 2021</p>
      </div>
    </>
  );
}

export default Footer;
