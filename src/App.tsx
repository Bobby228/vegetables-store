import { CartProvider } from "./components/Cart/CartContext"
import Header from "./components/Header/Header.tsx";
import Catalog from "./components/Catalog/Catalog.tsx";
import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';

export default function App() {
  return(
    <MantineProvider>
      <CartProvider>
        <Header />
        <Catalog />
      </CartProvider>
    </MantineProvider>
  )
}