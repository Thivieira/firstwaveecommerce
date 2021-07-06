import React from "react";
import { Instagram, Facebook, WhatsApp, MapRounded, PhoneEnabled, Mail } from "@material-ui/icons";
import NavLink from "../components/NavLink";

// 

function Footer() {
  return (
    <>
      <footer>
        <div className="container">
          <div className="container-col">
            <div className="sec aboutus">
              <NavLink href="/" className="footer-logo">
                <img src="/Logo-Lifestyle.jpg" alt="Logo" />
              </NavLink>
            </div>
            <div className="sec contact">
              <h2>Loja Física</h2>
              <ul className="info">
                <li>
                  <img src="/loja1.jpeg" alt="" />
                  <span><MapRounded style={{marginRight: '5px'}}/> Rodovia Jornalista Manoel de Menezes, 2001. - Praia Mole - Florianópolis- SC</span>
                </li>
              </ul>
            </div>
          </div>


          <div className="sec quicklinks">
            <h2>Contato</h2>
            <ul>
              <li><a href='#'><PhoneEnabled style={{marginRight: '5px'}} /> contato@lifestyle.com.br</a></li>
              <li><a href='#'><Mail style={{marginRight: '5px'}} /> (48) 3045-1663</a></li>
            </ul>
            <ul className="sci">
                <li><NavLink href="https://instagram.com/lifestylefloripa_billabong?utm_medium=copy_link"><Instagram/></NavLink></li>
                <li><NavLink href="https://www.facebook.com/100853448656402/"><Facebook/></NavLink></li>
                <li><NavLink href="https://api.whatsapp.com/send?phone=5548988281903" target='blank'><WhatsApp/></NavLink></li>
            </ul>
          </div>

          <div className="sec payments">
            <h2>Meios de Pagamento</h2>
            <img src="/mercadopago-logo.png" alt="" />
          </div>
          <div className="sec certificate">
            <h2>Segurança</h2>
            <img src="/ssl.png" alt="" />
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
