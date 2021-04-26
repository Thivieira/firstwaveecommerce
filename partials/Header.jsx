import React, { useState, useEffect } from "react";
import Link from "next/link";

import { TextField, InputAdornment } from "@material-ui/core";
import { Search, AccountCircle } from "@material-ui/icons";

import { Menu, Dropdown, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { FaBars } from "react-icons/fa";

import FloatCart from "../components/FloatCart/FloatCart";

import api from "../services/api";
import masc from "../assets/headerMasc.jpg";
import fem from "../assets/headerFem.jpg";
import kid from "../assets/headerKidd.jpg";

function Header() {
  const [search, setSearch] = useState("");
  const [sidebar, setSidebar] = useState(false);
  const [showFilter, setShowFilter] = useState(0);
  const [userName, setUserName] = useState("");

  const showSideBar = () => setSidebar(!sidebar);

  const token = sessionStorage.getItem("key");
  let authorized = sessionStorage.getItem("authorized");

  api.defaults.headers.common["Authorization"] = "Bearer " + token;

  async function getUserData() {
    await api.get("/usuario").then((res) => setUserName(res.data.nomeCompleto));
  }

  useEffect(() => getUserData(), [authorized]);

  function switchFilter() {
    switch (showFilter) {
      case 1:
        return (
          <div className="wrapper-surf-options">
            <div className="surf-options">
              <Link href="/produtos/Surf/Wetsuit" className="surf-options-link">
                WETSUITS
              </Link>
              <Link href="/produtos/Surf/Quilha" className="surf-options-link">
                QUILHA
              </Link>
              <Link href="/produtos/Surf/Leash" className="surf-options-link">
                LEASH
              </Link>
              <Link href="/produtos/Surf/Lycra" className="surf-options-link">
                LYCRA
              </Link>
              <Link href="/produtos/Surf/Prancha" className="surf-options-link">
                PRANCHA
              </Link>
              <Link href="/produtos/Surf/Capa" className="surf-options-link">
                CAPA
              </Link>
              <Link href="/produtos/Surf/Deck" className="surf-options-link">
                DECK
              </Link>
              <Link href="/produtos/Surf/Bone" className="surf-options-link">
                BONÉS
              </Link>
            </div>

            <Link href="/produtos/Surf">
              <img
                className="surf-image"
                src="https://images.tcdn.com.br/img/img_prod/812998/1612288585_wetsuits-01-min.jpg"
                alt="imagem de surf"
              />
            </Link>
          </div>
        );
      case 2:
        return (
          <div className="wrapper-content-genre">
            <div className="wrapper-genre">
              <div className="header-genre">
                <Link
                  href="/produtos/Masculino/Vestuario"
                  className="header-genre"
                >
                  VESTUÁRIO
                </Link>
              </div>
              <div className="subtitle-vest">
                <Link
                  href="/produtos/Masculino/Vestuario/Bermuda"
                  className="subtitle-vest-link"
                >
                  BERMUDAS
                </Link>
                <Link
                  href="/produtos/Masculino/Vestuario/Camiseta"
                  className="subtitle-vest-link"
                >
                  CAMISETAS
                </Link>
                <Link
                  href="/produtos/Masculino/Vestuario/Camisa"
                  className="subtitle-vest-link"
                >
                  CAMISAS
                </Link>
                <Link
                  href="/produtos/Masculino/Vestuario/Regata"
                  className="subtitle-vest-link"
                >
                  REGATAS
                </Link>
                <Link
                  href="/produtos/Masculino/Vestuario/Calca"
                  className="subtitle-vest-link"
                >
                  CALÇAS
                </Link>
                <Link
                  href="/produtos/Masculino/Vestuario/Jaqueta"
                  className="subtitle-vest-link"
                >
                  JAQUETAS
                </Link>
                <Link
                  href="/produtos/Masculino/Vestuario/Sunga"
                  className="subtitle-vest-link"
                >
                  SUNGAS
                </Link>
              </div>
            </div>

            <div className="wrapper-genre">
              <div className="header-genre">
                <Link
                  href="/produtos/Masculino/Acessorio"
                  className="header-genre"
                >
                  ACESSÓRIOS
                </Link>
              </div>
              <div className="subtitle-vest">
                <Link
                  href="/produtos/Masculino/Acessorio/Bone"
                  className="subtitle-vest-link"
                >
                  BONÉS
                </Link>
                <Link
                  href="/produtos/Masculino/Acessorio/Mochila"
                  className="subtitle-vest-link"
                >
                  MOCHILAS
                </Link>
                <Link
                  href="/produtos/Masculino/Acessorio/Carteira"
                  className="subtitle-vest-link"
                >
                  CARTEIRAS
                </Link>
                <Link
                  href="/produtos/Masculino/Acessorio/Cinto"
                  className="subtitle-vest-link"
                >
                  CINTOS
                </Link>
                <Link
                  href="/produtos/Masculino/Acessorio/Pochete"
                  className="subtitle-vest-link"
                >
                  POCHETES
                </Link>
                <Link
                  href="/produtos/Masculino/Acessorio/Gorro"
                  className="subtitle-vest-link"
                >
                  GORROS
                </Link>
                <Link
                  href="/produtos/Masculino/Acessorio/Meia"
                  className="subtitle-vest-link"
                >
                  MEIAS
                </Link>
              </div>
            </div>

            <Link href="/produtos/Masculino">
              <img className="img-genre" src={masc} alt="img-genre" />
            </Link>
          </div>
        );
      case 3:
        return (
          <div className="wrapper-content-genre">
            <div className="wrapper-genre">
              <div className="header-genre">
                <Link
                  href="/produtos/Feminino/Vestuario"
                  className="header-genre"
                >
                  VESTUÁRIO
                </Link>
              </div>
              <div className="subtitle-vest">
                <Link
                  href="/produtos/Feminino/Vestuario/Short"
                  className="subtitle-vest-link"
                >
                  SHORTS
                </Link>
                <Link
                  href="/produtos/Feminino/Vestuario/Saia"
                  className="subtitle-vest-link"
                >
                  SAIAS
                </Link>
                <Link
                  href="/produtos/Feminino/Vestuario/Calca"
                  className="subtitle-vest-link"
                >
                  CALÇAS
                </Link>
                <Link
                  href="/produtos/Feminino/Vestuario/Camiseta"
                  className="subtitle-vest-link"
                >
                  CAMISETAS
                </Link>
                <Link
                  href="/produtos/Feminino/Vestuario/Regata"
                  className="subtitle-vest-link"
                >
                  REGATAS
                </Link>
                <Link
                  href="/produtos/Feminino/Vestuario/Vestido"
                  className="subtitle-vest-link"
                >
                  VESTIDOS
                </Link>
                <Link
                  href="/produtos/Feminino/Vestuario/Macaquinho"
                  className="subtitle-vest-link"
                >
                  MACAQUINHOS
                </Link>
                <Link
                  href="/produtos/Feminino/Vestuario/Body"
                  className="subtitle-vest-link"
                >
                  BODYS
                </Link>
                <Link
                  href="/produtos/Feminino/Vestuario/Jaqueta"
                  className="subtitle-vest-link"
                >
                  JAQUETA
                </Link>
                <Link
                  href="/produtos/Feminino/Vestuario/Biquini"
                  className="subtitle-vest-link"
                >
                  BIQUINIS
                </Link>
              </div>
            </div>

            <div className="wrapper-genre">
              <div className="header-genre">
                <Link
                  href="/produtos/Feminino/Acessorio"
                  className="header-genre"
                >
                  ACESSÓRIOS
                </Link>
              </div>
              <div className="subtitle-vest">
                <Link
                  href="/produtos/Feminino/Acessorio/Pochete"
                  className="subtitle-vest-link"
                >
                  POCHETES
                </Link>
                <Link
                  href="/produtos/Feminino/Acessorio/Mochila"
                  className="subtitle-vest-link"
                >
                  MOCHILAS
                </Link>
                <Link
                  href="/produtos/Feminino/Acessorio/Bone"
                  className="subtitle-vest-link"
                >
                  BONÉS
                </Link>
                <Link
                  href="/produtos/Feminino/Acessorio/Cinto"
                  className="subtitle-vest-link"
                >
                  CINTOS
                </Link>
                <Link
                  href="/produtos/Feminino/Acessorio/Carteira"
                  className="subtitle-vest-link"
                >
                  CARTEIRAS
                </Link>
                <Link
                  href="/produtos/Feminino/Acessorio/Gorro"
                  className="subtitle-vest-link"
                >
                  GORROS
                </Link>
                <Link
                  href="/produtos/Feminino/Acessorio/Necessaire"
                  className="subtitle-vest-link"
                >
                  NECESSAIRES
                </Link>
                <Link
                  href="/produtos/Feminino/Acessorio/Meia"
                  className="subtitle-vest-link"
                >
                  MEIAS
                </Link>
              </div>
            </div>

            <Link href="/produtos/Feminino">
              <img className="img-genre" src={fem} alt="img-genre" />
            </Link>
          </div>
        );
      case 4:
        return (
          <div className="wrapper-content-genre">
            <div className="wrapper-genre">
              <div className="header-genre">
                <Link
                  href="/produtos/Juvenil/Vestuario"
                  className="header-genre"
                >
                  VESTUÁRIO
                </Link>
              </div>
              <div className="subtitle-vest">
                <Link
                  href="/produtos/Juvenil/Vestuario/Camiseta"
                  className="subtitle-vest-link"
                >
                  CAMISETAS
                </Link>
                <Link
                  href="/produtos/Juvenil/Vestuario/Regata"
                  className="subtitle-vest-link"
                >
                  REGATAS
                </Link>
                <Link
                  href="/produtos/Juvenil/Vestuario/Bermuda"
                  className="subtitle-vest-link"
                >
                  BERMUDAS
                </Link>
                <Link
                  href="/produtos/Juvenil/Vestuario/Calca"
                  className="subtitle-vest-link"
                >
                  CALÇAS
                </Link>
                <Link
                  href="/produtos/Juvenil/Vestuario/Jaqueta"
                  className="subtitle-vest-link"
                >
                  JAQUETAS
                </Link>
              </div>
            </div>

            <Link href="/produtos/Juvenil">
              <img className="img-genre" src={kid} alt="img-genre" />
            </Link>
          </div>
        );
      case 5:
      // return (
      //     <div className='wrapper-content-calcado'>
      //         <div className='wrapper-calcado'>
      //                 <div className='header-calcado'>
      //                     <Link href='/produtos/Masculino/Calcados' className='header-calcado'>MASCULINO</Link>
      //                 </div>
      //                 <div className='subtitle-calc'>
      //                     <Link href='/produtos/Masculino/Calcados/Tenis' className='subtitle-calc-link'>TÊNIS</Link>
      //                     <Link href='/produtos/Masculino/Calcados/Chinelo' className='subtitle-calc-link'>CHINELOS</Link>
      //                 </div>
      //         </div>

      //         <div className='wrapper-calcado'>
      //             <div className='header-calcado'>
      //                 <Link href='/produtos/Feminino/Calcados' className='header-calcado'>FEMININO</Link>
      //             </div>
      //             <div className='subtitle-calc'>
      //                 <Link href='/produtos/Feminino/Calcados/Tenis' className='subtitle-calc-link'>TÊNIS</Link>
      //                 <Link href='/produtos/Feminino/Calcados/Chinelo' className='subtitle-calc-link'>CHINELOS</Link>
      //             </div>
      //         </div>

      //         <div className='wrapper-calcado'>
      //             <div className='header-calcado'>
      //                 <Link href='/produtos/Juvenil/Calcados' className='header-calcado'>JUVENIL</Link>
      //             </div>
      //             <div className='subtitle-calc'>
      //                 <Link href='/produtos/Juvenil/Calcados/Tenis' className='subtitle-calc-link'>TÊNIS</Link>
      //                 <Link href='/produtos/Juvenil/Calcados/Chinelo' className='subtitle-calc-link'>CHINELOS</Link>
      //             </div>
      //         </div>
      //     </div>
      // )
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
    window.location.reload();
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
  return (
    <header id="header">
      <nav className="header-top">
        <div onClick={showSideBar} className="navbar">
          <FaBars />
        </div>
        <Link href="/" className="header-logo">
          Molokai
        </Link>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // console.log(search)
          }}
        >
          <TextField
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" className="logo-input" />
                </InputAdornment>
              ),
            }}
            placeholder="Digite o que você procura"
            variant="outlined"
            size="small"
            className="header-input"
            type="text"
          />
        </form>
        <nav className="nav-container">
          <Link href={authorized ? "/dash" : "/login"} className="nav-item">
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
          </Link>
          <div className="nav-item">
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
            <Link
              href={authorized ? "/dash" : "/login"}
              className="sidebar-item"
            >
              <>
                <AccountCircle fontSize="large" />
                <p className="nav-item-legenda">
                  {authorized ? userName : "Entre ou cadastre-se"}
                </p>
              </>
            </Link>
          </div>

          <Link
            href="/produtos/Surf"
            className={
              showFilter === 1 ? "menu-item menu-item-active" : "menu-item"
            }
            onMouseEnter={() => setShowFilter(1)}
          >
            Surf
          </Link>

          <Link
            href="/produtos/Masculino"
            className={
              showFilter === 2 ? "menu-item menu-item-active" : "menu-item"
            }
            onMouseEnter={() => setShowFilter(2)}
          >
            Masculino
          </Link>

          <Link
            href="/produtos/Feminino"
            className={
              showFilter === 3 ? "menu-item menu-item-active" : "menu-item"
            }
            onMouseEnter={() => setShowFilter(3)}
          >
            Feminino
          </Link>

          <Link
            href="/produtos/Juvenil"
            className={
              showFilter === 4 ? "menu-item menu-item-active" : "menu-item"
            }
            onMouseEnter={() => setShowFilter(4)}
          >
            Juvenil
          </Link>

          <Link
            href="/produtos/Calcado"
            className={
              showFilter === 5 ? "menu-item menu-item-active" : "menu-item"
            }
            onMouseEnter={() => setShowFilter(0)}
          >
            Calçados
          </Link>

          <Link
            href="/produtos/Acessorio"
            className={
              showFilter === 6 ? "menu-item menu-item-active" : "menu-item"
            }
            onMouseEnter={() => setShowFilter(0)}
          >
            Acessórios
          </Link>

          <Link
            href="/produtos/Acessorio/Oculos"
            className={
              showFilter === 7 ? "menu-item menu-item-active" : "menu-item"
            }
            onMouseEnter={() => setShowFilter(0)}
          >
            Óculos
          </Link>

          <Link
            href="/produtos/Acessorio/Relogio"
            className={
              showFilter === 8 ? "menu-item menu-item-active" : "menu-item"
            }
            onMouseEnter={() => setShowFilter(0)}
          >
            Relógio
          </Link>

          <Link
            href="/produtos/"
            className={
              showFilter === 9 ? "menu-item menu-item-active" : "menu-item"
            }
            onMouseEnter={() => setShowFilter(0)}
          >
            Outlet
          </Link>
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
