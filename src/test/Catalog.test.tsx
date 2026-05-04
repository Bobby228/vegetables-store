import { screen } from '@testing-library/react'
import { renderWithMantine } from './test-utils'
import Catalog from '../components/Catalog/Catalog'
import { CartProvider } from '../components/Cart/CartContext'
import ky from 'ky'
import { vi, beforeEach, describe, it, expect } from 'vitest'

vi.mock('ky', () => ({
  default: {
    get: vi.fn(),
  },
}))

function renderCatalog() {
  return renderWithMantine(
    <CartProvider>
      <Catalog />
    </CartProvider>
  )
}

describe('Catalog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('показывает skeleton при загрузке', () => {
    vi.mocked(ky.get).mockReturnValue({
      json: async () => new Promise(() => {}), // вечный loading
    } as any)

    renderCatalog()

    expect(screen.getByText(/catalog/i)).toBeInTheDocument()
  })

  it('рендерит товары после загрузки', async () => {
    vi.mocked(ky.get).mockReturnValue({
      json: async () => [
        { id: 1, name: 'Apple-1kg', price: 10, image: 'img' },
      ],
    } as any)

    renderCatalog()

    expect(await screen.findByText(/Apple/i)).toBeInTheDocument()
  })
})