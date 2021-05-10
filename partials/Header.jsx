import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { Input } from 'antd';
import { AccountCircle } from "@material-ui/icons";

import { Menu, Dropdown, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
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
    await api.get("/usuario").then((res) => {
      setUserName(res.data.nomeCompleto);
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
              <img
                className="surf-image"
                src="https://images.tcdn.com.br/img/img_prod/812998/1612288585_wetsuits-01-min.jpg"
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
              <img
                className="img-genre"
                src={"/headerFem.jpg"}
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
              </div>
            </div>

            <NavLink href="/produtos/Juvenil">
              <img
                className="img-genre"
                src={"/headerKidd.jpg"}
                alt="img-genre"
              />
            </NavLink>
          </div>
        );
      case 5:
      // return (
      //     <div className='wrapper-content-calcado'>
      //         <div className='wrapper-calcado'>
      //                 <div className='header-calcado'>
      //                     <NavLink href='/produtos/Masculino/Calcados' className='header-calcado'>MASCULINO</NavLink>
      //                 </div>
      //                 <div className='subtitle-calc'>
      //                     <NavLink href='/produtos/Masculino/Calcados/Tenis' className='subtitle-calc-link'>TÊNIS</NavLink>
      //                     <NavLink href='/produtos/Masculino/Calcados/Chinelo' className='subtitle-calc-link'>CHINELOS</NavLink>
      //                 </div>
      //         </div>

      //         <div className='wrapper-calcado'>
      //             <div className='header-calcado'>
      //                 <NavLink href='/produtos/Feminino/Calcados' className='header-calcado'>FEMININO</NavLink>
      //             </div>
      //             <div className='subtitle-calc'>
      //                 <NavLink href='/produtos/Feminino/Calcados/Tenis' className='subtitle-calc-link'>TÊNIS</NavLink>
      //                 <NavLink href='/produtos/Feminino/Calcados/Chinelo' className='subtitle-calc-link'>CHINELOS</NavLink>
      //             </div>
      //         </div>

      //         <div className='wrapper-calcado'>
      //             <div className='header-calcado'>
      //                 <NavLink href='/produtos/Juvenil/Calcados' className='header-calcado'>JUVENIL</NavLink>
      //             </div>
      //             <div className='subtitle-calc'>
      //                 <NavLink href='/produtos/Juvenil/Calcados/Tenis' className='subtitle-calc-link'>TÊNIS</NavLink>
      //                 <NavLink href='/produtos/Juvenil/Calcados/Chinelo' className='subtitle-calc-link'>CHINELOS</NavLink>
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

  const { Search } = Input;

  const onSearch = async value => router.replace(`/produtos/busca?nome=${value}`)
  
  return (
    <header id="header">
      <nav className="header-top">
        <div onClick={showSideBar} className="navbar">
          <FaBars />
        </div>
        <NavLink href="/" className="header-logo">
          Molokai
        </NavLink>
        
        <Search placeholder="Digite o que você procura" allowClear onSearch={onSearch} style={{ width: 400 }} />

        <nav className="nav-container">
          <NavLink
            href={authorized ? "/dashboard" : "/login"}
            className="nav-item"
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
