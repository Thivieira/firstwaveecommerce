import { useState, useEffect } from 'react'

export default function BreadCrumb({ category, subcategory, type }) {
  const [links, setLinks] = useState([
    { name: category, href: `/produtos/${category}`, current: true }
  ])

  useEffect(() => {
    if (category && !subcategory && !type) {
      return setLinks([{ name: category, href: `/produtos/${category}`, current: true }])
    } else if (category && subcategory && !type) {
      return setLinks([
        { name: category, href: `/produtos/${category}`, current: false },
        { name: subcategory, href: `/produtos/${category}/${subcategory}`, current: true }
      ])
    } else {
      return setLinks([
        { name: category, href: `/produtos/${category}`, current: false },
        { name: subcategory, href: `/produtos/${category}/${subcategory}`, current: false },
        { name: type, href: `/produtos/${category}/${subcategory}/${type}`, current: true }
      ])
    }
  }, [category, subcategory, type])

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="list-disc list-inside flex items-center space-x-2">
        {category && !subcategory && !type
          ? links !== [] && (
              <div className="flex items-center">
                <a
                  href={links[0].href}
                  className={` text-sm font-medium ${
                    links[0].current
                      ? 'text-[#ff8b00] hover:underline'
                      : 'text-gray-500 hover:underline'
                  }`}
                >
                  {links[0].name}
                </a>
              </div>
            )
          : links.map((link) => (
              <li className="list-none" key={link.name}>
                <div className="flex items-center">
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                  <a
                    href={link.href}
                    className={`text-sm font-medium ${
                      link.current
                        ? 'text-[#0080A8] hover:text-[#FF8B00]'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {link.name}
                  </a>
                </div>
              </li>
            ))}
      </ol>
    </nav>
  )
}
