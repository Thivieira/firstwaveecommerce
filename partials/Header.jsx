import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

import { Menu, Dropdown, Button, Input, Divider } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  WhatsAppOutlined,
  CaretRightOutlined,
  DownOutlined,
  CloseCircleOutlined,
  MenuOutlined,
} from "@ant-design/icons";

import FloatCart from "../components/FloatCart/FloatCart";

import api from "../services/api";
import NavLink from "../components/NavLink";
import { useDispatch, useSelector } from "react-redux";
import { saveAccount, saveAddress } from "../store/actions/user";
import { getAccount } from "../store/selectors/user";
import useToken from "../contexts/TokenStorage";

function Header() {
  const router = useRouter();
  const [sidebar, setSidebar] = useState(false);
  const [showFilter, setShowFilter] = useState(0);
  const [surfDropDown, setSurfDropDown] = useState(false);
  const [mascDropDown, setMascDropDown] = useState(false);
  const [femDropDown, setFemDropDown] = useState(false);
  const [juvDropDown, setJuvDropDown] = useState(false);
  const [width, setWindowWidth] = useState(0);
  const dispatch = useDispatch();
  const user = useSelector(getAccount);

  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };

  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, [width]);

  const getUserData = useCallback(async () => {
    api
      .get("/auth/me")
      .then((res) => {
        dispatch(
          saveAccount({
            cpf: res.data.cpf,
            email: res.data.email,
            name: res.data.name,
            phone: res.data.mobile,
          })
        );
      })
      .catch((e) => {});
  }, [dispatch]);

  const [token, setToken] = useToken();

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = "Bearer " + token;
      setToken(token);
    }
  }, [setToken, token]);

  useEffect(() => getUserData(), [getUserData, token]);

  const showSideBar = () => setSidebar(!sidebar);

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
              <img
                className="surf-image hide"
                src="/navSurf.jpg"
                alt="imagem de surf"
              />
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
                  href="/produtos/Masculino/Vestuario/Moletom"
                  className="subtitle-vest-link"
                >
                  MOLETONS
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Vestuario/Sueter"
                  className="subtitle-vest-link"
                >
                  SUÉTERS
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Vestuario/ExtraGrande"
                  className="subtitle-vest-link"
                >
                  EXTRA GRANDE
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
                className="img-genre hide"
                src="/navMasc.jpg"
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
                  JAQUETAS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Vestuario/Moletom"
                  className="subtitle-vest-link"
                >
                  MOLETONS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Vestuario/Blusa"
                  className="subtitle-vest-link"
                >
                  BLUSAS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Vestuario/BlusaTricot"
                  className="subtitle-vest-link"
                >
                  BLUSAS TRICOT
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Vestuario/Biquini"
                  className="subtitle-vest-link"
                >
                  BIQUINIS E MAIÔS
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
                  href="/produtos/Feminino/Acessorio/Bolsa"
                  className="subtitle-vest-link"
                >
                  BOLSAS
                </NavLink>
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
              <img
                className="img-genre hide"
                src="/navFem.jpg"
                alt="img-genre"
              />
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
                <NavLink
                  href="/produtos/Juvenil/Vestuario/Moletom"
                  className="subtitle-vest-link"
                >
                  MOLETONS
                </NavLink>
                <NavLink
                  href="/produtos/Juvenil/Vestuario/Sunga"
                  className="subtitle-vest-link"
                >
                  SUNGAS
                </NavLink>
              </div>
            </div>

            <NavLink href="/produtos/Juvenil">
              <img
                className="img-genre hide"
                src="/navKid.jpg"
                alt="img-genre"
                style={{ width: "auto", objectFit: "contain" }}
              />
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

  const dropDownNav = (type) => {
    const div = {
      surf: (
        <div className="navbar-mobile-surf">
          <NavLink
            href="/produtos/Surf/Wetsuit"
            className="navbar-mobile-surf-options"
            onClick={() => {
              showSideBar();
              setSurfDropDown(false);
            }}
          >
            <NavLink href="/produtos/Surf/">
              <span>WETSUITS</span>
            </NavLink>
          </NavLink>
          <NavLink
            href="/produtos/Surf/Quilha"
            className="navbar-mobile-surf-options"
            onClick={() => {
              showSideBar();
              setSurfDropDown(false);
            }}
          >
            QUILHA
          </NavLink>
          <NavLink
            href="/produtos/Surf/Leash"
            className="navbar-mobile-surf-options"
            onClick={() => {
              showSideBar();
              setSurfDropDown(false);
            }}
          >
            LEASH
          </NavLink>
          <NavLink
            href="/produtos/Surf/Lycra"
            className="navbar-mobile-surf-options"
            onClick={() => {
              showSideBar();
              setSurfDropDown(false);
            }}
          >
            LYCRA
          </NavLink>
          <NavLink
            href="/produtos/Surf/Prancha"
            className="navbar-mobile-surf-options"
            onClick={() => {
              showSideBar();
              setSurfDropDown(false);
            }}
          >
            PRANCHA
          </NavLink>
          <NavLink
            href="/produtos/Surf/Capa"
            className="navbar-mobile-surf-options"
            onClick={() => {
              showSideBar();
              setSurfDropDown(false);
            }}
          >
            CAPA
          </NavLink>
          <NavLink
            href="/produtos/Surf/Deck"
            className="navbar-mobile-surf-options"
            onClick={() => {
              showSideBar();
              setSurfDropDown(false);
            }}
          >
            DECK
          </NavLink>
          <NavLink
            href="/produtos/Surf/Bone"
            className="navbar-mobile-surf-options"
            onClick={() => {
              showSideBar();
              setSurfDropDown(false);
            }}
          >
            BONÉS
          </NavLink>
        </div>
      ),
      masc: (
        <div className="navbar-mobile-surf">
          <NavLink
            href="/produtos/Masculino/Vestuario"
            className="navbar-mobile-surf-options"
            onClick={() => {
              showSideBar();
              setMascDropDown(false);
            }}
          >
            VESTUARIO
          </NavLink>
          <NavLink
            href="/produtos/Masculino/Acessorio"
            className="navbar-mobile-surf-options"
            onClick={() => {
              showSideBar();
              setMascDropDown(false);
            }}
          >
            ACESSÓRIOS
          </NavLink>
        </div>
      ),
      fem: (
        <div className="navbar-mobile-surf">
          <NavLink
            href="/produtos/Feminino/Vestuario"
            className="navbar-mobile-surf-options"
            onClick={() => {
              showSideBar();
              setFemDropDown(false);
            }}
          >
            VESTUARIO
          </NavLink>
          <NavLink
            href="/produtos/Feminino/Acessorio"
            className="navbar-mobile-surf-options"
            onClick={() => {
              showSideBar();
              setFemDropDown(false);
            }}
          >
            ACESSÓRIOS
          </NavLink>
        </div>
      ),
      juv: (
        <div className="navbar-mobile-surf">
          <NavLink
            href="/produtos/Juvenil/Vestuario/Camiseta"
            className="navbar-mobile-surf-options"
            onClick={() => {
              showSideBar();
              setjuvDropDown(false);
            }}
          >
            CAMISETAS
          </NavLink>
          <NavLink
            href="/produtos/Juvenil/Vestuario/Regata"
            className="navbar-mobile-surf-options"
            onClick={() => {
              showSideBar();
              setjuvDropDown(false);
            }}
          >
            REGATAS
          </NavLink>
          <NavLink
            href="/produtos/Juvenil/Vestuario/Bermuda"
            className="navbar-mobile-surf-options"
            onClick={() => {
              showSideBar();
              setjuvDropDown(false);
            }}
          >
            BERMUDAS
          </NavLink>
          <NavLink
            href="/produtos/Juvenil/Vestuario/Calca"
            className="navbar-mobile-surf-options"
            onClick={() => {
              showSideBar();
              setjuvDropDown(false);
            }}
          >
            CALÇAS
          </NavLink>
          <NavLink
            href="/produtos/Juvenil/Vestuario/Jaqueta"
            className="navbar-mobile-surf-options"
            onClick={() => {
              showSideBar();
              setjuvDropDown(false);
            }}
          >
            JAQUETAS
          </NavLink>
          <NavLink
            href="/produtos/Juvenil/Vestuario/Moletom"
            className="navbar-mobile-surf-options"
            onClick={() => {
              showSideBar();
              setjuvDropDown(false);
            }}
          >
            MOLETONS
          </NavLink>
          <NavLink
            href="/produtos/Juvenil/Vestuario/Sunga"
            className="navbar-mobile-surf-options"
            onClick={() => {
              showSideBar();
              setjuvDropDown(false);
            }}
          >
            SUNGAS
          </NavLink>
        </div>
      ),
    };

    return div[type];
  };

  const logOut = async () => {
    localStorage.clear();
    dispatch(saveAccount({}));
    dispatch(saveAddress({}));
    router.replace("/");
  };

  const menuLoginOn = (
    <Menu>
      <Menu.Item onClick={logOut} key="2">
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
                color: "#0080a8",
              }}
            />{" "}
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
              <PhoneOutlined style={{ marginBottom: "0.2rem" }} /> (48) 98828-1903
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
          <MenuOutlined />
        </div>
        <NavLink href="/" className="header-logo">
          <img src="/logo-verde.png" alt="Logo do site" />
        </NavLink>

        <Search
          defaultValue={router.query.hasOwnProperty("q") ? router.query.q : ""}
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

          <span
            // href={user.name ? "#" : "/login"}
            className="nav-item login"
            onClick={() => {
              setSidebar(false);
              setSurfDropDown(false);
              setMascDropDown(false);
              setFemDropDown(false);
              setJuvDropDown(false);
            }}
          >
            <div>
              {user.name ? (
                <Dropdown.Button overlay={menuLoginOn} placement="bottomCenter">
                  <span
                    onClick={() => {
                      router.push("/dashboard");
                    }}
                  >
                    <UserOutlined /> {user.name}
                  </span>
                </Dropdown.Button>
              ) : (
                <Button
                  onClick={() => {
                    router.push("/login");
                  }}
                  placement="bottomCenter"
                  icon={<UserOutlined />}
                >
                  {" "}
                  Fazer login ou cadastrar-se{" "}
                </Button>
              )}
            </div>
          </span>
          <div className="nav-item-cart">
            <FloatCart />
          </div>
        </nav>
      </nav>

      <div onMouseLeave={() => setShowFilter(0)}>
        <nav className={sidebar ? "menu-container active" : "menu-container"}>
          <div className="sidebar-top">
            <CloseCircleOutlined
              onClick={() => {
                setSidebar(false);
                setSurfDropDown(false);
                setMascDropDown(false);
                setFemDropDown(false);
                setJuvDropDown(false);
              }}
              className="closeNavbar"
            />
            <NavLink
              href={user.name ? "/dashboard" : "/login"}
              className="sidebar-item"
              onClick={() => {
                setSidebar(false);
                setSurfDropDown(false);
                setMascDropDown(false);
                setFemDropDown(false);
                setJuvDropDown(false);
              }}
            >
              <>
                <UserOutlined style={{ fontSize: "2rem" }} />
                <p className="nav-item-legenda">
                  {user.name ? user.name : "Entre ou cadastre-se"}
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

          <div className="flex">
            <NavLink
              href="/produtos/Surf"
              onClick={() => {
                setSidebar(false);
                setSurfDropDown(false);
                setMascDropDown(false);
                setFemDropDown(false);
                setJuvDropDown(false);
              }}
              className={
                showFilter === 1 ? "menu-item menu-item-active" : "menu-item"
              }
              onMouseEnter={() => setShowFilter(1)}
            >
              {" "}
              Surf {surfDropDown && dropDownNav("surf")}
            </NavLink>
            <CaretRightOutlined
              className="down"
              onClick={() => {
                setSurfDropDown(!surfDropDown);
                setMascDropDown(false);
                setFemDropDown(false);
                setJuvDropDown(false);
              }}
            />
          </div>

          <div className="flex">
            <NavLink
              href="/produtos/Masculino"
              onClick={() => {
                setSidebar(false);
                setSurfDropDown(false);
                setMascDropDown(false);
                setFemDropDown(false);
                setJuvDropDown(false);
              }}
              className={
                showFilter === 2 ? "menu-item menu-item-active" : "menu-item"
              }
              onMouseEnter={() => setShowFilter(2)}
            >
              Masculino
              {mascDropDown && dropDownNav("masc")}
            </NavLink>
            <CaretRightOutlined
              className="down"
              onClick={() => {
                setMascDropDown(!mascDropDown);
                setSurfDropDown(false);
                setFemDropDown(false);
                setJuvDropDown(false);
              }}
            />
          </div>

          <div className="flex">
            <NavLink
              href="/produtos/Feminino"
              onClick={() => {
                setSidebar(false);
                setSurfDropDown(false);
                setMascDropDown(false);
                setFemDropDown(false);
                setJuvDropDown(false);
              }}
              className={
                showFilter === 3 ? "menu-item menu-item-active" : "menu-item"
              }
              onMouseEnter={() => setShowFilter(3)}
            >
              Feminino
              {femDropDown && dropDownNav("fem")}
            </NavLink>
            <CaretRightOutlined
              className="down"
              onClick={() => {
                setMascDropDown(false);
                setSurfDropDown(false);
                setFemDropDown(!femDropDown);
                setJuvDropDown(false);
              }}
            />
          </div>

          <div className="flex">
            <NavLink
              href="/produtos/Juvenil"
              onClick={() => {
                setSidebar(false);
                setSurfDropDown(false);
                setMascDropDown(false);
                setFemDropDown(false);
                setJuvDropDown(false);
              }}
              className={
                showFilter === 4 ? "menu-item menu-item-active" : "menu-item"
              }
              onMouseEnter={() => setShowFilter(4)}
            >
              Juvenil e Infantil
              {juvDropDown && dropDownNav("juv")}
            </NavLink>
            <CaretRightOutlined
              className="down"
              onClick={() => {
                setMascDropDown(false);
                setSurfDropDown(false);
                setFemDropDown(false);
                setJuvDropDown(!juvDropDown);
              }}
            />
          </div>

          <NavLink
            href="/produtos/Calcado"
            onClick={() => {
              setSidebar(false);
              setSurfDropDown(false);
              setMascDropDown(false);
              setFemDropDown(false);
              setJuvDropDown(false);
            }}
            className={
              showFilter === 5 ? "menu-item menu-item-active" : "menu-item"
            }
            onMouseEnter={() => setShowFilter(0)}
          >
            Calçados
          </NavLink>

          <NavLink
            href="/produtos/Acessorio"
            onClick={() => {
              setSidebar(false);
              setSurfDropDown(false);
              setMascDropDown(false);
              setFemDropDown(false);
              setJuvDropDown(false);
            }}
            className={
              showFilter === 6 ? "menu-item menu-item-active" : "menu-item"
            }
            onMouseEnter={() => setShowFilter(0)}
          >
            Acessórios
          </NavLink>

          <NavLink
            href="/produtos/Acessorio/Oculos"
            onClick={() => {
              setSidebar(false);
              setSurfDropDown(false);
              setMascDropDown(false);
              setFemDropDown(false);
              setJuvDropDown(false);
            }}
            className={
              showFilter === 7 ? "menu-item menu-item-active" : "menu-item"
            }
            onMouseEnter={() => setShowFilter(0)}
          >
            Óculos
          </NavLink>

          <NavLink
            href="/produtos/Acessorio/Relogio"
            onClick={() => {
              setSidebar(false);
              setSurfDropDown(false);
              setMascDropDown(false);
              setFemDropDown(false);
              setJuvDropDown(false);
            }}
            className={
              showFilter === 8 ? "menu-item menu-item-active" : "menu-item"
            }
            onMouseEnter={() => setShowFilter(0)}
          >
            Relogio
          </NavLink>

          <NavLink
            href="/produtos/Outlet"
            className={
              showFilter === 9 ? "menu-item menu-item-active" : "menu-item"
            }
            onMouseEnter={() => setShowFilter(0)}
            onClick={() => {
              setSidebar(false);
              setSurfDropDown(false);
              setMascDropDown(false);
              setFemDropDown(false);
              setJuvDropDown(false);
            }}
          >
            Outlet
          </NavLink>
          {user.name && width < 1010 ? (
            <a
              title="Sair"
              className="menu-item"
              onClick={() => {
                logOut();
                setSidebar(false);
                setSurfDropDown(false);
                setMascDropDown(false);
                setFemDropDown(false);
                setJuvDropDown(false);
              }}
            >
              Sair
            </a>
          ) : null}
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
