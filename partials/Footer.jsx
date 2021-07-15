import React from "react";
import {
  Instagram,
  Facebook,
  WhatsApp,
  MapRounded,
  PhoneEnabled,
  Mail,
} from "@material-ui/icons";
import NavLink from "../components/NavLink";
import { Carousel } from "react-responsive-carousel";

function Footer() {
  const getConfigurableProps = () => ({
    showArrows: true,
    showStatus: false,
    showIndicators: true,
    infiniteLoop: true,
    showThumbs: false,
    useKeyboardArrows: true,
    autoPlay: false,
    swipeable: true,
    dynamicHeight: true,
    emulateTouch: true,
    selectedItem: 0,
    transitionTime: 900,
    swipeScrollTolerance: 5,
    width: "400px"
  })

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
                <Carousel {...getConfigurableProps()}>
                  <div className="wrapper-img">
                    <img src="/loja3.jpeg" alt="" />
                  </div>
                  <div className="wrapper-img">
                    <img src="/loja2.jpeg" alt="" />
                  </div>
                  <div className="wrapper-img">
                    <img src="/loja1.jpeg" alt="" />
                  </div>
                </Carousel>
                  <span>
                    <img src="/maps.png" alt="" />
                    <NavLink
                      className='adress'
                      href="https://www.google.com/maps/place/Rod.+Jorn.+Manoel+de+Menezes,+2001+-+Praia+Mole,+Florian%C3%B3polis+-+SC,+88061-700/@-27.6021414,-48.4390544,17z/data=!3m1!4b1!4m5!3m4!1s0x95273e7e9dcdb737:0x17da064a360a9d76!8m2!3d-27.6021462!4d-48.4368657"
                      target="blank"
                    >
                    Rodovia Jornalista Manoel de Menezes, 2001. Anexo ao Hotel Selina - Praia Mole - Florianópolis- SC
                    </NavLink>
                  </span>
              </ul>
            </div>
          </div>

          <div className="sec quicklinks">
            <h2>Contato</h2>
            <ul>
              <li>
                <a href="#">
                  <PhoneEnabled style={{ marginRight: "5px" }} />{" "}
                  contato@lifestyle.com.br
                </a>
              </li>
              <li>
                <a href="#">
                  <Mail style={{ marginRight: "5px" }} /> (48) 3045-1663
                </a>
              </li>
            </ul>
            <ul className="sci">
              <li>
                <NavLink
                  href="https://instagram.com/lifestylefloripa_billabong?utm_medium=copy_link"
                  target="blank"
                >
                  <Instagram />
                </NavLink>
              </li>
              <li>
                <NavLink
                  href="https://www.facebook.com/100853448656402/"
                  target="blank"
                >
                  <Facebook />
                </NavLink>
              </li>
              <li>
                <NavLink
                  href="https://api.whatsapp.com/send?phone=5548988281903"
                  target="blank"
                >
                  <WhatsApp />
                </NavLink>
              </li>
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
