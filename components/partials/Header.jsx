/* eslint-disable jsx-a11y/no-redundant-roles */
import { Fragment, useState, useEffect, useCallback } from 'react'

import { Dialog, Transition } from '@headlessui/react'
import { XIcon, UserIcon, ArrowRightIcon, LogoutIcon } from '@heroicons/react/outline'

import { Menu, Dropdown, Button, Input, Divider } from 'antd'
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  WhatsAppOutlined,
  DownOutlined,
  MenuOutlined
} from '@ant-design/icons'

import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Bag from '../FloatCart/Bag'

import api from '../../services/api'
import NavLink from '../NavLink'
import { saveAccount, saveAddress } from '../../store/actions/user'
import { getAccount } from '../../store/selectors/user'
import useToken from '../../contexts/TokenStorage'
import Cart from '../FloatCart/Cart'

function Header() {
  const router = useRouter()
  const [showFilter, setShowFilter] = useState(0)
  const [width, setWindowWidth] = useState(0)
  const dispatch = useDispatch()
  const user = useSelector(getAccount)

  const updateDimensions = () => {
    const widthPage = window.innerWidth
    setWindowWidth(widthPage)
  }

  useEffect(() => {
    updateDimensions()

    window.addEventListener('resize', updateDimensions)

    return () => window.removeEventListener('resize', updateDimensions)
  }, [width])

  const getUserData = useCallback(async () => {
    api
      .get('/auth/me')
      .then((res) => {
        dispatch(
          saveAccount({
            cpf: res.data.cpf,
            email: res.data.email,
            name: res.data.name,
            phone: res.data.mobile
          })
        )
      })
      .catch((e) => {})
  }, [dispatch])

  const [token, setToken] = useToken('')

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token.replace(/['"]+/g, '')}`
      setToken(token.replace(/['"]+/g, ''))
    }
  }, [setToken, token])

  useEffect(() => getUserData(), [getUserData, token])

  function switchFilter() {
    switch (showFilter) {
      case 1:
        return (
          <div className="wrapper-surf-options">
            <div className="surf-options">
              <NavLink
                href="/produtos/Surf/Wetsuit"
                className="surf-options-link"
                onClick={() => setShowFilter(0)}
              >
                WETSUITS
              </NavLink>
              <NavLink
                href="/produtos/Surf/Quilha"
                className="surf-options-link"
                onClick={() => setShowFilter(0)}
              >
                QUILHA
              </NavLink>
              <NavLink
                href="/produtos/Surf/Leash"
                className="surf-options-link"
                onClick={() => setShowFilter(0)}
              >
                LEASH
              </NavLink>
              <NavLink
                href="/produtos/Surf/Lycra"
                className="surf-options-link"
                onClick={() => setShowFilter(0)}
              >
                LYCRA
              </NavLink>
              <NavLink
                href="/produtos/Surf/Prancha"
                className="surf-options-link"
                onClick={() => setShowFilter(0)}
              >
                PRANCHA
              </NavLink>
              <NavLink
                href="/produtos/Surf/Capa"
                className="surf-options-link"
                onClick={() => setShowFilter(0)}
              >
                CAPA
              </NavLink>
              <NavLink
                href="/produtos/Surf/Deck"
                className="surf-options-link"
                onClick={() => setShowFilter(0)}
              >
                DECK
              </NavLink>
              <NavLink
                href="/produtos/Surf/Bone"
                className="surf-options-link"
                onClick={() => setShowFilter(0)}
              >
                BONÉS
              </NavLink>
            </div>

            <NavLink href="/produtos/Surf" onClick={() => setShowFilter(0)}>
              <img className="surf-image hide" src="/navSurf.jpg" alt="imagem de surf" />
            </NavLink>
          </div>
        )
      case 2:
        return (
          <div className="wrapper-content-genre">
            <div className="wrapper-genre">
              <div className="header-genre">
                <NavLink
                  href="/produtos/Masculino/Vestuario"
                  className="header-genre"
                  onClick={() => setShowFilter(0)}
                >
                  VESTUÁRIO
                </NavLink>
              </div>
              <div className="subtitle-vest">
                <NavLink
                  href="/produtos/Masculino/Vestuario/Bermuda"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  BERMUDAS
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Vestuario/Camiseta"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  CAMISETAS
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Vestuario/Camisa"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  CAMISAS
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Vestuario/Regata"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  REGATAS
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Vestuario/Calca"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  CALÇAS
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Vestuario/Jaqueta"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  JAQUETAS
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Vestuario/Moletom"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  MOLETONS
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Vestuario/Sueter"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  SUÉTERES
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Vestuario/ExtraGrande"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  EXTRA GRANDE
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Vestuario/Sunga"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
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
                  onClick={() => setShowFilter(0)}
                >
                  ACESSÓRIOS
                </NavLink>
              </div>
              <div className="subtitle-vest">
                <NavLink
                  href="/produtos/Masculino/Acessorio/Bone"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  BONÉS
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Acessorio/Mochila"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  MOCHILAS
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Acessorio/Carteira"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  CARTEIRAS
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Acessorio/Cinto"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  CINTOS
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Acessorio/Pochete"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  POCHETES
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Acessorio/Gorro"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  GORROS
                </NavLink>
                <NavLink
                  href="/produtos/Masculino/Acessorio/Meia"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  MEIAS
                </NavLink>
              </div>
            </div>

            <NavLink href="/produtos/Masculino" onClick={() => setShowFilter(0)}>
              <img className="img-genre hide" src="/navMasc.jpg" alt="img-genre" />
            </NavLink>
          </div>
        )
      case 3:
        return (
          <div className="wrapper-content-genre">
            <div className="wrapper-genre">
              <div className="header-genre">
                <NavLink
                  href="/produtos/Feminino/Vestuario"
                  className="header-genre"
                  onClick={() => setShowFilter(0)}
                >
                  VESTUÁRIO
                </NavLink>
              </div>
              <div className="subtitle-vest">
                <NavLink
                  href="/produtos/Feminino/Vestuario/Short"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  SHORTS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Vestuario/Saia"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  SAIAS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Vestuario/Calca"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  CALÇAS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Vestuario/Camiseta"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  CAMISETAS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Vestuario/Regata"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  REGATAS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Vestuario/Vestido"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  VESTIDOS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Vestuario/Macaquinho"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  MACAQUINHOS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Vestuario/Body"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  BODYS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Vestuario/Jaqueta"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  JAQUETAS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Vestuario/Moletom"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  MOLETONS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Vestuario/Blusa"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  BLUSAS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Vestuario/BlusaTricot"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  BLUSAS TRICOT
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Vestuario/Biquini"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
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
                  onClick={() => setShowFilter(0)}
                >
                  ACESSÓRIOS
                </NavLink>
              </div>
              <div className="subtitle-vest">
                <NavLink
                  href="/produtos/Feminino/Acessorio/Bolsa"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  BOLSAS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Acessorio/Pochete"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  POCHETES
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Acessorio/Mochila"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  MOCHILAS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Acessorio/Bone"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  BONÉS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Acessorio/Cinto"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  CINTOS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Acessorio/Carteira"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  CARTEIRAS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Acessorio/Gorro"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  GORROS
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Acessorio/Necessaire"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  NECESSAIRES
                </NavLink>
                <NavLink
                  href="/produtos/Feminino/Acessorio/Meia"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  MEIAS
                </NavLink>
              </div>
            </div>

            <NavLink href="/produtos/Feminino" onClick={() => setShowFilter(0)}>
              <img className="img-genre hide" src="/navFem.jpg" alt="img-genre" />
            </NavLink>
          </div>
        )
      case 4:
        return (
          <div className="wrapper-content-genre">
            <div className="wrapper-genre">
              <div className="header-genre">
                <NavLink
                  href="/produtos/Juvenil/Vestuario"
                  className="header-genre"
                  onClick={() => setShowFilter(0)}
                >
                  VESTUÁRIO
                </NavLink>
              </div>
              <div className="subtitle-vest">
                <NavLink
                  href="/produtos/Juvenil/Vestuario/Camiseta"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  CAMISETAS
                </NavLink>
                <NavLink
                  href="/produtos/Juvenil/Vestuario/Regata"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  REGATAS
                </NavLink>
                <NavLink
                  href="/produtos/Juvenil/Vestuario/Bermuda"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  BERMUDAS
                </NavLink>
                <NavLink
                  href="/produtos/Juvenil/Vestuario/Calca"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  CALÇAS
                </NavLink>
                <NavLink
                  href="/produtos/Juvenil/Vestuario/Jaqueta"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  JAQUETAS
                </NavLink>
                <NavLink
                  href="/produtos/Juvenil/Vestuario/Moletom"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  MOLETONS
                </NavLink>
                <NavLink
                  href="/produtos/Juvenil/Vestuario/Sunga"
                  className="subtitle-vest-link"
                  onClick={() => setShowFilter(0)}
                >
                  SUNGAS
                </NavLink>
              </div>
            </div>

            <NavLink href="/produtos/Juvenil" onClick={() => setShowFilter(0)}>
              <img
                className="img-genre hide"
                src="/navKid.jpg"
                alt="img-genre"
                style={{ width: 'auto', objectFit: 'contain' }}
              />
            </NavLink>
          </div>
        )
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      default:
        break
    }
  }

  const logOut = async () => {
    localStorage.clear()
    dispatch(saveAccount({}))
    dispatch(saveAddress({}))
    router.replace('/')
  }

  const menuLoginOn = (
    <Menu>
      <Menu.Item onClick={logOut} key="2">
        Sair
      </Menu.Item>
    </Menu>
  )

  const menuAtendimento = (
    <Menu>
      <div className="menu-call">
        <h2>Loja virtual</h2>
        <Divider />
        <div className="menu-call-1">
          <NavLink
            style={{ display: 'flex', width: '50%' }}
            href="https://api.whatsapp.com/send?phone=5548988281903"
            target="blank"
          >
            <WhatsAppOutlined
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '1.5rem',
                color: '#0080a8'
              }}
            />{' '}
          </NavLink>
          <p
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%',
              marginTop: '1rem'
            }}
          >
            <MailOutlined style={{ marginBottom: '0.2rem' }} /> contato@lifestyle.com.br
          </p>
        </div>
        <Divider />
        <div className="menu-call-2">
          <div className="menu-call-2-in">
            <h2>Loja Física</h2>
            <p style={{ display: 'flex', flexDirection: 'column' }}>
              <PhoneOutlined style={{ marginBottom: '0.2rem' }} /> (48) 98828-1903
            </p>
          </div>
          <span>Segunda a quarta feira das 10h às 19hs. Quinta a domingo das 10hs às 21hs</span>
        </div>
      </div>
    </Menu>
  )

  const { Search } = Input

  const onSearch = async (value) => router.replace(`/produtos?q=${value}`)

  /// /////////////////////////////////////////
  const [open, setOpen] = useState(false)

  const [openOptions, setOpenOptions] = useState(false)

  const navigation = {
    category: [
      {
        id: 1,
        name: 'Surf',
        href: '/produtos/Surf',
        more: true,
        sections: [
          {
            id: 'categories',
            name: 'Categorias',
            items: [
              { name: 'Wetsuits', href: '/produtos/Surf/Wetsuit' },
              { name: 'Quilha', href: '/produtos/Surf/Quilha' },
              { name: 'Leash', href: '/produtos/Surf/Leash' },
              { name: 'Lycra', href: '/produtos/Surf/Lycra' },
              { name: 'Prancha', href: '/produtos/Surf/Prancha' },
              { name: 'Capa', href: '/produtos/Surf/Capa' },
              { name: 'Deck', href: '/produtos/Surf/Deck' },
              { name: 'Bonés', href: '/produtos/Surf/Bone' }
            ]
          }
        ]
      },
      {
        id: 2,
        name: 'Masculino',
        href: '/produtos/Masculino',
        more: true,
        sections: [
          {
            id: 'clothing',
            name: 'Vestuário',
            items: [
              { name: 'Bermudas', href: '/produtos/Masculino/Vestuario/Bermuda' },
              { name: 'Camisetas', href: '/produtos/Masculino/Vestuario/Camiseta' },
              { name: 'Camisas', href: '/produtos/Masculino/Vestuario/Camisa' },
              { name: 'Regatas', href: '/produtos/Masculino/Vestuario/Regata' },
              { name: 'Calças', href: '/produtos/Masculino/Vestuario/Calca' },
              { name: 'Jaquetas', href: '/produtos/Masculino/Vestuario/Jaqueta' },
              { name: 'Moletons', href: '/produtos/Masculino/Vestuario/Moletom' },
              { name: 'Suéters', href: '/produtos/Masculino/Vestuario/Sueter' },
              { name: 'Extra Grande', href: '/produtos/Masculino/Vestuario/ExtraGrande' },
              { name: 'Sungas', href: '/produtos/Masculino/Vestuario/Sunga' }
            ]
          },
          {
            id: 'accessories',
            name: 'Acessórios',
            items: [
              { name: 'Bonés', href: '/produtos/Masculino/Acessorio/Bone' },
              { name: 'Mochilas', href: '/produtos/Masculino/Acessorio/Mochila' },
              { name: 'Carteiras', href: '/produtos/Masculino/Acessorio/Carteira' },
              { name: 'Cintos', href: '/produtos/Masculino/Acessorio/Cinto' },
              { name: 'Pochetes', href: '/produtos/Masculino/Acessorio/Pochete' },
              { name: 'Gorros', href: '/produtos/Masculino/Acessorio/Gorro' },
              { name: 'Meias', href: '/produtos/Masculino/Acessorio/Meia' }
            ]
          }
        ]
      },
      {
        id: 3,
        name: 'Feminino',
        href: '/produtos/Feminino',
        more: true,
        sections: [
          {
            id: 'clothing',
            name: 'Vestuário',
            items: [
              { name: 'Shorts', href: '/produtos/Feminino/Vestuario/Short' },
              { name: 'Saias', href: '/produtos/Feminino/Vestuario/Saia' },
              { name: 'Calças', href: '/produtos/Feminino/Vestuario/Calça' },
              { name: 'Camisetas', href: '/produtos/Feminino/Vestuario/Camiseta' },
              { name: 'Regatas', href: '/produtos/Feminino/Vestuario/Regata' },
              { name: 'Vestidos', href: '/produtos/Feminino/Vestuario/Vestido' },
              { name: 'Macaquinhos', href: '/produtos/Feminino/Vestuario/Macaquinho' },
              { name: 'Bodys', href: '/produtos/Feminino/Vestuario/Body' },
              { name: 'Jaquetas', href: '/produtos/Feminino/Vestuario/Jaqueta' },
              { name: 'Moletons', href: '/produtos/Feminino/Vestuario/Moletom' },
              { name: 'Blusas', href: '/produtos/Feminino/Vestuario/Blusa' },
              { name: 'Blusas Tricot', href: '/produtos/Feminino/Vestuario/BlusaTricot' },
              { name: 'Biquinis e Maiôs', href: '/produtos/Feminino/Vestuario/Biquini' }
            ]
          },
          {
            id: 'accessories',
            name: 'Acessórios',
            items: [
              { name: 'Bolsas', href: '/produtos/Feminino/Acessorio/Bolsa' },
              { name: 'Pochetes', href: '/produtos/Feminino/Acessorio/Pochete' },
              { name: 'Mochilas', href: '/produtos/Feminino/Acessorio/Mochila' },
              { name: 'Bonés', href: '/produtos/Feminino/Acessorio/Bone' },
              { name: 'Cintos', href: '/produtos/Feminino/Acessorio/Cinto' },
              { name: 'Carteiras', href: '/produtos/Feminino/Acessorio/Carteira' },
              { name: 'Gorros', href: '/produtos/Feminino/Acessorio/Gorro' },
              { name: 'Necessaires', href: '/produtos/Feminino/Acessorio/Necessaire' },
              { name: 'Meias', href: '/produtos/Feminino/Acessorio/Meia' }
            ]
          }
        ]
      },
      {
        id: 4,
        name: 'Juvenil e infantil',
        href: '/produtos/Juvenil',
        more: true,
        sections: [
          {
            id: 'clothing',
            name: 'Vestuário',
            items: [
              { name: 'Camisetas', href: '/produtos/Juvenil/Vestuario/Camiseta' },
              { name: 'Regatas', href: '/produtos/Juvenil/Vestuario/Regata' },
              { name: 'Bermudas', href: '/produtos/Juvenil/Vestuario/Bermuda' },
              { name: 'Calças', href: '/produtos/Juvenil/Vestuario/Calca' },
              { name: 'Jaquetas', href: '/produtos/Juvenil/Vestuario/Jaqueta' },
              { name: 'Moletons', href: '/produtos/Juvenil/Vestuario/Moletom' },
              { name: 'Sungas', href: '/produtos/Juvenil/Vestuario/Sunga' }
            ]
          }
        ]
      },
      {
        id: 'shoes',
        name: 'Calçados',
        href: '/produtos/Calcados',
        more: false
      },
      {
        id: 'accessories',
        name: 'Acessórios',
        href: '/produtos/Acessorio',
        more: false
      },
      {
        id: 'glass',
        name: 'Óculos',
        href: '/produtos/Acessorio/Oculos',
        more: false
      },
      {
        id: 'clock',
        name: 'Relógio',
        href: '/produtos/Acessorio/Relogio',
        more: false
      },
      {
        id: 'outlet',
        name: 'Outlet',
        href: '/produtos/Outlet',
        more: false
      }
    ]
  }

  return (
    <header id="header">
      <nav className="relative header-top">
        <button type="button" onClick={() => setOpen(true)} className="navbar">
          <MenuOutlined />
        </button>
        <NavLink href="/" className="header-logo">
          <img src="/logo-verde.png" alt="Logo do site" />
        </NavLink>

        <Search
          defaultValue={router.query.hasOwnProperty('q') ? router.query.q : ''}
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

          <span className="nav-item login">
            <div>
              {user.name ? (
                <Dropdown.Button overlay={menuLoginOn} placement="bottomCenter">
                  <span
                    onClick={() => {
                      router.push('/dashboard')
                    }}
                  >
                    <UserOutlined /> {user.name}
                  </span>
                </Dropdown.Button>
              ) : (
                <Button
                  onClick={() => {
                    router.push('/login')
                  }}
                  placement="bottomCenter"
                  icon={<UserOutlined />}
                >
                  {' '}
                  Fazer login ou cadastrar-se{' '}
                </Button>
              )}
            </div>
          </span>

          <div className="absolute sm:ml-8 top-5 right-5 sm:right-0 sm:top-0 sm:relative">
            <Bag />
          </div>
          <Cart />
        </nav>
      </nav>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 flex lg:hidden" style={{zIndex: 9999}} onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex flex-col w-full max-w-sm pb-12 overflow-y-auto bg-white shadow-xl">
              <div className="flex justify-between px-4 pt-4">
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 -m-2 text-gray-400 bg-transparent rounded-md"
                  onClick={() => setOpen(false)}
                >
                  <XIcon className="w-6 h-6" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 -m-2 text-gray-400 bg-transparent rounded-md"
                  onClick={() => {
                    logOut()
                    setOpen(false)
                  }}
                >
                  Sair
                  <LogoutIcon className="w-6 h-6 ml-1" aria-hidden="true" />
                </button>
              </div>
              <div className="flex flex-col items-center justify-center">
                <NavLink href="/" className="mb-6">
                  <img src="/logo-verde.png" className="h-auto mt-6 w-72" alt="Logo do site" />
                </NavLink>
                <div className="flex items-center py-3">
                  <UserIcon className="w-6 h-6 mr-1 text-[#0080A8]" />
                  <p
                    className="text-[#0080A8] text-xl mb-0"
                    onClick={() => {
                      user.name ? router.push('/dashboard') : router.push('/login')
                      setOpen(false)
                    }}
                  >
                    {user.name ? user.name : 'Entre ou cadastre-se'}
                  </p>
                </div>
              </div>
              <nav className="space-y-1 px-4 pt-8 divide-y divide-[rgba(0,128,168,0.4)] ">
                {navigation.category.map((item) => (
                  <div className="flex flex-col" key={item.id}>
                    <span
                      key={item.id}
                      className="flex items-center justify-between px-3 py-2 text-xl font-medium text-[#0080A8] hover:bg-blue-100"
                    >
                      <a className="truncate" href={item.href}>
                        {item.name}
                      </a>
                      {item.more && (
                        <ArrowRightIcon
                          onClick={() => setOpenOptions(!openOptions)}
                          className="w-5 h-5"
                        />
                      )}
                    </span>

                    {item.sections && openOptions && (
                      <div className="grid grid-cols-2 px-10 py-4 gap-y-10 gap-x-8">
                        {item.sections.map((section) => (
                          <div key={section.name}>
                            <p
                              id={`${section.name}-heading`}
                              className="mb-2 font-medium text-lg  text-[#ffa500]"
                            >
                              {section.name}
                            </p>
                            <ul
                              role="list"
                              aria-labelledby={`${section.name}-heading`}
                              className="space-y-4"
                            >
                              {section.items.map((el) => (
                                <li key={el.name} className="flex">
                                  <a href={el.href} className="text-base">
                                    {el.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
              <div className="px-6 pt-10">
                <h3
                  className="text-lg leading-6 font-medium underline
                  text-[#0080A8]"
                >
                  Atendimento
                </h3>
                <dl className="mt-1 text-base text-gray-500">
                  <div>
                    <dt className="text-[#0080A8]">Email</dt>
                    <dd>contato@lifestyle.com.br</dd>
                  </div>
                  <div className="mt-1">
                    <dt className="text-[#0080A8]">Loja Fisíca</dt>
                    <dd>(48) 98828-1903</dd>
                  </div>
                  <div href="https://api.whatsapp.com/send?phone=5548988281903" className="mt-1">
                    <dt className="text-[#0080A8]">WhatsApp</dt>
                    <a
                      className="text-gray-500"
                      href="https://api.whatsapp.com/send?phone=5548988281903"
                      target="blank"
                    >
                      <dd>(48) 98828-1903</dd>
                    </a>
                  </div>
                  <div className="mt-1">
                    <dd className="">
                      Segunda a quarta feira das 10h às 19hs. Quinta a domingo das 10hs às 21hs
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>

      <div onMouseLeave={() => setShowFilter(0)}>
        <nav className="menu-container">
          <div className="flex">
            <NavLink
              href="/produtos/Surf"
              className={showFilter === 1 ? 'menu-item menu-item-active' : 'menu-item'}
              onMouseEnter={() => setShowFilter(1)}
            >
              {' '}
              Surf
            </NavLink>
          </div>

          <div className="flex">
            <NavLink
              href="/produtos/Masculino"
              className={showFilter === 2 ? 'menu-item menu-item-active' : 'menu-item'}
              onMouseEnter={() => setShowFilter(2)}
            >
              Masculino
            </NavLink>
          </div>

          <div className="flex">
            <NavLink
              href="/produtos/Feminino"
              className={showFilter === 3 ? 'menu-item menu-item-active' : 'menu-item'}
              onMouseEnter={() => setShowFilter(3)}
            >
              Feminino
            </NavLink>
          </div>

          <div className="flex">
            <NavLink
              href="/produtos/Juvenil"
              className={showFilter === 4 ? 'menu-item menu-item-active' : 'menu-item'}
              onMouseEnter={() => setShowFilter(4)}
            >
              Juvenil e Infantil
            </NavLink>
          </div>

          <NavLink
            href="/produtos/Calcado"
            className={showFilter === 5 ? 'menu-item menu-item-active' : 'menu-item'}
            onMouseEnter={() => setShowFilter(0)}
          >
            Calçados
          </NavLink>

          <NavLink
            href="/produtos/Acessorio"
            className={showFilter === 6 ? 'menu-item menu-item-active' : 'menu-item'}
            onMouseEnter={() => setShowFilter(0)}
          >
            Acessórios
          </NavLink>

          <NavLink
            href="/produtos/Acessorio/Oculos"
            className={showFilter === 7 ? 'menu-item menu-item-active' : 'menu-item'}
            onMouseEnter={() => setShowFilter(0)}
          >
            Óculos
          </NavLink>

          <NavLink
            href="/produtos/Acessorio/Relogio"
            className={showFilter === 8 ? 'menu-item menu-item-active' : 'menu-item'}
            onMouseEnter={() => setShowFilter(0)}
          >
            Relogio
          </NavLink>

          <NavLink
            href="/produtos/Outlet"
            className={showFilter === 9 ? 'menu-item menu-item-active' : 'menu-item'}
            onMouseEnter={() => setShowFilter(0)}
          >
            Outlet
          </NavLink>
          {user.name && width < 1010 ? (
            <a
              title="Sair"
              className="menu-item"
              onClick={() => {
                logOut()
              }}
            >
              Sair
            </a>
          ) : null}
        </nav>

        <div
          className={
            showFilter === 0 ? 'menu-filter-container filter-hide' : 'menu-filter-container'
          }
        >
          {switchFilter()}
        </div>
      </div>
    </header>
  )
}

export default Header
