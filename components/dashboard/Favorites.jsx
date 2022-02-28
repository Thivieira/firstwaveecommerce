import { useEffect, useState } from 'react'
import api, { fetcher } from '../../services/api'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { getFavoritesProd } from '../../store/selectors/products'
import { removeFromFavorites, setFavorites } from '../../store/actions/products'
import { List, Avatar, Empty } from 'antd'
import { CloseCircleTwoTone } from '@ant-design/icons'
import useSWR from 'swr'

export default function Favorites() {
  const dispatch = useDispatch()
  const productsFavorites = useSelector(getFavoritesProd)
  const [products, setProducts] = useState([])

  const [token, setToken] = useLocalStorageState('token', { ssr: true })

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // setToken(token)
    }
  }, [setToken, token])

  const disp = async (item) => {
    const favoriteId = productsFavorites
      .filter((favorite) => favorite.product.id == item)
      .map((favorite) => favorite.id)
    try {
      await api.delete(`/favorites/${favoriteId}`)
      dispatch(removeFromFavorites(item))
    } catch (e) {}
  }

  // const orderFavoritesGet = async () => {
  //   await api.get("/favorites", { headers });
  // };

  // // const postFavorites = productsFavorites.map((el) => el.code);
  // console.log(postFavorites);

  // const orderFavoritesPost = async () => {
  //   await api
  //     .post("/produtos/favoritos", {
  //       produtoID: postFavorites[0],
  //     })
  //     .then((res) => console.log(res));
  // };

  // useEffect(() => {
  //   async function fetchFavorites() {
  //     try {
  //       let { data } = await api.get("/favorites");
  //       dispatch(setFavorites(data));
  //       const favorites = data;
  //       setProducts(favorites.map((favorite) => favorite.product));
  //     } catch (e) {}
  //   }
  //   fetchFavorites();
  //   // redux
  //   // productsFavorites

  //   // orderFavoritesPost();
  //   // orderFavoritesGet();
  // }, [dispatch]);

  const { data } = useSWR(`/favorites`, fetcher)

  useEffect(() => {
    if (data) {
      dispatch(setFavorites(data.data))
      const favorites = data.data
      setProducts(favorites.map((favorite) => favorite.product))
    }
  }, [data, dispatch])

  useEffect(() => {
    setProducts(productsFavorites.map((favorite) => favorite.product))
  }, [productsFavorites])

  return (
    <List
      itemLayout="horizontal"
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Sem favoritos para mostrar"
          ></Empty>
        )
      }}
      dataSource={products}
      renderItem={(item) => {
        let image = JSON.parse(item.variations[0].image)
        image = image.length > 0 ? image[0].link : '/noimage.png'
        return (
          <List.Item
            actions={[
              <a key="list-remove-item" onClick={() => disp(item.id)}>
                {' '}
                <CloseCircleTwoTone style={{ fontSize: '1.5rem' }} />{' '}
              </a>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar shape="square" size={64} src={image} />}
              title={<Link href={`/produto/${item.code}`}>{' ' + item.description + ' '}</Link>}
              description={'R$ ' + parseFloat(item.price).toFixed(2).replace('.', ',')}
            />
          </List.Item>
        )
      }}
    />
  )
}
