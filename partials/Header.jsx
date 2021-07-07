import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { Menu, Dropdown, Button, Input, Divider } from "antd";
import {
  UserOutlined,
  DownOutlined,
  PhoneOutlined,
  MailOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { AccountCircle } from "@material-ui/icons";
import { FaBars } from "react-icons/fa";

import FloatCart from "../components/FloatCart/FloatCart";

import api from "../services/api";
import NavLink from "../components/NavLink";

function Header() {
  const router = useRouter();
  const [sidebar, setSidebar] = useState(false);
  const [showFilter, setShowFilter] = useState(0);
  const [userName, setUserName] = useState("");

  const showSideBar = () => setSidebar(!sidebar);

  const token = sessionStorage.getItem("key");
  let authorized = sessionStorage.getItem("authorized");

  api.defaults.headers.common["Authorization"] = "Bearer " + token;

  async function getUserData() {
    await api
      .get("/auth/me")
      .then((res) => {
        setUserName(res.data.name);
      })
      .catch((e) => {
        setUserName("");
      });
  }

  useEffect(() => getUserData(), [authorized]);

  function switchFilter() {
    switch (showFilter) {
      case 1:
        return (
          <div className="wrapper-surf-options">
            <div className="surf-options">
              <NavLink
                href="/produtos/Surf/Wetsuit"
                className="surf-options-link"
              >
                WETSUITS
              </NavLink>
              <NavLink
                href="/produtos/Surf/Quilha"
                className="surf-options-link"
              >
                QUILHA
              </NavLink>
              <NavLink
                href="/produtos/Surf/Leash"
                className="surf-options-link"
              >
                LEASH
              </NavLink>
              <NavLink
                href="/produtos/Surf/Lycra"
                className="surf-options-link"
              >
                LYCRA
              </NavLink>
              <NavLink
                href="/produtos/Surf/Prancha"
                className="surf-options-link"
              >
                PRANCHA
              </NavLink>
              <NavLink href="/produtos/Surf/Capa" className="surf-options-link">
                CAPA
              </NavLink>
              <NavLink href="/produtos/Surf/Deck" className="surf-options-link">
                DECK
              </NavLink>
              <NavLink href="/produtos/Surf/Bone" className="surf-options-link">
                BONÉS
              </NavLink>
            </div>

            <NavLink href="/produtos/Surf">
              <img className="surf-image" src="/4.jpg" alt="imagem de surf" />
            </NavLink>
          </div>
        );
      case 2:
        return (
          <div className="wrapper-content-genre">
            <div className="wrapper-genre">
              <div className="header-genre">
                <NavLink
                  href="/produtos/Masculino/Vestuario"
                  className="header-genre"
                >
                  VESTUÁRIO
                </NavLink>
              </div>
              <div className="subtitle-vest">
                <NavLink
                  href="/produtos/Masculino/Vestuario/Bermuda"
                  className="subtitle-vest-link"
                >
                  BERMUDAS
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Vestuario/Camiseta"
                  className="subtitle-vest-link"
                >
                  CAMISETAS
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Vestuario/Camisa"
                  className="subtitle-vest-link"
                >
                  CAMISAS
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Vestuario/Regata"
                  className="subtitle-vest-link"
                >
                  REGATAS
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Vestuario/Calca"
                  className="subtitle-vest-link"
                >
                  CALÇAS
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Vestuario/Jaqueta"
                  className="subtitle-vest-link"
                >
                  JAQUETAS
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Vestuario/Sunga"
                  className="subtitle-vest-link"
                >
                  SUNGAS
                </NavLink>
              </div>
            </div>

            <div className="wrapper-genre">
              <div className="header-genre">
                <NavLink
                  href="/produtos/Masculino/Acessorio"
                  className="header-genre"
                >
                  ACESSÓRIOS
                </NavLink>
              </div>
              <div className="subtitle-vest">
                <NavLink
                  href="/produtos/Masculino/Acessorio/Bone"
                  className="subtitle-vest-link"
                >
                  BONÉS
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Acessorio/Mochila"
                  className="subtitle-vest-link"
                >
                  MOCHILAS
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Acessorio/Carteira"
                  className="subtitle-vest-link"
                >
                  CARTEIRAS
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Acessorio/Cinto"
                  className="subtitle-vest-link"
                >
                  CINTOS
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Acessorio/Pochete"
                  className="subtitle-vest-link"
                >
                  POCHETES
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Acessorio/Gorro"
                  className="subtitle-vest-link"
                >
                  GORROS
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Acessorio/Meia"
                  className="subtitle-vest-link"
                >
                  MEIAS
                </NavLink>
              </div>
            </div>

            <NavLink href="/produtos/Masculino">
              <img
                className="img-genre"
                src={"/headerMasc.jpg"}
                alt="img-genre"
              />
            </NavLink>
          </div>
        );
      case 3:
        return (
          <div className="wrapper-content-genre">
            <div className="wrapper-genre">
              <div className="header-genre">
                <NavLink
                  href="/produtos/Feminino/Vestuario"
                  className="header-genre"
                >
                  VESTUÁRIO
                </NavLink>
              </div>
              <div className="subtitle-vest">
                <NavLink
                  href="/produtos/Feminino/Vestuario/Short"
                  className="subtitle-vest-link"
                >
                  SHORTS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Vestuario/Saia"
                  className="subtitle-vest-link"
                >
                  SAIAS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Vestuario/Calca"
                  className="subtitle-vest-link"
                >
                  CALÇAS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Vestuario/Camiseta"
                  className="subtitle-vest-link"
                >
                  CAMISETAS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Vestuario/Regata"
                  className="subtitle-vest-link"
                >
                  REGATAS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Vestuario/Vestido"
                  className="subtitle-vest-link"
                >
                  VESTIDOS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Vestuario/Macaquinho"
                  className="subtitle-vest-link"
                >
                  MACAQUINHOS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Vestuario/Body"
                  className="subtitle-vest-link"
                >
                  BODYS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Vestuario/Jaqueta"
                  className="subtitle-vest-link"
                >
                  JAQUETA
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Vestuario/Biquini"
                  className="subtitle-vest-link"
                >
                  BIQUINIS
                </NavLink>
              </div>
            </div>

            <div className="wrapper-genre">
              <div className="header-genre">
                <NavLink
                  href="/produtos/Feminino/Acessorio"
                  className="header-genre"
                >
                  ACESSÓRIOS
                </NavLink>
              </div>
              <div className="subtitle-vest">
                <NavLink
                  href="/produtos/Feminino/Acessorio/Pochete"
                  className="subtitle-vest-link"
                >
                  POCHETES
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Acessorio/Mochila"
                  className="subtitle-vest-link"
                >
                  MOCHILAS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Acessorio/Bone"
                  className="subtitle-vest-link"
                >
                  BONÉS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Acessorio/Cinto"
                  className="subtitle-vest-link"
                >
                  CINTOS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Acessorio/Carteira"
                  className="subtitle-vest-link"
                >
                  CARTEIRAS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Acessorio/Gorro"
                  className="subtitle-vest-link"
                >
                  GORROS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Acessorio/Necessaire"
                  className="subtitle-vest-link"
                >
                  NECESSAIRES
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Acessorio/Meia"
                  className="subtitle-vest-link"
                >
                  MEIAS
                </NavLink>
              </div>
            </div>

            <NavLink href="/produtos/Feminino">
              <img className="img-genre" src="/12.jpg" alt="img-genre" />
            </NavLink>
          </div>
        );
      case 4:
        return (
          <div className="wrapper-content-genre">
            <div className="wrapper-genre">
              <div className="header-genre">
                <NavLink
                  href="/produtos/Juvenil/Vestuario"
                  className="header-genre"
                >
                  VESTUÁRIO
                </NavLink>
              </div>
              <div className="subtitle-vest">
                <NavLink
                  href="/produtos/Juvenil/Vestuario/Camiseta"
                  className="subtitle-vest-link"
                >
                  CAMISETAS
                </NavLink>
                <NavLink
                  href="/produtos/Juvenil/Vestuario/Regata"
                  className="subtitle-vest-link"
                >
                  REGATAS
                </NavLink>
                <NavLink
                  href="/produtos/Juvenil/Vestuario/Bermuda"
                  className="subtitle-vest-link"
                >
                  BERMUDAS
                </NavLink>
                <NavLink
                  href="/produtos/Juvenil/Vestuario/Calca"
                  className="subtitle-vest-link"
                >
                  CALÇAS
                </NavLink>
                <NavLink
                  href="/produtos/Juvenil/Vestuario/Jaqueta"
                  className="subtitle-vest-link"
                >
                  JAQUETAS
                </NavLink>
              </div>
            </div>

            <NavLink href="/produtos/Juvenil">
              <img className="img-genre" src="/13.png" alt="img-genre" />
            </NavLink>
          </div>
        );
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      default:
        break;
    }
  }

  const logOut = async () => {
    sessionStorage.clear();
    router.replace("/");
  };

  const menuLoginOn = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        Minha conta
      </Menu.Item>
      <Menu.Item onClick={logOut} key="2" icon={<UserOutlined />}>
        Sair
      </Menu.Item>
    </Menu>
  );

  const menuAtendimento = (
    <Menu>
      <div className="menu-call">
        <h2>Loja virtual</h2>
        <Divider />
        <div className="menu-call-1">
          <NavLink
            style={{ display: "flex", width: "50%" }}
            href="https://api.whatsapp.com/send?phone=5548988281903"
            target="blank"
          >
            <WhatsAppOutlined
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "1.5rem",
              }}
            />{" "}
            <a href=""></a>
          </NavLink>
          <p
            style={{
              display: "flex",
              flexDirection: "column",
              width: "50%",
              marginTop: "1rem",
            }}
          >
            <MailOutlined style={{ marginBottom: "0.2rem" }} />{" "}
            contato@lifestyle.com.br
          </p>
        </div>
        <Divider />
        <div className="menu-call-2">
          <div className="menu-call-2-in">
            <h2>Loja Física</h2>
            <p style={{ display: "flex", flexDirection: "column" }}>
              <PhoneOutlined style={{ marginBottom: "0.2rem" }} /> (48)
              3045-1663
            </p>
          </div>
          <span>
            Segunda a quarta feira das 10h às 19hs. Quinta a domingo das 10hs às
            21hs
          </span>
        </div>
      </div>
    </Menu>
  );

  const { Search } = Input;

  const onSearch = async (value) => router.replace(`/produtos?q=${value}`);

  return (
    <header id="header">
      <nav className="header-top">
        <div onClick={showSideBar} className="navbar">
          <FaBars />
        </div>
        <NavLink href="/" className="header-logo">
          <img src="/Logo-Lifestyle.jpg" alt="Logo" />
        </NavLink>

        <Search
          defaultValue={
            router.query.hasOwnProperty("nome") ? router.query.nome : ""
          }
          placeholder="Digite o que você procura"
          allowClear
          onSearch={onSearch}
          className="search-filter"
        />

        <nav className="nav-item">
          <Dropdown className="btn-nav-call" overlay={menuAtendimento}>
            <Button>
              <PhoneOutlined /> Atendimento
              <DownOutlined />
            </Button>
          </Dropdown>

          <NavLink
            href={authorized ? "/dashboard" : "/login"}
            className="nav-item login"
          >
            <div>
              {authorized ? (
                <Dropdown.Button
                  overlay={menuLoginOn}
                  placement="bottomCenter"
                  icon={<UserOutlined />}
                >
                  {" "}
                  {userName}{" "}
                </Dropdown.Button>
              ) : (
                <Button placement="bottomCenter" icon={<UserOutlined />}>
                  {" "}
                  Fazer login ou cadastrar-se{" "}
                </Button>
              )}
            </div>
          </NavLink>
          <div className="nav-item-cart">
            <FloatCart />
          </div>
        </nav>
      </nav>

      <div onMouseLeave={() => setShowFilter(0)}>
        <nav
          onClick={showSideBar}
          className={sidebar ? "menu-container active" : "menu-container"}
        >
          <div className="sidebar-top">
            <NavLink
              href={authorized ? "/dashboard" : "/login"}
              className="sidebar-item"
            >
              <>
                <AccountCircle fontSize="large" />
                <p className="nav-item-legenda">
                  {authorized ? userName : "Entre ou cadastre-se"}
                </p>
              </>
            </NavLink>

            <Dropdown className="atend" overlay={menuAtendimento}>
              <Button>
                <PhoneOutlined /> Atendimento
                <DownOutlined />
              </Button>
            </Dropdown>
          </div>

          <NavLink
            href="/produtos/Surf"
            className={
              showFilter === 1 ? "menu-item menu-item-active" : "menu-item"
            }
            onMouseEnter={() => setShowFilter(1)}
          >
            Surf
          </NavLink>

          <NavLink
            href="/produtos/Masculino"
            className={
              showFilter === 2 ? "menu-item menu-item-active" : "menu-item"
            }
            onMouseEnter={() => setShowFilter(2)}
          >
            Masculino
          </NavLink>

          <NavLink
            href="/produtos/Feminino"
            className={
              showFilter === 3 ? "menu-item menu-item-active" : "menu-item"
            }
            onMouseEnter={() => setShowFilter(3)}
          >
            Feminino
          </NavLink>

          <NavLink
            href="/produtos/Juvenil"
            className={
              showFilter === 4 ? "menu-item menu-item-active" : "menu-item"
            }
            onMouseEnter={() => setShowFilter(4)}
          >
            Juvenil
          </NavLink>

          <NavLink
            href="/produtos/Calcado"
            className={
              showFilter === 5 ? "menu-item menu-item-active" : "menu-item"
            }
            onMouseEnter={() => setShowFilter(0)}
          >
            Calçados
          </NavLink>

          <NavLink
            href="/produtos/Acessorio"
            className={
              showFilter === 6 ? "menu-item menu-item-active" : "menu-item"
            }
            onMouseEnter={() => setShowFilter(0)}
          >
            Acessórios
          </NavLink>

          <NavLink
            href="/produtos/Acessorio/Oculos"
            className={
              showFilter === 7 ? "menu-item menu-item-active" : "menu-item"
            }
            onMouseEnter={() => setShowFilter(0)}
          >
            Óculos
          </NavLink>

          <NavLink
            href="/produtos/Acessorio/Relogio"
            className={
              showFilter === 8 ? "menu-item menu-item-active" : "menu-item"
            }
            onMouseEnter={() => setShowFilter(0)}
          >
            Relógio
          </NavLink>

          <NavLink
            href="/produtos/"
            className={
              showFilter === 9 ? "menu-item menu-item-active" : "menu-item"
            }
            onMouseEnter={() => setShowFilter(0)}
          >
            Outlet
          </NavLink>
        </nav>

        <div
          className={
            showFilter === 0
              ? "menu-filter-container filter-hide"
              : "menu-filter-container"
          }
        >
          {switchFilter()}
        </div>
      </div>
    </header>
  );
}

export default Header;
