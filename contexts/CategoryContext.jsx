import { createContext, useState } from 'react'

export const CategoryContext = createContext()

export function CategoryContextProvider({ children }) {
  const [getCategory, setCategory] = useState({
    category: '',
    subcategory: '',
    type: ''
  })

  return (
    <CategoryContext.Provider
      value={{
        getCategory,
        setCategory
      }}
    >
      {children}
    </CategoryContext.Provider>
  )
}
