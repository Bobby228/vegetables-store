import { createContext, useContext, useState } from "react"

type Product = {
  id: number
  name: string
  price: number
  image: string
}

type CartItem = Product & {
  count: number
}

type CartContextType = {
  items: CartItem[]
  addToCart: (product: Product, count: number) => void
  increase: (id: number) => void
  decrease: (id: number) => void
  total: number
}

const CartContext = createContext<CartContextType | null>(null)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])

  function addToCart(product: Product, count: number) {
    setItems(prev => {
      const existing = prev.find(p => p.id === product.id)

      if (existing) {
        return prev.map(p =>
          p.id === product.id
            ? { ...p, count: p.count + count }
            : p
        )
      }

      return [...prev, { ...product, count }]
    })
  }

  function increase(id: number) {
    setItems(prev =>
      prev.map(p =>
        p.id === id ? { ...p, count: p.count + 1 } : p
      )
    )
  }

  function decrease(id: number) {
    setItems(prev =>
      prev
        .map(p =>
          p.id === id ? { ...p, count: p.count - 1 } : p
        )
        .filter(p => p.count > 0)
    )
  }

  const total = items.reduce(
    (acc, item) => acc + item.price * item.count,
    0
  )

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        increase,
        decrease,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside CartProvider")
  return ctx
}