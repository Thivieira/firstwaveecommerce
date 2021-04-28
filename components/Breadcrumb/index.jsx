import React from "react"
import { Breadcrumb as BreadCrumb } from "antd"
import Link from "next/link";

const Breadcrumb = ({ categoria, subcategoria, tipo }) => {
    function itemRender(route, params, routes, paths) {
        const last = routes.indexOf(route) === routes.length - 1;
        return last ? (
            <span className="path-prod">{route.breadcrumbName}</span>
        ) : (
            <Link className="path-prod" href={route.path}>
                {route.breadcrumbName}
            </Link>
        );
    }

    const routes =
        tipo !== undefined
            ? [
                  {
                      path: `/produtos/${categoria}`,
                      breadcrumbName: categoria,
                  },
                  {
                      path: `/produtos/${categoria}/${subcategoria}`,
                      breadcrumbName:
                          subcategoria === "Acessorio"
                              ? subcategoria + "s"
                              : subcategoria,
                  },
                  {
                      path: `/produtos/${categoria}/${subcategoria}/${tipo}`,
                      breadcrumbName: tipo,
                  },
              ]
            : [
                  {
                      path:
                          subcategoria === undefined
                              ? `/produtos/${categoria}`
                              : `/produtos/${categoria}/${subcategoria}`,
                      breadcrumbName:
                          subcategoria === undefined ? categoria : subcategoria,
                  },
              ];

    return (
        <BreadCrumb
            itemRender={itemRender}
            routes={routes}
            className="path-prod-wrapper"
        />
    );

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
};

export default Breadcrumb;
