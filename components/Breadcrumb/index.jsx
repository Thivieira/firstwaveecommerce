import React from 'react'
import { Breadcrumb as BreadCrumb } from 'antd'
import Link from 'next/link'

const Breadcrumb = ({ category, subcategory, type }) => {
  function itemRender(route, params, routes, paths) {
    const last = routes.indexOf(route) === routes.length - 1
    return last ? (
      <span className="path-prod">{route.breadcrumbName}</span>
    ) : (
      <Link className="path-prod" href={route.path}>
        {route.breadcrumbName}
      </Link>
    )
  }

  const routes = type
    ? [
        {
          path: `/produtos/${category}`,
          breadcrumbName: category
        },
        {
          path: `/produtos/${category}/${subcategory}`,
          breadcrumbName: subcategory === 'Acessorio' ? subcategory + 's' : subcategory
        },
        {
          path: `/produtos/${category}/${subcategory}/${type}`,
          breadcrumbName: type
        }
      ]
    : [
        {
          path: subcategory ? `/produtos/${category}/${subcategory}` : `/produtos/${category}`,
          breadcrumbName: subcategory ? subcategory : category
        }
      ]

  return <BreadCrumb itemRender={itemRender} routes={routes} className="path-prod-wrapper" />

  //     <div>
  //         {tipo !== undefined ? (
  //             <Breadcrumb
  //                 itemRender={itemRender}
  //                 className="path-prod-wrapper"
  //             >
  //                 <Breadcrumb.Item
  //                     className="path-prod"
  //                     to={`/produtos/${categoria}`}
  //                 >
  //                     {categoria}
  //                 </Breadcrumb.Item>
  //                 <Breadcrumb.Item
  //                     className="path-prod"
  //                     to={`/produtos/${categoria}/${subcategoria}`}
  //                 >
  //                     {subcategoria === "Acessorio"
  //                         ? subcategoria.replace("o", "ó") + "s"
  //                         : subcategoria.replace("a", "á")}
  //                 </Breadcrumb.Item>
  //                 <Breadcrumb.Item
  //                     className="path-prod"
  //                     to={`/produtos/${categoria}/${subcategoria}/${tipo}`}
  //                 >
  //                     {tipo}
  //                 </Breadcrumb.Item>
  //             </Breadcrumb>
  //         ) : (
  //             <Breadcrumb className="path-prod-wrapper">
  //                 {subcategoria === undefined ? (
  //                     <Breadcrumb.Item
  //                         className="path-prod"
  //                         to={`/produtos/${categoria}`}
  //                     >
  //                         {categoria}
  //                     </Breadcrumb.Item>
  //                 ) : (
  //                     <Breadcrumb.Item
  //                         className="path-prod"
  //                         to={`/produtos/${categoria}/${subcategoria}`}
  //                     >
  //                         {subcategoria}
  //                     </Breadcrumb.Item>
  //                 )}
  //             </Breadcrumb>
  //         )}
  //     </div>
  // );
}

export default Breadcrumb
